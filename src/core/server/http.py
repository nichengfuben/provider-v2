"""Shared HTTP utilities → echotools 复用。"""
from __future__ import annotations

from typing import Any, Tuple


def clean_fncall(content: str, platform_id: str = "") -> str:
    from echotools.fncall.registry import get_protocol
    protocol = get_protocol(platform_id=platform_id)
    return protocol.clean_tags(content)


def safe_flush(
    buffer: str, platform_id: str = "", protocol_id: str = ""
) -> Tuple[str, str]:
    from echotools.fncall.registry import get_protocol
    protocol = get_protocol(protocol_id=protocol_id, platform_id=platform_id)
    tags = protocol.get_trigger_tags()
    if not tags:
        return buffer, ""
    buf_len = len(buffer)
    max_keep = max(len(t) - 1 for t in tags)
    check_len = min(max_keep, buf_len)
    for length in range(check_len, 0, -1):
        suffix = buffer[buf_len - length:]
        if any(tag.startswith(suffix) and suffix != tag for tag in tags):
            return buffer[:buf_len - length], buffer[buf_len - length:]
    return buffer, ""


async def get_json(request: Any) -> Any:
    try:
        return await request.json()
    except Exception:
        return None
