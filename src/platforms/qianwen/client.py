"""通义千问客户端"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

BASE_URL = "https://chat2-api.qianwen.com"


class QianwenClient:
    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._accounts: List[Dict[str, Any]] = []
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        await self._load_accounts()
        logger.info("通义千问客户端初始化: %d 账号", len(self._accounts))

    async def _load_accounts(self) -> None:
        from src.platforms.qianwen.accounts import ACCOUNTS
        for ident, pwd in ACCOUNTS.items():
            self._accounts.append({"identifier": ident, "token": "", "busy": False})

    async def candidates(self) -> List[Candidate]:
        from src.platforms.qianwen.adapter import CAPS, MODELS
        async with self._lock:
            return [
                Candidate(
                    id=make_id("qianwen"),
                    platform="qianwen",
                    resource_id=a["identifier"][:12],
                    models=MODELS,
                    available=not a["busy"],
                    meta={"identifier": a["identifier"]},
                    **CAPS,
                )
                for a in self._accounts
            ]

    async def ensure_candidates(self, count: int) -> int:
        return len(self._accounts)

    async def complete(
        self, candidate, messages, model, stream, *, thinking=False, search=False, **kw
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        headers = {"Content-Type": "application/json", "Accept": "text/event-stream"}
        payload = {"messages": messages, "model": model, "stream": stream}

        async with self._session.post(
            f"{BASE_URL}/api/v2/chat",
            headers=headers,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=600),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"HTTP {resp.status}")
            async for line in resp.content:
                line_text = line.decode("utf-8", errors="ignore").strip()
                if line_text.startswith("data:"):
                    data_str = line_text[5:].strip()
                    if data_str == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        for msg in data.get("data", {}).get("messages", []):
                            if msg.get("mime_type") == "multi_load/iframe":
                                content = msg.get("content", "")
                                if content:
                                    yield content
                    except json.JSONDecodeError:
                        continue

    async def close(self) -> None:
        pass
