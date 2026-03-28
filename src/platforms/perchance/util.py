"""Perchance 工具函数"""

from typing import Dict, List, Tuple


def parse_size(size: str) -> Tuple[int, int]:
    """解析尺寸字符串

    Args:
        size: 尺寸字符串（如 "512x768"）

    Returns:
        Tuple[int, int]: (宽度, 高度)
    """
    try:
        width, height = map(int, size.lower().split("x"))
        return width, height
    except ValueError:
        return 512, 768


def get_default_negative_prompt() -> str:
    """获取默认负向提示词

    Returns:
        str: 默认负向提示词
    """
    return (
        "low quality, blurry, distorted, ugly, bad anatomy, "
        "bad proportions, cropped, worst quality, low quality, "
        "jpeg artifacts, signature, watermark, text, error"
    )


def format_prompt_for_portrait(
    description: str,
    style: str = "realistic",
    quality: str = "high",
) -> str:
    """格式化人像提示词

    Args:
        description: 人物描述
        style: 风格（realistic/anime/artistic）
        quality: 质量（high/medium/low）

    Returns:
        str: 格式化的提示词
    """
    quality_modifiers = {
        "high": "8k uhd, highly detailed, sharp focus, professional photography",
        "medium": "detailed, good quality",
        "low": "simple, basic quality",
    }

    style_modifiers = {
        "realistic": "RAW photo, realistic, photorealistic",
        "anime": "anime style, manga, illustration",
        "artistic": "artistic, painting, digital art",
    }

    quality_tag = quality_modifiers.get(quality, quality_modifiers["high"])
    style_tag = style_modifiers.get(style, style_modifiers["realistic"])

    return f"{description}, {style_tag}, {quality_tag}"
