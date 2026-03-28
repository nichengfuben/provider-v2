"""DangBei AI 客户端

当贝AI目前不提供公开API，此文件保留用于未来API可能的开放。

网页端地址：https://ai.dangbei.com
"""

from typing import Dict, List

# 平台信息
PLATFORM_INFO = {
    "name": "当贝AI",
    "website": "https://ai.dangbei.com",
    "api_available": False,
    "models": [
        "DeepSeek-R1 671B",
        "豆包 (Doubao)",
        "通义千问 (Qwen)",
        "智谱 (GLM)",
    ],
    "features": [
        "免费使用",
        "无需注册",
        "不限量",
        "多模型聚合",
    ],
}

MODELS: List[str] = []
CAPS: Dict[str, bool] = {}


class DangBeiClient:
    """DangBei AI 客户端（暂未实现）

    该平台目前不提供公开API。
    """

    def __init__(self) -> None:
        pass

    @property
    def models(self) -> List[str]:
        return MODELS.copy()

    @property
    def capabilities(self) -> Dict[str, bool]:
        return CAPS.copy()
