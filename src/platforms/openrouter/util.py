"""openrouter 工具"""

from __future__ import annotations

import ssl


def make_ssl_ctx() -> ssl.SSLContext:
    """创建禁用验证的 SSL 上下文"""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx
