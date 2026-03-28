"""DeepSeek 工具——PoW/StreamParser/设备指纹/文件"""

from __future__ import annotations

import base64
import ctypes
import hashlib
import json
import logging
import os
import re
import secrets
import struct
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

DEFAULT_HOST = "chat.deepseek.com"
WASM_PATH = "persist/deepseek/sha3_wasm_bg.7b9ca65ddd.wasm"
WASM_URL = "https://fe-static.deepseek.com/chat/static/sha3_wasm_bg.7b9ca65ddd.wasm"
WASM_META = "persist/deepseek/wasm_meta.json"
MAX_CONTINUE = 20

COMMON_HEADERS = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "sec-ch-ua": '"Chromium";v="146","Not-A.Brand";v="24","Google Chrome";v="146"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "x-app-version": "20241129.1",
    "x-client-locale": "zh_CN",
    "x-client-platform": "web",
    "x-client-timezone-offset": "28800",
    "x-client-version": "1.6.1",
}


def make_device_id() -> str:
    return base64.b64encode(secrets.token_bytes(32)).decode()


def make_stream_id() -> str:
    return f"{datetime.now().strftime('%Y%m%d')}-{secrets.token_hex(8)}"


def build_headers(token: str, session_id: str = "") -> Dict[str, str]:
    h = {
        **COMMON_HEADERS,
        "authorization": f"Bearer {token}",
        "origin": f"https://{DEFAULT_HOST}",
    }
    h["referer"] = (
        f"https://{DEFAULT_HOST}/a/chat/s/{session_id}"
        if session_id
        else f"https://{DEFAULT_HOST}/"
    )
    return h


class WasmPow:
    """WASM PoW 求解器"""

    ALGO = "DeepSeekHashV1"

    def __init__(self) -> None:
        self._bytes: Optional[bytes] = None
        try:
            from wasmtime import Linker, Module, Store

            self._available = os.path.exists(WASM_PATH)
        except ImportError:
            self._available = False

    @property
    def available(self) -> bool:
        return self._available

    def _load(self) -> bytes:
        if self._bytes is None:
            self._bytes = Path(WASM_PATH).read_bytes()
        return self._bytes

    def solve(self, challenge: str, salt: str, difficulty: int, expire_at: int) -> int:
        from wasmtime import Linker, Module, Store

        prefix = f"{salt}_{expire_at}_"
        store = Store()
        linker = Linker(store.engine)
        module = Module(store.engine, self._load())
        inst = linker.instantiate(store, module)
        ex = inst.exports(store)
        mem, add_sp = ex["memory"], ex["__wbindgen_add_to_stack_pointer"]
        alloc, wasm_solve = ex["__wbindgen_export_0"], ex["wasm_solve"]

        def _w(off: int, data: bytes) -> None:
            base = ctypes.cast(mem.data_ptr(store), ctypes.c_void_p).value
            ctypes.memmove(base + off, data, len(data))

        def _r(off: int, sz: int) -> bytes:
            base = ctypes.cast(mem.data_ptr(store), ctypes.c_void_p).value
            return ctypes.string_at(base + off, sz)

        def _enc(text: str) -> Tuple[int, int]:
            d = text.encode()
            ln = len(d)
            pv = alloc(store, ln, 1)
            p = int(pv.value) if hasattr(pv, "value") else int(pv)
            _w(p, d)
            return p, ln

        ret = add_sp(store, -16)
        try:
            pc, lc = _enc(challenge)
            pp, lp = _enc(prefix)
            wasm_solve(store, ret, pc, lc, pp, lp, float(difficulty))
            st = struct.unpack("<i", _r(ret, 4))[0]
            val = struct.unpack("<d", _r(ret + 8, 8))[0]
            if st == 0:
                raise RuntimeError("WASM 求解失败")
            return int(val)
        finally:
            add_sp(store, 16)


async def get_pow_response(session: Any, token: str, pow_solver: WasmPow) -> str:
    """获取 PoW 响应"""
    if not pow_solver.available:
        return ""
    import aiohttp

    headers = {**COMMON_HEADERS, "authorization": f"Bearer {token}"}
    try:
        async with session.post(
            f"https://{DEFAULT_HOST}/api/v0/chat/create_pow_challenge",
            headers=headers,
            json={"target_path": "/api/v0/chat/completion"},
            timeout=aiohttp.ClientTimeout(total=30),
        ) as resp:
            if resp.status != 200:
                return ""
            data = await resp.json()
            if data.get("code") != 0:
                return ""
            cd = data["data"]["biz_data"]["challenge"]
            if cd["algorithm"] != WasmPow.ALGO:
                return ""
            ans = pow_solver.solve(
                cd["challenge"],
                cd["salt"],
                cd.get("difficulty", 144000),
                cd.get("expire_at", int(time.time()) + 600),
            )
            pd = {
                "algorithm": cd["algorithm"],
                "challenge": cd["challenge"],
                "salt": cd["salt"],
                "answer": ans,
                "signature": cd["signature"],
                "target_path": "/api/v0/chat/completion",
            }
            return base64.b64encode(
                json.dumps(pd, separators=(",", ":"), ensure_ascii=False).encode()
            ).decode()
    except Exception as e:
        logger.warning("PoW 失败: %s", e)
        return ""


async def download_wasm(session: Any) -> None:
    """下载/更新 WASM"""
    Path("persist/deepseek").mkdir(parents=True, exist_ok=True)
    need = not os.path.exists(WASM_PATH)
    if not need and os.path.exists(WASM_META):
        try:
            meta = json.loads(Path(WASM_META).read_text())
            if time.time() - meta.get("downloaded_at", 0) > 86400:
                need = True
        except Exception:
            need = True
    if not need:
        return
    import aiohttp

    try:
        async with session.get(
            WASM_URL,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
                "Referer": "",
            },
        ) as resp:
            if resp.status != 200:
                logger.warning("WASM 下载失败: HTTP %d", resp.status)
                return
            content = await resp.read()
            sha = hashlib.sha256(content).hexdigest()
            if os.path.exists(WASM_PATH):
                old = hashlib.sha256(Path(WASM_PATH).read_bytes()).hexdigest()
                if old == sha:
                    Path(WASM_META).write_text(
                        json.dumps({"downloaded_at": time.time(), "sha256": sha})
                    )
                    return
            tmp = WASM_PATH + ".tmp"
            with open(tmp, "wb") as f:
                f.write(content)
            os.replace(tmp, WASM_PATH)
            Path(WASM_META).write_text(
                json.dumps(
                    {"downloaded_at": time.time(), "sha256": sha, "size": len(content)}
                )
            )
            logger.info("WASM 已更新: %d bytes", len(content))
    except Exception as e:
        logger.warning("WASM 下载异常: %s", e)


@dataclass
class SearchResult:
    url: str
    title: str
    snippet: str
    cite_index: int


class StreamParser:
    """DeepSeek 流式响应解析器"""

    def __init__(self, include_thinking: bool = False) -> None:
        self._inc = include_thinking
        self._content = ""
        self._think = ""
        self._msg_id: Optional[int] = None
        self._parent_id: Optional[int] = None
        self._status = "WIP"
        self._is_think = False
        self._think_started = False
        self._search: Dict[int, SearchResult] = {}
        self._cite_buf = ""
        self._first = False
        self._tok_usage = 0

    @property
    def status(self) -> str:
        return self._status

    @property
    def message_id(self) -> Optional[int]:
        return self._msg_id

    def _replace_cit(self, t: str) -> str:
        def _rep(m):
            i = int(m.group(1))
            return self._search[i].url if i in self._search else m.group(0)

        return re.sub(r"\[citation:(\d+)\]", _rep, t)

    def _proc_cite(self, chunk: str) -> Tuple[str, str]:
        self._cite_buf += chunk
        result = ""
        buf = self._cite_buf
        while buf:
            m = re.search(r"\[citation:(\d+)\]", buf)
            if m:
                result += buf[: m.start()]
                i = int(m.group(1))
                result += self._search[i].url if i in self._search else m.group(0)
                buf = buf[m.end()]
            else:
                inc = re.search(r"\[c?i?t?a?t?i?o?n?:?\d*\]?$", buf)
                if inc:
                    result += buf[: inc.start()]
                    self._cite_buf = buf[inc.start() :]
                    return result, self._cite_buf
                result += buf
                buf = ""
        self._cite_buf = ""
        return result, ""

    def parse_line(self, line: str) -> Optional[Dict[str, Any]]:
        line = line.strip()
        if not line:
            return None
        if line.startswith("event:"):
            ev = line[7:].strip()
            if ev == "finish":
                if self._cite_buf:
                    rem = self._cite_buf
                    self._cite_buf = ""
                    if self._is_think and self._inc:
                        self._is_think = False
                        return {"type": "thinking", "content": rem + "</" + "think>\n"}
                    return {"type": "content", "content": rem}
                if self._is_think and self._inc:
                    self._is_think = False
                    return {"type": "thinking", "content": "</" + "think>\n"}
                return {"type": "event", "event": "finish"}
            return None
        if not line.startswith("data:"):
            return None
        try:
            data = json.loads(line[6:])
        except json.JSONDecodeError:
            return None
        if not isinstance(data, dict):
            return None
        return self._proc(data)

    def _proc(self, data: Dict) -> Optional[Dict]:
        if "response_message_id" in data:
            self._msg_id = data["response_message_id"]
        if "request_message_id" in data:
            self._parent_id = data["request_message_id"]
        if "v" in data and isinstance(data["v"], dict) and "response" in data["v"]:
            rd = data["v"]["response"]
            if "message_id" in rd:
                self._msg_id = rd["message_id"]
            if "status" in rd:
                self._status = rd["status"]
            if "accumulated_token_usage" in rd:
                self._tok_usage = rd["accumulated_token_usage"]
            for frag in rd.get("fragments", []):
                if frag.get("type") == "SEARCH" and "results" in frag:
                    self._ext_search(frag["results"])
        p = data.get("p", "")
        v = data.get("v")
        o = data.get("o")
        if p == "response/status" and v:
            self._status = v
            if v == "FINISHED":
                if self._is_think and self._inc:
                    self._is_think = False
                    return {"type": "thinking", "content": "</" + "think>\n"}
                return {"type": "status", "status": "FINISHED"}
            if v == "INCOMPLETE":
                return {
                    "type": "status",
                    "status": "INCOMPLETE",
                    "needs_continue": True,
                }
        if p == "response" and o == "BATCH" and isinstance(v, list):
            for op in v:
                if isinstance(op, dict):
                    if op.get("p") == "accumulated_token_usage":
                        self._tok_usage = op.get("v", 0)
                    if op.get("p") == "quasi_status" and op.get("v") == "INCOMPLETE":
                        return {
                            "type": "status",
                            "status": "INCOMPLETE",
                            "needs_continue": True,
                        }
                    if op.get("p") == "fragments" and op.get("o") == "APPEND":
                        fd = op.get("v", [])
                        if isinstance(fd, list) and fd and isinstance(fd[0], dict):
                            return self._handle_frag(fd[0])
        if p == "fragments" and o == "APPEND" and isinstance(v, list) and v:
            if isinstance(v[0], dict):
                return self._handle_frag(v[0])
        if p == "response/fragments/-1/content" and v is not None:
            return self._handle_chunk(str(v))
        if p == "response/fragments/-1/results" and v:
            self._ext_search(v)
        if p == "response/fragments/-1/elapsed_secs":
            if self._is_think and self._inc:
                self._is_think = False
                return {"type": "thinking", "content": "</" + "think>\n"}
        if (
            "v" in data
            and not isinstance(v, dict)
            and "p" not in data
            and "o" not in data
        ):
            sv = str(v) if v is not None else ""
            if sv and sv not in ("FINISHED", "INCOMPLETE"):
                return self._handle_chunk(sv)
        return None

    def _ext_search(self, results: List) -> None:
        for r in results:
            if isinstance(r, dict) and "cite_index" in r:
                self._search[r["cite_index"]] = SearchResult(
                    url=r.get("url", ""),
                    title=r.get("title", ""),
                    snippet=r.get("snippet", ""),
                    cite_index=r["cite_index"],
                )

    def _handle_frag(self, frag: Dict) -> Optional[Dict]:
        ft = frag.get("type", "RESPONSE")
        content = frag.get("content")
        if not self._first:
            self._first = True
            if ft == "THINK":
                self._is_think = True
                self._think_started = True
                if content:
                    self._think += content
                    if self._inc:
                        pc, _ = self._proc_cite(content)
                        return {"type": "thinking", "content": f"<think>{pc}"}
                elif self._inc:
                    return {"type": "thinking", "content": "<think>"}
                return None
        if ft == "THINK":
            self._is_think = True
            self._think_started = True
            if content:
                self._think += content
                if self._inc:
                    pc, _ = self._proc_cite(content)
                    return {"type": "thinking", "content": f"<think>{pc}"}
            elif self._inc:
                return {"type": "thinking", "content": "<think>"}
        elif ft == "RESPONSE":
            if self._is_think and self._inc:
                self._is_think = False
                close = "</" + "think>\n"
                if content:
                    self._content += content
                    pc, _ = self._proc_cite(content)
                    return {"type": "content", "content": close + pc}
                return {"type": "thinking", "content": close}
            if content:
                self._content += content
                pc, _ = self._proc_cite(content)
                return {"type": "content", "content": pc}
        elif ft == "SEARCH" and "results" in frag:
            self._ext_search(frag["results"])
        return None

    def _handle_chunk(self, chunk: str) -> Optional[Dict]:
        if self._is_think:
            self._think += chunk
            if self._inc:
                pc, _ = self._proc_cite(chunk)
                return {"type": "thinking", "content": pc} if pc else None
            return None
        self._content += chunk
        pc, _ = self._proc_cite(chunk)
        return {"type": "content", "content": pc} if pc else None
