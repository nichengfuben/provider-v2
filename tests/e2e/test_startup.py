from typing import Any, Dict, List

import aiohttp
import pytest
from aiohttp.test_utils import TestClient, TestServer

from src.core.server import SESSION_KEY, REGISTRY_KEY, create_app


class DummySelector:
    async def get_stats(self) -> Dict[str, Any]:
        return {}


class DummyAdapter:
    supported_models: List[Dict[str, Any]] = []

    async def candidates(self) -> List[Any]:
        return []

    async def close(self) -> None:
        return None


class DummyRegistry:
    def __init__(self) -> None:
        self._adapters: Dict[str, Any] = {}
        self.selector = DummySelector()

    @property
    def adapters(self) -> Dict[str, Any]:
        return self._adapters

    async def init(self, session: aiohttp.ClientSession) -> None:
        return None

    async def all_models(self) -> List[Dict[str, Any]]:
        return []

    async def reload_platform(self, platform_name: str, session: aiohttp.ClientSession) -> bool:
        return False


@pytest.mark.asyncio
async def test_gateway_startup_health_ok() -> None:
    """启动 aiohttp 应用并验证 /health 可用。"""

    registry = DummyRegistry()
    async with aiohttp.ClientSession() as session:
        app = await create_app(registry, session)

        async with TestServer(app) as server:
            await server.start_server()
            async with TestClient(server) as client:
                # 验证健康检查
                resp = await client.get("/health")
                assert resp.status == 200
                body = await resp.json()
                assert body.get("status") == "healthy"

                # 验证 models 端点空列表
                resp_models = await client.get("/v1/models")
                assert resp_models.status == 200
                models_body = await resp_models.json()
                assert models_body.get("object") == "list"
                assert models_body.get("data") == []

                # 验证 status 端点空平台信息
                resp_status = await client.get("/v1/status")
                assert resp_status.status == 200
                status_body = await resp_status.json()
                assert status_body.get("status") == "running"
                assert status_body.get("platforms") == {}
