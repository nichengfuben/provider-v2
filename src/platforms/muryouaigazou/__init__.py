"""MuryouAigazou 平台适配器

MuryouAigazou (muryou-aigazou.com) 是一个免费的AI图像生成平台（日语）。

API 端点:
- 图像生成: POST https://muryou-aigazou.com/api/v2/images/tasks
- 轮询状态: GET https://muryou-aigazou.com/api/v2/images/tasks/{taskId}
"""

from src.platforms.muryouaigazou.adapter import MuryouAigazouAdapter

__all__ = ["MuryouAigazouAdapter"]
