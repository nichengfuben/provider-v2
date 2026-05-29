# src/core/fncall/protocols/xml.py
"""XML 协议实现。

包装现有的 XML fncall 行为，实现 ToolProtocol 抽象基类。
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional, Tuple

from src.core.fncall.base import ToolProtocol
from src.core.fncall.parsers.xml_parser import parse_fncall, parse_fncall_xml
from src.core.fncall.prompt.history import (
    _format_conversation_history,
    _normalize_messages,
    _render_tool_call,
    _render_tool_result,
)
from src.core.fncall.prompt.templates import (
    _INSTRUCTION_EN,
    _INSTRUCTION_ZH,
    _USAGE_EN,
    _USAGE_ZH,
)
from src.core.fncall.shared.normalization import normalize_content
from src.core.fncall.shared.uuid7 import _uuid7


# ---------------------------------------------------------------------------
# 正则常量
# ---------------------------------------------------------------------------

_FNCALL_TAG_RE = re.compile(r"<function_calls>", re.DOTALL)
_FUNC_CALLS_RE = re.compile(r"<function_calls>.*?</function_calls>", re.DOTALL)


# ---------------------------------------------------------------------------
# XML 协议
# ---------------------------------------------------------------------------


class XmlProtocol(ToolProtocol):
    """XML 格式工具调用协议适配器。

    使用 <function_calls><invoke name="...">...</invoke></function_calls>
    作为触发标记和调用格式。
    """

    @property
    def id(self) -> str:
        return "xml"

    def get_trigger_tags(self) -> List[str]:
        return ["<function_calls>"]

    def render_prompt(
        self,
        tool_descs: str,
        lang: str,
        user_system_prompt: str = "",
        history_text: str = "",
        loop_warning: str = "",
        current_user_message: str = "",
    ) -> str:
        """构建完整的 prompt 字符串，注入工具定义。"""
        usage = _USAGE_ZH if lang == "zh" else _USAGE_EN
        instruction = _INSTRUCTION_ZH if lang == "zh" else _INSTRUCTION_EN

        parts: List[str] = []

        if user_system_prompt:
            parts.append(user_system_prompt)

        parts.append(usage.format(tool_descs=tool_descs))

        if history_text:
            parts.append(history_text)

        parts.append(instruction)

        if loop_warning:
            parts.append(loop_warning)

        if current_user_message:
            parts.append(current_user_message)

        return "\n\n".join(parts)

    def detect_start(self, buffer: str) -> Tuple[bool, int]:
        """检测 buffer 中是否包含 <function_calls> 触发标记。"""
        m = _FNCALL_TAG_RE.search(buffer)
        if m:
            return (True, m.start())
        return (False, -1)

    def parse(
        self,
        text: str,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """从文本中提取工具调用，返回 (清理后文本, tool_calls 列表)。"""
        return parse_fncall(text, tools=tools)

    def parse_fragment(
        self,
        fragment: str,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        """将已知的 XML 片段直接解析为 tool_calls 列表。"""
        return parse_fncall_xml(fragment, tools=tools)

    def clean_tags(self, content: str) -> str:
        """从响应文本中移除 <function_calls> 标签残留。"""
        cleaned = _FUNC_CALLS_RE.sub("", content)
        return cleaned.strip()

    def format_assistant_tool_calls(
        self,
        tool_calls: List[Dict[str, Any]],
    ) -> str:
        """将 tool_call 对象列表渲染为 XML 格式。"""
        if not tool_calls:
            return ""

        blocks: List[str] = []
        for tc in tool_calls:
            blocks.append(_render_tool_call(tc))

        return "\n\n".join(blocks)

    def format_tool_result(
        self,
        content: str,
        tool_name: str = "",
        is_error: bool = False,
    ) -> str:
        """将工具执行结果渲染为 XML 格式。"""
        return _render_tool_result(content, tool_name=tool_name, is_error=is_error)

    def supports_streaming(self) -> bool:
        """XML 协议支持流式检测。"""
        return True
