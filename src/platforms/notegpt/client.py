"""NoteGPT API 客户端

实现与 NoteGPT 图像生成 API 的通信。

API 端点: https://notegpt.io/api/v2/
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

API_BASE_URL = "https://notegpt.io"
API_START = "/api/v2/images/start"
API_STATUS = "/api/v2/images/status"

MODELS = ["notegpt-image"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class NoteGPTClient:
    """NoteGPT API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("notegpt"),
            platform="notegpt",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("NoteGPT 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def start_generation(
        self,
        prompt: str,
        session_id: Optional[str] = None,
        **kw: Any,
    ) -> Dict[str, Any]:
        """开始图像生成

        Args:
            prompt: 提示词
            session_id: 会话ID（可选）

        Returns:
            Dict: 包含 session_id 的响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_START}"

        data = {"prompt": prompt}
        if session_id:
            data["session_id"] = session_id

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=60),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"NoteGPT API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("NoteGPT API 请求失败: %s", e)
            raise RuntimeError(f"NoteGPT API 请求失败: {e}")

    async def get_status(self) -> Dict[str, Any]:
        """获取生成状态

        Returns:
            Dict: 状态响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_STATUS}"

        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    return await response.json()
                return {"data": {"status": "pending"}}

        except aiohttp.ClientError as e:
            logger.warning("获取状态失败: %s", e)
            return {"data": {"status": "error"}}

    async def close(self) -> None:
        self._session = None
