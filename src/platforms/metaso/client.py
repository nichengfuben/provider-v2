"""Metaso (秘塔AI搜索) API 客户端

秘塔AI搜索 (metaso.cn) - AI搜索引擎
API 端点: https://metaso.cn/api/search/chat
能力: chat, search
"""

from __future__ import annotations

import json
import logging
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

logger = logging.getLogger(__name__)

MODELS = ["metaso-qa-with-agent"]
CAPS = {"chat": True, "search": True}

# Metaso API 端点
METASO_CHAT_URL = "https://metaso.cn/api/search/chat"
METASO_CONFIG_URL = "https://metaso.cn/api/metaso-ai-config"

# 搜索引擎类型
ENGINE_TYPES = {
    "quanwang": "全网搜索",
    "pdf": "PDF搜索",
    "scholar": "学术搜索",
    "podcast": "播客搜索",
}


class MetasoClient:
    """Metaso API 客户端

    封装与 Metaso API 的所有交互。
    支持多引擎AI搜索和对话功能。
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
                    "Origin": "https://metaso.cn",
                    "Referer": "https://metaso.cn/",
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
        engine_type: str = "quanwang",
        mode: str = "detail",
        stream: bool = True,
        **kwargs: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """发送聊天消息并获取流式响应

        Args:
            query: 用户查询内容
            conversation_id: 会话ID（可选）
            engine_type: 搜索引擎类型 (quanwang/pdf/scholar/podcast)
            mode: 搜索模式 (detail/concise)
            stream: 是否使用流式响应
            **kwargs: 其他参数

        Yields:
            Dict containing response data with fields:
            - type: 消息类型
            - content: 文本内容
            - reasoning: 推理内容
            - citations: 引用列表
            - done: 是否完成
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
            "engineType": engine_type,
            "mode": mode,
            "conversationId": self._conversation_id,
        }

        try:
            async with session.post(
                METASO_CHAT_URL,
                json=payload,
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Metaso API error: {response.status} - {error_text}")
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

                            # 解析秘塔的响应格式
                            msg_type = data.get("type", "")

                            if msg_type == "conversation_init":
                                # 会话初始化
                                conv_data = data.get("data", {})
                                self._conversation_id = conv_data.get("id", self._conversation_id)
                                yield {"type": "conversation_init", "conversation_id": self._conversation_id}

                            elif msg_type == "response_message_init":
                                # 响应消息初始化
                                yield {"type": "response_start"}

                            elif msg_type == "heartbeat":
                                # 心跳，忽略
                                continue

                            elif "choices" in data:
                                # 主要内容
                                choice = data["choices"][0] if data["choices"] else {}
                                delta = choice.get("delta", {})

                                content = delta.get("content", "")
                                reasoning = delta.get("reasoning_content", "")
                                citations = delta.get("citations", [])
                                highlights = delta.get("highlights", [])

                                if content or reasoning:
                                    yield {
                                        "type": "content",
                                        "content": content,
                                        "reasoning": reasoning,
                                        "citations": citations,
                                        "highlights": highlights,
                                        "done": False,
                                    }

                            elif msg_type == "response_end" or data.get("done"):
                                yield {"type": "done", "content": "", "done": True}
                                return

                            else:
                                # 其他类型的消息
                                if "content" in data:
                                    yield {
                                        "type": "content",
                                        "content": data.get("content", ""),
                                        "done": data.get("done", False),
                                    }

                        except json.JSONDecodeError:
                            logger.debug(f"Failed to parse JSON: {data_str}")
                            continue

        except aiohttp.ClientError as e:
            logger.error(f"Metaso API request failed: {e}")
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

    @property
    def engine_types(self) -> Dict[str, str]:
        """返回支持的搜索引擎类型"""
        return ENGINE_TYPES.copy()
