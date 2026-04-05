from __future__ import annotations

import asyncio
import base64
import hashlib
import logging
import secrets
import socket
import ssl
import struct
import time
import uuid
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple, Union

import aiohttp
import certifi

from src.core.candidate import Candidate, make_id
from src.core.errors import NotSupportedError
from src.platforms.edge_tts.accounts import API_KEYS
from src.platforms.edge_tts.util import (
    BASE_URL,
    CHAT_PATH,
    SEC_MS_GEC_VERSION,
    TRUSTED_CLIENT_TOKEN,
    CHROMIUM_MAJOR_VERSION,
    CHROMIUM_FULL_VERSION,
    build_payload,
    build_ssml,
)

logger = logging.getLogger(__name__)
MAX_RETRIES: int = 3
WIN_EPOCH: int = 11644473600
S_TO_NS: float = 1e9


def _parse_tts_text_frame(data: bytes) -> Tuple[Dict[bytes, bytes], bytes]:
    sep = data.find(b"\r\n\r\n")
    if sep < 0:
        return {}, b""
    headers: Dict[bytes, bytes] = {}
    for line in data[:sep].split(b"\r\n"):
        if b":" not in line:
            continue
        key, value = line.split(b":", 1)
        headers[key.strip()] = value.strip()
    return headers, data[sep + 4 :]


def _parse_tts_binary_frame(data: bytes) -> Tuple[Dict[bytes, bytes], bytes]:
    if len(data) < 2:
        return {}, b""
    header_length = int.from_bytes(data[:2], "big")
    if 2 + header_length > len(data):
        return {}, b""
    headers: Dict[bytes, bytes] = {}
    for line in data[2 : 2 + header_length].split(b"\r\n"):
        if b":" not in line:
            continue
        key, value = line.split(b":", 1)
        headers[key.strip()] = value.strip()
    return headers, data[2 + header_length :]


class _RawWebSocket:
    """最小化 WebSocket 客户端（无 permessage-deflate），用于 Edge TTS。

    仅实现必需能力：握手、发送文本帧（掩码）、接收文本/二进制、处理 PING/PONG/CLOSE。
    """

    def __init__(self, sock: ssl.SSLSocket) -> None:
        self._sock = sock
        self._closed = False
        self._recv_buf: bytes = b""
        self._fragment_opcode: int = 0
        self._fragment_buffer: bytes = b""

    @staticmethod
    def connect(
        host: str,
        port: int,
        path: str,
        extra_headers: Dict[str, str],
        ssl_ctx: ssl.SSLContext,
        timeout: float,
    ) -> "_RawWebSocket":
        raw_sock = socket.create_connection((host, port), timeout=timeout)
        tls_sock = ssl_ctx.wrap_socket(raw_sock, server_hostname=host)
        tls_sock.settimeout(timeout)

        ws_key = base64.b64encode(secrets.token_bytes(16)).decode("ascii")
        request_lines: List[str] = [
            "GET {} HTTP/1.1".format(path),
            "Host: {}".format(host),
            "Upgrade: websocket",
            "Connection: Upgrade",
            "Sec-WebSocket-Key: {}".format(ws_key),
            "Sec-WebSocket-Version: 13",
        ]
        for k, v in extra_headers.items():
            if k.lower() in (
                "host",
                "upgrade",
                "connection",
                "sec-websocket-key",
                "sec-websocket-version",
                "sec-websocket-extensions",
                "sec-websocket-protocol",
            ):
                continue
            request_lines.append(f"{k}: {v}")

        http_request = "\r\n".join(request_lines) + "\r\n\r\n"
        tls_sock.sendall(http_request.encode("utf-8"))

        response_buf = b""
        while b"\r\n\r\n" not in response_buf:
            chunk = tls_sock.recv(4096)
            if not chunk:
                raise ConnectionError("Connection closed during WebSocket handshake")
            response_buf += chunk

        first_line = response_buf.split(b"\r\n", 1)[0].decode("ascii", errors="replace")
        if "101" not in first_line:
            raise RuntimeError(f"WebSocket handshake failed: {first_line.strip()}")

        expected_accept = base64.b64encode(
            hashlib.sha1(
                (ws_key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode("ascii")
            ).digest()
        ).decode("ascii")
        header_section = response_buf.split(b"\r\n\r\n", 1)[0].decode(
            "ascii", errors="replace"
        )
        if expected_accept not in header_section:
            raise RuntimeError("WebSocket Sec-WebSocket-Accept mismatch")

        ws = _RawWebSocket(tls_sock)
        ws._recv_buf = response_buf.split(b"\r\n\r\n", 1)[1]
        return ws

    def close(self) -> None:
        if self._closed:
            return
        try:
            self._send_frame(0x8, b"")
        finally:
            try:
                self._sock.close()
            finally:
                self._closed = True

    def send_text(self, text: str) -> None:
        payload = text.encode("utf-8")
        self._send_frame(0x1, payload)

    def _send_frame(self, opcode: int, payload: bytes) -> None:
        header = bytearray()
        header.append(0x80 | opcode)
        length = len(payload)
        if length < 126:
            header.append(0x80 | length)
        elif length < 65536:
            header.append(0x80 | 126)
            header += struct.pack(">H", length)
        else:
            header.append(0x80 | 127)
            header += struct.pack(">Q", length)
        mask_key = secrets.token_bytes(4)
        header += mask_key
        masked = bytearray(length)
        for i in range(length):
            masked[i] = payload[i] ^ mask_key[i % 4]
        self._sock.sendall(bytes(header) + bytes(masked))

    def recv_message(self, timeout: float = 60.0) -> Tuple[int, bytes]:
        self._sock.settimeout(timeout)
        while True:
            if len(self._recv_buf) < 2:
                more = self._sock.recv(4096)
                if not more:
                    raise ConnectionError("WebSocket closed")
                self._recv_buf += more
                continue

            b1, b2 = self._recv_buf[0], self._recv_buf[1]
            fin = (b1 & 0x80) != 0
            opcode = b1 & 0x0F
            masked = (b2 & 0x80) != 0
            length = b2 & 0x7F
            offset = 2

            if length == 126:
                if len(self._recv_buf) < offset + 2:
                    self._recv_buf += self._sock.recv(4096)
                    continue
                length = struct.unpack(">H", self._recv_buf[offset : offset + 2])[0]
                offset += 2
            elif length == 127:
                if len(self._recv_buf) < offset + 8:
                    self._recv_buf += self._sock.recv(4096)
                    continue
                length = struct.unpack(">Q", self._recv_buf[offset : offset + 8])[0]
                offset += 8

            if masked:
                mask_key = self._recv_buf[offset : offset + 4]
                offset += 4
            else:
                mask_key = b""

            if len(self._recv_buf) < offset + length:
                self._recv_buf += self._sock.recv(4096)
                continue

            payload = self._recv_buf[offset : offset + length]
            self._recv_buf = self._recv_buf[offset + length :]

            if masked:
                payload = bytes(b ^ mask_key[i % 4] for i, b in enumerate(payload))

            if opcode == 0x9:  # PING
                self._send_frame(0xA, payload)
                continue
            if opcode == 0x8:  # CLOSE
                self.close()
                return 0x8, b""

            if not fin and opcode in (0x1, 0x2):
                if self._fragment_opcode == 0:
                    self._fragment_opcode = opcode
                    self._fragment_buffer = payload
                else:
                    self._fragment_buffer += payload
                continue
            if opcode == 0x0 and self._fragment_opcode != 0:
                self._fragment_buffer += payload
                if fin:
                    result_opcode = self._fragment_opcode
                    data = self._fragment_buffer
                    self._fragment_opcode = 0
                    self._fragment_buffer = b""
                    return result_opcode, data
                continue

            if fin:
                return opcode, payload


def _drm_generate_sec_ms_gec() -> str:
    ticks = datetime.now(timezone.utc).timestamp()
    ticks += WIN_EPOCH
    ticks -= ticks % 300
    ticks *= S_TO_NS / 100
    return hashlib.sha256("{:.0f}{}".format(ticks, TRUSTED_CLIENT_TOKEN).encode("ascii")).hexdigest().upper()


def _connect_id() -> str:
    return uuid.uuid4().hex


def _date_to_string() -> str:
    return time.strftime(
        "%a %b %d %Y %H:%M:%S GMT+0000 (Coordinated Universal Time)",
        time.gmtime(),
    )


class EdgeTtsClient:
    """edge_tts HTTP/WebSocket 客户端（使用原生 socket WS）。"""

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        logger.info("edge_tts 初始化完成")

    async def candidates(self) -> List[Candidate]:
        from src.platforms.edge_tts.adapter import CAPS, MODELS

        return [
            Candidate(
                id=make_id("edge_tts"),
                platform="edge_tts",
                resource_id=(key or "edge")[:12],
                models=MODELS,
                meta={"api_key": key},
                **CAPS,
            )
            for key in API_KEYS
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
        raise NotSupportedError("edge_tts 不支持 chat 补全")

    async def create_speech(
        self,
        candidate: Candidate,
        input_text: str,
        model: str,
        voice: str,
        **kw: Any,
    ) -> bytes:
        last_exc: Optional[Exception] = None
        audio_bytes: Optional[bytes] = None
        for attempt in range(MAX_RETRIES + 1):
            if attempt > 0:
                await asyncio.sleep(1.0 * (2 ** (attempt - 1)))
            try:
                audio_bytes = await self._do_ws_synthesis(candidate, input_text, voice)
                if audio_bytes:
                    return audio_bytes
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                logger.warning("edge_tts 重试 %d/%d: %s", attempt + 1, MAX_RETRIES, exc)
        audio_bytes = await self._fallback_http(input_text)
        if audio_bytes:
            return audio_bytes
        if last_exc is not None:
            raise last_exc
        raise RuntimeError("edge_tts 未知错误")

    async def _do_ws_synthesis(
        self,
        candidate: Candidate,
        text: str,
        voice: str,
    ) -> bytes:
        # 生成 DRM/连接参数
        connection_id = _connect_id()
        sec_ms_gec = _drm_generate_sec_ms_gec()
        wss_host = "speech.platform.bing.com"
        path_base = "/consumer/speech/synthesize/readaloud/edge/v1"
        wss_path = (
            "{}?TrustedClientToken={}&ConnectionId={}&Sec-MS-GEC={}&Sec-MS-GEC-Version={}"
        ).format(
            path_base,
            TRUSTED_CLIENT_TOKEN,
            connection_id,
            sec_ms_gec,
            SEC_MS_GEC_VERSION,
        )

        handshake_headers = {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0"
            ),
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cookie": "muid={};".format(secrets.token_hex(16).upper()),
        }

        ssl_ctx = ssl.create_default_context(cafile=certifi.where())
        ws = _RawWebSocket.connect(
            host=wss_host,
            port=443,
            path=wss_path,
            extra_headers=handshake_headers,
            ssl_ctx=ssl_ctx,
            timeout=15.0,
        )

        try:
            request_id = _connect_id()
            timestamp = _date_to_string()
            ssml = build_ssml(text, voice)

            config_payload = (
                "X-Timestamp:{ts}\r\n"
                "Content-Type:application/json; charset=utf-8\r\n"
                "Path:speech.config\r\n"
                "X-RequestId:{rid}\r\n\r\n"
                "{{\"context\":{{\"synthesis\":{{\"audio\":{{"
                "\"metadataoptions\":{{\"sentenceBoundaryEnabled\":\"false\",\"wordBoundaryEnabled\":\"false\"}},"
                "\"outputFormat\":\"audio-24khz-48kbitrate-mono-mp3\"}}}}}}}}"
            ).format(ts=timestamp, rid=request_id)

            ssml_payload = (
                "X-RequestId:{rid}\r\n"
                "Content-Type:application/ssml+xml\r\n"
                "X-Timestamp:{ts}Z\r\n"
                "Path:ssml\r\n\r\n"
                "{ssml}"
            ).format(rid=_connect_id(), ts=timestamp, ssml=ssml)

            ws.send_text(config_payload)
            ws.send_text(ssml_payload)

            audio_chunks: bytearray = bytearray()
            while True:
                opcode, payload = ws.recv_message(timeout=30.0)
                if opcode == 0x2:
                    frame_headers, audio_data = _parse_tts_binary_frame(payload)
                    if frame_headers.get(b"Path") == b"audio" and len(audio_data) > 0:
                        audio_chunks.extend(audio_data)
                elif opcode == 0x1:
                    frame_headers, _ = _parse_tts_text_frame(payload)
                    if frame_headers.get(b"Path") == b"turn.end":
                        break
                elif opcode == 0x8:
                    break

            return bytes(audio_chunks)
        finally:
            ws.close()

    async def _fallback_http(self, text: str) -> Optional[bytes]:
        try:
            from src.platforms.openai_fm.util import build_tts_form_data

            form_data = build_tts_form_data(text, "", "coral", "")
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://www.openai.fm/api/generate",
                    data=form_data,
                    ssl=False,
                    timeout=aiohttp.ClientTimeout(connect=10, total=120),
                ) as resp:
                    if resp.status != 200:
                        return None
                    data = await resp.read()
                    return data if data else None
        except Exception:
            return None
        return None

    async def close(self) -> None:
        return
