"""静态路由"""

from __future__ import annotations

import time
from typing import Any, Dict

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

__all__ = ["router"]
router = APIRouter()


@router.get("/")
async def root() -> Dict[str, Any]:
    return {"service": "Provider-V2", "version": "2.0.0", "docs": "/docs"}


@router.get("/health")
async def health() -> Dict[str, Any]:
    return {"status": "healthy", "timestamp": int(time.time())}


@router.get("/v1/models")
async def list_models(request: Request) -> JSONResponse:
    return JSONResponse(
        {"object": "list", "data": await request.app.state.registry.all_models()}
    )


@router.get("/v1/models/{model_id}")
async def get_model(model_id: str, request: Request) -> JSONResponse:
    for m in await request.app.state.registry.all_models():
        if m["id"] == model_id:
            return JSONResponse(m)
    return JSONResponse(
        status_code=404,
        content={
            "error": {
                "message": f"Model {model_id} not found",
                "type": "invalid_request_error",
                "code": "model_not_found",
            }
        },
    )


@router.get("/v1/status")
async def status(request: Request) -> JSONResponse:
    reg = request.app.state.registry
    info: Dict[str, Any] = {}
    for n, a in reg.adapters.items():
        try:
            cs = await a.candidates()
            caps = set()
            for c in cs:
                caps.update(c.capabilities_set())
            info[n] = {
                "candidates": len(cs),
                "available": len([c for c in cs if c.available and not c.busy]),
                "capabilities": sorted(caps),
            }
        except Exception:
            info[n] = {"error": "failed"}
    return JSONResponse(
        {
            "status": "running",
            "platforms": info,
            "tas": await reg.selector.get_stats(),
            "timestamp": int(time.time()),
        }
    )
