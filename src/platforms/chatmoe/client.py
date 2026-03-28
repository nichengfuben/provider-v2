"""ChatMoe 客户端"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.chatmoe.accounts import API_KEYS
from src.platforms.chatmoe.util import CHATMOE_URL, HEADERS, build_payload

logger = logging.getLogger(__name__)
MAX_RETRIES = 3


class ChatmoeClient:
    def __init__(self) -> None:
        self._session: Any = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        logger.info("ChatMoe 初始化完成")

    async def candidates(self) -> List[Candidate]:
        from src.platforms.chatmoe.adapter import CAPS, MODELS

        return [
            Candidate(
                id=make_id("chatmoe"),
                platform="chatmoe",
                resource_id=k[:12],
                models=MODELS,
                meta={"api_key": k},
                **CAPS,
            )
            for k in API_KEYS
        ]

    async def ensure_candidates(self, count: int) -> int:
        return len(API_KEYS)

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
        payload = build_payload(messages, thinking, search)
        last_exc: Exception | None = None
        for attempt in range(MAX_RETRIES + 1):
            if attempt > 0:
                await asyncio.sleep(1.0 * (2 ** (attempt - 1)))
            try:
                async for chunk in self._do_request(payload, thinking):
                    yield chunk
                return
            except Exception as e:
                last_exc = e
                logger.warning("ChatMoe 重试 %d/%d: %s", attempt + 1, MAX_RETRIES, e)
        if last_exc:
            raise last_exc

    async def _do_request(
        self,
        payload: Dict,
        thinking: bool,
    ) -> AsyncGenerator[Union[str, Dict], None]:
        async with self._session.post(
            CHATMOE_URL,
            json=payload,
            headers=HEADERS,
            ssl=False,
            timeout=aiohttp.ClientTimeout(connect=10, total=300),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"ChatMoe HTTP {resp.status}: {await resp.text()}")
            thinking_started = False
            thinking_ended = False
            async for line in resp.content:
                if not line:
                    continue
                text = line.decode("utf-8", errors="replace").strip()
                if not text or not text.startswith("data:"):
                    continue
                data_str = text[5:].strip()
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                except json.JSONDecodeError:
                    continue
                choices = data.get("choices", [])
                if not choices:
                    continue
                delta = choices[0].get("delta", {})
                rc = delta.get("reasoning_content")
                content = delta.get("content")
                if thinking and rc:
                    if not thinking_started:
                        yield {"thinking": "<think>"}
                        thinking_started = True
                    yield {"thinking": rc}
                if content:
                    if thinking and thinking_started and not thinking_ended:
                        yield {"thinking": "</" + "think>\n\n"}
                        thinking_ended = True
                    yield content
                if data.get("usage"):
                    yield {"usage": data["usage"]}

    async def close(self) -> None:
        pass
