"""BaiduAI Search (百度AI搜索) API 客户端

百度AI搜索 (chat.baidu.com) - 百度智能搜索
API 端点: https://chat.baidu.com/aichat/api/aitabserver
能力: chat, search
"""

from __future__ import annotations

import json
import logging
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

logger = logging.getLogger(__name__)

MODELS = ["smartMode", "deepSearch"]
CAPS = {"chat": True, "search": True}

# BaiduAI API 端点
BAIDU_CHAT_URL = "https://chat.baidu.com/aichat/api/aitabserver"
BAIDU_CONVERSATION_URL = "https://chat.baidu.com/aichat/api/conversation"


class BaiduAISearchClient:
    """百度AI搜索 API 客户端

    封装与百度AI搜索 API 的所有交互。
    基于文心大模型，支持深度搜索和智能问答。
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
                    "Origin": "https://chat.baidu.com",
                    "Referer": "https://chat.baidu.com/",
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
        model: str = "smartMode",
        deep_search: bool = False,
        stream: bool = True,
        **kwargs: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """发送聊天消息并获取流式响应

        Args:
            query: 用户查询内容
            conversation_id: 会话ID（可选）
            model: 模型名称 (smartMode/deepSearch)
            deep_search: 是否启用深度搜索
            stream: 是否使用流式响应
            **kwargs: 其他参数

        Yields:
            Dict containing response data with fields:
            - type: 消息类型
            - content: 文本内容
            - intent: 意图识别结果
            - done: 是否完成
        """
        session = await self._get_session()

        if conversation_id:
            self._conversation_id = conversation_id
        elif not self._conversation_id:
            await self.create_conversation()

        # 构建百度AI搜索特有的请求格式
        payload = {
            "query": [
                {
                    "type": "TEXT",
                    "data": {
                        "text": {
                            "query": query
                        }
                    }
                }
            ],
            "usedModel": {
                "modelName": model,
                "modelFunction": {
                    "deepThink": "1" if kwargs.get("deep_think") else "0",
                    "quickSwitch": "0",
                    "deepSearch": "1" if deep_search else "0"
                }
            },
            "stream": stream,
            "conversation_id": self._conversation_id,
        }

        try:
            async with session.post(
                BAIDU_CHAT_URL,
                json=payload,
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"BaiduAI API error: {response.status} - {error_text}")
                    yield {"error": f"API error: {response.status}", "content": "", "done": True}
                    return

                # 解析 SSE 流
                async for line in response.content:
                    line_text = line.decode("utf-8", errors="ignore").strip()

                    if not line_text:
                        continue

                    # 解析事件类型
                    if line_text.startswith("event:"):
                        event_type = line_text[6:].strip()
                        if event_type == "complete":
                            yield {"content": "", "done": True}
                            return
                        continue

                    # 解析数据
                    if line_text.startswith("data:"):
                        data_str = line_text[5:].strip()

                        if data_str == "[DONE]":
                            yield {"content": "", "done": True}
                            return

                        try:
                            data = json.loads(data_str)

                            # 解析百度AI搜索的响应格式
                            if "status" in data:
                                status = data.get("status", -1)
                                if status != 0:
                                    yield {"error": f"API status error: {status}", "done": True}
                                    return

                            # 解析消息列表
                            messages = data.get("messages", [])
                            for msg in messages:
                                mime_type = msg.get("mime_type", "")
                                content = msg.get("content", "")
                                meta_data = msg.get("meta_data", {})

                                if mime_type == "signal/post":
                                    # 意图识别信号
                                    intent = meta_data.get("intent_content", "")
                                    ori_query = meta_data.get("ori_query", "")
                                    yield {
                                        "type": "intent",
                                        "intent": intent,
                                        "original_query": ori_query,
                                    }

                                elif mime_type == "bar/progress":
                                    # 进度条
                                    progress_type = meta_data.get("type", "")
                                    yield {
                                        "type": "progress",
                                        "progress_type": progress_type,
                                    }

                                elif mime_type == "multi_load/iframe":
                                    # 主要内容
                                    action = msg.get("action", "")
                                    if content:
                                        yield {
                                            "type": "content",
                                            "content": content,
                                            "action": action,
                                            "done": False,
                                        }

                                elif mime_type == "text/plain":
                                    # 纯文本内容
                                    if content:
                                        yield {
                                            "type": "content",
                                            "content": content,
                                            "done": False,
                                        }

                            # 检查是否完成
                            if data.get("done") or data.get("is_end"):
                                yield {"content": "", "done": True}
                                return

                        except json.JSONDecodeError:
                            logger.debug(f"Failed to parse JSON: {data_str}")
                            continue

        except aiohttp.ClientError as e:
            logger.error(f"BaiduAI API request failed: {e}")
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
