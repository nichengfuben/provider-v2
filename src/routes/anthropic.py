# -*- coding: utf-8 -*-
"""Anthropic 兼容路由——aiohttp.web 实现。"""

from __future__ import annotations

import asyncio
import json
import logging
import re
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple, Union

import aiohttp.web

from src.core.errors import NoCandidateError, ProviderError
from src.core.server import REGISTRY_KEY
from src.core.tools import normalize_content

__all__ = ["setup_routes"]
logger = logging.getLogger(__name__)

_FNCALL_OPEN_TAG = "<function_calls>"
_FNCALL_CLOSE_TAG = "</function_calls>"


# ═══════════════════════════════════════════════════════════════════════════
# ID 生成工具
# ═══════════════════════════════════════════════════════════════════════════


def _mid() -> str:
    """生成 Anthropic message ID。

    Returns:
        ID 字符串，格式为 msg_xxx。
    """
    return "msg_{}".format(uuid.uuid4().hex[:24])


def _tc_id() -> str:
    """生成 Anthropic tool_use block ID。

    Returns:
        ID 字符串，格式为 toolu_xxx。
    """
    return "toolu_{}".format(uuid.uuid4().hex[:24])


def _call_id() -> str:
    """生成 OpenAI tool_call ID（内部流转用）。

    Returns:
        ID 字符串，格式为 call_xxx。
    """
    return "call_{}".format(uuid.uuid4().hex[:24])


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
    error_type: str = "server_error",
) -> aiohttp.web.Response:
    """构建 Anthropic 格式错误响应。

    Args:
        status: HTTP 状态码。
        message: 错误信息。
        error_type: Anthropic 错误类型字符串。

    Returns:
        Response 实例。
    """
    return _json(
        {
            "type": "error",
            "error": {"type": error_type, "message": message},
        },
        status=status,
    )


# ═══════════════════════════════════════════════════════════════════════════
# 内容规范化工具
# ═══════════════════════════════════════════════════════════════════════════


def _normalize_anth_content(content: Any) -> Optional[str]:
    """规范化 Anthropic system/content 字段为字符串。

    Args:
        content: 原始 content 字段值。

    Returns:
        规范化字符串，内容为空时返回 None。
    """
    if content is None:
        return None
    if isinstance(content, str):
        return content or None
    if isinstance(content, list):
        texts: List[str] = []
        for item in content:
            if isinstance(item, dict):
                item_type = item.get("type", "")
                if item_type == "text":
                    text = item.get("text", "")
                    if text:
                        texts.append(text)
                elif "text" in item:
                    text = item.get("text", "")
                    if text:
                        texts.append(text)
            elif isinstance(item, str) and item:
                texts.append(item)
        return "\n".join(texts) if texts else None
    result = str(content)
    return result if result else None


def _extract_image_source(image_block: Dict[str, Any]) -> str:
    """从 Anthropic image block 提取可读描述。

    Args:
        image_block: Anthropic image content block。

    Returns:
        图片描述字符串。
    """
    source = image_block.get("source", {})
    source_type = source.get("type", "")
    if source_type == "url":
        return "[image: {}]".format(source.get("url", "unknown"))
    if source_type == "base64":
        media_type = source.get("media_type", "image")
        return "[image: base64 {} data]".format(media_type)
    return "[image]"


def _content_block_to_text(block: Dict[str, Any]) -> str:
    """将单个 Anthropic content block 转换为纯文本描述（降级用）。

    Args:
        block: Anthropic content block 字典。

    Returns:
        文本描述字符串。
    """
    btype = block.get("type", "")
    if btype == "text":
        return block.get("text", "")
    if btype == "image":
        return _extract_image_source(block)
    if btype == "thinking":
        return ""
    if btype == "tool_use":
        inp = block.get("input", {})
        inp_str = (
            json.dumps(inp, ensure_ascii=False)
            if isinstance(inp, dict)
            else str(inp)
        )
        return "Tool call ({}): {}({})".format(
            block.get("id", ""), block.get("name", ""), inp_str
        )
    if btype == "tool_result":
        tool_content = block.get("content", block.get("text", ""))
        return "Tool result ({}):\n{}".format(
            block.get("tool_use_id", ""),
            normalize_content(tool_content) if tool_content else "",
        )
    return block.get("text", str(block))


def _image_block_to_openai(block: Dict[str, Any]) -> Dict[str, Any]:
    """将 Anthropic image block 转换为 OpenAI image_url content block。

    Args:
        block: Anthropic image content block。

    Returns:
        OpenAI image_url content block 字典。
    """
    source = block.get("source", {})
    source_type = source.get("type", "")
    if source_type == "url":
        url = source.get("url", "")
    elif source_type == "base64":
        media_type = source.get("media_type", "image/jpeg")
        data = source.get("data", "")
        url = "data:{};base64,{}".format(media_type, data)
    else:
        url = ""
    return {"type": "image_url", "image_url": {"url": url}}


def _tool_result_content_to_str(tool_content: Any) -> str:
    """将 tool_result 的 content 字段规范化为字符串。

    Args:
        tool_content: tool_result 的 content 字段。

    Returns:
        规范化字符串。
    """
    if isinstance(tool_content, str):
        return tool_content
    if isinstance(tool_content, list):
        parts: List[str] = []
        for item in tool_content:
            if isinstance(item, dict) and item.get("type") == "text":
                parts.append(item.get("text", ""))
            elif isinstance(item, str):
                parts.append(item)
        return "\n".join(filter(None, parts))
    return normalize_content(tool_content) if tool_content is not None else ""


# ═══════════════════════════════════════════════════════════════════════════
# 消息格式转换
# ═══════════════════════════════════════════════════════════════════════════


def _get_registry(request: aiohttp.web.Request) -> Any:
    return request.app.get(REGISTRY_KEY) or request.app.get("registry")


def _require_registry(request: aiohttp.web.Request) -> Any:
    reg = _get_registry(request)
    if reg is None:
        raise RuntimeError("registry is not initialized")
    return reg


_THINK_PATTERNS = [
    re.compile(r"<think>([\s\S]*?)</think>", re.IGNORECASE),
    re.compile(r"<thinking>([\s\S]*?)</thinking>", re.IGNORECASE),
]


def _split_thinking(text: str) -> Tuple[str, List[str]]:
    thoughts: List[str] = []
    cleaned = text
    for pat in _THINK_PATTERNS:
        while True:
            m = pat.search(cleaned)
            if not m:
                break
            thoughts.append(m.group(1))
            cleaned = cleaned[: m.start()] + cleaned[m.end() :]
    return cleaned, thoughts


def _anth_messages_to_openai(
    messages: List[Dict[str, Any]],
    system: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """将 Anthropic 格式 messages 转换为 OpenAI 格式。

    Args:
        messages: Anthropic 格式消息列表。
        system: system prompt 字符串，不为 None 时前置插入。

    Returns:
        OpenAI 格式消息列表。
    """
    out: List[Dict[str, Any]] = []
    if system:
        out.append({"role": "system", "content": system})

    for m in messages:
        role = m.get("role", "user")
        content = m.get("content", "")

        if isinstance(content, str):
            out.append({"role": role, "content": content})
            continue

        if not isinstance(content, list):
            out.append({"role": role, "content": str(content)})
            continue

        if role == "assistant":
            _convert_assistant_message(content, out)
            continue

        if role == "user":
            _convert_user_message(content, out)
            continue

        out.append({"role": role, "content": _blocks_to_text(content)})

    return out


def _convert_assistant_message(
    content: List[Any],
    out: List[Dict[str, Any]],
) -> None:
    """转换 assistant 消息，正确处理 tool_use blocks。

    Args:
        content: Anthropic assistant message content list。
        out: 输出消息列表，原地追加。
    """
    text_parts: List[str] = []
    tool_calls: List[Dict[str, Any]] = []
    image_blocks: List[Dict[str, Any]] = []
    has_image = False

    for block in content:
        if not isinstance(block, dict):
            if isinstance(block, str):
                text_parts.append(block)
            continue

        btype = block.get("type", "")

        if btype == "text":
            text = block.get("text", "")
            if text:
                text_parts.append(text)

        elif btype == "tool_use":
            inp = block.get("input", {})
            args_str = (
                json.dumps(inp, ensure_ascii=False)
                if isinstance(inp, dict)
                else str(inp)
            )
            tool_calls.append(
                {
                    "id": block.get("id") or _call_id(),
                    "type": "function",
                    "function": {
                        "name": block.get("name", ""),
                        "arguments": args_str,
                    },
                }
            )

        elif btype == "image":
            has_image = True
            image_blocks.append(block)

        elif btype == "thinking":
            pass  # thinking block 不透传

    if has_image:
        content_field: Any = []
        for text in text_parts:
            content_field.append({"type": "text", "text": text})
        for img in image_blocks:
            content_field.append(_image_block_to_openai(img))
    else:
        joined = "\n".join(filter(None, text_parts))
        content_field = joined if joined else None

    msg: Dict[str, Any] = {"role": "assistant", "content": content_field}
    if tool_calls:
        msg["tool_calls"] = tool_calls

    out.append(msg)


def _convert_user_message(
    content: List[Any],
    out: List[Dict[str, Any]],
) -> None:
    """转换 user 消息，正确处理 tool_result blocks。

    Args:
        content: Anthropic user message content list。
        out: 输出消息列表，原地追加。
    """
    tool_results: List[Dict[str, Any]] = []
    other_blocks: List[Dict[str, Any]] = []
    has_image = False

    for block in content:
        if not isinstance(block, dict):
            if isinstance(block, str) and block:
                other_blocks.append({"type": "text", "text": block})
            continue

        btype = block.get("type", "")
        if btype == "tool_result":
            tool_results.append(block)
        elif btype == "image":
            has_image = True
            other_blocks.append(block)
        elif btype == "thinking":
            pass
        else:
            other_blocks.append(block)

    for tr in tool_results:
        tool_use_id = tr.get("tool_use_id", _call_id())
        result_content = _tool_result_content_to_str(
            tr.get("content", tr.get("text", ""))
        )
        is_error = bool(tr.get("is_error", False))
        if is_error:
            result_content = "[ERROR] {}".format(result_content)

        out.append(
            {
                "role": "tool",
                "tool_call_id": tool_use_id,
                "content": result_content,
            }
        )

    if other_blocks:
        if has_image:
            parts: List[Dict[str, Any]] = []
            for block in other_blocks:
                if not isinstance(block, dict):
                    continue
                btype = block.get("type", "")
                if btype == "text":
                    text = block.get("text", "")
                    if text:
                        parts.append({"type": "text", "text": text})
                elif btype == "image":
                    parts.append(_image_block_to_openai(block))
                else:
                    text = _content_block_to_text(block)
                    if text:
                        parts.append({"type": "text", "text": text})
            if parts:
                out.append({"role": "user", "content": parts})
        else:
            text_parts: List[str] = []
            for block in other_blocks:
                if isinstance(block, dict):
                    text = _content_block_to_text(block)
                    if text:
                        text_parts.append(text)
                elif isinstance(block, str):
                    text_parts.append(block)
            joined = "\n".join(filter(None, text_parts))
            if joined:
                out.append({"role": "user", "content": joined})


def _blocks_to_text(blocks: List[Any]) -> str:
    """将 content block 列表降级为纯文本字符串（保底用）。

    Args:
        blocks: content block 列表。

    Returns:
        拼接后的文本字符串。
    """
    parts: List[str] = []
    for block in blocks:
        if isinstance(block, dict):
            text = _content_block_to_text(block)
            if text:
                parts.append(text)
        elif isinstance(block, str) and block:
            parts.append(block)
    return "\n".join(parts)


def _anth_tools_to_openai(
    tools: Optional[List[Dict[str, Any]]],
) -> Optional[List[Dict[str, Any]]]:
    """将 Anthropic 格式工具转换为 OpenAI 格式。

    Args:
        tools: Anthropic 工具列表。

    Returns:
        OpenAI 格式工具列表，输入为空时返回 None。
    """
    if not tools:
        return None
    result: List[Dict[str, Any]] = []
    for t in tools:
        schema = dict(t.get("input_schema") or {})
        if "type" not in schema:
            schema["type"] = "object"
        if "properties" not in schema:
            schema["properties"] = {}
        result.append(
            {
                "type": "function",
                "function": {
                    "name": t.get("name", ""),
                    "description": t.get("description", ""),
                    "parameters": schema,
                },
            }
        )
    return result or None


def _anth_tool_choice_to_openai(tool_choice: Any) -> Optional[Any]:
    """将 Anthropic tool_choice 转换为 OpenAI tool_choice 格式。

    Args:
        tool_choice: Anthropic tool_choice 字段值。

    Returns:
        OpenAI 格式 tool_choice，无法转换时返回 None。
    """
    if tool_choice is None:
        return None
    if isinstance(tool_choice, str):
        mapping = {"auto": "auto", "any": "required", "none": "none"}
        return mapping.get(tool_choice, tool_choice)
    if isinstance(tool_choice, dict):
        tc_type = tool_choice.get("type", "")
        if tc_type == "auto":
            return "auto"
        if tc_type == "any":
            return "required"
        if tc_type == "none":
            return "none"
        if tc_type == "tool":
            name = tool_choice.get("name", "")
            return {"type": "function", "function": {"name": name}}
    return None


def _is_thinking(body: Dict[str, Any]) -> bool:
    """判断请求是否开启 thinking 模式。

    Args:
        body: 请求体字典。

    Returns:
        是否开启 thinking。
    """
    t = body.get("thinking")
    if t is None:
        return False
    if isinstance(t, bool):
        return t
    if isinstance(t, dict):
        return t.get("type") == "enabled" or bool(t.get("enabled", False))
    return bool(t)


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


# ═══════════════════════════════════════════════════════════════════════════
# fncall 处理工具
# ═══════════════════════════════════════════════════════════════════════════


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
    close_tag = "</function>"
    content = re.sub(
        r"<function=[^>]*>.*?" + re.escape(close_tag),
        "",
        content,
        flags=re.DOTALL,
    )
    return content.strip()


def _safe_flush(buffer: str) -> Tuple[str, str]:
    """从缓冲区提取可安全输出的部分，保留可能是 fncall 前缀的尾部。

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


def _parse_fncall_xml(xml: str) -> List[Dict[str, Any]]:
    """将 fncall XML 解析为 OpenAI tool_calls 格式列表。

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
                    "id": _call_id(),
                    "type": "function",
                    "function": {
                        "name": func_name,
                        "arguments": json.dumps(arguments, ensure_ascii=False),
                    },
                }
            )
    except Exception as exc:
        logger.warning("fncall XML 解析失败: %s", exc)
    return tool_calls


def _openai_tc_to_anth(tc: Dict[str, Any]) -> Dict[str, Any]:
    """将 OpenAI tool_call 转换为 Anthropic tool_use content block。

    Args:
        tc: OpenAI tool_call 字典。

    Returns:
        Anthropic tool_use block 字典。
    """
    func = tc.get("function", {})
    args_raw = func.get("arguments", {})
    if isinstance(args_raw, dict):
        inp = args_raw
    else:
        try:
            inp = json.loads(args_raw)
        except (json.JSONDecodeError, ValueError):
            inp = {}

    raw_id = tc.get("id", "")
    anth_id = (
        raw_id
        if raw_id.startswith("toolu_")
        else _tc_id()
    )

    return {
        "type": "tool_use",
        "id": anth_id,
        "name": func.get("name", ""),
        "input": inp,
    }


def _tc_args_to_str(tc: Dict[str, Any]) -> str:
    """提取 tool_call 的 arguments 并确保为 JSON 字符串。

    Args:
        tc: OpenAI tool_call 字典。

    Returns:
        arguments JSON 字符串。
    """
    args_raw = tc.get("function", {}).get("arguments", {})
    if isinstance(args_raw, dict):
        return json.dumps(args_raw, ensure_ascii=False)
    return str(args_raw)


def _build_dispatch_kwargs(
    body: Dict[str, Any],
    messages: List[Dict[str, Any]],
    stream: bool,
    registry: Any,
    tools: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """构建 gateway.dispatch 调用参数。

    Args:
        body: Anthropic 请求体字典。
        messages: 已转换的 OpenAI 格式消息列表。
        stream: 是否流式。
        registry: provider 注册表。
        tools: 已转换的 OpenAI 格式工具列表。

    Returns:
        dispatch 关键字参数字典。
    """
    stop = body.get("stop_sequences")
    if isinstance(stop, list):
        stop_val: Optional[List[str]] = stop
    elif stop is not None:
        stop_val = [str(stop)]
    else:
        stop_val = None

    tool_choice = _anth_tool_choice_to_openai(body.get("tool_choice"))

    kwargs: Dict[str, Any] = {
        "registry": registry,
        "messages": messages,
        "model": body.get("model", ""),
        "stream": stream,
        "tools": tools,
        "thinking": _is_thinking(body),
        "search": bool(body.get("search", False)),
        "temperature": body.get("temperature"),
        "top_p": body.get("top_p"),
        "max_tokens": body.get("max_tokens", 4096),
        "stop": stop_val,
    }
    if tool_choice is not None:
        kwargs["tool_choice"] = tool_choice

    return kwargs


# ═══════════════════════════════════════════════════════════════════════════
# 流式写入工具
# ═══════════════════════════════════════════════════════════════════════════


async def _write_event(
    resp: aiohttp.web.StreamResponse,
    event: str,
    data: Dict[str, Any],
) -> None:
    """向流式响应写入一个 Anthropic SSE 事件。

    Args:
        resp: 流式响应对象。
        event: 事件名称。
        data: 事件数据字典。
    """
    line = "event: {}\ndata: {}\n\n".format(
        event, json.dumps(data, ensure_ascii=False)
    )
    try:
        await resp.write(line.encode("utf-8"))
    except Exception:
        pass


# ═══════════════════════════════════════════════════════════════════════════
# 流式消息生成
# ═══════════════════════════════════════════════════════════════════════════


async def _stream_messages(
    request: aiohttp.web.Request,
    body: Dict[str, Any],
    msgs: List[Dict[str, Any]],
    tools: Optional[List[Dict[str, Any]]],
    thinking: bool,
) -> aiohttp.web.StreamResponse:
    """Anthropic 流式消息生成核心实现。

    Args:
        request: 请求对象。
        body: 已解析的请求体。
        msgs: 已转换的 OpenAI 格式消息列表。
        tools: 已转换的 OpenAI 格式工具列表。
        thinking: 是否开启 thinking 模式。

    Returns:
        StreamResponse 实例。
    """
    from src.core import gateway

    mid = _mid()
    mdl = body.get("model", "")
    pt = sum(len(str(m.get("content", ""))) // 3 for m in msgs)

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

    await _write_event(
        resp,
        "message_start",
        {
            "type": "message_start",
            "message": {
                "id": mid,
                "type": "message",
                "role": "assistant",
                "content": [],
                "model": mdl,
                "stop_reason": None,
                "stop_sequence": None,
                "usage": {"input_tokens": pt, "output_tokens": 0},
            },
        },
    )

    await _write_event(resp, "ping", {"type": "ping"})

    thinking_started = thinking
    thinking_block_idx = 0 if thinking else -1
    text_block_idx = 1 if thinking else 0
    next_idx = text_block_idx + 1

    if thinking_started:
        await _write_event(
            resp,
            "content_block_start",
            {
                "type": "content_block_start",
                "index": thinking_block_idx,
                "content_block": {"type": "thinking", "thinking": ""},
            },
        )

    await _write_event(
        resp,
        "content_block_start",
        {
            "type": "content_block_start",
            "index": text_block_idx,
            "content_block": {"type": "text", "text": ""},
        },
    )

    text_buffer = ""
    fncall_buffer = ""
    in_fncall = False
    tool_calls_data: List[Dict[str, Any]] = []
    usage_d: Optional[Dict[str, Any]] = None
    output_tokens = 0

    try:
        async for ch in gateway.dispatch(
            **_build_dispatch_kwargs(
                body, msgs, True, _require_registry(request), tools
            )
        ):
            if isinstance(ch, str):
                output_tokens += 1

                if in_fncall:
                    fncall_buffer += ch
                    continue

                text_buffer += ch

                tag_idx = text_buffer.find(_FNCALL_OPEN_TAG)
                if tag_idx != -1:
                    safe_part = text_buffer[:tag_idx]
                    if safe_part:
                        clean_text, thoughts = _split_thinking(safe_part)
                        for t in thoughts:
                            if not thinking_started:
                                thinking_block_idx = next_idx
                                next_idx += 1
                                thinking_started = True
                                await _write_event(
                                    resp,
                                    "content_block_start",
                                    {
                                        "type": "content_block_start",
                                        "index": thinking_block_idx,
                                        "content_block": {
                                            "type": "thinking",
                                            "thinking": "",
                                        },
                                    },
                                )
                            await _write_event(
                                resp,
                                "content_block_delta",
                                {
                                    "type": "content_block_delta",
                                    "index": thinking_block_idx,
                                    "delta": {
                                        "type": "thinking_delta",
                                        "thinking": t,
                                    },
                                },
                            )
                        if clean_text:
                            await _write_event(
                                resp,
                                "content_block_delta",
                                {
                                    "type": "content_block_delta",
                                    "index": text_block_idx,
                                    "delta": {
                                        "type": "text_delta",
                                        "text": clean_text,
                                    },
                                },
                            )
                    fncall_buffer = text_buffer[tag_idx:]
                    text_buffer = ""
                    in_fncall = True
                    continue

                safe_part, text_buffer = _safe_flush(text_buffer)
                if safe_part:
                    clean_text, thoughts = _split_thinking(safe_part)
                    for t in thoughts:
                        if not thinking_started:
                            thinking_block_idx = next_idx
                            next_idx += 1
                            thinking_started = True
                            await _write_event(
                                resp,
                                "content_block_start",
                                {
                                    "type": "content_block_start",
                                    "index": thinking_block_idx,
                                    "content_block": {
                                        "type": "thinking",
                                        "thinking": "",
                                    },
                                },
                            )
                        await _write_event(
                            resp,
                            "content_block_delta",
                            {
                                "type": "content_block_delta",
                                "index": thinking_block_idx,
                                "delta": {
                                    "type": "thinking_delta",
                                    "thinking": t,
                                },
                            },
                        )
                    if clean_text:
                        await _write_event(
                            resp,
                            "content_block_delta",
                            {
                                "type": "content_block_delta",
                                "index": text_block_idx,
                                "delta": {
                                    "type": "text_delta",
                                    "text": clean_text,
                                },
                            },
                        )

            elif isinstance(ch, dict):
                if "thinking" in ch:
                    if not thinking_started:
                        thinking_block_idx = next_idx
                        next_idx += 1
                        thinking_started = True
                        await _write_event(
                            resp,
                            "content_block_start",
                            {
                                "type": "content_block_start",
                                "index": thinking_block_idx,
                                "content_block": {
                                    "type": "thinking",
                                    "thinking": "",
                                },
                            },
                        )
                    await _write_event(
                        resp,
                        "content_block_delta",
                        {
                            "type": "content_block_delta",
                            "index": thinking_block_idx,
                            "delta": {
                                "type": "thinking_delta",
                                "thinking": ch["thinking"],
                            },
                        },
                    )
                elif "tool_calls" in ch:
                    tool_calls_data = ch["tool_calls"]
                elif "usage" in ch:
                    usage_d = ch["usage"]

    except asyncio.CancelledError:
        return resp
    except ConnectionResetError:
        return resp
    except Exception as exc:
        logger.error("Anthropic 流式错误: %s", exc, exc_info=True)
        await _write_event(
            resp,
            "error",
            {
                "type": "error",
                "error": {"type": "server_error", "message": str(exc)},
            },
        )
        return resp

    if text_buffer and not in_fncall:
        clean_text, thoughts = _split_thinking(text_buffer)
        for t in thoughts:
            if not thinking_started:
                thinking_block_idx = next_idx
                next_idx += 1
                thinking_started = True
                await _write_event(
                    resp,
                    "content_block_start",
                    {
                        "type": "content_block_start",
                        "index": thinking_block_idx,
                        "content_block": {
                            "type": "thinking",
                            "thinking": "",
                        },
                    },
                )
            await _write_event(
                resp,
                "content_block_delta",
                {
                    "type": "content_block_delta",
                    "index": thinking_block_idx,
                    "delta": {"type": "thinking_delta", "thinking": t},
                },
            )
        if clean_text:
            await _write_event(
                resp,
                "content_block_delta",
                {
                    "type": "content_block_delta",
                    "index": text_block_idx,
                    "delta": {"type": "text_delta", "text": clean_text},
                },
            )

    if in_fncall and fncall_buffer and not tool_calls_data:
        tool_calls_data = _parse_fncall_xml(fncall_buffer)

    if thinking_started and thinking_block_idx >= 0:
        await _write_event(
            resp,
            "content_block_stop",
            {"type": "content_block_stop", "index": thinking_block_idx},
        )

    await _write_event(
        resp,
        "content_block_stop",
        {"type": "content_block_stop", "index": text_block_idx},
    )

    next_block_idx = next_idx
    for i, tc in enumerate(tool_calls_data):
        ti = next_block_idx + i
        anth_tc = _openai_tc_to_anth(tc)
        args_str = _tc_args_to_str(tc)

        await _write_event(
            resp,
            "content_block_start",
            {
                "type": "content_block_start",
                "index": ti,
                "content_block": {
                    "type": "tool_use",
                    "id": anth_tc["id"],
                    "name": anth_tc["name"],
                    "input": {},
                },
            },
        )
        await _write_event(
            resp,
            "content_block_delta",
            {
                "type": "content_block_delta",
                "index": ti,
                "delta": {
                    "type": "input_json_delta",
                    "partial_json": args_str,
                },
            },
        )
        await _write_event(
            resp,
            "content_block_stop",
            {"type": "content_block_stop", "index": ti},
        )

    stop_reason = "tool_use" if tool_calls_data else "end_turn"
    ou = output_tokens
    if usage_d:
        ou = int(
            usage_d.get("completion_tokens")
            or usage_d.get("output_tokens")
            or output_tokens
        )

    await _write_event(
        resp,
        "message_delta",
        {
            "type": "message_delta",
            "delta": {
                "stop_reason": stop_reason,
                "stop_sequence": None,
            },
            "usage": {"output_tokens": ou},
        },
    )

    await _write_event(resp, "message_stop", {"type": "message_stop"})

    return resp


# ═══════════════════════════════════════════════════════════════════════════
# 非流式内容收集
# ═══════════════════════════════════════════════════════════════════════════


async def _collect_messages(
    body: Dict[str, Any],
    msgs: List[Dict[str, Any]],
    tools: Optional[List[Dict[str, Any]]],
    registry: Any,
) -> Tuple[str, List[str], List[Dict[str, Any]], Optional[Dict[str, Any]]]:
    """收集非流式消息生成的全部输出。

    Args:
        body: 请求体字典。
        msgs: 已转换的 OpenAI 格式消息列表。
        tools: 已转换的 OpenAI 格式工具列表。
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
        **_build_dispatch_kwargs(body, msgs, False, registry, tools)
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

    cleaned, more_thoughts = _split_thinking(cleaned)
    if more_thoughts:
        thinking_parts.extend(more_thoughts)

    if tool_calls:
        cleaned = ""
    elif _FNCALL_OPEN_TAG in raw_content:
        parsed = _parse_fncall_xml(raw_content)
        if parsed:
            tool_calls = parsed
            cleaned = ""

    return cleaned, thinking_parts, tool_calls, usage_d


# ═══════════════════════════════════════════════════════════════════════════
# 路由处理器
# ═══════════════════════════════════════════════════════════════════════════


async def messages_handler(
    request: aiohttp.web.Request,
) -> aiohttp.web.StreamResponse:
    """Anthropic Messages 端点处理器。

    POST /v1/messages
    POST /messages

    Args:
        request: 请求对象。

    Returns:
        流式或非流式响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON in request body", "invalid_request_error")

    messages_raw = body.get("messages", [])
    if not messages_raw:
        return _err(400, "messages is required", "invalid_request_error")

    mdl = body.get("model", "")
    if not mdl:
        return _err(400, "model is required", "invalid_request_error")

    system_str = _normalize_anth_content(body.get("system"))
    msgs = _anth_messages_to_openai(messages_raw, system_str)
    tools = _anth_tools_to_openai(body.get("tools"))
    thinking = _is_thinking(body)
    stream = bool(body.get("stream", False))

    if stream:
        return await _stream_messages(request, body, msgs, tools, thinking)

    mid = _mid()
    mdl = body.get("model", "")

    try:
        content, thinking_parts, tool_calls, usage_d = (
            await _collect_messages(body, msgs, tools, _require_registry(request))
        )
    except NoCandidateError as exc:
        return _err(503, str(exc), "overloaded_error")
    except ProviderError as exc:
        return _err(502, str(exc), "api_error")
    except Exception as exc:
        logger.error("Anthropic messages 异常: %s", exc, exc_info=True)
        return _err(500, str(exc), "server_error")

    rc: List[Dict[str, Any]] = []
    if thinking_parts:
        rc.append({"type": "thinking", "thinking": "".join(thinking_parts)})
    if content:
        rc.append({"type": "text", "text": content})
    for tc in tool_calls:
        rc.append(_openai_tc_to_anth(tc))

    if not rc:
        rc.append({"type": "text", "text": ""})

    pt = sum(len(str(m.get("content", ""))) // 3 for m in msgs)
    if usage_d:
        ou = int(
            usage_d.get("completion_tokens")
            or usage_d.get("output_tokens")
            or (len(content) // 3 if content else 0)
        )
    else:
        ou = len(content) // 3 if content else 0

    return _json(
        {
            "id": mid,
            "type": "message",
            "role": "assistant",
            "content": rc,
            "model": mdl,
            "stop_reason": "tool_use" if tool_calls else "end_turn",
            "stop_sequence": None,
            "usage": {"input_tokens": pt, "output_tokens": ou},
        }
    )


async def list_models(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """模型列表端点 GET /v1/models（Anthropic 格式）。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    registry = _require_registry(request)
    ct = int(time.time())
    models: List[Dict[str, Any]] = []

    try:
        raw_models = await registry.all_models()
        for m in raw_models:
            model_id = m if isinstance(m, str) else m.get("id", "")
            if model_id:
                models.append(
                    {
                        "type": "model",
                        "id": model_id,
                        "display_name": model_id,
                        "created_at": ct,
                    }
                )
    except Exception as exc:
        logger.warning("获取模型列表失败: %s", exc)

    return _json(
        {
            "type": "list",
            "data": models,
            "has_more": False,
            "first_id": models[0]["id"] if models else None,
            "last_id": models[-1]["id"] if models else None,
        }
    )


async def retrieve_model(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """模型详情端点 GET /v1/models/{model_id}（Anthropic 格式）。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    model_id = request.match_info["model_id"]
    return _json(
        {
            "type": "model",
            "id": model_id,
            "display_name": model_id,
            "created_at": int(time.time()),
        }
    )


async def count_tokens(
    request: aiohttp.web.Request,
) -> aiohttp.web.Response:
    """Token 计数端点 POST /v1/messages/count_tokens。

    Args:
        request: 请求对象。

    Returns:
        响应对象。
    """
    body = await _get_json(request)
    if body is None:
        return _err(400, "Invalid JSON", "invalid_request_error")

    system_str = _normalize_anth_content(body.get("system"))
    msgs = _anth_messages_to_openai(body.get("messages", []), system_str)
    estimated = sum(len(str(m.get("content", ""))) // 3 for m in msgs)
    for t in body.get("tools", []):
        estimated += len(json.dumps(t, ensure_ascii=False)) // 3

    return _json({"input_tokens": estimated})


# ═══════════════════════════════════════════════════════════════════════════
# 路由注册
# ═══════════════════════════════════════════════════════════════════════════


def setup_routes(app: aiohttp.web.Application) -> None:
    """注册所有 Anthropic 兼容路由。

    Args:
        app: aiohttp.web.Application 实例。
    """
    app.router.add_post("/v1/messages", messages_handler)
    app.router.add_post("/messages", messages_handler)
    app.router.add_post("/v1/messages/count_tokens", count_tokens)
    app.router.add_get("/v1/models", list_models)
    app.router.add_get("/v1/models/{model_id}", retrieve_model)
