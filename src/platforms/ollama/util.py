"""Ollama 服务器发现（同步，需 run_in_executor）"""

from __future__ import annotations

import concurrent.futures
import json
import logging
import os
import re
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)
BASE_URL = "https://freeollama.oneplus1.top/"
PAGE_SIZE = 100
TIMEOUT = 10
MAX_WORKERS = 512
REFRESH_INTERVAL = 86400
SRV_FILE = Path("persist/ollama/servers.json")
REG_FILE = Path("persist/ollama/registry.json")


def _fetch_page(page: int) -> Optional[str]:
    """获取列表页面 HTML"""
    try:
        r = requests.get(
            f"{BASE_URL}?page={page}&page_size={PAGE_SIZE}", timeout=TIMEOUT
        )
        return r.text if r.ok else None
    except Exception:
        return None


def _parse_pages(html: str) -> int:
    """解析总页数"""
    soup = BeautifulSoup(html, "html.parser")
    pag = soup.find("ul", class_="pagination")
    if not pag:
        return 1
    mx = 1
    for a in pag.find_all("a", class_="page-link"):
        m = re.search(r"page=(\d+)", a.get("href", ""))
        if m:
            mx = max(mx, int(m.group(1)))
    return mx


def _parse_ips(html: str) -> List[str]:
    """从 HTML 中提取 IP 地址"""
    soup = BeautifulSoup(html, "html.parser")
    ips = []
    for btn in soup.find_all("button", onclick=True):
        m = re.search(r"copyToClipboard\('([^']+)'\)", btn.get("onclick", ""))
        if m:
            ips.append(m.group(1))
    return ips


def _show(base: str, name: str) -> Optional[Dict]:
    """获取模型详情"""
    try:
        r = requests.post(f"{base}/api/show", json={"name": name}, timeout=TIMEOUT)
        return r.json() if r.ok else None
    except Exception:
        return None


def _detect_caps(detail: Optional[Dict]) -> Dict[str, bool]:
    """从模型详情检测能力"""
    caps = {
        "chat": True,
        "vision": False,
        "embedding": False,
        "tools": False,
    }
    if not detail:
        return caps
    mi = detail.get("model_info", {})
    for k in mi:
        kl = k.lower()
        if any(x in kl for x in ("vision", "projector", "mmproj", "clip")):
            caps["vision"] = True
            break
    tpl = detail.get("template", "")
    if "tools" in tpl.lower() or ".Tools" in tpl:
        caps["tools"] = True
    det = detail.get("details", {})
    for fam in det.get("families", []):
        if any(x in fam.lower() for x in ("clip", "vision")):
            caps["vision"] = True
    # 检测 embedding 模型
    params = detail.get("parameters", "")
    if "embedding" in params.lower():
        caps["embedding"] = True
    # 某些模型家族天生就是 embedding 模型
    family = det.get("family", "").lower()
    if any(x in family for x in ("bert", "nomic", "mxbai", "snowflake")):
        caps["embedding"] = True
    # modelfile 中显式声明
    mf = detail.get("modelfile", "")
    if "embed" in mf.lower():
        caps["embedding"] = True
    return caps


def _verify(ip: str) -> Optional[Dict]:
    """验证单个 Ollama 服务器并获取模型信息"""
    base = f"http://{ip}"
    try:
        r = requests.get(base, timeout=TIMEOUT)
        if "ollama" not in r.text.lower():
            return None
    except Exception:
        return None
    try:
        r = requests.get(f"{base}/api/tags", timeout=TIMEOUT)
        models = r.json().get("models", [])
        if not models:
            return None
    except Exception:
        return None
    infos = []
    for m in models:
        name = m.get("name", "")
        if not name:
            continue
        d = _show(base, name)
        infos.append(
            {
                "name": name,
                "size": m.get("size", 0),
                "capabilities": _detect_caps(d),
                "family": m.get("details", {}).get("family", ""),
                "parameter_size": m.get("details", {}).get("parameter_size", ""),
            }
        )
    return {
        "ip": ip,
        "base_url": base,
        "models": infos,
        "model_names": [m["name"] for m in infos],
        "verified_at": time.time(),
    }


def collect_servers(additional: Optional[List[str]] = None) -> Dict[str, Any]:
    """收集并验证所有 Ollama 服务器"""
    html = _fetch_page(1)
    if not html:
        return {}
    pages = _parse_pages(html)
    all_ips = _parse_ips(html)
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
        futs = {ex.submit(_fetch_page, p): p for p in range(2, pages + 1)}
        for f in concurrent.futures.as_completed(futs):
            r = f.result()
            if r:
                all_ips.extend(_parse_ips(r))
    all_ips = list(set(all_ips))
    if additional:
        all_ips.extend([s for s in additional if s not in all_ips])
    result: Dict[str, Any] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futs = {ex.submit(_verify, ip): ip for ip in all_ips}
        for f in concurrent.futures.as_completed(futs):
            try:
                info = f.result()
                if info:
                    result[info["ip"]] = info
            except Exception:
                pass
    return result


def build_registry(servers: Dict[str, Any]) -> Dict[str, Any]:
    """从服务器信息构建模型注册表"""
    reg: Dict[str, Any] = {}
    for ip, srv in servers.items():
        for m in srv.get("models", []):
            name = m.get("name", "")
            if not name:
                continue
            if name not in reg:
                reg[name] = {
                    "servers": [],
                    "capabilities": m.get("capabilities", {"chat": True}),
                    "family": m.get("family", ""),
                }
            reg[name]["servers"].append({"ip": ip, "base_url": srv["base_url"]})
            for k, v in m.get("capabilities", {}).items():
                if v:
                    reg[name]["capabilities"][k] = True
    return reg


def save(servers: Dict, registry: Dict) -> None:
    """持久化服务器和注册表数据"""
    for f in (SRV_FILE, REG_FILE):
        f.parent.mkdir(parents=True, exist_ok=True)
    tmp = str(SRV_FILE) + ".tmp"
    with open(tmp, "w") as f:
        json.dump({"servers": servers, "last_refresh": time.time()}, f, indent=2)
    os.replace(tmp, str(SRV_FILE))
    tmp = str(REG_FILE) + ".tmp"
    with open(tmp, "w") as f:
        json.dump({"models": registry, "last_refresh": time.time()}, f, indent=2)
    os.replace(tmp, str(REG_FILE))


def load() -> Tuple[Dict, Dict]:
    """加载持久化数据"""
    srv: Dict = {}
    reg: Dict = {}
    if SRV_FILE.exists():
        try:
            srv = json.loads(SRV_FILE.read_text()).get("servers", {})
        except Exception:
            pass
    if REG_FILE.exists():
        try:
            reg = json.loads(REG_FILE.read_text()).get("models", {})
        except Exception:
            pass
    return srv, reg


def needs_refresh() -> bool:
    """检查是否需要刷新"""
    if not SRV_FILE.exists():
        return True
    try:
        d = json.loads(SRV_FILE.read_text())
        return time.time() - d.get("last_refresh", 0) >= REFRESH_INTERVAL
    except Exception:
        return True


def refresh(
    force: bool = False, additional: Optional[List[str]] = None
) -> Tuple[Dict, Dict]:
    """刷新服务器列表和注册表"""
    if not force and not needs_refresh():
        return load()
    servers = collect_servers(additional or [])
    registry = build_registry(servers)
    save(servers, registry)
    return servers, registry
