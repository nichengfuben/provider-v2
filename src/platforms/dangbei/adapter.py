"""DangBei AI 平台适配器

当贝AI (ai.dangbei.com) - 多模型聚合平台

注意：该平台不提供公开的 REST API，仅支持网页端使用。
本适配器保留用于未来可能的 API 开放。

支持模型（网页端）：
- DeepSeek-R1 671B (满血版)
- 豆包 (Doubao)
- 通义千问 (Qwen)
- 智谱 (GLM)

能力：chat, thinking
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = [
    "deepseek-r1-671b",
    "doubao",
    "qwen",
    "glm",
]

CAPS = {
    "chat": True,
    "thinking": True,
}


class DangBeiAdapter(PlatformAdapter):
    """当贝AI平台适配器

    注意：该平台目前不提供公开API，仅支持网页端使用。
    此适配器保留用于未来API可能的开放。
    """

    def __init__(self) -> None:
        self._candidate: Optional[Candidate] = None

    @property
    def name(self) -> str:
        return "dangbei"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        logger.warning(
            "DangBei AI 目前不提供公开API，仅支持网页端使用。"
            "访问 https://ai.dangbei.com 使用。"
        )
        # 不创建候选项，因为没有可用的API
        logger.info("DangBei 适配器初始化完成（无可用API）")

    async def candidates(self) -> List[Candidate]:
        """返回可用的候选项列表"""
        return []

    async def ensure_candidates(self, count: int) -> int:
        """确保有指定数量的候选项"""
        return 0

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool = True,
        *,
        thinking: bool = False,
        search: bool = False,
        **kwargs: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """处理聊天完成请求

        注意：该平台目前不提供公开API。
        """
        yield {
            "error": "DangBei AI 目前不提供公开API，请访问 https://ai.dangbei.com 使用网页版",
            "done": True,
        }

    async def close(self) -> None:
        """关闭适配器"""
        pass
