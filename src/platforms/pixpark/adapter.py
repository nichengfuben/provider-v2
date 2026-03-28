"""PixPark 平台适配器

PixPark (pixpark.ai) 是一个AI图像生成平台。
支持文生图和图生图。
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

MODELS = ["pixpark-ai"]

CAPS = {
    "chat": False,
    "image": True,
    "image_to_image": True,
    "stream": False,
    "tools": False,
}


class PixParkAdapter(PlatformAdapter):
    """PixPark 平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "pixpark"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.pixpark.client import PixParkClient

        self._client = PixParkClient()
        await self._client.init(session)
        logger.info("PixPark 适配器初始化完成")

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
            "PixPark 不支持聊天补全，请使用 generate_image 方法"
        )

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        response_format: str = "url",
        image_urls: List[str] = None,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            candidate: 候选项
            prompt: 提示词
            model: 模型名称
            response_format: 响应格式
            image_urls: 输入图像URL（图生图）
        """
        if not self._client:
            raise RuntimeError("PixPark 客户端未初始化")

        # 创建任务
        result = await self._client.create_task(
            prompt=prompt,
            model=model or "pixpark-ai",
            image_urls=image_urls,
        )

        task_id = result.get("data", {}).get("taskId", "")
        if not task_id:
            raise RuntimeError("PixPark 未返回 taskId")

        # 轮询状态
        max_polls = 60
        image_url = ""
        for _ in range(max_polls):
            status = await self._client.get_task(task_id)
            items = status.get("data", {}).get("items", [])
            
            for item in items:
                if item.get("id") == task_id:
                    item_status = item.get("status", 0)
                    if item_status == 1:  # completed
                        outputs = item.get("outputs", [])
                        if outputs:
                            image_url = outputs[0] if outputs else ""
                        break
                    elif item_status == -1:  # failed
                        raise RuntimeError(f"图像生成失败: {item}")
            
            if image_url:
                break

            await asyncio.sleep(2)
        else:
            raise RuntimeError("图像生成超时")

        logger.info("PixPark 图像生成完成: %s", image_url)

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
