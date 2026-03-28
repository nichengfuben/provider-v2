"""Akash Network 平台适配器

Akash Network (chat.akash.network) 是一个去中心化的AI聊天平台，
提供多种开源模型如 DeepSeek-V3.2, Qwen3, Llama 3.3 等。

API 端点: https://chat.akash.network/api/
"""

from src.platforms.akash.adapter import AkashAdapter

__all__ = ["AkashAdapter"]
