"""Akash Network 工具函数"""

from typing import List

# 聊天模型列表
CHAT_MODELS = [
    "DeepSeek-V3.2",
    "Qwen/Qwen3-30B-A3B",
    "Meta-Llama-3-3-70B-Instruct",
]

# 图像生成模型
IMAGE_MODELS = [
    "AkashGen",
]

# 所有支持的模型
ALL_MODELS = CHAT_MODELS + IMAGE_MODELS


def is_chat_model(model: str) -> bool:
    """检查是否为聊天模型"""
    return model in CHAT_MODELS


def is_image_model(model: str) -> bool:
    """检查是否为图像生成模型"""
    return model in IMAGE_MODELS


def get_model_display_name(model: str) -> str:
    """获取模型显示名称"""
    display_names = {
        "DeepSeek-V3.2": "DeepSeek V3.2",
        "Qwen/Qwen3-30B-A3B": "Qwen3 30B A3B",
        "Meta-Llama-3-3-70B-Instruct": "Llama 3.3 70B",
        "AkashGen": "AkashGen",
    }
    return display_names.get(model, model)
