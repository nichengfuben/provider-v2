"""ElevenLabs 平台适配器

ElevenLabs 是一个AI语音合成平台，提供高质量的文本转语音服务。
支持多种语音、语言和输出格式。

API 文档: https://elevenlabs.io/docs/api-reference
"""

from __future__ import annotations

import base64
import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的语音（常用）
VOICES = [
    "Rachel",      # 美式女声
    "Domi",        # 美式女声
    "Bella",       # 美式女声
    "Antoni",      # 美式男声
    "Elli",        # 美式女声
    "Josh",        # 美式男声
    "Arnold",      # 美式男声
    "Adam",        # 美式男声
    "Sam",         # 美式男声
]

# 支持的模型
MODELS = [
    "eleven_monolingual_v1",     # 单语种（英语）
    "eleven_multilingual_v1",    # 多语种
    "eleven_multilingual_v2",    # 多语种 v2
    "eleven_turbo_v2",           # 快速模型
    "eleven_turbo_v2_5",         # 快速模型 v2.5
]

# 支持的输出格式
FORMATS = ["mp3", "pcm", "ulaw", "alaw", "ogg", "flac", "wav"]

# 平台能力
CAPS = {
    "chat": False,
    "tts": True,
    "sound": True,
    "stream": False,
    "tools": False,
    "multi_voice": True,
}


class ElevenLabsAdapter(PlatformAdapter):
    """ElevenLabs 平台适配器

    提供文本转语音 (TTS) 和音效生成服务，支持多种语言和语音。
    需要在配置中设置 API Key。

    使用前请确保:
    1. 已在 ElevenLabs 注册账号: https://elevenlabs.io/
    2. 从个人资料页面获取 API Key

    配置方式:
    - 环境变量: ELEVENLABS_API_KEY
    - 或在 config.toml 中配置 [elevenlabs] 段
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "elevenlabs"

    @property
    def supported_models(self) -> List[str]:
        """返回支持的模型列表"""
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.elevenlabs.client import ElevenLabsClient

        self._client = ElevenLabsClient()
        await self._client.init(session)
        logger.info("ElevenLabs 适配器初始化完成")

    async def candidates(self) -> List[Candidate]:
        """返回可用候选项（TTS 服务不需要候选项）"""
        return []

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量（TTS 服务不需要）"""
        return 0

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """聊天补全（ElevenLabs 不支持）"""
        raise NotImplementedError(
            "ElevenLabs 不支持聊天补全，请使用 text_to_speech 方法"
        )

    async def text_to_speech(
        self,
        candidate: Candidate,
        text: str,
        model: str,
        *,
        voice: str = "Rachel",
        response_format: str = "mp3",
        stability: float = 0.5,
        similarity_boost: float = 0.75,
        style: float = 0.0,
        use_speaker_boost: bool = True,
        **kw: Any,
    ) -> AsyncGenerator[bytes, None]:
        """文本转语音

        Args:
            candidate: 候选项（TTS 不使用）
            text: 要转换的文本
            model: 模型名称（如 eleven_multilingual_v2）
            voice: 语音名称（默认：Rachel）
            response_format: 输出格式（mp3/pcm/ulaw/alaw/ogg/flac/wav）
            stability: 稳定性（0-1，越高越稳定）
            similarity_boost: 相似度增强（0-1）
            style: 风格强度（0-1）
            use_speaker_boost: 是否使用扬声器增强

        Yields:
            bytes: 音频数据（一次性返回完整数据）
        """
        if not self._client:
            raise RuntimeError("ElevenLabs 客户端未初始化")

        # 获取语音ID
        voice_id = self._get_voice_id(voice)

        audio_data = await self._client.text_to_speech(
            text=text,
            voice_id=voice_id,
            model_id=model or "eleven_multilingual_v2",
            stability=stability,
            similarity_boost=similarity_boost,
            style=style,
            use_speaker_boost=use_speaker_boost,
            output_format=response_format,
        )

        logger.info(
            "ElevenLabs TTS 完成: 语音 %s, 格式 %s, 大小 %d bytes",
            voice, response_format, len(audio_data)
        )

        yield audio_data

    async def generate_sound(
        self,
        candidate: Candidate,
        prompt: str,
        *,
        duration_seconds: float = None,
        prompt_influence: float = 0.3,
        response_format: str = "mp3",
        **kw: Any,
    ) -> AsyncGenerator[bytes, None]:
        """生成音效

        根据文本描述生成音效。

        Args:
            candidate: 候选项
            prompt: 音效描述（如 "explosion", "rain falling"）
            duration_seconds: 音效时长（秒），None 表示自动
            prompt_influence: 提示词影响力（0-1）
            response_format: 输出格式

        Yields:
            bytes: 音频数据
        """
        if not self._client:
            raise RuntimeError("ElevenLabs 客户端未初始化")

        result = await self._client.generate_sound(
            text=prompt,
            duration_seconds=duration_seconds,
            prompt_influence=prompt_influence,
            output_format=response_format,
        )

        audio_base64 = result.get("audio_base64", "")
        if audio_base64:
            audio_data = base64.b64decode(audio_base64)
            logger.info(
                "ElevenLabs Sound 生成完成: 时长 %.1fs, 大小 %d bytes",
                result.get("duration", 0), len(audio_data)
            )
            yield audio_data
        else:
            logger.warning("ElevenLabs Sound 生成返回空数据")

    def _get_voice_id(self, voice: str) -> str:
        """根据语音名称获取语音ID

        Args:
            voice: 语音名称或ID

        Returns:
            str: 语音ID
        """
        # 如果已经是语音ID格式（24字符），直接返回
        if len(voice) == 24 and voice.isalnum():
            return voice

        # 语音名称到ID的映射
        voice_map = {
            "Rachel": "21m00Tcm4TlvDq8ikWAM",
            "Domi": "AZnzlk1XvdvUeBnXmlld",
            "Bella": "EXAVITQu4vr4xnSDxMaL",
            "Antoni": "ErXwobaYiN019PkySvjV",
            "Elli": "MF3mGyEYCl7XYWbV9V6O",
            "Josh": "TxGEqnHWrfWFTfGW9XjX",
            "Arnold": "VR6AewLTigWG4xSOukaG",
            "Adam": "pNInz6obpgDQGcFmaJgB",
            "Sam": "yoZ06aMxZJJ28mfd3POQ",
        }

        return voice_map.get(voice, "21m00Tcm4TlvDq8ikWAM")  # 默认使用 Rachel

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
