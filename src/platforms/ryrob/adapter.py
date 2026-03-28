"""RyRob AI 平台适配器

RyRob (api.ryrob.com) 是一个多模型AI服务平台。
支持多种主流模型，包括GPT-5、Gemini、Qwen等。

API 端点: https://api.ryrob.com/api/
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 默认模型
DEFAULT_MODEL = "xai/grok-4.1-fast-reasoning"

# 平台能力
CAPS = {
    "chat": True,
    "stream": True,
    "tools": False,
}


class RyRobAdapter(PlatformAdapter):
    """RyRob AI 平台适配器

    提供多模型AI聊天服务。
    无需 API Key，免费使用。

    支持模型:
    - xai/grok-4.1-fast-reasoning
    - openai/gpt-5-mini
    - google/gemini-3-flash
    - alibaba/qwen-3-32b
    - 等多种主流模型
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "ryrob"

    @property
    def supported_models(self) -> List[str]:
        """返回支持的模型列表"""
        if self._client and self._client._models:
            return [m.get("value", "") for m in self._client._models if m.get("value")]
        return [DEFAULT_MODEL]

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.ryrob.client import RyRobClient

        self._client = RyRobClient()
        await self._client.init(session)
        logger.info("RyRob 适配器初始化完成")

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
            raise RuntimeError("RyRob 客户端未初始化")

        async for text in self._client.chat(
            messages=messages,
            model=model or DEFAULT_MODEL,
        ):
            yield text

        logger.info("RyRob 聊天完成: 模型 %s", model)

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
