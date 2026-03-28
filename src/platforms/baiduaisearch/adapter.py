"""百度AI搜索平台适配器

百度AI搜索 (chat.baidu.com) - 百度智能搜索

API 端点: https://chat.baidu.com/aichat/api/aitabserver
能力: chat, search, deep_search
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.base import PlatformAdapter
from src.platforms.baiduaisearch.client import BaiduAISearchClient, MODELS, CAPS

logger = logging.getLogger(__name__)


class BaiduAISearchAdapter(PlatformAdapter):
    """百度AI搜索平台适配器

    基于文心大模型，提供智能问答和深度搜索功能。
    支持多种AI功能：AI写作、AI阅读、AI生图等。
    """

    def __init__(self) -> None:
        self._client: Optional[BaiduAISearchClient] = None
        self._candidate: Optional[Candidate] = None

    @property
    def name(self) -> str:
        return "baiduaisearch"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        self._client = BaiduAISearchClient()
        self._candidate = Candidate(
            id=make_id("baiduaisearch"),
            platform="baiduaisearch",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        logger.info("百度AI搜索适配器初始化完成")

    async def candidates(self) -> List[Candidate]:
        """返回可用的候选项列表"""
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        """确保有指定数量的候选项"""
        return 1 if self._candidate else 0

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool = True,
        *,
        thinking: bool = False,
        search: bool = True,
        **kwargs: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """处理聊天完成请求

        Args:
            candidate: 候选项
            messages: 消息列表
            model: 模型名称 (smartMode/deepSearch)
            stream: 是否流式输出
            thinking: 是否启用思考模式
            search: 是否启用搜索功能
            **kwargs: 其他参数
                - deep_search: 是否启用深度搜索
                - deep_think: 是否启用深度思考

        Yields:
            字符串内容或字典格式的响应
        """
        if not self._client:
            yield {"error": "Client not initialized", "done": True}
            return

        # 提取最后一条用户消息
        user_query = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                content = msg.get("content", "")
                if isinstance(content, str):
                    user_query = content
                elif isinstance(content, list):
                    for part in content:
                        if isinstance(part, dict) and part.get("type") == "text":
                            user_query = part.get("text", "")
                            break
                        elif isinstance(part, str):
                            user_query = part
                            break
                break

        if not user_query:
            yield {"error": "No user query found", "done": True}
            return

        # 获取参数
        deep_search = kwargs.get("deep_search", False)
        deep_think = kwargs.get("deep_think", False)
        conversation_id = kwargs.get("conversation_id")

        # 如果指定了深度思考，使用 deepSearch 模型
        if deep_think:
            model = "deepSearch"

        try:
            async for chunk in self._client.chat(
                query=user_query,
                conversation_id=conversation_id,
                model=model,
                deep_search=deep_search,
                deep_think=deep_think,
                stream=stream,
            ):
                if "error" in chunk and chunk.get("error"):
                    yield {"error": chunk["error"], "done": True}
                    return

                msg_type = chunk.get("type", "")
                content = chunk.get("content", "")
                done = chunk.get("done", False)

                # 跳过意图和进度消息
                if msg_type in ("intent", "progress"):
                    continue

                # 处理内容消息
                if msg_type == "content" and content:
                    yield content

                if done:
                    yield {"done": True}
                    return

        except Exception as e:
            logger.error(f"BaiduAI complete error: {e}")
            yield {"error": str(e), "done": True}

    async def close(self) -> None:
        """关闭适配器"""
        if self._client:
            await self._client.close()
            self._client = None
