# -*- coding: utf-8 -*-
"""静态路由——健康检查、模型列表、状态、能力矩阵。"""

from __future__ import annotations

import json
import time
from typing import Any, Dict

import aiohttp.web
from aiohttp.web_app import AppKey

__all__ = ["setup_routes"]


def _json(data: Any, status: int = 200) -> aiohttp.web.Response:
    """构建 JSON 响应。

    Args:
        data: 可序列化数据。
        status: HTTP 状态码。

    Returns:
        Response 实例。
    """
    return aiohttp.web.Response(
        body=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        status=status,
        content_type="application/json",
    )


async def root(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """服务根路由 /。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    return _json(
        {
            "service": "Provider-V2",
            "version": "2.0.0",
            "docs": "/docs",
        }
    )


async def health(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """健康检查端点 /health。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    return _json({"status": "healthy", "timestamp": int(time.time())})


async def list_models(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """模型列表端点 /v1/models。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    from src.core.server import REGISTRY_KEY

    registry = request.app[REGISTRY_KEY]
    models = await registry.all_models()
    return _json({"object": "list", "data": models})


async def get_model(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """获取单个模型详情端点 /v1/models/{model_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    model_id = request.match_info["model_id"]
    from src.core.server import REGISTRY_KEY

    registry = request.app[REGISTRY_KEY]
    for m in await registry.all_models():
        if m["id"] == model_id:
            return _json(m)
    return _json(
        {
            "error": {
                "message": "Model {} not found".format(model_id),
                "type": "invalid_request_error",
                "code": "model_not_found",
            }
        },
        status=404,
    )


async def status(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """平台状态端点 /v1/status。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    from src.core.server import REGISTRY_KEY

    reg = request.app[REGISTRY_KEY]
    info: Dict[str, Any] = {}
    for n, a in reg.adapters.items():
        try:
            cs = await a.candidates()
            info[n] = {
                "candidates": len(cs),
                "available": len(
                    [c for c in cs if c.available and not c.busy]
                ),
                "models": len(a.supported_models),
            }
        except Exception:
            info[n] = {"error": "failed"}
    return _json(
        {
            "status": "running",
            "platforms": info,
            "tas": await reg.selector.get_stats(),
            "timestamp": int(time.time()),
        }
    )


async def list_capabilities(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """能力矩阵查询端点 /v1/capabilities。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    from src.core.server import REGISTRY_KEY

    reg = request.app[REGISTRY_KEY]
    caps: Dict[str, Any] = {}
    for n, a in reg.adapters.items():
        caps[n] = a.default_capabilities
    return _json(
        {
            "capabilities": caps,
            "timestamp": int(time.time()),
        }
    )


async def admin_refresh_models(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """手动触发模型列表刷新 /v1/admin/refresh_models。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    from src.core.server import REGISTRY_KEY

    reg = request.app[REGISTRY_KEY]
    results: Dict[str, Any] = {}
    for n, a in reg.adapters.items():
        try:
            if hasattr(a, "fetch_remote_models") and hasattr(a, "_cache"):
                remote = await a.fetch_remote_models()
                if a._cache is not None:
                    on_update = (
                        a._on_models_updated
                        if hasattr(a, "_on_models_updated")
                        else None
                    )
                    await a._cache._do_refresh(
                        a.fetch_remote_models,
                        on_update,
                    )
                results[n] = {"status": "ok", "count": len(remote)}
            else:
                results[n] = {"status": "skipped"}
        except Exception as e:
            results[n] = {"status": "error", "message": str(e)}
    return _json({"refreshed": results, "timestamp": int(time.time())})


def setup_routes(app: aiohttp.web.Application) -> None:
    """注册所有静态路由。

    Args:
        app: aiohttp.web.Application 实例。
    """
    app.router.add_get("/", root)
    app.router.add_get("/health", health)
    app.router.add_get("/v1/models", list_models)
    app.router.add_get("/v1/models/{model_id}", get_model)
    app.router.add_get("/v1/status", status)
    app.router.add_get("/v1/capabilities", list_capabilities)
    app.router.add_post("/v1/admin/refresh_models", admin_refresh_models)
