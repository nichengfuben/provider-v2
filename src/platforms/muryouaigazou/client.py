"""MuryouAigazou API 客户端

实现与 MuryouAigazou 图像生成 API 的通信。

API 端点: https://muryou-aigazou.com/api/v2/
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

API_BASE_URL = "https://muryou-aigazou.com"
API_TASKS = "/api/v2/images/tasks"

MODELS = ["z-image-turbo", "z-image-turbo-anime"]

CAPS = {
    "chat": False,
    "image": True,
    "stream": False,
    "tools": False,
}


class MuryouAigazouClient:
    """MuryouAigazou API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("muryouaigazou"),
            platform="muryouaigazou",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("MuryouAigazou 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def create_task(
        self,
        prompt: str,
        model_type: int = 17,
        ratio: str = "1:1",
        **kw: Any,
    ) -> Dict[str, Any]:
        """创建图像生成任务

        Args:
            prompt: 提示词
            model_type: 模型类型 (17=通用, 其他为动漫等)
            ratio: 宽高比

        Returns:
            Dict: 包含 messageId 的响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_TASKS}"

        data = {
            "prompt": prompt,
            "modelType": model_type,
            "ratio": ratio,
        }

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"MuryouAigazou API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("MuryouAigazou API 请求失败: %s", e)
            raise RuntimeError(f"MuryouAigazou API 请求失败: {e}")

    async def poll_task(self, task_id: str) -> Dict[str, Any]:
        """轮询任务状态

        Args:
            task_id: 任务ID

        Returns:
            Dict: 任务状态
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_TASKS}/{task_id}"

        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    return await response.json()
                return {"task": {"status": "pending"}}

        except aiohttp.ClientError as e:
            logger.warning("轮询任务状态失败: %s", e)
            return {"task": {"status": "error"}}

    async def close(self) -> None:
        self._session = None
