"""AI Speaker 平台适配器

AI Speaker (ai-speaker.net) 是一个免费的在线文字转语音工具，
支持100多种语言和600多种AI声音，基于 Microsoft Azure Edge TTS 引擎。

特点:
- 免费使用，无需注册
- 支持多种语言和方言
- 支持语音风格（情感）调整
- 支持语速、音调、音量调节
- 输出 MP3 格式

网站: https://ai-speaker.net/
"""

from __future__ import annotations

import logging
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的语音（常用中文和英文语音）
SPEAKERS = [
    "晓晓",      # 中文女声 (zh-CN-XiaoxiaoNeural) - 推荐
    "云扬",      # 中文男声 (zh-CN-YunyangNeural)
    "晓伊",      # 中文女声 (zh-CN-XiaoyiNeural)
    "云希",      # 中文男声 (zh-CN-YunxiNeural)
    "晓萱",      # 中文女声 (zh-CN-XiaoxuanNeural)
    "云野",      # 中文男声 (zh-CN-YunyeNeural)
    "Jenny",    # 英文女声 (en-US-JennyNeural)
    "Guy",      # 英文男声 (en-US-GuyNeural)
    "Aria",     # 英文女声 (en-US-AriaNeural)
]

# 平台能力
CAPS = {
    "chat": False,
    "tts": True,
    "stream": False,
    "tools": False,
    "multi_voice": True,
}


class AispeakerAdapter(PlatformAdapter):
    """AI Speaker 平台适配器

    提供文本转语音 (TTS) 服务，基于免费的 Edge TTS 引擎。
    无需认证即可使用，支持多种语音和风格。

    使用示例:
        adapter = AispeakerAdapter()
        await adapter.init(session)

        # 合成语音
        async for audio_chunk in adapter.text_to_speech(
            candidate=None,
            text="你好，这是一段测试文本",
            model="晓晓",
            voice="晓晓",
            speed=1.0,
            pitch=1.0,
            volume=100,
        ):
            # audio_chunk 是音频数据
            pass
    """

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "aispeaker"

    @property
    def supported_models(self) -> List[str]:
        """返回支持的语音列表作为模型"""
        return SPEAKERS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器"""
        from src.platforms.aispeaker.client import AispeakerClient

        self._client = AispeakerClient()
        await self._client.init(session)
        logger.info("AI Speaker 适配器初始化完成，已加载 %d 个语音", len(self._client.speakers))

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
        """聊天补全（AI Speaker 不支持）"""
        raise NotImplementedError(
            "AI Speaker 不支持聊天补全，请使用 text_to_speech 方法"
        )

    async def text_to_speech(
        self,
        candidate: Candidate,
        text: str,
        model: str,
        *,
        voice: str = "晓晓",
        response_format: str = "mp3",
        speed: float = 1.0,
        pitch: float = 1.0,
        volume: int = 100,
        style: str = "",
        **kw: Any,
    ) -> AsyncGenerator[bytes, None]:
        """文本转语音

        AI Speaker 使用 Edge TTS 引擎，支持多种语言和语音。

        Args:
            candidate: 候选项（TTS 不使用）
            text: 要转换的文本
            model: 语音模型名称
            voice: 语音名称（默认：晓晓 中文女声）
            response_format: 输出格式（固定为 mp3）
            speed: 语速（0.5-3.0，默认 1.0）
            pitch: 音调（0.5-3.0，默认 1.0）
            volume: 音量（0-100，默认 100）
            style: 风格/情感（如友好、悲伤、温柔等）

        Yields:
            bytes: 音频数据（一次性返回完整数据）
        """
        if not self._client:
            raise RuntimeError("AI Speaker 客户端未初始化")

        if not text.strip():
            raise ValueError("文本不能为空")

        # 获取语音ID
        speaker_name = voice or model
        speaker_id = self._get_speaker_id(speaker_name)

        # 获取风格ID
        style_id = self._get_style_id(speaker_name, style)

        audio_data, metadata = await self._client.text_to_speech(
            text=text,
            speaker_id=speaker_id,
            rate=speed,
            pitch=pitch,
            volume=volume,
            style_id=style_id,
        )

        logger.info(
            "AI Speaker TTS 完成: 文本长度 %d, 语音 %s, 时长约 %.1fs",
            metadata.get("text_length", 0),
            speaker_name,
            metadata.get("text_length", 0) / 10  # 粗略估算
        )

        yield audio_data

    def _get_speaker_id(self, name: str) -> int:
        """根据语音名称获取ID

        Args:
            name: 语音名称（如 "晓晓", "Jenny"）

        Returns:
            int: 语音ID
        """
        if not self._client:
            return 423  # 默认：晓晓

        # 精确匹配
        for speaker in self._client.speakers:
            if speaker.get("name") == name:
                return speaker.get("id", 423)

        # 模糊匹配
        name_lower = name.lower()
        for speaker in self._client.speakers:
            speaker_name = speaker.get("name", "").lower()
            if name_lower in speaker_name or speaker_name in name_lower:
                return speaker.get("id", 423)

        # 根据语言推测
        if "zh" in name_lower or "中文" in name_lower or "晓" in name or "云" in name:
            return 423  # 晓晓
        elif "en" in name_lower or "english" in name_lower:
            return 430  # Jenny

        return 423  # 默认：晓晓

    def _get_style_id(self, speaker_name: str, style: str) -> int:
        """获取风格ID

        Args:
            speaker_name: 语音名称
            style: 风格名称（如友好、悲伤）

        Returns:
            int: 风格ID（0=默认）
        """
        if not style:
            return 0

        # 风格名称到ID的映射（需要根据实际API响应确定）
        style_map = {
            "默认": 0,
            "友好": 134,
            "诗歌朗诵": 133,
            "严厉": 132,
            "悲伤": 131,
            "抒情": 130,
            "温柔": 129,
            "害怕": 128,
            "不满": 127,
            "愉快": 126,
            "平静": 125,
            "愤怒": 124,
            "撒娇": 123,
            "新闻广播": 122,
            "客服": 121,
        }

        return style_map.get(style, 0)

    async def close(self) -> None:
        """释放资源"""
        if self._client:
            await self._client.close()
            self._client = None
