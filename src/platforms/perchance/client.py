"""Perchance API 客户端

实现与 Perchance 图像生成 API 的通信。

API 端点: https://image-generation.perchance.org/api/

使用方式:
1. 生成图像: POST /api/generate
2. 等待生成: POST /api/awaitExistingGenerationRequest
3. 下载图像: POST /api/downloadTemporaryImage
"""

from __future__ import annotations

import asyncio
import logging
import urllib.parse
from typing import Any, Dict, Optional

import aiohttp

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://image-generation.perchance.org"
API_GENERATE = "/api/generate"
API_AWAIT = "/api/awaitExistingGenerationRequest"
API_DOWNLOAD = "/api/downloadTemporaryImage"

# 默认配置
DEFAULT_WIDTH = 512
DEFAULT_HEIGHT = 768
DEFAULT_GUIDANCE_SCALE = 7
DEFAULT_SEED = None  # None 表示随机


class PerchanceClient:
    """Perchance API 客户端

    封装与 Perchance 图像生成 API 的所有交互。
    免费使用，无需 API Key。

    使用前请确保:
    - 网络可以访问 perchance.org
    """

    def __init__(self) -> None:
        """初始化客户端"""
        self._session: Optional[aiohttp.ClientSession] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session
        logger.info("Perchance 客户端初始化完成")

    async def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "",
        width: int = DEFAULT_WIDTH,
        height: int = DEFAULT_HEIGHT,
        guidance_scale: float = DEFAULT_GUIDANCE_SCALE,
        seed: Optional[int] = DEFAULT_SEED,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            prompt: 正向提示词
            negative_prompt: 负向提示词
            width: 图像宽度
            height: 图像高度
            guidance_scale: 引导强度
            seed: 随机种子（None 表示随机）

        Returns:
            Dict: 生成结果
            {
                "status": "success",
                "imageId": "...",
                "fileExtension": "jpeg",
                "seed": 123456,
                "prompt": "...",
                "width": 512,
                "height": 768,
                "imageUrl": "https://...",
            }

        Raises:
            RuntimeError: 生成失败
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        if not prompt.strip():
            raise ValueError("提示词不能为空")

        url = f"{API_BASE_URL}{API_GENERATE}"

        # 构建请求体
        data = {
            "prompt": prompt,
            "negativePrompt": negative_prompt,
            "width": width,
            "height": height,
            "guidanceScale": guidance_scale,
        }

        if seed is not None:
            data["seed"] = seed

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=300),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"Perchance API 错误 ({response.status}): {error_text}")

                result = await response.json()

                if result.get("status") != "success":
                    raise RuntimeError(f"图像生成失败: {result}")

                # 构建图像URL
                image_id = result.get("imageId", "")
                file_ext = result.get("fileExtension", "jpeg")
                image_url = f"{API_BASE_URL}/api/downloadTemporaryImage?imageId={image_id}&fileExtension={file_ext}"

                result["imageUrl"] = image_url
                return result

        except aiohttp.ClientError as e:
            logger.error("Perchance API 请求失败: %s", e)
            raise RuntimeError(f"Perchance API 请求失败: {e}")

    async def download_image(self, image_url: str) -> bytes:
        """下载图像

        Args:
            image_url: 图像URL

        Returns:
            bytes: 图像数据

        Raises:
            RuntimeError: 下载失败
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        try:
            async with self._session.get(
                image_url,
                timeout=aiohttp.ClientTimeout(total=60),
            ) as response:
                if response.status != 200:
                    raise RuntimeError(f"下载图像失败: HTTP {response.status}")
                return await response.read()

        except aiohttp.ClientError as e:
            logger.error("下载图像失败: %s", e)
            raise RuntimeError(f"下载图像失败: {e}")

    async def generate_and_download(
        self,
        prompt: str,
        negative_prompt: str = "",
        width: int = DEFAULT_WIDTH,
        height: int = DEFAULT_HEIGHT,
        guidance_scale: float = DEFAULT_GUIDANCE_SCALE,
        seed: Optional[int] = DEFAULT_SEED,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成并下载图像

        Args:
            prompt: 正向提示词
            negative_prompt: 负向提示词
            width: 图像宽度
            height: 图像高度
            guidance_scale: 引导强度
            seed: 随机种子

        Returns:
            Dict: 包含图像数据的结果
            {
                "image_data": bytes,
                "image_id": str,
                "seed": int,
                "prompt": str,
                "width": int,
                "height": int,
            }
        """
        # 生成图像
        result = await self.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            guidance_scale=guidance_scale,
            seed=seed,
        )

        # 下载图像
        image_url = result.get("imageUrl", "")
        image_data = await self.download_image(image_url)

        return {
            "image_data": image_data,
            "image_id": result.get("imageId", ""),
            "seed": result.get("seed", 0),
            "prompt": result.get("prompt", prompt),
            "width": result.get("width", width),
            "height": result.get("height", height),
            "file_extension": result.get("fileExtension", "jpeg"),
        }

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
