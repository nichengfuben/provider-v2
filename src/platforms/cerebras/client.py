"""Cerebras 客户端——同步 SDK 通过 run_in_executor 桥接"""

from __future__ import annotations

import asyncio
import logging
import os
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

from src.core.candidate import Candidate, make_id
from src.platforms.cerebras.accounts import API_KEYS

logger = logging.getLogger(__name__)
_SENTINEL = object()


class CerebrasClient:
    def __init__(self) -> None:
        self._exec: Optional[ThreadPoolExecutor] = None

    async def init(self, session: Any) -> None:
        self._exec = ThreadPoolExecutor(
            max_workers=len(API_KEYS), thread_name_prefix="cerebras"
        )
        os.environ.setdefault("SSL_CERT_FILE", "")
        os.environ.setdefault("CURL_CA_BUNDLE", "")
        logger.info("Cerebras 初始化: %d keys", len(API_KEYS))

    def _make_client(self, api_key: str) -> Any:
        from cerebras.cloud.sdk import Cerebras

        return Cerebras(api_key=api_key)

    async def candidates(self) -> List[Candidate]:
        from src.platforms.cerebras.adapter import CAPS, MODELS

        return [
            Candidate(
                id=make_id("cerebras"),
                platform="cerebras",
                resource_id=k[:12],
                models=MODELS,
                meta={"api_key": k},
                **CAPS,
            )
            for k in API_KEYS
        ]

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
        api_key = candidate.meta["api_key"]
        loop = asyncio.get_running_loop()
        
        params: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": kw.get("temperature", 0.7),
            "top_p": kw.get("top_p", 0.8),
            "stream": stream,
        }
        if kw.get("max_tokens") is not None:
            params["max_completion_tokens"] = kw["max_tokens"]
        for k in ("frequency_penalty", "presence_penalty", "stop", "user"):
            if k in kw:
                params[k] = kw[k]

        if not stream:
            try:
                resp = await loop.run_in_executor(
                    self._exec, lambda: self._call_sync(api_key, params)
                )
            except Exception as e:
                logger.error("Cerebras 非流式失败 %s: %s", api_key[:8], e)
                raise
            content = ""
            if resp.choices:
                content = resp.choices[0].message.content or ""
            if content:
                yield content
            if hasattr(resp, "usage") and resp.usage:
                yield {
                    "usage": {
                        "prompt_tokens": getattr(resp.usage, "prompt_tokens", 0),
                        "completion_tokens": getattr(
                            resp.usage, "completion_tokens", 0
                        ),
                        "total_tokens": getattr(resp.usage, "total_tokens", 0),
                    }
                }
        else:
            queue: asyncio.Queue = asyncio.Queue()

            def _consume():
                try:
                    client = self._make_client(api_key)
                    resp = client.chat.completions.create(**params)
                    for chunk in resp:
                        loop.call_soon_threadsafe(queue.put_nowait, chunk)
                except Exception as e:
                    loop.call_soon_threadsafe(queue.put_nowait, e)
                finally:
                    loop.call_soon_threadsafe(queue.put_nowait, _SENTINEL)

            self._exec.submit(_consume)
            while True:
                item = await queue.get()
                if item is _SENTINEL:
                    break
                if isinstance(item, Exception):
                    logger.error("Cerebras 流式失败 %s: %s", api_key[:8], item)
                    raise item
                if (
                    item.choices
                    and item.choices[0].delta
                    and item.choices[0].delta.content
                ):
                    yield item.choices[0].delta.content

    def _call_sync(self, api_key: str, params: Dict) -> Any:
        client = self._make_client(api_key)
        return client.chat.completions.create(**params)

    async def close(self) -> None:
        if self._exec:
            self._exec.shutdown(wait=False)
