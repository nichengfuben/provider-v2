"""RyRob AI API 客户端

实现与 RyRob AI API 的通信。

API 端点: https://api.ryrob.com/api/

支持功能:
- 模型列表: GET /api/models
- 渲染/聊天: POST /api/render
"""

from __future__ import annotations

import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://api.ryrob.com"
API_MODELS = "/api/models"
API_RENDER = "/api/render"

# 默认模型
DEFAULT_MODEL = "xai/grok-4.1-fast-reasoning"

# 平台能力
CAPS = {
    "chat": True,
    "stream": True,
    "tools": False,
}


class RyRobClient:
    """RyRob AI API 客户端

    封装与 RyRob AI API 的所有交互。
    免费使用，无需 API Key。
    """

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._candidate: Optional[Candidate] = None
        self._models: List[Dict[str, Any]] = []

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端"""
        self._session = session
        
        # 加载模型列表
        await self._load_models()
        
        # 提取模型名称
        model_names = [m.get("value", "") for m in self._models if m.get("value")]
        
        self._candidate = Candidate(
            id=make_id("ryrob"),
            platform="ryrob",
            resource_id="default",
            models=model_names if model_names else [DEFAULT_MODEL],
            meta={},
            **CAPS,
        )
        
        logger.info("RyRob 客户端初始化完成，已加载 %d 个模型", len(self._models))

    async def _load_models(self) -> None:
        """加载模型列表"""
        if not self._session:
            return

        url = f"{API_BASE_URL}{API_MODELS}"

        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self._models = data.get("models", [])
        except Exception as e:
            logger.warning("加载模型列表失败: %s", e)

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
    ) -> AsyncGenerator[str, None]:
        """聊天补全

        Args:
            messages: 消息列表
            model: 模型名称

        Yields:
            str: 文本片段
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_RENDER}"

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
                    raise RuntimeError(f"RyRob API 错误 ({response.status}): {error_text}")

                # 解析SSE流
                async for line in response.content:
                    line_text = line.decode("utf-8").strip()

                    if not line_text:
                        continue

                    if line_text.startswith("data: "):
                        data_str = line_text[6:]

                        if data_str == "[DONE]":
                            break

                        try:
                            data = json.loads(data_str)
                            # 提取文本内容
                            if "choices" in data:
                                for choice in data["choices"]:
                                    delta = choice.get("delta", {})
                                    content = delta.get("content", "")
                                    if content:
                                        yield content
                        except json.JSONDecodeError:
                            continue

        except aiohttp.ClientError as e:
            logger.error("RyRob API 请求失败: %s", e)
            raise RuntimeError(f"RyRob API 请求失败: {e}")

    @property
    def models(self) -> List[Dict[str, Any]]:
        """返回模型列表"""
        return self._models

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
