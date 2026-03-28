"""SkyFortress API 客户端

实现与 SkyFortress 图像生成 API 的通信。

API 端点: https://skyfortress.dev/api/
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

API_BASE_URL = "https://skyfortress.dev"
API_GENERATE = "/api/generate-image"

MODELS = ["skyfortress-sdxl"]

CAPS = {
    "chat": False,
    "image": True,
    "stream": False,
    "tools": False,
}


class SkyFortressClient:
    """SkyFortress API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("skyfortress"),
            platform="skyfortress",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("SkyFortress 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def generate_image(
        self,
        prompt: str,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            prompt: 提示词

        Returns:
            Dict: 包含图像URL的响应
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_GENERATE}"

        data = {"prompt": prompt}

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"SkyFortress API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("SkyFortress API 请求失败: %s", e)
            raise RuntimeError(f"SkyFortress API 请求失败: {e}")

    async def close(self) -> None:
        self._session = None
