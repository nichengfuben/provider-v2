"""通义千问平台适配器

阿里云通义千问 (qianwen.com)

API 端点: https://chat2-api.qianwen.com/api/v2/chat
支持模型: Qwen3.5-Plus, Qwen3-Max, Qwen3-Coder 等
能力: chat, vision, code
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = [
    "Qwen",
    "Qwen3.5-Plus",
    "Qwen3.5-Flash",
    "Qwen3-Max",
    "Qwen3-Max-Thinking-Preview",
    "Qwen3-Coder",
]

CAPS = {
    "chat": True,
    "vision": True,
    "thinking": True,
}


class QianwenAdapter(PlatformAdapter):
    """通义千问平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "qianwen"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.qianwen.client import QianwenClient
        self._client = QianwenClient()
        await self._client.init(session)
        logger.info("通义千问适配器初始化完成")

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
        if not self._client:
            raise RuntimeError("通义千问客户端未初始化")

        async for chunk in self._client.complete(
            candidate, messages, model, stream, thinking=thinking, search=search, **kw
        ):
            yield chunk

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None
