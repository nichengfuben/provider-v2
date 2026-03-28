"""Ollama 平台适配器——支持 chat、embedding、vision"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate
from src.core.errors import UnsupportedServiceError
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)
CAPS: Dict[str, bool] = {
    "chat": True,
    "embedding": True,
    "vision": True,
    "tools": True,
}


class OllamaAdapter(PlatformAdapter):
    """Ollama 平台适配器

    Ollama 原生支持：
    - chat (POST /api/chat)
    - embedding (POST /api/embed)
    - vision (通过多模态模型 + images 参数)
    - tools (部分模型支持)

    不支持（由基类抛出 UnsupportedServiceError）：
    - TTS / STT / image_gen / video_gen / moderation
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "ollama"

    @property
    def supported_models(self) -> List[str]:
        return self._client.get_available_models() if self._client else []

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return dict(CAPS)

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.ollama.client import OllamaClient

        self._client = OllamaClient()
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
            candidate,
            messages,
            model,
            stream,
            thinking=thinking,
            search=search,
            **kw,
        ):
            yield chunk

    async def embed(
        self,
        candidate: Candidate,
        input_data: Union[str, List[str]],
        model: str,
    ) -> Dict[str, Any]:
        """通过 Ollama /api/embed 端点计算嵌入向量"""
        if not self._client:
            raise UnsupportedServiceError("Ollama 客户端未初始化")
        return await self._client.embed(candidate, input_data, model)

    async def close(self) -> None:
        if self._client:
            await self._client.close()
