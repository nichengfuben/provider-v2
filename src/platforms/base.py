"""平台适配器抽象基类

所有平台适配器必须继承此基类并实现对应方法。
不支持的服务方法应保持默认的 raise UnsupportedServiceError。
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate
from src.core.errors import UnsupportedServiceError

__all__ = ["PlatformAdapter"]
logger = logging.getLogger(__name__)


class PlatformAdapter(ABC):
    """平台适配器抽象基类

    每个平台至少实现 name / supported_models / default_capabilities / init /
    candidates / complete 这些核心方法。

    其余服务方法（embed / text_to_speech / speech_to_text / generate_image /
    moderate）有默认实现会抛出 UnsupportedServiceError，
    平台按需覆盖即可。
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """平台唯一标识"""

    @property
    @abstractmethod
    def supported_models(self) -> List[str]:
        """当前可用模型列表"""

    @property
    @abstractmethod
    def default_capabilities(self) -> Dict[str, bool]:
        """平台级默认能力"""

    @abstractmethod
    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化（创建客户端、发现资源等）"""

    @abstractmethod
    async def candidates(self) -> List[Candidate]:
        """返回当前可用候选项"""

    @abstractmethod
    async def ensure_candidates(self, count: int) -> int:
        """确保至少有 count 个候选项"""

    @abstractmethod
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
        """文本生成 / Chat Completion

        Yields:
            str: 文本片段
            dict: 元数据（如 {"usage": {...}}、{"thinking": "..."}）
        """
        # 确保子类实现为异步生成器
        yield  # pragma: no cover

    async def embed(
        self,
        candidate: Candidate,
        input_data: Union[str, List[str]],
        model: str,
    ) -> Dict[str, Any]:
        """嵌入向量计算

        Args:
            candidate: 选中的候选项
            input_data: 单个或多个文本
            model: 模型名

        Returns:
            OpenAI 兼容的 embedding 响应：
            {
                "object": "list",
                "data": [{"object": "embedding", "index": 0, "embedding": [...]}],
                "model": "...",
                "usage": {"prompt_tokens": N, "total_tokens": N}
            }
        """
        raise UnsupportedServiceError(f"{self.name} 不支持 embedding")

    async def text_to_speech(
        self,
        candidate: Candidate,
        text: str,
        model: str,
        *,
        voice: str = "alloy",
        response_format: str = "mp3",
        speed: float = 1.0,
    ) -> AsyncGenerator[bytes, None]:
        """文本转语音

        Yields:
            bytes: 音频数据块
        """
        raise UnsupportedServiceError(f"{self.name} 不支持 TTS")
        yield  # pragma: no cover

    async def speech_to_text(
        self,
        candidate: Candidate,
        audio_data: bytes,
        model: str,
        *,
        language: Optional[str] = None,
        response_format: str = "json",
    ) -> Dict[str, Any]:
        """语音转文本

        Returns:
            {"text": "转录文本", ...}
        """
        raise UnsupportedServiceError(f"{self.name} 不支持 STT")

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        n: int = 1,
        size: str = "1024x1024",
        response_format: str = "url",
        quality: str = "standard",
        style: str = "vivid",
    ) -> Dict[str, Any]:
        """图像生成

        Returns:
            OpenAI 兼容的 images 响应：
            {
                "created": timestamp,
                "data": [{"url": "..."} or {"b64_json": "..."}]
            }
        """
        raise UnsupportedServiceError(f"{self.name} 不支持图像生成")

    async def moderate(
        self,
        candidate: Candidate,
        input_data: Union[str, List[str]],
        model: str,
    ) -> Dict[str, Any]:
        """内容审核

        Returns:
            OpenAI 兼容的 moderation 响应
        """
        raise UnsupportedServiceError(f"{self.name} 不支持内容审核")

    @abstractmethod
    async def close(self) -> None:
        """释放资源"""
