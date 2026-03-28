"""纳米AI平台适配器

纳米AI (n.cn) - 360旗下AI助手

API 端点: https://bot.n.cn/api/nami_ai/chat
能力: chat, search, tools
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.base import PlatformAdapter
from src.platforms.namiai.client import NamiAIClient, MODELS, CAPS

logger = logging.getLogger(__name__)


class NamiAIAdapter(PlatformAdapter):
    """纳米AI平台适配器

    基于火山引擎豆包模型，支持多智能体和工具调用。
    提供智能对话、知识库搜索等功能。
    """

    def __init__(self) -> None:
        self._client: Optional[NamiAIClient] = None
        self._candidate: Optional[Candidate] = None

    @property
    def name(self) -> str:
        return "namiai"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        self._client = NamiAIClient()
        self._candidate = Candidate(
            id=make_id("namiai"),
            platform="namiai",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        logger.info("纳米AI适配器初始化完成")

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
            model: 模型名称
            stream: 是否流式输出
            thinking: 是否启用思考模式
            search: 是否启用搜索功能
            **kwargs: 其他参数
                - agent_id: 智能体ID

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
        agent_id = kwargs.get("agent_id")
        conversation_id = kwargs.get("conversation_id")

        try:
            async for chunk in self._client.chat(
                query=user_query,
                conversation_id=conversation_id,
                agent_id=agent_id,
                stream=stream,
            ):
                if "error" in chunk and chunk.get("error"):
                    yield {"error": chunk["error"], "done": True}
                    return

                msg_type = chunk.get("type", "")
                content = chunk.get("content", "")
                done = chunk.get("done", False)

                # 跳过初始化消息
                if msg_type in ("conversation_init", "message_init"):
                    continue

                # 处理不同类型的内容
                if msg_type == "reasoning":
                    if thinking:
                        yield {"reasoning": content, "done": done}
                    continue

                elif msg_type == "tool":
                    # 工具调用状态
                    action = chunk.get("action", "")
                    if action == "final":
                        yield content
                    continue

                elif msg_type == "status":
                    if done:
                        yield {"done": True}
                        return
                    continue

                elif msg_type == "content":
                    if content:
                        yield content

                if done:
                    yield {"done": True}
                    return

        except Exception as e:
            logger.error(f"NamiAI complete error: {e}")
            yield {"error": str(e), "done": True}

    async def close(self) -> None:
        """关闭适配器"""
        if self._client:
            await self._client.close()
            self._client = None
