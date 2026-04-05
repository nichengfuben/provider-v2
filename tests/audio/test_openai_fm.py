from __future__ import annotations

import asyncio
import sys
from pathlib import Path

import aiohttp
import pytest

ROOT = Path(__file__).resolve().parents[2]
SRC_ROOT = ROOT / "src"
for p in (ROOT, SRC_ROOT):
    p_str = str(p)
    if p_str not in sys.path:
        sys.path.insert(0, p_str)

import types
from importlib.machinery import SourceFileLoader

_accounts_path = ROOT / "src/platforms/openai_fm/accounts.py"
_accounts_mod = types.ModuleType("openai_fm_accounts")
SourceFileLoader("openai_fm_accounts", str(_accounts_path)).exec_module(_accounts_mod)
accounts = _accounts_mod

from src.platforms.openai_fm.adapter import OpenaiFmAdapter


def _prepare_accounts() -> None:
    """允许无 Cookie，使用空凭证占位。"""
    accounts.API_KEYS[:] = [""]


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
