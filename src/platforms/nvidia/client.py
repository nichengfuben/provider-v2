"""Nvidia 客户端——每个 API Key 一个候选项"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.core.errors import PlatformError
from src.platforms.nvidia.accounts import (
    API_KEYS,
    AVAILABLE_MODELS,
    CHAT_URL,
    MAX_TOKENS,
    RECOVERY_INTERVAL,
)

logger = logging.getLogger(__name__)


class _KeyState:
    """单个 API Key 的运行时状态"""

    __slots__ = ("key", "valid", "busy", "consecutive_failures", "last_error_time")

    def __init__(self, key: str) -> None:
        self.key: str = key
        self.valid: bool = True
        self.busy: bool = False
        self.consecutive_failures: int = 0
        self.last_error_time: float = 0.0

    @property
    def available(self) -> bool:
        if not self.valid:
            if time.time() - self.last_error_time >= RECOVERY_INTERVAL:
                self.valid = True
                self.consecutive_failures = 0
            else:
                return False
        if self.busy:
            return False
        if self.consecutive_failures >= 3:
            if time.time() - self.last_error_time < RECOVERY_INTERVAL:
                return False
            self.consecutive_failures = 0
        return True

    def mark_success(self) -> None:
        self.busy = False
        self.consecutive_failures = 0

    def mark_failure(self, status: int = 0) -> None:
        self.busy = False
        self.last_error_time = time.time()
        if status in (401, 402, 403):
            self.valid = False
            logger.warning("Nvidia Key 无效 (HTTP %d): %s...", status, self.key[:16])
        else:
            self.consecutive_failures += 1


class NvidiaClient:
    """Nvidia HTTP 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._keys: List[_KeyState] = []
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        self._keys = [_KeyState(k) for k in API_KEYS if k and k.strip()]
        logger.info(
            "Nvidia: %d 个 API Key, %d 个模型",
            len(self._keys), len(AVAILABLE_MODELS),
        )

    def get_available_models(self) -> List[str]:
        return list(AVAILABLE_MODELS)

    async def candidates(self) -> List[Candidate]:
        out: List[Candidate] = []
        async with self._lock:
            for ks in self._keys:
                if not ks.available:
                    continue
                out.append(
                    Candidate(
                        id=make_id("nvidia"),
                        platform="nvidia",
                        resource_id=ks.key[:16],
                        models=list(AVAILABLE_MODELS),
                        meta={"api_key": ks.key},
                        chat=True,
                        tools=True,
                        available=True,
                        busy=ks.busy,
                    )
                )
        return out

    async def ensure_candidates(self, count: int) -> int:
        async with self._lock:
            return sum(1 for ks in self._keys if ks.available)

    def _find_key(self, candidate: Candidate) -> Optional[_KeyState]:
        api_key = candidate.meta.get("api_key", "")
        for ks in self._keys:
            if ks.key == api_key:
                return ks
        return None

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
        """调用 Nvidia chat completions 端点"""
        ks = self._find_key(candidate)
        if not ks:
            raise PlatformError("Nvidia: 未找到对应 API Key")

        headers = {
            "Authorization": f"Bearer {ks.key}",
            "Content-Type": "application/json",
        }

        payload: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": stream,
            "max_tokens": kw.get("max_tokens", MAX_TOKENS),
        }
        if kw.get("temperature") is not None:
            payload["temperature"] = kw["temperature"]
        if kw.get("top_p") is not None:
            payload["top_p"] = kw["top_p"]
        if kw.get("stop"):
            payload["stop"] = kw["stop"]

        async with self._lock:
            ks.busy = True

        try:
            async with self._session.post(
                CHAT_URL,
                headers=headers,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=600),
            ) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    async with self._lock:
                        ks.mark_failure(resp.status)
                    raise PlatformError(
                        f"Nvidia HTTP {resp.status}: {body[:300]}"
                    )

                if not stream:
                    data = await resp.json()
                    async with self._lock:
                        ks.mark_success()
                    choice = (data.get("choices") or [{}])[0]
                    content = choice.get("message", {}).get("content", "")
                    if content:
                        yield content
                    usage = data.get("usage")
                    if usage:
                        yield {"usage": {
                            "prompt_tokens": usage.get("prompt_tokens", 0),
                            "completion_tokens": usage.get("completion_tokens", 0),
                        }}
                else:
                    async for line in resp.content:
                        line_str = line.decode("utf-8").strip()
                        if not line_str or not line_str.startswith("data: "):
                            continue
                        data_str = line_str[6:]
                        if data_str == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue
                        choice = (chunk.get("choices") or [{}])[0]
                        delta = choice.get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield content
                        reasoning = delta.get("reasoning_content")
                        if reasoning:
                            yield {"thinking": reasoning}
                        usage = chunk.get("usage")
                        if usage:
                            yield {"usage": {
                                "prompt_tokens": usage.get("prompt_tokens", 0),
                                "completion_tokens": usage.get("completion_tokens", 0),
                            }}
                    async with self._lock:
                        ks.mark_success()
        except PlatformError:
            raise
        except Exception as e:
            async with self._lock:
                ks.mark_failure(0)
            raise PlatformError(f"Nvidia 请求失败: {e}") from e

    async def close(self) -> None:
        pass
