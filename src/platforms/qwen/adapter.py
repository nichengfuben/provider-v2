# Qwen 平台适配器
from __future__ import annotations

import asyncio
import logging
import time
from pathlib import Path
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

# 支持的模型列表
MODELS: List[str] = [
    "qwen3.6-plus",
    "qwen3.5-plus",
    "qwen3.5-397b-a17b",
    "qwen3-max",
    "qwen3-max-2026-01-23",
    "qwen3-235b-a22b",
    "qwen3-30b-a3b",
    "qwen3-vl-30b-a3b",
    "qwen3-vl-32b",
    "qwen3-vl-plus",
    "qwen3-coder-plus",
    "qwen3-coder-30b-a3b-instruct",
    "qwen3-omni-flash",
    "qwen3-omni-flash-2025-12-01",
    "qwen2.5-72b-instruct",
    "qwen2.5-vl-32b-instruct",
    "qwen2.5-omni-7b",
    "qwen2.5-coder-32b-instruct",
    "qwen-max-latest",
    "qwen-plus-2025-07-28",
    "qwen-plus-2025-09-11",
    "qwen-plus-2025-01-25",
    "qwen-turbo-2025-02-11",
]

# 能力字典——仅声明平台真实支持的能力
CAPS: Dict[str, bool] = {
    "chat": True,
    "vision": True,
    "thinking": True,
    "search": True,
    "image_gen": True,
    "image_edit": True,
    "audio_gen": True,
    "video_gen": True,
    "continuation": True,
    "artifacts": True,
}


class QwenAdapter(PlatformAdapter):
    """Qwen 平台适配器。

    实现非阻塞初始化：init() 立即返回，后台 Task 完成登录等耗时操作。
    """

    def __init__(self) -> None:
        """初始化适配器内部状态。"""
        self._client: Any = None
        self._init_task: Any = None
        self._bg_task: Any = None

    @property
    def name(self) -> str:
        """平台标识名。

        Returns:
            平台名字符串。
        """
        return "qwen"

    @property
    def supported_models(self) -> List[str]:
        """支持的模型列表。

        Returns:
            模型名列表。
        """
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        """默认能力字典。

        Returns:
            能力字典。
        """
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化适配器——立即返回，后台完成耗时操作。

        Args:
            session: 共享的 aiohttp ClientSession。
        """
        from src.platforms.qwen.client import QwenClient

        self._client = QwenClient()
        self._init_task = asyncio.ensure_future(
            self._client.init_immediate(session)
        )
        self._bg_task = asyncio.ensure_future(
            self._client.background_setup()
        )

    async def candidates(self) -> List[Candidate]:
        """返回当前可用候选项列表。

        Returns:
            候选项列表。
        """
        if self._client is None:
            return []
        return await self._client.candidates()

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量。

        Args:
            count: 期望数量。

        Returns:
            当前实际可用数量。
        """
        if self._client is None:
            return 0
        return await self._client.ensure_candidates(count)

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
        """聊天补全，完全委托给 client。

        Args:
            candidate: 候选项。
            messages: 消息列表。
            model: 模型名。
            stream: 是否流式。
            thinking: 是否启用 thinking 模式。
            search: 是否启用搜索。
            **kw: 额外参数。

        Yields:
            str（文本增量）或 dict（thinking/usage/image_gen）。
        """
        async for chunk in self._client.complete(
            candidate,
            messages,
            model,
            stream,
            thinking=thinking,
            search=search,
            **kw,
        ):
            yield chunk

    async def create_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        **kw: Any,
    ) -> Dict[str, Any]:
        """图片生成：通过聊天通道抓取 image 事件。"""
        if self._client is None:
            return {"created": int(time.time()), "data": []}

        target_model = model or (
            candidate.models[0] if getattr(candidate, "models", []) else self.supported_models[0]
        )
        images: List[Dict[str, str]] = []

        async for chunk in self._client.complete(
            candidate,
            [{"role": "user", "content": prompt}],
            target_model,
            stream=True,
            thinking=False,
            search=False,
        ):
            if isinstance(chunk, dict) and "image_url" in chunk:
                images.append(
                    {
                        "url": chunk.get("image_url", ""),
                        "local": chunk.get("image_local", ""),
                    }
                )

        return {
            "created": int(time.time()),
            "data": [
                {k: v for k, v in item.items() if v}
                for item in images
                if item.get("url")
            ],
        }

    async def edit_image(
        self,
        candidate: Candidate,
        image: bytes,
        prompt: str,
        model: str,
        **kw: Any,
    ) -> Dict[str, Any]:
        """图片编辑：上传原图并通过聊天通道抓取编辑后的图片事件。"""
        if self._client is None:
            return {"created": int(time.time()), "data": []}
        if not image:
            return {"created": int(time.time()), "data": []}

        target_model = model or (
            candidate.models[0] if getattr(candidate, "models", []) else self.supported_models[0]
        )
        filename = kw.get("filename") or "image.png"
        images: List[Dict[str, str]] = []

        async for chunk in self._client.complete(
            candidate,
            [{"role": "user", "content": prompt}],
            target_model,
            stream=True,
            thinking=False,
            search=False,
            upload_files=[(image, filename)],
        ):
            if isinstance(chunk, dict) and "image_url" in chunk:
                images.append(
                    {
                        "url": chunk.get("image_url", ""),
                        "local": chunk.get("image_local", ""),
                    }
                )

        return {
            "created": int(time.time()),
            "data": [
                {k: v for k, v in item.items() if v}
                for item in images
                if item.get("url")
            ],
        }

    async def create_video(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        **kw: Any,
    ) -> Dict[str, Any]:
        """视频生成：通过聊天通道抓取 video 事件。"""
        if self._client is None:
            return {"created": int(time.time()), "data": []}

        target_model = model or (
            candidate.models[0] if getattr(candidate, "models", []) else self.supported_models[0]
        )
        videos: List[Dict[str, str]] = []

        async for chunk in self._client.complete(
            candidate,
            [{"role": "user", "content": prompt}],
            target_model,
            stream=True,
            thinking=False,
            search=False,
        ):
            if isinstance(chunk, dict) and "video_url" in chunk:
                url = chunk.get("video_url", "")
                if url:
                    videos.append({"url": url})

        return {
            "created": int(time.time()),
            "data": videos,
        }

    async def create_speech(
        self,
        candidate: Candidate,
        input_text: str,
        model: str,
        voice: str,
        **kw: Any,
    ) -> bytes:
        """TTS：委托客户端合成并返回 WAV 字节。"""
        if self._client is None:
            return b""

        token = candidate.meta.get("token", "")
        if not token:
            return b""

        target_model = model or (
            candidate.models[0] if getattr(candidate, "models", []) else self.supported_models[0]
        )

        audio_path = await self._client.synthesize_tts(
            input_text,
            token,
            model=target_model,
        )
        if not audio_path:
            return b""

        try:
            return Path(audio_path).read_bytes()
        except Exception:
            return b""

    async def close(self) -> None:
        """关闭适配器，取消后台任务，释放资源。"""
        for task in (self._init_task, self._bg_task):
            if task is not None and not task.done():
                task.cancel()
                try:
                    await task
                except (asyncio.CancelledError, Exception):
                    pass
        if self._client is not None:
            await self._client.close()
