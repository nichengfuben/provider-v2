from __future__ import annotations

import asyncio
import importlib
import logging
import pkgutil
import sys
import time
from typing import Any, Dict, List, Optional

import aiohttp

from src.core.candidate import Candidate
from src.core.selector import Selector

__all__ = ["Registry"]
logger = logging.getLogger(__name__)


class Registry:
    """平台注册表。

    初始化策略：先注册，后台完善。
    1. 发现所有平台适配器类
    2. 立即调用 adapter.init()（适配器内部立即返回）
    3. 注册到表中，服务立即可用
    4. 各平台后台 Task 完成登录/token 刷新/模型拉取后实时更新候选项
    """

    def __init__(self) -> None:
        """初始化注册表。"""
        self._adapters: Dict[str, Any] = {}
        self.selector = Selector()

    async def init(self, session: aiohttp.ClientSession) -> None:
        """扫描并初始化所有平台适配器。

        每个平台 adapter.init() 必须立即返回，
        耗时操作在适配器内部的后台 Task 中执行。

        Args:
            session: 共享的 aiohttp ClientSession。
        """
        from src.platforms.base import PlatformAdapter

        try:
            import src.platforms as pkg
        except ImportError:
            logger.warning("src.platforms 包不存在")
            return

        discovered: List[Any] = []
        for _, name, ispkg in pkgutil.iter_modules(
            pkg.__path__, pkg.__name__ + "."
        ):
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
                        discovered.append(attr)
            except Exception as e:
                logger.warning("加载 %s 失败: %s", name, e)

        if not discovered:
            logger.warning("未发现任何平台适配器")
            return

        logger.info("发现 %d 个平台适配器，开始注册", len(discovered))

        async def _init_one(adapter_cls: type) -> None:
            """注册单个平台适配器。

            Args:
                adapter_cls: 适配器类。
            """
            adapter = adapter_cls()
            adapter_name = getattr(adapter, "name", adapter_cls.__name__)
            try:
                await adapter.init(session)
                self._adapters[adapter_name] = adapter
                logger.info(
                    "平台 [%s] 已注册 (%d 模型)",
                    adapter_name,
                    len(adapter.supported_models),
                )
            except Exception as e:
                logger.error("平台 [%s] 注册失败: %s", adapter_name, e)
                try:
                    await adapter.close()
                except Exception:
                    pass

        await asyncio.gather(
            *[_init_one(cls) for cls in discovered],
            return_exceptions=True,
        )

        logger.info("注册完成: %s", list(self._adapters.keys()))

    async def reload_platform(
        self, platform_name: str, session: aiohttp.ClientSession
    ) -> bool:
        """热重载指定平台适配器。

        完整清理 sys.modules 中所有与该平台相关的子模块，
        确保重载后拿到最新代码。

        Args:
            platform_name: 平台标识名。
            session: 共享 session。

        Returns:
            是否重载成功。
        """
        old = self._adapters.get(platform_name)
        if old is not None:
            try:
                await old.close()
            except Exception:
                pass

        # 清理 sys.modules 中所有相关子模块（顺序：子模块先于父模块）
        prefix = "src.platforms.{}".format(platform_name)
        to_remove = sorted(
            [k for k in sys.modules if k == prefix or k.startswith(prefix + ".")],
            key=lambda x: -len(x),  # 子模块优先删除
        )
        for mod_key in to_remove:
            del sys.modules[mod_key]

        try:
            from src.platforms.base import PlatformAdapter

            pkg_mod = importlib.import_module(prefix)

            new_cls = None
            for attr_name in dir(pkg_mod):
                attr = getattr(pkg_mod, attr_name)
                if (
                    isinstance(attr, type)
                    and issubclass(attr, PlatformAdapter)
                    and attr is not PlatformAdapter
                ):
                    new_cls = attr
                    break

            if new_cls is None:
                logger.error("重载 [%s] 未找到适配器类", platform_name)
                return False

            new_adapter = new_cls()
            await new_adapter.init(session)
            self._adapters[platform_name] = new_adapter
            logger.info("平台 [%s] 热重载成功", platform_name)
            return True
        except Exception as e:
            logger.error("平台 [%s] 热重载失败: %s", platform_name, e)
            # 从注册表移除损坏的适配器
            self._adapters.pop(platform_name, None)
            return False

    @property
    def adapters(self) -> Dict[str, Any]:
        """全部适配器字典。

        Returns:
            适配器字典。
        """
        return self._adapters

    async def get_candidates(
        self,
        model: Optional[str] = None,
        capability: Optional[str] = None,
    ) -> List[Candidate]:
        """获取匹配 model 和 capability 的可用候选项。

        Args:
            model: 模型名过滤（可选）。
            capability: 能力名过滤（可选）。

        Returns:
            候选项列表。
        """
        out: List[Candidate] = []
        for a in self._adapters.values():
            try:
                for c in await a.candidates():
                    if not c.available or c.busy:
                        continue
                    if model is not None and model not in c.models:
                        continue
                    if capability is not None and not c.has_capability(
                        capability
                    ):
                        continue
                    out.append(c)
            except Exception as e:
                logger.warning("[%s] candidates 失败: %s", a.name, e)
        return out

    async def ensure_candidates(self, model: str, count: int) -> None:
        """确保候选项数量。

        Args:
            model: 模型名。
            count: 期望数量。
        """
        for a in self._adapters.values():
            if model in a.supported_models:
                try:
                    await a.ensure_candidates(count)
                except Exception:
                    pass

    def adapter_for(self, c: Candidate) -> Optional[Any]:
        """根据候选项找对应适配器。

        Args:
            c: 候选项。

        Returns:
            适配器实例或 None。
        """
        return self._adapters.get(c.platform)

    async def get_capable_adapter(self, capability: str) -> Optional[Any]:
        """获取第一个支持指定能力的适配器。

        Args:
            capability: 能力名。

        Returns:
            适配器实例或 None。
        """
        for a in self._adapters.values():
            caps = a.default_capabilities
            if caps.get(capability, False):
                return a
        return None

    async def get_capable_candidate(
        self, capability: str
    ) -> Optional[Candidate]:
        """获取第一个支持指定能力的候选项。

        Args:
            capability: 能力名。

        Returns:
            候选项或 None。
        """
        cands = await self.get_candidates(capability=capability)
        if cands:
            selected = await self.selector.select(cands, 1)
            if selected:
                return selected[0]
        return None

    async def all_models(self) -> List[Dict[str, Any]]:
        """收集所有模型及其能力信息。

        Returns:
            模型字典列表（/v1/models 格式）。
        """
        out: List[Dict[str, Any]] = []
        seen: set = set()
        for a in self._adapters.values():
            caps = a.default_capabilities
            ctx_len = getattr(a, "context_length", None)
            for m in a.supported_models:
                if m not in seen:
                    seen.add(m)
                    entry: Dict[str, Any] = {
                        "id": m,
                        "object": "model",
                        "created": int(time.time()),
                        "owned_by": a.name,
                        "capabilities": dict(caps),
                    }
                    if ctx_len is not None:
                        entry["context_length"] = ctx_len
                    out.append(entry)
        return out

    async def close(self) -> None:
        """并发关闭全部适配器。"""

        async def _close_one(name: str, adapter: Any) -> None:
            """关闭单个适配器。

            Args:
                name: 平台名。
                adapter: 适配器实例。
            """
            try:
                await asyncio.wait_for(adapter.close(), timeout=5.0)
            except asyncio.TimeoutError:
                logger.warning("关闭 [%s] 超时", name)
            except Exception as e:
                logger.warning("关闭 [%s] 失败: %s", name, e)

        await asyncio.gather(
            *[_close_one(n, a) for n, a in self._adapters.items()],
            return_exceptions=True,
        )
