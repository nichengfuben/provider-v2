from __future__ import annotations

import json
import logging
import re
import uuid
from typing import Any, Dict, List, Optional, Tuple

from src.core.config import get_config

__all__ = [
    "inject_fncall",
    "parse_fncall",
    "FncallStreamParser",
    "format_tool_descs",
    "normalize_content",
]
logger = logging.getLogger(__name__)

_INVOKE_OUTER_RE = re.compile(
    r"<function_calls>\s*<invoke\s+name=\"([^\"]+)\">(.*?)</invoke>\s*</function_calls>",
    re.DOTALL,
)
_PARAM_NAME_RE = re.compile(
    r"<parameter\s+name=\"([^\"]+)\">(.*?)</parameter>",
    re.DOTALL,
)

_FE = "</function>"
_FE_ESC = re.escape(_FE)
_FUNC_RE = re.compile(r"<function=([^>]+)>(.*?)" + _FE_ESC, re.DOTALL)
_PARAM_RE = re.compile(
    r"<([a-zA-Z_\u4e00-\u9fff][\w\u4e00-\u9fff]*)>\s*\n?(.*?)\n?\s*</\1>",
    re.DOTALL,
)

_SYSTEM_PREAMBLE = (
    "In this environment you have access to a set of tools you can use to answer the user's question.\n\n"
    "String and scalar parameters should be specified as is, while lists and objects should use JSON format. "
    "Note that spaces for string values are not stripped. The output is not expected to be valid XML and is "
    "parsed with regular expressions. For multi-line parameters such as code, preserve literal newlines inside "
    "the parameter tags.\n\n"
    "Here are the functions available in JSONSchema format:\n\n"
    "<tools>\n{tool_descs}\n</tools>"
)

_USAGE_EN = (
    "To call a function, use the following format:\n\n"
    "<function_calls>\n"
    "<invoke name=\"function_name\">\n"
    "<parameter name=\"scalar_param\">value</parameter>\n"
    "<parameter name=\"multi_line_param\">line1\n"
    "line2\n"
    "line3</parameter>\n"
    "</invoke>\n"
    "</function_calls>\n\n"
    "<IMPORTANT>\n"
    "- For scalar/single-line parameters, place the value inline with no extra newlines inside the tag.\n"
    "- For multi-line parameters such as code, preserve literal newlines inside the parameter tags.\n"
    "- Required parameters MUST be included.\n"
    "- Only provide reasoning BEFORE the function call, never after.\n"
    "- If no function call is needed, answer normally without mentioning tools.\n"
    "</IMPORTANT>"
)

_USAGE_ZH = (
    "调用函数时，请使用以下格式：\n\n"
    "<function_calls>\n"
    "<invoke name=\"函数名\">\n"
    "<parameter name=\"单行参数名\">值</parameter>\n"
    "<parameter name=\"多行参数名\">第一行\n"
    "第二行\n"
    "第三行</parameter>\n"
    "</invoke>\n"
    "</function_calls>\n\n"
    "<IMPORTANT>\n"
    "- 对于普通单行参数，将值直接内联写在标签内，不要添加多余换行。\n"
    "- 对于像代码这样的多行参数，请保留参数标签内的原始换行符。\n"
    "- 必须包含所有必需参数。\n"
    "- 只能在函数调用之前提供推理说明，不能在之后。\n"
    "- 如果不需要调用函数，请正常回答问题。\n"
    "</IMPORTANT>"
)

_USAGE_DEFAULTS: Dict[str, str] = {"en": _USAGE_EN, "zh": _USAGE_ZH}


def _get_usage(lang: str = "en") -> str:
    """获取函数调用使用说明模板。

    Args:
        lang: 语言代码（en/zh）。

    Returns:
        使用说明字符串。
    """
    t = get_config().fncall.templates
    key = "usage_{}".format(lang)
    if lang in t and t.get(lang):
        return t[lang]
    if key in t and t.get(key):
        return t[key]
    return _USAGE_DEFAULTS.get(lang, _USAGE_DEFAULTS["en"])


def normalize_content(content: Any) -> str:
    """规范化消息 content 字段为字符串。

    Args:
        content: 原始 content 字段值。

    Returns:
        规范化字符串。
    """
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                if item.get("type") == "text":
                    parts.append(item.get("text", ""))
                elif "text" in item:
                    parts.append(str(item.get("text", "")))
                else:
                    parts.append(json.dumps(item, ensure_ascii=False))
            else:
                parts.append(str(item))
        return "\n".join(parts)
    if isinstance(content, dict):
        if "text" in content:
            return str(content["text"])
        return json.dumps(content, ensure_ascii=False)
    return str(content)


def format_tool_descs(tools: List[Dict[str, Any]]) -> str:
    """将工具列表格式化为 XML 描述字符串。

    Args:
        tools: OpenAI 格式工具列表。

    Returns:
        XML 描述字符串。
    """
    parts: List[str] = []
    for tool in tools:
        fn = tool.get("function", tool)
        name = fn.get("name", "unknown")
        desc = fn.get("description", "")
        params = fn.get("parameters", {})
        props = params.get("properties", {})
        required = params.get("required", [])

        lines: List[str] = [
            "<tool_description>",
            "<tool_name>{}</tool_name>".format(name),
        ]
        if desc:
            lines.append("<description>{}</description>".format(desc))

        lines.append("<parameters>")
        for pn, pi in props.items():
            pt = pi.get("type", "string")
            req = "true" if pn in required else "false"
            lines.append("<parameter>")
            lines.append("<name>{}</name>".format(pn))
            lines.append("<type>{}</type>".format(pt))
            if "enum" in pi and isinstance(pi["enum"], list):
                lines.append(
                    "<enum>{}</enum>".format(", ".join(map(str, pi["enum"])))
                )
            pd = pi.get("description", "")
            if pd:
                lines.append("<description>{}</description>".format(pd))
            lines.append("<required>{}</required>".format(req))
            lines.append("</parameter>")
        lines.append("</parameters>")
        lines.append("</tool_description>")
        parts.append("\n".join(lines))
    return "\n\n".join(parts)


def _render_parameter_value(v: Any) -> str:
    """将参数值渲染为字符串。

    Args:
        v: 参数值。

    Returns:
        字符串表示。
    """
    if isinstance(v, str):
        return v
    return json.dumps(v, ensure_ascii=False)


def _render_tool_call(tc: Dict[str, Any]) -> str:
    """将 tool_call 渲染为 XML 格式。

    Args:
        tc: OpenAI tool_call 字典。

    Returns:
        XML 字符串。
    """
    fn = tc.get("function", {})
    name = fn.get("name", "")
    args_str = fn.get("arguments", "{}")
    try:
        args_dict = json.loads(args_str)
    except json.JSONDecodeError:
        args_dict = {"value": args_str}

    lines = ["<function_calls>", "<invoke name=\"{}\">".format(name)]
    for k, v in args_dict.items():
        v_str = _render_parameter_value(v)
        lines.append("<parameter name=\"{}\">{}</parameter>".format(k, v_str))
    lines.append("</invoke>")
    lines.append("</function_calls>")
    return "\n".join(lines)


def _render_tool_result(content: Any, tool_name: str = "") -> str:
    """将工具结果渲染为 XML 格式。

    Args:
        content: 工具结果内容。
        tool_name: 工具名（可选）。

    Returns:
        XML 字符串。
    """
    text = normalize_content(content)
    lines = [
        "<function_results>",
        "<result>",
    ]
    if tool_name:
        lines.append("<tool_name>{}</tool_name>".format(tool_name))
    lines.append("<stdout>{}</stdout>".format(text))
    lines.append("</result>")
    lines.append("</function_results>")
    return "\n".join(lines)


def _format_conversation_history(messages: List[Dict[str, Any]]) -> str:
    """将消息列表格式化为对话历史 XML。

    Args:
        messages: OpenAI 格式消息列表。

    Returns:
        XML 格式对话历史字符串。
    """
    parts: List[str] = []
    call_id_to_name: Dict[str, str] = {}

    for m in messages:
        role = m.get("role", "user")
        content = m.get("content", "")
        if isinstance(content, list):
            content = normalize_content(content)
        elif not isinstance(content, str):
            content = str(content)

        turn_content = content

        if role == "assistant":
            tcs = m.get("tool_calls") or []
            blocks: List[str] = []
            if content:
                blocks.append(content)
            for tc in tcs:
                cid = tc.get("id", "")
                fn_name = tc.get("function", {}).get("name", "")
                if cid and fn_name:
                    call_id_to_name[cid] = fn_name
                blocks.append(_render_tool_call(tc))
            turn_content = "\n".join(blocks)

        elif role == "tool":
            tid = m.get("tool_call_id", "")
            tool_name = call_id_to_name.get(tid, "")
            turn_content = _render_tool_result(content, tool_name)

        parts.append(
            "<turn>\n"
            "<role>{}</role>\n"
            "<content>{}</content>\n"
            "</turn>".format(role, turn_content)
        )

    return "\n\n".join(parts)


def inject_fncall(
    messages: List[Dict], tools: List[Dict], lang: str = "en"
) -> List[Dict]:
    """将工具定义注入到消息中，构建为单条 user 消息。

    Args:
        messages: 原始消息列表。
        tools: OpenAI 格式工具列表。
        lang: 语言代码（en/zh）。

    Returns:
        注入后的消息列表（单条 user 消息）。
    """
    if not tools:
        return messages

    history = _format_conversation_history(messages)
    tool_descs = format_tool_descs(tools)
    usage = _get_usage(lang)
    system_block = _SYSTEM_PREAMBLE.replace("{tool_descs}", tool_descs)

    prompt = (
        "<conversation_history>\n\n"
        "{}\n\n"
        "</conversation_history>\n\n"
        "<system>\n"
        "{}\n\n"
        "{}\n"
        "</system>\n\n"
        "START REPLY NOW"
    ).format(history, system_block, usage)

    return [{"role": "user", "content": prompt}]


def _get_known_params(
    func_name: str, tools: Optional[List[Dict]]
) -> List[str]:
    """获取指定函数的已知参数名列表。

    Args:
        func_name: 函数名。
        tools: 工具列表。

    Returns:
        参数名列表。
    """
    if not tools:
        return []
    for t in tools:
        fn = t.get("function", t)
        if fn.get("name") == func_name:
            return list(fn.get("parameters", {}).get("properties", {}).keys())
    return []


def _parse_invoke_body(body: str) -> str:
    """解析 invoke 标签体中的 parameter 为 JSON arguments 字符串。

    Args:
        body: invoke 标签体字符串。

    Returns:
        JSON arguments 字符串。
    """
    matches = list(_PARAM_NAME_RE.finditer(body))
    if not matches:
        return "{}"
    result: Dict[str, Any] = {}
    for m in matches:
        pname = m.group(1)
        pval = m.group(2)
        try:
            result[pname] = json.loads(pval)
        except json.JSONDecodeError:
            result[pname] = pval
    return json.dumps(result, ensure_ascii=False)


def _parse_func_body(
    body: str, func_name: str, tools: Optional[List[Dict]] = None
) -> str:
    """解析旧格式 function 标签体为 JSON arguments 字符串。

    Args:
        body: 标签体字符串。
        func_name: 函数名。
        tools: 工具列表（用于参数名校验）。

    Returns:
        JSON arguments 字符串。
    """
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
    """从文本中解析函数调用，返回清理后的文本和 tool_calls 列表。

    Args:
        text: 包含函数调用标签的文本。
        tools: 工具列表（用于参数校验）。

    Returns:
        (clean_text, tool_calls) 元组。
    """
    calls: List[Dict[str, Any]] = []

    for m in _INVOKE_OUTER_RE.finditer(text):
        func_name = m.group(1).strip()
        body = m.group(2)
        arguments = _parse_invoke_body(body)
        calls.append(
            {
                "id": "fcall_{}".format(uuid.uuid4().hex[:24]),
                "type": "function",
                "function": {"name": func_name, "arguments": arguments},
            }
        )

    if not calls:
        for m_obj in _FUNC_RE.finditer(text):
            func_name = m_obj.group(1).strip()
            body = m_obj.group(2)
            arguments = _parse_func_body(body, func_name, tools)
            calls.append(
                {
                    "id": "fcall_{}".format(uuid.uuid4().hex[:24]),
                    "type": "function",
                    "function": {"name": func_name, "arguments": arguments},
                }
            )

    clean = text
    if calls:
        clean = _INVOKE_OUTER_RE.sub("", clean)
        clean = _FUNC_RE.sub("", clean).strip()

    return clean, calls


class FncallStreamParser:
    """流式 fncall 检测与解析。"""

    _TRIGGER = "<function_calls>"
    _TRIGGER_LEGACY = "<function="

    def __init__(self, tools: Optional[List[Dict]] = None) -> None:
        """初始化解析器。

        Args:
            tools: 工具列表（用于参数校验）。
        """
        self._buf = ""
        self._detected = False
        self._tools = tools

    def feed(self, chunk: str) -> None:
        """向缓冲区追加新的文本片段。

        Args:
            chunk: 新的文本片段。
        """
        self._buf += chunk
        if self._TRIGGER in self._buf or self._TRIGGER_LEGACY in self._buf:
            self._detected = True

    @property
    def has_calls(self) -> bool:
        """是否检测到函数调用。

        Returns:
            是否检测到。
        """
        return self._detected

    def finalize(self) -> Tuple[str, List[Dict[str, Any]]]:
        """完成解析，返回清理后的文本和 tool_calls 列表。

        Returns:
            (clean_text, tool_calls) 元组。
        """
        return parse_fncall(self._buf, self._tools)
