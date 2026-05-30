"""Tests for src/core/dispatch/selector.py."""
import math
import pytest
import time
from unittest.mock import patch

from src.core.dispatch.selector import Selector, CandidateStats, _S
from src.core.dispatch.candidate import Candidate


class TestCandidateStats:
    def test_default_values(self):
        stats = CandidateStats()
        assert stats.alpha == 1.0
        assert stats.beta_p == 1.0
        assert stats.reqs == 0
        assert stats.succ == 0
        assert stats.fail == 0
        assert stats.ema_lat == 1.0
        assert stats.ema_thr == 10.0

    def test_record_ok(self):
        stats = CandidateStats()
        stats.record_ok(lat=0.5, tok=100, dur=2.0)

        assert stats.reqs == 1
        assert stats.succ == 1
        assert stats.fs == 0
        assert stats.alpha == 2.0
        assert len(stats.samples) == 1

    def test_record_fail(self):
        stats = CandidateStats()
        stats.record_fail()

        assert stats.reqs == 1
        assert stats.fail == 1
        assert stats.fs == 1
        assert stats.beta_p == 2.0
        assert stats.ft > 0

    def test_success_rate(self):
        stats = CandidateStats(alpha=3.0, beta_p=1.0)
        # sr = alpha / (alpha + beta_p) = 3 / 4 = 0.75
        assert abs(stats.sr - 0.75) < 0.001

    def test_beta_variance(self):
        stats = CandidateStats(alpha=2.0, beta_p=2.0)
        var = stats.var
        assert var > 0
        # Variance should be positive and reasonable

    def test_cooling_state(self):
        stats = CandidateStats()
        # Initially not in cooling (fs=0)
        assert stats.cooling is False

        # After failures with recent timestamp
        stats.fs = 3
        stats.ft = time.time()
        assert stats.cooling is True

    def test_cooling_expired(self):
        stats = CandidateStats()
        stats.fs = 1
        # Set failure time far in the past
        stats.ft = time.time() - 1000
        assert stats.cooling is False

    def test_score_calculation(self):
        stats = CandidateStats()
        stats.record_ok(lat=1.0, tok=50, dur=5.0)
        score = stats.score()
        assert isinstance(score, float)
        assert 0 <= score <= 1

    def test_thompson_sampling(self):
        stats = CandidateStats(alpha=2.0, beta_p=2.0)
        # Should return value between 0 and 1
        sample = stats.thompson()
        assert 0 <= sample <= 1

    def test_thompson_sampling_edge_cases(self):
        # Test with zero/negative values (should handle gracefully)
        stats = CandidateStats(alpha=0.001, beta_p=0.001)
        sample = stats.thompson()
        assert 0 <= sample <= 1

    def test_to_dict(self):
        stats = CandidateStats()
        stats.record_ok(lat=0.5, tok=100, dur=2.0)
        stats.record_fail()

        d = stats.to_dict()
        assert "alpha" in d
        assert "beta_p" in d
        assert "reqs" in d
        assert "succ" in d
        assert "fail" in d
        assert "ema_lat" in d
        assert "ema_thr" in d
        assert "score" in d
        assert "sr" in d
        assert "cooling" in d


class TestSelector:
    def test_init(self):
        selector = Selector()
        assert selector._eps > 0
        assert selector._n == 0

    @pytest.mark.asyncio
    async def test_select_empty_returns_empty(self):
        selector = Selector()
        result = await selector.select([])
        assert result == []

    @pytest.mark.asyncio
    async def test_select_single_candidate(self):
        selector = Selector()
        cand = Candidate(id="test_123", platform="test", resource_id="r1")

        result = await selector.select([cand], count=1)
        assert len(result) == 1
        assert result[0] is cand

    @pytest.mark.asyncio
    async def test_select_multiple_candidates(self):
        selector = Selector()
        cands = [
            Candidate(id="test_1", platform="test", resource_id="r1"),
            Candidate(id="test_2", platform="test", resource_id="r2"),
            Candidate(id="test_3", platform="test", resource_id="r3"),
        ]

        result = await selector.select(cands, count=2)
        assert len(result) == 2

    @pytest.mark.asyncio
    async def test_select_respects_count(self):
        selector = Selector()
        cands = [
            Candidate(id="test_1", platform="test", resource_id="r1"),
            Candidate(id="test_2", platform="test", resource_id="r2"),
        ]

        result = await selector.select(cands, count=1)
        assert len(result) == 1

    @pytest.mark.asyncio
    async def test_record_success(self):
        selector = Selector()
        await selector.record("test_123", success=True, latency=0.5, tokens=100, duration=2.0)

        stats = selector._st["test_123"]
        assert stats.reqs == 1
        assert stats.succ == 1

    @pytest.mark.asyncio
    async def test_record_fail(self):
        selector = Selector()
        await selector.record("test_123", success=False)

        stats = selector._st["test_123"]
        assert stats.reqs == 1
        assert stats.fail == 1

    @pytest.mark.asyncio
    async def test_get_stats(self):
        selector = Selector()
        await selector.record("test_123", success=True)

        stats_dict = await selector.get_stats()
        assert "test_123" in stats_dict
        assert isinstance(stats_dict["test_123"], dict)

    @pytest.mark.asyncio
    async def test_cooling_filter(self):
        selector = Selector()
        cands = [
            Candidate(id="test_1", platform="test", resource_id="r1"),
            Candidate(id="test_2", platform="test", resource_id="r2"),
        ]

        # Make test_1 cooling
        selector._st["test_1"] = CandidateStats()
        selector._st["test_1"].fs = 2
        selector._st["test_1"].ft = time.time()

        # Select should filter cooling candidates
        result = await selector.select(cands, count=1)
        # Should select the non-cooling one
        assert result[0].id == "test_2"

    def test_stop_criterion_insufficient_samples(self):
        selector = Selector()
        cands = [
            Candidate(id="test_1", platform="test", resource_id="r1"),
            Candidate(id="test_2", platform="test", resource_id="r2"),
        ]

        # With no records, should return False (need more samples)
        result = selector._stop(cands)
        assert result is False

    def test_thompson_selection(self):
        selector = Selector()
        cands = [
            Candidate(id="test_1", platform="test", resource_id="r1"),
            Candidate(id="test_2", platform="test", resource_id="r2"),
        ]

        result = selector._ts(cands)
        assert result in cands
