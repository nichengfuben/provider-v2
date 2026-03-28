"""GLM 客户端"""

from __future__ import annotations

import asyncio
import json
import logging
import math
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.platforms.glm import util

logger = logging.getLogger(__name__)
POOL_SIZE = 20
PREFETCH_THRESHOLD = 10


class GlmClient:
    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._tokens: List[Dict[str, Any]] = []
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        asyncio.create_task(self._bg_prefetch())
        asyncio.create_task(self._bg_cleanup())

    async def _fetch_token(self) -> Optional[Dict[str, Any]]:
        try:
            async with self._session.post(
                f"{util.BASE}/api/v1/auths",
                headers={"Content-Type": "application/json"},
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                if resp.status != 200:
                    return None
                data = await resp.json()
                token = data.get("token", "")
                if not token:
                    return None
                uid = data.get("id") or util.jwt_payload(token).get("id", "")
                now = time.time()
                return {
                    "token": token,
                    "user_id": uid,
                    "email": data.get("email", ""),
                    "created": now,
                    "expires": now + util.TOKEN_TTL,
                    "busy": False,
                }
        except Exception as e:
            logger.debug("GLM Token 获取失败: %s", e)
            return None

    async def _bg_prefetch(self) -> None:
        await self._fill(POOL_SIZE)
        while True:
            await asyncio.sleep(30)
            async with self._lock:
                self._tokens = [t for t in self._tokens if time.time() < t["expires"]]
                avail = len(
                    [
                        t
                        for t in self._tokens
                        if not t["busy"] and time.time() < t["expires"]
                    ]
                )
            if avail < PREFETCH_THRESHOLD:
                await self._fill(POOL_SIZE - avail)

    async def _bg_cleanup(self) -> None:
        while True:
            await asyncio.sleep(60)
            async with self._lock:
                before = len(self._tokens)
                self._tokens = [t for t in self._tokens if time.time() < t["expires"]]
                cleaned = before - len(self._tokens)
                if cleaned:
                    logger.debug("GLM 清理 %d 过期 Token", cleaned)

    async def _fill(self, count: int) -> None:
        if count <= 0:
            return
        sem = asyncio.Semaphore(5)

        async def _one():
            async with sem:
                return await self._fetch_token()

        results = await asyncio.gather(
            *[_one() for _ in range(count)], return_exceptions=True
        )
        added = 0
        async with self._lock:
            for r in results:
                if isinstance(r, dict):
                    self._tokens.append(r)
                    added += 1
        if added:
            logger.info("GLM 预取 %d Token, 总数 %d", added, len(self._tokens))

    async def candidates(self) -> List[Candidate]:
        from src.platforms.glm.adapter import CAPS, MODELS

        async with self._lock:
            return [
                Candidate(
                    id=make_id("glm"),
                    platform="glm",
                    resource_id=t["user_id"][:12],
                    models=MODELS,
                    available=not t["busy"],
                    meta={"token": t["token"], "user_id": t["user_id"]},
                    **CAPS,
                )
                for t in self._tokens
                if time.time() < t["expires"] and not t["busy"]
            ]

    async def ensure_candidates(self, count: int) -> int:
        async with self._lock:
            avail = len(
                [
                    t
                    for t in self._tokens
                    if not t["busy"] and time.time() < t["expires"]
                ]
            )
        if avail < count:
            need = math.ceil((count + 1) / 2) * 2 - len(self._tokens)
            if need > 0:
                await self._fill(need)
        async with self._lock:
            return len(
                [
                    t
                    for t in self._tokens
                    if not t["busy"] and time.time() < t["expires"]
                ]
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
        token = candidate.meta["token"]
        uid = candidate.meta["user_id"]
        url, headers, payload = util.build_request(
            token,
            uid,
            messages,
            model,
            thinking=thinking,
            search=search,
            stream=True,
        )
        raw_len = 0
        think_done = False
        async with self._session.post(
            url,
            json=payload,
            headers=headers,
            timeout=aiohttp.ClientTimeout(total=180),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"GLM HTTP {resp.status}: {(await resp.text())[:500]}")
            latest_usage: Optional[Dict] = None
            async for raw_line in resp.content:
                if not raw_line:
                    continue
                line = raw_line.decode("utf-8", errors="replace").strip()
                if not line or not line.startswith("data:"):
                    continue
                ds = line[5:].strip()
                if ds == "[DONE]":
                    break
                try:
                    chunk = json.loads(ds)
                except json.JSONDecodeError:
                    continue
                if chunk.get("type") != "chat:completion":
                    continue
                d = chunk.get("data", {})
                phase = d.get("phase", "other")
                delta = d.get("delta_content")
                ec = d.get("edit_content")
                ei = d.get("edit_index")
                usage = d.get("usage")
                done = d.get("done", False)
                if usage:
                    latest_usage = usage
                if ec is not None and ei is not None:
                    ac = max(0, raw_len - ei)
                    new = ec[ac:]
                    raw_len = ei + len(ec)
                    if not new:
                        if done:
                            break
                        continue
                    if not think_done:
                        tp, ap = util.split_details(new)
                        if ap or "</details>" in new:
                            think_done = True
                            tc = util.clean_thinking(tp)
                            if tc:
                                yield {"thinking": tc}
                            if ap:
                                yield ap
                        else:
                            tc = util.clean_thinking(new)
                            if tc:
                                yield {"thinking": tc}
                    else:
                        yield new
                    if done:
                        break
                    continue
                if delta:
                    raw_len += len(delta)
                    if phase == "thinking" and not think_done:
                        c = util.clean_thinking(delta)
                        if c:
                            yield {"thinking": c}
                    elif phase == "answer":
                        think_done = True
                        yield delta
                if done:
                    break
            if latest_usage:
                yield {"usage": latest_usage}

    async def close(self) -> None:
        pass
