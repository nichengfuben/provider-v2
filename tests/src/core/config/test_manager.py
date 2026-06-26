"""Tests for src/core/config/manager.py."""
import asyncio
import pytest
from unittest.mock import MagicMock

from src.core.config.manager import ConfigManager


class TestConfigManagerInit:
    def test_init_sets_defaults(self):
        mgr = ConfigManager()
        assert mgr._config is None


class TestConfigManagerProperty:
    def test_config_raises_when_not_loaded(self):
        mgr = ConfigManager()
        with pytest.raises(RuntimeError, match="Config not loaded yet"):
            _ = mgr.config

    def test_config_path_when_not_loaded(self):
        mgr = ConfigManager()
        assert mgr._config_path is None


class TestConfigManagerRepr:
    def test_repr_returns_string(self):
        mgr = ConfigManager()
        r = repr(mgr)
        assert isinstance(r, str)


class TestConfigManagerColorDedup:
    def test_apply_color_does_not_crash_without_config(self):
        mgr = ConfigManager()
        # Should not raise even when _config is None
        mgr._apply_color()
