"""AIImageToImage 平台适配器

AIImageToImage (aiimagetoimage.io) 是一个AI图像转换平台。
支持图生图功能。

API 端点:
- 图生图: POST https://api.aiimagetoimage.io/api/img2img/image-generate
- 获取结果: GET https://api.aiimagetoimage.io/api/result/get
"""

from src.platforms.aiimagetoimage.adapter import AIImageToImageAdapter

__all__ = ["AIImageToImageAdapter"]
