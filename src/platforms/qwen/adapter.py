"""Qwen 平台适配器"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = [
    "qvq-72b-preview-0310",
    "qwq-32b",
    "qwen-plus-2025-01-25",
    "qwen-plus-2025-07-28",
    "qwen-plus-2025-09-11",
    "qwen-turbo-2025-02-11",
    "qwen-max-latest",
    "qwen2.5-72b-instruct",
    "qwen2.5-coder-32b-instruct",
    "qwen2.5-omni-7b",
    "qwen2.5-vl-32b-instruct",
    "qwen3-235b-a22b",
    "qwen3-30b-a3b",
    "qwen3-coder-30b-a3b-instruct",
    "qwen3-coder-plus",
    "qwen3-max",
    "qwen3-max-2026-01-23",
    "qwen3-omni-flash",
    "qwen3-omni-flash-2025-12-01",
    "qwen3-vl-30b-a3b",
    "qwen3-vl-32b",
    "qwen3-vl-plus",
    "qwen3.5-122b-a10b",
    "qwen3.5-27b",
    "qwen3.5-35b-a3b",
    "qwen3.5-397b-a17b",
    "qwen3.5-flash",
    "qwen3.5-plus",
]

CAPS = {
    "chat": True,
    "vision": True,
    "image_gen": True,
    "video_gen": True,
    "audio_gen": True,
    "audio_in": True,
    "embedding": True,
    "research": True,
    "thinking": True,
    "search": True,
    "artifacts": True,
    "tools": True,
    "upload": True,
}


class QwenAdapter(PlatformAdapter):
    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "qwen"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.qwen.client import QwenClient

        self._client = QwenClient()
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

    async def close(self) -> None:
        if self._client:
            await self._client.close()
