# src/core/fncall/shared/normalization.py
"""内容规范化和工具描述格式化。

从 src/core/tools.py 迁移（原 lines 759-843）。
"""

from __future__ import annotations

import json
from typing import Any, Dict, List


def normalize_content(content: Any) -> str:
    """将消息 content 字段规范化为纯字符串。"""
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
                if item.get("type") == "text" or "text" in item:
                    text_val = item.get("text", "")
                    parts.append(str(text_val) if text_val is not None else "")
                else:
                    parts.append(json.dumps(item, ensure_ascii=False))
            else:
                parts.append(str(item))
        return "\n".join(p for p in parts if p)
    if isinstance(content, dict):
        if "text" in content:
            val = content["text"]
            return str(val) if val is not None else ""
        return json.dumps(content, ensure_ascii=False)
    return str(content)


def format_tool_descs(tools: List[Dict[str, Any]]) -> str:
    """将 OpenAI 格式工具定义列表格式化为 XML 描述字符串。"""
    if not tools:
        return ""

    parts: List[str] = []
    for tool in tools:
        fn: Dict[str, Any] = tool.get("function", tool)  # type: ignore[arg-type]
        name: str = fn.get("name") or "unknown"
        desc: str = fn.get("description") or ""
        params: Dict[str, Any] = fn.get("parameters") or {}
        props: Dict[str, Any] = params.get("properties") or {}
        required: List[str] = params.get("required") or []

        lines: List[str] = [f'<tool name="{name}">']
        if desc:
            lines.append(f"<description>{desc}</description>")
        lines.append("<parameters>")

        for pn, pi in props.items():
            if not isinstance(pi, dict):
                continue
            pt: str = pi.get("type") or "string"
            req_str = "true" if pn in required else "false"
            lines.append(f'<parameter name="{pn}" type="{pt}" required="{req_str}">')
            pd: str = pi.get("description") or ""
            if pd:
                lines.append(f"<description>{pd}</description>")
            enum_vals = pi.get("enum")
            if isinstance(enum_vals, list) and enum_vals:
                lines.append(f"<enum>{', '.join(map(str, enum_vals))}</enum>")
            if "default" in pi:
                lines.append(f"<default>{pi['default']}</default>")
            lines.append("</parameter>")

        lines.append("</parameters>")

        examples = fn.get("input_examples")
        if isinstance(examples, list) and examples:
            lines.append("<input_examples>")
            for ex in examples:
                lines.append(
                    f"<example>{json.dumps(ex, ensure_ascii=False)}</example>"
                )
            lines.append("</input_examples>")

        lines.append("</tool>")
        parts.append("\n".join(lines))

    return "\n\n".join(parts)

