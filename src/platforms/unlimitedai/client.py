"""UnlimitedAI API 客户端

实现与 UnlimitedAI 聊天 API 的通信。

API 端点: https://app.unlimitedai.chat/api/chat

响应格式（SSE流）:
- {"type":"delta","delta":"..."}
"""

from __future__ import annotations

import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://app.unlimitedai.chat"
API_CHAT = "/api/chat"

# 支持的模型
SUPPORTED_MODELS = [
    "chat-model-reasoning",           # 标准模型
    "chat-model-reasoning-with-search",  # 高级模型（搜索）
]

# 默认模型
DEFAULT_MODEL = "chat-model-reasoning"

# 平台能力
CAPS = {
    "chat": True,
}


class UnlimitedAIClient:
    """UnlimitedAI API 客户端

    封装与 UnlimitedAI 聊天 API 的所有交互。
    免费使用，无需 API Key。
    """

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端"""
        self._session = session
        
        self._candidate = Candidate(
            id=make_id("unlimitedai"),
            platform="unlimitedai",
            resource_id="default",
            models=SUPPORTED_MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("UnlimitedAI 客户端初始化完成")

    async def candidates(self) -> List[Candidate]:
        """返回候选项列表（单个候选项）"""
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量"""
        return 1 if self._candidate else 0

    async def chat(
        self,
        messages: List[Dict[str, Any]],
        model: str = DEFAULT_MODEL,
        **kw: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """聊天补全

        Args:
            messages: 消息列表
            model: 模型名称

        Yields:
            Dict: SSE事件数据
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_CHAT}"

        # 构建请求体
        payload = {
            "messages": messages,
            "model": model,
        }

        headers = {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
        }

        try:
            async with self._session.post(
                url,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=300),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"UnlimitedAI API 错误 ({response.status}): {error_text}")

                # 解析SSE流
                async for line in response.content:
                    line_text = line.decode("utf-8").strip()

                    if not line_text:
                        continue

                    try:
                        data = json.loads(line_text)
                        yield data
                    except json.JSONDecodeError:
                        continue

        except aiohttp.ClientError as e:
            logger.error("UnlimitedAI API 请求失败: %s", e)
            raise RuntimeError(f"UnlimitedAI API 请求失败: {e}")

    @property
    def models(self) -> List[str]:
        """返回支持的模型列表"""
        return SUPPORTED_MODELS

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
