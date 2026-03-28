"""AIFreeForever 平台适配器

AIFreeForever (aifreeforever.com) 是一个免费的AI服务集合。
支持图像生成和聊天功能。

API 端点:
- 图像生成: https://aifreeforever.com/api/generate-image
- 提示词增强: https://aifreeforever.com/api/generate-ai-image-prompt
"""

from src.platforms.aifreeforever.adapter import AIFreeForeverAdapter

__all__ = ["AIFreeForeverAdapter"]
