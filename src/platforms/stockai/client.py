"""StockAI API 客户端

实现与 StockAI 聊天 API 的通信。

API 端点: https://free.stockai.trade/api/chat

响应格式（SSE流）:
- {"type":"start","messageId":"..."}
- {"type":"reasoning-start","id":"reasoning-0"}
- {"type":"reasoning-delta","id":"reasoning-0","delta":"..."}
- {"type":"reasoning-end","id":"reasoning-0"}
- {"type":"text-start","id":"txt-0"}
- {"type":"text-delta","id":"txt-0","delta":"..."}
- {"type":"text-end","id":"txt-0"}
- {"type":"finish","finishReason":"stop"}
"""

from __future__ import annotations

import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

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
    "arcee-ai/trinity-mini",
    "deepcogito/cogito-v2.1-671b",
    "z-ai/glm-4.5-air",
    "z-ai/glm-4.7-flash",
    "moonshotai/kimi-k2-thinking",
    "moonshotai/kimi-k2.5",
    "meta/llama-4-scout",
    "minimax/minimax-m2.1",
    "openai/gpt-oss-20b",
]

# 默认模型
DEFAULT_MODEL = "xiaomi/mimo-v2-pro"

# 支持的语言（翻译功能）
SUPPORTED_LANGUAGES = [
    "zh-Hans", "zh-Hant", "en", "ar", "fr", "de", "it",
    "ja", "ko", "pt", "ru", "es", "vi",
]


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

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session
        logger.info("StockAI 客户端初始化完成")

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
            {
                "type": "text-delta",
                "delta": "...",
            }

        Raises:
            RuntimeError: 请求失败
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
                        data_str = line_text[6:]  # 去掉 "data: " 前缀

                        if data_str == "[DONE]":
                            break

                        try:
                            data = json.loads(data_str)
                            yield data
                        except json.JSONDecodeError:
                            logger.warning("无法解析SSE数据: %s", data_str)
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

        Args:
            messages: 消息列表
            model: 模型名称
            web_search: 是否启用网页搜索
            target_language: 目标语言

        Yields:
            str: 文本片段
        """
        current_text_id = None

        async for event in self.chat(
            messages=messages,
            model=model,
            web_search=web_search,
            target_language=target_language,
            **kw,
        ):
            event_type = event.get("type", "")

            if event_type == "start":
                self._message_id = event.get("messageId")

            elif event_type == "text-start":
                current_text_id = event.get("id")

            elif event_type == "text-delta":
                delta = event.get("delta", "")
                if delta:
                    yield delta

            elif event_type == "text-end":
                current_text_id = None

            elif event_type == "finish":
                # 完成
                pass

    async def chat_complete(
        self,
        messages: List[Dict[str, Any]],
        model: str = DEFAULT_MODEL,
        web_search: bool = False,
        target_language: Optional[str] = None,
        **kw: Any,
    ) -> str:
        """聊天补全（完整响应）

        返回完整的响应文本。

        Args:
            messages: 消息列表
            model: 模型名称
            web_search: 是否启用网页搜索
            target_language: 目标语言

        Returns:
            str: 完整的响应文本
        """
        full_response = []

        async for text in self.chat_stream(
            messages=messages,
            model=model,
            web_search=web_search,
            target_language=target_language,
            **kw,
        ):
            full_response.append(text)

        return "".join(full_response)

    @property
    def models(self) -> List[str]:
        """返回支持的模型列表"""
        return SUPPORTED_MODELS

    @property
    def languages(self) -> List[str]:
        """返回支持的语言列表"""
        return SUPPORTED_LANGUAGES

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
