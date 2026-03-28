"""RyRob AI 平台适配器

RyRob (api.ryrob.com) 是一个多模型AI服务平台。
支持多种主流模型，包括GPT-5、Gemini、Qwen等。

API 端点:
- 模型列表: https://api.ryrob.com/api/models
- 渲染: https://api.ryrob.com/api/render
"""

from src.platforms.ryrob.adapter import RyRobAdapter

__all__ = ["RyRobAdapter"]
