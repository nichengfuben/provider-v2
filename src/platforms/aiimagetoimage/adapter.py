"""AIImageToImage 平台适配器

AIImageToImage (aiimagetoimage.io) 是一个AI图像转换平台。
主要支持图生图功能。
"""

from __future__ import annotations

import asyncio
import base64
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = ["aiimagetoimage-default"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class AIImageToImageAdapter(PlatformAdapter):
    """AIImageToImage 平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "aiimagetoimage"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.aiimagetoimage.client import AIImageToImageClient

        self._client = AIImageToImageClient()
        await self._client.init(session)
        logger.info("AIImageToImage 适配器初始化完成")

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
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        raise NotImplementedError(
            "AIImageToImage 不支持聊天补全，请使用 generate_image 方法"
        )

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        response_format: str = "url",
        image_url: str = None,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像（图生图）

        Args:
            candidate: 候选项
            prompt: 提示词
            model: 模型名称
            response_format: 响应格式
            image_url: 输入图像URL（必需）
        """
        if not self._client:
            raise RuntimeError("AIImageToImage 客户端未初始化")

        if not image_url:
            raise ValueError("AIImageToImage 需要 image_url 参数")

        # 提交任务
        result = await self._client.generate_image(
            image_url=image_url,
            prompt=prompt,
        )

        job_id = result.get("result", {}).get("job_id", "")
        if not job_id:
            raise RuntimeError("AIImageToImage 未返回 job_id")

        # 轮询状态
        max_polls = 60
        output_url = ""
        for _ in range(max_polls):
            status = await self._client.get_result(job_id)
            code = status.get("code", 202)

            if code == 200:
                output_url = status.get("result", {}).get("output_url", "")
                break
            elif code != 202:
                raise RuntimeError(f"图像生成失败: {status}")

            await asyncio.sleep(2)
        else:
            raise RuntimeError("图像生成超时")

        logger.info("AIImageToImage 图像生成完成: %s", output_url)

        response = {
            "created": int(time.time()),
            "data": [],
        }

        if response_format == "b64_json" and output_url:
            async with aiohttp.ClientSession() as session:
                async with session.get(output_url) as img_resp:
                    if img_resp.status == 200:
                        img_data = await img_resp.read()
                        response["data"].append({
                            "b64_json": base64.b64encode(img_data).decode("utf-8")
                        })
        else:
            response["data"].append({"url": output_url})

        return response

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None
