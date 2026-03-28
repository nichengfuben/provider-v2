"""SpeechGen 平台工具函数"""

from __future__ import annotations

from typing import Dict, List, Optional


# 语音信息缓存
VOICE_CACHE: Dict[str, Dict] = {}

# 语言到语音的映射
LANG_VOICE_MAP = {
    "zh-CN": ["Achernar CN", "Zephyr CN", "Glow CN", "Sulafat CN"],
    "zh-TW": ["Achernar CN", "Zephyr CN"],
    "en-US": ["John", "Mary", "Charon EN", "Enceladus EN", "Fenrir EN", "Aoede EN"],
    "en-GB": ["John", "Mary", "Charon EN", "Enceladus EN"],
    "ja-JP": ["Japanese voices"],
    "ko-KR": ["Korean voices"],
    "fr-FR": ["French voices"],
    "de-DE": ["German voices"],
    "es-ES": ["Spanish voices"],
}

# 语音性别映射
VOICE_GENDER_MAP = {
    "Achernar CN": "female",
    "Zephyr CN": "male",
    "Glow CN": "female",
    "Sulafat CN": "male",
    "Erzulie CN": "female",
    "Algenib CN": "male",
    "John": "male",
    "Mary": "female",
    "Charon EN": "male",
    "Enceladus EN": "female",
    "Fenrir EN": "male",
    "Aoede EN": "female",
}

# 情感支持（并非所有语音都支持）
SUPPORTED_EMOTIONS = ["good", "evil", "neutral"]

# 支持的格式
SUPPORTED_FORMATS = ["mp3", "wav", "ogg", "flac", "m4a", "opus"]


def get_voice_by_language(lang: str, gender: Optional[str] = None) -> str:
    """根据语言和性别获取推荐语音

    Args:
        lang: 语言代码（如 zh-CN, en-US）
        gender: 性别偏好（male/female）

    Returns:
        str: 推荐的语音名称
    """
    voices = LANG_VOICE_MAP.get(lang, LANG_VOICE_MAP.get("en-US", []))

    if not voices:
        return "Achernar CN"

    if gender:
        for voice in voices:
            if VOICE_GENDER_MAP.get(voice) == gender:
                return voice

    return voices[0]


def parse_ssml(text: str) -> str:
    """解析 SSML 标签

    SpeechGen 支持部分 SSML 标签，如 <break time="2000ms">

    Args:
        text: 可能包含 SSML 的文本

    Returns:
        str: 处理后的文本
    """
    import re

    # SpeechGen 支持自定义标签
    # <break time="2000ms"> - 停顿
    # <pause> - 插入按钮停顿

    # 保留 break 标签，SpeechGen 支持
    # 但移除其他不支持的标签

    text = re.sub(r"<speak>|</speak>", "", text)
    text = re.sub(r"<emphasis[^>]*>(.*?)</emphasis>", r"\1", text)
    text = re.sub(r"<prosody[^>]*>(.*?)</prosody>", r"\1", text)

    return text.strip()


def validate_text_length(text: str) -> tuple[bool, str]:
    """验证文本长度

    Args:
        text: 要验证的文本

    Returns:
        tuple[bool, str]: (是否有效, 推荐的 API 类型)
    """
    length = len(text)

    if length == 0:
        return False, "empty"

    if length <= 2000:
        return True, "short"  # 使用 api/text

    if length <= 1_000_000:
        return True, "long"  # 使用 api/longtext

    return False, "too_long"


def split_text_by_length(text: str, max_length: int = 2000) -> List[str]:
    """按长度分割文本

    用于处理超长文本，将其分割成多个部分。
    注意：SpeechGen 长文本 API 支持最多 1,000,000 字符，
    通常不需要手动分割。

    Args:
        text: 要分割的文本
        max_length: 每段最大长度

    Returns:
        List[str]: 分割后的文本列表
    """
    if len(text) <= max_length:
        return [text]

    chunks = []
    current_chunk = ""

    # 按句子分割
    sentences = text.replace("。", "。\n").replace("！", "！\n").replace("？", "？\n").split("\n")

    for sentence in sentences:
        if not sentence.strip():
            continue

        if len(current_chunk) + len(sentence) <= max_length:
            current_chunk += sentence
        else:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = sentence

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def estimate_duration(text: str, speed: float = 1.0) -> float:
    """估算音频时长

    根据文本长度和语速估算生成的音频时长。

    Args:
        text: 文本内容
        speed: 语速（0.1-2.0）

    Returns:
        float: 估算的时长（秒）
    """
    char_count = len(text)

    # 中文约 3-4 字符/秒，英文约 2.5 单词/秒
    # 使用综合估算：约 10 字符/秒（正常语速）
    base_rate = 10

    # 调整语速
    actual_rate = base_rate * speed

    # 估算时长
    duration = char_count / actual_rate

    return max(1.0, duration)


def estimate_cost(char_count: int, voice_type: str = "standard") -> float:
    """估算费用

    SpeechGen 费用约为 $0.08 / 1000 字符

    Args:
        char_count: 字符数
        voice_type: 语音类型（standard/hd）

    Returns:
        float: 估算费用（美元）
    """
    base_cost = 0.08 / 1000  # $0.08 per 1000 chars

    # HD 语音费用可能更高
    multiplier = 1.0
    if "HD" in voice_type.upper() or "Chirp3" in voice_type:
        multiplier = 2.0

    return char_count * base_cost * multiplier


def format_response(
    audio_data: bytes,
    format: str = "mp3",
    voice: str = "",
    duration: float = 0.0,
    cost: str = "0",
) -> Dict:
    """格式化响应

    Args:
        audio_data: 音频数据
        format: 音频格式
        voice: 使用的语音
        duration: 音频时长
        cost: 费用

    Returns:
        Dict: 格式化的响应数据
    """
    return {
        "format": format,
        "voice": voice,
        "duration": duration,
        "size": len(audio_data),
        "cost": cost,
        "data": audio_data,
    }
