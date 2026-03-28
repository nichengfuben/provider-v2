"""Akash Network API 客户端

实现与 Akash Network 聊天 API 的通信。

API 端点: https://chat.akash.network/api/

使用方式:
1. 获取模型列表: GET /api/models
2. 聊天补全: POST /api/chat (SSE流)
"""

from __future__ import annotations

import json
import logging
from typing import Any, AsyncGenerator, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate, make_id

logger = logging.getLogger(__name__)

# API 端点
API_BASE_URL = "https://chat.akash.network"
API_MODELS = "/api/models"
API_CHAT = "/api/chat"
API_AUTH_STATUS = "/api/auth/status"

# 默认模型
DEFAULT_MODEL = "DeepSeek-V3.2"

# 支持的聊天模型
CHAT_MODELS = [
    "DeepSeek-V3.2",
    "Qwen/Qwen3-30B-A3B",
    "Meta-Llama-3-3-70B-Instruct",
]

# 图像生成模型
IMAGE_MODELS = [
    "AkashGen",
]

# 所有支持的模型
SUPPORTED_MODELS = CHAT_MODELS + IMAGE_MODELS

# 平台能力
CAPS = {
    "chat": True,
    "image_gen": True,
}


class AkashClient:
    """Akash Network API 客户端

    封装与 Akash Network 聊天 API 的所有交互。
    免费使用，无需认证。

    使用前请确保:
    - 网络可以访问 chat.akash.network
    """

    def __init__(self) -> None:
        """初始化客户端"""
        self._session: Optional[aiohttp.ClientSession] = None
        self._models: List[Dict[str, Any]] = []
        self._candidate: Optional[Candidate] = None

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化客户端

        Args:
            session: aiohttp 客户端会话
        """
        self._session = session

        # 加载模型列表
        try:
            await self._load_models()
            logger.info("Akash 客户端初始化完成，已加载 %d 个模型", len(self._models))
        except Exception as e:
            logger.warning("加载模型列表失败: %s，使用默认列表", e)
            self._load_default_models()

        # 创建单个候选项
        self._create_candidate()

    def _create_candidate(self) -> None:
        """创建单个候选项"""
        model_ids = [m.get("id", m.get("model_id", "")) for m in self._models]
        if not model_ids:
            model_ids = SUPPORTED_MODELS

        self._candidate = Candidate(
            id=make_id("akash"),
            platform="akash",
            resource_id="default",
            models=model_ids,
            meta={},
            **CAPS,
        )

    def _load_default_models(self) -> None:
        """加载默认模型列表"""
        self._models = [
            {
                "id": "DeepSeek-V3.2",
                "name": "DeepSeek V3.2",
                "token_limit": 64000,
                "temperature": 1.0,
                "top_p": 0.95,
            },
            {
                "id": "Qwen/Qwen3-30B-A3B",
                "name": "Qwen3 30B A3B",
                "token_limit": 32768,
                "temperature": 0.6,
                "top_p": 0.95,
            },
            {
                "id": "Meta-Llama-3-3-70B-Instruct",
                "name": "Llama 3.3 70B",
                "token_limit": 128000,
                "temperature": 0.6,
                "top_p": 0.9,
            },
            {
                "id": "AkashGen",
                "name": "AkashGen",
                "token_limit": 12000,
                "temperature": 0.85,
                "top_p": 1.0,
            },
        ]

    async def _load_models(self) -> None:
        """从 API 加载可用模型列表"""
        if not self._session:
            return

        url = f"{API_BASE_URL}{API_MODELS}"

        try:
            async with self._session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:
                if response.status == 200:
                    self._models = await response.json()
                else:
                    raise RuntimeError(f"获取模型列表失败: HTTP {response.status}")
        except Exception as e:
            logger.error("获取模型列表失败: %s", e)
            raise

    async def candidates(self) -> List[Candidate]:
        """返回候选项列表（单个候选项）"""
        return [self._candidate] if self._candidate else []

    async def ensure_candidates(self, count: int) -> int:
        """确保候选项数量"""
        return 1 if self._candidate else 0

    def get_model_info(self, model_id: str) -> Optional[Dict[str, Any]]:
        """获取模型信息"""
        for model in self._models:
            if model.get("id") == model_id or model.get("model_id") == model_id:
                return model
        return None

    async def chat(
        self,
        messages: List[Dict[str, Any]],
        model: str = DEFAULT_MODEL,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        max_tokens: Optional[int] = None,
        **kw: Any,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """聊天补全

        Args:
            messages: 消息列表
            model: 模型名称
            temperature: 温度参数
            top_p: Top-p 参数
            max_tokens: 最大token数

        Yields:
            Dict: SSE事件数据
        """
        if not self._session:
            raise RuntimeError("客户端会话未初始化")

        url = f"{API_BASE_URL}{API_CHAT}"

        # 获取模型默认参数
        model_info = self.get_model_info(model) or {}

        # 构建请求体
        payload = {
            "messages": messages,
            "model": model,
        }

        # 添加可选参数
        if temperature is not None:
            payload["temperature"] = temperature
        elif model_info.get("temperature"):
            payload["temperature"] = float(model_info["temperature"])

        if top_p is not None:
            payload["top_p"] = top_p
        elif model_info.get("top_p"):
            payload["top_p"] = float(model_info["top_p"])

        if max_tokens is not None:
            payload["max_tokens"] = max_tokens

        headers = {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
        }

        try:
            async with self._session.post(
                url,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=300),
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"Akash API 错误 ({response.status}): {error_text}")

                # 解析SSE流
                async for line in response.content:
                    line_text = line.decode("utf-8").strip()

                    if not line_text:
                        continue

                    # Akash 使用格式: 0:"text", e:{}, d:{}
                    if line_text.startswith(("0:", "e:", "d:", "f:")):
                        prefix = line_text[0]
                        data_str = line_text[2:]

                        try:
                            if prefix == "0":
                                # 文本增量
                                text = json.loads(data_str)
                                yield {"type": "text-delta", "delta": text}
                            elif prefix == "e":
                                # 结束事件
                                data = json.loads(data_str)
                                yield {"type": "finish", "data": data}
                            elif prefix == "d":
                                # 完成数据
                                data = json.loads(data_str)
                                yield {"type": "done", "data": data}
                            elif prefix == "f":
                                # 消息ID
                                data = json.loads(data_str)
                                yield {"type": "start", "data": data}
                        except json.JSONDecodeError:
                            continue

        except aiohttp.ClientError as e:
            logger.error("Akash API 请求失败: %s", e)
            raise RuntimeError(f"Akash API 请求失败: {e}")

    async def chat_stream(
        self,
        messages: List[Dict[str, Any]],
        model: str = DEFAULT_MODEL,
        **kw: Any,
    ) -> AsyncGenerator[str, None]:
        """聊天补全（流式文本）

        简化的流式文本生成，只返回文本内容。
        """
        async for event in self.chat(messages=messages, model=model, **kw):
            event_type = event.get("type", "")

            if event_type == "text-delta":
                delta = event.get("delta", "")
                if delta:
                    yield delta

    @property
    def models(self) -> List[Dict[str, Any]]:
        """返回支持的模型列表"""
        return self._models

    async def close(self) -> None:
        """关闭客户端"""
        self._session = None
