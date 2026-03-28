"""文件工具"""

from __future__ import annotations

import base64
import hashlib
import mimetypes
import os
import re
import time
import uuid
from pathlib import Path
from typing import Dict, Optional, Tuple

__all__ = ["FileUtil"]

_URI_RE = re.compile(
    r"^data:(?P<mime>[\w/+.\-]+)(?:;[^,]*)?(?P<data>,.+)$", re.DOTALL
)
_EXT: Dict[str, str] = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".json": "application/json",
    ".py": "text/x-python",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
}


class FileUtil:
    """文件操作工具集，提供 MIME 类型判断、Data URI 处理等功能"""

    @staticmethod
    def mime(name: str) -> str:
        """根据文件名推断 MIME 类型

        Args:
            name: 文件名或路径

        Returns:
            MIME 类型字符串，默认为 application/octet-stream
        """
        ext = os.path.splitext(name)[1].lower()
        return (
            _EXT.get(ext)
            or mimetypes.guess_type(name)[0]
            or "application/octet-stream"
        )

    @staticmethod
    def is_url(p: str) -> bool:
        """判断字符串是否为 HTTP(S) URL

        Args:
            p: 待检查字符串

        Returns:
            True 表示为 HTTP(S) URL
        """
        return p.startswith(("http://", "https://"))

    @staticmethod
    def is_data_uri(d: str) -> bool:
        """判断字符串是否为 base64 编码的 data URI

        Args:
            d: 待检查字符串

        Returns:
            True 表示为 data URI 格式
        """
        return isinstance(d, str) and d.startswith("data:") and ";base64" in d

    @staticmethod
    def parse_data_uri(uri: str) -> Optional[Tuple[str, bytes]]:
        """解析 data URI 为 (mime_type, bytes)

        Args:
            uri: data URI 字符串

        Returns:
            解析成功返回 (MIME 类型, 字节数据) 元组，否则返回 None
        """
        if not FileUtil.is_data_uri(uri):
            return None
        try:
            m = _URI_RE.match(uri)
            if not m:
                return None
            b64 = (
                m.group("data")
                .strip()
                .replace("\n", "")
                .replace("\r", "")
                .replace(" ", "")
            )
            if b64.startswith(","):
                b64 = b64[1:]
            pad = 4 - len(b64) % 4
            if pad != 4:
                b64 += "=" * pad
            return m.group("mime"), base64.b64decode(b64)
        except Exception:
            return None

    @staticmethod
    def to_data_uri(data: bytes, mime_type: str) -> str:
        """将字节数据编码为 data URI

        Args:
            data: 原始字节数据
            mime_type: MIME 类型

        Returns:
            data URI 字符串
        """
        b64 = base64.b64encode(data).decode("ascii")
        return f"data:{mime_type};base64,{b64}"

    @staticmethod
    def save_data_uri(uri: str, directory: str = "data/uploads") -> Optional[str]:
        """将 data URI 解码并保存为文件

        Args:
            uri: data URI 字符串
            directory: 保存目录，使用跨平台路径

        Returns:
            保存成功返回文件路径，否则返回 None
        """
        r = FileUtil.parse_data_uri(uri)
        if not r:
            return None
        mime_type, data = r
        save_dir = Path(directory)
        save_dir.mkdir(parents=True, exist_ok=True)
        ext = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
            "application/pdf": ".pdf",
            "audio/mpeg": ".mp3",
            "audio/wav": ".wav",
            "audio/ogg": ".ogg",
            "video/mp4": ".mp4",
        }.get(mime_type, ".bin")
        fp = save_dir / f"{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}{ext}"
        fp.write_bytes(data)
        return str(fp)

    @staticmethod
    def cleanup(path: str) -> None:
        """安全删除文件，不存在或出错时忽略

        Args:
            path: 文件路径
        """
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass

    @staticmethod
    def md5(path: str) -> str:
        """计算文件 MD5 哈希值

        Args:
            path: 文件路径

        Returns:
            MD5 哈希十六进制字符串

        Raises:
            FileNotFoundError: 文件不存在
            IOError: 读取文件失败
        """
        h = hashlib.md5()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return h.hexdigest()
