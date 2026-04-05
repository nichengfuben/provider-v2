from __future__ import annotations

import json
import logging
import time
from typing import Any, Awaitable, Callable, Optional

import aiohttp.web
from aiohttp.web_app import AppKey

from src.core.config import get_config
from src.core.errors import AuthError

__all__ = ["create_app"]
logger = logging.getLogger(__name__)

_Handler = Callable[
    [aiohttp.web.Request],
    Awaitable[aiohttp.web.StreamResponse],
]

# AppKey 类型定义，避免 NotAppKeyWarning
REGISTRY_KEY: AppKey[Any] = AppKey("registry")
SESSION_KEY: AppKey[Any] = AppKey("session")


def _json_response(
    data: Any,
    status: int = 200,
    headers: Optional[dict] = None,
) -> aiohttp.web.Response:
    """构建 JSON 响应。

    Args:
        data: 可序列化数据。
        status: HTTP 状态码。
        headers: 额外响应头。

    Returns:
        aiohttp.web.Response 实例。
    """
    body = json.dumps(data, ensure_ascii=False)
    resp_headers = {"Content-Type": "application/json"}
    if headers:
        resp_headers.update(headers)
    return aiohttp.web.Response(
        body=body.encode("utf-8"),
        status=status,
        headers=resp_headers,
    )


@aiohttp.web.middleware
async def _cors_middleware(
    request: aiohttp.web.Request,
    handler: _Handler,
) -> aiohttp.web.StreamResponse:
    """CORS 中间件——允许跨域访问。

    Args:
        request: 请求对象。
        handler: 下一个处理器。

    Returns:
        响应对象。
    """
    if request.method == "OPTIONS":
        return aiohttp.web.Response(
            status=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": (
                    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
                ),
                "Access-Control-Allow-Headers": (
                    "Content-Type, Authorization, X-API-Key, "
                    "Anthropic-Version, x-api-key"
                ),
                "Access-Control-Max-Age": "86400",
            },
        )
    resp = await handler(request)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    )
    resp.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization, X-API-Key, "
        "Anthropic-Version, x-api-key"
    )
    return resp


@aiohttp.web.middleware
async def _auth_middleware(
    request: aiohttp.web.Request,
    handler: _Handler,
) -> aiohttp.web.StreamResponse:
    """认证中间件——可选 Bearer Token 验证。

    Args:
        request: 请求对象。
        handler: 下一个处理器。

    Returns:
        响应对象。
    """
    cfg = get_config()
    if not cfg.auth.enabled or not cfg.auth.keys:
        return await handler(request)

    skip = {"/", "/health", "/docs", "/v1/models"}
    if request.path in skip or request.method == "OPTIONS":
        return await handler(request)

    auth_header = request.headers.get("Authorization", "")
    api_key_header = request.headers.get("X-API-Key", "") or request.headers.get(
        "x-api-key", ""
    )

    token = ""
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    elif api_key_header:
        token = api_key_header.strip()

    if token not in cfg.auth.keys:
        return _json_response(
            {
                "error": {
                    "message": "Invalid or missing API key",
                    "type": "authentication_error",
                    "code": "invalid_api_key",
                }
            },
            status=401,
        )
    return await handler(request)


@aiohttp.web.middleware
async def _error_middleware(
    request: aiohttp.web.Request,
    handler: _Handler,
) -> aiohttp.web.StreamResponse:
    """全局错误捕获中间件。

    Args:
        request: 请求对象。
        handler: 下一个处理器。

    Returns:
        响应对象。
    """
    try:
        return await handler(request)
    except aiohttp.web.HTTPException:
        raise
    except AuthError as e:
        return _json_response(
            {"error": {"message": str(e), "type": "authentication_error"}},
            status=401,
        )
    except Exception as e:
        logger.error(
            "未捕获异常: %s %s -> %s", request.method, request.path, e
        )
        return _json_response(
            {"error": {"message": str(e), "type": "server_error"}},
            status=500,
        )


async def create_app(registry: Any, session: Any) -> aiohttp.web.Application:
    """创建 aiohttp.web 应用实例。

    Args:
        registry: 平台注册表。
        session: 共享 aiohttp ClientSession。

    Returns:
        配置好的 Application 实例。
    """
    from src.routes.anthropic import setup_routes as setup_anth
    from src.routes.openai import setup_routes as setup_oai
    from src.routes.static import setup_routes as setup_static

    app = aiohttp.web.Application(
        middlewares=[_cors_middleware, _auth_middleware, _error_middleware],
        client_max_size=100 * 1024 * 1024,  # 100MB
    )

    app[REGISTRY_KEY] = registry
    app[SESSION_KEY] = session

    setup_static(app)
    setup_oai(app)
    setup_anth(app)

    async def _on_startup(application: aiohttp.web.Application) -> None:
        """应用启动回调。

        Args:
            application: 应用实例。
        """
        logger.info("aiohttp.web 应用已启动")

    async def _on_cleanup(application: aiohttp.web.Application) -> None:
        """应用清理回调。

        Args:
            application: 应用实例。
        """
        logger.info("aiohttp.web 应用正在清理")

    app.on_startup.append(_on_startup)
    app.on_cleanup.append(_on_cleanup)

    return app
