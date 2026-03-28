"""OpenRouter 客户端——每个 API Key 一个候选项"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.core.errors import EmbeddingError, PlatformError
from src.platforms.openrouter.accounts import (
    ACCOUNTS,
    AVAILABLE_MODELS,
    RATE_LIMIT_COOLDOWN,
    RECOVERY_INTERVAL,
)

logger = logging.getLogger(__name__)

BASE_URL = "https://openrouter.ai/api/v1"
CHAT_URL = f"{BASE_URL}/chat/completions"
EMBED_URL = f"{BASE_URL}/embeddings"
DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "HTTP-Referer": "https://provider-v2.local",
    "X-Title": "Provider-V2",
}


class _KeyState:
    """单个 API Key 的运行时状态"""

    __slots__ = (
        "key", "valid", "busy", "error_count",
        "consecutive_failures", "last_error_time",
        "rate_limit_until",
    )

    def __init__(self, key: str) -> None:
        self.key: str = key
        self.valid: bool = True
        self.busy: bool = False
        self.error_count: int = 0
        self.consecutive_failures: int = 0
        self.last_error_time: float = 0.0
        self.rate_limit_until: float = 0.0

    @property
    def available(self) -> bool:
        """判断是否可用"""
        if not self.valid:
            # 检查是否已过恢复期
            if time.time() - self.last_error_time >= RECOVERY_INTERVAL:
                self.valid = True
                self.error_count = 0
                self.consecutive_failures = 0
            else:
                return False
        if self.busy:
            return False
        if self.rate_limit_until > time.time():
            return False
        if self.consecutive_failures >= 3:
            if time.time() - self.last_error_time < RATE_LIMIT_COOLDOWN:
                return False
            self.consecutive_failures = 0
        return True

    def mark_success(self) -> None:
        """标记请求成功"""
        self.busy = False
        self.consecutive_failures = 0

    def mark_failure(self, status: int = 0) -> None:
        """根据 HTTP 状态码分类处理失败"""
        self.busy = False
        self.last_error_time = time.time()
        # 认证 / 付费问题：标记无效
        if status in (401, 402, 403):
            self.valid = False
            logger.warning("OpenRouter Key 无效 (HTTP %d): %s...", status, self.key[:20])
        # 速率限制
        elif status == 429:
            self.rate_limit_until = time.time() + RATE_LIMIT_COOLDOWN
            logger.warning("OpenRouter Key 限速: %s...", self.key[:20])
        # 服务器错误
        elif status in (500, 502, 503, 504):
            self.consecutive_failures += 1
            self.error_count += 1
        # 请求错误 (400/404/422) 不影响 Key 状态
        elif status in (400, 404, 422):
            pass
        else:
            self.consecutive_failures += 1
            self.error_count += 1


class OpenRouterClient:
    """OpenRouter HTTP 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._keys: List[_KeyState] = []
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端"""
        self._session = session
        self._keys = [_KeyState(k) for k in ACCOUNTS if k and k.strip()]
        logger.info("OpenRouter: %d 个 API Key, %d 个模型", len(self._keys), len(AVAILABLE_MODELS))

    def get_available_models(self) -> List[str]:
        """返回可用模型列表"""
        return list(AVAILABLE_MODELS)

    async def candidates(self) -> List[Candidate]:
        """每个可用 Key 生成一个候选项"""
        out: List[Candidate] = []
        async with self._lock:
            for ks in self._keys:
                if not ks.available:
                    continue
                out.append(
                    Candidate(
                        id=make_id("openrouter"),
                        platform="openrouter",
                        resource_id=ks.key[:20],
                        models=list(AVAILABLE_MODELS),
                        meta={"api_key": ks.key},
                        chat=True,
                        vision=True,
                        tools=True,
                        thinking=True,
                        search=True,
                        embedding=True,
                        available=True,
                        busy=ks.busy,
                    )
                )
        return out

    async def ensure_candidates(self, count: int) -> int:
        """返回可用 Key 数量"""
        async with self._lock:
            return sum(1 for ks in self._keys if ks.available)

    def _find_key(self, candidate: Candidate) -> Optional[_KeyState]:
        """根据候选项找到对应的 KeyState"""
        api_key = candidate.meta.get("api_key", "")
        for ks in self._keys:
            if ks.key == api_key:
                return ks
        return None

    # -----------------------------------------------------------------
    # Chat Completion
    # -----------------------------------------------------------------

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
        """调用 OpenRouter chat completions 端点"""
        ks = self._find_key(candidate)
        if not ks:
            raise PlatformError("OpenRouter: 未找到对应 API Key")

        headers = {**DEFAULT_HEADERS, "Authorization": f"Bearer {ks.key}"}

        payload: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": stream,
        }
        if kw.get("temperature") is not None:
            payload["temperature"] = kw["temperature"]
        if kw.get("top_p") is not None:
            payload["top_p"] = kw["top_p"]
        if kw.get("max_tokens") is not None:
            payload["max_tokens"] = kw["max_tokens"]
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
                        f"OpenRouter HTTP {resp.status}: {body[:200]}"
                    )

                if not stream:
                    data = await resp.json()
                    async with self._lock:
                        ks.mark_success()
                    choice = (data.get("choices") or [{}])[0]
                    msg = choice.get("message", {})
                    content = msg.get("content", "")
                    if content:
                        yield content
                    # 工具调用
                    tc = msg.get("tool_calls")
                    if tc:
                        yield {"tool_calls": tc}
                    # usage
                    usage = data.get("usage")
                    if usage:
                        yield {"usage": {
                            "prompt_tokens": usage.get("prompt_tokens", 0),
                            "completion_tokens": usage.get("completion_tokens", 0),
                        }}
                else:
                    async for line in resp.content:
                        line_str = line.decode("utf-8").strip()
                        if not line_str:
                            continue
                        if not line_str.startswith("data: "):
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
                        # 流式工具调用
                        tc = delta.get("tool_calls")
                        if tc:
                            yield {"tool_calls_delta": tc}
                        # reasoning_content（某些模型支持）
                        reasoning = delta.get("reasoning_content")
                        if reasoning:
                            yield {"thinking": reasoning}
                        # usage（最后一个 chunk 可能带）
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
            raise PlatformError(f"OpenRouter 请求失败: {e}") from e

    # -----------------------------------------------------------------
    # Embedding
    # -----------------------------------------------------------------

    async def embed(
        self,
        candidate: Candidate,
        input_data: Union[str, List[str]],
        model: str,
    ) -> Dict[str, Any]:
        """调用 OpenRouter /v1/embeddings 端点"""
        ks = self._find_key(candidate)
        if not ks:
            raise EmbeddingError("OpenRouter: 未找到对应 API Key")

        headers = {**DEFAULT_HEADERS, "Authorization": f"Bearer {ks.key}"}
        payload: Dict[str, Any] = {"model": model, "input": input_data}

        async with self._session.post(
            EMBED_URL,
            headers=headers,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=60),
        ) as resp:
            if resp.status != 200:
                body = await resp.text()
                async with self._lock:
                    ks.mark_failure(resp.status)
                raise EmbeddingError(f"OpenRouter embed HTTP {resp.status}: {body[:200]}")
            data = await resp.json()
            async with self._lock:
                ks.mark_success()

        if "error" in data:
            raise EmbeddingError(str(data["error"]))

        return {
            "object": "list",
            "data": data.get("data", []),
            "model": model,
            "usage": data.get("usage", {}),
        }

    async def close(self) -> None:
        """释放资源"""
        pass
