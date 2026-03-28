"""DeepSeek 客户端"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import secrets
import time
from pathlib import Path
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.deepseek import util
from src.platforms.deepseek.accounts import ACCOUNTS

logger = logging.getLogger(__name__)
PERSIST = "persist/deepseek/usage.json"


class DeepseekClient:
    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._pow = util.WasmPow()
        self._accounts: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        Path("persist/deepseek").mkdir(parents=True, exist_ok=True)
        asyncio.create_task(util.download_wasm(session))
        asyncio.create_task(self._bg_init())
        asyncio.create_task(self._bg_wasm_check())

    async def _bg_init(self) -> None:
        for ident, pwd in ACCOUNTS.items():
            try:
                await self._login(ident, pwd)
            except Exception as e:
                logger.error("DeepSeek 登录失败 %s: %s", ident, e)

    async def _bg_wasm_check(self) -> None:
        while True:
            await asyncio.sleep(86400)
            try:
                await util.download_wasm(self._session)
                self._pow = util.WasmPow()
            except Exception as e:
                logger.warning("WASM 更新失败: %s", e)

    async def _login(self, identifier: str, password: str) -> None:
        is_email = "@" in identifier
        data = {
            "email": identifier if is_email else "",
            "mobile": "" if is_email else identifier,
            "password": password,
            "area_code": "" if is_email else "+86",
            "device_id": util.make_device_id(),
            "os": "web",
        }
        headers = util.build_headers("")
        async with self._session.post(
            f"https://{util.DEFAULT_HOST}/api/v0/users/login",
            headers=headers,
            json=data,
            timeout=aiohttp.ClientTimeout(total=30),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"HTTP {resp.status}")
            result = await resp.json()
            if result.get("code") != 0:
                raise Exception(str(result))
            user = result["data"]["biz_data"]["user"]
            async with self._lock:
                self._accounts[identifier] = {
                    "token": user["token"],
                    "user_id": user.get("id", ""),
                    "busy": False,
                    "last_used": 0.0,
                }
            logger.info("DeepSeek 登录成功: %s", identifier)

    async def candidates(self) -> List[Candidate]:
        from src.platforms.deepseek.adapter import CAPS, MODELS

        async with self._lock:
            return [
                Candidate(
                    id=make_id("deepseek"),
                    platform="deepseek",
                    resource_id=ident,
                    models=MODELS,
                    available=not info["busy"],
                    meta={"identifier": ident, **info},
                    **CAPS,
                )
                for ident, info in self._accounts.items()
                if info.get("token")
            ]

    async def ensure_candidates(self, count: int) -> int:
        async with self._lock:
            return len(
                [a for a in self._accounts.values() if a.get("token") and not a["busy"]]
            )

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
        ident = candidate.meta["identifier"]
        token = candidate.meta["token"]

        # deepseek-chat + thinking=true → 内部用 deepseek-reasoner
        actual_model = model
        if model == "deepseek-chat" and thinking:
            actual_model = "deepseek-reasoner"

        # 创建会话
        headers = util.build_headers(token)
        async with self._session.post(
            f"https://{util.DEFAULT_HOST}/api/v0/chat_session/create",
            headers=headers,
            json={},
            timeout=aiohttp.ClientTimeout(total=30),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"会话创建失败 HTTP {resp.status}")
            sd = await resp.json()
            session_id = sd["data"]["biz_data"]["id"]

        prompt = self._build_prompt(messages)

        pow_resp = (
            await util.get_pow_response(self._session, token, self._pow)
            if self._pow.available
            else ""
        )

        parser = util.StreamParser(include_thinking=thinking)
        headers = util.build_headers(token, session_id)
        if pow_resp:
            headers["x-ds-pow-response"] = pow_resp
        payload = {
            "chat_session_id": session_id,
            "parent_message_id": None,
            "prompt": prompt,
            "ref_file_ids": [],
            "thinking_enabled": thinking,
            "search_enabled": search,
            "client_stream_id": util.make_stream_id(),
        }

        continue_count = 0
        async with self._session.post(
            f"https://{util.DEFAULT_HOST}/api/v0/chat/completion",
            headers=headers,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=600),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"聊天失败 HTTP {resp.status}")
            needs_continue = False
            async for chunk in self._parse_stream(resp, parser):
                if chunk.get("needs_continue"):
                    needs_continue = True
                elif chunk.get("type") not in ("event", "status"):
                    yield self._translate(chunk)

        while needs_continue and continue_count < util.MAX_CONTINUE:
            continue_count += 1
            mid = parser.message_id
            if mid is None:
                break
            await asyncio.sleep(0.1)
            ch = util.build_headers(token, session_id)
            cp = {
                "chat_session_id": session_id,
                "message_id": mid,
                "fallback_to_resume": True,
            }
            async with self._session.post(
                f"https://{util.DEFAULT_HOST}/api/v0/chat/continue",
                headers=ch,
                json=cp,
                timeout=aiohttp.ClientTimeout(total=600),
            ) as cr:
                if cr.status != 200:
                    break
                needs_continue = False
                async for chunk in self._parse_stream(cr, parser):
                    if chunk.get("needs_continue"):
                        needs_continue = True
                    elif chunk.get("type") not in ("event", "status"):
                        yield self._translate(chunk)

    async def _parse_stream(
        self, resp: Any, parser: util.StreamParser
    ) -> AsyncGenerator[Dict, None]:
        buf = ""
        async for chunk in resp.content.iter_chunked(1024):
            if chunk:
                buf += chunk.decode("utf-8", errors="ignore")
                lines = buf.split("\n")
                buf = lines[-1]
                for line in lines[:-1]:
                    if line.strip():
                        r = parser.parse_line(line)
                        if r:
                            yield r
        if buf.strip():
            r = parser.parse_line(buf)
            if r:
                yield r

    @staticmethod
    def _translate(chunk: Dict) -> Union[str, Dict]:
        t = chunk.get("type")
        if t == "content":
            return chunk.get("content", "")
        if t == "thinking":
            return {"thinking": chunk.get("content", "")}
        return chunk

    @staticmethod
    def _build_prompt(messages: List[Dict]) -> str:
        parts = []
        for m in messages:
            role = m.get("role", "user")
            c = m.get("content", "")
            if isinstance(c, list):
                c = "\n".join(
                    p.get("text", "")
                    for p in c
                    if isinstance(p, dict) and p.get("type") == "text"
                )
            if role == "system":
                parts.append(f"系统指令: {c}")
            elif role == "user":
                parts.append(f"用户: {c}")
            elif role == "assistant":
                parts.append(f"助手: {c}")
            elif role == "tool":
                parts.append(f"工具结果: {c}")
        return "\n\n".join(parts)

    async def close(self) -> None:
        pass
