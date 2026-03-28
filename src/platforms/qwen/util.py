"""Qwen 工具——指纹/Cookie/BX-UA/OSS/feature_config"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import os
import secrets
import time
import uuid
from typing import Any, Callable, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)
CUSTOM_B64 = "DGi0YA7BemWnQjCl4_bR3f8SKIF9tUz/xhr2oEOgPpac=61ZqwTudLkM5vHyNXsVJ"
HASH_FIELDS = {16: "split", 17: "full", 18: "full", 31: "full", 34: "full", 36: "full"}


def lzw_compress(data: str, bits: int, char_fn: Callable[[int], str]) -> str:
    """LZW 压缩"""
    if not data:
        return ""
    dic: Dict[str, int] = {}
    dtc: Dict[str, bool] = {}
    w = ""
    enlarge = 2
    ds = 3
    nb = 2
    result: List[str] = []
    val = 0
    pos = 0

    def _emit(v: int, p: int, code: int, bc: int) -> Tuple[int, int]:
        for _ in range(bc):
            v = (v << 1) | (code & 1)
            if p == bits - 1:
                result.append(char_fn(v))
                v = 0
                p = 0
            else:
                p += 1
            code >>= 1
        return v, p

    def _zeros(v: int, p: int, cnt: int) -> Tuple[int, int]:
        for _ in range(cnt):
            v <<= 1
            if p == bits - 1:
                result.append(char_fn(v))
                v = 0
                p = 0
            else:
                p += 1
        return v, p

    def _new_char(v: int, p: int, ch: str, n: int) -> Tuple[int, int]:
        cp = ord(ch)
        if cp < 256:
            v, p = _zeros(v, p, n)
            v, p = _emit(v, p, cp, 8)
        else:
            marker = 1
            for _ in range(n):
                v = (v << 1) | marker
                if p == bits - 1:
                    result.append(char_fn(v))
                    v = 0
                    p = 0
                else:
                    p += 1
                marker = 0
            v, p = _emit(v, p, cp, 16)
        return v, p

    for c in data:
        if c not in dic:
            dic[c] = ds
            ds += 1
            dtc[c] = True
        wc = w + c
        if wc in dic:
            w = wc
        else:
            if w in dtc:
                val, pos = _new_char(val, pos, w[0], nb)
                enlarge -= 1
                if enlarge == 0:
                    enlarge = 2**nb
                    nb += 1
                del dtc[w]
            else:
                val, pos = _emit(val, pos, dic[w], nb)
                enlarge -= 1
                if enlarge == 0:
                    enlarge = 2**nb
                    nb += 1
            dic[wc] = ds
            ds += 1
            w = c
    if w:
        if w in dtc:
            val, pos = _new_char(val, pos, w[0], nb)
            enlarge -= 1
            if enlarge == 0:
                enlarge = 2**nb
                nb += 1
            del dtc[w]
        else:
            val, pos = _emit(val, pos, dic[w], nb)
            enlarge -= 1
            if enlarge == 0:
                enlarge = 2**nb
                nb += 1
    val, pos = _emit(val, pos, 2, nb)
    while True:
        val <<= 1
        if pos == bits - 1:
            result.append(char_fn(val))
            break
        pos += 1
    return "".join(result)


def custom_encode(data: str) -> str:
    """自定义 Base64 编码"""
    return lzw_compress(data, 6, lambda i: CUSTOM_B64[i]) if data else ""


def generate_fingerprint() -> str:
    """生成浏览器指纹（37 字段）"""
    did = "".join(secrets.choice("0123456789abcdef") for _ in range(20))
    rh = lambda: secrets.randbelow(0x100000000)
    ts = int(time.time() * 1000)
    fields = [
        did,
        "websdk-2.3.15d",
        "1765348410850",
        "91",
        "1|15",
        "zh-CN",
        "-480",
        "16705151|12791",
        "1470|956|283|797|158|0|1470|956|1470|798|0|0",
        "5",
        "MacIntel",
        "10",
        "ANGLE (Apple, ANGLE Metal Renderer: Apple M4, Unspecified Version)|Google Inc. (Apple)",
        "30|30",
        "0",
        "28",
        f"5|{rh()}",
        str(rh()),
        str(rh()),
        "1",
        "0",
        "1",
        "0",
        "P",
        "0",
        "0",
        "0",
        "416",
        "Google Inc.",
        "8",
        "-1|0|0|0|0",
        str(rh()),
        "11",
        str(ts),
        str(rh()),
        "0",
        str(secrets.randbelow(91) + 10),
    ]
    return "^".join(fields)


def generate_cookies(fp: Optional[str] = None) -> Dict[str, Any]:
    """生成 SSXMOD Cookie"""
    fp = fp or generate_fingerprint()
    fields = fp.split("^")
    processed = list(fields)
    ts = int(time.time() * 1000)
    rh = lambda: secrets.randbelow(0x100000000)
    for idx, ft in HASH_FIELDS.items():
        if idx >= len(processed):
            continue
        if ft == "split":
            parts = processed[idx].split("|")
            if len(parts) == 2:
                processed[idx] = f"{parts[0]}|{rh()}"
        elif ft == "full":
            processed[idx] = str(rh()) if idx != 36 else str(secrets.randbelow(91) + 10)
    if 33 < len(processed):
        processed[33] = str(ts)
    itna_data = "^".join(processed)
    ssxmod_itna = "1-" + custom_encode(itna_data)
    itna2_fields = [
        processed[0],
        processed[1],
        processed[23],
        "0",
        "",
        "0",
        "",
        "",
        "0",
        "0",
        "0",
        processed[32],
        processed[33],
        "0",
        "0",
        "0",
        "0",
        "0",
    ]
    ssxmod_itna2 = "1-" + custom_encode("^".join(itna2_fields))
    return {"ssxmod_itna": ssxmod_itna, "ssxmod_itna2": ssxmod_itna2, "timestamp": ts}


def generate_bxua(fp: str) -> str:
    """生成 BX-UA 请求头"""
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import pad

    ts = int(time.time() * 1000)
    fields = fp.split("^")
    rnd = secrets.randbelow(9000) + 1000
    cs = hashlib.md5(f"{fp}{ts}{rnd}".encode()).hexdigest()[:8]
    payload = {
        "v": "231",
        "ts": ts,
        "fp": fp,
        "d": {
            "deviceId": fields[0],
            "sdkVer": fields[1],
            "lang": fields[5],
            "tz": fields[6],
            "platform": fields[10],
            "renderer": fields[12],
            "mode": fields[23],
            "vendor": fields[28],
        },
        "rnd": rnd,
        "seq": 1,
        "cs": cs,
    }
    raw = json.dumps(payload, separators=(",", ":")).encode()
    digest = hashlib.sha256(fp.encode()).digest()
    cipher = AES.new(digest[:16], AES.MODE_CBC, digest[16:32])
    return f"231!{base64.b64encode(cipher.encrypt(pad(raw, AES.block_size))).decode('ascii')}"


def oss_sign(
    method: str,
    ct: str,
    date: str,
    oss_headers: Dict[str, str],
    resource: str,
    key_id: str,
    key_secret: str,
) -> str:
    """OSS HMAC-SHA1 签名"""
    canon = (
        "\n".join(f"{k}:{v}" for k, v in sorted(oss_headers.items())) + "\n"
        if oss_headers
        else ""
    )
    sts = f"{method}\n\n{ct}\n{date}\n{canon}{resource}"
    sig = base64.b64encode(
        hmac.new(key_secret.encode(), sts.encode(), hashlib.sha1).digest()
    ).decode()
    return f"OSS {key_id}:{sig}"


def build_feature_config(thinking: bool, search: bool) -> Dict[str, Any]:
    """构建 feature_config"""
    cfg: Dict[str, Any] = {
        "thinking_enabled": thinking,
        "output_schema": "phase",
        "auto_thinking": False,
        "auto_search": search,
    }
    if thinking:
        cfg["thinking_format"] = "summary"
    return cfg
