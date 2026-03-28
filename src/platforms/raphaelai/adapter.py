"""RaphaelAI 平台适配器

RaphaelAI (raphaelai.org) 是一个免费的AI图像生成平台。

API 端点: https://api.raphaelai.org/v1/
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
MODELS = ["raphaelai-sdxl"]

# 平台能力
CAPS = {
    "chat": False,
    "image_gen": True,
}


class RaphaelAIAdapter(PlatformAdapter):
    """RaphaelAI 平台适配器

    提供免费的AI图像生成服务。
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "raphaelai"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.raphaelai.client import RaphaelAIClient

        self._client = RaphaelAIClient()
        await self._client.init(session)
        logger.info("RaphaelAI 适配器初始化完成")

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
        raise NotImplementedError(
            "RaphaelAI 不支持聊天补全，请使用 generate_image 方法"
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
        negative_prompt: str = "",
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像"""
        if not self._client:
            raise RuntimeError("RaphaelAI 客户端未初始化")

        try:
            width, height = map(int, size.split("x"))
        except ValueError:
            width, height = 512, 512

        # 提交任务
        result = await self._client.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
        )

        job_id = result.get("data", {}).get("jobId", "")
        poll_token = result.get("data", {}).get("pollToken", "")

        if not job_id:
            raise RuntimeError("RaphaelAI 未返回 jobId")

        # 轮询状态
        max_polls = 60
        for _ in range(max_polls):
            status = await self._client.poll_job(job_id, poll_token)
            job_status = status.get("data", status).get("status", "pending")

            if job_status in ("completed", "succeeded"):
                image_url = status.get("data", status).get("outputUrl", "")
                break
            elif job_status in ("failed", "error"):
                raise RuntimeError(f"图像生成失败: {status}")
            
            await asyncio_sleep(2)
        else:
            raise RuntimeError("图像生成超时")

        logger.info("RaphaelAI 图像生成完成: %s", image_url)

        response = {
            "created": int(time.time()),
            "data": [],
        }

        if response_format == "b64_json" and image_url:
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as img_resp:
                    if img_resp.status == 200:
                        img_data = await img_resp.read()
                        response["data"].append({
                            "b64_json": base64.b64encode(img_data).decode("utf-8")
                        })
        else:
            response["data"].append({"url": image_url})

        return response

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None


async def asyncio_sleep(seconds: float) -> None:
    import asyncio
    await asyncio.sleep(seconds)
