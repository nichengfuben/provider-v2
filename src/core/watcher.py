from __future__ import annotations

import asyncio
import logging
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional, Set

__all__ = ["FileWatcher"]
logger = logging.getLogger(__name__)

_CORE_DIRS = {"core", "routes"}
_PLATFORM_DIR = "platforms"
_WATCH_EXTS = {".py", ".toml"}
_INTERVAL = 2.0


class FileWatcher:
    """文件变更监视器，支持平台热重载和核心文件重启。"""

    def __init__(self, root: Path) -> None:
        """初始化监视器。

        Args:
            root: 项目根目录。
        """
        self._root = root
        self._mtimes: Dict[str, float] = {}
        self._running = False
        self._session: Optional[Any] = None
        self._registry: Optional[Any] = None

    def _scan(self) -> Dict[str, float]:
        """扫描所有被监视文件的修改时间。

        Returns:
            {文件路径: 修改时间} 字典。
        """
        result: Dict[str, float] = {}
        src = self._root / "src"
        config = self._root / "config.toml"
        main_py = self._root / "main.py"

        if src.is_dir():
            for p in src.rglob("*.py"):
                try:
                    result[str(p)] = p.stat().st_mtime
                except OSError:
                    pass

        if config.is_file():
            try:
                result[str(config)] = config.stat().st_mtime
            except OSError:
                pass

        if main_py.is_file():
            try:
                result[str(main_py)] = main_py.stat().st_mtime
            except OSError:
                pass

        return result

    def _classify(self, changed: Set[str]) -> tuple:
        """分类变更文件为核心文件或平台文件。

        Args:
            changed: 变更的文件路径集合。

        Returns:
            (needs_restart, 需要热重载的平台名集合) 元组。
        """
        needs_restart = False
        platform_names: Set[str] = set()

        for fp in changed:
            p = Path(fp)
            parts = p.parts

            if p.name in ("config.toml", "main.py"):
                needs_restart = True
                continue

            try:
                src_idx = parts.index("src")
            except ValueError:
                needs_restart = True
                continue

            sub_parts = parts[src_idx + 1:]
            if not sub_parts:
                needs_restart = True
                continue

            first = sub_parts[0]
            if first in _CORE_DIRS or first == "__init__.py":
                needs_restart = True
            elif first == _PLATFORM_DIR and len(sub_parts) >= 2:
                platform_names.add(sub_parts[1])
            else:
                needs_restart = True

        return needs_restart, platform_names

    def _restart(self) -> None:
        """重启整个进程（无残留）。"""
        logger.info("核心文件变更，正在重启进程...")
        try:
            if sys.platform == "win32":
                import subprocess

                subprocess.Popen(
                    [sys.executable] + sys.argv,
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,  # type: ignore[attr-defined]
                )
                sys.exit(0)
            else:
                os.execv(sys.executable, [sys.executable] + sys.argv)
        except Exception as e:
            logger.error("重启失败: %s", e)

    async def start(self, registry: Any, session: Any) -> None:
        """启动文件监视循环。

        Args:
            registry: 平台注册表（用于热重载）。
            session: 共享 session（用于热重载）。
        """
        self._registry = registry
        self._session = session
        self._running = True
        self._mtimes = self._scan()
        logger.info("文件监视已启动，根目录: %s", self._root)

        while self._running:
            await asyncio.sleep(_INTERVAL)
            try:
                await self._check()
            except Exception as e:
                logger.warning("文件监视检查失败: %s", e)

    async def _check(self) -> None:
        """执行一次文件变更检查。"""
        current = self._scan()
        changed: Set[str] = set()

        for fp, mt in current.items():
            if fp not in self._mtimes or self._mtimes[fp] != mt:
                changed.add(fp)

        self._mtimes = current

        if not changed:
            return

        logger.info(
            "检测到文件变更: %s", [Path(f).name for f in changed]
        )
        needs_restart, platform_names = self._classify(changed)

        if needs_restart:
            await asyncio.sleep(1.0)
            self._restart()
            return

        # 热重载平台，重载后刷新候选项
        for name in platform_names:
            if self._registry and self._session:
                logger.info("热重载平台: %s", name)
                ok = await self._registry.reload_platform(name, self._session)
                if ok:
                    logger.info("平台 [%s] 热重载成功", name)
                    # 触发候选项重建，确保注册表状态同步
                    try:
                        await self._registry.ensure_candidates(
                            "", 1
                        )
                    except Exception:
                        pass
                else:
                    logger.warning("平台 [%s] 热重载失败", name)

    def stop(self) -> None:
        """停止监视。"""
        self._running = False
        logger.info("文件监视已停止")
