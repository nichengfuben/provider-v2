"""SkyFortress 平台适配器

SkyFortress (skyfortress.dev) 是一个免费的AI图像生成平台。

API 端点: POST https://skyfortress.dev/api/generate-image
"""

from src.platforms.skyfortress.adapter import SkyFortressAdapter

__all__ = ["SkyFortressAdapter"]
