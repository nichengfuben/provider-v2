"""ElevenLabs API 客户端

实现与 ElevenLabs API 的通信。

API 文档: https://elevenlabs.io/docs/api-reference

使用方式:
1. TTS (文本转语音): POST /v1/text-to-speech/{voice_id}
2. Sound Generation (音效生成): POST /v1/sound-generation
3. Voices (语音列表): GET /v1/voices
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://api.elevenlabs.io"
API_TTS = "/v1/text-to-speech"          # 文本转语音
API_SOUND_GEN = "/v1/sound-generation"  # 音效生成
API_VOICES = "/v1/voices"               # 语音列表
API_MODELS = "/v1/models"               # 模型列表

# 默认配置
DEFAULT_MODEL = "eleven_monolingual_v1"
DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"  # Rachel
DEFAULT_STABILITY = 0.5
DEFAULT_SIMILARITY_BOOST = 0.75
DEFAULT_STYLE = 0.0
DEFAULT_USE_SPEAKER_BOOST = True

# 支持的输出格式
SUPPORTED_FORMATS = ["mp3", "pcm", "ulaw", "alaw", "ogg", "flac", "wav"]


class ElevenLabsClient:
    """ElevenLabs API 客户端

    封装与 ElevenLabs API 的所有交互。
    需要有效的 API Key 进行认证。

    使用前请确保:
    1. 已在 ElevenLabs 注册账号: https://elevenlabs.io/
    2. 从个人资料页面获取 API Key
    """

    def __init__(self, api_key: Optional[str] = None) -> None:
        """初始化客户端

        Args:
            api_key: ElevenLabs API Key（从个人资料页面获取）
        """
        self._session: Optional[aiohttp.ClientSession] = None
        self._api_key = api_key
        self._voices: List[Dict[str, Any]] = []
        self._models: List[Dict[str, Any]] = []

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session

        # 尝试从环境变量获取认证信息
        if not self._api_key:
            import os
            self._api_key = os.environ.get("ELEVENLABS_API_KEY", "")

        # 加载语音列表
        if self._api_key:
            try:
                await self._load_voices()
                await self._load_models()
                logger.info(
                    "ElevenLabs 客户端初始化完成，已加载 %d 个语音, %d 个模型",
                    len(self._voices), len(self._models)
                )
            except Exception as e:
                logger.warning("加载语音/模型列表失败: %s，使用默认列表", e)
                self._load_default_voices()
                self._load_default_models()
        else:
            logger.info("ElevenLabs API Key 未配置，使用默认语音/模型列表")
            self._load_default_voices()
            self._load_default_models()

    def _load_default_voices(self) -> None:
        """加载默认语音列表"""
        self._voices = [
            {"voice_id": "21m00Tcm4TlvDq8ikWAM", "name": "Rachel", "labels": {"accent": "american", "gender": "female"}},
            {"voice_id": "AZnzlk1XvdvUeBnXmlld", "name": "Domi", "labels": {"accent": "american", "gender": "female"}},
            {"voice_id": "EXAVITQu4vr4xnSDxMaL", "name": "Bella", "labels": {"accent": "american", "gender": "female"}},
            {"voice_id": "ErXwobaYiN019PkySvjV", "name": "Antoni", "labels": {"accent": "american", "gender": "male"}},
            {"voice_id": "MF3mGyEYCl7XYWbV9V6O", "name": "Elli", "labels": {"accent": "american", "gender": "female"}},
            {"voice_id": "TxGEqnHWrfWFTfGW9XjX", "name": "Josh", "labels": {"accent": "american", "gender": "male"}},
            {"voice_id": "VR6AewLTigWG4xSOukaG", "name": "Arnold", "labels": {"accent": "american", "gender": "male"}},
            {"voice_id": "pNInz6obpgDQGcFmaJgB", "name": "Adam", "labels": {"accent": "american", "gender": "male"}},
            {"voice_id": "yoZ06aMxZJJ28mfd3POQ", "name": "Sam", "labels": {"accent": "american", "gender": "male"}},
        ]

    def _load_default_models(self) -> None:
        """加载默认模型列表"""
        self._models = [
            {"model_id": "eleven_monolingual_v1", "name": "Monolingual v1", "can_do_text_to_speech": True},
            {"model_id": "eleven_multilingual_v1", "name": "Multilingual v1", "can_do_text_to_speech": True},
            {"model_id": "eleven_multilingual_v2", "name": "Multilingual v2", "can_do_text_to_speech": True},
            {"model_id": "eleven_turbo_v2", "name": "Turbo v2", "can_do_text_to_speech": True},
            {"model_id": "eleven_turbo_v2_5", "name": "Turbo v2.5", "can_do_text_to_speech": True},
        ]

    async def _load_voices(self) -> None:
        """从 API 加载可用语音列表"""
        if not self._session or not self._api_key:
            return

        url = f"{API_BASE_URL}{API_VOICES}"
        headers = {"xi-api-key": self._api_key}

        try:
            async with self._session.get(
                url,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self._voices = data.get("voices", [])
        except Exception as e:
            logger.error("获取语音列表失败: %s", e)
            raise

    async def _load_models(self) -> None:
        """从 API 加载可用模型列表"""
        if not self._session or not self._api_key:
            return

        url = f"{API_BASE_URL}{API_MODELS}"
        headers = {"xi-api-key": self._api_key}

        try:
            async with self._session.get(
                url,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self._models = data
        except Exception as e:
            logger.error("获取模型列表失败: %s", e)
            raise

    @property
    def voices(self) -> List[Dict[str, Any]]:
        """返回可用语音列表"""
        return self._voices

    @property
    def models(self) -> List[Dict[str, Any]]:
        """返回可用模型列表"""
        return self._models

    async def text_to_speech(
        self,
        text: str,
        voice_id: str = DEFAULT_VOICE,
        model_id: str = DEFAULT_MODEL,
        stability: float = DEFAULT_STABILITY,
        similarity_boost: float = DEFAULT_SIMILARITY_BOOST,
        style: float = DEFAULT_STYLE,
        use_speaker_boost: bool = DEFAULT_USE_SPEAKER_BOOST,
        output_format: str = "mp3",
        **kw: Any,
    ) -> bytes:
        """将文本转换为语音

        Args:
            text: 要转换的文本
            voice_id: 语音ID（如 "21m00Tcm4TlvDq8ikWAM"）
            model_id: 模型ID（如 "eleven_multilingual_v2"）
            stability: 稳定性（0-1，越高越稳定）
            similarity_boost: 相似度增强（0-1）
            style: 风格强度（0-1）
            use_speaker_boost: 是否使用扬声器增强
            output_format: 输出格式（mp3/pcm/ulaw/alaw/ogg/flac/wav）

        Returns:
            bytes: 音频数据

        Raises:
            RuntimeError: API Key 未配置
            ValueError: 参数无效
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        if not self._api_key:
            raise RuntimeError(
                "ElevenLabs API Key 未配置。"
                "请设置环境变量 ELEVENLABS_API_KEY，"
                "或在 config.toml 中配置。\n"
                "获取 API Key: https://elevenlabs.io/app/settings/api-keys"
            )

        if not text.strip():
            raise ValueError("文本不能为空")

        url = f"{API_BASE_URL}{API_TTS}/{voice_id}"

        headers = {
            "xi-api-key": self._api_key,
            "Content-Type": "application/json",
        }

        if output_format != "mp3":
            headers["Accept"] = f"audio/{output_format}"

        payload = {
            "text": text,
            "model_id": model_id,
            "voice_settings": {
                "stability": stability,
                "similarity_boost": similarity_boost,
                "style": style,
                "use_speaker_boost": use_speaker_boost,
            },
        }

        try:
            async with self._session.post(
                url,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"ElevenLabs API 错误 ({response.status}): {error_text}")

                return await response.read()

        except aiohttp.ClientError as e:
            logger.error("ElevenLabs API 请求失败: %s", e)
            raise RuntimeError(f"ElevenLabs API 请求失败: {e}")

    async def generate_sound(
        self,
        text: str,
        duration_seconds: Optional[float] = None,
        prompt_influence: float = 0.3,
        output_format: str = "mp3",
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成音效

        根据文本描述生成音效。

        Args:
            text: 音效描述（如 "explosion", "rain falling"）
            duration_seconds: 音效时长（秒），None 表示自动
            prompt_influence: 提示词影响力（0-1）
            output_format: 输出格式

        Returns:
            Dict: 包含音频数据的响应
            {
                "audio_base64": "...",
                "duration": 1.0,
                "content_type": "audio/mp3",
            }

        Raises:
            RuntimeError: API Key 未配置
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        if not self._api_key:
            raise RuntimeError(
                "ElevenLabs API Key 未配置。"
                "请设置环境变量 ELEVENLABS_API_KEY。"
            )

        url = f"{API_BASE_URL}{API_SOUND_GEN}"

        headers = {
            "xi-api-key": self._api_key,
            "Content-Type": "application/json",
        }

        payload = {
            "text": text,
            "generation_settings": {
                "duration_seconds": duration_seconds,
                "prompt_influence": prompt_influence,
            },
            "output_format": output_format,
        }

        try:
            async with self._session.post(
                url,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"ElevenLabs Sound API 错误 ({response.status}): {error_text}")

                data = await response.json()

                # 解析响应
                result = {
                    "audio_base64": data.get("audio_base64", ""),
                    "duration": data.get("duration", 0),
                    "content_type": f"audio/{output_format}",
                }

                return result

        except aiohttp.ClientError as e:
            logger.error("ElevenLabs Sound API 请求失败: %s", e)
            raise RuntimeError(f"ElevenLabs Sound API 请求失败: {e}")

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
