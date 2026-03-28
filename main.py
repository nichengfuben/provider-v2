"""Provider-V2 统一网关入口"""

from __future__ import annotations

import asyncio
import logging
import sys
from contextlib import asynccontextmanager

import aiohttp
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import src.core.proxy  # noqa: F401
from src.core.config import get_config, start_config_watcher
from src.core.registry import Registry
from src.routes.anthropic import router as anthropic_router
from src.routes.openai import router as openai_router
from src.routes.static import router as static_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("provider")

_NO_AUTH = frozenset({"/", "/health", "/docs", "/redoc", "/openapi.json"})


async def _auth_mw(request: Request, call_next):
    """鉴权中间件"""
    cfg = get_config()
    if not cfg.auth.enabled:
        return await call_next(request)
    path = request.url.path
    if path in _NO_AUTH:
        return await call_next(request)
    if not path.startswith("/v1/") and path != "/messages":
        return await call_next(request)
    key = ""
    ah = request.headers.get("authorization", "")
    if ah.startswith("Bearer "):
        key = ah[7:]
    if not key:
        key = request.headers.get("x-api-key", "")
    if not key or key not in cfg.auth.keys:
        if "/messages" in path:
            return JSONResponse(
                status_code=401,
                content={
                    "type": "error",
                    "error": {
                        "type": "authentication_error",
                        "message": "Invalid API key",
                    },
                },
            )
        return JSONResponse(
            status_code=401,
            content={
                "error": {
                    "message": "Invalid API key",
                    "type": "authentication_error",
                    "param": None,
                    "code": "invalid_api_key",
                }
            },
        )
    return await call_next(request)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期"""
    cfg = get_config()
    logger.info("启动 Provider-V2 ...")
    conn = aiohttp.TCPConnector(
        limit=200, limit_per_host=50, keepalive_timeout=30, ssl=False
    )
    session = aiohttp.ClientSession(connector=conn)
    app.state.session = session
    reg = Registry()
    await reg.init(session)
    app.state.registry = reg
    watcher = asyncio.create_task(start_config_watcher())
    logger.info("Provider-V2 就绪 http://%s:%s", cfg.server.host, cfg.server.port)
    yield
    logger.info("关闭 Provider-V2 ...")
    watcher.cancel()
    try:
        await asyncio.wait_for(reg.close(), timeout=3.0)
    except (asyncio.TimeoutError, Exception) as e:
        logger.warning("关闭超时: %s", e)
    try:
        await session.close()
    except Exception:
        pass
    logger.info("Provider-V2 已关闭")


app = FastAPI(title="Provider-V2", version="2.0.0", lifespan=lifespan, docs_url="/docs")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(_auth_mw)
app.include_router(static_router)
app.include_router(openai_router)
app.include_router(anthropic_router)


@app.exception_handler(Exception)
async def _exc(request: Request, exc: Exception):
    logger.error("未处理异常: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": "Internal server error",
                "type": "server_error",
                "param": None,
                "code": "internal_error",
            }
        },
    )


def main() -> None:
    """入口"""
    cfg = get_config()
    uvicorn.run(
        "main:app",
        host=cfg.server.host,
        port=cfg.server.port,
        log_level="info",
        reload=True,
        reload_includes=["src/**/*.py", "main.py", "config.toml"],
        timeout_graceful_shutdown=3,
        loop="uvloop" if sys.platform != "win32" else "asyncio",
    )


if __name__ == "__main__":
    main()
