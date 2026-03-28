"""StockAI 平台适配器

StockAI (free.stockai.trade) 是一个免费的AI聊天服务。
支持多种开源模型，包括搜索、翻译等功能。

API 端点: https://free.stockai.trade/api/chat
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的模型
MODELS = [
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

# 平台能力
CAPS = {
    "chat": True,
    "stream": True,
    "tools": False,
    "web_search": True,
    "translation": True,
}


class StockAIAdapter(PlatformAdapter):
    """StockAI 平台适配器

    提供免费的AI聊天服务，支持多种开源模型。
    无需 API Key，免费使用。

    使用方式:
    1. 访问 https://free.stockai.trade/
    2. 或直接调用 API 进行聊天

    特色功能:
    - 网页搜索: model = "openrouter/free-search"
    - 新闻获取: model = "stockai/news"
    - 翻译功能: model = "google/translategemma"
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "stockai"

    @property
    def supported_models(self) -> List[str]:
        """返回支持的模型列表"""
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.stockai.client import StockAIClient

        self._client = StockAIClient()
        await self._client.init(session)
        logger.info("StockAI 适配器初始化完成")

    async def candidates(self) -> List[Candidate]:
        """返回可用候选项"""
        # StockAI 不需要候选项，直接使用
        return []

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量"""
        return 0

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """聊天补全

        Args:
            candidate: 候选项
            messages: 消息列表
            model: 模型名称
            stream: 是否流式输出
            thinking: 是否返回思考过程
            search: 是否启用网页搜索

        Yields:
            str: 文本片段
            dict: 元数据
        """
        if not self._client:
            raise RuntimeError("StockAI 客户端未初始化")

        # 确定是否启用搜索
        web_search = search or model == "openrouter/free-search"

        # 目标语言（翻译功能）
        target_language = kw.get("target_language")

        current_reasoning = []
        reasoning_id = None

        async for event in self._client.chat(
            messages=messages,
            model=model or DEFAULT_MODEL,
            web_search=web_search,
            target_language=target_language,
        ):
            event_type = event.get("type", "")

            if event_type == "reasoning-start":
                reasoning_id = event.get("id")
                current_reasoning = []

            elif event_type == "reasoning-delta":
                delta = event.get("delta", "")
                current_reasoning.append(delta)

                if thinking:
                    yield {"thinking": delta}

            elif event_type == "reasoning-end":
                if thinking and current_reasoning:
                    yield {"thinking_end": "".join(current_reasoning)}
                reasoning_id = None
                current_reasoning = []

            elif event_type == "text-delta":
                delta = event.get("delta", "")
                if delta:
                    yield delta

            elif event_type == "finish":
                finish_reason = event.get("finishReason", "stop")
                yield {"finish_reason": finish_reason}

        logger.info("StockAI 聊天完成: 模型 %s", model)

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
