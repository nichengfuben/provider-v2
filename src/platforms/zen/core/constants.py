from __future__ import annotations

from typing import Dict, List

BASE_URL: str = "https://opencode.ai/zen/v1"
CHAT_PATH: str = "/chat/completions"
MODELS_PATH: str = "/models"

RATE_LIMIT_COOLDOWN: int = 30
RECOVERY_INTERVAL: int = 60

MODELS: List[str] = [
    "gpt-4o-mini-free",
    "gpt-4o-free",
    "claude-3-5-sonnet-free",
    "claude-3-5-haiku-free",
    "gemini-2.0-flash-free",
    "gemini-2.5-flash-free",
    "deepseek-r1-free",
    "deepseek-v3-free",
    "qwen-2.5-72b-free",
    "llama-3.3-70b-free",
]

CAPS: Dict[str, bool] = {
    "chat": True,
    "vision": True,
    "tools": True,
    "thinking": True,
    "search": False,
}

FETCH_MODELS_ENABLED: bool = True
MODEL_FETCH_INTERVAL: int = 86400

FILTER_PAID_MODELS: bool = False
