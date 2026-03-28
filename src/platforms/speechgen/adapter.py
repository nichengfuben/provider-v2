"""SpeechGen 平台适配器

SpeechGen.io 是一个在线文本转语音服务，提供 5000+ 高仿真语音，
支持 150 种语言，输出格式包括 MP3、WAV、OGG、FLAC 等。

API 文档: https://speechgen.io/zh/node/api/
支持字符数: 短文本 ≤2000，长文本 ≤1,000,000
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的语音（常用）
VOICES = [
    "Achernar CN",      # 中文女声 (Chirp3-HD)
    "Zephyr CN",        # 中文男声
    "Glow CN",          # 中文女声
    "Sulafat CN",       # 中文男声
    "Erzulie CN",       # 中文女声
    "Algenib CN",       # 中文男声
    "John",             # 英文男声
    "Mary",             # 英文女声
    "Charon EN",        # 英文男声 (Chirp3-HD)
    "Enceladus EN",     # 英文女声 (Chirp3-HD)
]

# 支持的输出格式
FORMATS = ["mp3", "wav", "ogg", "flac", "m4a", "opus"]

# 平台能力
CAPS = {
    "chat": False,
    "tts": True,
    "stream": False,
    "tools": False,
    "multi_voice": True,
}


class SpeechgenAdapter(PlatformAdapter):
    """SpeechGen.io 平台适配器

    提供文本转语音 (TTS) 服务，支持多种语言和语音。
    需要在配置中设置 API Token 和 Email。

    使用前请确保:
    1. 已在 SpeechGen.io 注册账号: https://speechgen.io/zh/enter/
    2. 账号已充值（API 仅在充值后可用）
    3. 从个人资料页面获取 API Token

    配置方式:
    - 环境变量: SPEECHGEN_TOKEN, SPEECHGEN_EMAIL
    - 或在 config.toml 中配置 [speechgen] 段
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "speechgen"

    @property
    def supported_models(self) -> List[str]:
        """返回支持的语音列表作为模型"""
        return VOICES

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.speechgen.client import SpeechgenClient

        self._client = SpeechgenClient()
        await self._client.init(session)
        logger.info("SpeechGen 适配器初始化完成")

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
        """聊天补全（SpeechGen 不支持）"""
        raise NotImplementedError(
            "SpeechGen 不支持聊天补全，请使用 text_to_speech 方法"
        )

    async def text_to_speech(
        self,
        candidate: Candidate,
        text: str,
        model: str,
        *,
        voice: str = "Achernar CN",
        response_format: str = "mp3",
        speed: float = 1.0,
        pitch: float = 0.0,
        emotion: str = "good",
        pause_sentence: int = 300,
        pause_paragraph: int = 400,
        bitrate: int = 48000,
        **kw: Any,
    ) -> AsyncGenerator[bytes, None]:
        """文本转语音

        支持文本长度:
        - 短文本 (≤2000字符): 立即返回结果
        - 长文本 (≤1,000,000字符): 异步处理，自动等待结果

        Args:
            candidate: 候选项（TTS 不使用）
            text: 要转换的文本
            model: 语音模型名称
            voice: 语音名称（默认：Achernar CN 中文女声）
            response_format: 输出格式（mp3/wav/ogg/flac/m4a/opus）
            speed: 语速（0.1-2.0，默认 1.0）
            pitch: 音调（-20 到 20，默认 0）
            emotion: 情感（good/evil/neutral，默认 good）
            pause_sentence: 句子间停顿（毫秒，默认 300）
            pause_paragraph: 段落间停顿（毫秒，默认 400）
            bitrate: 比特率（8000-192000 Hz，默认 48000）

        Yields:
            bytes: 音频数据（一次性返回完整数据）
        """
        if not self._client:
            raise RuntimeError("SpeechGen 客户端未初始化")

        audio_data, metadata = await self._client.text_to_speech(
            text=text,
            voice=voice or model,
            format=response_format,
            speed=speed,
            pitch=pitch,
            emotion=emotion,
            pause_sentence=pause_sentence,
            pause_paragraph=pause_paragraph,
            bitrate=bitrate,
        )

        logger.info(
            "SpeechGen TTS 完成: 时长 %.1fs, 费用 %s",
            float(metadata.get("duration", 0)),
            metadata.get("cost", "0")
        )

        yield audio_data

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
