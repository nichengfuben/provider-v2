"""caiyuesbk 平台适配器"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 从 API 返回的模型列表
MODELS = [
    "Qwen3-32B-siliconflow",
    "glm-4.6-siliconflow",
    "qwen3-80b",
    "kimi-k2",
    "kimi-k2-thinking",
    "deepseek-v3.1-terminus",
    "deepseek-v3.1",
    "deepseek-v3.2-siliconflow",
    "glm4.7",
    "kimi-k2-instruct-0905",
    "qwen3.5-122b",
    "gpt-oss-120b",
    "glm-4.6V-siliconflow",
    "kimi-k2-siliconflow",
]

# 能力配置
CAPS = {
    "chat": True,
    "tools": True,
    "thinking": True,  # kimi-k2-thinking 支持思考
    "vision": True,  # glm-4.6V-siliconflow 支持视觉
}


class CaiyuesbkAdapter(PlatformAdapter):
    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "caiyuesbk"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.caiyuesbk.client import CaiyuesbkClient

        self._client = CaiyuesbkClient()
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
