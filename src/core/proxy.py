"""HTTP 代理——导入即生效"""

from __future__ import annotations

import builtins
import logging
import re
import ssl
import warnings
from pathlib import Path
from typing import Any, Optional, Tuple

warnings.filterwarnings("ignore", message="Unclosed connection")
warnings.filterwarnings("ignore", module="aiohttp.connector")
logger = logging.getLogger("proxy")
__all__ = ["activate", "deactivate", "is_active", "get_proxy_server"]

_IP_RE = re.compile(r"^(https?://)?(\d{1,3}\.){3}\d{1,3}(:\d+)?(/|$)")
_active = False
PROXY_SERVER = ""


def _find_cfg() -> Optional[Path]:
    import os

    env = os.environ.get("CONFIG_PATH")
    if env and Path(env).is_file():
        return Path(env)
    for b in [Path(__file__).parent.parent.parent, Path.cwd()]:
        if (b / "config.toml").is_file():
            return b / "config.toml"
    d = Path(__file__).parent.parent.parent.parent
    for _ in range(5):
        if (d / "config.toml").is_file():
            return d / "config.toml"
        if d.parent == d:
            break
        d = d.parent
    return None


def _load_cfg() -> Tuple[str, bool]:
    """加载 TOML 配置文件中的代理设置

    Returns:
        (代理服务器地址, 是否启用代理) 元组
    """
    try:
        import tomllib
    except ModuleNotFoundError:
        import tomli as tomllib  # type: ignore

    p = _find_cfg()
    if not p:
        return "", False
    try:
        with open(p, "rb") as f:
            raw = tomllib.load(f)
        sec = raw.get("proxy", {})
        return str(sec.get("proxy_server", "")), bool(sec.get("proxy_enabled", False))
    except Exception as e:
        logger.warning("代理配置加载失败: %s", e, exc_info=False)
        return "", False


PROXY_SERVER, _ENABLED = _load_cfg()


def _is_ip(url: str) -> bool:
    """检查 URL 是否为 IP 地址"""
    return bool(_IP_RE.match(url))


def _patch_requests() -> None:
    """为 requests 库打补丁以支持代理"""
    try:
        import requests as _r

        _r.packages.urllib3.disable_warnings()
    except ImportError:
        builtins.requests = None  # type: ignore
        return
    _orig = _r.Session.request

    def _p(self: Any, method: str, url: str, *a: Any, **kw: Any) -> Any:
        """requests.Session.request 代理包装器"""
        if _is_ip(str(url)):
            return _orig(self, method, url, *a, **kw)
        if _active and "proxies" not in kw:
            kw["proxies"] = {"http": PROXY_SERVER, "https": PROXY_SERVER}
            kw["verify"] = False
        return _orig(self, method, url, *a, **kw)

    _r.Session.request = _p  # type: ignore
    builtins.requests = _r  # type: ignore


def _patch_aiohttp() -> None:
    """为 aiohttp 库打补丁以支持代理"""
    try:
        import aiohttp as _a
        from aiohttp import ClientSession, TCPConnector
    except ImportError:
        builtins.aiohttp = None  # type: ignore
        return
    _oi, _or = ClientSession.__init__, ClientSession._request

    def _pi(self: Any, *a: Any, **kw: Any) -> None:
        """aiohttp.ClientSession.__init__ 代理包装器"""
        if "connector" not in kw:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            kw["connector"] = TCPConnector(ssl=ctx, force_close=False)
        _oi(self, *a, **kw)
        self._default_proxy = PROXY_SERVER if _active else None

    async def _pr(self: Any, method: str, url: Any, **kw: Any) -> Any:
        """aiohttp.ClientSession._request 代理包装器"""
        if _is_ip(str(url)):
            return await _or(self, method, url, **kw)
        if _active and "proxy" not in kw:
            kw["proxy"] = self._default_proxy
        return await _or(self, method, url, **kw)

    _oc = ClientSession.close

    async def _pc(self: Any) -> None:
        """aiohttp.ClientSession.close 异常容错包装器"""
        try:
            await _oc(self)
        except Exception:
            pass

    ClientSession.__init__ = _pi  # type: ignore
    ClientSession._request = _pr  # type: ignore
    ClientSession.close = _pc  # type: ignore
    builtins.aiohttp = _a  # type: ignore


def activate() -> None:
    """激活全局代理"""
    global _active
    _active = True
    logger.info("代理已激活: %s", PROXY_SERVER)


def deactivate() -> None:
    """停用全局代理"""
    global _active
    _active = False
    logger.info("代理已停用")


def is_active() -> bool:
    """返回代理激活状态"""
    return _active


def get_proxy_server() -> str:
    """返回代理服务器地址"""
    return PROXY_SERVER


def _init() -> None:
    """初始化代理补丁"""
    _patch_requests()
    _patch_aiohttp()
    if _ENABLED and PROXY_SERVER:
        activate()
    else:
        logger.info("代理未启用")


_init()
