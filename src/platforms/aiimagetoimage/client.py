"""AIImageToImage API 客户端

实现与 AIImageToImage 图像转换 API 的通信。

API 端点: https://api.aiimagetoimage.io/api/
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

API_BASE_URL = "https://api.aiimagetoimage.io"
API_GENERATE = "/api/img2img/image-generate"
API_RESULT = "/api/result/get"

MODELS = ["aiimagetoimage-default"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class AIImageToImageClient:
    """AIImageToImage API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("aiimagetoimage"),
            platform="aiimagetoimage",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("AIImageToImage 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def generate_image(
        self,
        image_url: str,
        prompt: str = "",
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像（图生图）

        Args:
            image_url: 输入图像URL
            prompt: 提示词

        Returns:
            Dict: 包含 job_id 的响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_GENERATE}/image2image"

        data = {
            "image_url": image_url,
            "prompt": prompt,
        }

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"AIImageToImage API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("AIImageToImage API 请求失败: %s", e)
            raise RuntimeError(f"AIImageToImage API 请求失败: {e}")

    async def get_result(self, job_id: str) -> Dict[str, Any]:
        """获取生成结果

        Args:
            job_id: 任务ID

        Returns:
            Dict: 结果响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_RESULT}/get"

        params = {"job_id": job_id}

        try:
            async with self._session.get(
                url,
                params=params,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    return await response.json()
                return {"code": 202, "result": None}

        except aiohttp.ClientError as e:
            logger.warning("获取结果失败: %s", e)
            return {"code": 202, "result": None}

    async def close(self) -> None:
        self._session = None
