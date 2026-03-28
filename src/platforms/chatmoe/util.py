"""ChatMoe 工具"""

from __future__ import annotations

import uuid
from typing import Any, Dict, List

CHATMOE_URL = "https://chatmoe.cn/api/chat"

HEADERS = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "authorization": "sk-chatmoe",
    "content-type": "application/json",
    "origin": "https://chatmoe.cn",
    "referer": "https://chatmoe.cn/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="141","Not?A_Brand";v="8","Chromium";v="141"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
}


def build_payload(messages: List[Dict], thinking: bool, search: bool) -> Dict[str, Any]:
    return {
        "stream": True,
        "user_id": str(uuid.uuid4()),
        "tools": [
            {
                "type": "web_search",
                "web_search": {
                    "search_engine": "search_std",
                    "enable": search,
                    "search_intent": True,
                },
            }
        ],
        "thinking": {"type": "enabled" if thinking else "disabled"},
        "messages": [
            {"role": m.get("role", "user"), "content": m.get("content", "")}
            for m in messages
        ],
        "type": "text",
        "style": "default",
        "provider": "chatmoe_z",
    }
