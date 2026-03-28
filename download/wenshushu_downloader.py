#!/usr/bin/env python3
"""
文叔叔网盘文件下载脚本
"""
import os
import time
from playwright.sync_api import sync_playwright

DOWNLOAD_DIR = "/home/z/my-project/download"

FILES = [
    {"url": "https://c.wss.ink/f/jiw1asj38gj", "save_as": "pkg1.zip"},
    {"url": "https://c.wss.ink/f/jiw1hy0mfmb", "save_as": "pkg2.zip"},
    {"url": "https://c.wss.ink/f/jiw1nw7ww6c", "save_as": "pkg3.zip"},
]

def download_file(page, url, save_as):
    """下载单个文件"""
    save_path = os.path.join(DOWNLOAD_DIR, save_as)
    
    # 如果文件已存在，删除它
    if os.path.exists(save_path):
        os.remove(save_path)
    
    print(f"正在访问: {url}")
    page.goto(url, wait_until="networkidle", timeout=60000)
    
    # 等待页面加载完成
    time.sleep(2)
    
    # 尝试找到下载按钮
    # 文叔叔的下载按钮可能有多种选择器
    selectors = [
        "button:has-text('下载')",
        ".download-btn",
        "[class*='download']",
        "a:has-text('下载')",
        ".btn-download",
        "button:has-text('立即下载')",
        "button:has-text('普通下载')",
    ]
    
    download_button = None
    for selector in selectors:
        try:
            elements = page.query_selector_all(selector)
            if elements:
                print(f"找到 {len(elements)} 个匹配选择器: {selector}")
                for elem in elements:
                    if elem.is_visible():
                        download_button = elem
                        print(f"使用可见按钮: {selector}")
                        break
                if download_button:
                    break
        except Exception as e:
            print(f"选择器 {selector} 错误: {e}")
            continue
    
    if download_button:
        # 监听下载事件
        with page.expect_download(timeout=120000) as download_info:
            download_button.click()
        
        download = download_info.value
        print(f"下载文件: {download.suggested_filename}")
        download.save_as(save_path)
        print(f"已保存到: {save_path}")
        return True
    else:
        print("未找到下载按钮，尝试其他方法...")
        
        # 获取页面内容，查找可能的下载链接
        content = page.content()
        print("页面标题:", page.title())
        
        # 尝试查找所有按钮
        buttons = page.query_selector_all("button")
        print(f"页面上有 {len(buttons)} 个按钮")
        for i, btn in enumerate(buttons):
            try:
                text = btn.inner_text()
                if text:
                    print(f"  按钮 {i}: {text[:50]}")
            except:
                pass
        
        # 尝试查找所有链接
        links = page.query_selector_all("a")
        print(f"页面上有 {len(links)} 个链接")
        for i, link in enumerate(links[:10]):  # 只显示前10个
            try:
                href = link.get_attribute("href")
                text = link.inner_text()
                if href or text:
                    print(f"  链接 {i}: {text[:30]} -> {href}")
            except:
                pass
        
        return False

def main():
    print("开始下载文件...")
    print(f"下载目录: {DOWNLOAD_DIR}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        
        for file_info in FILES:
            print(f"\n{'='*50}")
            print(f"下载: {file_info['save_as']}")
            print(f"{'='*50}")
            
            try:
                success = download_file(page, file_info['url'], file_info['save_as'])
                if success:
                    print(f"✓ {file_info['save_as']} 下载成功")
                else:
                    print(f"✗ {file_info['save_as']} 下载失败")
            except Exception as e:
                print(f"✗ {file_info['save_as']} 下载出错: {e}")
            
            time.sleep(1)
        
        browser.close()
    
    print("\n下载完成！")
    
    # 检查下载的文件
    for file_info in FILES:
        save_path = os.path.join(DOWNLOAD_DIR, file_info['save_as'])
        if os.path.exists(save_path):
            size = os.path.getsize(save_path)
            print(f"  {file_info['save_as']}: {size} bytes")
        else:
            print(f"  {file_info['save_as']}: 不存在")

if __name__ == "__main__":
    main()
