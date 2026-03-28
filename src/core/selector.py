"""Track-and-Stop TAS（唯一实例）"""

from __future__ import annotations

import asyncio
import logging
import math
import random
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Any, Deque, Dict, List

from src.core.candidate import Candidate

__all__ = ["Selector", "CandidateStats"]
logger = logging.getLogger(__name__)

W = 200
MS = 3
ER = 0.1
DC = 0.995
ME = 0.02
LW = 0.4
SW = 0.4
TW = 0.2
CD = 30.0


@dataclass
class _S:
    ts: float
    lat: float
    ok: bool
    tok: int
    dur: float


@dataclass
class CandidateStats:
    """候选项性能统计"""

    alpha: float = 1.0
    beta_p: float = 1.0
    reqs: int = 0
    succ: int = 0
    fail: int = 0
    ema_lat: float = 1.0
    ema_thr: float = 10.0
    ft: float = 0.0
    fs: int = 0
    explores: int = 0
    exploits: int = 0
    samples: Deque[_S] = field(default_factory=lambda: deque(maxlen=W))

    def record_ok(self, lat: float, tok: int, dur: float) -> None:
        self.reqs += 1
        self.succ += 1
        self.fs = 0
        self.alpha += 1
        a = 0.2
        self.ema_lat = a * lat + (1 - a) * self.ema_lat
        if dur > 0 and tok > 0:
            self.ema_thr = a * (tok / dur) + (1 - a) * self.ema_thr
        self.samples.append(_S(time.time(), lat, True, tok, dur))

    def record_fail(self) -> None:
        self.reqs += 1
        self.fail += 1
        self.fs += 1
        self.ft = time.time()
        self.beta_p += 1
        self.samples.append(_S(time.time(), float("inf"), False, 0, 0))

    @property
    def sr(self) -> float:
        return self.alpha / (self.alpha + self.beta_p)

    @property
    def var(self) -> float:
        t = self.alpha + self.beta_p
        return (self.alpha * self.beta_p) / (t * t * (t + 1))

    @property
    def cooling(self) -> bool:
        return self.fs > 0 and time.time() - self.ft < CD * min(self.fs, 10)

    def score(self) -> float:
        nl = 1 / (1 + math.exp(self.ema_lat - 2))
        nt = 1 / (1 + math.exp(-(self.ema_thr - 5) / 5))
        return SW * self.sr + LW * nl + TW * nt

    def thompson(self) -> float:
        try:
            x = random.gammavariate(self.alpha, 1)
            y = random.gammavariate(self.beta_p, 1)
            return x / (x + y) if x + y > 0 else 0.5
        except (ValueError, ZeroDivisionError):
            return 0.5

    def to_dict(self) -> Dict[str, Any]:
        return {
            "alpha": self.alpha,
            "beta_p": self.beta_p,
            "reqs": self.reqs,
            "succ": self.succ,
            "fail": self.fail,
            "ema_lat": round(self.ema_lat, 3),
            "ema_thr": round(self.ema_thr, 1),
            "score": round(self.score(), 4),
            "sr": round(self.sr, 4),
            "cooling": self.cooling,
        }


class Selector:
    """TAS 选择器"""

    def __init__(self) -> None:
        self._st: Dict[str, CandidateStats] = {}
        self._eps = ER
        self._n = 0
        self._lk = asyncio.Lock()

    def _e(self, cid: str) -> CandidateStats:
        if cid not in self._st:
            self._st[cid] = CandidateStats()
        return self._st[cid]

    async def select(self, cands: List[Candidate], count: int = 1) -> List[Candidate]:
        """选择候选项"""
        async with self._lk:
            if not cands:
                return []
            act = [c for c in cands if not self._e(c.id).cooling] or sorted(
                cands, key=lambda c: self._e(c.id).ft
            )[:1]
            self._n += 1
            sel: List[Candidate] = []
            for _ in range(min(count, len(act))):
                rem = [c for c in act if c not in sel]
                if not rem:
                    break
                stop = self._stop(rem)
                explore = random.random() < self._eps
                if stop and not explore:
                    p = max(rem, key=lambda c: self._e(c.id).score())
                    self._e(p.id).exploits += 1
                else:
                    p = self._ts(rem)
                    self._e(p.id).explores += 1
                sel.append(p)
            self._eps = max(ME, self._eps * DC)
            return sel

    def _stop(self, cs: List[Candidate]) -> bool:
        for c in cs:
            if self._e(c.id).reqs < MS:
                return False
        if len(cs) < 2:
            return self._e(cs[0].id).reqs >= MS
        rk = sorted(cs, key=lambda c: self._e(c.id).score(), reverse=True)
        s0, s1 = self._e(rk[0].id), self._e(rk[1].id)
        return (
            s0.score() - s1.score() > math.sqrt(s0.var) + math.sqrt(s1.var)
            and s0.reqs >= MS * 2
        )

    def _ts(self, cs: List[Candidate]) -> Candidate:
        best_s, best = -1.0, cs[0]
        for c in cs:
            s = self._e(c.id)
            sc = (
                SW * s.thompson()
                + LW * (1 / (1 + math.exp(s.ema_lat - 2)) + random.gauss(0, 0.05))
                + TW
                * (1 / (1 + math.exp(-(s.ema_thr - 5) / 5)) + random.gauss(0, 0.05))
            )
            if sc > best_s:
                best_s, best = sc, c
        return best

    async def record(
        self,
        cid: str,
        success: bool,
        latency: float = 0,
        tokens: int = 0,
        duration: float = 0,
    ) -> None:
        """记录指标"""
        async with self._lk:
            s = self._e(cid)
            if success:
                s.record_ok(latency, tokens, duration)
            else:
                s.record_fail()

    async def get_stats(self) -> Dict[str, Any]:
        async with self._lk:
            return {k: v.to_dict() for k, v in self._st.items()}
