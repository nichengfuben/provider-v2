"""SkyFortress 平台适配器

SkyFortress (skyfortress.dev) 是一个免费的AI图像生成平台。
"""

from __future__ import annotations

import base64
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Union

import aiohttp

from src.core.candidate import Candidate
from src.platforms.base import PlatformAdapter

logger = logging.getLogger(__name__)

MODELS = ["skyfortress-sdxl"]

CAPS = {
    "chat": False,
    "image_gen": True,
}


class SkyFortressAdapter(PlatformAdapter):
    """SkyFortress 平台适配器"""

    def __init__(self) -> None:
        self._client: Any = None

    @property
    def name(self) -> str:
        return "skyfortress"

    @property
    def supported_models(self) -> List[str]:
        return MODELS

    @property
    def default_capabilities(self) -> Dict[str, bool]:
        return CAPS

    async def init(self, session: aiohttp.ClientSession) -> None:
        from src.platforms.skyfortress.client import SkyFortressClient

        self._client = SkyFortressClient()
        await self._client.init(session)
        logger.info("SkyFortress 适配器初始化完成")

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
            "SkyFortress 不支持聊天补全，请使用 generate_image 方法"
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
            raise RuntimeError("SkyFortress 客户端未初始化")

        result = await self._client.generate_image(prompt=prompt)

        image_url = result.get("url", "")
        if image_url and not image_url.startswith("http"):
            image_url = f"https://skyfortress.dev{image_url}"

        logger.info("SkyFortress 图像生成完成: %s", image_url)

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
