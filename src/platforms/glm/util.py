"""GLM 工具——签名/JWT/流处理"""

from __future__ import annotations

import base64
import datetime
import hashlib
import hmac
import json
import logging
import re
import time
import urllib.parse
import uuid
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

FIXED_KEY = b"key-@@@@)))()((9))-xxxx&&&%%%%%"
FE_VERSION = "prod-fe-1.0.252"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
)
BASE = "https://chat.z.ai"
TOKEN_TTL = 300


def create_signature(sorted_payload: str, prompt: str, ts_ms: int) -> str:
    """双层 HMAC-SHA256 签名"""
    wi = str(ts_ms // 300000).encode()
    e = hmac.new(FIXED_KEY, wi, hashlib.sha256).hexdigest()
    pb = base64.b64encode(prompt.encode()).decode()
    ds = f"{sorted_payload}|{pb}|{ts_ms}"
    return hmac.new(e.encode(), ds.encode(), hashlib.sha256).hexdigest()


def sorted_payload(params: Dict[str, str]) -> str:
    """key/value 交替拼接"""
    parts: List[str] = []
    for k, v in sorted(params.items()):
        parts.extend([str(k), str(v)])
    return ",".join(parts)


def tz_offset() -> int:
    now = datetime.datetime.now().astimezone()
    off = now.utcoffset()
    return -int(off.total_seconds() / 60) if off else 0


def jwt_payload(token: str) -> Dict[str, Any]:
    try:
        parts = token.split(".")
        if len(parts) < 2:
            return {}
        b = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
        return json.loads(base64.urlsafe_b64decode(b))
    except Exception:
        return {}


def build_request(
    token: str,
    user_id: str,
    messages: List[Dict],
    model: str,
    thinking: bool = True,
    search: bool = False,
    stream: bool = True,
) -> Tuple[str, Dict[str, str], Dict[str, Any]]:
    """构建完整请求"""
    ts = int(time.time() * 1000)
    rid = str(uuid.uuid4())
    cid = str(uuid.uuid4())
    mid = str(uuid.uuid4())
    prompt = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            c = m.get("content", "")
            prompt = c if isinstance(c, str) else str(c)
            break
    bp = {"timestamp": str(ts), "requestId": rid, "user_id": user_id}
    sp = sorted_payload(bp)
    sig = create_signature(sp, prompt, ts)
    utc = time.gmtime()
    tzo = tz_offset()
    qp = {
        "timestamp": str(ts),
        "requestId": rid,
        "user_id": user_id,
        "version": "0.0.1",
        "platform": "web",
        "token": token,
        "user_agent": UA,
        "language": "en-US",
        "languages": "en-US,en",
        "timezone": "Asia/Shanghai",
        "cookie_enabled": "true",
        "screen_width": "1920",
        "screen_height": "1080",
        "screen_resolution": "1920x1080",
        "viewport_height": "900",
        "viewport_width": "1440",
        "viewport_size": "1440x900",
        "color_depth": "24",
        "pixel_ratio": "1",
        "current_url": f"https://chat.z.ai/c/{cid}",
        "pathname": f"/c/{cid}",
        "search": "",
        "hash": "",
        "host": "chat.z.ai",
        "hostname": "chat.z.ai",
        "protocol": "https:",
        "referrer": "",
        "title": "Z.ai - Free AI Chatbot",
        "timezone_offset": str(tzo),
        "local_time": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", utc),
        "utc_time": time.strftime("%a, %d %b %Y %H:%M:%S GMT", utc),
        "is_mobile": "false",
        "is_touch": "false",
        "max_touch_points": "0",
        "browser_name": "Chrome",
        "os_name": "Windows",
        "signature_timestamp": str(ts),
    }
    url = f"{BASE}/api/v2/chat/completions?" + urllib.parse.urlencode(qp)
    headers = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": f"Bearer {token}",
        "X-FE-Version": FE_VERSION,
        "X-Signature": sig,
        "Origin": BASE,
        "Referer": f"{BASE}/c/{cid}",
        "User-Agent": UA,
    }
    dt = time.strftime("%Y-%m-%d %H:%M:%S")
    payload: Dict[str, Any] = {
        "stream": stream,
        "model": model,
        "messages": messages,
        "signature_prompt": prompt,
        "params": {},
        "extra": {},
        "features": {
            "image_generation": False,
            "web_search": search,
            "auto_web_search": search,
            "preview_mode": True,
            "flags": [],
            "enable_thinking": thinking,
        },
        "variables": {
            "{{USER_NAME}}": "guest",
            "{{USER_LOCATION}}": "Unknown",
            "{{CURRENT_DATETIME}}": dt,
            "{{CURRENT_DATE}}": dt.split()[0],
            "{{CURRENT_TIME}}": dt.split()[1],
            "{{CURRENT_WEEKDAY}}": time.strftime("%A"),
            "{{CURRENT_TIMEZONE}}": "Asia/Shanghai",
            "{{USER_LANGUAGE}}": "en-US",
        },
        "chat_id": cid,
        "id": rid,
        "current_user_message_id": mid,
        "current_user_message_parent_id": None,
        "background_tasks": {"title_generation": True, "tags_generation": True},
    }
    return url, headers, payload


def clean_thinking(raw: str) -> str:
    raw = re.sub(r"<details[^>]*>", "", raw)
    raw = (
        raw.replace("</details>", "").replace("<summary>", "").replace("</summary>", "")
    )
    lines = raw.split("\n")
    out = []
    for ln in lines:
        if ln.startswith("> "):
            out.append(ln[2:])
        elif ln == ">":
            out.append("")
        else:
            out.append(ln)
    return "\n".join(out)


def split_details(text: str) -> Tuple[str, str]:
    idx = text.find("</details>")
    if idx == -1:
        return text, ""
    return text[:idx], text[idx + 10 :].lstrip("\n")
