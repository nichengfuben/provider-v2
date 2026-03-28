"""核心网关——并发竞速 + fncall + thinking/search + 多服务分发 + token 计数回退"""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, AsyncGenerator, Dict, List, Optional, Union

from src.core.candidate import Candidate
from src.core.config import get_config
from src.core.errors import (
    NoCandidateError,
    ProviderError,
    UnsupportedServiceError,
)
from src.core.tools import FncallStreamParser, inject_fncall

__all__ = [
    "dispatch",
    "dispatch_embed",
    "dispatch_tts",
    "dispatch_stt",
    "dispatch_image_gen",
    "dispatch_moderation",
]
logger = logging.getLogger(__name__)


def _fallback_usage(prompt_len: int, resp_text: str) -> Dict[str, int]:
    """基于字符长度的粗略 token 估算回退"""
    pt = max(prompt_len // 3, 1)
    ct = max(len(resp_text) // 3, 0)
    return {"prompt_tokens": pt, "completion_tokens": ct, "total_tokens": pt + ct}


def _normalize_usage(
    raw: Dict[str, Any], prompt_len: int, resp_text: str
) -> Dict[str, int]:
    """规范化平台返回的 usage 数据"""
    try:
        pt = int(raw.get("prompt_tokens", raw.get("input_tokens", 0)))
        ct = int(raw.get("completion_tokens", raw.get("output_tokens", 0)))
        if pt <= 0 and ct <= 0:
            return _fallback_usage(prompt_len, resp_text)
        if pt <= 0:
            pt = prompt_len // 3
        return {"prompt_tokens": pt, "completion_tokens": ct, "total_tokens": pt + ct}
    except (TypeError, ValueError):
        return _fallback_usage(prompt_len, resp_text)


async def _wait_for_candidates(
    registry: Any,
    model: str,
    timeout: float = 15.0,
    capability: Optional[str] = None,
) -> List[Candidate]:
    """等待符合条件的候选项出现"""
    deadline = time.time() + timeout
    cfg = get_config()
    while time.time() < deadline:
        cands = await registry.get_candidates(model, capability=capability)
        if cands:
            return cands
        await registry.ensure_candidates(model, max(cfg.gateway.concurrent_count, 3))
        await asyncio.sleep(1.0)
    return []


# ---------------------------------------------------------------------------
# chat / completion 分发
# ---------------------------------------------------------------------------


async def dispatch(
    registry: Any,
    messages: List[Dict],
    model: str,
    stream: bool,
    *,
    tools: Optional[List[Dict]] = None,
    thinking: bool = False,
    search: bool = False,
    temperature: Optional[float] = None,
    top_p: Optional[float] = None,
    max_tokens: Optional[int] = None,
    stop: Optional[List[str]] = None,
) -> AsyncGenerator[Union[str, Dict[str, Any]], None]:
    """核心文本生成分发"""
    cfg = get_config()

    # reasoner 模型不注入 fncall
    if tools and "reasoner" not in model.lower():
        final_msgs = inject_fncall(messages, tools, "en")
    else:
        final_msgs = messages

    cands = await _wait_for_candidates(registry, model, timeout=15.0, capability="chat")
    if not cands:
        raise NoCandidateError(f"无候选项: {model}")

    n = 1
    if cfg.gateway.concurrent_enabled and len(cands) > 1:
        n = min(cfg.gateway.concurrent_count, len(cands))
    sel = await registry.selector.select(cands, n)
    if not sel:
        raise NoCandidateError("TAS 选择失败")

    kw: Dict[str, Any] = {}
    if temperature is not None:
        kw["temperature"] = temperature
    if top_p is not None:
        kw["top_p"] = top_p
    if max_tokens is not None:
        kw["max_tokens"] = max_tokens
    if stop:
        kw["stop"] = stop

    prompt_len = sum(len(str(m.get("content", ""))) for m in final_msgs)

    if len(sel) == 1:
        async for chunk in _single(
            registry,
            sel[0],
            final_msgs,
            model,
            stream,
            thinking,
            search,
            tools,
            prompt_len,
            **kw,
        ):
            yield chunk
        return
    async for chunk in _race(
        registry,
        sel,
        final_msgs,
        model,
        stream,
        thinking,
        search,
        tools,
        prompt_len,
        cfg.gateway.min_tokens,
        **kw,
    ):
        yield chunk


# ---------------------------------------------------------------------------
# embedding 分发
# ---------------------------------------------------------------------------


async def dispatch_embed(
    registry: Any,
    input_data: Union[str, List[str]],
    model: str,
) -> Dict[str, Any]:
    """嵌入向量分发

    Returns:
        OpenAI 兼容的 embedding 响应字典
    """
    cands = await _wait_for_candidates(
        registry, model, timeout=15.0, capability="embedding"
    )
    if not cands:
        raise NoCandidateError(f"无 embedding 候选项: {model}")
    sel = await registry.selector.select(cands, 1)
    if not sel:
        raise NoCandidateError("TAS 选择失败 (embedding)")
    cand = sel[0]
    adapter = registry.adapter_for(cand)
    if not adapter:
        raise ProviderError(f"无适配器: {cand.platform}")
    if not hasattr(adapter, "embed") or adapter.embed is None:
        raise UnsupportedServiceError(f"{cand.platform} 不支持 embedding")
    start = time.time()
    ok = False
    try:
        result = await adapter.embed(cand, input_data, model)
        ok = True
        return result
    finally:
        dur = time.time() - start
        await registry.selector.record(cand.id, ok, latency=dur, tokens=0, duration=dur)


# ---------------------------------------------------------------------------
# TTS 分发
# ---------------------------------------------------------------------------


async def dispatch_tts(
    registry: Any,
    text: str,
    model: str,
    voice: str = "alloy",
    response_format: str = "mp3",
    speed: float = 1.0,
) -> AsyncGenerator[bytes, None]:
    """文本转语音分发，流式产出音频字节"""
    cands = await _wait_for_candidates(
        registry, model, timeout=15.0, capability="tts"
    )
    if not cands:
        raise NoCandidateError(f"无 TTS 候选项: {model}")
    sel = await registry.selector.select(cands, 1)
    if not sel:
        raise NoCandidateError("TAS 选择失败 (TTS)")
    cand = sel[0]
    adapter = registry.adapter_for(cand)
    if not adapter:
        raise ProviderError(f"无适配器: {cand.platform}")
    if not hasattr(adapter, "text_to_speech") or adapter.text_to_speech is None:
        raise UnsupportedServiceError(f"{cand.platform} 不支持 TTS")
    start = time.time()
    ok = False
    try:
        async for chunk in adapter.text_to_speech(
            cand, text, model, voice=voice,
            response_format=response_format, speed=speed,
        ):
            yield chunk
        ok = True
    finally:
        dur = time.time() - start
        await registry.selector.record(cand.id, ok, latency=dur, tokens=0, duration=dur)


# ---------------------------------------------------------------------------
# STT 分发
# ---------------------------------------------------------------------------


async def dispatch_stt(
    registry: Any,
    audio_data: bytes,
    model: str,
    language: Optional[str] = None,
    response_format: str = "json",
) -> Dict[str, Any]:
    """语音转文本分发"""
    cands = await _wait_for_candidates(
        registry, model, timeout=15.0, capability="stt"
    )
    if not cands:
        raise NoCandidateError(f"无 STT 候选项: {model}")
    sel = await registry.selector.select(cands, 1)
    if not sel:
        raise NoCandidateError("TAS 选择失败 (STT)")
    cand = sel[0]
    adapter = registry.adapter_for(cand)
    if not adapter:
        raise ProviderError(f"无适配器: {cand.platform}")
    if not hasattr(adapter, "speech_to_text") or adapter.speech_to_text is None:
        raise UnsupportedServiceError(f"{cand.platform} 不支持 STT")
    start = time.time()
    ok = False
    try:
        result = await adapter.speech_to_text(
            cand, audio_data, model, language=language,
            response_format=response_format,
        )
        ok = True
        return result
    finally:
        dur = time.time() - start
        await registry.selector.record(cand.id, ok, latency=dur, tokens=0, duration=dur)


# ---------------------------------------------------------------------------
# 图像生成分发
# ---------------------------------------------------------------------------


async def dispatch_image_gen(
    registry: Any,
    prompt: str,
    model: str,
    n: int = 1,
    size: str = "1024x1024",
    response_format: str = "url",
    quality: str = "standard",
    style: str = "vivid",
) -> Dict[str, Any]:
    """图像生成分发"""
    cands = await _wait_for_candidates(
        registry, model, timeout=15.0, capability="image_gen"
    )
    if not cands:
        raise NoCandidateError(f"无 image_gen 候选项: {model}")
    sel = await registry.selector.select(cands, 1)
    if not sel:
        raise NoCandidateError("TAS 选择失败 (image_gen)")
    cand = sel[0]
    adapter = registry.adapter_for(cand)
    if not adapter:
        raise ProviderError(f"无适配器: {cand.platform}")
    if not hasattr(adapter, "generate_image") or adapter.generate_image is None:
        raise UnsupportedServiceError(f"{cand.platform} 不支持 image_gen")
    start = time.time()
    ok = False
    try:
        result = await adapter.generate_image(
            cand, prompt, model, n=n, size=size,
            response_format=response_format,
            quality=quality, style=style,
        )
        ok = True
        return result
    finally:
        dur = time.time() - start
        await registry.selector.record(cand.id, ok, latency=dur, tokens=0, duration=dur)


# ---------------------------------------------------------------------------
# 内容审核分发
# ---------------------------------------------------------------------------


async def dispatch_moderation(
    registry: Any,
    input_data: Union[str, List[str]],
    model: str = "text-moderation-latest",
) -> Dict[str, Any]:
    """内容审核分发"""
    cands = await _wait_for_candidates(
        registry, model, timeout=15.0, capability="moderation"
    )
    if not cands:
        raise NoCandidateError(f"无 moderation 候选项: {model}")
    sel = await registry.selector.select(cands, 1)
    if not sel:
        raise NoCandidateError("TAS 选择失败 (moderation)")
    cand = sel[0]
    adapter = registry.adapter_for(cand)
    if not adapter:
        raise ProviderError(f"无适配器: {cand.platform}")
    if not hasattr(adapter, "moderate") or adapter.moderate is None:
        raise UnsupportedServiceError(f"{cand.platform} 不支持 moderation")
    start = time.time()
    ok = False
    try:
        result = await adapter.moderate(cand, input_data, model)
        ok = True
        return result
    finally:
        dur = time.time() - start
        await registry.selector.record(cand.id, ok, latency=dur, tokens=0, duration=dur)


# ---------------------------------------------------------------------------
# 以下为 chat 内部实现
# ---------------------------------------------------------------------------


async def _single(
    reg: Any,
    cand: Candidate,
    msgs: List[Dict],
    model: str,
    stream: bool,
    thinking: bool,
    search: bool,
    tools: Optional[List[Dict]],
    prompt_len: int,
    **kw: Any,
) -> AsyncGenerator[Union[str, Dict], None]:
    adapter = reg.adapter_for(cand)
    if not adapter:
        raise ProviderError(f"无适配器: {cand.platform}")
    fp = FncallStreamParser(tools=tools) if tools else None
    start = time.time()
    ft: Optional[float] = None
    tc = 0
    ok = False
    p_usage: Optional[Dict] = None
    acc = ""
    try:
        async for chunk in adapter.complete(
            cand, msgs, model, stream, thinking=thinking, search=search, **kw
        ):
            if isinstance(chunk, str):
                tc += 1
                acc += chunk
                if ft is None:
                    ft = time.time()
                if fp:
                    fp.feed(chunk)
                yield chunk
            elif isinstance(chunk, dict):
                if "usage" in chunk:
                    p_usage = chunk["usage"]
                else:
                    yield chunk
        if fp and fp.has_calls:
            _, calls = fp.finalize()
            if calls:
                yield {"tool_calls": calls}
        usage = (
            _normalize_usage(p_usage, prompt_len, acc)
            if p_usage
            else _fallback_usage(prompt_len, acc)
        )
        yield {"usage": usage}
        ok = True
    except Exception:
        raise
    finally:
        dur = time.time() - start
        lat = (ft - start) if ft else dur
        await reg.selector.record(cand.id, ok, latency=lat, tokens=tc, duration=dur)


async def _race(
    reg: Any,
    cands: List[Candidate],
    msgs: List[Dict],
    model: str,
    stream: bool,
    thinking: bool,
    search: bool,
    tools: Optional[List[Dict]],
    prompt_len: int,
    min_tok: int,
    **kw: Any,
) -> AsyncGenerator[Union[str, Dict], None]:
    infos: List[Dict[str, Any]] = []

    async def _w(
        idx: int, c: Candidate, q: asyncio.Queue, ev: asyncio.Event
    ) -> None:
        a = reg.adapter_for(c)
        if not a:
            try:
                await q.put(("err", idx, f"无适配器: {c.platform}"))
            except Exception:
                pass
            return
        try:
            async for ch in a.complete(
                c, msgs, model, stream, thinking=thinking, search=search, **kw
            ):
                if ev.is_set():
                    break
                await q.put(("chunk", idx, ch))
            await q.put(("done", idx, None))
        except asyncio.CancelledError:
            try:
                await q.put(("cancel", idx, None))
            except Exception:
                pass
        except Exception as e:
            try:
                await q.put(("err", idx, str(e)))
            except Exception:
                pass

    for i, c in enumerate(cands):
        q: asyncio.Queue = asyncio.Queue()
        ev = asyncio.Event()
        t = asyncio.create_task(_w(i, c, q, ev))
        infos.append(
            {
                "idx": i,
                "cand": c,
                "q": q,
                "ev": ev,
                "task": t,
                "tok": 0,
                "buf": [],
                "start": time.time(),
                "ft": None,
                "done": False,
                "err": False,
                "acc": "",
                "usage": None,
            }
        )

    winner: Optional[Dict] = None
    try:
        while winner is None:
            if all(i["done"] or i["err"] for i in infos):
                break
            for info in infos:
                if info["done"] or info["err"]:
                    continue
                try:
                    tp, _, data = info["q"].get_nowait()
                except asyncio.QueueEmpty:
                    continue
                if tp == "chunk":
                    info["buf"].append(data)
                    if isinstance(data, str):
                        info["tok"] += 1
                        info["acc"] += data
                        if info["ft"] is None:
                            info["ft"] = time.time()
                        if info["tok"] >= min_tok:
                            winner = info
                            break
                    elif isinstance(data, dict) and "usage" in data:
                        info["usage"] = data["usage"]
                elif tp == "done":
                    info["done"] = True
                elif tp in ("err", "cancel"):
                    info["err"] = True
            if winner is None:
                await asyncio.sleep(0.02)

        if winner is None:
            valid = [i for i in infos if i["buf"] and not i["err"]]
            if valid:
                winner = max(valid, key=lambda x: x["tok"])
            else:
                for i in infos:
                    await _rec(reg, i, False, prompt_len)
                raise NoCandidateError("所有并发请求失败")

        for i in infos:
            if i is not winner:
                i["ev"].set()
                if not i["task"].done():
                    i["task"].cancel()
                await _rec(reg, i, i["tok"] > 0, prompt_len)

        fp = FncallStreamParser(tools=tools) if tools else None
        for ch in winner["buf"]:
            if isinstance(ch, str) and fp:
                fp.feed(ch)
            if isinstance(ch, dict) and "usage" in ch:
                winner["usage"] = ch["usage"]
                continue
            yield ch

        if not winner["done"]:
            while True:
                try:
                    tp, _, data = await asyncio.wait_for(winner["q"].get(), 600)
                    if tp == "chunk":
                        if isinstance(data, str):
                            winner["tok"] += 1
                            winner["acc"] += data
                            if fp:
                                fp.feed(data)
                        elif isinstance(data, dict) and "usage" in data:
                            winner["usage"] = data["usage"]
                            continue
                        yield data
                    elif tp in ("done", "err", "cancel"):
                        break
                except asyncio.TimeoutError:
                    break

        if fp and fp.has_calls:
            _, calls = fp.finalize()
            if calls:
                yield {"tool_calls": calls}
        usage = (
            _normalize_usage(winner["usage"], prompt_len, winner["acc"])
            if winner["usage"]
            else _fallback_usage(prompt_len, winner["acc"])
        )
        yield {"usage": usage}
        await _rec(reg, winner, True, prompt_len)
    except NoCandidateError:
        raise
    except Exception:
        for i in infos:
            i["ev"].set()
            if not i["task"].done():
                i["task"].cancel()
        raise


async def _rec(reg: Any, info: Dict, ok: bool, prompt_len: int) -> None:
    """记录候选项的性能数据"""
    try:
        dur = time.time() - info["start"]
        lat = (info["ft"] - info["start"]) if info["ft"] else dur
        await reg.selector.record(
            info["cand"].id, ok, latency=lat, tokens=info["tok"], duration=dur
        )
    except Exception:
        pass
