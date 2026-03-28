"""UnlimitedAI 平台适配器

UnlimitedAI (app.unlimitedai.chat) 是一个无限制的AI聊天服务。
支持NSFW内容，无需登录。

API 端点: https://app.unlimitedai.chat/api/chat
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
    "chat-model-reasoning",           # 标准模型
    "chat-model-reasoning-with-search",  # 高级模型
]

# 默认模型
DEFAULT_MODEL = "chat-model-reasoning"

# 平台能力
CAPS = {
    "chat": True,
    "stream": True,
    "tools": False,
    "unrestricted": True,
}


class UnlimitedAIAdapter(PlatformAdapter):
    """UnlimitedAI 平台适配器

    提供无限制的AI聊天服务，支持各类内容创作。
    无需 API Key，免费使用。

    特色功能:
    - 无内容限制
    - 支持创意写作
    - 支持角色扮演
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "unlimitedai"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.unlimitedai.client import UnlimitedAIClient

        self._client = UnlimitedAIClient()
        await self._client.init(session)
        logger.info("UnlimitedAI 适配器初始化完成")

    async def candidates(self) -> List[Candidate]:
        """返回可用候选项（单个候选项）"""
        return await self._client.candidates() if self._client else []

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量"""
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
        """聊天补全

        Args:
            candidate: 候选项
            messages: 消息列表
            model: 模型名称
            stream: 是否流式输出
            thinking: 是否返回思考过程
            search: 是否启用网页搜索

        Yields:
            str: 文本片段
            dict: 元数据
        """
        if not self._client:
            raise RuntimeError("UnlimitedAI 客户端未初始化")

        async for event in self._client.chat(
            messages=messages,
            model=model or DEFAULT_MODEL,
        ):
            event_type = event.get("type", "")

            if event_type == "delta":
                delta = event.get("delta", "")
                if delta:
                    yield delta

        logger.info("UnlimitedAI 聊天完成: 模型 %s", model)

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
