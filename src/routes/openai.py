# -*- coding: utf-8 -*-
"""OpenAI 兼容路由——aiohttp.web 实现。"""

from __future__ import annotations

import asyncio
import json
import logging
import re
import time
import uuid
from typing import Any, AsyncIterator, Dict, List, Optional, Tuple, Union

import aiohttp.web

from src.core.errors import NoCandidateError, NotSupportedError, ProviderError
from src.core.server import REGISTRY_KEY
from src.core.tools import normalize_content

__all__ = ["setup_routes"]
logger = logging.getLogger(__name__)

_FNCALL_OPEN_TAG = "<function_calls>"
_FNCALL_CLOSE_TAG = "</function_calls>"


# ═══════════════════════════════════════════════════════════════════════════
# ID 生成工具
# ═══════════════════════════════════════════════════════════════════════════


def _cid() -> str:
    """生成 chat completion ID。"""
    return "chatcmpl-{}".format(uuid.uuid4().hex[:24])


def _bid() -> str:
    """生成 batch ID。"""
    return "batch_{}".format(uuid.uuid4().hex[:24])


def _fid() -> str:
    """生成 file ID。"""
    return "file-{}".format(uuid.uuid4().hex[:24])


def _aid() -> str:
    """生成 assistant ID。"""
    return "asst_{}".format(uuid.uuid4().hex[:24])


def _tid() -> str:
    """生成 thread ID。"""
    return "thread_{}".format(uuid.uuid4().hex[:24])


def _rid() -> str:
    """生成 run ID。"""
    return "run_{}".format(uuid.uuid4().hex[:24])


def _vid() -> str:
    """生成 vector store ID。"""
    return "vs_{}".format(uuid.uuid4().hex[:24])


def _uid() -> str:
    """生成 upload ID。"""
    return "upload_{}".format(uuid.uuid4().hex[:24])


def _resp_id() -> str:
    """生成 response ID。"""
    return "resp_{}".format(uuid.uuid4().hex[:24])


def _msg_id() -> str:
    """生成 message ID（短格式）。"""
    return "msg_{}".format(uuid.uuid4().hex[:16])


def _part_id() -> str:
    """生成 upload part ID。"""
    return "part_{}".format(uuid.uuid4().hex[:16])


def _job_id() -> str:
    """生成 fine-tuning job ID。"""
    return "ftjob-{}".format(uuid.uuid4().hex[:24])


# ═══════════════════════════════════════════════════════════════════════════
# HTTP 响应构建工具
# ═══════════════════════════════════════════════════════════════════════════


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


def _err(
    status: int,
    message: str,
    code: str = "error",
    typ: str = "invalid_request_error",
    param: Optional[str] = None,
) -> aiohttp.web.Response:
    """构建错误 JSON 响应。

    Args:
        status: HTTP 状态码。
        message: 错误信息。
        code: 错误代码。
        typ: 错误类型。
        param: 相关参数名。

    Returns:
        Response 实例。
    """
    return _json(
        {
            "error": {
                "message": message,
                "type": typ,
                "param": param,
                "code": code,
            }
        },
        status=status,
    )


# ═══════════════════════════════════════════════════════════════════════════
# 消息与内容处理工具
# ═══════════════════════════════════════════════════════════════════════════


def _normalize_messages(
    messages: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """规范化消息列表。

    Args:
        messages: 原始消息列表。

    Returns:
        规范化后的消息列表。
    """
    out: List[Dict[str, Any]] = []
    for m in messages:
        msg = dict(m)
        if msg.get("role") == "system":
            msg["content"] = normalize_content(msg.get("content"))
        out.append(msg)
    return out


def _sl(s: Optional[Union[str, List[str]]]) -> Optional[List[str]]:
    """统一 stop 参数为列表。

    Args:
        s: stop 参数，字符串或列表。

    Returns:
        列表或 None。
    """
    if s is None:
        return None
    return [s] if isinstance(s, str) else list(s)


def _clean_fncall(content: str) -> str:
    """清除所有 fncall 标签残留（支持新旧两种格式）。

    Args:
        content: 原始文本。

    Returns:
        清理后的文本（已 strip）。
    """
    content = re.sub(
        r"<function_calls>\s*<invoke[^>]*>.*?</invoke>\s*</function_calls>",
        "",
        content,
        flags=re.DOTALL,
    )
    close = "</function>"
    content = re.sub(
        r"<function=[^>]*>.*?" + re.escape(close),
        "",
        content,
        flags=re.DOTALL,
    )
    return content.strip()


def _safe_flush(buffer: str) -> Tuple[str, str]:
    """从缓冲区中提取可安全输出的部分，保留可能是 fncall 前缀的尾部。

    Args:
        buffer: 当前文本缓冲区。

    Returns:
        (safe, remain)：safe 为可输出部分，remain 为需继续缓冲的部分。
    """
    tag = _FNCALL_OPEN_TAG
    tag_len = len(tag)
    buf_len = len(buffer)

    safe_end = buf_len
    check_len = min(tag_len, buf_len)
    for length in range(check_len, 0, -1):
        start = buf_len - length
        if tag.startswith(buffer[start:]):
            safe_end = start
            break

    return buffer[:safe_end], buffer[safe_end:]


async def _get_json(
    request: aiohttp.web.Request,
) -> Optional[Dict[str, Any]]:
    """安全读取请求 JSON 体。

    Args:
        request: 请求对象。

    Returns:
        解析后的字典，解析失败返回 None。
    """
    try:
        return await request.json()
    except Exception:
        return None


def _get_registry(request: aiohttp.web.Request) -> Any:
    """从 app 取 registry，兼容 AppKey 与字符串 key。"""
    return request.app.get(REGISTRY_KEY) or request.app.get("registry")


def _require_registry(request: aiohttp.web.Request) -> Any:
    reg = _get_registry(request)
    if reg is None:
        raise RuntimeError("registry is not initialized")
    return reg


def _build_dispatch_kwargs(
    body: Dict[str, Any],
    messages: List[Dict[str, Any]],
    stream: bool,
    registry: Any,
) -> Dict[str, Any]:
    """从请求体构建 gateway.dispatch 调用参数。

    Args:
        body: 请求体字典。
        messages: 已规范化的消息列表。
        stream: 是否流式。
        registry: provider 注册表。

    Returns:
        dispatch 调用关键字参数字典。
    """
    extra: Dict[str, Any] = body.get("extra_body") or body.get("extra") or {}
    return {
        "registry": registry,
        "messages": messages,
        "model": body.get("model", ""),
        "stream": stream,
        "tools": body.get("tools"),
        "thinking": bool(extra.get("thinking")),
        "search": bool(extra.get("search")),
        "temperature": body.get("temperature"),
        "top_p": body.get("top_p"),
        "max_tokens": body.get("max_tokens"),
        "stop": _sl(body.get("stop")),
    }


# ═══════════════════════════════════════════════════════════════════════════
# 流式写入工具
# ═══════════════════════════════════════════════════════════════════════════


async def _write_chunk(
    resp: aiohttp.web.StreamResponse,
    data: Dict[str, Any],
) -> None:
    """向流式响应写入一个 SSE data chunk。

    Args:
        resp: 流式响应对象。
        data: 要序列化的 chunk 字典。
    """
    await resp.write(
        "data: {}\n\n".format(
            json.dumps(data, ensure_ascii=False)
        ).encode("utf-8")
    )


def _make_chunk(
    cid: str,
    ct: int,
    mdl: str,
    delta: Dict[str, Any],
    finish_reason: Optional[str] = None,
    usage: Optional[Dict[str, Any]] = None,
    index: int = 0,
) -> Dict[str, Any]:
    """构建标准 chat.completion.chunk 结构。

    Args:
        cid: completion ID。
        ct: 创建时间戳。
        mdl: 模型名。
        delta: delta 内容字典。
        finish_reason: 完成原因，流中间为 None。
        usage: 用量信息，仅最终 chunk 携带。
        index: choice index。

    Returns:
        chunk 字典。
    """
    chunk: Dict[str, Any] = {
        "id": cid,
        "object": "chat.completion.chunk",
        "created": ct,
        "model": mdl,
        "choices": [
            {
                "index": index,
                "delta": delta,
                "finish_reason": finish_reason,
            }
        ],
    }
    if usage is not None:
        chunk["usage"] = usage
    return chunk


# ═══════════════════════════════════════════════════════════════════════════
# fncall XML 解析
# ═══════════════════════════════════════════════════════════════════════════


def _parse_fncall_xml(xml: str) -> List[Dict[str, Any]]:
    """将 fncall XML 解析为 OpenAI tool_calls 格式。

    Args:
        xml: fncall XML 字符串。

    Returns:
        OpenAI tool_calls 列表，解析失败返回空列表。
    """
    tool_calls: List[Dict[str, Any]] = []
    try:
        invoke_pattern = re.compile(
            r"<invoke\s+name=[\"']([^\"']+)[\"'][^>]*>(.*?)</invoke>",
            re.DOTALL,
        )
        param_pattern = re.compile(
            r"<parameter\s+name=[\"']([^\"']+)[\"'][^>]*>(.*?)</parameter>",
            re.DOTALL,
        )
        for match in invoke_pattern.finditer(xml):
            func_name = match.group(1).strip()
            params_xml = match.group(2)
            arguments: Dict[str, Any] = {}
            for pm in param_pattern.finditer(params_xml):
                key = pm.group(1).strip()
                val = pm.group(2).strip()
                try:
                    arguments[key] = json.loads(val)
                except (json.JSONDecodeError, ValueError):
                    arguments[key] = val

            tool_calls.append(
                {
                    "id": "call_{}".format(uuid.uuid4().hex[:24]),
                    "type": "function",
                    "function": {
                        "name": func_name,
                        "arguments": json.dumps(
                            arguments, ensure_ascii=False
                        ),
                    },
                }
            )
    except Exception as exc:
        logger.warning("fncall XML 解析失败: %s", exc)
    return tool_calls


# ═══════════════════════════════════════════════════════════════════════════
# ChatCompletions 流式实现
# ═══════════════════════════════════════════════════════════════════════════


async def _stream_chat(
    request: aiohttp.web.Request,
    body: Dict[str, Any],
) -> aiohttp.web.StreamResponse:
    """流式聊天补全核心实现。

    Args:
        request: 请求对象。
        body: 已解析的请求体。

    Returns:
        StreamResponse 实例。
    """
    from src.core import gateway

    cid = _cid()
    ct = int(time.time())
    mdl = body.get("model", "")
    messages = _normalize_messages(body.get("messages", []))

    resp = aiohttp.web.StreamResponse(
        status=200,
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
    await resp.prepare(request)

    await _write_chunk(
        resp,
        _make_chunk(cid, ct, mdl, {"role": "assistant", "content": ""}),
    )

    text_buffer = ""
    fncall_buffer = ""
    in_fncall = False
    has_tc = False
    tool_calls_data: List[Dict[str, Any]] = []
    usage_d: Optional[Dict[str, Any]] = None
    completion_tokens = 0

    try:
        async for ch in gateway.dispatch(
            **_build_dispatch_kwargs(body, messages, True, _require_registry(request))
        ):
            if isinstance(ch, str):
                completion_tokens += 1

                if in_fncall:
                    fncall_buffer += ch
                    continue

                text_buffer += ch

                tag_idx = text_buffer.find(_FNCALL_OPEN_TAG)
                if tag_idx != -1:
                    safe_part = text_buffer[:tag_idx]
                    if safe_part:
                        await _write_chunk(
                            resp,
                            _make_chunk(cid, ct, mdl, {"content": safe_part}),
                        )
                    fncall_buffer = text_buffer[tag_idx:]
                    text_buffer = ""
                    in_fncall = True
                    has_tc = True
                    continue

                safe_part, text_buffer = _safe_flush(text_buffer)
                if safe_part:
                    await _write_chunk(
                        resp,
                        _make_chunk(cid, ct, mdl, {"content": safe_part}),
                    )

            elif isinstance(ch, dict):
                if "thinking" in ch:
                    await _write_chunk(
                        resp,
                        _make_chunk(
                            cid,
                            ct,
                            mdl,
                            {"reasoning_content": ch["thinking"]},
                        ),
                    )
                elif "tool_calls" in ch:
                    tool_calls_data = ch["tool_calls"]
                    has_tc = True
                elif "usage" in ch:
                    usage_d = ch["usage"]

    except asyncio.CancelledError:
        return resp
    except ConnectionResetError:
        return resp
    except Exception as exc:
        logger.error("流式错误: %s", exc, exc_info=True)
        err_payload = json.dumps(
            {"error": {"message": str(exc), "type": "server_error"}},
            ensure_ascii=False,
        )
        try:
            await resp.write(
                "data: {}\n\n".format(err_payload).encode("utf-8")
            )
        except Exception:
            pass
        return resp

    if text_buffer and not in_fncall:
        await _write_chunk(
            resp,
            _make_chunk(cid, ct, mdl, {"content": text_buffer}),
        )

    if in_fncall and fncall_buffer and not tool_calls_data:
        tool_calls_data = _parse_fncall_xml(fncall_buffer)

    if tool_calls_data:
        has_tc = True
        for idx, tc in enumerate(tool_calls_data):
            await _write_chunk(
                resp,
                _make_chunk(
                    cid,
                    ct,
                    mdl,
                    {
                        "tool_calls": [
                            {
                                "index": idx,
                                "id": tc.get(
                                    "id",
                                    "call_{}".format(uuid.uuid4().hex[:24]),
                                ),
                                "type": "function",
                                "function": {
                                    "name": tc.get("function", {}).get("name", ""),
                                    "arguments": "",
                                },
                            }
                        ]
                    },
                ),
            )
            args_str = tc.get("function", {}).get("arguments", "")
            if isinstance(args_str, dict):
                args_str = json.dumps(args_str, ensure_ascii=False)
            if args_str:
                await _write_chunk(
                    resp,
                    _make_chunk(
                        cid,
                        ct,
                        mdl,
                        {
                            "tool_calls": [
                                {
                                    "index": idx,
                                    "function": {"arguments": args_str},
                                }
                            ]
                        },
                    ),
                )

    finish_reason = "tool_calls" if has_tc else "stop"
    final_usage = usage_d or {
        "prompt_tokens": 0,
        "completion_tokens": completion_tokens,
        "total_tokens": completion_tokens,
    }
    await _write_chunk(
        resp,
        _make_chunk(
            cid,
            ct,
            mdl,
            {},
            finish_reason=finish_reason,
            usage=final_usage,
        ),
    )

    try:
        await resp.write(b"data: [DONE]\n\n")
    except Exception:
        pass

    return resp


# ═══════════════════════════════════════════════════════════════════════════
# ChatCompletions 非流式实现
# ═══════════════════════════════════════════════════════════════════════════


async def _collect_chat(
    body: Dict[str, Any],
    messages: List[Dict[str, Any]],
    registry: Any,
) -> Tuple[
    str,
    List[str],
    List[Dict[str, Any]],
    Optional[Dict[str, Any]],
]:
    """收集非流式聊天补全的全部输出。

    Args:
        body: 请求体字典。
        messages: 已规范化的消息列表。
        registry: provider 注册表。

    Returns:
        (content, thinking_parts, tool_calls, usage_d) 四元组。
    """
    from src.core import gateway

    content_parts: List[str] = []
    thinking_parts: List[str] = []
    tool_calls: List[Dict[str, Any]] = []
    usage_d: Optional[Dict[str, Any]] = None

    async for ch in gateway.dispatch(
        **_build_dispatch_kwargs(body, messages, False, registry)
    ):
        if isinstance(ch, str):
            content_parts.append(ch)
        elif isinstance(ch, dict):
            if "thinking" in ch:
                thinking_parts.append(ch["thinking"])
            elif "tool_calls" in ch:
                tool_calls = ch["tool_calls"]
            elif "usage" in ch:
                usage_d = ch["usage"]

    raw_content = "".join(content_parts)
    cleaned = _clean_fncall(raw_content)

    if tool_calls:
        cleaned = ""
    elif _FNCALL_OPEN_TAG in raw_content:
        tool_calls = _parse_fncall_xml(raw_content)
        if tool_calls:
            cleaned = ""

    return cleaned, thinking_parts, tool_calls, usage_d


# ═══════════════════════════════════════════════════════════════════════════
# 路由处理器
# ═══════════════════════════════════════════════════════════════════════════


async def chat_completions(
    request: aiohttp.web.Request,
) -> aiohttp.web.StreamResponse:
    """聊天补全端点 POST /v1/chat/completions。

    Args:
        request: 请求对象。

    Returns:
        流式或非流式响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON in request body", "invalid_json")

    if isinstance(body.get("messages"), list):
        body["messages"] = _normalize_messages(body["messages"])

    messages: List[Dict[str, Any]] = body.get("messages", [])
    if not messages:
        return _err(
            400,
            "messages is required",
            "missing_field",
            param="messages",
        )

    stream = bool(body.get("stream", False))
    if stream:
        return await _stream_chat(request, body)

    cid = _cid()
    ct = int(time.time())
    mdl = body.get("model", "")

    try:
        content, thinking_parts, tool_calls, usage_d = await _collect_chat(
            body, messages, _require_registry(request)
        )
    except NoCandidateError as exc:
        return _err(503, str(exc), "no_candidate", "service_unavailable")
    except ProviderError as exc:
        return _err(502, str(exc), "provider_error", "upstream_error")
    except Exception as exc:
        logger.error("补全异常: %s", exc, exc_info=True)
        return _err(500, str(exc), "internal_error", "server_error")

    token_count = len(content) // 3 if content else 0
    usage = usage_d or {
        "prompt_tokens": 0,
        "completion_tokens": token_count,
        "total_tokens": token_count,
    }

    msg: Dict[str, Any] = {"role": "assistant"}
    msg["content"] = content if content else None
    if thinking_parts:
        msg["reasoning_content"] = "".join(thinking_parts)
    if tool_calls:
        msg["tool_calls"] = tool_calls

    return _json(
        {
            "id": cid,
            "object": "chat.completion",
            "created": ct,
            "model": mdl,
            "choices": [
                {
                    "index": 0,
                    "message": msg,
                    "finish_reason": "tool_calls" if tool_calls else "stop",
                    "logprobs": None,
                }
            ],
            "usage": usage,
            "system_fingerprint": None,
        }
    )


async def legacy_completions(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """Legacy 文本补全端点 POST /v1/completions。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON in request body", "invalid_json")

    prompt = body.get("prompt", "")
    if not prompt:
        return _err(400, "prompt is required", "missing_field", param="prompt")

    mdl = body.get("model", "")
    chat_body: Dict[str, Any] = {
        "model": mdl,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": body.get("temperature"),
        "top_p": body.get("top_p"),
        "max_tokens": body.get("max_tokens"),
        "stop": body.get("stop"),
        "stream": False,
    }

    cid = _cid()
    ct = int(time.time())

    try:
        content, _, _, usage_d = await _collect_chat(
            chat_body,
            chat_body["messages"],
            request.app["registry"],
        )
    except NoCandidateError as exc:
        return _err(503, str(exc), "no_candidate", "service_unavailable")
    except ProviderError as exc:
        return _err(502, str(exc), "provider_error", "upstream_error")
    except Exception as exc:
        logger.error("legacy 补全异常: %s", exc, exc_info=True)
        return _err(500, str(exc), "internal_error", "server_error")

    token_count = len(content) // 3 if content else 0
    usage = usage_d or {
        "prompt_tokens": 0,
        "completion_tokens": token_count,
        "total_tokens": token_count,
    }

    return _json(
        {
            "id": cid,
            "object": "text_completion",
            "created": ct,
            "model": mdl,
            "choices": [
                {
                    "text": content,
                    "index": 0,
                    "logprobs": None,
                    "finish_reason": "stop",
                }
            ],
            "usage": usage,
        }
    )


async def list_models(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """模型列表端点 GET /v1/models。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    registry = _require_registry(request)
    ct = int(time.time())
    models: List[Dict[str, Any]] = []

    try:
        raw = await registry.all_models()
        for m in raw:
            model_id = m if isinstance(m, str) else m.get("id", "")
            if model_id:
                models.append(
                    {
                        "id": model_id,
                        "object": "model",
                        "created": ct,
                        "owned_by": m.get("owned_by", "provider") if isinstance(m, dict) else "provider",
                    }
                )
    except Exception as exc:
        logger.warning("获取模型列表失败: %s", exc)

    return _json({"object": "list", "data": models})


async def retrieve_model(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """模型详情端点 GET /v1/models/{model_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    model_id = request.match_info["model_id"]
    return _json(
        {
            "id": model_id,
            "object": "model",
            "created": int(time.time()),
            "owned_by": "provider",
        }
    )


# ═══════════════════════════════════════════════════════════════════════════
# Responses API
# ═══════════════════════════════════════════════════════════════════════════


async def _stream_response(
    request: aiohttp.web.Request,
    body: Dict[str, Any],
    messages: List[Dict[str, Any]],
    tools: Optional[List[Dict[str, Any]]],
) -> aiohttp.web.StreamResponse:
    """Responses API 流式实现。

    Args:
        request: 请求对象。
        body: 请求体。
        messages: 已规范化的消息列表。
        tools: 工具列表（仅 function 类型）。

    Returns:
        StreamResponse 实例。
    """
    from src.core import gateway

    resp_id = _resp_id()
    msg_id = _msg_id()
    mdl = body.get("model", "")
    ct = int(time.time())

    resp = aiohttp.web.StreamResponse(
        status=200,
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
    await resp.prepare(request)

    async def _send_event(event: str, data: Dict[str, Any]) -> None:
        """发送单个 SSE 事件。

        Args:
            event: 事件名。
            data: 事件数据。
        """
        payload = "event: {}\ndata: {}\n\n".format(
            event, json.dumps(data, ensure_ascii=False)
        )
        await resp.write(payload.encode("utf-8"))

    base_resp: Dict[str, Any] = {
        "id": resp_id,
        "object": "realtime.response",
        "model": mdl,
        "created_at": ct,
        "status": "in_progress",
        "output": [],
    }
    await _send_event("response.created", {"response": base_resp})

    msg_item: Dict[str, Any] = {
        "id": msg_id,
        "type": "message",
        "role": "assistant",
        "content": [],
        "status": "in_progress",
    }
    await _send_event(
        "response.output_item.added",
        {"response_id": resp_id, "output_index": 0, "item": msg_item},
    )

    await _send_event(
        "response.content_part.added",
        {
            "response_id": resp_id,
            "item_id": msg_id,
            "output_index": 0,
            "content_index": 0,
            "part": {"type": "output_text", "text": ""},
        },
    )

    text_buffer = ""
    fncall_buffer = ""
    in_fncall = False
    has_tc = False
    tool_calls_data: List[Dict[str, Any]] = []
    usage_d: Optional[Dict[str, Any]] = None
    full_text = ""

    chat_body: Dict[str, Any] = dict(body)
    chat_body["tools"] = tools

    try:
        async for ch in gateway.dispatch(
            **_build_dispatch_kwargs(
                chat_body, messages, True, _require_registry(request)
            )
        ):
            if isinstance(ch, str):
                if in_fncall:
                    fncall_buffer += ch
                    continue

                text_buffer += ch
                tag_idx = text_buffer.find(_FNCALL_OPEN_TAG)
                if tag_idx != -1:
                    safe_part = text_buffer[:tag_idx]
                    if safe_part:
                        full_text += safe_part
                        await _send_event(
                            "response.output_text.delta",
                            {
                                "response_id": resp_id,
                                "item_id": msg_id,
                                "output_index": 0,
                                "content_index": 0,
                                "delta": safe_part,
                            },
                        )
                    fncall_buffer = text_buffer[tag_idx:]
                    text_buffer = ""
                    in_fncall = True
                    has_tc = True
                    continue

                safe_part, text_buffer = _safe_flush(text_buffer)
                if safe_part:
                    full_text += safe_part
                    await _send_event(
                        "response.output_text.delta",
                        {
                            "response_id": resp_id,
                            "item_id": msg_id,
                            "output_index": 0,
                            "content_index": 0,
                            "delta": safe_part,
                        },
                    )

            elif isinstance(ch, dict):
                if "tool_calls" in ch:
                    tool_calls_data = ch["tool_calls"]
                    has_tc = True
                elif "usage" in ch:
                    usage_d = ch["usage"]

    except asyncio.CancelledError:
        return resp
    except ConnectionResetError:
        return resp
    except Exception as exc:
        logger.error("Responses API 流式错误: %s", exc, exc_info=True)
        return resp

    if text_buffer and not in_fncall:
        full_text += text_buffer
        await _send_event(
            "response.output_text.delta",
            {
                "response_id": resp_id,
                "item_id": msg_id,
                "output_index": 0,
                "content_index": 0,
                "delta": text_buffer,
            },
        )

    if in_fncall and fncall_buffer and not tool_calls_data:
        tool_calls_data = _parse_fncall_xml(fncall_buffer)
        if tool_calls_data:
            has_tc = True

    await _send_event(
        "response.output_text.done",
        {
            "response_id": resp_id,
            "item_id": msg_id,
            "output_index": 0,
            "content_index": 0,
            "text": full_text,
        },
    )

    await _send_event(
        "response.content_part.done",
        {
            "response_id": resp_id,
            "item_id": msg_id,
            "output_index": 0,
            "content_index": 0,
            "part": {"type": "output_text", "text": full_text},
        },
    )

    output_items: List[Dict[str, Any]] = [
        {
            "id": msg_id,
            "type": "message",
            "role": "assistant",
            "content": [{"type": "output_text", "text": full_text}],
            "status": "completed",
        }
    ]

    if tool_calls_data:
        for tc_idx, tc in enumerate(tool_calls_data):
            tc_item_id = "fc_{}".format(uuid.uuid4().hex[:20])
            args_str = tc.get("function", {}).get("arguments", "")
            if isinstance(args_str, dict):
                args_str = json.dumps(args_str, ensure_ascii=False)
            fc_item: Dict[str, Any] = {
                "id": tc_item_id,
                "type": "function_call",
                "call_id": tc.get("id", "call_{}".format(uuid.uuid4().hex[:24])),
                "name": tc.get("function", {}).get("name", ""),
                "arguments": args_str,
                "status": "completed",
            }
            output_items.append(fc_item)
            await _send_event(
                "response.output_item.added",
                {
                    "response_id": resp_id,
                    "output_index": tc_idx + 1,
                    "item": fc_item,
                },
            )
            await _send_event(
                "response.output_item.done",
                {
                    "response_id": resp_id,
                    "output_index": tc_idx + 1,
                    "item": fc_item,
                },
            )

    await _send_event(
        "response.output_item.done",
        {
            "response_id": resp_id,
            "output_index": 0,
            "item": output_items[0],
        },
    )

    token_count = len(full_text) // 3
    final_usage = usage_d or {
        "input_tokens": 0,
        "output_tokens": token_count,
        "total_tokens": token_count,
    }
    final_resp: Dict[str, Any] = {
        "id": resp_id,
        "object": "realtime.response",
        "model": mdl,
        "created_at": ct,
        "status": "completed",
        "output": output_items,
        "usage": final_usage,
    }
    await _send_event("response.done", {"response": final_resp})

    try:
        await resp.write(b"data: [DONE]\n\n")
    except Exception:
        pass

    return resp


async def create_response(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """Responses API 端点 POST /v1/responses。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    from src.core import gateway

    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    mdl = body.get("model", "")
    input_data = body.get("input", "")

    if isinstance(input_data, str):
        messages: List[Dict[str, Any]] = [{"role": "user", "content": input_data}]
    elif isinstance(input_data, list):
        messages = _normalize_messages(input_data)
    else:
        messages = [{"role": "user", "content": str(input_data)}]

    instructions = body.get("instructions")
    if instructions:
        instructions_str = normalize_content(instructions)
        if instructions_str:
            messages.insert(0, {"role": "system", "content": instructions_str})

    tools_raw = body.get("tools")
    tools: Optional[List[Dict[str, Any]]] = None
    if tools_raw:
        tools = [t for t in tools_raw if t.get("type") == "function"]
        if not tools:
            tools = None

    stream = bool(body.get("stream", False))
    if stream:
        return await _stream_response(request, body, messages, tools)

    resp_id = _resp_id()
    msg_id = _msg_id()
    ct = int(time.time())

    chat_body: Dict[str, Any] = {
        "model": mdl,
        "tools": tools,
        "temperature": body.get("temperature"),
        "top_p": body.get("top_p"),
        "max_tokens": body.get("max_tokens"),
        "stop": body.get("stop"),
        "stream": False,
    }

    try:
        content, thinking_parts, tool_calls, usage_d = await _collect_chat(
            chat_body, messages, _require_registry(request)
        )
    except NoCandidateError as exc:
        return _err(503, str(exc), "no_candidate")
    except ProviderError as exc:
        return _err(502, str(exc), "provider_error")
    except Exception as exc:
        logger.error("Responses API 异常: %s", exc, exc_info=True)
        return _err(500, str(exc), "internal_error", "server_error")

    output_items: List[Dict[str, Any]] = [
        {
            "type": "message",
            "id": msg_id,
            "role": "assistant",
            "content": [{"type": "output_text", "text": content}],
            "status": "completed",
        }
    ]

    if tool_calls:
        for tc in tool_calls:
            args_str = tc.get("function", {}).get("arguments", "")
            if isinstance(args_str, dict):
                args_str = json.dumps(args_str, ensure_ascii=False)
            output_items.append(
                {
                    "id": "fc_{}".format(uuid.uuid4().hex[:20]),
                    "type": "function_call",
                    "call_id": tc.get("id", "call_{}".format(uuid.uuid4().hex[:24])),
                    "name": tc.get("function", {}).get("name", ""),
                    "arguments": args_str,
                    "status": "completed",
                }
            )

    token_count = len(content) // 3
    usage = usage_d or {
        "input_tokens": sum(
            len(str(m.get("content", ""))) // 3 for m in messages
        ),
        "output_tokens": token_count,
        "total_tokens": token_count,
    }

    result: Dict[str, Any] = {
        "id": resp_id,
        "object": "response",
        "created_at": ct,
        "model": mdl,
        "output": output_items,
        "usage": usage,
        "status": "completed",
    }
    if thinking_parts:
        result["reasoning_content"] = "".join(thinking_parts)

    return _json(result)


# ═══════════════════════════════════════════════════════════════════════════
# Embeddings
# ═══════════════════════════════════════════════════════════════════════════


async def create_embeddings(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """嵌入向量端点 POST /v1/embeddings。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("embedding")
    if cand is None:
        return _err(
            501,
            "Embeddings is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        result = await adapter.create_embedding(
            cand,
            body.get("input", ""),
            body.get("model", ""),
            encoding_format=body.get("encoding_format", "float"),
        )
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


# ═══════════════════════════════════════════════════════════════════════════
# Images
# ═══════════════════════════════════════════════════════════════════════════


async def create_image(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """图片生成端点 POST /v1/images/generations。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("image_gen")
    if cand is None:
        return _err(
            501,
            "Image generation is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        result = await adapter.create_image(
            cand,
            body.get("prompt", ""),
            body.get("model", ""),
            **{k: v for k, v in body.items() if k not in ("prompt", "model")},
        )
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


async def edit_image(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """图片编辑端点 POST /v1/images/edits。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("image_edit")
    if cand is None:
        return _err(
            501,
            "Image editing is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        reader = await request.multipart()
        image_data = b""
        prompt = ""
        model = ""
        async for field in reader:
            if field.name == "image":
                image_data = await field.read()
            elif field.name == "prompt":
                prompt = (await field.read()).decode("utf-8")
            elif field.name == "model":
                model = (await field.read()).decode("utf-8")
        result = await adapter.edit_image(cand, image_data, prompt, model)
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


async def create_image_variation(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """图片变体端点 POST /v1/images/variations。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("image_variation")
    if cand is None:
        return _err(
            501,
            "Image variations is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        reader = await request.multipart()
        image_data = b""
        model = ""
        async for field in reader:
            if field.name == "image":
                image_data = await field.read()
            elif field.name == "model":
                model = (await field.read()).decode("utf-8")
        result = await adapter.create_image_variation(cand, image_data, model)
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


# ═══════════════════════════════════════════════════════════════════════════
# Audio
# ═══════════════════════════════════════════════════════════════════════════


async def create_speech(
    request: aiohttp.web.Request,
) -> Union[aiohttp.web.Response, aiohttp.web.StreamResponse]:
    """语音合成端点 POST /v1/audio/speech。

    Args:
        request: 请求对象。

    Returns:
        音频响应或错误响应。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("audio_gen")
    if cand is None:
        return _err(
            501,
            "Text-to-speech is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        audio_bytes = await adapter.create_speech(
            cand,
            body.get("input", ""),
            body.get("model", "tts-1"),
            body.get("voice", "alloy"),
        )
        fmt = body.get("response_format", "mp3")
        mime_map: Dict[str, str] = {
            "mp3": "audio/mpeg",
            "opus": "audio/opus",
            "aac": "audio/aac",
            "flac": "audio/flac",
            "wav": "audio/wav",
            "pcm": "audio/pcm",
        }
        return aiohttp.web.Response(
            body=audio_bytes,
            content_type=mime_map.get(fmt, "audio/mpeg"),
        )
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


async def create_transcription(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """语音转录端点 POST /v1/audio/transcriptions。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("audio_transcription")
    if cand is None:
        return _err(
            501,
            "Audio transcription is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        reader = await request.multipart()
        audio_data = b""
        model = "whisper-1"
        async for field in reader:
            if field.name == "file":
                audio_data = await field.read()
            elif field.name == "model":
                model = (await field.read()).decode("utf-8")
        result = await adapter.create_transcription(cand, audio_data, model)
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


async def create_audio_translation(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """语音翻译端点 POST /v1/audio/translations。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("audio_translation")
    if cand is None:
        return _err(
            501,
            "Audio translation is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        reader = await request.multipart()
        audio_data = b""
        model = "whisper-1"
        async for field in reader:
            if field.name == "file":
                audio_data = await field.read()
            elif field.name == "model":
                model = (await field.read()).decode("utf-8")
        result = await adapter.create_translation(cand, audio_data, model)
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


# ═══════════════════════════════════════════════════════════════════════════
# Video
# ═══════════════════════════════════════════════════════════════════════════


async def create_video(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """视频生成端点 POST /v1/videos/generations。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("video_gen")
    if cand is None:
        return _err(
            501,
            "Video generation is not supported by any available provider.",
            "not_implemented",
            "not_supported",
        )

    adapter = registry.adapter_for(cand)
    try:
        result = await adapter.create_video(
            cand,
            body.get("prompt", ""),
            body.get("model", ""),
            **{k: v for k, v in body.items() if k not in ("prompt", "model")},
        )
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


# ═══════════════════════════════════════════════════════════════════════════
# Moderations
# ═══════════════════════════════════════════════════════════════════════════


async def create_moderation(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """内容审核端点 POST /v1/moderations。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("moderation")
    if cand is None:
        # 无专用审核平台时使用基类默认实现（返回通过结果）
        from src.core.candidate import Candidate, make_id
        from src.platforms.base import PlatformAdapter

        class _FallbackAdapter(PlatformAdapter):
            @property
            def name(self) -> str:
                return "fallback"

            async def init(self, session: Any) -> None:
                return

            async def candidates(self) -> List[Candidate]:
                return []

            async def ensure_candidates(self, count: int) -> int:
                return 0

            async def complete(self, *args: Any, **kwargs: Any) -> Any:
                return
                yield  # type: ignore[misc]

            async def close(self) -> None:
                return

        dummy_cand = Candidate(
            id=make_id("fallback"),
            platform="fallback",
            resource_id="fallback",
            moderation=True,
        )
        result = await _FallbackAdapter().create_moderation(
            dummy_cand,
            body.get("input", ""),
            body.get("model", "text-moderation-latest"),
        )
        return _json(result)

    adapter = registry.adapter_for(cand)
    try:
        result = await adapter.create_moderation(
            cand, body.get("input", ""), body.get("model", "")
        )
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


# ═══════════════════════════════════════════════════════════════════════════
# Rerank
# ═══════════════════════════════════════════════════════════════════════════


async def create_rerank(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """重排序端点 POST /v1/rerank。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_json")

    registry = _require_registry(request)
    cand = await registry.get_capable_candidate("rerank")
    if cand is None:
        # 无专用重排序平台时使用基类默认实现（按原顺序返回）
        from src.core.candidate import Candidate, make_id
        from src.platforms.base import PlatformAdapter

        class _FallbackRerank(PlatformAdapter):
            @property
            def name(self) -> str:
                return "fallback"

            async def init(self, session: Any) -> None:
                return

            async def candidates(self) -> List[Candidate]:
                return []

            async def ensure_candidates(self, count: int) -> int:
                return 0

            async def complete(self, *args: Any, **kwargs: Any) -> Any:
                return
                yield  # type: ignore[misc]

            async def close(self) -> None:
                return

        dummy_cand = Candidate(
            id=make_id("fallback"),
            platform="fallback",
            resource_id="fallback",
            rerank=True,
        )
        result = await _FallbackRerank().create_rerank(
            dummy_cand,
            body.get("query", ""),
            body.get("documents", []),
            body.get("model", ""),
        )
        return _json(result)

    adapter = registry.adapter_for(cand)
    try:
        result = await adapter.create_rerank(
            cand,
            body.get("query", ""),
            body.get("documents", []),
            body.get("model", ""),
        )
        return _json(result)
    except Exception as exc:
        return _err(502, str(exc), "provider_error")


# ═══════════════════════════════════════════════════════════════════════════
# Files
# ═══════════════════════════════════════════════════════════════════════════

# 内存文件存储（生产中应替换为持久化存储）
_files_store: Dict[str, Dict[str, Any]] = {}


async def upload_file(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """文件上传端点 POST /v1/files。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    fid = _fid()
    filename = "unknown"
    purpose = "assistants"
    file_bytes = 0

    content_type = request.content_type or ""
    if "multipart" in content_type:
        try:
            reader = await request.multipart()
            async for field in reader:
                if field.name == "file":
                    data = await field.read()
                    file_bytes = len(data)
                    filename = field.filename or "unknown"
                elif field.name == "purpose":
                    purpose = (await field.read()).decode("utf-8")
        except Exception:
            pass

    record = {
        "id": fid,
        "object": "file",
        "bytes": file_bytes,
        "created_at": int(time.time()),
        "filename": filename,
        "purpose": purpose,
        "status": "uploaded",
    }
    _files_store[fid] = record
    return _json(record)


async def list_files(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """文件列表端点 GET /v1/files。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    purpose = request.rel_url.query.get("purpose")
    data = list(_files_store.values())
    if purpose:
        data = [f for f in data if f.get("purpose") == purpose]
    return _json({"object": "list", "data": data})


async def retrieve_file(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取文件详情端点 GET /v1/files/{file_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    file_id = request.match_info["file_id"]
    record = _files_store.get(file_id)
    if record is None:
        return _err(404, "File not found", "file_not_found")
    return _json(record)


async def delete_file(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """删除文件端点 DELETE /v1/files/{file_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    file_id = request.match_info["file_id"]
    _files_store.pop(file_id, None)
    return _json({"id": file_id, "object": "file", "deleted": True})


async def retrieve_file_content(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取文件内容端点 GET /v1/files/{file_id}/content。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    file_id = request.match_info["file_id"]
    if file_id not in _files_store:
        return _err(404, "File not found", "file_not_found")
    return _err(404, "File content not available", "file_content_unavailable")


# ═══════════════════════════════════════════════════════════════════════════
# Fine-tuning
# ═══════════════════════════════════════════════════════════════════════════

_ft_jobs_store: Dict[str, Dict[str, Any]] = {}


async def create_fine_tuning_job(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建微调任务端点 POST /v1/fine_tuning/jobs。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request) or {}
    job_id = _job_id()
    ct = int(time.time())
    record: Dict[str, Any] = {
        "id": job_id,
        "object": "fine_tuning.job",
        "created_at": ct,
        "finished_at": None,
        "model": body.get("model", ""),
        "fine_tuned_model": None,
        "organization_id": "org-provider",
        "status": "queued",
        "training_file": body.get("training_file", ""),
        "validation_file": body.get("validation_file"),
        "hyperparameters": body.get("hyperparameters", {}),
        "result_files": [],
        "trained_tokens": None,
        "error": None,
    }
    _ft_jobs_store[job_id] = record
    return _json(record)


async def list_fine_tuning_jobs(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """微调任务列表端点 GET /v1/fine_tuning/jobs。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    data = list(_ft_jobs_store.values())
    return _json({"object": "list", "data": data, "has_more": False})


async def retrieve_fine_tuning_job(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取微调任务详情端点 GET /v1/fine_tuning/jobs/{job_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    job_id = request.match_info["job_id"]
    record = _ft_jobs_store.get(job_id)
    if record is None:
        return _err(404, "Job not found", "job_not_found")
    return _json(record)


async def cancel_fine_tuning_job(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """取消微调任务端点 POST /v1/fine_tuning/jobs/{job_id}/cancel。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    job_id = request.match_info["job_id"]
    record = _ft_jobs_store.get(job_id)
    if record is None:
        return _err(404, "Job not found", "job_not_found")
    record["status"] = "cancelled"
    record["finished_at"] = int(time.time())
    return _json(record)


async def list_fine_tuning_events(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """微调任务事件列表端点 GET /v1/fine_tuning/jobs/{job_id}/events。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    job_id = request.match_info["job_id"]
    if job_id not in _ft_jobs_store:
        return _err(404, "Job not found", "job_not_found")
    return _json({"object": "list", "data": [], "has_more": False})


# ═══════════════════════════════════════════════════════════════════════════
# Batch
# ═══════════════════════════════════════════════════════════════════════════

_batches_store: Dict[str, Dict[str, Any]] = {}


async def create_batch(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建批处理任务端点 POST /v1/batches。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request) or {}
    bid = _bid()
    ct = int(time.time())
    record: Dict[str, Any] = {
        "id": bid,
        "object": "batch",
        "endpoint": body.get("endpoint", "/v1/chat/completions"),
        "errors": None,
        "input_file_id": body.get("input_file_id", ""),
        "completion_window": body.get("completion_window", "24h"),
        "status": "validating",
        "output_file_id": None,
        "error_file_id": None,
        "created_at": ct,
        "in_progress_at": None,
        "expires_at": ct + 86400,
        "finalizing_at": None,
        "completed_at": None,
        "failed_at": None,
        "expired_at": None,
        "cancelling_at": None,
        "cancelled_at": None,
        "request_counts": {"total": 0, "completed": 0, "failed": 0},
        "metadata": body.get("metadata", {}),
    }
    _batches_store[bid] = record
    return _json(record)


async def list_batches(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """批处理任务列表端点 GET /v1/batches。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    data = list(_batches_store.values())
    return _json({"object": "list", "data": data, "has_more": False})


async def retrieve_batch(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取批处理任务详情端点 GET /v1/batches/{batch_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    batch_id = request.match_info["batch_id"]
    record = _batches_store.get(batch_id)
    if record is None:
        return _err(404, "Batch not found", "batch_not_found")
    return _json(record)


async def cancel_batch(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """取消批处理任务端点 POST /v1/batches/{batch_id}/cancel。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    batch_id = request.match_info["batch_id"]
    record = _batches_store.get(batch_id)
    if record is None:
        return _err(404, "Batch not found", "batch_not_found")
    record["status"] = "cancelling"
    record["cancelling_at"] = int(time.time())
    return _json(record)


# ═══════════════════════════════════════════════════════════════════════════
# Assistants
# ═══════════════════════════════════════════════════════════════════════════

_assistants_store: Dict[str, Dict[str, Any]] = {}


async def create_assistant(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建助手端点 POST /v1/assistants。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request) or {}
    aid = _aid()
    record = {
        "id": aid,
        "object": "assistant",
        "created_at": int(time.time()),
        "name": body.get("name"),
        "description": body.get("description"),
        "model": body.get("model", ""),
        "instructions": body.get("instructions"),
        "tools": body.get("tools", []),
        "metadata": body.get("metadata", {}),
        "top_p": body.get("top_p", 1.0),
        "temperature": body.get("temperature", 1.0),
        "response_format": body.get("response_format", "auto"),
    }
    _assistants_store[aid] = record
    return _json(record)


async def list_assistants(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """助手列表端点 GET /v1/assistants。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    data = list(_assistants_store.values())
    return _json({"object": "list", "data": data, "has_more": False})


async def retrieve_assistant(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取助手详情端点 GET /v1/assistants/{assistant_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    aid = request.match_info["assistant_id"]
    record = _assistants_store.get(aid)
    if record is None:
        return _err(404, "Assistant not found", "assistant_not_found")
    return _json(record)


async def modify_assistant(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """修改助手端点 POST /v1/assistants/{assistant_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    aid = request.match_info["assistant_id"]
    record = _assistants_store.get(aid)
    if record is None:
        return _err(404, "Assistant not found", "assistant_not_found")
    body = await _get_json(request) or {}
    for k, v in body.items():
        record[k] = v
    return _json(record)


async def delete_assistant(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """删除助手端点 DELETE /v1/assistants/{assistant_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    aid = request.match_info["assistant_id"]
    _assistants_store.pop(aid, None)
    return _json({"id": aid, "object": "assistant.deleted", "deleted": True})


# ═══════════════════════════════════════════════════════════════════════════
# Threads
# ═══════════════════════════════════════════════════════════════════════════

_threads_store: Dict[str, Dict[str, Any]] = {}
_thread_messages_store: Dict[str, List[Dict[str, Any]]] = {}


async def create_thread(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建线程端点 POST /v1/threads。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request) or {}
    tid = _tid()
    record = {
        "id": tid,
        "object": "thread",
        "created_at": int(time.time()),
        "metadata": body.get("metadata", {}),
        "tool_resources": body.get("tool_resources", {}),
    }
    _threads_store[tid] = record
    _thread_messages_store[tid] = []

    # 若创建时携带 messages，写入
    for m in body.get("messages", []):
        _thread_messages_store[tid].append(
            {
                "id": "msg_{}".format(uuid.uuid4().hex[:24]),
                "object": "thread.message",
                "created_at": int(time.time()),
                "thread_id": tid,
                "role": m.get("role", "user"),
                "content": [
                    {
                        "type": "text",
                        "text": {
                            "value": normalize_content(m.get("content", "")),
                            "annotations": [],
                        },
                    }
                ],
                "metadata": m.get("metadata", {}),
            }
        )
    return _json(record)


async def retrieve_thread(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取线程详情端点 GET /v1/threads/{thread_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    record = _threads_store.get(thread_id)
    if record is None:
        return _err(404, "Thread not found", "thread_not_found")
    return _json(record)


async def modify_thread(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """修改线程端点 POST /v1/threads/{thread_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    record = _threads_store.get(thread_id)
    if record is None:
        return _err(404, "Thread not found", "thread_not_found")
    body = await _get_json(request) or {}
    for k, v in body.items():
        record[k] = v
    return _json(record)


async def delete_thread(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """删除线程端点 DELETE /v1/threads/{thread_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    _threads_store.pop(thread_id, None)
    _thread_messages_store.pop(thread_id, None)
    return _json({"id": thread_id, "object": "thread.deleted", "deleted": True})


async def create_thread_message(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建线程消息端点 POST /v1/threads/{thread_id}/messages。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    if thread_id not in _threads_store:
        return _err(404, "Thread not found", "thread_not_found")
    body = await _get_json(request) or {}
    msg_id = "msg_{}".format(uuid.uuid4().hex[:24])
    record = {
        "id": msg_id,
        "object": "thread.message",
        "created_at": int(time.time()),
        "thread_id": thread_id,
        "role": body.get("role", "user"),
        "content": [
            {
                "type": "text",
                "text": {
                    "value": normalize_content(body.get("content", "")),
                    "annotations": [],
                },
            }
        ],
        "metadata": body.get("metadata", {}),
    }
    _thread_messages_store.setdefault(thread_id, []).append(record)
    return _json(record)


async def list_thread_messages(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """线程消息列表端点 GET /v1/threads/{thread_id}/messages。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    if thread_id not in _threads_store:
        return _err(404, "Thread not found", "thread_not_found")
    data = _thread_messages_store.get(thread_id, [])
    return _json({"object": "list", "data": data, "has_more": False})


# ═══════════════════════════════════════════════════════════════════════════
# Runs
# ═══════════════════════════════════════════════════════════════════════════

_runs_store: Dict[str, Dict[str, Any]] = {}


async def create_run(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建运行端点 POST /v1/threads/{thread_id}/runs。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    if thread_id not in _threads_store:
        return _err(404, "Thread not found", "thread_not_found")
    body = await _get_json(request) or {}
    run_id = _rid()
    ct = int(time.time())
    record: Dict[str, Any] = {
        "id": run_id,
        "object": "thread.run",
        "created_at": ct,
        "thread_id": thread_id,
        "assistant_id": body.get("assistant_id", ""),
        "status": "queued",
        "model": body.get("model", ""),
        "instructions": body.get("instructions"),
        "tools": body.get("tools", []),
        "metadata": body.get("metadata", {}),
        "started_at": None,
        "expires_at": ct + 600,
        "cancelled_at": None,
        "failed_at": None,
        "completed_at": None,
        "last_error": None,
        "usage": None,
    }
    _runs_store[run_id] = record
    return _json(record)


async def list_runs(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """运行列表端点 GET /v1/threads/{thread_id}/runs。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    thread_id = request.match_info["thread_id"]
    data = [r for r in _runs_store.values() if r.get("thread_id") == thread_id]
    return _json({"object": "list", "data": data, "has_more": False})


async def retrieve_run(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取运行详情端点 GET /v1/threads/{thread_id}/runs/{run_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    run_id = request.match_info["run_id"]
    record = _runs_store.get(run_id)
    if record is None:
        return _err(404, "Run not found", "run_not_found")
    return _json(record)


async def cancel_run(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """取消运行端点 POST /v1/threads/{thread_id}/runs/{run_id}/cancel。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    run_id = request.match_info["run_id"]
    record = _runs_store.get(run_id)
    if record is None:
        return _err(404, "Run not found", "run_not_found")
    record["status"] = "cancelled"
    record["cancelled_at"] = int(time.time())
    return _json(record)


async def submit_tool_outputs(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """提交工具输出端点 POST /v1/threads/{thread_id}/runs/{run_id}/submit_tool_outputs。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    run_id = request.match_info["run_id"]
    record = _runs_store.get(run_id)
    if record is None:
        return _err(404, "Run not found", "run_not_found")
    record["status"] = "completed"
    record["completed_at"] = int(time.time())
    return _json(record)


# ═══════════════════════════════════════════════════════════════════════════
# Vector Stores
# ═══════════════════════════════════════════════════════════════════════════

_vector_stores_store: Dict[str, Dict[str, Any]] = {}
_vector_store_files_store: Dict[str, List[Dict[str, Any]]] = {}


async def create_vector_store(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建向量存储端点 POST /v1/vector_stores。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request) or {}
    vid = _vid()
    record = {
        "id": vid,
        "object": "vector_store",
        "created_at": int(time.time()),
        "name": body.get("name", ""),
        "usage_bytes": 0,
        "file_counts": {
            "in_progress": 0,
            "completed": 0,
            "failed": 0,
            "cancelled": 0,
            "total": 0,
        },
        "status": "completed",
        "expires_after": body.get("expires_after"),
        "expires_at": None,
        "last_active_at": int(time.time()),
        "metadata": body.get("metadata", {}),
    }
    _vector_stores_store[vid] = record
    _vector_store_files_store[vid] = []
    return _json(record)


async def list_vector_stores(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """向量存储列表端点 GET /v1/vector_stores。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    data = list(_vector_stores_store.values())
    return _json({"object": "list", "data": data, "has_more": False})


async def retrieve_vector_store(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """获取向量存储详情端点 GET /v1/vector_stores/{store_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    store_id = request.match_info["store_id"]
    record = _vector_stores_store.get(store_id)
    if record is None:
        return _err(404, "Vector store not found", "not_found")
    return _json(record)


async def delete_vector_store(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """删除向量存储端点 DELETE /v1/vector_stores/{store_id}。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    store_id = request.match_info["store_id"]
    _vector_stores_store.pop(store_id, None)
    _vector_store_files_store.pop(store_id, None)
    return _json({"id": store_id, "object": "vector_store.deleted", "deleted": True})


async def create_vector_store_file(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """向量存储文件关联端点 POST /v1/vector_stores/{store_id}/files。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    store_id = request.match_info["store_id"]
    if store_id not in _vector_stores_store:
        return _err(404, "Vector store not found", "not_found")
    body = await _get_json(request) or {}
    fid = _fid()
    record = {
        "id": fid,
        "object": "vector_store.file",
        "created_at": int(time.time()),
        "vector_store_id": store_id,
        "status": "completed",
        "usage_bytes": 0,
        "chunking_strategy": body.get("chunking_strategy", {}),
    }
    _vector_store_files_store.setdefault(store_id, []).append(record)
    vs = _vector_stores_store[store_id]
    vs["file_counts"]["completed"] += 1
    vs["file_counts"]["total"] += 1
    return _json(record)


async def list_vector_store_files(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """向量存储文件列表端点 GET /v1/vector_stores/{store_id}/files。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    store_id = request.match_info["store_id"]
    if store_id not in _vector_stores_store:
        return _err(404, "Vector store not found", "not_found")
    data = _vector_store_files_store.get(store_id, [])
    return _json({"object": "list", "data": data, "has_more": False})


# ═══════════════════════════════════════════════════════════════════════════
# Uploads
# ═══════════════════════════════════════════════════════════════════════════

_uploads_store: Dict[str, Dict[str, Any]] = {}
_upload_parts_store: Dict[str, List[Dict[str, Any]]] = {}


async def create_upload(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """创建上传端点 POST /v1/uploads。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request) or {}
    uid = _uid()
    ct = int(time.time())
    record = {
        "id": uid,
        "object": "upload",
        "bytes": body.get("bytes", 0),
        "created_at": ct,
        "filename": body.get("filename", ""),
        "purpose": body.get("purpose", ""),
        "status": "pending",
        "expires_at": ct + 3600,
    }
    _uploads_store[uid] = record
    _upload_parts_store[uid] = []
    return _json(record)


async def add_upload_part(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """添加上传分片端点 POST /v1/uploads/{upload_id}/parts。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    upload_id = request.match_info["upload_id"]
    if upload_id not in _uploads_store:
        return _err(404, "Upload not found", "upload_not_found")
    part_id = _part_id()
    record = {
        "id": part_id,
        "object": "upload.part",
        "created_at": int(time.time()),
        "upload_id": upload_id,
    }
    _upload_parts_store.setdefault(upload_id, []).append(record)
    return _json(record)


async def complete_upload(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """完成上传端点 POST /v1/uploads/{upload_id}/complete。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    upload_id = request.match_info["upload_id"]
    record = _uploads_store.get(upload_id)
    if record is None:
        return _err(404, "Upload not found", "upload_not_found")
    fid = _fid()
    record["status"] = "completed"
    file_record = {
        "id": fid,
        "object": "file",
        "bytes": record.get("bytes", 0),
        "created_at": int(time.time()),
        "filename": record.get("filename", ""),
        "purpose": record.get("purpose", ""),
        "status": "uploaded",
    }
    _files_store[fid] = file_record
    return _json(
        {
            "id": upload_id,
            "object": "upload",
            "status": "completed",
            "file": file_record,
        }
    )


async def cancel_upload(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """取消上传端点 POST /v1/uploads/{upload_id}/cancel。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    upload_id = request.match_info["upload_id"]
    record = _uploads_store.get(upload_id)
    if record is None:
        return _err(404, "Upload not found", "upload_not_found")
    record["status"] = "cancelled"
    return _json({"id": upload_id, "object": "upload", "status": "cancelled"})


# ═══════════════════════════════════════════════════════════════════════════
# 路由注册
# ═══════════════════════════════════════════════════════════════════════════


def setup_routes(app: aiohttp.web.Application) -> None:
    """注册所有 OpenAI 兼容路由。

    Args:
        app: aiohttp.web.Application 实例。
    """
    # Models
    app.router.add_get("/v1/models", list_models)
    app.router.add_get("/v1/models/{model_id}", retrieve_model)

    # Chat
    app.router.add_post("/v1/chat/completions", chat_completions)

    # Legacy completions
    app.router.add_post("/v1/completions", legacy_completions)

    # Responses API
    app.router.add_post("/v1/responses", create_response)

    # Embeddings
    app.router.add_post("/v1/embeddings", create_embeddings)

    # Images
    app.router.add_post("/v1/images/generations", create_image)
    app.router.add_post("/v1/images/edits", edit_image)
    app.router.add_post("/v1/images/variations", create_image_variation)

    # Audio
    app.router.add_post("/v1/audio/speech", create_speech)
    app.router.add_post("/v1/audio/transcriptions", create_transcription)
    app.router.add_post("/v1/audio/translations", create_audio_translation)

    # Video
    app.router.add_post("/v1/videos/generations", create_video)

    # Moderations
    app.router.add_post("/v1/moderations", create_moderation)

    # Rerank
    app.router.add_post("/v1/rerank", create_rerank)

    # Files
    app.router.add_post("/v1/files", upload_file)
    app.router.add_get("/v1/files", list_files)
    app.router.add_get("/v1/files/{file_id}", retrieve_file)
    app.router.add_delete("/v1/files/{file_id}", delete_file)
    app.router.add_get("/v1/files/{file_id}/content", retrieve_file_content)

    # Fine-tuning
    app.router.add_post("/v1/fine_tuning/jobs", create_fine_tuning_job)
    app.router.add_get("/v1/fine_tuning/jobs", list_fine_tuning_jobs)
    app.router.add_get("/v1/fine_tuning/jobs/{job_id}", retrieve_fine_tuning_job)
    app.router.add_post("/v1/fine_tuning/jobs/{job_id}/cancel", cancel_fine_tuning_job)
    app.router.add_get("/v1/fine_tuning/jobs/{job_id}/events", list_fine_tuning_events)

    # Batch
    app.router.add_post("/v1/batches", create_batch)
    app.router.add_get("/v1/batches", list_batches)
    app.router.add_get("/v1/batches/{batch_id}", retrieve_batch)
    app.router.add_post("/v1/batches/{batch_id}/cancel", cancel_batch)

    # Assistants
    app.router.add_post("/v1/assistants", create_assistant)
    app.router.add_get("/v1/assistants", list_assistants)
    app.router.add_get("/v1/assistants/{assistant_id}", retrieve_assistant)
    app.router.add_post("/v1/assistants/{assistant_id}", modify_assistant)
    app.router.add_delete("/v1/assistants/{assistant_id}", delete_assistant)

    # Threads
    app.router.add_post("/v1/threads", create_thread)
    app.router.add_get("/v1/threads/{thread_id}", retrieve_thread)
    app.router.add_post("/v1/threads/{thread_id}", modify_thread)
    app.router.add_delete("/v1/threads/{thread_id}", delete_thread)
    app.router.add_post("/v1/threads/{thread_id}/messages", create_thread_message)
    app.router.add_get("/v1/threads/{thread_id}/messages", list_thread_messages)

    # Runs
    app.router.add_post("/v1/threads/{thread_id}/runs", create_run)
    app.router.add_get("/v1/threads/{thread_id}/runs", list_runs)
    app.router.add_get("/v1/threads/{thread_id}/runs/{run_id}", retrieve_run)
    app.router.add_post("/v1/threads/{thread_id}/runs/{run_id}/cancel", cancel_run)
    app.router.add_post(
        "/v1/threads/{thread_id}/runs/{run_id}/submit_tool_outputs",
        submit_tool_outputs,
    )

    # Vector Stores
    app.router.add_post("/v1/vector_stores", create_vector_store)
    app.router.add_get("/v1/vector_stores", list_vector_stores)
    app.router.add_get("/v1/vector_stores/{store_id}", retrieve_vector_store)
    app.router.add_delete("/v1/vector_stores/{store_id}", delete_vector_store)
    app.router.add_post("/v1/vector_stores/{store_id}/files", create_vector_store_file)
    app.router.add_get("/v1/vector_stores/{store_id}/files", list_vector_store_files)

    # Uploads
    app.router.add_post("/v1/uploads", create_upload)
    app.router.add_post("/v1/uploads/{upload_id}/parts", add_upload_part)
    app.router.add_post("/v1/uploads/{upload_id}/complete", complete_upload)
    app.router.add_post("/v1/uploads/{upload_id}/cancel", cancel_upload)
