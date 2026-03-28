"""StockAI API 客户端

实现与 StockAI 聊天 API 的通信。

API 端点: https://free.stockai.trade/api/chat

响应格式（SSE流）:
- {"type":"start","messageId":"..."}
- {"type":"text-delta","delta":"..."}
- {"type":"finish","finishReason":"stop"}
"""

from __future__ import annotations

import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://free.stockai.trade"
API_CHAT = "/api/chat"

# 支持的模型
SUPPORTED_MODELS = [
    "xiaomi/mimo-v2-pro",
    "openrouter/free-search",
    "stockai/news",
    "taalas/llama-3.1",
    "google/translategemma",
    "inception/mercury-2",
    "z-ai/glm-5",
    "minimax/m2.5",
    "arcee-ai/trinity-large",
    "moonshotai/kimi-k2-thinking",
    "moonshotai/kimi-k2.5",
]

# 默认模型
DEFAULT_MODEL = "xiaomi/mimo-v2-pro"

# 支持的语言（翻译功能）
SUPPORTED_LANGUAGES = [
    "zh-Hans", "zh-Hant", "en", "ar", "fr", "de", "it",
    "ja", "ko", "pt", "ru", "es", "vi",
]

# 平台能力
CAPS = {
    "chat": True,
    "stream": True,
    "tools": False,
    "web_search": True,
    "translation": True,
}


class StockAIClient:
    """StockAI API 客户端

    封装与 StockAI 聊天 API 的所有交互。
    免费使用，无需 API Key。

    使用前请确保:
    - 网络可以访问 free.stockai.trade
    """

    def __init__(self) -> None:
        """初始化客户端"""
        self._session: Optional[aiohttp.ClientSession] = None
        self._message_id: Optional[str] = None
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session
        
        # 创建单个候选项
        self._candidate = Candidate(
            id=make_id("stockai"),
            platform="stockai",
            resource_id="default",
            models=SUPPORTED_MODELS,
            meta={},
            **CAPS,
        )
        
        logger.info("StockAI 客户端初始化完成")

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
        web_search: bool = False,
        target_language: Optional[str] = None,
        **kw: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """聊天补全

        Args:
            messages: 消息列表
            model: 模型名称
            web_search: 是否启用网页搜索
            target_language: 目标语言（翻译功能）

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
            "webSearch": web_search,
        }

        if target_language:
            payload["targetLanguage"] = target_language

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
                    raise RuntimeError(f"StockAI API 错误 ({response.status}): {error_text}")

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
                            yield data
                        except json.JSONDecodeError:
                            continue

        except aiohttp.ClientError as e:
            logger.error("StockAI API 请求失败: %s", e)
            raise RuntimeError(f"StockAI API 请求失败: {e}")

    async def chat_stream(
        self,
        messages: List[Dict[str, Any]],
        model: str = DEFAULT_MODEL,
        web_search: bool = False,
        target_language: Optional[str] = None,
        **kw: Any,
    ) -> AsyncGenerator[str, None]:
        """聊天补全（流式文本）

        简化的流式文本生成，只返回文本内容。
        """
        async for event in self.chat(
            messages=messages,
            model=model,
            web_search=web_search,
            target_language=target_language,
        ):
            event_type = event.get("type", "")

            if event_type == "text-delta":
                delta = event.get("delta", "")
                if delta:
                    yield delta

    @property
    def models(self) -> List[str]:
        """返回支持的模型列表"""
        return SUPPORTED_MODELS

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
