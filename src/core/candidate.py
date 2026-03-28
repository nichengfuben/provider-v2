"""候选项数据类与 ID 生成"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any, Dict, List, Set

__all__ = ["Candidate", "make_id", "ALL_CAPABILITIES"]

# 所有已知能力常量
ALL_CAPABILITIES = frozenset(
    {
        "chat",
        "vision",
        "image_gen",
        "video_gen",
        "audio_gen",
        "audio_in",
        "tts",
        "stt",
        "embedding",
        "research",
        "thinking",
        "search",
        "code_exec",
        "artifacts",
        "tools",
        "upload",
        "continuation",
        "moderation",
    }
)


def make_id(platform: str) -> str:
    """全局唯一候选项 ID，格式 {platform}_{hex12}"""
    return f"{platform}_{uuid.uuid4().hex[:12]}"


@dataclass
class Candidate:
    """候选项

    每个候选项代表一个可用的平台资源节点，
    通过布尔能力字段声明支持的服务类型。
    """

    id: str
    platform: str
    resource_id: str
    chat: bool = False
    vision: bool = False
    image_gen: bool = False
    video_gen: bool = False
    audio_gen: bool = False
    audio_in: bool = False
    tts: bool = False
    stt: bool = False
    embedding: bool = False
    research: bool = False
    thinking: bool = False
    search: bool = False
    code_exec: bool = False
    artifacts: bool = False
    tools: bool = False
    upload: bool = False
    continuation: bool = False
    moderation: bool = False
    models: List[str] = field(default_factory=list)
    available: bool = True
    busy: bool = False
    cooldown: float = 0.0
    meta: Dict[str, Any] = field(default_factory=dict)

    def has_capability(self, cap: str) -> bool:
        """检查是否拥有指定能力"""
        return bool(getattr(self, cap, False))

    def capabilities_set(self) -> Set[str]:
        """返回当前拥有的所有能力集合"""
        return {cap for cap in ALL_CAPABILITIES if getattr(self, cap, False)}
