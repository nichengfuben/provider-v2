"""PixPark 平台适配器

PixPark (pixpark.ai) 是一个AI图像生成平台。

API 端点:
- 创建任务: POST https://pixpark.ai/api/app/tasks
- 查询任务: GET https://pixpark.ai/api/app/tasks
"""

from src.platforms.pixpark.adapter import PixParkAdapter

__all__ = ["PixParkAdapter"]
