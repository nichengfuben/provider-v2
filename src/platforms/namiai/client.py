"""NamiAI (纳米AI) API 客户端

纳米AI (bot.n.cn) - 360旗下AI助手
API 端点: https://bot.n.cn/api/nami_ai/chat
能力: chat, search, tools
"""

from __future__ import annotations

import json
import logging
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

logger = logging.getLogger(__name__)

MODELS = [
    "volcengine/doubao-seed-1-6-250615",
    "namiai-default",
]
CAPS = {"chat": True, "search": True, "tools": True}

# NamiAI API 端点
NAMI_CHAT_URL = "https://bot.n.cn/api/nami_ai/chat"
NAMI_CONVERSATION_URL = "https://bot.n.cn/api/assistant/new/conversation"
NAMI_MODELS_URL = "https://bot.n.cn/api/ai_agent/models"


class NamiAIClient:
    """NamiAI API 客户端

    封装与 NamiAI API 的所有交互。
    基于火山引擎豆包模型，支持多智能体和工具调用。
    """

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._conversation_id: str = ""
        self._message_id: str = ""

    async def _get_session(self) -> aiohttp.ClientSession:
        """获取或创建 aiohttp 会话"""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession(
                headers={
                    "Accept": "text/event-stream",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Content-Type": "application/json",
                    "Origin": "https://bot.n.cn",
                    "Referer": "https://bot.n.cn/",
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
        agent_id: Optional[str] = None,
        stream: bool = True,
        **kwargs: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """发送聊天消息并获取流式响应

        Args:
            query: 用户查询内容
            conversation_id: 会话ID（可选）
            agent_id: 智能体ID（可选）
            stream: 是否使用流式响应
            **kwargs: 其他参数

        Yields:
            Dict containing response data with fields:
            - type: 消息类型 (content/reasoning/tool/status)
            - content: 文本内容
            - reasoning: 推理内容
            - tool_status: 工具状态
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
            "conversation_id": self._conversation_id,
        }

        if agent_id:
            payload["agent_id"] = agent_id

        try:
            async with session.post(
                NAMI_CHAT_URL,
                json=payload,
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"NamiAI API error: {response.status} - {error_text}")
                    yield {"error": f"API error: {response.status}", "content": "", "done": True}
                    return

                # 解析 SSE 流
                current_event = None
                current_id = 0

                async for line in response.content:
                    line_text = line.decode("utf-8", errors="ignore").strip()

                    if not line_text:
                        continue

                    # 解析事件类型
                    if line_text.startswith("event:"):
                        current_event = line_text[6:].strip()
                        continue

                    # 解析事件ID
                    if line_text.startswith("id:"):
                        try:
                            current_id = int(line_text[3:].strip())
                        except ValueError:
                            pass
                        continue

                    # 解析数据
                    if line_text.startswith("data:"):
                        data_str = line_text[5:].strip()

                        if data_str == "[DONE]":
                            yield {"content": "", "done": True}
                            return

                        try:
                            data = json.loads(data_str)

                            # 解析纳米AI的事件类型
                            if current_event == "102":
                                # AI代理事件
                                yield from self._parse_ai_agent_event(data)

                            elif current_event == "100":
                                # 会话初始化
                                if "CONVERSATIONID####" in data_str:
                                    conv_id = data_str.split("CONVERSATIONID####")[-1].strip()
                                    self._conversation_id = conv_id
                                    yield {"type": "conversation_init", "conversation_id": conv_id}

                            elif current_event == "101":
                                # 消息初始化
                                if "MESSAGEID####" in data_str:
                                    msg_id = data_str.split("MESSAGEID####")[-1].strip()
                                    self._message_id = msg_id
                                    yield {"type": "message_init", "message_id": msg_id}

                            elif "content" in data:
                                # 直接内容格式
                                yield {
                                    "type": "content",
                                    "content": data.get("content", ""),
                                    "done": data.get("done", False),
                                }

                        except json.JSONDecodeError:
                            # 可能是纯文本事件
                            if "CONVERSATIONID####" in data_str:
                                conv_id = data_str.split("CONVERSATIONID####")[-1].strip()
                                self._conversation_id = conv_id
                                yield {"type": "conversation_init", "conversation_id": conv_id}
                            elif "MESSAGEID####" in data_str:
                                msg_id = data_str.split("MESSAGEID####")[-1].strip()
                                self._message_id = msg_id
                                yield {"type": "message_init", "message_id": msg_id}
                            continue

        except aiohttp.ClientError as e:
            logger.error(f"NamiAI API request failed: {e}")
            yield {"error": str(e), "content": "", "done": True}

    def _parse_ai_agent_event(self, data: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        """解析 AI 代理事件

        Args:
            data: 事件数据

        Yields:
            解析后的事件字典
        """
        # 检查各种事件类型
        if "agentThink" in data:
            think = data["agentThink"]
            content = think.get("content", "")
            status = think.get("status", "")
            if content:
                yield {
                    "type": "reasoning",
                    "content": content,
                    "status": status,
                    "done": False,
                }

        elif "toolStatus" in data:
            tool = data["toolStatus"]
            content = tool.get("content", "")
            action = tool.get("action", "")
            if content:
                yield {
                    "type": "tool",
                    "content": content,
                    "action": action,
                    "done": action == "final",
                }

        elif "agentSimpleResult" in data:
            result = data["agentSimpleResult"]
            summary = result.get("summary", "")
            if summary:
                yield {
                    "type": "content",
                    "content": summary,
                    "done": True,
                }

        elif "agentStatus" in data:
            status = data["agentStatus"]
            if status.get("success"):
                yield {
                    "type": "status",
                    "done": True,
                }

        elif "new_chat" in data:
            # 模型选择
            pass

        elif "content" in data:
            yield {
                "type": "content",
                "content": data.get("content", ""),
                "done": data.get("done", False),
            }

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
