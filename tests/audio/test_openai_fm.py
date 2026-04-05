from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

import aiohttp
import pytest

ROOT = str(Path(__file__).resolve().parents[2])
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src.platforms.openai_fm import accounts
from src.platforms.openai_fm.adapter import OpenaiFmAdapter


def _prepare_accounts() -> None:
    """按环境变量覆盖 openai_fm 账号，默认允许无 Cookie。"""
    cookie = os.getenv("OPENAI_FM_COOKIE", "")
    accounts.API_KEYS[:] = [cookie]


async def _run_once() -> bytes:
    _prepare_accounts()
    adapter = OpenaiFmAdapter()
    async with aiohttp.ClientSession() as session:
        await adapter.init(session)
        task = getattr(adapter, "_task", None)
        if task is not None:
            await task
        try:
            cands = await adapter.candidates()
            if not cands:
                raise RuntimeError("openai_fm 无可用候选")
            cand = cands[0]
            audio = await asyncio.wait_for(
                adapter.create_speech(
                    cand,
                    input_text="你好，这是一个 openai.fm 语音合成测试。",
                    model="tts-1",
                    voice="coral",
                ),
                timeout=120,
            )
            return audio
        finally:
            await adapter.close()


@pytest.mark.asyncio
async def test_openai_fm_create_speech() -> None:
    """验证 openai_fm 能生成非空音频。"""
    audio = await _run_once()
    assert isinstance(audio, (bytes, bytearray)), "返回类型非字节"
    assert len(audio) > 0, "音频为空"


if __name__ == "__main__":
    audio_bytes = asyncio.run(_run_once())
    out = Path("openai_fm_output.mp3")
    out.write_bytes(audio_bytes)
    print("ok", len(audio_bytes))
