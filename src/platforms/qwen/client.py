"""Qwen 客户端"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import math
import os
import re
import time
import uuid
from pathlib import Path
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.qwen import util
from src.platforms.qwen.accounts import ACCOUNTS

logger = logging.getLogger(__name__)
PERSIST = "persist/qwen/usage.json"
BASE = "https://chat.qwen.ai"
LOGIN_CONCURRENCY = 5
LOGIN_BATCH = 10
_SSE_RE = re.compile(r"data: (.*?)(?:\n\n|\r\n\r\n)", re.DOTALL)


def _parse_accounts(raw: Any) -> List[Tuple[str, str]]:
    """兼容多种账号格式"""
    result: List[Tuple[str, str]] = []
    seen: set = set()
    if raw is None:
        return result
    if isinstance(raw, dict):
        for k, v in raw.items():
            k2 = str(k).strip().lower()
            if k2 not in seen:
                result.append((str(k).strip(), str(v).strip()))
                seen.add(k2)
        return result
    if not hasattr(raw, "__iter__") or isinstance(raw, str):
        return result
    for item in raw:
        if item is None:
            continue
        if isinstance(item, dict):
            for k, v in item.items():
                k2 = str(k).strip().lower()
                if k2 not in seen:
                    result.append((str(k).strip(), str(v).strip()))
                    seen.add(k2)
        elif isinstance(item, (tuple, list)) and len(item) >= 2:
            k2 = str(item[0]).strip().lower()
            if k2 not in seen:
                result.append((str(item[0]).strip(), str(item[1]).strip()))
                seen.add(k2)
        elif isinstance(item, str):
            k2 = item.strip().lower()
            if k2 not in seen:
                result.append((item.strip(), item.strip()))
                seen.add(k2)
    return result


class QwenClient:
    """Qwen 客户端"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._accounts: Dict[str, Dict[str, Any]] = {}
        self._cookies: Dict[str, Any] = {}
        self._fp: str = ""
        self._lock = asyncio.Lock()
        self._parsed: List[Tuple[str, str]] = []
        self._closing = False

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        Path("persist/qwen").mkdir(parents=True, exist_ok=True)
        self._parsed = _parse_accounts(ACCOUNTS)
        logger.info("Qwen: %d 个账号", len(self._parsed))
        self._load_persist()
        self._fp = util.generate_fingerprint()
        self._cookies = util.generate_cookies(self._fp)
        asyncio.create_task(self._bg_login())
        asyncio.create_task(self._bg_cookie())
        asyncio.create_task(self._bg_persist())

    def _load_persist(self) -> None:
        if not os.path.exists(PERSIST):
            return
        try:
            data = json.loads(Path(PERSIST).read_text())
            valid = {i for i, _ in self._parsed}
            for ident, info in data.get("accounts", {}).items():
                if ident in valid:
                    self._accounts[ident] = info
            saved = data.get("cookies", {})
            if (
                saved.get("ssxmod_itna")
                and time.time() - saved.get("last_refresh", 0) < 900
            ):
                self._cookies = saved
        except Exception as e:
            logger.warning("Qwen 持久化加载失败: %s", e)

    def _save_persist(self) -> None:
        try:
            Path(PERSIST).parent.mkdir(parents=True, exist_ok=True)
            tmp = PERSIST + ".tmp"
            data = json.dumps(
                {
                    "accounts": self._accounts,
                    "cookies": {**self._cookies, "last_refresh": time.time()},
                    "updated": time.time(),
                },
                indent=2,
                ensure_ascii=False,
            )
            Path(tmp).write_text(data, encoding="utf-8")
            for attempt in range(3):
                try:
                    os.replace(tmp, PERSIST)
                    return
                except PermissionError:
                    time.sleep(0.1 * (attempt + 1))
            Path(PERSIST).write_text(data, encoding="utf-8")
            try:
                os.remove(tmp)
            except Exception:
                pass
        except Exception as e:
            logger.warning("Qwen 持久化失败: %s", e)

    async def _bg_persist(self) -> None:
        while not self._closing:
            await asyncio.sleep(60)
            if not self._closing:
                self._save_persist()

    async def _bg_login(self) -> None:
        sem = asyncio.Semaphore(LOGIN_CONCURRENCY)

        async def _do(ident: str, pwd: str) -> None:
            async with sem:
                if self._closing:
                    return
                if ident in self._accounts and self._accounts[ident].get("token"):
                    if await self._validate(ident):
                        return
                try:
                    await self._login(ident, pwd)
                except Exception as e:
                    logger.error("Qwen 登录失败 %s: %s", ident, e)

        for i in range(0, len(self._parsed), LOGIN_BATCH):
            if self._closing:
                break
            batch = self._parsed[i : i + LOGIN_BATCH]
            await asyncio.gather(
                *[_do(id_, pw) for id_, pw in batch], return_exceptions=True
            )

        logged = len([a for a in self._accounts.values() if a.get("token")])
        logger.info("Qwen 登录完成: %d/%d", logged, len(self._parsed))
        self._save_persist()

    async def _validate(self, ident: str) -> bool:
        token = self._accounts.get(ident, {}).get("token")
        if not token:
            return False
        try:
            async with self._session.post(
                f"{BASE}/api/v2/users/user/settings/update",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "source": "web",
                    "x-request-id": str(uuid.uuid4()),
                },
                json={"memory": {"enable_memory": False}},
                timeout=aiohttp.ClientTimeout(total=15),
            ) as resp:
                if resp.status == 200:
                    return True
                self._accounts[ident]["token"] = ""
                return False
        except Exception:
            return False

    async def _login(self, ident: str, pwd: str) -> None:
        async with self._session.post(
            f"{BASE}/api/v1/auths/signin",
            headers={
                "Content-Type": "application/json",
                "Origin": BASE,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            json={"email": ident, "password": hashlib.sha256(pwd.encode()).hexdigest()},
            timeout=aiohttp.ClientTimeout(total=30),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"HTTP {resp.status}: {(await resp.text())[:200]}")
            data = await resp.json(content_type=None)
            async with self._lock:
                self._accounts[ident] = {
                    "token": data.get("token", ""),
                    "user_id": data.get("id", ""),
                    "expires": data.get("expires_at", 0),
                    "busy": False,
                }
            logger.info("Qwen 登录成功: %s", ident)

    async def _bg_cookie(self) -> None:
        while not self._closing:
            await asyncio.sleep(900)
            if not self._closing:
                self._fp = util.generate_fingerprint()
                self._cookies = util.generate_cookies(self._fp)

    async def _create_chat(self, token: str, model: str) -> str:
        async with self._session.post(
            f"{BASE}/api/v2/chats/new",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "source": "web",
                "Origin": BASE,
                "x-request-id": str(uuid.uuid4()),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
            },
            json={
                "title": "新建对话",
                "models": [model],
                "chat_mode": "local",
                "chat_type": "t2t",
                "timestamp": int(time.time() * 1000),
                "is_temp": True,
            },
            timeout=aiohttp.ClientTimeout(total=15),
        ) as resp:
            raw = await resp.text()
            if resp.status != 200:
                raise Exception(f"创建 Chat HTTP {resp.status}: {raw[:200]}")
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                raise Exception(f"创建 Chat 非 JSON: {raw[:200]}")
            if not data.get("success"):
                raise Exception(f"创建 Chat 失败: {raw[:200]}")
            cid = data.get("data", {}).get("id")
            if not cid:
                raise Exception("创建 Chat 无 id")
            return cid

    async def candidates(self) -> List[Candidate]:
        from src.platforms.qwen.adapter import CAPS, MODELS

        async with self._lock:
            return [
                Candidate(
                    id=make_id("qwen"),
                    platform="qwen",
                    resource_id=ident[:12],
                    models=MODELS,
                    available=not info.get("busy", False),
                    meta={
                        "ident": ident,
                        "token": info["token"],
                        "user_id": info.get("user_id", ""),
                    },
                    **CAPS,
                )
                for ident, info in self._accounts.items()
                if info.get("token") and not info.get("busy", False)
            ]

    async def ensure_candidates(self, count: int) -> int:
        for _ in range(20):
            async with self._lock:
                avail = len(
                    [
                        a
                        for a in self._accounts.values()
                        if a.get("token") and not a.get("busy")
                    ]
                )
            if avail > 0:
                return avail
            await asyncio.sleep(0.5)
        return 0

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        ident = candidate.meta["ident"]
        token = candidate.meta["token"]
        async with self._lock:
            if ident in self._accounts:
                self._accounts[ident]["busy"] = True
        try:
            chat_id = await self._create_chat(token, model)
            fc = util.build_feature_config(thinking, search)
            fid, child_id = str(uuid.uuid4()), str(uuid.uuid4())
            prompt = self._extract_prompt(messages)
            payload = {
                "stream": True,
                "version": "2.1",
                "incremental_output": True,
                "chat_id": chat_id,
                "chat_mode": "local",
                "model": model,
                "parent_id": None,
                "messages": [
                    {
                        "fid": fid,
                        "parentId": None,
                        "childrenIds": [child_id],
                        "role": "user",
                        "content": prompt,
                        "user_action": "chat",
                        "files": [],
                        "timestamp": int(time.time()),
                        "models": [model],
                        "chat_type": "t2t",
                        "feature_config": fc,
                        "extra": {"meta": {"subChatType": "t2t"}},
                        "sub_chat_type": "t2t",
                        "parent_id": None,
                    }
                ],
                "timestamp": int(time.time() * 1000),
                "is_temp": True,
            }
            bxua = util.generate_bxua(self._fp)
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Accept": "text/event-stream",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Connection": "keep-alive",
                "Origin": BASE,
                "Referer": f"{BASE}/c/{chat_id}",
                "Cookie": f"ssxmod_itna={self._cookies.get('ssxmod_itna', '')};ssxmod_itna2={self._cookies.get('ssxmod_itna2', '')}",
                "Timezone": f"{time.strftime('%a %b %d %Y %H:%M:%S')} GMT+0800",
                "source": "web",
                "bx-v": "2.5.36",
                "bx-ua": bxua,
                "X-Accel-Buffering": "no",
                "X-Request-Id": str(uuid.uuid4()),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
            }
            async with self._session.post(
                f"{BASE}/api/v2/chat/completions?chat_id={chat_id}",
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=600),
            ) as resp:
                if resp.status != 200:
                    raise Exception(
                        f"Qwen HTTP {resp.status}: {(await resp.text())[:300]}"
                    )
                buffer = ""
                async for raw_chunk in resp.content.iter_any():
                    if not raw_chunk:
                        continue
                    buffer += raw_chunk.decode("utf-8", errors="ignore")
                    while True:
                        m = _SSE_RE.search(buffer)
                        if not m:
                            break
                        ds = m.group(1).strip()
                        buffer = buffer[m.end() :]
                        if ds == "[DONE]":
                            return
                        try:
                            data = json.loads(ds)
                        except json.JSONDecodeError:
                            continue
                        if data.get("usage"):
                            yield {"usage": data["usage"]}
                        choices = data.get("choices", [])
                        if not choices:
                            continue
                        delta = choices[0].get("delta", {})
                        content = delta.get("content", "")
                        phase = delta.get("phase")
                        extra = delta.get("extra", {})
                        if content:
                            if phase in ("answer", None, ""):
                                yield content
                            elif phase == "thinking_summary":
                                st = extra.get("summary_title", {}).get("content", [])
                                sg = extra.get("summary_thought", {}).get("content", [])
                                yield {
                                    "thinking": "\n".join(st + sg)
                                    if (st or sg)
                                    else content
                                }
                            elif phase == "image_gen":
                                yield {"image_gen": content}
                            elif phase in ("ResearchNotice", "ResearchPlanning"):
                                yield {
                                    "deep_research": {
                                        "content": content,
                                        "stage": phase,
                                    }
                                }
                            elif phase == "video_gen":
                                yield {"video_gen": content}
                            else:
                                yield content
        finally:
            async with self._lock:
                if ident in self._accounts:
                    self._accounts[ident]["busy"] = False

    @staticmethod
    def _extract_prompt(messages: List[Dict]) -> str:
        if not messages:
            return ""
        lc = messages[-1].get("content", "")
        if isinstance(lc, str):
            return lc
        if isinstance(lc, list):
            return "\n".join(
                p.get("text", "")
                for p in lc
                if isinstance(p, dict) and p.get("type") == "text"
            )
        return str(lc)

    async def close(self) -> None:
        self._closing = True
        self._save_persist()
