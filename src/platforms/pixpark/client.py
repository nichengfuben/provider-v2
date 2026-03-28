"""PixPark API 客户端

实现与 PixPark 图像生成 API 的通信。

API 端点: https://pixpark.ai/api/app/
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

API_BASE_URL = "https://pixpark.ai"
API_TASKS = "/api/app/tasks"

MODELS = ["pixpark-ai"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class PixParkClient:
    """PixPark API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("pixpark"),
            platform="pixpark",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("PixPark 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def create_task(
        self,
        prompt: str,
        model: str = "pixpark-ai",
        aspect_ratio: str = "auto",
        num: int = 1,
        image_urls: List[str] = None,
        **kw: Any,
    ) -> Dict[str, Any]:
        """创建图像生成任务

        Args:
            prompt: 提示词
            model: 模型名称
            aspect_ratio: 宽高比
            num: 生成数量
            image_urls: 输入图像URL（图生图）

        Returns:
            Dict: 包含 taskId 的响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_TASKS}"

        data = {
            "prompt": prompt,
            "model": model,
            "aspectRatio": aspect_ratio,
            "num": num,
        }

        if image_urls:
            data["imageUrls"] = image_urls

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"PixPark API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("PixPark API 请求失败: %s", e)
            raise RuntimeError(f"PixPark API 请求失败: {e}")

    async def get_task(self, task_id: str) -> Dict[str, Any]:
        """获取任务状态

        Args:
            task_id: 任务ID

        Returns:
            Dict: 任务状态
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_TASKS}"

        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    return await response.json()
                return {"data": {"items": []}}

        except aiohttp.ClientError as e:
            logger.warning("获取任务状态失败: %s", e)
            return {"data": {"items": []}}

    async def close(self) -> None:
        self._session = None
