"""秘塔AI搜索平台适配器

秘塔AI搜索 (metaso.cn) - AI搜索引擎

API 端点: https://metaso.cn/api/search/chat
能力: chat, search
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.base import PlatformAdapter
from src.platforms.metaso.client import MetasoClient, MODELS, CAPS

logger = logging.getLogger(__name__)


class MetasoAdapter(PlatformAdapter):
    """秘塔AI搜索平台适配器

    提供多引擎AI搜索和对话功能。
    支持全网搜索、学术搜索、PDF搜索、播客搜索。
    """

    def __init__(self) -> None:
        self._client: Optional[MetasoClient] = None
        self._candidate: Optional[Candidate] = None

    @property
    def name(self) -> str:
        return "metaso"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        self._client = MetasoClient()
        self._candidate = Candidate(
            id=make_id("metaso"),
            platform="metaso",
            resource_id="default",
            models=MODELS,
            meta={},
            **CAPS,
        )
        logger.info("秘塔AI搜索适配器初始化完成")

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
                - engine_type: 搜索引擎类型 (quanwang/pdf/scholar/podcast)
                - mode: 搜索模式 (detail/concise)

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
        engine_type = kwargs.get("engine_type", "quanwang")
        mode = kwargs.get("mode", "detail")
        conversation_id = kwargs.get("conversation_id")

        try:
            async for chunk in self._client.chat(
                query=user_query,
                conversation_id=conversation_id,
                engine_type=engine_type,
                mode=mode,
                stream=stream,
            ):
                if "error" in chunk and chunk.get("error"):
                    yield {"error": chunk["error"], "done": True}
                    return

                msg_type = chunk.get("type", "")
                content = chunk.get("content", "")
                reasoning = chunk.get("reasoning", "")
                done = chunk.get("done", False)
                citations = chunk.get("citations", [])
                highlights = chunk.get("highlights", [])

                # 跳过非内容消息
                if msg_type in ("conversation_init", "response_start", "heartbeat"):
                    continue

                # 如果有推理内容，以特定格式输出
                if reasoning and thinking:
                    yield {"reasoning": reasoning, "content": content, "done": done}
                elif content:
                    yield content

                if done:
                    # 返回最终元数据
                    result: Dict[str, Any] = {"done": True}
                    if citations:
                        result["citations"] = citations
                    if highlights:
                        result["highlights"] = highlights
                    yield result
                    return

        except Exception as e:
            logger.error(f"Metaso complete error: {e}")
            yield {"error": str(e), "done": True}

    async def close(self) -> None:
        """关闭适配器"""
        if self._client:
            await self._client.close()
            self._client = None
