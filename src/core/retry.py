"""重试策略"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Callable, Optional

__all__ = ["retry_with_backoff", "retry_on_empty"]
logger = logging.getLogger(__name__)


async def retry_with_backoff(
    func: Callable[..., Any], *a: Any, max_attempts: int = 5, **kw: Any
) -> Any:
    """指数退避重试策略

    Args:
        func: 待重试的异步可调用对象
        *a: 位置参数
        max_attempts: 最大重试次数，默认 5 次
        **kw: 关键字参数

    Returns:
        函数返回值

    Raises:
        Exception: 达到最大重试次数后抛出最后一次异常
    """
    last: Optional[Exception] = None
    for i in range(max_attempts):
        try:
            return await func(*a, **kw)
        except Exception as e:
            last = e
            if i < max_attempts - 1:
                d = min(1 * (2**i), 60)
                logger.warning("重试 %d/%d: %s, %.0fs 后", i + 1, max_attempts, e, d)
                await asyncio.sleep(d)
    raise last  # type: ignore


async def retry_on_empty(
    func: Callable[..., Any], *a: Any, max_retries: int = 3, **kw: Any
) -> Any:
    """空响应重试策略，若返回空值或空内容则重试

    Args:
        func: 待重试的异步可调用对象
        *a: 位置参数
        max_retries: 最大重试次数，默认 3 次
        **kw: 关键字参数

    Returns:
        非空函数返回值

    Raises:
        ValueError: 达到最大重试次数后抛出异常
    """
    for i in range(max_retries):
        try:
            r = await func(*a, **kw)
            if r is None:
                raise ValueError("None")
            if isinstance(r, str) and not r.strip():
                raise ValueError("empty")
            if isinstance(r, dict):
                c = r.get("text", r.get("content", ""))
                if isinstance(c, str) and not c.strip():
                    raise ValueError("empty content")
            return r
        except ValueError:
            if i < max_retries - 1:
                await asyncio.sleep(1.0 * (2**i))
            else:
                raise
