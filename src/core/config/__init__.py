from __future__ import annotations
import asyncio
from typing import Optional

from src.core.config.sections import AppConfig
from src.core.config.manager import ConfigManager

__all__ = ["AppConfig", "ConfigManager", "get_config", "reload_config", "start_config_watcher"]

_cfg_manager: Optional[ConfigManager] = None


def _get_manager() -> ConfigManager:
    global _cfg_manager
    if _cfg_manager is None:
        _cfg_manager = ConfigManager()
        _cfg_manager.load()
    return _cfg_manager


def get_config() -> AppConfig:
    """获取当前应用配置（延迟初始化配置管理器）。

    Returns:
        AppConfig: 当前加载的完整应用配置。
    """
    return _get_manager().config


async def reload_config() -> AppConfig:
    """重新加载配置文件并返回最新配置。

    Returns:
        AppConfig: 重新加载后的完整应用配置。
    """
    mgr = _get_manager()
    await mgr.reload()
    return mgr.config


async def start_config_watcher(interval: float = 2.0) -> None:
    """启动配置文件变更监听器（后台轮询）。

    Args:
        interval: 轮询间隔（秒），默认为 2.0。
    """
    mgr = _get_manager()
    await mgr.start_watching()
