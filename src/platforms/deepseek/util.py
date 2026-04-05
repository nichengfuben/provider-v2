# src/platforms/deepseek/util.py
"""DeepSeek工具——PoW/StreamParser/设备指纹"""

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
from typing import Any, Dict, List, Optional, Tuple, Union

logger = logging.getLogger(__name__)

DEFAULT_HOST: str = "chat.deepseek.com"
WASM_PATH: str = "persist/deepseek/sha3_wasm_bg.7b9ca65ddd.wasm"
WASM_URL: str = "https://fe-static.deepseek.com/chat/static/sha3_wasm_bg.7b9ca65ddd.wasm"
WASM_META: str = "persist/deepseek/wasm_meta.json"
MAX_CONTINUE: int = 20

COMMON_HEADERS: Dict[str, str] = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "sec-ch-ua": '"Chromium";v="146","Not-A.Brand";v="24","Google Chrome";v="146"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/146.0.0.0 Safari/537.36"
    ),
    "x-app-version": "20241129.1",
    "x-client-locale": "zh_CN",
    "x-client-platform": "web",
    "x-client-timezone-offset": "28800",
    "x-client-version": "1.6.1",
}


def make_device_id() -> str:
    """生成随机设备ID。"""
    return base64.b64encode(secrets.token_bytes(32)).decode()


def make_stream_id() -> str:
    """生成流式请求ID。"""
    return "{}-{}".format(
        datetime.now().strftime("%Y%m%d"),
        secrets.token_hex(8),
    )


def build_headers(token: str, session_id: str = "") -> Dict[str, str]:
    """构建请求头。

    Args:
        token: Bearer令牌。
        session_id: 会话ID（可选）。

    Returns:
        请求头字典。
    """
    h: Dict[str, str] = {
        **COMMON_HEADERS,
        "authorization": "Bearer {}".format(token),
        "origin": "https://{}".format(DEFAULT_HOST),
    }
    if session_id:
        h["referer"] = "https://{}/a/chat/s/{}".format(DEFAULT_HOST, session_id)
    else:
        h["referer"] = "https://{}/".format(DEFAULT_HOST)
    return h


class WasmPow:
    """WASM PoW求解器。

    注意：此类包含文件I/O副作用（_load()方法读取WASM字节）。
    在client.py中通过后台任务实例化和使用，隔离副作用。
    """

    ALGO: str = "DeepSeekHashV1"

    def __init__(self) -> None:
        """初始化PoW求解器。"""
        self._bytes: Optional[bytes] = None
        try:
            from wasmtime import Linker, Module, Store  # noqa: F401

            self._available: bool = os.path.exists(WASM_PATH)
        except ImportError:
            self._available = False

    @property
    def available(self) -> bool:
        """返回WASM是否可用。"""
        return self._available

    def _load(self) -> bytes:
        """加载WASM字节（文件I/O操作）。

        此方法涉及文件系统访问副作用。在adapter/client的后台任务中调用。

        Returns:
            WASM二进制字节。
        """
        if self._bytes is None:
            self._bytes = Path(WASM_PATH).read_bytes()
        return self._bytes

    def solve(
        self,
        challenge: str,
        salt: str,
        difficulty: int,
        expire_at: int,
    ) -> int:
        """求解PoW挑战。

        Args:
            challenge: 挑战字符串。
            salt: 盐值。
            difficulty: 难度。
            expire_at: 过期时间戳。

        Returns:
            答案整数。
        """
        from wasmtime import Linker, Module, Store

        prefix = "{}_{}_{}_".format(salt, expire_at, "")
        prefix = "{}_{}_".format(salt, expire_at)
        store = Store()
        linker = Linker(store.engine)
        module = Module(store.engine, self._load())
        inst = linker.instantiate(store, module)
        ex = inst.exports(store)
        mem = ex["memory"]
        add_sp = ex["__wbindgen_add_to_stack_pointer"]
        alloc = ex["__wbindgen_export_0"]
        wasm_solve = ex["wasm_solve"]

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
            pp, lp = _enc("{}_{}".format(salt, expire_at) + "_")
            wasm_solve(store, ret, pc, lc, pp, lp, float(difficulty))
            st = struct.unpack("<i", _r(ret, 4))[0]
            val = struct.unpack("<d", _r(ret + 8, 8))[0]
            if st == 0:
                raise RuntimeError("WASM求解失败")
            return int(val)
        finally:
            add_sp(store, 16)


async def get_pow_response(
    session: Any,
    token: str,
    pow_solver: WasmPow,
) -> str:
    """获取PoW响应。

    Args:
        session: aiohttp会话。
        token: Bearer令牌。
        pow_solver: WASM求解器实例。

    Returns:
        Base64编码的PoW响应，失败时返回空字符串。
    """
    if not pow_solver.available:
        return ""

    headers = {**COMMON_HEADERS, "authorization": "Bearer {}".format(token)}
    try:
        async with session.post(
            "https://{}/api/v0/chat/create_pow_challenge".format(DEFAULT_HOST),
            headers=headers,
            json={"target_path": "/api/v0/chat/completion"},
            timeout=__import__("aiohttp").ClientTimeout(total=30),
            ssl=False,
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
        logger.warning("PoW失败: %s", e)
        return ""


async def download_wasm(session: Any) -> None:
    """下载或更新WASM文件。

    注意：此函数为丢富便性收集方法特定的侧效应（文件I/O + 网络调用）。
    此函数见于client.py的background_setup()中通过asyncio.ensure_future()
    处于后台任务中执行，实現了撧离。

    Args:
        session: aiohttp会话。
    """
    Path("persist/deepseek").mkdir(parents=True, exist_ok=True)
    need = not os.path.exists(WASM_PATH)
    if not need and os.path.exists(WASM_META):
        try:
            meta = json.loads(Path(WASM_META).read_text(encoding="utf-8"))
            if time.time() - meta.get("downloaded_at", 0) > 86400:
                need = True
        except Exception:
            need = True
    if not need:
        return

    try:
        async with session.get(
            WASM_URL,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/147.0.0.0 Safari/537.36"
                ),
                "Referer": "",
            },
            ssl=False,
        ) as resp:
            if resp.status != 200:
                logger.warning("WASM下载失败: HTTP%d", resp.status)
                return
            content = await resp.read()
            sha = hashlib.sha256(content).hexdigest()
            if os.path.exists(WASM_PATH):
                old = hashlib.sha256(Path(WASM_PATH).read_bytes()).hexdigest()
                if old == sha:
                    Path(WASM_META).write_text(
                        json.dumps({"downloaded_at": time.time(), "sha256": sha}),
                        encoding="utf-8",
                    )
                    return
            tmp = WASM_PATH + ".tmp"
            with open(tmp, "wb") as f:
                f.write(content)
            os.replace(tmp, WASM_PATH)
            Path(WASM_META).write_text(
                json.dumps(
                    {
                        "downloaded_at": time.time(),
                        "sha256": sha,
                        "size": len(content),
                    }
                ),
                encoding="utf-8",
            )
            logger.info("WASM已更新: %d bytes", len(content))
    except Exception as e:
        logger.warning("WASM下载异常: %s", e)


@dataclass
class SearchResult:
    """搜索结果条目。"""

    url: str
    title: str
    snippet: str
    cite_index: int


class StreamParser:
    """DeepSeek流式响应解析器"""

    def __init__(self, include_thinking: bool = False) -> None:
        """初始化解析器。

        Args:
            include_thinking: 是否包含思考过程。
        """
        self._inc: bool = include_thinking
        self._content: str = ""
        self._think: str = ""
        self._msg_id: Optional[int] = None
        self._parent_id: Optional[int] = None
        self._status: str = "WIP"
        self._is_think: bool = False
        self._think_started: bool = False
        self._search: Dict[int, SearchResult] = {}
        self._cite_buf: str = ""
        self._first: bool = False
        self._tok_usage: int = 0

    @property
    def status(self) -> str:
        """返回当前状态。"""
        return self._status

    @property
    def message_id(self) -> Optional[int]:
        """返回消息ID。"""
        return self._msg_id

    def _replace_cit(self, t: str) -> str:
        """替换引用标记为URL。"""
        def _rep(m: Any) -> str:
            i = int(m.group(1))
            return self._search[i].url if i in self._search else m.group(0)

        return re.sub(r"\[citation:(\d+)\]", _rep, t)

    def _proc_cite(self, chunk: str) -> Tuple[str, str]:
        """处理引用标记，返回(处理后内容, 剩余缓冲)。"""
        self._cite_buf += chunk
        result = ""
        buf = self._cite_buf
        while buf:
            m = re.search(r"\[citation:(\d+)\]", buf)
            if m:
                result += buf[: m.start()]
                i = int(m.group(1))
                result += self._search[i].url if i in self._search else m.group(0)
                buf = buf[m.end():]
            else:
                inc = re.search(r"\[c?i?t?a?t?i?o?n?:?\d*\]?$", buf)
                if inc:
                    result += buf[: inc.start()]
                    self._cite_buf = buf[inc.start():]
                    return result, self._cite_buf
                result += buf
                buf = ""
        self._cite_buf = ""
        return result, ""

    def parse_line(self, line: str) -> Optional[Dict[str, Any]]:
        """解析单行流式数据。

        Args:
            line: 原始行字符串。

        Returns:
            解析结果字典或None。
        """
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
        """处理解析后的数据。"""
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
        """提取搜索结果。"""
        for r in results:
            if isinstance(r, dict) and "cite_index" in r:
                self._search[r["cite_index"]] = SearchResult(
                    url=r.get("url", ""),
                    title=r.get("title", ""),
                    snippet=r.get("snippet", ""),
                    cite_index=r["cite_index"],
                )

    def _handle_frag(self, frag: Dict) -> Optional[Dict]:
        """处理fragment数据。"""
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
                        return {"type": "thinking", "content": "<think>{}".format(pc)}
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
                    return {"type": "thinking", "content": pc}
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
        """处理普通文本块。"""
        if self._is_think:
            self._think += chunk
            if self._inc:
                pc, _ = self._proc_cite(chunk)
                return {"type": "thinking", "content": pc} if pc else None
            return None
        self._content += chunk
        pc, _ = self._proc_cite(chunk)
        return {"type": "content", "content": pc} if pc else None
