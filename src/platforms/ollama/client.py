"""Ollama 客户端——支持 chat、embedding、vision"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

import aiohttp

from src.core.candidate import Candidate, make_id
from src.core.config import get_config
from src.core.errors import EmbeddingError
from src.platforms.ollama import util

logger = logging.getLogger(__name__)


class OllamaClient:
    """Ollama HTTP 客户端

    支持以下 Ollama API 端点：
    - POST /api/chat    (对话补全，含 vision)
    - POST /api/embed   (嵌入向量)
    - GET  /api/tags    (模型列表)
    - POST /api/show    (模型详情)
    """

    def __init__(self) -> None:
        self._session: Optional[aiohttp.ClientSession] = None
        self._servers: Dict[str, Any] = {}
        self._registry: Dict[str, Any] = {}
        self._lock = asyncio.Lock()

    async def init(self, session: aiohttp.ClientSession) -> None:
        """初始化：发现并验证 Ollama 服务器"""
        self._session = session
        loop = asyncio.get_running_loop()
        cfg = get_config()
        add = cfg.ollama.additional_servers
        try:
            self._servers, self._registry = await loop.run_in_executor(
                None, lambda: util.refresh(force=util.needs_refresh(), additional=add)
            )
        except Exception as e:
            logger.error("Ollama 发现失败: %s", e)
            try:
                self._servers, self._registry = await loop.run_in_executor(
                    None, util.load
                )
            except Exception:
                pass
        logger.info(
            "Ollama: %d 服务器, %d 模型", len(self._servers), len(self._registry)
        )
        asyncio.create_task(self._bg_refresh())

    async def _bg_refresh(self) -> None:
        """后台定期刷新服务器列表"""
        while True:
            await asyncio.sleep(86400)
            try:
                loop = asyncio.get_running_loop()
                cfg = get_config()
                s, r = await loop.run_in_executor(
                    None,
                    lambda: util.refresh(
                        force=True, additional=cfg.ollama.additional_servers
                    ),
                )
                async with self._lock:
                    self._servers, self._registry = s, r
                logger.info("Ollama 刷新: %d 服务器", len(s))
            except Exception as e:
                logger.warning("Ollama 刷新失败: %s", e)

    def get_available_models(self) -> List[str]:
        """返回所有已发现的模型名"""
        return list(self._registry.keys())

    async def candidates(self) -> List[Candidate]:
        """构建候选项列表，每个服务器一个候选项"""
        out: List[Candidate] = []
        async with self._lock:
            for ip, srv in self._servers.items():
                models = srv.get("model_names", [])
                if not models:
                    continue
                # 从模型详情汇集能力
                caps: Dict[str, bool] = {"chat": True}
                has_embedding = False
                has_vision = False
                has_tools = False
                for m in srv.get("models", []):
                    mcaps = m.get("capabilities", {})
                    if mcaps.get("vision"):
                        has_vision = True
                    if mcaps.get("embedding"):
                        has_embedding = True
                    if mcaps.get("tools"):
                        has_tools = True
                out.append(
                    Candidate(
                        id=make_id("ollama"),
                        platform="ollama",
                        resource_id=ip,
                        models=models,
                        meta={"ip": ip, "base_url": srv["base_url"]},
                        chat=True,
                        vision=has_vision,
                        embedding=has_embedding,
                        tools=has_tools,
                    )
                )
        return out

    async def ensure_candidates(self, count: int) -> int:
        """返回当前服务器数"""
        return len(self._servers)

    # -----------------------------------------------------------------
    # Chat Completion（含 vision 图片传入）
    # -----------------------------------------------------------------

    async def complete(
        self,
        candidate: Candidate,
        messages: List[Dict],
        model: str,
        stream: bool,
        *,
        thinking: bool = False,
        search: bool = False,
        **kw: Any,
    ) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
        """调用 Ollama /api/chat 端点"""
        base = candidate.meta["base_url"]

        # 构建 Ollama messages 列表（支持多轮 + 图片）
        ollama_messages = self._build_ollama_messages(messages)

        payload: Dict[str, Any] = {
            "model": model,
            "messages": ollama_messages,
            "stream": stream,
        }
        opts: Dict[str, Any] = {}
        if kw.get("temperature") is not None:
            opts["temperature"] = kw["temperature"]
        if kw.get("top_p") is not None:
            opts["top_p"] = kw["top_p"]
        if kw.get("max_tokens") is not None:
            opts["num_predict"] = kw["max_tokens"]
        if kw.get("stop"):
            opts["stop"] = kw["stop"]
        if opts:
            payload["options"] = opts

        async with self._session.post(
            f"{base}/api/chat",
            json=payload,
            timeout=aiohttp.ClientTimeout(total=600),
        ) as resp:
            if resp.status != 200:
                raise Exception(f"Ollama HTTP {resp.status}: {await resp.text()}")
            if not stream:
                data = await resp.json()
                if "error" in data:
                    raise Exception(data["error"])
                content = data.get("message", {}).get("content", "")
                if content:
                    yield content
                u: Dict[str, int] = {}
                if "prompt_eval_count" in data:
                    u["prompt_tokens"] = data["prompt_eval_count"]
                if "eval_count" in data:
                    u["completion_tokens"] = data["eval_count"]
                if u:
                    yield {"usage": u}
            else:
                buf = b""
                async for chunk in resp.content.iter_any():
                    if not chunk:
                        continue
                    buf += chunk
                    lines = buf.split(b"\n")
                    buf = lines[-1]
                    for line in lines[:-1]:
                        if not line.strip():
                            continue
                        try:
                            data = json.loads(line)
                        except json.JSONDecodeError:
                            continue
                        if "error" in data:
                            raise Exception(data["error"])
                        c = data.get("message", {}).get("content", "")
                        if c:
                            yield c
                        if data.get("done"):
                            u = {}
                            if "prompt_eval_count" in data:
                                u["prompt_tokens"] = data["prompt_eval_count"]
                            if "eval_count" in data:
                                u["completion_tokens"] = data["eval_count"]
                            if u:
                                yield {"usage": u}
                            return
                if buf.strip():
                    try:
                        data = json.loads(buf)
                        c = data.get("message", {}).get("content", "")
                        if c:
                            yield c
                    except json.JSONDecodeError:
                        pass

    # -----------------------------------------------------------------
    # Embedding
    # -----------------------------------------------------------------

    async def embed(
        self,
        candidate: Candidate,
        input_data: Union[str, List[str]],
        model: str,
    ) -> Dict[str, Any]:
        """调用 Ollama /api/embed 端点计算嵌入向量

        Ollama /api/embed 接受：
        {"model": "...", "input": "..." 或 ["...", "..."]}

        返回：
        {"embeddings": [[...], ...]}
        """
        base = candidate.meta["base_url"]
        if isinstance(input_data, str):
            texts = [input_data]
        else:
            texts = list(input_data)

        payload: Dict[str, Any] = {"model": model, "input": texts}

        async with self._session.post(
            f"{base}/api/embed",
            json=payload,
            timeout=aiohttp.ClientTimeout(total=120),
        ) as resp:
            if resp.status != 200:
                body = await resp.text()
                raise EmbeddingError(f"Ollama embed HTTP {resp.status}: {body}")
            data = await resp.json()

        if "error" in data:
            raise EmbeddingError(data["error"])

        embeddings = data.get("embeddings", [])
        if not embeddings:
            raise EmbeddingError("Ollama 返回空 embedding")

        # 构造 OpenAI 兼容响应
        prompt_tokens = data.get("prompt_eval_count", sum(len(t) // 3 for t in texts))
        result_data = []
        for idx, emb in enumerate(embeddings):
            result_data.append(
                {"object": "embedding", "index": idx, "embedding": emb}
            )
        return {
            "object": "list",
            "data": result_data,
            "model": model,
            "usage": {
                "prompt_tokens": prompt_tokens,
                "total_tokens": prompt_tokens,
            },
        }

    # -----------------------------------------------------------------
    # 内部辅助
    # -----------------------------------------------------------------

    @staticmethod
    def _build_ollama_messages(messages: List[Dict]) -> List[Dict[str, Any]]:
        """将 OpenAI 格式 messages 转换为 Ollama 格式

        处理：
        - 纯文本消息
        - 多模态消息（含 image_url 的 content list）
        - system / user / assistant 角色映射
        """
        ollama_msgs: List[Dict[str, Any]] = []
        for m in messages:
            role = m.get("role", "user")
            # Ollama 支持 system / user / assistant
            if role not in ("system", "user", "assistant"):
                role = "user"
            content = m.get("content", "")
            msg: Dict[str, Any] = {"role": role}
            if isinstance(content, str):
                msg["content"] = content
            elif isinstance(content, list):
                # 多模态：提取文本和图片
                text_parts: List[str] = []
                images: List[str] = []
                for part in content:
                    if not isinstance(part, dict):
                        continue
                    if part.get("type") == "text":
                        text_parts.append(part.get("text", ""))
                    elif part.get("type") == "image_url":
                        url = part.get("image_url", {})
                        if isinstance(url, dict):
                            url = url.get("url", "")
                        if isinstance(url, str) and url.startswith("data:"):
                            if ";base64," in url:
                                images.append(url.split(";base64,", 1)[1])
                        elif isinstance(url, str) and url:
                            # Ollama 不直接支持 URL，记录到文本
                            text_parts.append(f"[Image: {url}]")
                msg["content"] = "\n".join(text_parts) if text_parts else ""
                if images:
                    msg["images"] = images
            else:
                msg["content"] = str(content) if content else ""
            ollama_msgs.append(msg)
        return ollama_msgs

    async def close(self) -> None:
        """释放资源"""
        pass
