"""ChatGLM 客户端

智谱清言 API 实现

API 格式: SSE 流式响应
端点: https://chatglm.cn/chatglm/backend-api/assistant/stream
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.chatglm import util

logger = logging.getLogger(__name__)

BASE_URL = "https://chatglm.cn"


class ChatGLMClient:
    """ChatGLM API 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._tokens: List[Dict[str, Any]] = []
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        # 加载账号
        await self._load_accounts()
        logger.info("ChatGLM 客户端初始化完成，%d 个账号", len(self._tokens))

    async def _load_accounts(self) -> None:
        """加载账号"""
        from src.platforms.chatglm.accounts import ACCOUNTS

        for ident, pwd in ACCOUNTS.items():
            try:
                token = await self._login(ident, pwd)
                if token:
                    self._tokens.append({
                        "identifier": ident,
                        "token": token,
                        "busy": False,
                    })
            except Exception as e:
                logger.error("ChatGLM 登录失败 %s: %s", ident, e)

    async def _login(self, identifier: str, password: str) -> Optional[str]:
        """登录获取 token"""
        # 实现登录逻辑
        # 返回 token
        return None

    async def candidates(self) -> List[Candidate]:
        from src.platforms.chatglm.adapter import CAPS, MODELS

        async with self._lock:
            return [
                Candidate(
                    id=make_id("chatglm"),
                    platform="chatglm",
                    resource_id=t["identifier"][:12],
                    models=MODELS,
                    available=not t["busy"],
                    meta={"identifier": t["identifier"], "token": t["token"]},
                    **CAPS,
                )
                for t in self._tokens
                if t.get("token")
            ]

    async def ensure_candidates(self, count: int) -> int:
        async with self._lock:
            return len([t for t in self._tokens if t.get("token") and not t["busy"]])

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """调用 ChatGLM API"""
        token = candidate.meta["token"]

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        payload = {
            "messages": messages,
            "model": model,
            "stream": stream,
        }

        url = f"{BASE_URL}/chatglm/backend-api/assistant/stream"

        async with self._session.post(
            url,
            headers=headers,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=600),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"ChatGLM HTTP {resp.status}: {await resp.text()[:500]}")

            async for line in resp.content:
                if not line:
                    continue
                line_text = line.decode("utf-8", errors="ignore").strip()
                if not line_text or not line_text.startswith("data:"):
                    continue
                data_str = line_text[5:].strip()
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                except json.JSONDecodeError:
                    continue

                # 解析响应格式
                parts = data.get("parts", [])
                for part in parts:
                    content = part.get("content", [])
                    for c in content:
                        if c.get("type") == "text":
                            text = c.get("text", "")
                            if text:
                                yield text

    async def close(self) -> None:
        pass
