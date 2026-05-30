from __future__ import annotations

"""WebUI 页面布局模板。"""

from src.webui.services import build_doc_sections
from src.webui.templates.scripts import WEBUI_SCRIPTS
from src.webui.templates.sections import (
    render_doc_sections,
    render_metrics_template,
    render_nav_items,
    render_platform_template,
)

__all__ = ["render_document"]


def render_document(*, version: str, host: str, port: int, initial_tab: str) -> str:
    """渲染 WebUI HTML。"""
    return (
        _HTML_TEMPLATE.replace("__VERSION__", version)
        .replace("__HOST__", host)
        .replace("__PORT__", str(port))
        .replace("__NAV_ITEMS__", render_nav_items())
        .replace("__METRICS__", render_metrics_template())
        .replace("__PLATFORM_BLOCK__", render_platform_template())
        .replace("__DOC_SECTIONS__", render_doc_sections(build_doc_sections()))
        .replace("__SCRIPTS__", WEBUI_SCRIPTS)
        .replace("__INITIAL_TAB__", initial_tab)
    )


_HTML_TEMPLATE = """<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Provider-V2 WebUI</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f3f6fb; --panel: #ffffff; --panel-alt: #eef3ff;
      --panel-soft: #f9fbff; --text: #162033; --muted: #5d6980;
      --accent: #4263eb; --accent-soft: rgba(66, 99, 235, 0.12);
      --ok: #1f9d61; --warn: #d17b17; --err: #d94848;
      --border: #d7deec; --shadow: 0 12px 32px rgba(21, 33, 56, 0.08);
    }
    [data-theme="dark"] {
      --bg: #0d1420; --panel: #172131; --panel-alt: #1d2a3d;
      --panel-soft: #131d2c; --text: #edf3ff; --muted: #9eabc2;
      --accent: #8aa4ff; --accent-soft: rgba(138, 164, 255, 0.16);
      --ok: #37ca7e; --warn: #ffb454; --err: #ff7b7b;
      --border: #2b3a52; --shadow: none;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif;
      background: linear-gradient(180deg, var(--bg) 0%, var(--panel-soft) 100%); color: var(--text); }
    .tab-panel.active { display: grid; gap: 14px; }
    .tab-button.active { background: var(--accent); color: #fff; border-color: transparent; }
    .webui-layout { display: grid; grid-template-columns: 180px 1fr; min-height: 60vh; }
    .webui-sidebar { display: grid; gap: 4px; padding: 14px; border-right: 1px solid var(--border);
      background: var(--panel-soft); position: sticky; top: 0; max-height: 80vh; overflow-y: auto; }
    .sidebar-nav-item { text-align: left; border-radius: 10px; padding: 10px 14px; font-size: 14px;
      border: 1px solid transparent; background: var(--panel); color: var(--text);
      cursor: pointer; transition: all 0.15s; font-weight: 500; }
    .sidebar-nav-item:hover { background: var(--panel-alt); }
    .sidebar-nav-item.active { background: var(--accent-soft); color: var(--accent);
      border-color: var(--accent); font-weight: 600; border-left: 3px solid var(--accent); }
    .webui-content { padding: 14px; min-width: 0; }
    /* Chat input styles (from quickshot input-box) */
    .chat-input {
      caret-color: transparent; resize: none; overflow-y: auto; overflow-x: hidden; color: var(--text);
    }
    .chat-input::selection { background: #dbe3ff; color: var(--text); }
    .custom-caret {
      position: absolute; left: 0; top: 0; width: 2px; height: 24px; border-radius: 999px;
      background: var(--accent); pointer-events: none; opacity: 0;
      transform: translate3d(0, 0, 0); will-change: transform, height, opacity; z-index: 4;
    }
    .custom-caret.is-visible { opacity: 1; animation: caretBlink 1.05s cubic-bezier(0.45, 0, 0.2, 1) infinite; }
    .custom-caret.is-moving { animation: none; opacity: 1; }
    @keyframes caretBlink { 0%, 48% { opacity: 1; } 50%, 100% { opacity: 0.22; } }
    .custom-scrollbar-root { opacity: 0; pointer-events: none; transition: opacity 120ms linear; }
    .custom-scrollbar-root.is-scrollable { opacity: 1; pointer-events: auto; }
    .custom-scrollbar-track { background: #eef2f8; border-radius: 999px; }
    .custom-scrollbar-thumb {
      background: #b9c4da; border-radius: 999px; min-height: 24px;
      transform: translate3d(0, 0, 0); will-change: transform, height; cursor: grab;
      transition: background 0.1s ease;
    }
    .custom-scrollbar-thumb:active { cursor: grabbing; background: #8f9fc7; }
    /* Chat message styles */
    .chat-message { padding: 12px 16px; border-radius: 12px; margin-bottom: 8px; line-height: 1.6; font-size: 14px; }
    .chat-message-user { background: var(--accent-soft); border-left: 3px solid var(--accent); }
    .chat-message-assistant { background: var(--panel-alt); border-left: 3px solid var(--ok); }
    .chat-message-system { background: #fff3e0; border-left: 3px solid var(--warn); }
    .chat-message-tool { background: #f0f4ff; border-left: 3px solid #6366f1; font-family: monospace; font-size: 12px; }
    .chat-tool-btn {
      display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px;
      border-radius: 6px; background: #e0e7ff; color: #4338ca; font-size: 12px;
      border: 1px solid #c7d2fe; cursor: default;
    }
    /* Chat test report table */
    .chat-test-report { width: 100%; border-collapse: collapse; font-size: 13px; }
    .chat-test-report th, .chat-test-report td { padding: 8px 12px; border: 1px solid var(--border); text-align: left; }
    .chat-test-report th { background: var(--panel-soft); font-weight: 600; }
    .chat-test-report tr.pass td { background: #f0fdf4; }
    .chat-test-report tr.fail td { background: #fef2f2; }
    .config-edit-area { min-height: 200px; max-height: 500px; overflow: auto;
      font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6;
      border: 1px solid var(--border); border-radius: 12px; padding: 12px;
      background: var(--panel-soft); color: var(--text); white-space: pre; word-break: break-all;
      width: 100%; resize: vertical; }
    .config-edit-area:focus { border-color: var(--accent); outline: none; }
    .status-saved { color: var(--ok); font-size: 12px; font-weight: 600; }
    .status-dirty { color: var(--warn); font-size: 12px; font-weight: 600; }
    #reloadServerButton { border-color: var(--warn); color: var(--warn); }
    #reloadServerButton:hover { background: var(--warn); color: #fff; }
    @media (max-width: 768px) {
      .webui-layout { grid-template-columns: 1fr; }
      .webui-sidebar { display: none; position: fixed; top: 0; left: 0;
        width: 240px; height: 100vh; z-index: 1000; padding: 60px 12px 12px;
        box-shadow: var(--shadow); }
      .webui-sidebar.open { display: grid; }
    }
  </style>
</head>
<body>
  <div class="max-w-[1440px] mx-auto p-3 md:p-4 grid gap-4">
    <section class="bg-panel border border-border rounded-[18px] shadow-panel p-5 grid gap-4">
      <div class="grid gap-3 md:grid-cols-[1fr_auto] items-start">
        <div>
          <h1 class="text-[30px] font-bold m-0">Provider-V2 WebUI</h1>
          <p class="m-0 text-muted leading-relaxed">生产化内置管理台，覆盖概览、平台状态、模型清单、在线文档、配置管理与日志反馈。</p>
        </div>
        <div class="flex flex-wrap gap-2 justify-end">
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs bg-accent-soft text-text">版本 __VERSION__</span>
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs bg-accent-soft text-text">__HOST__:__PORT__</span>
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs bg-accent-soft text-text" id="themeState">theme: auto</span>
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs bg-accent-soft text-text" id="refreshState">refresh: manual</span>
        </div>
      </div>
      <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
        <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] bg-accent text-white border border-transparent hover:opacity-90 transition" id="refreshButton" type="button">刷新状态</button>
        <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] border border-border bg-panel text-text hover:bg-panel-alt transition" id="refreshModelsButton" type="button">刷新模型缓存</button>
        <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] border border-border bg-panel text-text hover:bg-panel-alt transition" id="portableButton" type="button">便携设置</button>
        <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] border border-warn text-warn bg-panel hover:bg-warn hover:text-white transition" id="reloadServerButton" type="button">重启服务</button>
        <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] border border-border bg-panel text-text hover:bg-panel-alt transition" id="reloadConfigButton" type="button">重载配置</button>
      </div>
      __METRICS__
      <div class="flex flex-wrap gap-2 items-center">
        <div class="border-l-4 border-accent px-3 py-2.5 bg-accent-soft rounded-[10px] leading-relaxed text-[14px]">该页面优先使用只读摘要接口，单个接口失败时会自动降级，不会导致整页失效。</div>
        <div class="border-l-4 border-accent px-3 py-2.5 bg-accent-soft rounded-[10px] leading-relaxed text-[14px]" id="socketNotice">日志 WebSocket: /v1/webui/ws/logs</div>
      </div>
    </section>

    <section class="bg-panel border border-border rounded-[18px] shadow-panel p-[18px] grid gap-[14px] hidden" id="portablePanel">
      <div class="flex flex-wrap justify-between items-end gap-3">
        <div>
          <h2>便携设置</h2>
          <p class="m-0 text-muted leading-relaxed">这些设置保存在浏览器本地，适合便携环境与临时运行环境。</p>
        </div>
      </div>
      <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
          <div class="text-[13px] text-muted m-0 mb-2">主题模式</div>
          <select id="themeSelect" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]">
            <option value="auto">auto</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
          <div class="text-[13px] text-muted m-0 mb-2">自动刷新间隔（秒）</div>
          <input id="refreshIntervalInput" type="number" min="0" max="300" step="5" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]">
        </label>
        <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
          <div class="text-[13px] text-muted m-0 mb-2">请求超时（毫秒）</div>
          <input id="timeoutInput" type="number" min="500" max="30000" step="500" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]">
        </label>
        <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
          <div class="text-[13px] text-muted m-0 mb-2">显示紧凑模式</div>
          <select id="compactSelect" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]">
            <option value="0">关闭</option>
            <option value="1">开启</option>
          </select>
        </label>
      </div>
      <p class="m-0 text-muted leading-relaxed">设置不写回服务端配置文件，避免对线上进程产生意外副作用。</p>
    </section>

    <section class="bg-panel border border-border rounded-[18px] shadow-panel grid gap-0 overflow-hidden">
      <div class="webui-layout">
        <aside class="webui-sidebar" id="sidebar">
          __NAV_ITEMS__
        </aside>
        <main class="webui-content">

      <section class="tab-panel hidden" id="tab-overview" aria-labelledby="tab-overview-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>运行概览</h2>
            <p class="m-0 text-muted leading-relaxed">显示服务、并发策略、代理、鉴权和启动开关摘要。</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="exportSummaryButton" type="button">导出摘要</button>
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="copySummaryButton" type="button">复制摘要</button>
          </div>
        </div>
        <div class="border-l-4 border-accent px-3 py-2.5 bg-accent-soft rounded-[10px] leading-relaxed text-[14px]" id="overviewNotice">等待状态刷新后展示摘要提示。</div>
        <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]" id="overviewGrid"></div>
      </section>

      <section class="tab-panel hidden" id="tab-platforms" aria-labelledby="tab-platforms-button">
        __PLATFORM_BLOCK__
      </section>

      <section class="tab-panel hidden" id="tab-models" aria-labelledby="tab-models-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>模型清单</h2>
            <p class="m-0 text-muted leading-relaxed">支持按名称、平台和能力筛选模型，展示来源平台、上下文长度和能力简表。</p>
          </div>
          <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
              <div class="text-[13px] text-muted m-0 mb-2">模型搜索</div>
              <input id="modelSearchInput" type="search" placeholder="输入模型名" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]">
            </label>
            <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
              <div class="text-[13px] text-muted m-0 mb-2">平台筛选</div>
              <select id="modelPlatformSelect" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]"><option value="">全部平台</option></select>
            </label>
            <label class="border border-border rounded-[14px] p-3.5 bg-panel-alt">
              <div class="text-[13px] text-muted m-0 mb-2">能力筛选</div>
              <select id="modelCapabilitySelect" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2.5 text-[14px]"><option value="">全部能力</option></select>
            </label>
          </div>
        </div>
        <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]" id="modelGrid"></div>
      </section>

      <section class="tab-panel hidden" id="tab-docs" aria-labelledby="tab-docs-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>在线文档</h2>
            <p class="m-0 text-muted leading-relaxed">集中查看协议入口、管理接口和常用只读地址。</p>
          </div>
        </div>
        __DOC_SECTIONS__
      </section>

      <section class="tab-panel hidden" id="tab-config" aria-labelledby="tab-config-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>配置管理</h2>
            <p class="m-0 text-muted leading-relaxed">在线编辑配置文件，修改后自动保存并重新加载。</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="configEditToggle" type="button">编辑配置</button>
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="copyConfigButton" type="button">复制配置</button>
            <span id="configSaveStatus" class="status-saved flex items-center">已保存</span>
          </div>
        </div>
        <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]" id="configGrid"></div>
        <div class="min-h-[140px] max-h-[260px] overflow-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed border border-border rounded-xl p-3 bg-panel-soft" id="configJsonBox"></div>
        <textarea class="config-edit-area hidden" id="configEditArea" spellcheck="false" aria-label="配置编辑器"></textarea>
      </section>

      <section class="tab-panel hidden" id="tab-autoupdate" aria-labelledby="tab-autoupdate-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>自动更新</h2>
            <p class="m-0 text-muted leading-relaxed">监控远端 git 仓库新提交，自动拉取更新并重启服务。</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="autoupdateCheckBtn" type="button">立即检查</button>
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="autoupdateSaveBtn" type="button">保存设置</button>
            <span id="autoupdateStatus" class="status-saved flex items-center">未启用</span>
          </div>
        </div>
        <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]" id="autoupdateGrid">
          <div class="border border-border rounded-[14px] p-3.5 bg-panel">
            <div class="text-[13px] text-muted m-0 mb-2">启用状态</div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="autoupdateEnabled" class="w-4 h-4">
              <span>启用自动更新</span>
            </label>
          </div>
          <div class="border border-border rounded-[14px] p-3.5 bg-panel">
            <div class="text-[13px] text-muted m-0 mb-2">目标分支</div>
            <input id="autoupdateBranch" type="text" placeholder="main" class="w-full rounded-[10px] border border-border bg-panel-soft text-text px-3 py-2 text-[14px]">
          </div>
          <div class="border border-border rounded-[14px] p-3.5 bg-panel">
            <div class="text-[13px] text-muted m-0 mb-2">检查间隔（秒）</div>
            <input id="autoupdateInterval" type="number" min="30" step="30" placeholder="300" class="w-full rounded-[10px] border border-border bg-panel-soft text-text px-3 py-2 text-[14px]">
          </div>
          <div class="border border-border rounded-[14px] p-3.5 bg-panel">
            <div class="text-[13px] text-muted m-0 mb-2">上次检查结果</div>
            <div id="autoupdateLastCheck" class="text-2xl font-bold">--</div>
          </div>
        </div>
      </section>

      <section class="tab-panel hidden" id="tab-logs" aria-labelledby="tab-logs-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>运行日志</h2>
            <p class="m-0 text-muted leading-relaxed">显示当前页面交互与接口调用反馈，不替代服务端真实日志文件。</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="tab-button cursor-pointer font-bold rounded-lg px-4 py-2.5 border border-border bg-panel text-text hover:bg-panel-alt transition" id="clearLogButton" type="button">清空日志</button>
          </div>
        </div>
        <div class="min-h-[140px] max-h-[260px] overflow-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed border border-border rounded-xl p-3 bg-panel-soft" id="logBox"></div>
      </section>

      <section class="tab-panel hidden" id="tab-chat" aria-labelledby="tab-chat-button">
        <div class="flex flex-wrap justify-between items-end gap-3">
          <div>
            <h2>聊天测试</h2>
            <p class="m-0 text-muted leading-relaxed">向 AI 模型发送消息，测试不同工具调用协议的响应。</p>
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <select id="chatModelSelect" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2 text-[14px]"><option value="">加载中...</option></select>
            <select id="chatProtocolSelect" class="rounded-[10px] border border-border bg-panel text-text px-3 py-2 text-[14px]">
              <option value="xml">XML 协议</option>
              <option value="antml">Antml 协议</option>
              <option value="nous">Nous 协议</option>
              <option value="bracket">Bracket 协议</option>
            </select>
            <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] border border-ok text-ok bg-panel hover:bg-ok hover:text-white transition" id="chatRunTestsBtn" type="button">批量测试</button>
            <button class="cursor-pointer font-bold rounded-lg px-4 py-2.5 text-[14px] border border-border bg-panel text-text hover:bg-panel-alt transition" id="chatClearBtn" type="button">清空对话</button>
          </div>
        </div>
        <div id="chatTestReport" class="hidden mb-3"></div>
        <div id="chatMessagesContainer" class="min-h-[400px] max-h-[600px] overflow-y-auto border border-border rounded-xl p-3 bg-panel-soft"></div>
        <div id="chatInputSection" class="w-full bg-white border border-[#e5eaf0] rounded-2xl p-4 flex flex-col gap-3 mt-3">
          <div id="chatInputViewport" class="relative w-full overflow-hidden" style="height: 96px;">
            <textarea id="chatMessageInput" class="chat-input absolute inset-0 z-[1] w-full h-full border-0 bg-transparent p-0 pr-6 m-0 text-[15px] leading-6 placeholder:text-[#a8b3cf]" placeholder="输入消息...支持多行文本" rows="4" spellcheck="true" autocomplete="off"></textarea>
            <div id="chatCustomCaret" class="custom-caret"></div>
            <div id="chatCustomScrollbar" class="custom-scrollbar-root absolute inset-y-0 right-0 z-[5] w-3">
              <div id="chatCustomTrack" class="custom-scrollbar-track absolute right-[3px] top-1 bottom-1 w-[6px]"></div>
              <div id="chatCustomThumb" class="custom-scrollbar-thumb absolute right-[3px] top-1 w-[6px]"></div>
            </div>
          </div>
          <div class="flex justify-between items-center h-11">
            <div class="flex items-center gap-0.5">
              <button type="button" class="tool-btn" title="表情">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/></svg>
              </button>
              <button type="button" class="tool-btn" title="文件">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/></svg>
              </button>
              <button type="button" class="tool-btn" title="语音输入" id="chatVoiceBtn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"/></svg>
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button id="chatSendBtn" type="button" class="bg-[#5865bc] hover:bg-[#4754a3] text-white px-4 h-11 rounded-xl flex items-center justify-center gap-2 font-medium text-sm shadow-sm">
                <span id="chatBtnText">发送</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

        </main>
      </div>
    </section>
  </div>

  <div class="fixed right-4 bottom-4 grid gap-2 z-[1000]" id="toastWrap" aria-live="polite"></div>

  <button id="fabThemeButton" type="button"
    class="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-transform z-[1001] flex items-center justify-center text-xl"
    aria-label="切换主题">
    <span id="fabThemeIcon">&#9790;</span>
  </button>

  <script>
__SCRIPTS__
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: ['selector', '[data-theme="dark"]'],
      theme: {
        extend: {
          colors: {
            bg: 'var(--bg)',
            panel: 'var(--panel)',
            'panel-alt': 'var(--panel-alt)',
            'panel-soft': 'var(--panel-soft)',
            text: 'var(--text)',
            muted: 'var(--muted)',
            accent: 'var(--accent)',
            'accent-soft': 'var(--accent-soft)',
            ok: 'var(--ok)',
            warn: 'var(--warn)',
            err: 'var(--err)',
            border: 'var(--border)',
          },
          boxShadow: { panel: 'var(--shadow)' },
        }
      }
    };
  </script>
</body>
</html>
"""
