"""AIFreeForever 平台适配器

AIFreeForever (aifreeforever.com) 是一个免费的AI服务集合。
支持图像生成和聊天功能。

API 端点: https://aifreeforever.com/api/
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
MODELS = ["z-image-turbo"]

# 平台能力
CAPS = {
    "chat": False,
    "image": True,
    "stream": False,
    "tools": False,
}


class AIFreeForeverAdapter(PlatformAdapter):
    """AIFreeForever 平台适配器

    提供免费的AI图像生成服务。
    无需 API Key，免费使用。
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "aifreeforever"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.aifreeforever.client import AIFreeForeverClient

        self._client = AIFreeForeverClient()
        await self._client.init(session)
        logger.info("AIFreeForever 适配器初始化完成")

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
        """聊天补全（不支持）"""
        raise NotImplementedError(
            "AIFreeForever 不支持聊天补全，请使用 generate_image 方法"
        )

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        n: int = 1,
        size: str = "512x512",
        response_format: str = "url",
        enhance: bool = False,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            candidate: 候选项
            prompt: 图像描述
            model: 模型名称
            n: 生成数量
            size: 图像尺寸
            response_format: 返回格式
            enhance: 是否增强提示词

        Returns:
            OpenAI 兼容的图像生成响应
        """
        if not self._client:
            raise RuntimeError("AIFreeForever 客户端未初始化")

        # 可选：增强提示词
        if enhance:
            prompt = await self._client.enhance_prompt(prompt)

        # 生成图像
        result = await self._client.generate_image(prompt)

        image_url = result.get("imageUrl", "")
        
        logger.info(
            "AIFreeForever 图像生成完成: URL %s",
            image_url
        )

        # 构建响应
        response = {
            "created": int(time.time()),
            "data": [],
        }

        if response_format == "b64_json" and image_url:
            # 下载图像并转换为base64
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as img_resp:
                    if img_resp.status == 200:
                        img_data = await img_resp.read()
                        response["data"].append({
                            "b64_json": base64.b64encode(img_data).decode("utf-8")
                        })
        else:
            response["data"].append({"url": image_url})

        response["prediction_id"] = result.get("predictionId", "")

        return response

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
