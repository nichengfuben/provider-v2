"""RaphaelAI API 客户端

实现与 RaphaelAI 图像生成 API 的通信。

API 端点: https://api.raphaelai.org/v1/
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://api.raphaelai.org"
API_IMAGE_JOBS = "/v1/image/jobs"
API_JOBS = "/v1/jobs"

# 支持的模型
MODELS = ["raphaelai-sdxl"]

# 平台能力
CAPS = {
    "chat": False,
    "image": True,
    "stream": False,
    "tools": False,
}


class RaphaelAIClient:
    """RaphaelAI API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("raphaelai"),
            platform="raphaelai",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("RaphaelAI 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "",
        width: int = 512,
        height: int = 512,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            prompt: 提示词
            negative_prompt: 负向提示词
            width: 宽度
            height: 高度

        Returns:
            Dict: 包含 jobId 的响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_IMAGE_JOBS}"

        data = {
            "prompt": prompt,
            "negativePrompt": negative_prompt,
            "width": width,
            "height": height,
        }

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"RaphaelAI API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("RaphaelAI API 请求失败: %s", e)
            raise RuntimeError(f"RaphaelAI API 请求失败: {e}")

    async def poll_job(self, job_id: str, poll_token: str) -> Dict[str, Any]:
        """轮询任务状态

        Args:
            job_id: 任务ID
            poll_token: 轮询令牌

        Returns:
            Dict: 任务状态
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_JOBS}/{job_id}"

        headers = {
            "X-Poll-Token": poll_token,
        }

        try:
            async with self._session.get(
                url,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    return await response.json()
                return {"status": "pending"}

        except aiohttp.ClientError as e:
            logger.warning("轮询任务状态失败: %s", e)
            return {"status": "error", "error": str(e)}

    async def close(self) -> None:
        self._session = None
