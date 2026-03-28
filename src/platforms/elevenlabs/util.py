"""ElevenLabs 工具函数"""

from typing import Dict, List


def get_voice_id_by_name(voice_name: str, voices: List[Dict]) -> str:
    """根据语音名称获取语音ID

    Args:
        voice_name: 语音名称
        voices: 语音列表

    Returns:
        str: 语音ID，如果未找到返回默认值
    """
    for voice in voices:
        if voice.get("name", "").lower() == voice_name.lower():
            return voice.get("voice_id", "")
    return "21m00Tcm4TlvDq8ikWAM"  # Rachel


def format_duration(seconds: float) -> str:
    """格式化时长

    Args:
        seconds: 秒数

    Returns:
        str: 格式化的时长字符串
    """
    if seconds < 60:
        return f"{seconds:.1f}s"
    minutes = int(seconds // 60)
    secs = seconds % 60
    return f"{minutes}m {secs:.1f}s"


def estimate_characters(text: str) -> int:
    """估算字符数（用于计费）

    Args:
        text: 文本

    Returns:
        int: 字符数
    """
    return len(text)
