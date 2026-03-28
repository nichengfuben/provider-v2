"""SpeechGen.io API 客户端

实现与 SpeechGen.io TTS API 的通信。

API 文档: https://speechgen.io/zh/node/api/

使用方式:
1. 短文本 (≤2000字符): POST /api/text - 立即返回结果
2. 长文本 (≤1,000,000字符): POST /api/longtext 创建任务，POST /api/result 获取结果
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple

import aiohttp

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://speechgen.io"
API_VOICES = "/index.php?r=api/voices"
API_TEXT = "/index.php?r=api/text"           # 短文本，≤2000字符
API_LONGTEXT = "/index.php?r=api/longtext"   # 长文本，≤1,000,000字符
API_RESULT = "/index.php?r=api/result"       # 获取任务结果

# 状态码
STATUS_PROCESSING = 0
STATUS_SUCCESS = 1
STATUS_ERROR = -1

# 默认配置
DEFAULT_FORMAT = "mp3"
DEFAULT_SPEED = 1.0
DEFAULT_PITCH = 0
DEFAULT_EMOTION = "good"
DEFAULT_PAUSE_SENTENCE = 300
DEFAULT_PAUSE_PARAGRAPH = 400
DEFAULT_BITRATE = 48000

# 支持的格式
SUPPORTED_FORMATS = ["mp3", "wav", "ogg", "flac", "m4a", "opus"]

# 支持的情感
SUPPORTED_EMOTIONS = ["good", "evil", "neutral"]


class SpeechgenClient:
    """SpeechGen.io API 客户端

    封装与 SpeechGen.io TTS API 的所有交互。
    需要有效的 API Token 和 Email 进行认证。

    使用前请确保:
    1. 已在 SpeechGen.io 注册账号
    2. 账号已充值（API 仅在充值后可用）
    3. 从个人资料页面获取 API Token
    """

    def __init__(
        self,
        token: Optional[str] = None,
        email: Optional[str] = None,
    ) -> None:
        """初始化客户端

        Args:
            token: SpeechGen.io API Token（从个人资料页面获取）
            email: SpeechGen.io 账号邮箱
        """
        self._session: Optional[aiohttp.ClientSession] = None
        self._token = token
        self._email = email
        self._voices: List[Dict[str, Any]] = []

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session

        # 尝试从环境变量获取认证信息
        if not self._token or not self._email:
            import os
            self._token = self._token or os.environ.get("SPEECHGEN_TOKEN", "")
            self._email = self._email or os.environ.get("SPEECHGEN_EMAIL", "")

        # 加载语音列表
        if self._token and self._email:
            try:
                await self._load_voices()
                logger.info("SpeechGen 客户端初始化完成，已加载 %d 个语音", len(self._voices))
            except Exception as e:
                logger.warning("加载语音列表失败: %s，使用默认语音列表", e)
                self._load_default_voices()
        else:
            logger.info("SpeechGen Token/Email 未配置，使用默认语音列表")
            self._load_default_voices()

    def _load_default_voices(self) -> None:
        """加载默认语音列表"""
        self._voices = [
            {"voice": "Achernar CN", "lang": "zh-CN", "sex": "female", "type": "Chirp3-HD"},
            {"voice": "Zephyr CN", "lang": "zh-CN", "sex": "male", "type": "Chirp3-HD"},
            {"voice": "Glow CN", "lang": "zh-CN", "sex": "female", "type": "Chirp3-HD"},
            {"voice": "Sulafat CN", "lang": "zh-CN", "sex": "male", "type": "Chirp3-HD"},
            {"voice": "John", "lang": "en-US", "sex": "male", "type": "standard"},
            {"voice": "Mary", "lang": "en-US", "sex": "female", "type": "standard"},
            {"voice": "Charon EN", "lang": "en-US", "sex": "male", "type": "Chirp3-HD"},
            {"voice": "Enceladus EN", "lang": "en-US", "sex": "female", "type": "Chirp3-HD"},
        ]

    async def _load_voices(self) -> None:
        """从 API 加载可用语音列表"""
        if not self._session:
            return

        url = f"{API_BASE_URL}{API_VOICES}"

        params = {
            "token": self._token,
            "email": self._email,
        }

        try:
            async with self._session.get(
                url,
                params=params,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if isinstance(data, list):
                        self._voices = data
                    elif isinstance(data, dict) and "voices" in data:
                        self._voices = data["voices"]
        except Exception as e:
            logger.error("获取语音列表失败: %s", e)
            raise

    @property
    def voices(self) -> List[Dict[str, Any]]:
        """返回可用语音列表"""
        return self._voices

    async def text_to_speech(
        self,
        text: str,
        voice: str = "Achernar CN",
        format: str = DEFAULT_FORMAT,
        speed: float = DEFAULT_SPEED,
        pitch: float = DEFAULT_PITCH,
        emotion: str = DEFAULT_EMOTION,
        pause_sentence: int = DEFAULT_PAUSE_SENTENCE,
        pause_paragraph: int = DEFAULT_PAUSE_PARAGRAPH,
        bitrate: int = DEFAULT_BITRATE,
        **kw: Any,
    ) -> Tuple[bytes, Dict[str, Any]]:
        """将文本转换为语音

        自动选择 API:
        - 文本 ≤ 2000 字符: 使用快速 API (api/text)
        - 文本 > 2000 字符: 使用长文本 API (api/longtext + api/result)

        Args:
            text: 要转换的文本
            voice: 语音名称（如 "Achernar CN", "John"）
            format: 输出格式（mp3/wav/ogg/flac/m4a/opus）
            speed: 语速（0.1-2.0）
            pitch: 音调（-20 到 20）
            emotion: 情感（good/evil/neutral）
            pause_sentence: 句子间停顿（毫秒）
            pause_paragraph: 段落间停顿（毫秒）
            bitrate: 比特率（8000-192000 Hz）

        Returns:
            Tuple[bytes, Dict]: (音频数据, 元数据)

        Raises:
            RuntimeError: API Token/Email 未配置
            ValueError: 参数无效
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        if not self._token or not self._email:
            raise RuntimeError(
                "SpeechGen API Token/Email 未配置。"
                "请设置环境变量 SPEECHGEN_TOKEN 和 SPEECHGEN_EMAIL，"
                "或在 config.toml 中配置。\n"
                "获取 Token: https://speechgen.io/zh/enter/"
            )

        if not text.strip():
            raise ValueError("文本不能为空")

        # 参数验证和规范化
        if format not in SUPPORTED_FORMATS:
            logger.warning("不支持的格式 %s，使用默认格式 mp3", format)
            format = DEFAULT_FORMAT

        speed = max(0.1, min(2.0, speed))
        pitch = max(-20, min(20, pitch))
        bitrate = max(8000, min(192000, bitrate))

        if emotion not in SUPPORTED_EMOTIONS:
            emotion = DEFAULT_EMOTION

        # 构建请求参数
        data = {
            "token": self._token,
            "email": self._email,
            "voice": voice,
            "text": text,
            "format": format,
            "speed": speed,
            "pitch": pitch,
            "emotion": emotion,
            "pause_sentence": pause_sentence,
            "pause_paragraph": pause_paragraph,
            "bitrate": bitrate,
        }

        # 根据文本长度选择 API
        text_length = len(text)
        if text_length <= 2000:
            # 短文本：快速 API
            return await self._short_text_to_speech(data)
        else:
            # 长文本：异步 API
            return await self._long_text_to_speech(data)

    async def _short_text_to_speech(
        self, data: Dict[str, Any]
    ) -> Tuple[bytes, Dict[str, Any]]:
        """短文本转语音（≤2000字符）

        使用 api/text 端点，立即返回结果。

        Args:
            data: API 请求参数

        Returns:
            Tuple[bytes, Dict]: (音频数据, 元数据)
        """
        url = f"{API_BASE_URL}{API_TEXT}"

        try:
            async with self._session.post(
                url,
                data=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as response:
                result = await response.json()

                status = result.get("status")

                if status == STATUS_ERROR:
                    error_msg = result.get("error", "未知错误")
                    raise RuntimeError(f"SpeechGen API 错误: {error_msg}")

                if status == STATUS_SUCCESS:
                    # 下载音频文件
                    file_url = result.get("file", "")
                    if not file_url:
                        raise RuntimeError("API 响应中没有音频文件 URL")

                    audio_data = await self._download_audio(file_url)

                    metadata = {
                        "id": result.get("id"),
                        "duration": result.get("duration", 0),
                        "format": result.get("format"),
                        "cost": result.get("cost", "0"),
                        "balance": result.get("balans", "0"),
                    }

                    return audio_data, metadata

                # status == 0 表示处理中，短文本 API 不应该返回这个状态
                raise RuntimeError(f"SpeechGen API 返回意外状态: {status}")

        except aiohttp.ClientError as e:
            logger.error("SpeechGen API 请求失败: %s", e)
            raise RuntimeError(f"SpeechGen API 请求失败: {e}")

    async def _long_text_to_speech(
        self, data: Dict[str, Any]
    ) -> Tuple[bytes, Dict[str, Any]]:
        """长文本转语音（≤1,000,000字符）

        使用 api/longtext 创建任务，api/result 获取结果。

        Args:
            data: API 请求参数

        Returns:
            Tuple[bytes, Dict]: (音频数据, 元数据)
        """
        # 步骤1: 创建任务
        create_url = f"{API_BASE_URL}{API_LONGTEXT}"

        async with self._session.post(
            create_url,
            data=data,
            timeout=aiohttp.ClientTimeout(total=30),
        ) as response:
            result = await response.json()

        status = result.get("status")
        if status == STATUS_ERROR:
            error_msg = result.get("error", "未知错误")
            raise RuntimeError(f"SpeechGen API 创建任务失败: {error_msg}")

        task_id = result.get("id")
        if not task_id:
            raise RuntimeError("API 未返回任务 ID")

        logger.info("SpeechGen 任务已创建，ID: %s", task_id)

        # 步骤2: 轮询获取结果
        result_url = f"{API_BASE_URL}{API_RESULT}"
        result_data = {
            "token": self._token,
            "email": self._email,
            "id": task_id,
        }

        max_attempts = 60  # 最多等待 10 分钟
        interval = 10  # 每 10 秒查询一次

        for attempt in range(max_attempts):
            await asyncio.sleep(interval)

            async with self._session.post(
                result_url,
                data=result_data,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                result = await response.json()

            status = result.get("status")

            if status == STATUS_SUCCESS:
                # 完成
                file_url = result.get("file", "")
                if not file_url:
                    raise RuntimeError("API 响应中没有音频文件 URL")

                audio_data = await self._download_audio(file_url)

                metadata = {
                    "id": result.get("id"),
                    "duration": result.get("duration", 0),
                    "format": result.get("format"),
                    "cost": result.get("cost", "0"),
                    "balance": result.get("balans", "0"),
                    "parts": result.get("parts", 0),
                    "parts_done": result.get("parts_done", 0),
                }

                return audio_data, metadata

            if status == STATUS_ERROR:
                error_msg = result.get("error", "未知错误")
                raise RuntimeError(f"SpeechGen API 任务失败: {error_msg}")

            # status == 0 表示处理中
            parts = result.get("parts", 0)
            parts_done = result.get("parts_done", 0)
            logger.info(
                "SpeechGen 任务 %s 处理中: %d/%d 片段",
                task_id, parts_done, parts
            )

        raise RuntimeError("SpeechGen API 任务超时")

    async def _download_audio(self, url: str) -> bytes:
        """下载音频文件

        Args:
            url: 音频文件 URL

        Returns:
            bytes: 音频数据
        """
        async with self._session.get(
            url,
            timeout=aiohttp.ClientTimeout(total=300),
        ) as response:
            if response.status != 200:
                raise RuntimeError(f"下载音频失败: HTTP {response.status}")
            return await response.read()

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
