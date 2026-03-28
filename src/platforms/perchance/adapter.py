"""Perchance 平台适配器

Perchance 是一个免费的AI图像生成平台。
支持多种图像尺寸和参数配置。

API 端点: https://image-generation.perchance.org/api/generate
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

# 支持的图像尺寸
SIZES = [
    "512x512",
    "512x768",
    "768x512",
    "768x768",
    "1024x1024",
]

# 支持的模型
MODELS = ["perchance-sdxl"]

# 默认负向提示词
DEFAULT_NEGATIVE_PROMPT = (
    "low quality, blurry, distorted, ugly, bad anatomy, "
    "bad proportions, cropped, worst quality, low quality, "
    "jpeg artifacts, signature, watermark, text, error"
)

# 平台能力
CAPS = {
    "chat": False,
    "image": True,
    "stream": False,
    "tools": False,
}


class PerchanceAdapter(PlatformAdapter):
    """Perchance 平台适配器

    提供AI图像生成服务，免费使用，无需 API Key。

    使用方式:
    1. 访问 https://image-generation.perchance.org/
    2. 或直接调用 API 进行图像生成
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "perchance"

    @property
    def supported_models(self) -> List[str]:
        """返回支持的模型（Perchance 使用固定模型）"""
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.perchance.client import PerchanceClient

        self._client = PerchanceClient()
        await self._client.init(session)
        logger.info("Perchance 适配器初始化完成")

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
        """聊天补全（Perchance 不支持）"""
        raise NotImplementedError(
            "Perchance 不支持聊天补全，请使用 generate_image 方法"
        )

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        n: int = 1,
        size: str = "512x768",
        response_format: str = "url",
        negative_prompt: str = DEFAULT_NEGATIVE_PROMPT,
        guidance_scale: float = 7.0,
        seed: int = None,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            candidate: 候选项（图像生成不使用）
            prompt: 正向提示词
            model: 模型名称
            n: 生成数量（当前只支持1）
            size: 图像尺寸（如 512x768）
            response_format: 返回格式（url/b64_json）
            negative_prompt: 负向提示词
            guidance_scale: 引导强度
            seed: 随机种子

        Returns:
            OpenAI 兼容的图像生成响应:
            {
                "created": timestamp,
                "data": [{"url": "..."} or {"b64_json": "..."}]
            }
        """
        if not self._client:
            raise RuntimeError("Perchance 客户端未初始化")

        # 解析尺寸
        try:
            width, height = map(int, size.split("x"))
        except ValueError:
            width, height = 512, 768

        # 生成并下载图像
        result = await self._client.generate_and_download(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            guidance_scale=guidance_scale,
            seed=seed,
        )

        image_data = result.get("image_data", b"")

        logger.info(
            "Perchance 图像生成完成: 尺寸 %dx%d, 大小 %d bytes",
            width, height, len(image_data)
        )

        # 构建响应
        response = {
            "created": int(time.time()),
            "data": [],
        }

        if response_format == "b64_json":
            response["data"].append({
                "b64_json": base64.b64encode(image_data).decode("utf-8")
            })
        else:
            # 返回 base64 数据URL（因为没有持久的URL）
            data_url = f"data:image/{result.get('file_extension', 'jpeg')};base64,{base64.b64encode(image_data).decode('utf-8')}"
            response["data"].append({"url": data_url})

        # 添加元数据
        response["seed"] = result.get("seed", 0)

        return response

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
