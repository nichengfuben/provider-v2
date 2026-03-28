"""统一错误层级"""

from __future__ import annotations

__all__ = [
    "ProviderError",
    "PlatformError",
    "NoCandidateError",
    "AuthError",
    "UploadError",
    "PoWError",
    "UnsupportedServiceError",
    "EmbeddingError",
    "TTSError",
    "STTError",
    "ImageGenError",
    "VideoGenError",
    "ModerationError",
]


class ProviderError(Exception):
    """网关基础异常"""

    def __init__(self, message: str, original: Exception | None = None) -> None:
        super().__init__(message)
        self.original = original


class PlatformError(ProviderError):
    """平台级异常"""


class NoCandidateError(ProviderError):
    """无可用候选项"""


class AuthError(PlatformError):
    """认证失败"""


class UploadError(PlatformError):
    """文件上传失败"""


class PoWError(PlatformError):
    """PoW 计算失败"""


class UnsupportedServiceError(ProviderError):
    """平台不支持该服务类型"""


class EmbeddingError(PlatformError):
    """嵌入计算失败"""


class TTSError(PlatformError):
    """文本转语音失败"""


class STTError(PlatformError):
    """语音转文本失败"""


class ImageGenError(PlatformError):
    """图像生成失败"""


class VideoGenError(PlatformError):
    """视频生成失败"""


class ModerationError(PlatformError):
    """内容审核失败"""
