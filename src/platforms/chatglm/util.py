"""ChatGLM 工具函数

智谱清言 API 辅助函数
"""

from typing import Dict, List, Any
import json


def parse_chatglm_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """解析 ChatGLM API 响应

    Args:
        data: 原始响应数据

    Returns:
        解析后的响应字典
    """
    result = {
        "content": "",
        "status": "",
        "done": False,
    }

    # 解析 parts 内容
    parts = data.get("parts", [])
    for part in parts:
        role = part.get("role", "")
        content_list = part.get("content", [])
        status = part.get("status", "")

        if role == "assistant":
            for c in content_list:
                if c.get("type") == "text":
                    result["content"] += c.get("text", "")

            if status == "finish":
                result["done"] = True

        result["status"] = status

    # 检查元数据
    meta_data = data.get("meta_data", {})
    result["if_plus_model"] = meta_data.get("if_plus_model", False)
    result["plus_model_available"] = meta_data.get("plus_model_available", True)

    return result


def build_chatglm_request(
    query: str,
    conversation_id: str = "",
    assistant_id: str = "default",
    stream: bool = True,
) -> Dict[str, Any]:
    """构建 ChatGLM 请求体

    Args:
        query: 用户查询
        conversation_id: 会话ID
        assistant_id: 助手ID
        stream: 是否流式响应

    Returns:
        请求体字典
    """
    return {
        "query": query,
        "conversation_id": conversation_id,
        "assistant_id": assistant_id,
        "stream": stream,
    }


def format_chatglm_message(role: str, content: str) -> Dict[str, Any]:
    """格式化 ChatGLM 消息

    Args:
        role: 角色 (user/assistant)
        content: 消息内容

    Returns:
        消息字典
    """
    return {
        "role": role,
        "content": [{"type": "text", "text": content}],
    }


def extract_text_from_parts(parts: List[Dict[str, Any]]) -> str:
    """从 parts 中提取文本内容

    Args:
        parts: parts 列表

    Returns:
        提取的文本
    """
    texts = []
    for part in parts:
        for c in part.get("content", []):
            if c.get("type") == "text":
                texts.append(c.get("text", ""))
    return "".join(texts)
