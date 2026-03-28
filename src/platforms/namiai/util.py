"""NamiAI (纳米AI) 平台工具函数"""

from typing import Dict, List, Any
import json


def parse_nami_event(event_type: str, data_str: str) -> Dict[str, Any]:
    """解析 NamiAI SSE 事件

    Args:
        event_type: 事件类型 (100/101/102等)
        data_str: 数据字符串

    Returns:
        解析后的事件字典
    """
    result = {
        "type": "unknown",
        "content": "",
        "done": False,
    }

    if event_type == "100":
        # 会话初始化
        if "CONVERSATIONID####" in data_str:
            conv_id = data_str.split("CONVERSATIONID####")[-1].strip()
            result["type"] = "conversation_init"
            result["conversation_id"] = conv_id

    elif event_type == "101":
        # 消息初始化
        if "MESSAGEID####" in data_str:
            msg_id = data_str.split("MESSAGEID####")[-1].strip()
            result["type"] = "message_init"
            result["message_id"] = msg_id

    elif event_type == "102":
        # AI代理事件
        try:
            data = json.loads(data_str)
            result.update(_parse_ai_agent_data(data))
        except json.JSONDecodeError:
            pass

    return result


def _parse_ai_agent_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """解析 AI 代理数据

    Args:
        data: 代理数据

    Returns:
        解析后的字典
    """
    result = {
        "type": "unknown",
        "content": "",
        "done": False,
    }

    if "agentThink" in data:
        think = data["agentThink"]
        result["type"] = "reasoning"
        result["content"] = think.get("content", "")
        result["status"] = think.get("status", "")

    elif "toolStatus" in data:
        tool = data["toolStatus"]
        result["type"] = "tool"
        result["content"] = tool.get("content", "")
        result["action"] = tool.get("action", "")
        result["done"] = tool.get("action") == "final"

    elif "agentSimpleResult" in data:
        res = data["agentSimpleResult"]
        result["type"] = "content"
        result["content"] = res.get("summary", "")
        result["done"] = True

    elif "agentStatus" in data:
        status = data["agentStatus"]
        result["type"] = "status"
        result["done"] = status.get("success", False)

    elif "content" in data:
        result["type"] = "content"
        result["content"] = data.get("content", "")
        result["done"] = data.get("done", False)

    return result


def format_tool_status(tool_data: Dict[str, Any]) -> str:
    """格式化工具状态信息

    Args:
        tool_data: 工具状态数据

    Returns:
        格式化后的文本
    """
    action = tool_data.get("action", "")
    content = tool_data.get("content", "")

    if action == "search":
        return f"\n🔍 正在搜索: {content}"
    elif action == "read":
        return f"\n📖 正在阅读: {content}"
    elif action == "analyze":
        return f"\n🔬 正在分析: {content}"
    else:
        return f"\n⚡ {content}" if content else ""
