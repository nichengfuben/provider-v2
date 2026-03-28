"""Cerebras 平台适配器"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = [
    "gpt-oss-120b",
    "llama-3.3-70b",
    "llama-4-maverick-17b-128e-instruct",
    "llama-4-scout-17b-16e-instruct",
    "llama3.1-8b",
    "qwen-3-235b-a22b-instruct-2507",
    "qwen-3-235b-a22b-thinking-2507",
    "qwen-3-32b",
    "qwen-3-coder-480b",
]

CAPS = {"chat": True, "tools": True}


class CerebrasAdapter(PlatformAdapter):
    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "cerebras"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.cerebras.client import CerebrasClient

        self._client = CerebrasClient()
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
