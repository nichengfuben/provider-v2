"""OpenRouter 平台适配器"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)


class OpenRouterAdapter(PlatformAdapter):
    """OpenRouter 平台适配器

    支持：chat、vision、tools、thinking、search、embedding
    通过 OpenRouter 聚合层访问多种模型。
    每个 API Key 作为一个独立候选项。
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "openrouter"

    @property
    def supported_models(self) -> List[str]:
        return self._client.get_available_models() if self._client else []

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return {
            "chat": True,
            "vision": True,
            "tools": True,
            "thinking": True,
            "search": True,
        }

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.openrouter.client import OpenRouterClient

        self._client = OpenRouterClient()
        await self._client.init(session)

    async def candidates(self) -> List[Candidate]:
        return await self._client.candidates() if self._client else []

    async def ensure_candidates(self, count: int) -> int:
        return await self._client.ensure_candidates(count) if self._client else 0

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
        async for chunk in self._client.complete(
            candidate, messages, model, stream,
            thinking=thinking, search=search, **kw,
        ):
            yield chunk

    async def embed(
        self,
        candidate: Candidate,
        input_data: Union[str, List[str]],
        model: str,
    ) -> Dict[str, Any]:
        """通过 OpenRouter /v1/embeddings 端点计算嵌入"""
        if not self._client:
            from src.core.errors import UnsupportedServiceError
            raise UnsupportedServiceError("OpenRouter 客户端未初始化")
        return await self._client.embed(candidate, input_data, model)

    async def close(self) -> None:
        if self._client:
            await self._client.close()
