"""Andi Search API 客户端

Andi搜索 (andisearch.com) - AI搜索引擎
API 端点: https://api.andisearch.com/parser/parser
能力: chat, search
"""

from __future__ import annotations

import json
import logging
import re
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

logger = logging.getLogger(__name__)

MODELS = ["andi-search-agent"]
CAPS = {"chat": True, "search": True}

# Andi API 端点
ANDI_API_URL = "https://api.andisearch.com/parser/parser"
ANDI_WRITE_URL = "https://write.andisearch.com/v1/write_streaming"


class AndiClient:
    """Andi Search API 客户端

    封装与 Andi Search API 的所有交互。
    支持AI搜索和对话功能。
    """

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._conversation_id: str = ""

    async def _get_session(self) -> aiohttp.ClientSession:
        """获取或创建 aiohttp 会话"""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession(
                headers={
                    "Accept": "text/event-stream",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Content-Type": "application/json",
                    "Origin": "https://andisearch.com",
                    "Referer": "https://andisearch.com/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                }
            )
        return self._session

    async def create_conversation(self) -> str:
        """创建新的会话"""
        if not self._conversation_id:
            self._conversation_id = str(uuid.uuid4())
        return self._conversation_id

    async def chat(
        self,
        query: str,
        conversation_id: Optional[str] = None,
        stream: bool = True,
        **kwargs: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """发送聊天消息并获取流式响应

        Args:
            query: 用户查询内容
            conversation_id: 会话ID（可选）
            stream: 是否使用流式响应
            **kwargs: 其他参数

        Yields:
            Dict containing response data with fields:
            - content: 文本内容
            - reasoning: 推理内容（如果有）
            - done: 是否完成
            - citations: 引用列表
        """
        session = await self._get_session()

        if conversation_id:
            self._conversation_id = conversation_id
        elif not self._conversation_id:
            await self.create_conversation()

        # 构建请求体
        payload = {
            "query": query,
            "stream": stream,
            "conversation_id": self._conversation_id,
        }

        try:
            async with session.post(
                ANDI_API_URL,
                json=payload,
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Andi API error: {response.status} - {error_text}")
                    yield {"error": f"API error: {response.status}", "content": "", "done": True}
                    return

                # 解析 SSE 流
                async for line in response.content:
                    line_text = line.decode("utf-8", errors="ignore").strip()

                    if not line_text:
                        continue

                    if line_text.startswith("data:"):
                        data_str = line_text[5:].strip()

                        if data_str == "[DONE]":
                            yield {"content": "", "done": True}
                            return

                        try:
                            data = json.loads(data_str)

                            # 解析响应格式
                            if "choices" in data:
                                choice = data["choices"][0] if data["choices"] else {}
                                delta = choice.get("delta", {})

                                content = delta.get("content", "")
                                reasoning = delta.get("reasoning_content", "")
                                citations = delta.get("citations", [])

                                if content or reasoning:
                                    yield {
                                        "content": content,
                                        "reasoning": reasoning,
                                        "citations": citations,
                                        "done": False,
                                    }

                            elif "content" in data:
                                # 直接内容格式
                                yield {
                                    "content": data.get("content", ""),
                                    "reasoning": data.get("reasoning", ""),
                                    "citations": data.get("citations", []),
                                    "done": data.get("done", False),
                                }

                            elif "answer" in data:
                                # 搜索答案格式
                                yield {
                                    "content": data.get("answer", ""),
                                    "reasoning": data.get("reasoning", ""),
                                    "citations": data.get("sources", []),
                                    "done": data.get("done", False),
                                }

                        except json.JSONDecodeError:
                            logger.debug(f"Failed to parse JSON: {data_str}")
                            continue

        except aiohttp.ClientError as e:
            logger.error(f"Andi API request failed: {e}")
            yield {"error": str(e), "content": "", "done": True}

    async def close(self) -> None:
        """关闭会话"""
        if self._session and not self._session.closed:
            await self._session.close()
            self._session = None

    @property
    def models(self) -> List[str]:
        """返回支持的模型列表"""
        return MODELS.copy()

    @property
    def capabilities(self) -> Dict[str, bool]:
        """返回能力字典"""
        return CAPS.copy()
