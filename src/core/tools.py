"""fncall 模板注入与解析（仅 en/zh，无 _ci）"""

from __future__ import annotations

import json
import logging
import re
import uuid
from typing import Any, Dict, List, Optional, Tuple

from src.core.config import get_config

__all__ = ["inject_fncall", "parse_fncall", "FncallStreamParser", "format_tool_descs"]
logger = logging.getLogger(__name__)

_FE = "</" + "function>"
_FE_ESC = re.escape(_FE)

_EN = (
    "You are a helpful AI assistant that can interact with tools to solve tasks.\n\n"
    "<chat_history>\n{chat_history}\n</" + "chat_history>\n\n"
    "# Available Tools\n\n<tools>\n{tool_descs}\n</" + "tools>\n\n"
    "To call a function, wrap each parameter value in XML tags named after the parameter:\n\n"
    "<function=function_name>\n<first_parameter>\nvalue\n</" + "first_parameter>\n"
    "<second_parameter>\nvalue\n</" + "second_parameter>\n" + _FE + "\n\n"
    "<IMPORTANT>\n"
    "- The XML tag name MUST exactly match the parameter name defined above.\n"
    "- There MUST be a line break between the opening tag and the value, and between the value and the closing tag.\n"
    "- Required parameters MUST be included.\n"
    "- Only provide reasoning BEFORE the function call, never after.\n"
    "- If no function call is needed, answer normally without mentioning tools.\n"
    "</IMPORTANT>"
)

_ZH = (
    "你是一个乐于助人的AI助手，可以使用工具来解决任务。\n\n"
    "<chat_history>\n{chat_history}\n</" + "chat_history>\n\n"
    "# 可用工具\n\n<tools>\n{tool_descs}\n</" + "tools>\n\n"
    "调用函数时，将每个参数值用与参数名同名的XML标签包裹：\n\n"
    "<function=函数名>\n<第一个参数名>\n值\n</" + "第一个参数名>\n"
    "<第二个参数名>\n值\n</" + "第二个参数名>\n" + _FE + "\n\n"
    "<IMPORTANT>\n"
    "- XML标签名必须与参数名完全一致，不要添加前缀。\n"
    "- 标签和值之间必须有换行符。\n"
    "- 必须包含所有必需参数。\n"
    "- 只能在函数调用之前提供推理说明，不能在之后。\n"
    "- 如果不需要调用函数，请正常回答问题。\n"
    "</IMPORTANT>"
)

_DEFAULTS = {"en": _EN, "zh": _ZH}


def _get_tpl(lang: str = "en") -> str:
    t = get_config().fncall.templates
    if lang in t and t[lang]:
        return t[lang]
    return _DEFAULTS.get(lang, _DEFAULTS["en"])


def _format_chat_history(messages: List[Dict[str, Any]]) -> str:
    """将 messages 转为 XML chat_history"""
    parts: List[str] = []
    for m in messages:
        role = m.get("role", "user")
        content = m.get("content", "")
        if isinstance(content, list):
            text_parts = [
                p.get("text", "")
                for p in content
                if isinstance(p, dict) and p.get("type") == "text"
            ]
            content = "\n".join(text_parts)
            if not content:
                continue
        if not isinstance(content, str):
            content = str(content)

        if role == "user":
            close = "</" + "user_input>"
            parts.append(f"<user_input>\n{content}\n{close}")
        elif role == "assistant":
            tool_calls = m.get("tool_calls")
            if tool_calls:
                for tc in tool_calls:
                    fn = tc.get("function", {})
                    cid = tc.get("id", "")
                    name = fn.get("name", "")
                    args_str = fn.get("arguments", "{}")
                    try:
                        args_dict = json.loads(args_str)
                    except json.JSONDecodeError:
                        args_dict = {"value": args_str}
                    param_xml: List[str] = []
                    for k, v in args_dict.items():
                        close_p = "</" + f"{k}>"
                        param_xml.append(f"<{k}>\n{v}\n{close_p}")
                    ps = "\n".join(param_xml)
                    close_tc = "</" + "tool_call>"
                    parts.append(
                        f'<tool_call id="{cid}" name="{name}">\n{ps}\n{close_tc}'
                    )
            if content:
                close_ar = "</" + "assistant_response>"
                parts.append(f"<assistant_response>\n{content}\n{close_ar}")
        elif role == "tool":
            tid = m.get("tool_call_id", "")
            close_tr = "</" + "tool_result>"
            parts.append(f'<tool_result id="{tid}">\n{content}\n{close_tr}')
        elif role == "system":
            close_sr = "</" + "system_reminder>"
            parts.append(f"<system_reminder>\n{content}\n{close_sr}")
        else:
            tag = f"{role}_response"
            close_tag = "</" + f"{tag}>"
            parts.append(f"<{tag}>\n{content}\n{close_tag}")
    return "\n".join(parts)


def format_tool_descs(tools: List[Dict[str, Any]]) -> str:
    """格式化工具描述"""
    parts: List[str] = []
    for tool in tools:
        fn = tool.get("function", tool)
        name = fn.get("name", "unknown")
        desc = fn.get("description", "")
        params = fn.get("parameters", {})
        lines = [f"function: {name}"]
        if desc:
            lines.append(f"description: {desc}")
        props = params.get("properties", {})
        required = params.get("required", [])
        if props:
            pl: List[str] = []
            for pn, pi in props.items():
                pt = pi.get("type", "string")
                pd = pi.get("description", "")
                req = " (required)" if pn in required else ""
                pl.append(f"  - {pn}: {pt}{req}" + (f" - {pd}" if pd else ""))
            lines.append("parameters:\n" + "\n".join(pl))
        else:
            lines.append("parameters: none")
        parts.append("\n".join(lines))
    return "\n\n".join(parts)


def inject_fncall(
    messages: List[Dict], tools: List[Dict], lang: str = "en"
) -> List[Dict]:
    """构建为单条 user 消息"""
    if not tools:
        return messages
    tpl = _get_tpl(lang)
    ch = _format_chat_history(messages)
    td = format_tool_descs(tools)
    prompt = tpl.replace("{chat_history}", ch).replace("{tool_descs}", td)
    return [{"role": "user", "content": prompt}]


_FUNC_RE = re.compile(r"<function=([^>]+)>(.*?)" + _FE_ESC, re.DOTALL)
_PARAM_RE = re.compile(
    r"<([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff]*)>\s*\n?(.*?)\n?\s*</\1>",
    re.DOTALL,
)


def _get_known_params(func_name: str, tools: Optional[List[Dict]]) -> List[str]:
    """获取函数的已知参数名列表"""
    if not tools:
        return []
    for t in tools:
        fn = t.get("function", t)
        if fn.get("name") == func_name:
            return list(fn.get("parameters", {}).get("properties", {}).keys())
    return []


def _parse_func_body(
    body: str, func_name: str, tools: Optional[List[Dict]] = None
) -> str:
    """解析函数体中的参数标签"""
    known = _get_known_params(func_name, tools)
    matches = list(_PARAM_RE.finditer(body))

    if matches:
        result: Dict[str, Any] = {}
        for m_obj in matches:
            pname = m_obj.group(1).strip()
            pval = m_obj.group(2).strip()
            if known and pname not in known:
                continue
            try:
                result[pname] = json.loads(pval)
            except json.JSONDecodeError:
                result[pname] = pval
        if result:
            return json.dumps(result, ensure_ascii=False)

    stripped = body.strip()
    if stripped:
        try:
            json.loads(stripped)
            return stripped
        except json.JSONDecodeError:
            pass
    return "{}"


def parse_fncall(
    text: str, tools: Optional[List[Dict]] = None
) -> Tuple[str, List[Dict[str, Any]]]:
    """从文本提取函数调用"""
    calls: List[Dict[str, Any]] = []
    for m_obj in _FUNC_RE.finditer(text):
        func_name = m_obj.group(1).strip()
        body = m_obj.group(2)
        arguments = _parse_func_body(body, func_name, tools)
        calls.append(
            {
                "id": f"call_{uuid.uuid4().hex[:24]}",
                "type": "function",
                "function": {"name": func_name, "arguments": arguments},
            }
        )
    clean = _FUNC_RE.sub("", text).strip() if calls else text
    return clean, calls


class FncallStreamParser:
    """流式 fncall 检测与解析"""

    def __init__(self, tools: Optional[List[Dict]] = None) -> None:
        self._buf = ""
        self._detected = False
        self._tools = tools

    def feed(self, chunk: str) -> None:
        self._buf += chunk
        if "<function=" in self._buf:
            self._detected = True

    @property
    def has_calls(self) -> bool:
        return self._detected

    def finalize(self) -> Tuple[str, List[Dict[str, Any]]]:
        return parse_fncall(self._buf, self._tools)
