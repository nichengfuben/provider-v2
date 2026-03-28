"""Andi 搜索平台工具函数"""

from typing import Dict, List, Any


def parse_andi_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """解析 Andi API 响应

    Args:
        data: 原始响应数据

    Returns:
        解析后的响应字典
    """
    result = {
        "content": "",
        "reasoning": "",
        "citations": [],
        "done": False,
    }

    if "choices" in data:
        choice = data["choices"][0] if data["choices"] else {}
        delta = choice.get("delta", {})
        result["content"] = delta.get("content", "")
        result["reasoning"] = delta.get("reasoning_content", "")
        result["citations"] = delta.get("citations", [])

    elif "answer" in data:
        result["content"] = data.get("answer", "")
        result["reasoning"] = data.get("reasoning", "")
        result["citations"] = data.get("sources", [])
        result["done"] = data.get("done", False)

    elif "content" in data:
        result["content"] = data.get("content", "")
        result["reasoning"] = data.get("reasoning", "")
        result["citations"] = data.get("citations", [])
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
        title = cite.get("title", "未知来源")
        url = cite.get("url", "")
        if url:
            lines.append(f"{i}. [{title}]({url})")
        else:
            lines.append(f"{i}. {title}")

    return "\n".join(lines)
