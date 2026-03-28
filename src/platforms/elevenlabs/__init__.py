"""ElevenLabs 平台适配器

ElevenLabs 是一个AI语音合成平台，提供高质量的文本转语音服务。
支持多种语音、语言和输出格式。

API 端点:
- TTS: https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
- Sound Effects: https://api.elevenlabs.io/v1/sound-generation
- Voices: https://api.elevenlabs.io/v1/voices
"""

from src.platforms.elevenlabs.adapter import ElevenLabsAdapter

__all__ = ["ElevenLabsAdapter"]
