"""AISpeaker 平台适配器

AI Speaker (ai-speaker.net) 是一个免费的在线文字转语音工具，
支持100多种语言和600多种AI声音，使用 Microsoft Azure Edge TTS 引擎。

网站: https://ai-speaker.net/
"""

from src.platforms.aispeaker.adapter import AispeakerAdapter

__all__ = ["AispeakerAdapter"]
