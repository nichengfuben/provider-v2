"""AI Speaker 平台工具函数"""

from __future__ import annotations

from typing import Dict, List, Optional


# 语音信息缓存
VOICE_CACHE: Dict[str, Dict] = {}

# 语言到语音的映射
LANG_VOICE_MAP = {
    "zh-CN": ["晓晓", "云扬", "晓伊", "云希", "晓萱", "云野"],
    "zh-TW": ["晓晓", "云扬"],
    "en-US": ["Jenny", "Guy", "Aria"],
    "en-GB": ["Jenny", "Guy"],
    "ja-JP": ["Nanami", "Keita"],
    "ko-KR": ["SunHi", "InJoon"],
}

# 语音性别映射
VOICE_GENDER_MAP = {
    "晓晓": "female",
    "云扬": "male",
    "晓伊": "female",
    "云希": "male",
    "晓萱": "female",
    "云野": "male",
    "晓悠": "female",
    "Jenny": "female",
    "Guy": "male",
    "Aria": "female",
}

# Azure TTS语音代码映射
AZURE_VOICE_CODE_MAP = {
    "晓晓": "zh-CN-XiaoxiaoNeural",
    "云扬": "zh-CN-YunyangNeural",
    "晓伊": "zh-CN-XiaoyiNeural",
    "云希": "zh-CN-YunxiNeural",
    "晓萱": "zh-CN-XiaoxuanNeural",
    "云野": "zh-CN-YunyeNeural",
    "晓悠": "zh-CN-XiaoyouNeural",
    "Jenny": "en-US-JennyNeural",
    "Guy": "en-US-GuyNeural",
    "Aria": "en-US-AriaNeural",
}

# 语音风格映射
VOICE_STYLE_MAP = {
    "晓晓": ["默认", "友好", "诗歌朗诵", "严厉", "悲伤", "抒情", "温柔", "愉快", "平静", "愤怒", "客服"],
    "云扬": ["默认", "新闻广播", "客服"],
    "晓伊": ["默认", "友好", "温柔", "愉快"],
    "云希": ["默认", "新闻广播", "诗歌朗诵"],
}


def get_voice_by_language(lang: str, gender: Optional[str] = None) -> str:
    """根据语言和性别获取推荐语音

    Args:
        lang: 语言代码（如 zh-CN, en-US）
        gender: 性别偏好（male/female）

    Returns:
        str: 推荐的语音名称
    """
    voices = LANG_VOICE_MAP.get(lang, LANG_VOICE_MAP.get("zh-CN", []))

    if not voices:
        return "晓晓"

    if gender:
        for voice in voices:
            if VOICE_GENDER_MAP.get(voice) == gender:
                return voice

    return voices[0]


def get_azure_voice_code(name: str) -> str:
    """获取Azure TTS语音代码

    Args:
        name: 语音名称

    Returns:
        str: Azure语音代码
    """
    return AZURE_VOICE_CODE_MAP.get(name, "zh-CN-XiaoxiaoNeural")


def get_available_styles(voice_name: str) -> List[str]:
    """获取语音支持的风格列表

    Args:
        voice_name: 语音名称

    Returns:
        List[str]: 风格列表
    """
    return VOICE_STYLE_MAP.get(voice_name, ["默认"])


def validate_text_length(text: str, max_length: int = 5000) -> bool:
    """验证文本长度

    Args:
        text: 要验证的文本
        max_length: 最大长度限制

    Returns:
        bool: 是否在限制范围内
    """
    return len(text) <= max_length


def split_text_by_length(text: str, max_length: int = 2000) -> List[str]:
    """按长度分割文本

    用于处理超长文本，将其分割成多个部分。

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


def estimate_duration(text: str, rate: float = 1.0) -> float:
    """估算音频时长

    根据文本长度和语速估算生成的音频时长。

    Args:
        text: 文本内容
        rate: 语速（0.5-3.0）

    Returns:
        float: 估算的时长（秒）
    """
    char_count = len(text)

    # 中文约 3-4 字符/秒，英文约 2.5 单词/秒
    # 使用综合估算：约 10 字符/秒（正常语速）
    base_rate = 10

    # 调整语速
    actual_rate = base_rate * rate

    # 估算时长
    duration = char_count / actual_rate

    return max(1.0, duration)


def format_ssml(text: str, voice_code: str = "zh-CN-XiaoxiaoNeural",
                rate: float = 1.0, pitch: float = 1.0) -> str:
    """生成SSML格式文本

    Args:
        text: 要转换的文本
        voice_code: Azure语音代码
        rate: 语速
        pitch: 音调

    Returns:
        str: SSML格式文本
    """
    # 转换为SSML格式
    rate_str = f"{int(rate * 100 - 100):+d}%"  # -50% to +200%
    pitch_str = f"{int(pitch * 100 - 100):+d}%"  # -50% to +200%

    ssml = f'''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
    <voice name="{voice_code}">
        <prosody rate="{rate_str}" pitch="{pitch_str}">
            {text}
        </prosody>
    </voice>
</speak>'''

    return ssml


def format_response(
    audio_data: bytes,
    format: str = "mp3",
    voice: str = "",
    duration: float = 0.0,
    text_length: int = 0,
) -> Dict:
    """格式化响应

    Args:
        audio_data: 音频数据
        format: 音频格式
        voice: 使用的语音
        duration: 音频时长
        text_length: 文本长度

    Returns:
        Dict: 格式化的响应数据
    """
    return {
        "format": format,
        "voice": voice,
        "duration": duration,
        "size": len(audio_data),
        "text_length": text_length,
        "data": audio_data,
    }
