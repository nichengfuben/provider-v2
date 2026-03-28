"""OpenAI 兼容路由——chat / embeddings / images / audio / moderations"""

from __future__ import annotations

import json
import logging
import re
import time
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

from fastapi import APIRouter, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse, Response
from pydantic import BaseModel, ConfigDict, Field

from src.core import gateway
from src.core.errors import (
    NoCandidateError,
    ProviderError,
    UnsupportedServiceError,
)

__all__ = ["router"]
logger = logging.getLogger(__name__)
router = APIRouter()
_FNCALL_CLEAN = re.compile(r"<function=[^>]*>.*?</" + r"function>", re.DOTALL)
_FE_TAG = "</" + "function>"


# ===================================================================
# Pydantic 模型
# ===================================================================


class _ImgURL(BaseModel):
    url: str
    detail: Optional[str] = None


class ContentPart(BaseModel):
    type: str
    text: Optional[str] = None
    image_url: Optional[_ImgURL] = None


class _FC(BaseModel):
    name: str
    arguments: str


class _TC(BaseModel):
    id: str
    type: str = "function"
    function: _FC


class ChatMsg(BaseModel):
    role: str
    content: Optional[Union[str, List[ContentPart]]] = None
    name: Optional[str] = None
    tool_calls: Optional[List[_TC]] = None
    tool_call_id: Optional[str] = None


class _FD(BaseModel):
    name: str
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


class ToolDef(BaseModel):
    type: str = "function"
    function: _FD


class ChatReq(BaseModel):
    model: str = "qwen3-coder-plus"
    messages: List[ChatMsg] = Field(default_factory=list)
    stream: bool = False
    temperature: Optional[float] = None
    top_p: Optional[float] = None
    max_tokens: Optional[int] = None
    tools: Optional[List[ToolDef]] = None
    tool_choice: Optional[Union[str, Dict[str, Any]]] = None
    stop: Optional[Union[str, List[str]]] = None
    user: Optional[str] = None
    extra_body: Optional[Dict[str, Any]] = None
    extra: Optional[Dict[str, Any]] = None
    model_config = ConfigDict(extra="allow")


class EmbedReq(BaseModel):
    input: Union[str, List[str]]
    model: str
    encoding_format: Optional[str] = None
    user: Optional[str] = None
    model_config = ConfigDict(extra="allow")


class ImageGenReq(BaseModel):
    prompt: str
    model: str = "dall-e-3"
    n: int = 1
    size: str = "1024x1024"
    quality: str = "standard"
    response_format: str = "url"
    style: str = "vivid"
    user: Optional[str] = None
    model_config = ConfigDict(extra="allow")


class TTSReq(BaseModel):
    input: str
    model: str = "tts-1"
    voice: str = "alloy"
    response_format: str = "mp3"
    speed: float = 1.0
    model_config = ConfigDict(extra="allow")


class ModerationReq(BaseModel):
    input: Union[str, List[str]]
    model: str = "text-moderation-latest"
    model_config = ConfigDict(extra="allow")


# ===================================================================
# 工具函数
# ===================================================================


def _cid() -> str:
    return f"chatcmpl-{uuid.uuid4().hex[:24]}"


def _err(
    status: int,
    message: str,
    code: str = "error",
    typ: str = "invalid_request_error",
    param: Optional[str] = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={
            "error": {"message": message, "type": typ, "param": param, "code": code}
        },
    )


def _get_extra(r: ChatReq) -> Dict[str, Any]:
    return r.extra_body or r.extra or {}


def _m2d(msgs: List[ChatMsg]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for m in msgs:
        d: Dict[str, Any] = {"role": m.role}
        if isinstance(m.content, str):
            d["content"] = m.content
        elif isinstance(m.content, list):
            parts = []
            for p in m.content:
                pd: Dict[str, Any] = {"type": p.type}
                if p.text is not None:
                    pd["text"] = p.text
                if p.image_url is not None:
                    pd["image_url"] = {"url": p.image_url.url}
                parts.append(pd)
            d["content"] = parts
        else:
            d["content"] = ""
        if m.name:
            d["name"] = m.name
        if m.tool_call_id:
            d["tool_call_id"] = m.tool_call_id
        if m.tool_calls:
            d["tool_calls"] = [tc.model_dump() for tc in m.tool_calls]
        out.append(d)
    return out


def _t2d(tools: Optional[List[ToolDef]]) -> Optional[List[Dict]]:
    return [t.model_dump() for t in tools] if tools else None


def _sl(s: Optional[Union[str, List[str]]]) -> Optional[List[str]]:
    if s is None:
        return None
    return [s] if isinstance(s, str) else s


def _clean(content: str) -> str:
    return _FNCALL_CLEAN.sub("", content).strip()


# ===================================================================
# Chat Completions
# ===================================================================


async def _sgen(request: ChatReq, req: Request) -> AsyncGenerator[str, None]:
    cid, ct, mdl = _cid(), int(time.time()), request.model
    ex = _get_extra(request)
    
    # 构建初始 chunk 数据
    start_data = {
        'id': cid,
        'object': 'chat.completion.chunk',
        'created': ct,
        'model': mdl,
        'choices': [{'index': 0, 'delta': {'role': 'assistant'}, 'finish_reason': None}]
    }
    yield f"data: {json.dumps(start_data, ensure_ascii=False)}\n\n"
    
    ctok = 0
    has_tc = False
    usage_d: Optional[Dict] = None
    acc = ""
    try:
        async for ch in gateway.dispatch(
            registry=req.app.state.registry,
            messages=_m2d(request.messages),
            model=mdl,
            stream=True,
            tools=_t2d(request.tools),
            thinking=bool(ex.get("thinking")),
            search=bool(ex.get("search")),
            temperature=request.temperature,
            top_p=request.top_p,
            max_tokens=request.max_tokens,
            stop=_sl(request.stop),
        ):
            if isinstance(ch, str):
                ctok += 1
                acc += ch
                if "<function=" in acc and _FE_TAG not in acc:
                    continue
                if "<function=" in acc and _FE_TAG in acc:
                    has_tc = True
                    continue
                chunk_data = {
                    'id': cid,
                    'object': 'chat.completion.chunk',
                    'created': ct,
                    'model': mdl,
                    'choices': [{'index': 0, 'delta': {'content': ch}, 'finish_reason': None}]
                }
                yield f"data: {json.dumps(chunk_data, ensure_ascii=False)}\n\n"
            elif isinstance(ch, dict):
                if "thinking" in ch:
                    thinking_data = {
                        'id': cid,
                        'object': 'chat.completion.chunk',
                        'created': ct,
                        'model': mdl,
                        'choices': [{'index': 0, 'delta': {'reasoning_content': ch['thinking']}, 'finish_reason': None}]
                    }
                    yield f"data: {json.dumps(thinking_data, ensure_ascii=False)}\n\n"
                elif "tool_calls" in ch:
                    has_tc = True
                elif "usage" in ch:
                    usage_d = ch["usage"]
    except Exception as e:
        logger.error("流式错误: %s", e, exc_info=True)
        error_data = {'error': {'message': str(e), 'type': 'server_error'}}
        yield f"data: {json.dumps(error_data, ensure_ascii=False)}\n\n"
    
    fr = "tool_calls" if has_tc else "stop"
    u = usage_d or {
        "prompt_tokens": 0,
        "completion_tokens": ctok,
        "total_tokens": ctok,
    }
    
    finish_data = {
        'id': cid,
        'object': 'chat.completion.chunk',
        'created': ct,
        'model': mdl,
        'choices': [{'index': 0, 'delta': {}, 'finish_reason': fr}],
        'usage': u
    }
    yield f"data: {json.dumps(finish_data, ensure_ascii=False)}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/v1/chat/completions", response_model=None)
async def chat_completions(req: Request) -> Union[JSONResponse, StreamingResponse]:
    """OpenAI Chat Completions 端点"""
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON in request body", "invalid_json")
    try:
        request = ChatReq(**body)
    except Exception as e:
        return _err(400, f"Invalid request parameters: {e}", "invalid_params")
    if not request.messages:
        return _err(400, "messages is required", "missing_field", param="messages")

    if request.stream:
        return StreamingResponse(
            _sgen(request, req),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    cid, ct = _cid(), int(time.time())
    ex = _get_extra(request)
    cp: List[str] = []
    tp: List[str] = []
    tcs: List[Dict] = []
    usage_d: Optional[Dict] = None
    try:
        async for ch in gateway.dispatch(
            registry=req.app.state.registry,
            messages=_m2d(request.messages),
            model=request.model,
            stream=False,
            tools=_t2d(request.tools),
            thinking=bool(ex.get("thinking")),
            search=bool(ex.get("search")),
            temperature=request.temperature,
            top_p=request.top_p,
            max_tokens=request.max_tokens,
            stop=_sl(request.stop),
        ):
            if isinstance(ch, str):
                cp.append(ch)
            elif isinstance(ch, dict):
                if "thinking" in ch:
                    tp.append(ch["thinking"])
                elif "tool_calls" in ch:
                    tcs = ch["tool_calls"]
                elif "usage" in ch:
                    usage_d = ch["usage"]
    except NoCandidateError as e:
        return _err(503, str(e), "no_candidate", "service_unavailable")
    except ProviderError as e:
        return _err(502, str(e), "provider_error", "upstream_error")
    except Exception as e:
        logger.error("补全异常: %s", e, exc_info=True)
        return _err(500, str(e), "internal_error", "server_error")

    content = "".join(cp)
    if content:
        cleaned = _clean(content)
        if cleaned != content:
            content = cleaned
    u = usage_d or {
        "prompt_tokens": 0,
        "completion_tokens": len(content) // 3,
        "total_tokens": len(content) // 3,
    }
    msg: Dict[str, Any] = {"role": "assistant"}
    if content:
        msg["content"] = content
    if tp:
        msg["reasoning_content"] = "".join(tp)
    if tcs:
        msg["tool_calls"] = tcs
    return JSONResponse(
        content={
            "id": cid,
            "object": "chat.completion",
            "created": ct,
            "model": request.model,
            "choices": [
                {
                    "index": 0,
                    "message": msg,
                    "finish_reason": "tool_calls" if tcs else "stop",
                }
            ],
            "usage": u,
        }
    )


# ===================================================================
# Embeddings
# ===================================================================


@router.post("/v1/embeddings", response_model=None)
async def embeddings(req: Request) -> JSONResponse:
    """OpenAI Embeddings 端点"""
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON", "invalid_json")
    try:
        request = EmbedReq(**body)
    except Exception as e:
        return _err(400, f"Invalid params: {e}", "invalid_params")

    try:
        result = await gateway.dispatch_embed(
            registry=req.app.state.registry,
            input_data=request.input,
            model=request.model,
        )
        return JSONResponse(content=result)
    except NoCandidateError as e:
        return _err(503, str(e), "no_candidate", "service_unavailable")
    except UnsupportedServiceError as e:
        return _err(501, str(e), "unsupported", "not_implemented")
    except ProviderError as e:
        return _err(502, str(e), "provider_error", "upstream_error")
    except Exception as e:
        logger.error("embedding 异常: %s", e, exc_info=True)
        return _err(500, str(e), "internal_error", "server_error")


# ===================================================================
# Images Generation
# ===================================================================


@router.post("/v1/images/generations", response_model=None)
async def images_generations(req: Request) -> JSONResponse:
    """OpenAI Images Generation 端点"""
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON", "invalid_json")
    try:
        request = ImageGenReq(**body)
    except Exception as e:
        return _err(400, f"Invalid params: {e}", "invalid_params")

    try:
        result = await gateway.dispatch_image_gen(
            registry=req.app.state.registry,
            prompt=request.prompt,
            model=request.model,
            n=request.n,
            size=request.size,
            response_format=request.response_format,
            quality=request.quality,
            style=request.style,
        )
        return JSONResponse(content=result)
    except NoCandidateError as e:
        return _err(503, str(e), "no_candidate", "service_unavailable")
    except UnsupportedServiceError as e:
        return _err(501, str(e), "unsupported", "not_implemented")
    except ProviderError as e:
        return _err(502, str(e), "provider_error", "upstream_error")
    except Exception as e:
        logger.error("image_gen 异常: %s", e, exc_info=True)
        return _err(500, str(e), "internal_error", "server_error")


# ===================================================================
# Audio - TTS
# ===================================================================


@router.post("/v1/audio/speech", response_model=None)
async def audio_speech(req: Request) -> Union[Response, JSONResponse]:
    """OpenAI TTS 端点"""
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON", "invalid_json")
    try:
        request = TTSReq(**body)
    except Exception as e:
        return _err(400, f"Invalid params: {e}", "invalid_params")

    mime_map = {
        "mp3": "audio/mpeg",
        "opus": "audio/opus",
        "aac": "audio/aac",
        "flac": "audio/flac",
        "wav": "audio/wav",
        "pcm": "audio/pcm",
    }
    content_type = mime_map.get(request.response_format, "audio/mpeg")

    try:

        async def _stream() -> AsyncGenerator[bytes, None]:
            async for chunk in gateway.dispatch_tts(
                registry=req.app.state.registry,
                text=request.input,
                model=request.model,
                voice=request.voice,
                response_format=request.response_format,
                speed=request.speed,
            ):
                yield chunk

        return StreamingResponse(
            _stream(),
            media_type=content_type,
            headers={
                "Content-Disposition": (
                    f"attachment; filename=speech.{request.response_format}"
                ),
            },
        )
    except NoCandidateError as e:
        return _err(503, str(e), "no_candidate", "service_unavailable")
    except UnsupportedServiceError as e:
        return _err(501, str(e), "unsupported", "not_implemented")
    except ProviderError as e:
        return _err(502, str(e), "provider_error", "upstream_error")
    except Exception as e:
        logger.error("TTS 异常: %s", e, exc_info=True)
        return _err(500, str(e), "internal_error", "server_error")


# ===================================================================
# Audio - STT (Transcriptions)
# ===================================================================


@router.post("/v1/audio/transcriptions", response_model=None)
async def audio_transcriptions(
    req: Request,
    file: UploadFile = File(...),
    model: str = Form("whisper-1"),
    language: Optional[str] = Form(None),
    response_format: str = Form("json"),
) -> JSONResponse:
    """OpenAI STT (Whisper) 端点"""
    try:
        audio_data = await file.read()
    except Exception as e:
        return _err(400, f"读取音频文件失败: {e}", "invalid_file")

    try:
        result = await gateway.dispatch_stt(
            registry=req.app.state.registry,
            audio_data=audio_data,
            model=model,
            language=language,
            response_format=response_format,
        )
        return JSONResponse(content=result)
    except NoCandidateError as e:
        return _err(503, str(e), "no_candidate", "service_unavailable")
    except UnsupportedServiceError as e:
        return _err(501, str(e), "unsupported", "not_implemented")
    except ProviderError as e:
        return _err(502, str(e), "provider_error", "upstream_error")
    except Exception as e:
        logger.error("STT 异常: %s", e, exc_info=True)
        return _err(500, str(e), "internal_error", "server_error")


# ===================================================================
# Moderations
# ===================================================================


@router.post("/v1/moderations", response_model=None)
async def moderations(req: Request) -> JSONResponse:
    """OpenAI Moderations 端点"""
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON", "invalid_json")
    try:
        request = ModerationReq(**body)
    except Exception as e:
        return _err(400, f"Invalid params: {e}", "invalid_params")

    try:
        result = await gateway.dispatch_moderation(
            registry=req.app.state.registry,
            input_data=request.input,
            model=request.model,
        )
        return JSONResponse(content=result)
    except NoCandidateError as e:
        return _err(503, str(e), "no_candidate", "service_unavailable")
    except UnsupportedServiceError as e:
        return _err(501, str(e), "unsupported", "not_implemented")
    except ProviderError as e:
        return _err(502, str(e), "provider_error", "upstream_error")
    except Exception as e:
        logger.error("moderation 异常: %s", e, exc_info=True)
        return _err(500, str(e), "internal_error", "server_error")
