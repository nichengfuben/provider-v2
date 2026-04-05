from __future__ import annotations

import asyncio
import sys
from pathlib import Path

import aiohttp
import pytest

ROOT = str(Path(__file__).resolve().parents[2])
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src.platforms.edge_tts.adapter import EdgeTtsAdapter


@pytest.mark.asyncio
async def test_edge_tts_create_speech() -> None:
    """验证 edge_tts 能成功生成音频字节（纯 socket 实现）。"""
    adapter = EdgeTtsAdapter()
    async with aiohttp.ClientSession() as session:
        await adapter.init(session)
        task = getattr(adapter, "_task", None)
        if task is not None:
            await task
        try:
            cands = await adapter.candidates()
            assert cands, "edge_tts 无可用候选"
            cand = cands[0]
            audio = await asyncio.wait_for(
                adapter.create_speech(
                    cand,
                    "你好，请介绍一下你自己。",
                    "en-US-EmmaMultilingualNeural",
                    "zh-CN-XiaoxiaoNeural",
                ),
                timeout=60,
            )
            Path("edge_tts_output.mp3").write_bytes(audio)
        finally:
            await adapter.close()
    assert isinstance(audio, (bytes, bytearray)), "返回类型非字节"
    assert len(audio) > 0, "音频为空"
