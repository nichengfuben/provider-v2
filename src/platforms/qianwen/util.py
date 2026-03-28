"""通义千问工具函数

阿里云通义千问 API 辅助函数
"""

from typing import Dict, List, Any
import json


def parse_qianwen_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """解析通义千问 API 响应

    Args:
        data: 原始响应数据

    Returns:
        解析后的响应字典
    """
    result = {
        "content": "",
        "intent": "",
        "done": False,
    }

    error_code = data.get("errorCode", 0)
    if error_code != 0:
        result["error"] = f"API error: {error_code}"
        return result

    # 解析消息列表
    messages = data.get("data", {}).get("messages", [])
    for msg in messages:
        mime_type = msg.get("mime_type", "")
        content = msg.get("content", "")
        meta_data = msg.get("meta_data", {})

        if mime_type == "signal/post":
            result["intent"] = meta_data.get("intent_content", "")

        elif mime_type == "multi_load/iframe":
            result["content"] += content

        elif mime_type == "text/plain":
            result["content"] += content

    # 检查完成状态
    model_info = data.get("data", {}).get("modelInfo", {})
    if model_info.get("session_result") == 1:
        result["done"] = True

    return result


def build_qianwen_request(
    query: str,
    session_id: str = "",
    model: str = "Qwen",
    stream: bool = True,
    **kwargs: Any,
) -> Dict[str, Any]:
    """构建通义千问请求体

    Args:
        query: 用户查询
        session_id: 会话ID
        model: 模型名称
        stream: 是否流式响应
        **kwargs: 其他参数

    Returns:
        请求体字典
    """
    return {
        "query": query,
        "session_id": session_id,
        "model": model,
        "stream": stream,
    }


def get_model_info(model: str) -> Dict[str, Any]:
    """获取模型信息

    Args:
        model: 模型代码

    Returns:
        模型信息字典
    """
    models = {
        "Qwen": {"name": "Qwen3.5-千问", "default": True},
        "Qwen3.5-Plus": {"name": "Qwen3.5-Plus", "context": "128K"},
        "Qwen3.5-Flash": {"name": "Qwen3.5-Flash", "speed": "fast"},
        "Qwen3-Max": {"name": "Qwen3-Max", "context": "32K"},
        "Qwen3-Max-Thinking-Preview": {"name": "Qwen3-Max-Thinking", "thinking": True},
        "Qwen3-Coder": {"name": "Qwen3-Coder", "tags": ["代码"]},
        "Qwen3-VL-Plus": {"name": "Qwen3-VL-Plus", "tags": ["多模态"]},
        "Qwen3-Flash": {"name": "Qwen3-Flash", "speed": "fast"},
        "Qwen3-Omni-Flash": {"name": "Qwen3-Omni-Flash", "tags": ["多模态"]},
    }
    return models.get(model, {"name": model})


def format_intent(intent: str) -> str:
    """格式化意图识别结果

    Args:
        intent: 意图字符串

    Returns:
        格式化后的文本
    """
    if not intent:
        return ""

    intent_map = {
        "闲聊-日常对话": "💬 日常对话",
        "知识问答": "📚 知识问答",
        "信息查询": "🔍 信息查询",
        "创作写作": "✍️ 创作写作",
        "代码编程": "💻 代码编程",
        "数学计算": "🔢 数学计算",
        "翻译": "🌐 翻译",
    }

    return intent_map.get(intent, f"🎯 {intent}")
