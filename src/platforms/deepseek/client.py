# src/platforms/deepseek/client.py
"""DeepSeek客户端"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.deepseek.accounts import ACCOUNTS, Account
from src.platforms.deepseek.util import (
    DEFAULT_HOST,
    MAX_CONTINUE,
    build_headers,
    get_pow_response,
    download_wasm,
    make_stream_id,
    WasmPow,
    StreamParser,
)

logger = logging.getLogger(__name__)
MAX_RETRIES: int = 3


class DeepseekClient:
    """DeepSeek HTTP客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._pow: WasmPow = WasmPow()
        self._models: List[str] = []
        self._candidates: List[Candidate] = []

    async def init_immediate(self, session: aiohttp.ClientSession) -> None:
        """立即初始化，不阻塞。"""
        self._session = session
        self._rebuild_candidates()
        logger.info("deepseek客户端初始化完成（等待后台登录）")

    async def background_setup(self) -> None:
        """后台完善：下载WASM并并发登录所有账号。"""
        asyncio.ensure_future(download_wasm(self._session))
        asyncio.ensure_future(self._bg_wasm_check())

        tasks = [
            asyncio.ensure_future(self._login(account))
            for account in ACCOUNTS
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for account, result in zip(ACCOUNTS, results):
            if isinstance(result, Exception):
                logger.error("deepseek登录失败 %s: %s", account.username, result)

    async def _bg_wasm_check(self) -> None:
        """后台定期更新WASM。"""
        while True:
            await asyncio.sleep(86400)
            try:
                await download_wasm(self._session)
                self._pow = WasmPow()
            except Exception as e:
                logger.warning("WASM更新失败: %s", e)

    async def _login(self, account: Account) -> None:
        """登录单个账号并更新token。"""
        is_email = "@" in account.username
        data = {
            "email": account.username if is_email else "",
            "mobile": "" if is_email else account.username,
            "password": account.password,
            "area_code": "" if is_email else "+86",
            "device_id": _make_device_id(),
            "os": "web",
        }
        headers = build_headers("")
        async with self._session.post(
            "https://{}/api/v0/users/login".format(DEFAULT_HOST),
            headers=headers,
            json=data,
            timeout=aiohttp.ClientTimeout(total=30),
            ssl=False,
        ) as resp:
            if resp.status != 200:
                raise Exception("HTTP{}".format(resp.status))
            result = await resp.json()
            if result.get("code") != 0:
                raise Exception(str(result))
            user = result["data"]["biz_data"]["user"]
            account.token = user["token"]
            account.user_id = user.get("id", "")
        logger.info("deepseek登录成功: %s", account.username)
        self._rebuild_candidates()

    def update_models(self, models: List[str]) -> None:
        """更新模型列表，同步刷新所有候选项的models字段。"""
        self._models = list(models)
        for cand in self._candidates:
            cand.models = list(models)

    def _rebuild_candidates(self) -> None:
        """根据当前账号状态重建候选项列表。"""
        from src.platforms.deepseek.adapter import CAPS

        self._candidates = [
            Candidate(
                id=make_id("deepseek"),
                platform="deepseek",
                resource_id=account.username[:12],
                models=self._models,
                context_length=account.context_length,
                meta={
                    "identifier": account.username,
                    "token": account.token,
                    "user_id": account.user_id,
                },
                **CAPS,
            )
            for account in ACCOUNTS
            if account.token
        ]

    async def candidates(self) -> List[Candidate]:
        """返回当前候选项列表。"""
        return list(self._candidates)

    async def ensure_candidates(self, count: int) -> int:
        """返回可用候选项数量。"""
        return len(self._candidates)

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict],
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
                async for chunk in self._do_complete(
                    candidate, messages, model, stream,
                    thinking=thinking, search=search,
                ):
                    yield chunk
                return
            except Exception as e:
                last_exc = e
                logger.warning("deepseek重试 %d/%d: %s", attempt + 1, MAX_RETRIES, e)
        if last_exc:
            raise last_exc

    async def _do_complete(
        self,
        candidate: Candidate,
        messages: List[Dict],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """执行单次完整会话请求。"""
        token = candidate.meta.get("token", "")

        # 创建会话
        headers = build_headers(token)
        async with self._session.post(
            "https://{}/api/v0/chat_session/create".format(DEFAULT_HOST),
            headers=headers,
            json={},
            timeout=aiohttp.ClientTimeout(total=30),
            ssl=False,
        ) as resp:
            if resp.status != 200:
                raise Exception("会话创建失败HTTP{}".format(resp.status))
            sd = await resp.json()
            session_id = sd["data"]["biz_data"]["id"]

        prompt = _build_prompt(messages)

        pow_resp = (
            await get_pow_response(self._session, token, self._pow)
            if self._pow.available
            else ""
        )

        parser = StreamParser(include_thinking=thinking)
        req_headers = build_headers(token, session_id)
        if pow_resp:
            req_headers["x-ds-pow-response"] = pow_resp

        payload = {
            "chat_session_id": session_id,
            "parent_message_id": None,
            "prompt": prompt,
            "ref_file_ids": [],
            "thinking_enabled": thinking,
            "search_enabled": search,
            "client_stream_id": make_stream_id(),
        }

        continue_count = 0
        async with self._session.post(
            "https://{}/api/v0/chat/completion".format(DEFAULT_HOST),
            headers=req_headers,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=600),
            ssl=False,
        ) as resp:
            if resp.status != 200:
                raise Exception("聊天失败HTTP{}".format(resp.status))
            needs_continue = False
            async for chunk in self._parse_stream(resp, parser):
                if chunk.get("needs_continue"):
                    needs_continue = True
                elif chunk.get("type") not in ("event", "status"):
                    translated = _translate(chunk)
                    if translated is not None:
                        yield translated

        while needs_continue and continue_count < MAX_CONTINUE:
            continue_count += 1
            mid = parser.message_id
            if mid is None:
                break
            await asyncio.sleep(0.1)
            ch = build_headers(token, session_id)
            cp = {
                "chat_session_id": session_id,
                "message_id": mid,
                "fallback_to_resume": True,
            }
            async with self._session.post(
                "https://{}/api/v0/chat/continue".format(DEFAULT_HOST),
                headers=ch,
                json=cp,
                timeout=aiohttp.ClientTimeout(total=600),
                ssl=False,
            ) as cr:
                if cr.status != 200:
                    break
                needs_continue = False
                async for chunk in self._parse_stream(cr, parser):
                    if chunk.get("needs_continue"):
                        needs_continue = True
                    elif chunk.get("type") not in ("event", "status"):
                        translated = _translate(chunk)
                        if translated is not None:
                            yield translated

    async def _parse_stream(
        self,
        resp: Any,
        parser: StreamParser,
    ) -> AsyncGenerator[Dict, None]:
        """解析流式响应。"""
        buf = ""
        async for chunk in resp.content.iter_chunked(1024):
            if chunk:
                buf += chunk.decode("utf-8", errors="ignore")
                lines = buf.split("\n")
                buf = lines[-1]
                for line in lines[:-1]:
                    if line.strip():
                        r = parser.parse_line(line)
                        if r:
                            yield r
        if buf.strip():
            r = parser.parse_line(buf)
            if r:
                yield r

    async def close(self) -> None:
        """清理资源。"""
        return


def _make_device_id() -> str:
    """生成设备ID。"""
    import base64
    import secrets

    return base64.b64encode(secrets.token_bytes(32)).decode()


def _build_prompt(messages: List[Dict]) -> str:
    """将消息列表转为DeepSeek格式的提示文本。"""
    parts = []
    for m in messages:
        role = m.get("role", "user")
        c = m.get("content", "")
        if isinstance(c, list):
            c = "\n".join(
                p.get("text", "")
                for p in c
                if isinstance(p, dict) and p.get("type") == "text"
            )
        if role == "system":
            parts.append("系统指令: {}".format(c))
        elif role == "user":
            parts.append("用户: {}".format(c))
        elif role == "assistant":
            parts.append("助手: {}".format(c))
        elif role == "tool":
            parts.append("工具结果: {}".format(c))
    return "\n\n".join(parts)


def _translate(chunk: Dict) -> Optional[Union[str, Dict]]:
    """将内部chunk转换为yield协议格式。"""
    t = chunk.get("type")
    if t == "content":
        content = chunk.get("content", "")
        return content if content else None
    if t == "thinking":
        content = chunk.get("content", "")
        return {"thinking": content} if content else None
    return None
