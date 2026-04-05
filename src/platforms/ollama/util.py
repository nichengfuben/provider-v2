# src/platforms/ollama/util.py
"""Ollama工具函数"""

from __future__ import annotations

import concurrent.futures
import json
import logging
import os
import re
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

logger = logging.getLogger(__name__)

# ── URL常量 ──────────────────────────────────────────────
BASE_URL: str = "https://freeollama.oneplus1.top/"
CHAT_PATH: str = "/api/chat"

# ── 发现配置 ──────────────────────────────────────────────
PAGE_SIZE: int = 100
TIMEOUT: int = 10
MAX_WORKERS: int = 512
REFRESH_INTERVAL: int = 86400

# ── 持久化路径 ────────────────────────────────────────────
SRV_FILE: Path = Path("persist/ollama/servers.json")
REG_FILE: Path = Path("persist/ollama/registry.json")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 请求构建
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def build_image_messages(
    messages: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """将OpenAI格式的消息转换为Ollama格式。

    处理多模态消息中的image_url，提取base64数据。

    Args:
        messages: OpenAI格式的消息列表。

    Returns:
        Ollama格式的消息列表。
    """
    if not messages:
        return []

    result: List[Dict[str, Any]] = []
    for msg in messages:
        content = msg.get("content", "")
        role = msg.get("role", "user")

        if isinstance(content, str):
            result.append({"role": role, "content": content})
            continue

        if isinstance(content, list):
            text_parts: List[str] = []
            images: List[str] = []
            for part in content:
                if not isinstance(part, dict):
                    continue
                if part.get("type") == "text":
                    text_parts.append(part.get("text", ""))
                elif part.get("type") == "image_url":
                    url = part.get("image_url", {}).get("url", "")
                    if url.startswith("data:") and ";base64," in url:
                        images.append(url.split(";base64,", 1)[1])
            entry: Dict[str, Any] = {
                "role": role,
                "content": "\n".join(text_parts),
            }
            if images:
                entry["images"] = images
            result.append(entry)
            continue

        result.append({"role": role, "content": str(content)})

    return result


def build_chat_payload(
    messages: List[Dict[str, Any]],
    model: str = "",
    stream: bool = True,
    **kw: Any,
) -> Dict[str, Any]:
    """构建Ollama聊天请求体。

    Args:
        messages: Ollama格式的消息列表。
        model: 模型名。
        stream: 是否流式。
        **kw: 额外参数（temperature, top_p, max_tokens, stop）。

    Returns:
        请求体字典。
    """
    payload: Dict[str, Any] = {
        "model": model,
        "messages": messages,
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

    return payload


def parse_ollama_line(
    line: bytes,
) -> Optional[Union[str, Dict[str, Any]]]:
    """解析Ollama流式响应的单行JSON。

    Ollama的流式响应不是SSE格式，而是逐行JSON。

    Args:
        line: 原始字节行（已去除首尾空白）。

    Returns:
        str（文本片段）、dict（usage）或None（跳过）。
    """
    if not line:
        return None

    try:
        data = json.loads(line)
    except (json.JSONDecodeError, ValueError):
        return None

    if "error" in data:
        raise ValueError("ollama error: {}".format(data["error"]))

    content = data.get("message", {}).get("content", "")

    if data.get("done"):
        usage: Dict[str, int] = {}
        if "prompt_eval_count" in data:
            usage["prompt_tokens"] = data["prompt_eval_count"]
        if "eval_count" in data:
            usage["completion_tokens"] = data["eval_count"]
        if usage:
            return {"usage": usage}
        return None

    if content:
        return content

    return None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 服务器发现（同步，需 run_in_executor 调用）
# 注意：此模块使用 requests 和 beautifulsoup4 进行同步 HTTP 请求和 HTML 解析
# 这些操作仅在后台线程中执行（通过 run_in_executor），不阻塞事件循环
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def _fetch_page(page: int) -> Optional[str]:
    """获取指定页面的HTML内容。

    Args:
        page: 页码。

    Returns:
        HTML字符串或None。
    """
    try:
        import requests

        r = requests.get(
            "{}?page={}&page_size={}".format(BASE_URL, page, PAGE_SIZE),
            timeout=TIMEOUT,
        )
        if r.ok:
            return r.text
        return None
    except Exception:
        return None


def _parse_pages(html: str) -> int:
    """从HTML中解析总页数。

    Args:
        html: 首页HTML内容。

    Returns:
        总页数。
    """
    try:
        from bs4 import BeautifulSoup

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
    except Exception:
        return 1


def _parse_ips(html: str) -> List[str]:
    """从HTML中提取服务器IP列表。

    Args:
        html: 页面HTML内容。

    Returns:
        IP地址列表。
    """
    try:
        from bs4 import BeautifulSoup

        soup = BeautifulSoup(html, "html.parser")
        ips: List[str] = []
        for btn in soup.find_all("button", onclick=True):
            m = re.search(
                r"copyToClipboard\('([^']+)'\)",
                btn.get("onclick", ""),
            )
            if m:
                ips.append(m.group(1))
        return ips
    except Exception:
        return []


def _show_model(base: str, name: str) -> Optional[Dict[str, Any]]:
    """查询模型详情。

    Args:
        base: 服务器基础URL。
        name: 模型名称。

    Returns:
        模型详情字典或None。
    """
    try:
        import requests

        r = requests.post(
            "{}/api/show".format(base),
            json={"name": name},
            timeout=TIMEOUT,
        )
        if r.ok:
            return r.json()
        return None
    except Exception:
        return None


def detect_capabilities(detail: Optional[Dict[str, Any]]) -> Dict[str, bool]:
    """从模型详情中检测能力。

    Args:
        detail: /api/show返回的模型详情。

    Returns:
        能力字典。
    """
    caps: Dict[str, bool] = {
        "chat": True,
        "vision": False,
        "embedding": False,
        "tools": False,
    }
    if not detail:
        return caps

    model_info = detail.get("model_info", {})
    for k in model_info:
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

    if "embedding" in detail.get("parameters", "").lower():
        caps["embedding"] = True

    return caps


def _verify_server(ip: str) -> Optional[Dict[str, Any]]:
    """验证单个服务器并获取模型列表。

    Args:
        ip: 服务器IP（含端口）。

    Returns:
        服务器信息字典或None。
    """
    import requests

    base = "http://{}".format(ip)
    try:
        r = requests.get(base, timeout=TIMEOUT)
        if "ollama" not in r.text.lower():
            return None
    except Exception:
        return None

    try:
        r = requests.get("{}/api/tags".format(base), timeout=TIMEOUT)
        models = r.json().get("models", [])
        if not models:
            return None
    except Exception:
        return None

    infos: List[Dict[str, Any]] = []
    for m in models:
        name = m.get("name", "")
        if not name:
            continue
        detail = _show_model(base, name)
        infos.append({
            "name": name,
            "size": m.get("size", 0),
            "capabilities": detect_capabilities(detail),
            "family": m.get("details", {}).get("family", ""),
            "parameter_size": m.get("details", {}).get("parameter_size", ""),
        })

    return {
        "ip": ip,
        "base_url": base,
        "models": infos,
        "model_names": [m["name"] for m in infos],
        "verified_at": time.time(),
    }


def collect_servers(
    additional: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """收集所有可用的Ollama服务器（网络I/O副作用）。

    从在线列表抓取 + 附加服务器列表合并后并发验证。

    注意：此函数涉及网络调用副作用（_fetch_page / _verify_server）。
    在client.py中通过run_in_executor()在线程池中执行，隔离网络阻塞。

    Args:
        additional: 附加服务器IP列表（来自accounts.py）。

    Returns:
        服务器字典 {ip: server_info}。
    """
    html = _fetch_page(1)
    if not html:
        all_ips: List[str] = []
    else:
        pages = _parse_pages(html)
        all_ips = _parse_ips(html)

        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
            futs = {
                ex.submit(_fetch_page, p): p
                for p in range(2, pages + 1)
            }
            for f in concurrent.futures.as_completed(futs):
                r = f.result()
                if r:
                    all_ips.extend(_parse_ips(r))

    all_ips = list(set(all_ips))

    if additional:
        for s in additional:
            if s and s not in all_ips:
                all_ips.append(s)

    result: Dict[str, Any] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futs = {ex.submit(_verify_server, ip): ip for ip in all_ips}
        for f in concurrent.futures.as_completed(futs):
            try:
                info = f.result()
                if info:
                    result[info["ip"]] = info
            except Exception:
                pass

    return result


def build_registry(servers: Dict[str, Any]) -> Dict[str, Any]:
    """从服务器列表构建模型注册表。

    Args:
        servers: 服务器字典。

    Returns:
        模型注册表 {model_name: model_info}。
    """
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
            reg[name]["servers"].append({
                "ip": ip,
                "base_url": srv["base_url"],
            })
            for k, v in m.get("capabilities", {}).items():
                if v:
                    reg[name]["capabilities"][k] = True
    return reg


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 持久化
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def save_cache(servers: Dict[str, Any], registry: Dict[str, Any]) -> None:
    """保存服务器和注册表到本地文件（文件I/O副作用）。

    注意：此函数涉及文件写入副作用（原子操作）。在client.py的_do_refresh()
    中通过run_in_executor()在线程池中执行，隔离文件I/O阻塞。

    Args:
        servers: 服务器字典。
        registry: 模型注册表。
    """
    for f in (SRV_FILE, REG_FILE):
        f.parent.mkdir(parents=True, exist_ok=True)

    tmp = str(SRV_FILE) + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(
            {"servers": servers, "last_refresh": time.time()},
            f,
            indent=2,
        )
    os.replace(tmp, str(SRV_FILE))

    tmp = str(REG_FILE) + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(
            {"models": registry, "last_refresh": time.time()},
            f,
            indent=2,
        )
    os.replace(tmp, str(REG_FILE))


def load_cache() -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """从本地文件加载服务器和注册表（文件I/O副作用）。

    注意：此函数涉及文件读取副作用。在client.py的init_immediate()/_do_refresh()
    中调用，文件不存在时返回空字典。

    Returns:
        (服务器字典, 模型注册表) 元组。
    """
    srv: Dict[str, Any] = {}
    reg: Dict[str, Any] = {}
    if SRV_FILE.exists():
        try:
            srv = json.loads(
                SRV_FILE.read_text(encoding="utf-8")
            ).get("servers", {})
        except Exception:
            srv = {}
    if REG_FILE.exists():
        try:
            reg = json.loads(
                REG_FILE.read_text(encoding="utf-8")
            ).get("models", {})
        except Exception:
            reg = {}
    return srv, reg


def needs_refresh() -> bool:
    """判断是否需要重新发现服务器（文件I/O + 时间比较）。

    注意：此函数涉及文件读取副作用和time.time()时间比较。在client.py的
    background_setup()中调用，决策是否触发后台刷新任务。

    Returns:
        True表示需要刷新。
    """
    if not SRV_FILE.exists():
        return True
    try:
        d = json.loads(SRV_FILE.read_text(encoding="utf-8"))
        return time.time() - d.get("last_refresh", 0) >= REFRESH_INTERVAL
    except Exception:
        return True
