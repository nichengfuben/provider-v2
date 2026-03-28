"""百度AI搜索平台适配器

百度AI搜索 (chat.baidu.com) - 百度智能搜索

API 端点: https://chat.baidu.com/aichat/api/
能力: chat, search, deep_search
"""

from __future__ import annotations
import logging
from typing import Any, AsyncGenerator, Dict, List, Union
import aiohttp
from src.core.candidate import Candidate, make_id
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = ["smartMode", "deepSearch"]
CAPS = {"chat": True, "search": True}


class BaiduAISearchAdapter(PlatformAdapter):
    def __init__(self) -> None:
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
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        return 1 if self._candidate else 0

    async def complete(
        self, candidate, messages, model, stream, *, thinking=False, search=False, **kw
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        raise NotImplementedError("百度AI搜索需要实现具体API")

    async def close(self) -> None:
        pass
