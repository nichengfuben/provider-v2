"""配置加载与热重载"""

from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

__all__ = ["AppConfig", "get_config", "reload_config", "start_config_watcher"]
logger = logging.getLogger(__name__)


@dataclass
class ServerCfg:
    host: str = "0.0.0.0"
    port: int = 1337
    debug: bool = False


@dataclass
class AnthCfg:
    api_version: str = "2023-06-01"
    model_mapping: Dict[str, str] = field(default_factory=dict)


@dataclass
class AuthCfg:
    enabled: bool = False
    keys: List[str] = field(default_factory=list)


@dataclass
class GatewayCfg:
    concurrent_enabled: bool = True
    concurrent_count: int = 3
    min_tokens: int = 10


@dataclass
class ProxyCfg:
    proxy_server: str = ""
    proxy_enabled: bool = False


@dataclass
class OllamaCfg:
    additional_servers: List[str] = field(default_factory=list)


@dataclass
class FncallCfg:
    call_start_tag: str = "<function="
    call_end_tag: str = "</" + "function>"
    tools_start_tag: str = "<tools>"
    tools_end_tag: str = "</" + "tools>"
    templates: Dict[str, str] = field(default_factory=dict)


@dataclass
class AppConfig:
    server: ServerCfg = field(default_factory=ServerCfg)
    anthropic: AnthCfg = field(default_factory=AnthCfg)
    auth: AuthCfg = field(default_factory=AuthCfg)
    gateway: GatewayCfg = field(default_factory=GatewayCfg)
    proxy: ProxyCfg = field(default_factory=ProxyCfg)
    ollama: OllamaCfg = field(default_factory=OllamaCfg)
    fncall: FncallCfg = field(default_factory=FncallCfg)


_cfg: Optional[AppConfig] = None
_path: Optional[Path] = None
_mtime: float = 0.0


def _find() -> Optional[Path]:
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
    import tomllib

    with open(path, "rb") as f:
        raw = tomllib.load(f)
    s = raw.get("server", {})
    a = s.get("anthropic", {})
    return AppConfig(
        server=ServerCfg(
            s.get("host", "0.0.0.0"), s.get("port", 1337), s.get("debug", False)
        ),
        anthropic=AnthCfg(
            a.get("api_version", "2023-06-01"), a.get("model_mapping", {})
        ),
        auth=AuthCfg(
            raw.get("auth", {}).get("enabled", False),
            raw.get("auth", {}).get("keys", []),
        ),
        gateway=GatewayCfg(
            **{
                k: raw.get("gateway", {}).get(k, v)
                for k, v in [
                    ("concurrent_enabled", True),
                    ("concurrent_count", 3),
                    ("min_tokens", 10),
                ]
            }
        ),
        proxy=ProxyCfg(
            raw.get("proxy", {}).get("proxy_server", ""),
            raw.get("proxy", {}).get("proxy_enabled", False),
        ),
        ollama=OllamaCfg(raw.get("ollama", {}).get("additional_servers", [])),
        fncall=FncallCfg(
            call_start_tag=raw.get("fncall", {}).get("call_start_tag", "<function="),
            call_end_tag=raw.get("fncall", {}).get(
                "call_end_tag", "</" + "function>"
            ),
            tools_start_tag=raw.get("fncall", {}).get("tools_start_tag", "<tools>"),
            tools_end_tag=raw.get("fncall", {}).get(
                "tools_end_tag", "</" + "tools>"
            ),
            templates=raw.get("fncall", {}).get("templates", {}),
        ),
    )


def _load() -> AppConfig:
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
    """获取当前配置"""
    global _cfg
    if _cfg is None:
        _load()
    return _cfg  # type: ignore


def reload_config() -> AppConfig:
    """强制重载"""
    return _load()


async def start_config_watcher(interval: float = 2.0) -> None:
    """后台监视配置变更"""
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
