"""Perchance 平台适配器

Perchance 是一个免费的AI图像生成平台。
支持多种模型和参数配置。

API 端点:
- Generate: https://image-generation.perchance.org/api/generate
- Download: https://image-generation.perchance.org/api/downloadTemporaryImage
"""

from src.platforms.perchance.adapter import PerchanceAdapter

__all__ = ["PerchanceAdapter"]
