"""NoteGPT 平台适配器

NoteGPT (notegpt.io) 是一个AI服务集合平台，支持图像生成。
"""

from __future__ import annotations

import asyncio
import base64
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = ["notegpt-image"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class NoteGPTAdapter(PlatformAdapter):
    """NoteGPT 平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "notegpt"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.notegpt.client import NoteGPTClient

        self._client = NoteGPTClient()
        await self._client.init(session)
        logger.info("NoteGPT 适配器初始化完成")

    async def candidates(self) -> List[Candidate]:
        return await self._client.candidates() if self._client else []

    async def ensure_candidates(self, count: int) -> int:
        return await self._client.ensure_candidates(count) if self._client else 0

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict[str, Any]],
        model: str,
        stream: bool,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        raise NotImplementedError(
            "NoteGPT 不支持聊天补全，请使用 generate_image 方法"
        )

    async def generate_image(
        self,
        candidate: Candidate,
        prompt: str,
        model: str,
        *,
        response_format: str = "url",
        **kw: Any,
    ) -> Dict[str, Any]:
        """生成图像"""
        if not self._client:
            raise RuntimeError("NoteGPT 客户端未初始化")

        # 开始生成
        result = await self._client.start_generation(prompt=prompt)
        session_id = result.get("data", {}).get("session_id", "")

        if not session_id:
            raise RuntimeError("NoteGPT 未返回 session_id")

        # 轮询状态
        max_polls = 60
        image_url = ""
        for _ in range(max_polls):
            status = await self._client.get_status()
            gen_status = status.get("data", {}).get("status", "pending")

            if gen_status == "completed":
                results = status.get("data", {}).get("results", [])
                if results:
                    image_url = results[0].get("url", [""])[0] if results[0].get("url") else ""
                break
            elif gen_status == "failed":
                raise RuntimeError(f"图像生成失败: {status}")

            await asyncio.sleep(2)
        else:
            raise RuntimeError("图像生成超时")

        logger.info("NoteGPT 图像生成完成: %s", image_url)

        response = {
            "created": int(time.time()),
            "data": [],
        }

        if response_format == "b64_json" and image_url:
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as img_resp:
                    if img_resp.status == 200:
                        img_data = await img_resp.read()
                        response["data"].append({
                            "b64_json": base64.b64encode(img_data).decode("utf-8")
                        })
        else:
            response["data"].append({"url": image_url})

        return response

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None
