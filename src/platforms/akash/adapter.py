"""Akash Network 平台适配器

Akash Network (chat.akash.network) 是一个去中心化的AI聊天平台，
提供多种开源模型如 DeepSeek-V3.2, Qwen3, Llama 3.3 等。
"""

from __future__ import annotations

import base64
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的模型
MODELS = [
    "DeepSeek-V3.2",
    "Qwen/Qwen3-30B-A3B",
    "Meta-Llama-3-3-70B-Instruct",
    "AkashGen",
]

# 平台能力
CAPS = {
    "chat": True,
    "image_gen": True,
}


class AkashAdapter(PlatformAdapter):
    """Akash Network 平台适配器

    提供免费的AI聊天和图像生成服务。
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "akash"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.akash.client import AkashClient

        self._client = AkashClient()
        await self._client.init(session)
        logger.info("Akash 适配器初始化完成")

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
        """聊天补全"""
        if not self._client:
            raise RuntimeError("Akash 客户端未初始化")

        # AkashGen 是图像生成模型，不支持聊天
        if model == "AkashGen":
            raise NotImplementedError(
                "AkashGen 是图像生成模型，请使用 generate_image 方法"
            )

        accumulated_text = ""
        usage_data = {}

        async for event in self._client.chat(
            messages=messages,
            model=model,
            **kw,
        ):
            event_type = event.get("type", "")

            if event_type == "text-delta":
                delta = event.get("delta", "")
                if delta:
                    accumulated_text += delta
                    if stream:
                        yield delta

            elif event_type == "finish":
                usage_data = event.get("data", {})

            elif event_type == "done":
                # 完成事件
                pass

        # 非流式返回完整响应
        if not stream:
            yield {
                "content": accumulated_text,
                "usage": usage_data.get("usage", {}),
            }

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        n: int = 1,
        size: str = "1024x1024",
        response_format: str = "url",
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        注意：AkashGen 的具体API实现需要进一步研究。
        目前返回一个占位响应。
        """
        if not self._client:
            raise RuntimeError("Akash 客户端未初始化")

        # AkashGen 目前需要进一步研究其API
        raise NotImplementedError(
            "AkashGen 图像生成功能需要进一步研究API接口。"
            "请使用其他已支持的图像生成平台。"
        )

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None
