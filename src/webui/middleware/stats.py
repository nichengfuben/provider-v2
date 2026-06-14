from __future__ import annotations

"""请求统计中间件 — 自动记录每次 API 请求的指标 + 请求日志广播。"""

import time
import uuid
from typing import Callable

import aiohttp.web

from src.webui.services.stats import get_stats
from src.webui.services.request_log import request_broker

__all__ = ["stats_middleware"]


_API_PREFIXES = ("/v1/chat/", "/v1/completions", "/v1/messages", "/v1/models", "/v1/embeddings")


@aiohttp.web.middleware
async def stats_middleware(
    request: aiohttp.web.Request,
    handler: Callable,
) -> aiohttp.web.StreamResponse:
    """记录 API 请求统计 + 广播请求事件。"""
    path = request.path

    if not any(path.startswith(p) for p in _API_PREFIXES):
        return await handler(request)

    start = time.monotonic()
    status = 200
    platform = ""
    model = ""
    req_id = uuid.uuid4().hex[:16]
    body_info = {}

    try:
        if request.method == "POST" and request.content_type == "application/json":
            try:
                body = await request.json()
                model = body.get("model", "")
                body_info = {
                    "model": model,
                    "messages_count": len(body.get("messages", [])),
                    "has_tools": bool(body.get("tools")),
                    "stream": bool(body.get("stream", False)),
                }
            except Exception:
                pass
    except Exception:
        pass

    # Broadcast request_start
    if request_broker.has_listeners or True:  # always track
        request_broker.push_event({
            "type": "request_start",
            "id": req_id,
            "ts": time.time(),
            **body_info,
        })

    try:
        response = await handler(request)
        status = response.status
        if hasattr(response, "_platform"):
            platform = response._platform
        return response
    except aiohttp.web.HTTPException as exc:
        status = exc.status
        raise
    except Exception:
        status = 500
        raise
    finally:
        latency_ms = (time.monotonic() - start) * 1000
        get_stats().record(
            platform=platform,
            model=model,
            status=status,
            latency_ms=latency_ms,
        )
        # Broadcast request_end
        request_broker.push_event({
            "type": "request_end",
            "id": req_id,
            "status": status,
            "latency_ms": round(latency_ms, 1),
            "platform": platform,
            "model": model,
        })
