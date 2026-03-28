"""ChatGLM 平台适配器

智谱清言 (chatglm.cn) - GLM 大语言模型

API 端点: https://chatglm.cn/chatglm/backend-api/assistant/stream
支持模型: GLM-4, GLM-4-Plus, GLM-4-Air, GLM-4-Flash
能力: chat, vision, thinking
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的模型
MODELS = [
    "GLM-4",
    "GLM-4-Plus",
    "GLM-4-Air",
    "GLM-4-Flash",
    "GLM-4-Long",
]

# 平台能力
CAPS = {
    "chat": True,
    "vision": True,
    "thinking": True,
}


class ChatGLMAdapter(PlatformAdapter):
    """ChatGLM 平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "chatglm"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.chatglm.client import ChatGLMClient

        self._client = ChatGLMClient()
        await self._client.init(session)
        logger.info("ChatGLM 适配器初始化完成")

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
            raise RuntimeError("ChatGLM 客户端未初始化")

        async for chunk in self._client.complete(
            candidate=candidate,
            messages=messages,
            model=model,
            stream=stream,
            thinking=thinking,
            search=search,
            **kw,
        ):
            yield chunk

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None
