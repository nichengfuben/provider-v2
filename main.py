#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Provider-V2 主入口——非阻塞启动，全程异步。"""

from __future__ import annotations

import asyncio
import logging
import signal
import ssl
import sys
from pathlib import Path
from typing import Optional

import aiohttp
import aiohttp.web

# 确保 src 在模块搜索路径中
_ROOT = Path(__file__).parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from src.core.config import get_config, start_config_watcher
from src.core.registry import Registry
from src.core.server import create_app
from src.core.watcher import FileWatcher

# 导入 proxy 触发 patch
import src.core.proxy  # noqa: F401

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")


def _make_connector() -> aiohttp.TCPConnector:
    """创建忽略 SSL 验证的 TCP 连接器。

    Returns:
        TCPConnector 实例。
    """
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return aiohttp.TCPConnector(ssl=ctx, limit=200, force_close=False)


async def _run() -> None:
    """异步主流程——启动所有组件，监听信号，优雅退出。"""
    cfg = get_config()
    host = cfg.server.host
    port = cfg.server.port

    connector = _make_connector()
    session = aiohttp.ClientSession(connector=connector)

    registry = Registry()
    await registry.init(session)

    app = await create_app(registry, session)
    runner = aiohttp.web.AppRunner(app)
    await runner.setup()
    site = aiohttp.web.TCPSite(runner, host, port)
    await site.start()

    logger.info("Provider-V2 已启动: http://%s:%d", host, port)

    # 启动后台任务
    stop_event = asyncio.Event()

    async def _config_watcher_task() -> None:
        """后台配置文件监视任务。"""
        await start_config_watcher(interval=2.0)

    async def _file_watcher_task() -> None:
        """后台文件变更监视任务。"""
        watcher = FileWatcher(_ROOT)
        await watcher.start(registry, session)

    def _on_signal() -> None:
        """收到退出信号时设置停止事件。"""
        logger.info("收到退出信号，准备优雅退出...")
        stop_event.set()

    loop = asyncio.get_event_loop()

    if sys.platform != "win32":
        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(sig, _on_signal)
    else:
        # Windows 下用 KeyboardInterrupt 捕获
        pass

    tasks = [
        asyncio.ensure_future(_config_watcher_task()),
        asyncio.ensure_future(_file_watcher_task()),
    ]

    try:
        if sys.platform == "win32":
            # Windows 下轮询等待
            while not stop_event.is_set():
                await asyncio.sleep(1.0)
        else:
            await stop_event.wait()
    except (KeyboardInterrupt, SystemExit):
        logger.info("收到键盘中断，正在退出...")
    finally:
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)

        logger.info("正在关闭注册表...")
        await registry.close()

        logger.info("正在关闭 HTTP Session...")
        await session.close()

        logger.info("正在停止 Web 服务器...")
        await runner.cleanup()

        logger.info("Provider-V2 已完全退出")


def main() -> None:
    """程序入口——跨平台兼容的事件循环启动。"""
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    try:
        asyncio.run(_run())
    except KeyboardInterrupt:
        logger.info("已退出")


if __name__ == "__main__":
    main()
