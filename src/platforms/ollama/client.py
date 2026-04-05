# src/platforms/ollama/client.py
"""Ollama客户端"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.ollama.accounts import ACCOUNTS
from src.platforms.ollama.util import (
    CHAT_PATH,
    build_chat_payload,
    build_image_messages,
    collect_servers,
    build_registry,
    detect_capabilities,
    load_cache,
    save_cache,
    needs_refresh,
    parse_ollama_line,
)

logger = logging.getLogger(__name__)
MAX_RETRIES: int = 3
BG_REFRESH_INTERVAL: int = 86400


class OllamaClient:
    """Ollama HTTP客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._servers: Dict[str, Any] = {}
        self._registry: Dict[str, Any] = {}

    async def init_immediate(self, session: aiohttp.ClientSession) -> None:
        """立即初始化，不阻塞——从缓存加载。"""
        self._session = session
        # 从缓存快速加载，不进行网络请求
        try:
            self._servers, self._registry = load_cache()
        except Exception as e:
            logger.warning("ollama缓存加载失败: %s", e)
            self._servers, self._registry = {}, {}
        logger.info(
            "ollama客户端初始化完成（缓存: %d服务器, %d模型）",
            len(self._servers),
            len(self._registry),
        )

    async def background_setup(self) -> None:
        """后台完善：执行服务器发现并启动定时刷新。"""
        additional = list(ACCOUNTS)
        force = needs_refresh()
        try:
            loop = asyncio.get_event_loop()
            servers, registry = await loop.run_in_executor(
                None,
                lambda: _do_refresh(force=force, additional=additional),
            )
            self._servers = servers
            self._registry = registry
            logger.info(
                "ollama发现完成: %d服务器, %d模型",
                len(servers),
                len(registry),
            )
        except Exception as e:
            logger.error("ollama服务器发现失败: %s", e)

        asyncio.ensure_future(self._bg_refresh())

    async def _bg_refresh(self) -> None:
        """后台定时刷新服务器列表。"""
        while True:
            await asyncio.sleep(BG_REFRESH_INTERVAL)
            try:
                additional = list(ACCOUNTS)
                loop = asyncio.get_event_loop()
                servers, registry = await loop.run_in_executor(
                    None,
                    lambda: _do_refresh(force=True, additional=additional),
                )
                self._servers = servers
                self._registry = registry
                logger.info("ollama刷新完成: %d服务器", len(servers))
            except Exception as e:
                logger.warning("ollama刷新失败: %s", e)

    def get_available_models(self) -> List[str]:
        """返回当前已发现的所有模型名称。"""
        return list(self._registry.keys())

    def update_models(self, models: List[str]) -> None:
        """更新模型列表（Ollama为动态发现，此方法为规范兼容）。

        Args:
            models: 新的模型列表（通常不使用，以动态发现为准）。
        """
        return

    async def candidates(self) -> List[Candidate]:
        """从已发现的服务器构建候选项列表。"""
        from src.platforms.ollama.adapter import CAPS

        out: List[Candidate] = []
        for ip, srv in self._servers.items():
            models = srv.get("model_names", [])
            if not models:
                continue
            caps: Dict[str, bool] = {"chat": True}
            for m_info in srv.get("models", []):
                for k, v in m_info.get("capabilities", {}).items():
                    if v:
                        caps[k] = True
            out.append(
                Candidate(
                    id=make_id("ollama"),
                    platform="ollama",
                    resource_id=ip,
                    models=models,
                    context_length=None,
                    meta={"ip": ip, "base_url": srv["base_url"]},
                    **caps,
                )
            )
        return out

    async def ensure_candidates(self, count: int) -> int:
        """返回可用候选项数量。"""
        return len(self._servers)

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """执行聊天补全，含重试。"""
        last_exc: Optional[Exception] = None
        for attempt in range(MAX_RETRIES + 1):
            if attempt > 0:
                await asyncio.sleep(1.0 * (2 ** (attempt - 1)))
            try:
                async for chunk in self._do_request(
                    candidate, messages, model, stream, **kw
                ):
                    yield chunk
                return
            except Exception as e:
                last_exc = e
                logger.warning(
                    "ollama重试 %d/%d: %s", attempt + 1, MAX_RETRIES, e
                )
        if last_exc:
            raise last_exc

    async def _do_request(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """执行单次HTTP请求。"""
        base_url = candidate.meta["base_url"]
        url = "{}{}".format(base_url, CHAT_PATH)

        chat_messages = build_image_messages(messages)
        payload = build_chat_payload(chat_messages, model, stream=stream, **kw)

        async with self._session.post(
            url,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=600),
        ) as resp:
            if resp.status != 200:
                body = await resp.text()
                raise Exception("ollama HTTP{}: {}".format(resp.status, body))

            if not stream:
                async for chunk in self._handle_non_stream(resp):
                    yield chunk
            else:
                async for chunk in self._handle_stream(resp):
                    yield chunk

    async def _handle_non_stream(
        self,
        resp: aiohttp.ClientResponse,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """处理非流式响应。"""
        data = await resp.json()
        if "error" in data:
            raise Exception("ollama error: {}".format(data["error"]))
        content = data.get("message", {}).get("content", "")
        if content:
            yield content
        usage = _extract_usage(data)
        if usage:
            yield {"usage": usage}

    async def _handle_stream(
        self,
        resp: aiohttp.ClientResponse,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """处理流式响应。"""
        buf = b""
        async for chunk in resp.content.iter_any():
            if not chunk:
                continue
            buf += chunk
            lines = buf.split(b"\n")
            buf = lines[-1]
            for line in lines[:-1]:
                stripped = line.strip()
                if not stripped:
                    continue
                parsed = parse_ollama_line(stripped)
                if parsed is not None:
                    yield parsed
                    if isinstance(parsed, dict) and "usage" in parsed:
                        return

        if buf.strip():
            parsed = parse_ollama_line(buf.strip())
            if parsed is not None:
                yield parsed

    async def close(self) -> None:
        """清理资源。"""
        return


def _extract_usage(data: Dict[str, Any]) -> Dict[str, int]:
    """从Ollama响应中提取usage信息。"""
    usage: Dict[str, int] = {}
    if "prompt_eval_count" in data:
        usage["prompt_tokens"] = data["prompt_eval_count"]
    if "eval_count" in data:
        usage["completion_tokens"] = data["eval_count"]
    return usage


def _do_refresh(
    force: bool = False,
    additional: Optional[List[str]] = None,
) -> tuple:
    """同步刷新逻辑，供run_in_executor调用。"""
    if not force and not needs_refresh():
        return load_cache()
    servers = collect_servers(additional=additional)
    registry = build_registry(servers)
    save_cache(servers, registry)
    return servers, registry
