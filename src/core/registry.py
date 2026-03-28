"""平台自动发现与注册"""

from __future__ import annotations

import importlib
import logging
import pkgutil
import time
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate
from src.core.selector import Selector

__all__ = ["Registry"]
logger = logging.getLogger(__name__)


class Registry:
    """平台注册表

    自动发现 src.platforms 下的所有平台适配器，
    并提供按模型名 + 能力过滤候选项的接口。
    """

    def __init__(self) -> None:
        self._adapters: Dict[str, Any] = {}
        self.selector = Selector()

    async def init(self, session: aiohttp.ClientSession) -> None:
        """扫描并初始化所有平台"""
        from src.platforms.base import PlatformAdapter

        try:
            import src.platforms as pkg
        except ImportError:
            return
        for _, name, ispkg in pkgutil.iter_modules(pkg.__path__, pkg.__name__ + "."):
            if not ispkg:
                continue
            try:
                mod = importlib.import_module(name)
                for attr_name in dir(mod):
                    attr = getattr(mod, attr_name)
                    if (
                        isinstance(attr, type)
                        and issubclass(attr, PlatformAdapter)
                        and attr is not PlatformAdapter
                    ):
                        a = attr()
                        try:
                            await a.init(session)
                            self._adapters[a.name] = a
                            logger.info(
                                "平台 [%s] 已注册 (%d 模型)",
                                a.name,
                                len(a.supported_models),
                            )
                        except Exception as e:
                            logger.error("平台 [%s] 初始化失败: %s", attr_name, e)
            except Exception as e:
                logger.warning("加载 %s 失败: %s", name, e)
        logger.info("注册完成: %s", list(self._adapters.keys()))

    @property
    def adapters(self) -> Dict[str, Any]:
        return self._adapters

    async def get_candidates(
        self,
        model: Optional[str] = None,
        capability: Optional[str] = None,
    ) -> List[Candidate]:
        """获取匹配 model 和能力的候选项

        Args:
            model: 模型名过滤（None 表示不限）
            capability: 要求的能力字段名（如 "chat"、"embedding"、"tts"）
        """
        out: List[Candidate] = []
        for a in self._adapters.values():
            try:
                for c in await a.candidates():
                    if not c.available or c.busy:
                        continue
                    if model is not None and model not in c.models:
                        continue
                    if capability is not None and not c.has_capability(capability):
                        continue
                    out.append(c)
            except Exception as e:
                logger.warning("[%s] candidates 失败: %s", a.name, e)
        return out

    async def ensure_candidates(self, model: str, count: int) -> None:
        """确保候选项数量"""
        for a in self._adapters.values():
            if model in a.supported_models:
                try:
                    await a.ensure_candidates(count)
                except Exception:
                    pass

    def adapter_for(self, c: Candidate) -> Optional[Any]:
        """根据候选项找适配器"""
        return self._adapters.get(c.platform)

    async def all_models(self) -> List[Dict[str, Any]]:
        """收集所有模型及其能力"""
        out: List[Dict[str, Any]] = []
        seen: set = set()
        for a in self._adapters.values():
            caps = a.default_capabilities
            try:
                cand_list = await a.candidates()
            except Exception:
                cand_list = []
            # 汇集来自 candidate 的真实能力
            model_caps: Dict[str, Dict[str, bool]] = {}
            for c in cand_list:
                for m in c.models:
                    if m not in model_caps:
                        model_caps[m] = {}
                    for cap in c.capabilities_set():
                        model_caps[m][cap] = True
            for m in a.supported_models:
                if m not in seen:
                    seen.add(m)
                    merged = dict(caps)
                    if m in model_caps:
                        merged.update(model_caps[m])
                    out.append(
                        {
                            "id": m,
                            "object": "model",
                            "created": int(time.time()),
                            "owned_by": a.name,
                            "capabilities": merged,
                        }
                    )
        return out

    async def close(self) -> None:
        for n, a in self._adapters.items():
            try:
                await a.close()
            except Exception as e:
                logger.warning("关闭 [%s] 失败: %s", n, e)
