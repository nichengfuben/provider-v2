"""StockAI 工具函数"""

from typing import Dict, List, Optional


def get_model_category(model: str) -> str:
    """获取模型类别

    Args:
        model: 模型名称

    Returns:
        str: 模型类别
    """
    if "search" in model:
        return "search"
    elif "news" in model:
        return "news"
    elif "translate" in model:
        return "translation"
    elif "kimi" in model:
        return "reasoning"
    elif "glm" in model:
        return "chat"
    else:
        return "chat"


def format_messages_for_api(messages: List[Dict]) -> List[Dict]:
    """格式化消息列表为API格式

    Args:
        messages: OpenAI格式的消息列表

    Returns:
        List[Dict]: API格式的消息列表
    """
    formatted = []
    for msg in messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")

        # 处理多部分内容
        if isinstance(content, list):
            text_parts = []
            for part in content:
                if isinstance(part, dict) and part.get("type") == "text":
                    text_parts.append(part.get("text", ""))
                elif isinstance(part, str):
                    text_parts.append(part)
            content = "\n".join(text_parts)

        formatted.append({
            "role": role,
            "content": content,
        })

    return formatted


def get_recommended_model(
    task: str = "chat",
    language: str = "zh",
) -> str:
    """根据任务类型推荐模型

    Args:
        task: 任务类型（chat/search/news/translate）
        language: 语言

    Returns:
        str: 推荐的模型名称
    """
    recommendations = {
        "search": "openrouter/free-search",
        "news": "stockai/news",
        "translate": "google/translategemma",
        "reasoning": "moonshotai/kimi-k2-thinking",
        "chat": "xiaomi/mimo-v2-pro",
    }

    return recommendations.get(task, recommendations["chat"])
