#!/usr/bin/env python3
"""
使用 Playwright 下载文叔叔网盘文件 - 6个新压缩包
"""

import asyncio
import os
import shutil
from pathlib import Path
from playwright.async_api import async_playwright

# 下载配置
DOWNLOADS = [
    {
        "url": "https://c.wss.ink/f/jiweaaoznl1",
        "filename": "new_pkg1.zip",
    },
    {
        "url": "https://c.wss.ink/f/jiwf8sch8mc",
        "filename": "new_pkg2.zip",
    },
    {
        "url": "https://c.wss.ink/f/jiwff9yzcv8",
        "filename": "new_pkg3.zip",
    },
    {
        "url": "https://c.wss.ink/f/jiwfqgkp0dh",
        "filename": "new_pkg4.zip",
    },
    {
        "url": "https://c.wss.ink/f/jiwgjiw31gl",
        "filename": "new_pkg5.zip",
    },
    {
        "url": "https://c.wss.ink/f/jiwgn78pfv7",
        "filename": "new_pkg6.zip",
    },
]

DOWNLOAD_DIR = Path("/home/z/my-project/download")


async def download_file(page, url: str, target_filename: str) -> bool:
    """下载单个文件"""
    print(f"\n{'='*60}")
    print(f"开始下载: {url}")
    print(f"目标文件: {target_filename}")
    print(f"{'='*60}")
    
    target_path = DOWNLOAD_DIR / target_filename
    
    # 如果文件已存在，删除它
    if target_path.exists():
        print(f"删除已存在的文件: {target_path}")
        target_path.unlink()
    
    try:
        # 打开页面
        print(f"正在打开页面: {url}")
        await page.goto(url, wait_until="networkidle", timeout=60000)
        
        # 等待页面加载
        await asyncio.sleep(2)
        
        # 截图调试
        screenshot_path = DOWNLOAD_DIR / f"debug_{target_filename}.png"
        await page.screenshot(path=str(screenshot_path))
        print(f"页面截图保存到: {screenshot_path}")
        
        # 获取页面标题
        title = await page.title()
        print(f"页面标题: {title}")
        
        # 查找下载按钮 - 文叔叔网盘通常有"下载"按钮
        # 尝试多种选择器
        download_selectors = [
            "button:has-text('下载')",
            "a:has-text('下载')",
            ".download-btn",
            "[class*='download']",
            "button.ant-btn:has-text('下载')",
            "button:has-text('普通下载')",
            "a:has-text('普通下载')",
            "button:has-text('立即下载')",
            "a:has-text('立即下载')",
            ".btn-download",
            "#download-btn",
        ]
        
        download_button = None
        for selector in download_selectors:
            try:
                element = page.locator(selector).first
                if await element.count() > 0:
                    download_button = element
                    print(f"找到下载按钮，选择器: {selector}")
                    break
            except Exception as e:
                continue
        
        if download_button is None:
            # 打印页面HTML以便调试
            html = await page.content()
            debug_html_path = DOWNLOAD_DIR / f"debug_{target_filename}.html"
            debug_html_path.write_text(html, encoding='utf-8')
            print(f"页面HTML保存到: {debug_html_path}")
            print(f"页面内容片段:\n{html[:2000]}")
            print("未找到下载按钮!")
            return False
        
        # 设置下载处理器
        async with page.expect_download(timeout=120000) as download_info:
            print("点击下载按钮...")
            await download_button.click()
        
        download = await download_info.value
        
        # 等待下载完成
        print(f"正在下载文件...")
        await download.path()  # 等待下载完成
        
        # 获取下载的文件路径
        downloaded_path = await download.path()
        print(f"下载完成，临时文件: {downloaded_path}")
        
        # 移动文件到目标位置
        shutil.move(str(downloaded_path), str(target_path))
        print(f"文件已保存到: {target_path}")
        
        # 验证文件
        if target_path.exists():
            file_size = target_path.stat().st_size
            print(f"文件大小: {file_size} bytes ({file_size/1024/1024:.2f} MB)")
            return True
        else:
            print("文件保存失败!")
            return False
            
    except Exception as e:
        print(f"下载出错: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """主函数"""
    print("="*60)
    print("文叔叔网盘文件下载工具 - 6个新压缩包")
    print("="*60)
    print(f"下载目录: {DOWNLOAD_DIR}")
    
    # 确保下载目录存在
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    results = []
    
    async with async_playwright() as p:
        # 启动浏览器
        print("\n正在启动浏览器...")
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ]
        )
        
        context = await browser.new_context(
            accept_downloads=True,
        )
        
        page = await context.new_page()
        
        # 依次下载每个文件
        for i, item in enumerate(DOWNLOADS, 1):
            print(f"\n\n{'#'*60}")
            print(f"下载任务 {i}/{len(DOWNLOADS)}")
            print(f"{'#'*60}")
            
            success = await download_file(page, item["url"], item["filename"])
            results.append({
                "url": item["url"],
                "filename": item["filename"],
                "success": success
            })
            
            if success:
                print(f"✓ 文件 {item['filename']} 下载成功!")
            else:
                print(f"✗ 文件 {item['filename']} 下载失败!")
            
            # 文件之间等待一下
            if i < len(DOWNLOADS):
                await asyncio.sleep(2)
        
        await browser.close()
    
    # 打印结果汇总
    print("\n\n" + "="*60)
    print("下载结果汇总")
    print("="*60)
    for r in results:
        status = "✓ 成功" if r["success"] else "✗ 失败"
        print(f"{r['filename']}: {status}")
    
    success_count = sum(1 for r in results if r["success"])
    print(f"\n总计: {success_count}/{len(results)} 个文件下载成功")


if __name__ == "__main__":
    asyncio.run(main())
