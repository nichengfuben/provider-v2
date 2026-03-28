"""RaphaelAI 平台适配器

RaphaelAI (raphaelai.org) 是一个免费的AI图像生成平台。

API 端点:
- 图像生成: POST https://api.raphaelai.org/v1/image/jobs
- 轮询状态: GET https://api.raphaelai.org/v1/jobs/{jobId}
"""

from src.platforms.raphaelai.adapter import RaphaelAIAdapter

__all__ = ["RaphaelAIAdapter"]
