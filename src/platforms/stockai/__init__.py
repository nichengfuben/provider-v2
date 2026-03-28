"""StockAI 平台适配器

StockAI (free.stockai.trade) 是一个免费的AI聊天服务。
支持多种开源模型，包括搜索、翻译等功能。

API 端点:
- Chat: https://free.stockai.trade/api/chat
"""

from src.platforms.stockai.adapter import StockAIAdapter

__all__ = ["StockAIAdapter"]
