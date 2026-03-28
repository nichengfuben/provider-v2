"""MuryouAigazou 平台适配器

MuryouAigazou (muryou-aigazou.com) 是一个免费的AI图像生成平台（日语）。
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

MODELS = ["z-image-turbo", "z-image-turbo-anime"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class MuryouAigazouAdapter(PlatformAdapter):
    """MuryouAigazou 平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "muryouaigazou"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.muryouaigazou.client import MuryouAigazouClient

        self._client = MuryouAigazouClient()
        await self._client.init(session)
        logger.info("MuryouAigazou 适配器初始化完成")

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
            "MuryouAigazou 不支持聊天补全，请使用 generate_image 方法"
        )

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        size: str = "512x512",
        response_format: str = "url",
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像"""
        if not self._client:
            raise RuntimeError("MuryouAigazou 客户端未初始化")

        # 根据模型选择类型
        model_type = 17  # 默认通用
        if "anime" in model.lower():
            model_type = 18  # 动漫风格

        # 创建任务
        result = await self._client.create_task(
            prompt=prompt,
            model_type=model_type,
        )

        task_id = result.get("task", {}).get("messageId", "")
        if not task_id:
            raise RuntimeError("MuryouAigazou 未返回 messageId")

        # 轮询状态
        max_polls = 60
        for _ in range(max_polls):
            status = await self._client.poll_task(task_id)
            task_status = status.get("task", {}).get("status", "pending")

            if task_status == "completed":
                image_url = status.get("task", {}).get("result", {}).get("url", "")
                break
            elif task_status == "failed":
                raise RuntimeError(f"图像生成失败: {status}")

            await asyncio.sleep(2)
        else:
            raise RuntimeError("图像生成超时")

        logger.info("MuryouAigazou 图像生成完成: %s", image_url)

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
