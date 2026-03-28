"""Metaso (秘塔AI搜索) 平台工具函数"""

from typing import Dict, List, Any


def parse_metaso_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """解析 Metaso API 响应

    Args:
        data: 原始响应数据

    Returns:
        解析后的响应字典
    """
    result = {
        "type": "",
        "content": "",
        "reasoning": "",
        "citations": [],
        "highlights": [],
        "done": False,
    }

    msg_type = data.get("type", "")
    result["type"] = msg_type

    if msg_type == "conversation_init":
        conv_data = data.get("data", {})
        result["conversation_id"] = conv_data.get("id", "")

    elif "choices" in data:
        choice = data["choices"][0] if data["choices"] else {}
        delta = choice.get("delta", {})
        result["content"] = delta.get("content", "")
        result["reasoning"] = delta.get("reasoning_content", "")
        result["citations"] = delta.get("citations", [])
        result["highlights"] = delta.get("highlights", [])

    elif "content" in data:
        result["content"] = data.get("content", "")
        result["done"] = data.get("done", False)

    return result


def format_citations(citations: List[Dict[str, Any]]) -> str:
    """格式化引用列表为文本

    Args:
        citations: 引用列表

    Returns:
        格式化后的引用文本
    """
    if not citations:
        return ""

    lines = ["\n\n---\n**参考资料:**"]
    for i, cite in enumerate(citations, 1):
        title = cite.get("title", cite.get("name", "未知来源"))
        url = cite.get("url", cite.get("link", ""))
        source = cite.get("source", "")
        if url:
            lines.append(f"{i}. [{title}]({url})" + (f" - {source}" if source else ""))
        else:
            lines.append(f"{i}. {title}" + (f" - {source}" if source else ""))

    return "\n".join(lines)


def format_highlights(highlights: List[Dict[str, Any]]) -> str:
    """格式化高亮摘要

    Args:
        highlights: 高亮列表

    Returns:
        格式化后的高亮文本
    """
    if not highlights:
        return ""

    lines = ["\n\n**要点摘要:**"]
    for h in highlights:
        text = h.get("text", h.get("content", ""))
        if text:
            lines.append(f"- {text}")

    return "\n".join(lines)
