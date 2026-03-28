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
    """文件工具集"""

    @staticmethod
    def mime(name: str) -> str:
        """根据文件名推断 MIME 类型"""
        ext = os.path.splitext(name)[1].lower()
        return (
            _EXT.get(ext)
            or mimetypes.guess_type(name)[0]
            or "application/octet-stream"
        )

    @staticmethod
    def is_url(p: str) -> bool:
        """判断是否为 HTTP(S) URL"""
        return p.startswith(("http://", "https://"))

    @staticmethod
    def is_data_uri(d: str) -> bool:
        """判断是否为 data URI"""
        return isinstance(d, str) and d.startswith("data:") and ";base64" in d

    @staticmethod
    def parse_data_uri(uri: str) -> Optional[Tuple[str, bytes]]:
        """解析 data URI 为 (mime_type, bytes)"""
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
            # 去掉开头逗号
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
        """将 bytes 编码为 data URI"""
        b64 = base64.b64encode(data).decode("ascii")
        return f"data:{mime_type};base64,{b64}"

    @staticmethod
    def save_data_uri(uri: str, directory: str = "data/uploads") -> Optional[str]:
        """将 data URI 保存为文件，返回文件路径"""
        r = FileUtil.parse_data_uri(uri)
        if not r:
            return None
        mime_type, data = r
        Path(directory).mkdir(parents=True, exist_ok=True)
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
        fp = Path(directory) / f"{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}{ext}"
        fp.write_bytes(data)
        return str(fp)

    @staticmethod
    def cleanup(path: str) -> None:
        """安全删除文件"""
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass

    @staticmethod
    def md5(path: str) -> str:
        """计算文件 MD5"""
        h = hashlib.md5()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return h.hexdigest()
