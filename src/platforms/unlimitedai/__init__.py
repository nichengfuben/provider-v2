"""UnlimitedAI 平台适配器

UnlimitedAI (app.unlimitedai.chat) 是一个无限制的AI聊天服务。
支持NSFW内容，无需登录。

API 端点: https://app.unlimitedai.chat/api/chat
"""

from src.platforms.unlimitedai.adapter import UnlimitedAIAdapter

__all__ = ["UnlimitedAIAdapter"]
