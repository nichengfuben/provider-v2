"""NoteGPT 平台适配器

NoteGPT (notegpt.io) 是一个AI服务集合平台，支持图像生成。

API 端点:
- 开始生成: POST https://notegpt.io/api/v2/images/start
- 查询状态: GET https://notegpt.io/api/v2/images/status
"""

from src.platforms.notegpt.adapter import NoteGPTAdapter

__all__ = ["NoteGPTAdapter"]
