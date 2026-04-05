from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

__all__ = ["AppConfig", "get_config", "reload_config", "start_config_watcher"]
logger = logging.getLogger(__name__)

try:
    import tomllib  # type: ignore[import]
except ImportError:
    try:
        import tomli as tomllib  # type: ignore[import,no-reuse-declared]
    except ImportError:
        tomllib = None  # type: ignore[assignment]


@dataclass
class ServerCfg:
    """服务器配置。"""

    host: str = "0.0.0.0"
    port: int = 1337
    debug: bool = False


@dataclass
class AnthCfg:
    """Anthropic 兼容层配置。"""

    api_version: str = "2023-06-01"
    model_mapping: Dict[str, str] = field(default_factory=dict)


@dataclass
class AuthCfg:
    """认证配置。"""

    enabled: bool = False
    keys: List[str] = field(default_factory=list)


@dataclass
class GatewayCfg:
    """网关配置。"""

    concurrent_enabled: bool = True
    concurrent_count: int = 3
    min_tokens: int = 10


@dataclass
class ProxyCfg:
    """代理配置。"""

    proxy_server: str = ""
    proxy_enabled: bool = False


@dataclass
class FncallCfg:
    """函数调用配置。"""

    call_start_tag: str = "<function="
    call_end_tag: str = "</function>"
    tools_start_tag: str = "<tools>"
    tools_end_tag: str = "</tools>"
    templates: Dict[str, str] = field(default_factory=dict)


@dataclass
class AppConfig:
    """全量应用配置。"""

    server: ServerCfg = field(default_factory=ServerCfg)
    anthropic: AnthCfg = field(default_factory=AnthCfg)
    auth: AuthCfg = field(default_factory=AuthCfg)
    gateway: GatewayCfg = field(default_factory=GatewayCfg)
    proxy: ProxyCfg = field(default_factory=ProxyCfg)
    fncall: FncallCfg = field(default_factory=FncallCfg)


_cfg: Optional[AppConfig] = None
_path: Optional[Path] = None
_mtime: float = 0.0


def _find() -> Optional[Path]:
    """查找 config.toml 文件。

    Returns:
        config.toml 的 Path，未找到返回 None。
    """
    env = os.environ.get("CONFIG_PATH")
    if env and Path(env).is_file():
        return Path(env)
    for b in [Path(__file__).parent.parent.parent, Path.cwd()]:
        c = b / "config.toml"
        if c.is_file():
            return c.resolve()
    d = Path(__file__).parent.parent.parent.parent
    for _ in range(5):
        c = d / "config.toml"
        if c.is_file():
            return c.resolve()
        if d.parent == d:
            break
        d = d.parent
    return None


def _parse(path: Path) -> AppConfig:
    """解析 config.toml 文件。

    Args:
        path: config.toml 路径。

    Returns:
        AppConfig 实例。
    """
    if tomllib is None:
        logger.warning("tomllib/tomli 不可用，使用默认配置")
        return AppConfig()

    with open(str(path), "rb") as f:
        raw = tomllib.load(f)

    s = raw.get("server", {})
    a = s.get("anthropic", {})
    return AppConfig(
        server=ServerCfg(
            s.get("host", "0.0.0.0"),
            int(s.get("port", 1337)),
            bool(s.get("debug", False)),
        ),
        anthropic=AnthCfg(
            a.get("api_version", "2023-06-01"),
            a.get("model_mapping", {}),
        ),
        auth=AuthCfg(
            bool(raw.get("auth", {}).get("enabled", False)),
            list(raw.get("auth", {}).get("keys", [])),
        ),
        gateway=GatewayCfg(
            bool(raw.get("gateway", {}).get("concurrent_enabled", True)),
            int(raw.get("gateway", {}).get("concurrent_count", 3)),
            int(raw.get("gateway", {}).get("min_tokens", 10)),
        ),
        proxy=ProxyCfg(
            str(raw.get("proxy", {}).get("proxy_server", "")),
            bool(raw.get("proxy", {}).get("proxy_enabled", False)),
        ),
        fncall=FncallCfg(
            call_start_tag=raw.get("fncall", {}).get(
                "call_start_tag", "<function="
            ),
            call_end_tag=raw.get("fncall", {}).get(
                "call_end_tag", "</function>"
            ),
            tools_start_tag=raw.get("fncall", {}).get(
                "tools_start_tag", "<tools>"
            ),
            tools_end_tag=raw.get("fncall", {}).get(
                "tools_end_tag", "</tools>"
            ),
            templates=raw.get("fncall", {}).get("templates", {}),
        ),
    )


def _load() -> AppConfig:
    """加载配置文件。

    Returns:
        AppConfig 实例。
    """
    global _cfg, _path, _mtime
    p = _find()
    if p is None:
        logger.warning("未找到 config.toml，使用默认配置")
        _cfg = AppConfig()
        return _cfg
    try:
        _cfg = _parse(p)
        _path, _mtime = p, p.stat().st_mtime
        logger.info("配置已加载: %s", p)
    except Exception as e:
        logger.error("config.toml 加载失败: %s", e)
        if _cfg is None:
            _cfg = AppConfig()
    return _cfg


def get_config() -> AppConfig:
    """获取当前配置（懒加载）。

    Returns:
        当前 AppConfig 实例。
    """
    global _cfg
    if _cfg is None:
        _load()
    return _cfg  # type: ignore[return-value]


def reload_config() -> AppConfig:
    """强制重载配置。

    Returns:
        重载后的 AppConfig 实例。
    """
    return _load()


async def start_config_watcher(interval: float = 2.0) -> None:
    """后台监视配置文件变更，变更时自动重载。

    Args:
        interval: 检查间隔秒数。
    """
    global _mtime
    while True:
        await asyncio.sleep(interval)
        if _path and _path.exists():
            try:
                mt = _path.stat().st_mtime
                if mt > _mtime:
                    logger.info("config.toml 变更，重载")
                    _load()
            except Exception:
                pass
