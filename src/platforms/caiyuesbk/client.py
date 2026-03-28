"""caiyuesbk 客户端——使用 fncall 注入协议（与 cerebras 一致）"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.caiyuesbk.accounts import API_KEYS

logger = logging.getLogger(__name__)

BASE_URL = "https://caiyuesbk.top:16188"


class CaiyuesbkClient:
    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        logger.info("caiyuesbk 初始化: %d keys", len(API_KEYS))

    async def candidates(self) -> List[Candidate]:
        from src.platforms.caiyuesbk.adapter import CAPS, MODELS

        candidates: List[Candidate] = []
        for i, key in enumerate(API_KEYS):
            available = await self._test_key(key)
            candidates.append(
                Candidate(
                    id=make_id("caiyuesbk"),
                    platform="caiyuesbk",
                    resource_id=key[:12],
                    models=MODELS,
                    available=available,
                    meta={"api_key": key},
                    **CAPS,
                )
            )
        return candidates

    async def _test_key(self, api_key: str) -> bool:
        """测试 API key 是否有效"""
        if not self._session:
            return False
        try:
            async with self._session.get(
                f"{BASE_URL}/v1/models",
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                return resp.status == 200
        except Exception as e:
            logger.debug("caiyuesbk key 测试失败 %s: %s", api_key[:8], e)
        return False

    async def ensure_candidates(self, count: int) -> int:
        return len(API_KEYS)

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
        """注意：不传递 tools 参数，tools 由 gateway 层通过 fncall 注入处理"""
        api_key = candidate.meta["api_key"]
        if not self._session:
            raise RuntimeError("Client not initialized")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": stream,
        }

        # 可选参数
        if kw.get("temperature") is not None:
            payload["temperature"] = kw["temperature"]
        if kw.get("top_p") is not None:
            payload["top_p"] = kw["top_p"]
        if kw.get("max_tokens") is not None:
            payload["max_tokens"] = kw["max_tokens"]
        if kw.get("stop") is not None:
            payload["stop"] = kw["stop"]

        if not stream:
            try:
                async with self._session.post(
                    f"{BASE_URL}/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=120),
                ) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        logger.error(
                            "caiyuesbk 请求失败 %s: %d %s",
                            api_key[:8],
                            resp.status,
                            error_text[:200],
                        )
                        raise Exception(f"HTTP {resp.status}: {error_text[:100]}")

                    data = await resp.json()
                    if data.get("choices"):
                        choice = data["choices"][0]
                        msg = choice.get("message", {})
                        content = msg.get("content", "")
                        if content:
                            yield content

                        if data.get("usage"):
                            yield {"usage": data["usage"]}
            except asyncio.TimeoutError:
                logger.error("caiyuesbk 请求超时 %s", api_key[:8])
                raise
            except Exception as e:
                logger.error("caiyuesbk 请求失败 %s: %s", api_key[:8], e)
                raise
        else:
            # 流式响应
            try:
                async with self._session.post(
                    f"{BASE_URL}/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=120),
                ) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        logger.error(
                            "caiyuesbk 流式请求失败 %s: %d %s",
                            api_key[:8],
                            resp.status,
                            error_text[:200],
                        )
                        raise Exception(f"HTTP {resp.status}: {error_text[:100]}")

                    async for line in resp.content:
                        if not line:
                            continue
                        line_str = line.decode("utf-8").strip()
                        if not line_str:
                            continue
                        if line_str.startswith("data: "):
                            data_str = line_str[6:]
                            if data_str == "[DONE]":
                                break
                            try:
                                chunk = json.loads(data_str)
                                if chunk.get("choices"):
                                    delta = chunk["choices"][0].get("delta", {})
                                    if delta.get("content"):
                                        yield delta["content"]
                                if chunk.get("usage"):
                                    yield {"usage": chunk["usage"]}
                            except json.JSONDecodeError:
                                continue
            except asyncio.TimeoutError:
                logger.error("caiyuesbk 流式请求超时 %s", api_key[:8])
                raise
            except Exception as e:
                logger.error("caiyuesbk 流式请求失败 %s: %s", api_key[:8], e)
                raise

    async def close(self) -> None:
        pass
