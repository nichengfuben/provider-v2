"""AI Speaker API 客户端

实现与 ai-speaker.net TTS API 的通信。
该服务基于 Microsoft Azure Edge TTS 引擎。

API 端点:
- /api/speaker/getTypeToken - 获取访问Token
- /api/project/partEdit - 编辑/合成语音
- /api/project/getVoiceFile - 获取生成的音频文件
"""

from __future__ import annotations

import asyncio
import base64
import logging
import time
from typing import Any, Dict, List, Optional, Tuple

import aiohttp

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://ai-speaker.net"
API_GET_TOKEN = "/api/speaker/getTypeToken"
API_PART_EDIT = "/api/project/partEdit"
API_GET_VOICE = "/api/project/getVoiceFile"
API_SPEAKER_LIST = "/api/speaker/list"

# 默认配置
DEFAULT_RATE = 1.0
DEFAULT_PITCH = 1.0
DEFAULT_VOLUME = 100

# 语音类型
SPEAKER_TYPE_EDGE_ONLINE = 0  # Edge在线TTS
SPEAKER_TYPE_EDGE_LOCAL = 1   # Edge本地TTS

# 状态码
STATUS_SUCCESS = 1
STATUS_ERROR = 0
STATUS_PROCESSING = 2


class AispeakerClient:
    """AI Speaker API 客户端

    封装与 ai-speaker.net TTS API 的所有交互。
    基于免费的 Edge TTS 引擎，无需认证即可使用。
    """

    def __init__(self) -> None:
        """初始化客户端"""
        self._session: Optional[aiohttp.ClientSession] = None
        self._token: Optional[str] = None
        self._token_expired: Optional[str] = None
        self._version: Optional[str] = None
        self._speakers: List[Dict[str, Any]] = []
        self._speaker_map: Dict[int, Dict[str, Any]] = {}

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session

        # 获取Token
        try:
            await self._get_type_token()
            logger.info("AI Speaker 客户端初始化完成，Token: %s...", self._token[:20] if self._token else "None")
        except Exception as e:
            logger.warning("获取 AI Speaker Token 失败: %s", e)

        # 加载默认语音列表
        self._load_default_speakers()

    async def _get_type_token(self) -> str:
        """获取访问Token

        Returns:
            str: 访问Token
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_GET_TOKEN}"

        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status != 200:
                    raise RuntimeError(f"获取Token失败: HTTP {response.status}")

                result = await response.json()

                if result.get("status") != STATUS_SUCCESS:
                    raise RuntimeError(f"API返回错误: {result.get('info', '未知错误')}")

                self._token = result.get("token", "")
                self._token_expired = result.get("expired", "")
                self._version = result.get("version", "")

                return self._token

        except aiohttp.ClientError as e:
            logger.error("获取Token请求失败: %s", e)
            raise RuntimeError(f"获取Token请求失败: {e}")

    def _load_default_speakers(self) -> None:
        """加载默认语音列表

        基于API响应中的语音数据，提供常用语音。
        """
        self._speakers = [
            {
                "id": 423,
                "name": "晓晓",
                "code": "zh-CN-XiaoxiaoNeural",
                "locale": "zh-CN",
                "gender": 1,  # 女声
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["友好", "诗歌朗诵", "严厉", "悲伤", "抒情", "温柔", "愉快", "平静", "愤怒", "客服"],
            },
            {
                "id": 424,
                "name": "云扬",
                "code": "zh-CN-YunyangNeural",
                "locale": "zh-CN",
                "gender": 2,  # 男声
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["默认", "新闻广播", "客服"],
            },
            {
                "id": 425,
                "name": "晓伊",
                "code": "zh-CN-XiaoyiNeural",
                "locale": "zh-CN",
                "gender": 1,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["默认", "友好", "温柔", "愉快"],
            },
            {
                "id": 426,
                "name": "云希",
                "code": "zh-CN-YunxiNeural",
                "locale": "zh-CN",
                "gender": 2,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["默认", "新闻广播", "诗歌朗诵"],
            },
            {
                "id": 427,
                "name": "晓萱",
                "code": "zh-CN-XiaoxuanNeural",
                "locale": "zh-CN",
                "gender": 1,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["默认", "友好", "温柔"],
            },
            {
                "id": 428,
                "name": "云野",
                "code": "zh-CN-YunyeNeural",
                "locale": "zh-CN",
                "gender": 2,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["默认", "友好"],
            },
            {
                "id": 429,
                "name": "晓悠",
                "code": "zh-CN-XiaoyouNeural",
                "locale": "zh-CN",
                "gender": 1,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "中文",
                "styles": ["默认", "友好"],
            },
            {
                "id": 430,
                "name": "Jenny",
                "code": "en-US-JennyNeural",
                "locale": "en-US",
                "gender": 1,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "英语",
                "styles": ["默认", "友好", "客服"],
            },
            {
                "id": 431,
                "name": "Guy",
                "code": "en-US-GuyNeural",
                "locale": "en-US",
                "gender": 2,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "英语",
                "styles": ["默认", "新闻广播"],
            },
            {
                "id": 432,
                "name": "Aria",
                "code": "en-US-AriaNeural",
                "locale": "en-US",
                "gender": 1,
                "type": SPEAKER_TYPE_EDGE_ONLINE,
                "lang": "英语",
                "styles": ["默认", "友好", "客服"],
            },
        ]

        # 构建ID到语音的映射
        self._speaker_map = {s["id"]: s for s in self._speakers}

    @property
    def speakers(self) -> List[Dict[str, Any]]:
        """返回可用语音列表"""
        return self._speakers

    def get_speaker_by_id(self, speaker_id: int) -> Optional[Dict[str, Any]]:
        """根据ID获取语音信息

        Args:
            speaker_id: 语音ID

        Returns:
            Optional[Dict]: 语音信息
        """
        return self._speaker_map.get(speaker_id)

    def get_speaker_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        """根据Azure代码获取语音信息

        Args:
            code: Azure TTS语音代码 (如 zh-CN-XiaoxiaoNeural)

        Returns:
            Optional[Dict]: 语音信息
        """
        for speaker in self._speakers:
            if speaker.get("code") == code:
                return speaker
        return None

    async def text_to_speech(
        self,
        text: str,
        speaker_id: int = 423,
        rate: float = DEFAULT_RATE,
        pitch: float = DEFAULT_PITCH,
        volume: int = DEFAULT_VOLUME,
        style_id: int = 0,
        role_id: int = 0,
        **kw: Any,
    ) -> Tuple[bytes, Dict[str, Any]]:
        """将文本转换为语音

        Args:
            text: 要转换的文本
            speaker_id: 语音ID (默认: 423 晓晓)
            rate: 语速 (0.5-3.0)
            pitch: 音调 (0.5-3.0)
            volume: 音量 (0-100)
            style_id: 风格ID (0=默认)
            role_id: 角色ID (0=默认)

        Returns:
            Tuple[bytes, Dict]: (音频数据, 元数据)

        Raises:
            RuntimeError: API请求失败
            ValueError: 参数无效
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        if not text.strip():
            raise ValueError("文本不能为空")

        # 参数范围检查
        rate = max(0.5, min(3.0, rate))
        pitch = max(0.5, min(3.0, pitch))
        volume = max(0, min(100, volume))

        # 确保有Token
        if not self._token:
            await self._get_type_token()

        # 构建请求数据
        data = {
            "id": 0,  # 新建项目ID为0
            "text": text,
            "speaker_id": speaker_id,
            "speaker_type": SPEAKER_TYPE_EDGE_ONLINE,
            "rate": f"{rate:.2f}",
            "pitch": f"{pitch:.2f}",
            "volume": str(volume),
            "style_id": style_id,
            "role_id": role_id,
            "gen_subtitles": 0,
            "token": self._token,
        }

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }

        try:
            # 步骤1: 创建合成任务
            url = f"{API_BASE_URL}{API_PART_EDIT}"

            async with self._session.post(
                url,
                data=data,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=60),
            ) as response:
                if response.status != 200:
                    raise RuntimeError(f"API请求失败: HTTP {response.status}")

                result = await response.json()

            if result.get("status") != STATUS_SUCCESS:
                error_info = result.get("info", "未知错误")
                raise RuntimeError(f"API返回错误: {error_info}")

            part_id = result.get("id") or result.get("row", {}).get("id")
            if not part_id:
                raise RuntimeError("API未返回任务ID")

            logger.info("AI Speaker 任务已创建，ID: %s", part_id)

            # 步骤2: 获取音频文件
            # 等待一段时间让服务器处理
            await asyncio.sleep(1)

            audio_data = await self._get_voice_file(part_id)

            metadata = {
                "id": part_id,
                "speaker_id": speaker_id,
                "rate": rate,
                "pitch": pitch,
                "volume": volume,
                "text_length": len(text),
            }

            return audio_data, metadata

        except aiohttp.ClientError as e:
            logger.error("AI Speaker API 请求失败: %s", e)
            raise RuntimeError(f"AI Speaker API 请求失败: {e}")

    async def _get_voice_file(self, part_id: int) -> bytes:
        """获取生成的音频文件

        Args:
            part_id: 任务ID

        Returns:
            bytes: 音频数据
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_GET_VOICE}"

        params = {
            "id": part_id,
            "token": self._token,
        }

        # 重试机制
        max_retries = 10
        retry_interval = 1

        for attempt in range(max_retries):
            try:
                async with self._session.get(
                    url,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=60),
                ) as response:
                    content_type = response.headers.get("Content-Type", "")

                    if "audio" in content_type or "mpeg" in content_type:
                        # 直接返回音频数据
                        return await response.read()

                    if "json" in content_type:
                        result = await response.json()
                        status = result.get("status")
                        info = result.get("info", "")

                        if status == STATUS_PROCESSING or "处理中" in info:
                            # 还在处理中，等待后重试
                            logger.info("AI Speaker 任务 %s 处理中，等待重试 (%d/%d)",
                                       part_id, attempt + 1, max_retries)
                            await asyncio.sleep(retry_interval)
                            continue

                        if status == STATUS_SUCCESS:
                            # 检查是否有音频URL
                            file_url = result.get("file") or result.get("url")
                            if file_url:
                                return await self._download_audio(file_url)

                        raise RuntimeError(f"获取音频失败: {info}")

                    # 尝试作为音频数据读取
                    data = await response.read()
                    if len(data) > 1000:  # 音频文件通常大于1KB
                        return data

                    await asyncio.sleep(retry_interval)

            except aiohttp.ClientError as e:
                logger.warning("获取音频请求失败: %s，重试中...", e)
                await asyncio.sleep(retry_interval)

        raise RuntimeError("获取音频文件超时")

    async def _download_audio(self, url: str) -> bytes:
        """下载音频文件

        Args:
            url: 音频文件URL

        Returns:
            bytes: 音频数据
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        async with self._session.get(
            url,
            timeout=aiohttp.ClientTimeout(total=120),
        ) as response:
            if response.status != 200:
                raise RuntimeError(f"下载音频失败: HTTP {response.status}")
            return await response.read()

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
        self._token = None
