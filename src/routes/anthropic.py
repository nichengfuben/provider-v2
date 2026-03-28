"""Anthropic 兼容路由"""

from __future__ import annotations

import json
import logging
import re
import time
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, ConfigDict, Field

from src.core import gateway
from src.core.errors import NoCandidateError, ProviderError

__all__ = ["router"]
logger = logging.getLogger(__name__)
router = APIRouter()
_FNCALL_CLEAN = re.compile(r"<function=[^>]*>.*?</" + r"function>", re.DOTALL)
_FE_TAG = "</" + "function>"


class _CB(BaseModel):
    type: str
    text: Optional[str] = None
    id: Optional[str] = None
    name: Optional[str] = None
    input: Optional[Dict[str, Any]] = None
    source: Optional[Dict[str, Any]] = None


class AnthMsg(BaseModel):
    role: str
    content: Union[str, List[_CB]]


class _TD(BaseModel):
    name: str
    description: Optional[str] = None
    input_schema: Dict[str, Any] = Field(default_factory=dict)


class AnthReq(BaseModel):
    model: str
    messages: List[AnthMsg]
    max_tokens: int = 4096
    system: Optional[str] = None
    temperature: Optional[float] = None
    top_p: Optional[float] = None
    stream: bool = False
    tools: Optional[List[_TD]] = None
    tool_choice: Optional[Dict[str, Any]] = None
    thinking: Optional[Any] = None
    model_config = ConfigDict(extra="allow")


def _mid() -> str:
    return f"msg_{uuid.uuid4().hex[:24]}"


def _err(status: int, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={
            "type": "error",
            "error": {"type": "server_error", "message": message},
        },
    )


def _is_thinking(req: AnthReq) -> bool:
    t = req.thinking
    if t is None:
        ex = getattr(req, "model_extra", None) or {}
        t = ex.get("thinking")
    if t is None:
        return False
    if isinstance(t, bool):
        return t
    if isinstance(t, dict):
        return t.get("type") == "enabled" or t.get("enabled", False)
    return bool(t)


def _am2d(msgs: List[AnthMsg], system: Optional[str] = None) -> List[Dict]:
    out: List[Dict] = []
    if system:
        out.append({"role": "system", "content": system})
    for m in msgs:
        if isinstance(m.content, str):
            out.append({"role": m.role, "content": m.content})
        elif isinstance(m.content, list):
            parts = []
            for b in m.content:
                if b.type == "text" and b.text:
                    parts.append(b.text)
                elif b.type == "tool_result" and b.text:
                    parts.append(f"Tool result ({b.id}): {b.text}")
                elif b.type == "tool_use" and b.name:
                    parts.append(
                        f"Tool call ({b.id}): {b.name}"
                        f"({json.dumps(b.input or {}, ensure_ascii=False)})"
                    )
            out.append({"role": m.role, "content": "\n".join(parts)})
    return out


def _at2d(tools: Optional[List[_TD]]) -> Optional[List[Dict]]:
    if not tools:
        return None
    return [
        {
            "type": "function",
            "function": {
                "name": t.name,
                "description": t.description or "",
                "parameters": t.input_schema,
            },
        }
        for t in tools
    ]


def _clean(content: str) -> str:
    return _FNCALL_CLEAN.sub("", content).strip()


async def _sgen(rd: AnthReq, req: Request) -> AsyncGenerator[str, None]:
    mid, mdl = _mid(), rd.model
    msgs = _am2d(rd.messages, rd.system)
    pt = sum(len(str(m.get("content", ""))) // 3 for m in msgs)
    thinking = _is_thinking(rd)
    ex = getattr(rd, "model_extra", None) or {}

    # 构建 message_start 数据
    msg_start_data = {
        'type': 'message_start',
        'message': {
            'id': mid,
            'type': 'message',
            'role': 'assistant',
            'content': [],
            'model': mdl,
            'stop_reason': None,
            'usage': {'input_tokens': pt, 'output_tokens': 0}
        }
    }
    yield f"event: message_start\ndata: {json.dumps(msg_start_data)}\n\n"

    block_idx = 0
    if thinking:
        content_block_data = {
            'type': 'content_block_start',
            'index': 0,
            'content_block': {'type': 'thinking', 'thinking': ''}
        }
        yield f"event: content_block_start\ndata: {json.dumps(content_block_data)}\n\n"
        block_idx = 1
    
    text_idx = block_idx
    text_block_data = {
        'type': 'content_block_start',
        'index': text_idx,
        'content_block': {'type': 'text', 'text': ''}
    }
    yield f"event: content_block_start\ndata: {json.dumps(text_block_data)}\n\n"

    ot = 0
    tcs: List[Dict] = []
    usage_d: Optional[Dict] = None
    acc = ""
    try:
        async for ch in gateway.dispatch(
            registry=req.app.state.registry,
            messages=msgs,
            model=mdl,
            stream=True,
            tools=_at2d(rd.tools),
            thinking=thinking,
            search=bool(ex.get("search")),
            temperature=rd.temperature,
            top_p=rd.top_p,
            max_tokens=rd.max_tokens,
        ):
            if isinstance(ch, str):
                ot += 1
                acc += ch
                if "<function=" in acc and _FE_TAG not in acc:
                    continue
                if "<function=" in acc and _FE_TAG in acc:
                    continue
                delta_data = {
                    'type': 'content_block_delta',
                    'index': text_idx,
                    'delta': {'type': 'text_delta', 'text': ch}
                }
                yield f"event: content_block_delta\ndata: {json.dumps(delta_data)}\n\n"
            elif isinstance(ch, dict):
                if "thinking" in ch and thinking:
                    thinking_data = {
                        'type': 'content_block_delta',
                        'index': 0,
                        'delta': {'type': 'thinking_delta', 'thinking': ch['thinking']}
                    }
                    yield f"event: content_block_delta\ndata: {json.dumps(thinking_data)}\n\n"
                elif "tool_calls" in ch:
                    tcs = ch["tool_calls"]
                elif "usage" in ch:
                    usage_d = ch["usage"]
    except Exception as e:
        error_data = {
            'type': 'error',
            'error': {'type': 'server_error', 'message': str(e)}
        }
        yield f"event: error\ndata: {json.dumps(error_data)}\n\n"
        return

    if thinking:
        stop_data = {'type': 'content_block_stop', 'index': 0}
        yield f"event: content_block_stop\ndata: {json.dumps(stop_data)}\n\n"
    
    stop_data_text = {'type': 'content_block_stop', 'index': text_idx}
    yield f"event: content_block_stop\ndata: {json.dumps(stop_data_text)}\n\n"

    for i, tc in enumerate(tcs):
        ti = text_idx + 1 + i
        block_start_data = {
            'type': 'content_block_start',
            'index': ti,
            'content_block': {
                'type': 'tool_use',
                'id': tc['id'],
                'name': tc['function']['name'],
                'input': {}
            }
        }
        yield f"event: content_block_start\ndata: {json.dumps(block_start_data)}\n\n"
        
        delta_data = {
            'type': 'content_block_delta',
            'index': ti,
            'delta': {
                'type': 'input_json_delta',
                'partial_json': tc['function']['arguments']
            }
        }
        yield f"event: content_block_delta\ndata: {json.dumps(delta_data)}\n\n"
        
        stop_data_tool = {'type': 'content_block_stop', 'index': ti}
        yield f"event: content_block_stop\ndata: {json.dumps(stop_data_tool)}\n\n"

    sr = "tool_use" if tcs else "end_turn"
    ou = (usage_d or {}).get(
        "completion_tokens", (usage_d or {}).get("output_tokens", ot)
    )
    
    delta_data = {
        'type': 'message_delta',
        'delta': {'stop_reason': sr},
        'usage': {'output_tokens': ou}
    }
    yield f"event: message_delta\ndata: {json.dumps(delta_data)}\n\n"
    yield f"event: message_stop\ndata: {json.dumps({'type': 'message_stop'})}\n\n"


async def _handle(rd: AnthReq, req: Request) -> Union[JSONResponse, StreamingResponse]:
    if not rd.messages:
        return _err(400, "messages is required")
    if rd.stream:
        return StreamingResponse(
            _sgen(rd, req),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    mid = _mid()
    msgs = _am2d(rd.messages, rd.system)
    thinking = _is_thinking(rd)
    ex = getattr(rd, "model_extra", None) or {}
    cp: List[str] = []
    tp: List[str] = []
    tcs: List[Dict] = []
    usage_d: Optional[Dict] = None
    try:
        async for ch in gateway.dispatch(
            registry=req.app.state.registry,
            messages=msgs,
            model=rd.model,
            stream=False,
            tools=_at2d(rd.tools),
            thinking=thinking,
            search=bool(ex.get("search")),
            temperature=rd.temperature,
            top_p=rd.top_p,
            max_tokens=rd.max_tokens,
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
        return _err(503, str(e))
    except ProviderError as e:
        return _err(502, str(e))

    text = "".join(cp)
    if text:
        cleaned = _clean(text)
        if cleaned != text:
            text = cleaned
    rc: List[Dict] = []
    if tp:
        rc.append({"type": "thinking", "thinking": "".join(tp)})
    if text:
        rc.append({"type": "text", "text": text})
    for tc in tcs:
        try:
            inp = json.loads(tc["function"]["arguments"])
        except (json.JSONDecodeError, KeyError):
            inp = {}
        rc.append(
            {
                "type": "tool_use",
                "id": tc["id"],
                "name": tc["function"]["name"],
                "input": inp,
            }
        )

    pt = sum(len(str(m.get("content", ""))) // 3 for m in msgs)
    ot = (usage_d or {}).get(
        "completion_tokens", (usage_d or {}).get("output_tokens", len(text) // 3)
    )
    return JSONResponse(
        {
            "id": mid,
            "type": "message",
            "role": "assistant",
            "content": rc,
            "model": rd.model,
            "stop_reason": "tool_use" if tcs else "end_turn",
            "usage": {"input_tokens": pt, "output_tokens": ot},
        }
    )


def _parse_system(body: Dict[str, Any]) -> None:
    """处理 Claude Code 发送的 system 列表格式，原地修改 body"""
    if "system" in body and isinstance(body["system"], list):
        texts = []
        for item in body["system"]:
            if isinstance(item, dict) and item.get("type") == "text":
                texts.append(item.get("text", ""))
            elif isinstance(item, str):
                texts.append(item)
        body["system"] = "\n".join(texts) if texts else None


@router.post("/v1/messages", response_model=None)
async def anth_messages(req: Request) -> Union[JSONResponse, StreamingResponse]:
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON")
    _parse_system(body)
    try:
        request = AnthReq(**body)
    except Exception as e:
        return _err(400, str(e))
    return await _handle(request, req)


@router.post("/messages", response_model=None)
async def anth_messages_native(req: Request) -> Union[JSONResponse, StreamingResponse]:
    try:
        body = await req.json()
    except Exception:
        return _err(400, "Invalid JSON")
    _parse_system(body)
    try:
        request = AnthReq(**body)
    except Exception as e:
        return _err(400, str(e))
    return await _handle(request, req)
