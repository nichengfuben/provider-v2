"""BaiduAI Search (百度AI搜索) 平台工具函数"""

from typing import Dict, List, Any
import json


def parse_baidu_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """解析百度AI搜索 API 响应

    Args:
        data: 原始响应数据

    Returns:
        解析后的响应字典
    """
    result = {
        "type": "unknown",
        "content": "",
        "intent": "",
        "done": False,
    }

    status = data.get("status", -1)
    if status != 0:
        result["error"] = f"API status error: {status}"
        return result

    messages = data.get("messages", [])
    for msg in messages:
        mime_type = msg.get("mime_type", "")
        content = msg.get("content", "")
        meta_data = msg.get("meta_data", {})

        if mime_type == "signal/post":
            result["type"] = "intent"
            result["intent"] = meta_data.get("intent_content", "")

        elif mime_type == "multi_load/iframe":
            result["type"] = "content"
            result["content"] += content

        elif mime_type == "text/plain":
            result["type"] = "content"
            result["content"] += content

    result["done"] = data.get("done", False) or data.get("is_end", False)

    return result


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
        "深度搜索": "🔬 深度搜索",
        "创作写作": "✍️ 创作写作",
        "代码编程": "💻 代码编程",
    }

    return intent_map.get(intent, f"🎯 {intent}")


def build_query_payload(query: str, model: str = "smartMode", **kwargs) -> Dict[str, Any]:
    """构建百度AI搜索请求体

    Args:
        query: 用户查询
        model: 模型名称
        **kwargs: 其他参数

    Returns:
        请求体字典
    """
    return {
        "query": [
            {
                "type": "TEXT",
                "data": {
                    "text": {
                        "query": query
                    }
                }
            }
        ],
        "usedModel": {
            "modelName": model,
            "modelFunction": {
                "deepThink": "1" if kwargs.get("deep_think") else "0",
                "quickSwitch": "0",
                "deepSearch": "1" if kwargs.get("deep_search") else "0"
            }
        },
        "stream": kwargs.get("stream", True),
    }
