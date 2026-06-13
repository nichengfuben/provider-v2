"""协议注册 + 获取（复用 echotools，保留项目配置绑定）。"""
from __future__ import annotations

from typing import Dict, Optional

from echotools.fncall.registry import (
    _ensure_registered,
    _get_custom_protocol,
    _mapping_logged,
)
from echotools.logger.manager import get_logger
from echotools.protocol.base import (
    ToolProtocol,
    _PROTOCOL_REGISTRY,
    get_protocol_by_id,
)

__all__ = ["get_protocol", "list_protocols"]

logger = get_logger(__name__)


def get_protocol(
    protocol_id: str = "",
    *,
    default_protocol: str = "xml",
    custom_prompt_en: str = "",
    custom_prompt_zh: str = "",
    platform_id: str = "",
    mapping: Optional[Dict[str, str]] = None,
) -> ToolProtocol:
    """获取协议（自动从项目配置读取平台映射）。"""
    # 从项目配置自动补充映射
    if not mapping and platform_id:
        try:
            from src.core.config import get_config
            cfg = get_config()
            mapping = cfg.fncall.fncall_mapping
        except Exception:
            pass

    if not protocol_id:
        if platform_id and mapping:
            mapped = mapping.get(platform_id)
            if mapped:
                protocol_id = mapped
                key = f"{platform_id}:{protocol_id}"
                if key not in _mapping_logged:
                    logger.debug("平台 %s -> 协议 %s", platform_id, protocol_id)
                    _mapping_logged.add(key)
    if not protocol_id:
        protocol_id = default_protocol
    if protocol_id == "custom":
        return _get_custom_protocol(custom_prompt_en, custom_prompt_zh)
    _ensure_registered()
    return get_protocol_by_id(protocol_id)


def list_protocols() -> list:
    """全部协议 ID。"""
    _ensure_registered()
    return sorted(_PROTOCOL_REGISTRY.keys())
