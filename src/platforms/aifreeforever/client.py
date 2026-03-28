"""AIFreeForever API 客户端

实现与 AIFreeForever API 的通信。

API 端点: https://aifreeforever.com/api/

支持功能:
- 图像生成: POST /api/generate-image
- 提示词增强: POST /api/generate-ai-image-prompt
"""

from __future__ import annotations

import base64
import logging
import time
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://aifreeforever.com"
API_GENERATE_IMAGE = "/api/generate-image"
API_ENHANCE_PROMPT = "/api/generate-ai-image-prompt"

# 支持的模型
MODELS = [
    "z-image-turbo",  # 快速图像生成
]

# 平台能力
CAPS = {
    "chat": False,
    "image_gen": True,
}


class AIFreeForeverClient:
    """AIFreeForever API 客户端

    封装与 AIFreeForever API 的所有交互。
    免费使用，无需 API Key。
    """

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端"""
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("aifreeforever"),
            platform="aifreeforever",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("AIFreeForever 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        """返回候选项列表（单个候选项）"""
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量"""
        return 1 if self._candidate else 0

    async def generate_image(
        self,
        prompt: str,
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像

        Args:
            prompt: 图像描述

        Returns:
            Dict: 生成结果
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_GENERATE_IMAGE}"

        # 构建请求体
        data = {
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
                    raise RuntimeError(f"AIFreeForever API 错误 ({response.status}): {error_text}")

                result = await response.json()
                return result

        except aiohttp.ClientError as e:
            logger.error("AIFreeForever API 请求失败: %s", e)
            raise RuntimeError(f"AIFreeForever API 请求失败: {e}")

    async def enhance_prompt(
        self,
        prompt: str,
        **kw: Any,
    ) -> str:
        """增强提示词

        Args:
            prompt: 原始提示词

        Returns:
            str: 增强后的提示词
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_ENHANCE_PROMPT}"

        data = {"prompt": prompt}

        try:
            async with self._session.post(
                url,
                json=data,
                timeout=aiohttp.ClientTimeout(total=60),
            ) as response:
                if response.status != 200:
                    return prompt  # 增强失败时返回原始提示词

                result = await response.json()
                return result.get("mainPrompt", prompt)

        except Exception:
            return prompt

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
