2026-05-31 | 修复 WebUI 聊天会话历史丢失助手消息问题

### 变更文件

- src/webui/static/js/chat.js
- src/webui/static/css/styles.css
- template/template_config.toml
- config.toml
- README.md

### 变更说明

**Bug 修复：聊天 SSE 流结束后助手消息未添加到会话历史**
- `src/webui/static/js/chat.js` — 新增 `assistantAdded` 标记，当 SSE 流结束但未收到 `finish_reason` 时（某些服务器行为），自动将累积的助手内容添加到 `chatConversationHistory`，确保多轮对话上下文完整

**Bug 修复：自定义下拉列表 z-index 层级不足**
- `src/webui/static/css/styles.css` — `.custom-dropdown-list` z-index 从 1000 提升至 9999，避免被其他容器遮挡

**版本更新**
- `template/template_config.toml` — version 2.2.22 → 2.2.23
- `config.toml` — 同步版本
- `README.md` — 版本徽章 2.2.16 → 2.2.23

### 验证结果

- 纯前端 JS/CSS 变更，无需 py_compile
- `py_compile` 检查通过的 Python 配置文件
- pytest: 无相关测试覆盖（前端变更）

---

2026-05-31 | 修复聊天输入框重复滚动条问题

### 变更文件

- src/webui/static/css/styles.css
- src/webui/static/index.html

### 变更说明

**Bug 修复：聊天输入框显示两个滚动条**
- `src/webui/static/css/styles.css` — 新增 `.native-scroll-hidden` 类，隐藏原生浏览器滚动条（`::-webkit-scrollbar { display: none }`、`scrollbar-width: none`、`-ms-overflow-style: none`）
- `src/webui/static/index.html` — textarea 添加 `native-scroll-hidden` class，确保原生滚动条被隐藏
- `src/webui/static/index.html` — custom-scrollbar-root 内新增 `.custom-scrollbar-track` div，完全对齐 quickshot reference 结构

### 验证结果

- 纯前端 CSS/HTML 变更，无需 py_compile
- 视觉验证：仅显示自定义滚动条，原生滚动条已隐藏

---

2026-05-31 | 修复 WebUI 动画冲突导致发送按钮消失和模型列表不加载

### 变更文件

- src/webui/static/js/motion.js
- src/webui/static/js/bootstrap.js

### 变更说明

**Bug 修复：WebUI 交互问题**
- `src/webui/static/js/motion.js` — 禁用 `animateTabIn` 函数，避免与 CSS `fadeInUp` 动画冲突导致 `chatSendBtn` opacity 被设为 0 后不恢复
- `src/webui/static/js/motion.js` — 排除 `chatSendBtn` 不受 `appearIn` 和 `floatScale` 动画影响，防止按钮消失
- `src/webui/static/js/bootstrap.js` — 添加 `loadModelsList()` 调用，修复模型选择下拉框一直显示"加载中"的问题

### 验证结果

- 纯前端 JavaScript 变更，无需 py_compile
- 视觉验证：发送按钮正常显示，模型列表正常加载

---

2026-05-31 | 修复 WebUI 静态文件缓存导致无法热重载

### 变更文件

- src/webui/routes.py
- src/webui/routers/pages.py
- template/template_config.toml（版本 2.2.21 → 2.2.22）

### 变更说明

**Bug 修复：WebUI 不会热重载**
- `src/webui/routes.py` — 静态文件路由添加 `show_index=False` 和 `append_version=True`，URL 自动追加文件修改时间戳，文件更新后强制浏览器重新下载
- `src/webui/routers/pages.py` — HTML 页面响应添加 `Cache-Control: no-cache, no-store, must-revalidate`、`Pragma: no-cache`、`Expires: 0` 头部，禁止浏览器缓存

### 验证结果

- `py_compile` 通过
- pytest: 配置管理器检测到版本差异 2.2.21→2.2.22 并触发退出（预期行为，需重启服务后测试）
- 前次完整测试: 496 passed, 0 failed, 33 skipped

---

2026-05-31 | WebUI 全面重构 — 统一设计系统与动效

### 变更文件

- src/webui/static/js/motion.js（新增 — MotionKit 动画框架 + appearIn 入场动画）
- src/webui/static/css/styles.css
- src/webui/static/index.html
- src/webui/static/docs.html
- src/webui/static/js/bootstrap.js
- src/webui/static/js/render.js
- src/webui/static/js/state.js
- src/core/config/sections.py（版本默认值更新）
- template/template_config.toml（版本 2.2.20 → 2.2.21）
- config.toml（同步版本）

### 变更说明

**重构：WebUI 设计系统统一**
- `src/webui/static/js/motion.js` — 从 quickshot reference 移植 MotionKit 动画框架，包含 floatScale（悬停缩放）、opacityTo/sizeTo/widthTo（平滑过渡）、appearIn（入场动画）、animateTabIn（Tab 切换动画）、animateToastIn（通知动画）
- `src/webui/static/css/styles.css` — 新增统一设计系统 CSS：
  - `.card-hover-lift` 类：卡片悬停上移 2px + 阴影
  - 所有按钮/输入框/侧边栏项过渡动画
  - 输入框聚焦 accent 边框效果
  - `.badge-loading` 脉冲动画
  - `.toast-enter` 滑入动画
  - `fadeInUp` Tab 子元素交错入场动画
  - `.loading-shimmer` 加载闪烁效果
  - 平滑滚动条样式
- `src/webui/static/index.html` 和 `docs.html` — 统一所有元素样式：
  - Section：`rounded-[18px]` → `rounded-2xl`
  - 卡片：`rounded-[14px]` → `rounded-xl` + `card-hover-lift`
  - 输入框/选择框：`rounded-[10px]` → `rounded-xl`
  - 徽章：`rounded-full` → `rounded-xl`
  - 便携面板按钮：`rounded-full` → `rounded-xl`
- `src/webui/static/js/bootstrap.js` — 集成 MotionKit 初始化，Tab 切换时自动触发动画
- `src/webui/static/js/render.js` — 所有动态生成卡片改用 `rounded-xl` + `card-hover-lift`
- `src/webui/static/js/state.js` — Toast 添加进入/退出动画（MotionKit.opacityTo）
- `src/core/config/sections.py` — ServerCfg 默认版本更新到 2.2.21
- 版本递增：2.2.20 → 2.2.21

**动效列表：**
1. appearIn — 页面加载时 section/按钮/侧边栏项从无到有缩放浮现
2. floatScale — 按钮悬停放大 8%，按压缩小 4%
3. card-hover-lift — 卡片悬停上移 2px + 阴影
4. fadeInUp — Tab 切换时子元素交错向上滑入
5. toast-enter — Toast 通知从下方滑入
6. badgePulse — 加载中标签闪烁
7. sidebar hover slide — 侧边栏项悬停右移 2px

### 验证结果

- `py_compile src/core/config/sections.py` 通过
- pytest: 496 passed, 0 failed, 33 skipped（修复了 test_sections.py 中期望旧版本号的断言）

### 变更文件

- src/webui/static/index.html
- src/webui/static/docs.html

### 变更说明

**Bug 修复 & 重构：**
- `src/webui/static/index.html` 和 `docs.html` — 输入框添加外层 section 包裹（id="chatInputSection"），完全对齐 quickshot reference 的 mainInputSection 结构
- `src/webui/static/index.html` 和 `docs.html` — 发送按钮新增箭头图标（纸飞机 SVG），与 quickshot 一致
- `src/webui/static/index.html` 和 `docs.html` — 添加 tailwind.config 配置，启用 CSS 变量类（panel, border, text, muted 等），修复 Tailwind CDN 覆盖自定义主题导致的"黑框"问题
- `src/webui/static/index.html` 和 `docs.html` — viewport 从独立圆角框改为 section 内的子元素，移除多余的边框和背景类

### 验证结果

- 视觉对齐：输入框结构完全对齐 quickshot reference
- 主题修复：Tailwind CDN 不再覆盖 CSS 变量，dark/light mode 正常切换
- 按钮完整：左侧文件+语音按钮，右侧发送按钮+箭头图标

---

2026-05-31 | 新增聊天输入框文件与语音工具按钮

### 变更文件

- src/webui/static/css/styles.css
- src/webui/static/docs.html
- src/webui/static/index.html

### 变更说明

**新功能：**
- `src/webui/static/index.html` 和 `docs.html` — 聊天输入框左侧新增文件按钮和语音按钮，右侧为发送按钮（完全对齐 quickshot reference）
- `src/webui/static/css/styles.css` — 新增 `.tool-btn` 样式（36x36px，圆角 10px，hover 效果使用 CSS 变量）
- `src/webui/static/css/styles.css` — 新增 `.voice-gif` 样式（19x19px，filter 颜色变换动画）
- `src/webui/static/waveform_64x64.gif` — 语音输入波形动画 GIF（46KB，已存在）

### 验证结果

- 视觉对齐：按钮布局、图标、尺寸完全对齐 quickshot reference
- 主题适配：按钮使用 --muted 和 --accent CSS 变量，正确支持 dark/light mode

---

2026-05-31 | 修复聊天输入框主题覆盖与结构问题

### 变更文件

- src/webui/static/css/styles.css
- src/webui/static/docs.html
- src/webui/static/index.html

### 变更说明

**Bug 修复：**
- `src/webui/static/css/styles.css` — 添加全局 textarea/button/input 重置样式（来自 quickshot reference），防止浏览器默认样式覆盖主题
- `src/webui/static/css/styles.css` — chat-input 改为 absolute 定位（position: absolute; inset: 0），与 quickshot reference 一致
- `src/webui/static/docs.html` 和 `index.html` — viewport 添加固定高度 style="height: 96px;" 和 overflow-hidden
- `src/webui/static/docs.html` 和 `index.html` — 移除 Tailwind 类冲突（w-full, p-3, bg-transparent, outline-none）

### 验证结果

- 前端视觉测试：输入框主题现在正确跟随 dark/light mode
- 结构完全对齐 quickshot reference (C:\Users\SuperAdmin\Desktop\quickshot\input-box)

---

2026-05-31 | WebUI 通信问题修复与主题适配

### 变更文件

- src/core/config/__init__.py
- src/webui/static/css/styles.css
- src/webui/static/js/actions.js
- src/webui/static/js/chat.js

### 变更说明

**Bug 修复：**
- `src/core/config/__init__.py` — 新增 `write_config()` 函数，修复配置保存 500 错误（函数被导入但不存在）
- `src/webui/static/css/styles.css` — 将所有硬编码颜色替换为 CSS 变量，完整支持 dark mode 主题
- `src/webui/static/js/actions.js` — 新增 WebSocket 自动重连逻辑（指数退避，最多 10 次重试）
- `src/webui/static/js/chat.js` — 新增 SSE 流式响应超时处理（120s 初始超时，60s 流式超时）

### 验证结果

- `py_compile` 通过
- pytest: 497 passed, 33 skipped, 3 warnings
- 版本同步：template 2.2.16 → 2.2.17，config.toml 同步，SKILL.md frontmatter 同步

---

2026-05-31 | 修复 Python 3.14+ asyncio.set_event_loop_policy 弃用警告

### 变更文件

- `main.py`
- `template/template_config.toml`（版本 2.2.15 → 2.2.16）
- `config.toml`（同步版本）
- `README.md`（更新版本徽章）

### 变更说明

**兼容性修复：Python 3.14+ 弃用警告**
- `main.py` — 在 Python 3.14+ 上使用 `uvloop.install()` 替代已弃用的 `asyncio.set_event_loop_policy()`，消除 DeprecationWarning

### 验证结果

- `py_compile` 通过

---

2026-05-31 | 修复 fncall 协议标签泄露到 API 响应 content 字段

### 变更文件

- `src/core/server/http.py`
- `src/core/dispatch/gateway.py`
- `src/routes/openai.py`
- `template/template_config.toml`（版本 2.2.14 → 2.2.15）
- `config.toml`（同步版本）
- `README.md`（更新版本徽章）

### 变更说明

**Bug 修复：协议标签泄露**

模型响应（qwen3.7-max）在 `content` 字段中泄露了原始协议标签（如 `[function_calls]`、`<|PROVIDER|tool_calls>`、`<antml:function_calls>`、`<function_calls>`），导致客户端收到未清理的协议标记。

- `src/core/server/http.py` — `clean_fncall()` 和 `safe_flush()` 新增可选的 `platform_id` 参数，使其能使用正确的平台特定协议进行标签清理和安全刷新，而非总是使用默认全局协议
- `src/core/dispatch/gateway.py` — `_single()` 和 `_race()` 在输出内容前先 yield `{"_meta": {"platform": cand.platform}}`，让路由层知道实际执行的平台
- `src/routes/openai.py` — 非流式 `_clean_fncall()` 调用传递 `platform_id`；流式处理使用协议感知的 tag detection（从 `get_protocol(platform_id)` 获取触发标签），`_safe_flush()` 和末尾 `fncall_buffer` 解析也传递 `platform_id`

### 验证结果

- `py_compile` 通过
- 手动验证 4 个协议 × 2 种模式 = 8 项测试全部通过，无泄露
  - bracket: 非流式 [OK] / 流式 [OK]
  - xml: 非流式 [OK] / 流式 [OK]
  - antml: 非流式 [OK] / 流式 [OK]
  - nous: 非流式 [OK] / 流式 [OK]

---

2026-05-31 | 修复 4 个测试失败 + 新增 qwen3.7-max 协议全面测试

### 变更文件

- `src/core/server/proxy.py`
- `tests/src/core/fncall/test_base.py`
- `tests/src/core/test_tools.py`
- `tests/src/platforms/qwen/test_qwen37max_protocols.py`（新增）
- `template/template_config.toml`（版本 2.2.13 → 2.2.14）
- `config.toml`（同步版本）
- `README.md`（更新版本徽章）
- `.agents/provider-guide/SKILL.md`（更新版本字段）

### 变更说明

**Bug 修复：测试失败**
- `src/core/server/proxy.py` — 添加缺失的 `from aiohttp import TCPConnector` 导入，修复 `test_aitianhu2_persistence_roundtrip` 的 NameError
- `tests/src/core/fncall/test_base.py` — 在 `TestProtocolRegistry` 中添加 `setup_method/teardown_method` 保存和恢复全局协议注册表状态，修复测试隔离问题导致的 `test_fncall_stream_parser_*` 失败
- `tests/src/core/test_tools.py` — 为 `test_fncall_stream_parser_with_call` 和 `test_fncall_stream_parser_split_across_chunks` 明确传递 `protocol=get_protocol_by_id("xml")` 参数，修复协议不匹配导致的断言失败

**新测试：qwen3.7-max 协议全面测试**
- `tests/src/platforms/qwen/test_qwen37max_protocols.py` — 新增 22 个测试，覆盖 xml/antml/nous/bracket 四种协议的非流式与流式模式：
  - 协议注册验证
  - Prompt 渲染验证（每种协议）
  - 非流式工具调用解析（包括 xml 的 legacy 格式）
  - 流式分块工具调用检测
  - 无工具调用的纯文本响应验证

### 验证结果

- `py_compile` 全部通过
- pytest (fncall + protocol tests): 151 passed, 0 failed, 0 skipped
- 全量测试: 475 passed, 0 failed, 17 skipped

---
2026-05-31 | 修复 4 个测试失败 — 协议注册表隔离 + TCPConnector 导入缺失

### 变更文件

- `src/core/server/proxy.py`
- `tests/src/core/fncall/test_base.py`
- `tests/src/core/test_tools.py`

### 变更说明

**Bug 修复：测试失败**
- `src/core/server/proxy.py` — 添加缺失的 `from aiohttp import TCPConnector` 导入，修复 `test_aitianhu2_persistence_roundtrip` 的 NameError
- `tests/src/core/fncall/test_base.py` — 在 `TestProtocolRegistry` 中添加 `setup_method/teardown_method` 保存和恢复全局协议注册表状态，修复测试隔离问题导致的 `test_fncall_stream_parser_*` 失败
- `tests/src/core/test_tools.py` — 为 `test_fncall_stream_parser_with_call` 和 `test_fncall_stream_parser_split_across_chunks` 明确传递 `protocol=get_protocol_by_id("xml")` 参数，修复协议不匹配导致的断言失败

### 验证结果

- `py_compile` 全部通过
- pytest: 475 passed, 0 failed, 17 skipped

---
2026-05-31 | WebUI 重构为前后端分离 SPA 架构

### 变更文件

- `src/webui/static/index.html`（新增 — WebUI 主页面 HTML shell）
- `src/webui/static/docs.html`（新增 — 文档页面 HTML shell）
- `src/webui/static/css/styles.css`（新增 — 从 layout.py 提取的内联 CSS）
- `src/webui/static/js/state.js`（新增 — 状态管理与本地存储）
- `src/webui/static/js/render.js`（新增 — DOM 渲染函数）
- `src/webui/static/js/actions.js`（新增 — API 调用与 WebSocket）
- `src/webui/static/js/chat.js`（新增 — 聊天 SSE 流式与批量测试）
- `src/webui/static/js/bootstrap.js`（新增 — 事件绑定与初始化）
- `src/webui/routers/pages.py`（修改 — 改用 FileResponse 服务静态文件）
- `src/webui/routers/docs.py`（修改 — 同上）
- `src/webui/routes.py`（修改 — 添加 /webui/static/ 静态路由）
- `src/webui/app.py`（修改 — render_page() 返回静态 HTML）
- `src/webui/page.py`（修改 — render_webui() 返回静态 HTML，向后兼容）
- `tests/src/core/test_webui.py`（修改 — 更新为验证静态文件服务）
- `src/webui/templates/`（删除 — 整个 SSR 模板目录）
- `template/template_config.toml`（版本 2.2.12 → 2.2.13）
- `config.toml`（同步版本）
- `README.md`（更新版本徽章）

### 变更说明

**WebUI 架构重构：SSR → SPA**
- 将 WebUI 从服务端渲染（Python 字符串替换）重构为前后端分离的 SPA 架构
- 静态 HTML shell + 外部 JS/CSS 文件 + 现有 JSON API（/v1/webui/summary, /v1/config, WebSocket 等）
- 所有 8 个 tab（概览、平台、模型、文档、配置、自动更新、聊天测试、日志）功能保持不变
- `__INITIAL_TAB__` 占位符替换为 `data-initial-tab` HTML 属性，由 JS 读取
- Tailwind CSS 仍从 CDN 加载
- 路由 `/webui` 和 `/docs` 现在通过 FileResponse 直接服务静态文件
- 保留 `render_webui()` 和 `render_page()` 作为向后兼容导出

### 验证结果

- `py_compile` 全部通过
- pytest: 471 passed, 4 failed（预存在失败，与本次变更无关）, 17 skipped
- WebUI 专用测试 8/8 通过（验证静态文件存在性、内容完整性、资源引用）

---
2026-05-31 | 新增全面测试覆盖 — 19 个测试文件，464 个测试用例

### 变更文件

- `tests/src/core/dispatch/test_candidate.py`（新增）
- `tests/src/core/dispatch/test_gateway.py`（新增）
- `tests/src/core/dispatch/test_registry.py`（新增）
- `tests/src/core/dispatch/test_selector.py`（新增）
- `tests/src/core/errors/test_errors.py`（新增）
- `tests/src/core/config/test_sections.py`（新增）
- `tests/src/core/config/test_base.py`（新增）
- `tests/src/core/config/test_manager.py`（新增）
- `tests/src/core/utils/test_files.py`（新增）
- `tests/src/core/utils/test_ids.py`（新增）
- `tests/src/core/utils/test_io_utils.py`（新增）
- `tests/src/core/utils/test_retry.py`（新增）
- `tests/src/core/utils/test_scheduler.py`（新增）
- `tests/src/core/fncall/test_base.py`（新增）
- `tests/src/core/fncall/shared/test_shared.py`（新增）
- `tests/src/routes/test_health.py`（新增）
- `tests/src/routes/test_models.py`（新增）
- `tests/src/routes/test_openai.py`（新增）
- `tests/src/routes/test_anthropic.py`（新增）
- `template/template_config.toml`（版本 2.2.11 → 2.2.12）
- `config.toml`（同步版本）
- `README.md`（更新版本徽章）
- `.agents/provider-guide/SKILL.md`（更新版本）

### 变更说明

**新功能：全面测试覆盖**
- 新增 19 个测试文件，覆盖 P0-P2 所有核心模块
- `tests/src/core/dispatch/` — Candidate (13 tests), Gateway, Registry, Selector (22 tests)
- `tests/src/core/errors/` — 全部 24+ 错误类 + classify_http_error (57 tests)
- `tests/src/core/config/` — Sections, Base (from_dict/type conversion), Manager (load/reload/watch/merge)
- `tests/src/core/utils/` — Files (mime/data URI/md5/chunks), IDs (uuid7), io_utils (atomic write), retry (3 functions), scheduler
- `tests/src/core/fncall/` — ToolProtocol ABC + registry, shared utilities (normalize_content, loop_detect, xml_helpers)
- `tests/src/routes/` — Health, Models, OpenAI (ID generators), Anthropic (ID generators + content normalization)
- 总计 464 tests passed, 5 pre-existing failures (unrelated to new tests), 17 skipped

### 验证结果

- `py_compile` 全部通过
- pytest: 464 passed, 5 failed, 17 skipped
  - 5 个预存在失败（与本次变更无关）：
    - `test_fncall_stream_parser_*` (3 tests) — FncallStreamParser 协议问题
    - `test_render_webui_contains_core_sections` — WebUI 字符串测试
    - `test_aitianhu2_persistence_roundtrip` — TCPConnector NameError
- 版本 2.2.11 → 2.2.12

---
2026-05-31 | 新增自动更新功能（autoupdate）

### 变更文件

- `src/core/config/sections.py`
- `template/template_config.toml`
- `src/core/autoupdate.py`（新增）
- `main.py`
- `README.md`
- `.agents/provider-guide/SKILL.md`

### 变更说明

**新功能：自动更新**
- `src/core/config/sections.py` — 新增 `AutoupdateCfg` 数据类，包含 `enabled`（bool）、`branch`（str）、`interval`（int）字段；添加到 `__all__` 和 `AppConfig`
- `template/template_config.toml` — 新增 `[autoupdate]` 配置段，默认 `enabled = false`，`branch = "main"`，`interval = 300`；版本 2.2.10 → 2.2.11
- `src/core/autoupdate.py` — 新建自动更新模块，实现：
  - `AutoUpdater` 类：定期 `git fetch` 检查远端新提交
  - 比较本地 HEAD 与远端分支 commit（`git rev-parse` + `git merge-base --is-ancestor`）
  - 有新提交时执行 `git pull --ff-only`（失败时回退普通 pull）
  - 工作树有未提交修改时自动 `git stash`
  - pull 成功后调用 `os._exit(42)` 触发 Runner 自动重启
  - 完善错误处理（网络失败、非 git 仓库、git 未安装、超时等）
- `main.py` — `_run()` 函数新增 `_autoupdate_task()` 后台任务，仅在 `cfg.autoupdate.enabled=true` 且非 IDLE 环境下启动
- `README.md` — 版本徽章 2.2.10 → 2.2.11，路线图新增 v2.2.11 条目
- `.agents/provider-guide/SKILL.md` — version 2.2.10 → 2.2.11

**架构说明：**
- 复用 exit-code-42 重启协议，与 FileWatcher 使用相同机制
- gitignored 文件（config.toml、accounts.py、persist/、data/、logs/）不会被 git pull 覆盖
- 检查间隔可配置（默认 300 秒）

### 验证结果

- `py_compile` 全部通过
- pytest: 69 passed, 3 failed, 17 skipped
  - 3 个预存在失败（与本次变更无关）：
    - `test_fncall_stream_parser_with_call` / `test_fncall_stream_parser_split_across_chunks` — 默认协议为 antml 但测试生成 xml 格式标签
    - `test_webui.py::test_render_webui_contains_core_sections` — WebUI 字符串测试失败
- 附带修复 `src/core/config/manager.py` bug：`dict(tpl_raw.value())` → `dict(tpl_raw)`（tomlkit 文档对象非可调用）

---
2026-05-30 | 修复工具调用 fncall 协议不一致导致 NameError 和解析失败

### 变更文件

- `src/core/gateway.py`
- `src/core/tools.py`
- `template/template_config.toml`
- `config.toml`

### 变更说明

**Bug 修复：**
- `src/core/gateway.py` — 修复 3 个 bug：
  1. `_single` 函数缺少工具定义注入（`inject_fncall`），与 `_race` 行为不一致，导致单候选项请求时模型收不到工具定义
  2. `_race` 函数签名缺少 `fncall_lang` 参数但函数体内使用了该变量，导致 `NameError`
  3. `_single` 和 `_race` 中 `FncallStreamParser` 创建时未传入平台协议，始终使用全局默认协议（antml），无法检测平台映射协议（如 qwen→nous）的工具调用标签
- `src/core/tools.py` — `FncallStreamParser.__init__` 新增可选 `protocol` 参数，允许调用方传入正确的平台协议而非强制使用全局默认

**版本递增：**
- `template/template_config.toml` — 2.2.9 → 2.2.10
- `config.toml` — 同步模板版本 2.2.10

### 验证结果

- `py_compile` 通过
- 非流式工具调用测试通过：finish_reason=tool_calls，tool_calls 正确解析
- 流式工具调用测试通过：finish_reason=tool_calls，增量 arguments 正确输出
- pytest: 69 passed, 3 failed, 17 skipped
  - 3 个预存在失败（与本次变更无关）：
    - `test_fncall_stream_parser_with_call` / `test_fncall_stream_parser_split_across_chunks` — 默认协议为 antml 但测试生成 xml/nous 格式标签
    - `test_webui.py::test_render_webui_contains_core_sections` — WebUI 测试失败

---
2026-05-30 | 修复 create_embeddings NameError + 删除遗留 chat.py

### 变更文件

- src/routes/openai.py
- src/routes/chat.py（删除）
- template/template_config.toml
- config.toml

### 变更说明

**Bug 修复：**
- `src/routes/openai.py` — `create_embeddings` 函数中缺少 `registry = request.app[REGISTRY_KEY]`，导致调用 `registry.get_capable_candidate("embedding")` 时抛出 NameError。同时附带代码格式清理（import 重新排序、多余空行整理）

**遗留清理：**
- `src/routes/chat.py` — 删除未使用的遗留聊天路由文件，无任何模块引用它，功能已完全由 `openai.py` 中的 `chat_completions` 路由覆盖

**版本递增：**
- `template/template_config.toml` — 2.2.8 → 2.2.9
- `config.toml` — 同步模板版本 2.2.9

### 验证结果

- `py_compile` 通过
- pytest: 69 passed, 3 failed (预存在失败，与本次变更无关), 17 skipped

---
2026-05-30 | 日志颜色配置化 + 修复 edgetts/openaifm 模块导入错误 + 配置命名规范化

### 变更文件

- src/logger.py
- src/core/config/sections.py
- src/core/config/manager.py
- src/core/runtime_view.py
- src/platforms/edgetts/accounts.py
- src/platforms/edgetts/core/client.py
- src/platforms/edgetts/core/impl.py
- src/platforms/edgetts/util.py
- src/platforms/openaifm/core/client.py
- src/platforms/openaifm/core/headers.py (新增)
- src/platforms/openaifm/core/tts.py (新增)
- src/platforms/openaifm/util.py
- template/template_config.toml

### 变更说明

**新功能：**
- `src/logger.py` — 新增 `set_color(enabled)` 函数，支持通过配置控制日志 ANSI 颜色输出
- `src/core/config/sections.py` — `DebugCfg` 新增 `color: bool = True` 字段
- `src/core/config/manager.py` — 配置加载/热重载时自动应用 `debug.color` 到日志系统

**Bug 修复：**
- `src/platforms/edgetts/accounts.py` — `.core.constants` → `.core.consts`（文件名是 consts.py）
- `src/platforms/edgetts/core/client.py` — `.core.constants` → `.core.consts`，`.core.headers`/`.core.ssml` → `.core.drm`
- `src/platforms/edgetts/core/impl.py` — `.core.constants` → `.core.consts`
- `src/platforms/edgetts/util.py` — 修复导入不存在的 `headers`/`payloads`/`sse`/`ssml` 模块
- `src/platforms/openaifm/core/client.py` — 移除不存在的 `payloads` 导入
- `src/platforms/openaifm/util.py` — 修复导入不存在的 `headers`/`payloads`/`sse` 模块
- `src/platforms/openaifm/core/headers.py` — 新建，提供 `build_headers()` 函数
- `src/platforms/openaifm/core/tts.py` — 新建，提供 `build_tts_form_data()` 函数

**配置规范化：**
- `src/core/config/sections.py` — `ServerCfg.STARTUP_FORCE_KILL_PORT` → `startup_force_kill_port`（snake_case）
- `src/core/runtime_view.py` — 同步更新字段引用
- `template/template_config.toml` — 同步键名 + 新增 `color` 配置项

### 验证结果

- `py_compile` 全部通过
- pytest: 69 passed, 3 failed (预存在失败，与本次变更无关), 17 skipped

### 变更文件

- src/core/config/sections.py
- src/core/fncall/registry.py
- src/core/gateway.py
- template/template_config.toml — 版本 2.2.7 → 2.2.8
- config.toml — 跟随模板版本 2.2.8

### 变更说明

**新功能：**
- `src/core/config/sections.py` — `FncallCfg` 新增 `fncall_mapping: Dict[str, str]` 字段，支持将不同平台映射到不同的工具调用协议
- `src/core/fncall/registry.py` — `get_protocol()` 新增 `platform_id` 可选参数，先查 `fncall_mapping` 再回退到全局 `protocol`
- `src/core/gateway.py` — 延迟协议解析至候选项选定后（`_single()` 和 `_race()` 内），通过 `cand.platform` 注入平台感知的协议实例

**架构说明：**
- 原 `dispatch()` 在候选项选定前就解析协议，无法感知平台信息。改为将协议注入推迟到 worker 内部，确保能根据平台 ID 查找映射
- 映射优先级：`fncall_mapping[platform_id]` > `fncall.protocol`（全局 fallback）

### 验证结果

- py_compile: 3 files OK
- pytest: 69 passed, 2 pre-existing failures, 17 skipped

---

2026-05-30 | 新增 nous 协议 (Nous Research XML 风格工具调用)

### 变更文件

- src/core/fncall/base.py
- src/core/fncall/protocols/__init__.py
- src/core/fncall/protocols/nous.py (新增)
- template/template_config.toml — 版本 2.2.6 → 2.2.7
- config.toml — 跟随模板版本 2.2.7

### 变更说明

**新功能：**
-  — 新增 Nous Research XML 风格工具调用协议。格式: <function_calls><invoke name="tool"><parameter name="k"><![CDATA[v]]></parameter></invoke></function_calls>
-  — VALID_PROTOCOL_IDS 新增 'nous'
-  — 导入并注册 NousProtocol

**验证结果：**

- py_compile: OK
- 协议解析测试: 通过 (CDATA 提取、格式化、往返解析均正确)

---

2026-05-30 | 修复 antml 协议 prompt 指令缺失 + 延迟 schema index 构建

### 变更文件

- src/core/fncall/protocols/antml.py
- template/template_config.toml — 版本 2.2.4 → 2.2.5
- config.toml — 跟随模板版本 2.2.5

### 变更说明

**Bug 修复：**
- `src/core/fncall/protocols/antml.py` — `_ANTML_INSTRUCTION` 缺少 Function Invocation Syntax 段落，LLM 不知道应该输出什么格式的 tool call。新增明确的 XML 格式示例（`<antml:function_calls>/<antml:invoke>/<antml:parameters>`），使 antml 协议在流式和非流式模式下均能正确触发工具调用。

**性能优化：**
- `src/core/fncall/protocols/antml.py` — `parse()` 中的 `_build_param_schema_index(tools)` 原在方法开头无条件执行，即使 LLM 响应中没有任何 `<antml:function_calls>` 块也会构建完整的 schema 索引。改为延迟构建：仅在确认至少存在一个 function_calls 块后才创建 schema index。

### 验证结果

- py_compile: OK
- pytest: 25 passed, 0 failed, 0 skipped (test_tools.py)
- antml 协议测试: 非流式 + 流式均通过

---

2026-05-30 | 修复 FncallStreamParser 提前闭合 bug + gateway 协议感知调用

### 变更文件

- src/core/fncall/parsers/stream.py
- src/core/gateway.py

### 变更说明

**Bug 修复：**
- `src/core/fncall/parsers/stream.py` — `_is_call_closed()` 原逻辑使用 `"</" in buf` 检测闭合，会在 `&lt;/parameter&gt;` 等中间标签处误触发，导致 fncall 缓冲区被截断、tool_calls 解析为空。修复为：在 `__init__` 中根据协议的 trigger_tags 预计算 end_tags 列表，`_is_call_closed()` 仅匹配这些特定结束标记；当 end_tags 为空（未知协议）时才回退到原有的启发式检查。
- `src/core/fncall/parsers/stream.py` — `_end_tags` 属性从"声明但从未填充"改为在 `__init__` 中预计算，避免每次 feed() 调用时重复字符串解析。

**适配修复：**
- `src/core/gateway.py` — `inject_fncall()` 签名已从 `(messages, tools, lang)` 改为 `(messages, tools, protocol, lang=...)`。gateway 的 `dispatch()` 函数新增 `get_protocol()` 调用获取协议实例，并正确传递给 `inject_fncall()`，修复 `'str' object has no attribute 'render_prompt'` 错误。

### 验证结果

- py_compile: 2 files OK
- pytest: 25 passed, 0 failed, 0 skipped (test_tools.py)
- 协议测试结果：
  - xml: 非流式 + 流式均通过
  - original: 不通过（后端平台不支持原生 tool_calls）
  - antml: 不通过（prompt 指令不够明确）
  - bracket: 非流式 + 流式均通过

---

2026-05-30 | 工具调用协议重构 — 5 种协议模式 + fncall 模块化 + 配置节重构

### 变更文件

- src/core/fncall/ (新建包，23 个文件)
- src/core/tools.py — 改为薄适配层，从 fncall/ 重新导出
- src/core/http.py — clean_fncall/safe_flush 改为协议感知
- src/core/config/sections.py — FncallCfg 新增 protocol/custom_prompt 字段，删除 tag 字段
- template/template_config.toml — [fncall] 段落重构
- config.toml — 跟随模板版本
- README.md — 版本徽章更新

### 变更说明

---

2026-05-24 | 修复 ServerCfg 缺少 version 字段

### 变更文件

- src/core/config/sections.py

### 变更说明

**Bug 修复：**
- `src/core/config/sections.py` — `ServerCfg` 数据类缺少 `version` 字段，导致路由读取 `cfg.server.version` 时抛出 AttributeError

### 验证结果

- `py_compile` 通过

---

2026-05-24 | 版本硬编码修复 + WebUI 路由挂载 + 清理冗余日志

### 变更文件

- src/core/server.py
- src/routes/static.py
- src/routes/health.py
- src/platforms/qwen/core/client.py
- src/platforms/edgetts/core/tts.py

### 变更说明

**Bug 修复：**
- `src/core/server.py` — `create_app` 缺少 WebUI 路由挂载，新增 `setup_webui(app)` 调用
- `src/routes/static.py` — 根路由 `/` 版本号从硬编码 `"2.0.0"` 改为从配置模板读取
- `src/routes/health.py` — 健康检查 `/health` 版本号从硬编码 `"2.0.4"` 改为从配置模板读取
- `src/platforms/qwen/core/client.py` — 删除冗余的"已登出，尝试重新登录"日志
- `src/platforms/edgetts/core/tts.py` — 移除无效的 `typing.bytes` 导入（Python 3.9+ 已移除）

### 验证结果

- `py_compile` 通过
- pytest 存在预失败的测试（config manager 相关），与本次变更无关

---

2026-05-24 | 配置管理改进

### 变更文件

- .gitignore
- template/template_config.toml
- docs-src/template/INDEX.md

### 变更说明

**配置管理改进：精确 .gitignore 规则 + 新增配置模板文件**

- `.gitignore`：从 blanket `*.toml` + `!template/config.toml` 改为精确 `config.toml`，只忽略根目录配置文件，不再误伤所有 `.toml` 文件
- `template/template_config.toml`：新增 Provider-V2 配置模板文件，作为用户分发基准，包含 server、auth、gateway、proxy、platforms、fncall、debug 等全部配置段
- `docs-src/template/INDEX.md`：同步更新模板文档

### 验证结果

- 无 Python 源码变更，无需 pytest/py_compile

---

2026-05-24 | v2.2.2

### 变更文件

- src/platforms/deepseek/core/client.py
- src/platforms/deepseek/util.py
- src/platforms/ollama/core/client.py
- src/platforms/qwen/core/client.py

### 变更说明

**Bug 修复：平台 accounts 模块导入路径错误**

- 修复 4 个平台文件中 `accounts` 模块的错误导入路径
- 从 `core.accounts` 改为顶层 `accounts`（遵循平台开发规范 §三 依赖流动）
- 影响平台：qwen、ollama、deepseek
- 修复后平台注册不再报 `No module named 'src.platforms.xxx.core.accounts'` 错误

### 验证结果

- 代码修复已应用，待运行时验证

---

.gitignore
main.py
requirements.txt
src/__init__.py
src/core/__init__.py
src/core/config.py
src/core/http.py
src/core/scheduler.py
src/core/server.py
src/logger.py
src/platforms/__init__.py
src/platforms/deepseek/TODO.txt
src/platforms/deepseek/__init__.py
src/platforms/deepseek/adapter.py
src/platforms/deepseek/core/__init__.py
src/platforms/deepseek/core/adapter_impl.py
src/platforms/deepseek/core/client.py
src/platforms/deepseek/core/constants.py
src/platforms/deepseek/core/headers.py
src/platforms/deepseek/core/hif.py
src/platforms/deepseek/core/models_cache.py
src/platforms/deepseek/core/pow.py
src/platforms/deepseek/core/session_api.py
src/platforms/deepseek/core/stream_parser.py
src/platforms/deepseek/core/user_api.py
src/platforms/deepseek/util.py
src/platforms/ollama/__init__.py
src/platforms/ollama/adapter.py
src/platforms/ollama/client.py
src/platforms/ollama/core/__init__.py
src/platforms/ollama/core/adapter_impl.py
src/platforms/ollama/core/client.py
src/platforms/ollama/core/constants.py
src/platforms/ollama/util.py
src/platforms/qwen/__init__.py
src/platforms/qwen/adapter.py
src/platforms/qwen/core/__init__.py
src/platforms/qwen/core/adapter_impl.py
src/platforms/qwen/core/client.py
src/platforms/qwen/core/constants.py
src/platforms/qwen/util.py
src/routes/__init__.py
src/routes/chat.py
src/routes/function_call.py
src/routes/health.py
src/routes/models.py

## 变更说明

### .gitignore

- 修改内容：
  - 由 `.scripts/gen_gitignore.py` 自动重新生成
  - 大幅简化，采用分类结构（Directories / Extensions / File names）
  - 新增忽略 `.agents`、`.claude`、`.codebuddy`、`.zed`、`data`、`node_modules`、`persist` 等目录
  - 新增忽略 `.dll`、`.dylib`、`.json`、`.pyc`、`.pyd`、`.pyo`、`.so`、`.srt`、`.toml`、`.wasm`、`.zip` 等扩展名
  - 排除 `!template/config.toml` 保留模板文件追踪
  - 移除 `logs/`、`.scripts/`、`*.log` 等原有条目
  - 新增 `src/platforms/aitianhu2/` 排除和 `!template/` 保留
- 改动影响：
  - 运行时产生的 JSON/TOML/WASM/日志等文件不再污染 `git status`
  - `config.toml` 被忽略，仅保留模板文件

### README.md

- 修改内容：
  - 全面重写，从 68 行扩展到 221+ 行
  - 新增分支说明（main/dev 分支定位）
  - 新增项目背景、痛点分析、核心功能对比表
  - 新增技术栈表格，版本号要求
  - 新增效果展示（服务启动日志、API 调用示例、Swagger UI）
  - 重写安装指南（pip/虚拟环境/Docker/系统特定说明）
  - 重写使用说明（OpenAI/Anthropic 调用示例、工具调用、流式响应、Thinking 模式）
  - 新增请求参数说明表
  - 重写项目结构图，新增核心目录说明
  - 更新配置说明章节开头
- 改动影响：
  - 文档更加完善，适合新用户快速上手
  - 提供了多种平台调用的完整示例代码

### main.py

- 修改内容：
  - 重写 Runner-Worker 架构的 Worker 启动逻辑
  - 引入新的配置模块 `src.core.config.manager` 替代旧的 `src.core.config`
  - 新增文件监视器 `FileWatcher` 集成
  - 服务器创建改为使用新的 `src.core.server` 模块
  - 移除旧的 `uvloop` 平台特定处理
  - 新增日志颜色检测和终端兼容性改进
- 改动影响：
  - 启动流程与新核心架构对齐
  - 支持配置热重载和文件监视自动重启

### requirements.txt

- 修改内容：
  - 更新依赖版本要求
  - 新增 `tomlkit`、`watchdog`、`aiohttp-socks` 等新依赖
- 改动影响：
  - 支持新配置管理器的 TOML 编辑和文件监控功能

### src/__init__.py

- 修改内容：
  - 更新 `__all__` 导出列表
- 改动影响：
  - 适配新模块结构

### src/core/__init__.py

- 修改内容：
  - 从直接导入各模块改为从新子模块导入
  - 新增 `candidate`、`errors`、`files`、`gateway`、`models_cache`、`proxy`、`registry`、`retry`、`selector`、`tools`、`watcher` 等导出
  - 移除旧的 `config`、`scheduler` 导出
- 改动影响：
  - 适配核心模块重构后的新文件结构

### src/core/config.py（删除）

- 修改内容：
  - 整个文件被删除，功能迁移到 `src/core/config/` 目录
- 改动影响：
  - 旧配置系统被新的多文件配置架构替代

### src/core/http.py

- 修改内容：
  - 精简 HTTP 工具函数
  - 移除旧的 `clean_fncall` 实现（迁移到 `src.core.tools`）
  - 保留 `get_json`、`safe_flush` 等基础工具
- 改动影响：
  - HTTP 层职责更清晰，fncall 处理独立到 tools 模块

### src/core/scheduler.py（删除）

- 修改内容：
  - 整个文件被删除
- 改动影响：
  - 调度功能被新的 `gateway`、`selector`、`retry` 模块替代

### src/core/server.py

- 修改内容：
  - 重写服务器创建逻辑
  - 集成新的路由注册系统
  - 新增 `REGISTRY_KEY`、`SESSION_KEY` 等 AppKey 定义
  - 适配新的 aiohttp.web 路由注册方式
- 改动影响：
  - 服务器启动与新路由系统（OpenAI/Anthropic/Static）对齐

### src/logger.py

- 修改内容：
  - 重写日志系统
  - 新增颜色检测逻辑（`NO_COLOR`、`FORCE_COLOR`、`CLICOLOR_FORCE`、`TERM`、`WT_SESSION`）
  - 新增纯文本回退机制
  - 改进日志格式和输出
  - 从 loguru 改为 Python 标准 logging
- 改动影响：
  - 减少外部依赖，日志输出更稳定
  - 支持更多终端环境的颜色显示

### src/platforms/__init__.py

- 修改内容：
  - 更新 `__all__` 导出列表
  - 新增 `base` 模块导出
- 改动影响：
  - 适配新平台适配器基类

### src/platforms/deepseek/TODO.txt（删除）

- 修改内容：
  - 删除 TODO 文件
- 改动影响：
  - 清理开发过程中的临时记录

### src/platforms/deepseek/__init__.py

- 修改内容：
  - 更新导出列表
  - 适配新的 `adapter_impl` 结构
- 改动影响：
  - 与其他平台导出风格保持一致

### src/platforms/deepseek/adapter.py

- 修改内容：
  - 简化为重导出模块
  - 实际实现迁移到 `core/adapter_impl.py`
- 改动影响：
  - 与其他平台架构对齐（adapter.py 仅重导出）

### src/platforms/deepseek/core/__init__.py

- 修改内容：
  - 更新内部模块导出
- 改动影响：
  - 适配新模块拆分

### src/platforms/deepseek/core/adapter_impl.py

- 修改内容：
  - 实现新的 `PlatformAdapter` 基类接口
  - 重写 `init`、`candidates`、`ensure_candidates`、`complete`、`close` 方法
  - 适配新的 `Candidate` 数据结构
  - 集成新的流式解析和工具调用处理
- 改动影响：
  - 与新核心架构完全对齐

### src/platforms/deepseek/core/client.py

- 修改内容：
  - 大幅重写（+529 行）
  - 新增完整的 HTTP 客户端实现
  - 支持流式和非流式请求
  - 集成代理切换逻辑
  - 新增错误处理和重试机制
- 改动影响：
  - 客户端功能更完善，与新 gateway 架构兼容

### src/platforms/deepseek/core/constants.py

- 修改内容：
  - 更新 API 端点、模型列表等常量
  - 新增配置相关常量
- 改动影响：
  - 适配平台 API 变更

### src/platforms/deepseek/core/headers.py

- 修改内容：
  - 微调请求头构建逻辑
- 改动影响：
  - 小改动，不影响核心功能

### src/platforms/deepseek/core/hif.py

- 修改内容：
  - 更新 HIF（Human Interface Format）处理逻辑
- 改动影响：
  - 适配新消息格式

### src/platforms/deepseek/core/models_cache.py

- 修改内容：
  - 简化模型缓存逻辑
  - 使用新的 `src.core.models_cache` 通用实现
- 改动影响：
  - 减少平台特定缓存代码

### src/platforms/deepseek/core/pow.py

- 修改内容：
  - 微调 PoW（Proof of Work）计算逻辑
- 改动影响：
  - 保持与 DeepSeek 平台 PoW 验证兼容

### src/platforms/deepseek/core/session_api.py

- 修改内容：
  - 更新会话管理逻辑
- 改动影响：
  - 适配新认证流程

### src/platforms/deepseek/core/stream_parser.py

- 修改内容：
  - 重写流式响应解析器
  - 支持新的 SSE 格式
  - 改进 chunk 处理逻辑
- 改动影响：
  - 流式输出更稳定

### src/platforms/deepseek/core/user_api.py

- 修改内容：
  - 更新用户 API 调用
- 改动影响：
  - 适配平台用户接口变更

### src/platforms/deepseek/util.py

- 修改内容：
  - 新增/更新工具函数
  - 集成新的配置获取方式
- 改动影响：
  - 工具函数与新架构对齐

### src/platforms/ollama/__init__.py

- 修改内容：
  - 更新导出列表
- 改动影响：
  - 适配新模块结构

### src/platforms/ollama/adapter.py

- 修改内容：
  - 简化为重导出模块
- 改动影响：
  - 与其他平台架构对齐

### src/platforms/ollama/client.py

- 修改内容：
  - 更新 Ollama HTTP 客户端
- 改动影响：
  - 适配 Ollama API

### src/platforms/ollama/core/__init__.py

- 修改内容：
  - 更新内部导出
- 改动影响：
  - 适配新模块

### src/platforms/ollama/core/adapter_impl.py

- 修改内容：
  - 实现新的 `PlatformAdapter` 基类接口
  - 适配 `Candidate` 数据结构
  - 重写核心方法
- 改动影响：
  - 与新架构对齐

### src/platforms/ollama/core/client.py

- 修改内容：
  - 大幅重写（+852 行）
  - 新增完整 Ollama API 客户端实现
  - 支持聊天补全、嵌入等接口
- 改动影响：
  - Ollama 平台功能更完整

### src/platforms/ollama/core/constants.py

- 修改内容：
  - 更新模型列表和 API 常量
- 改动影响：
  - 适配 Ollama 更新

### src/platforms/ollama/util.py

- 修改内容：
  - 更新工具函数
- 改动影响：
  - 与新架构对齐

### src/platforms/qwen/__init__.py

- 修改内容：
  - 更新导出列表
- 改动影响：
  - 适配新模块结构

### src/platforms/qwen/adapter.py

- 修改内容：
  - 简化为重导出模块
- 改动影响：
  - 与其他平台架构对齐

### src/platforms/qwen/core/__init__.py

- 修改内容：
  - 微调内部导出
- 改动影响：
  - 适配新模块

### src/platforms/qwen/core/adapter_impl.py

- 修改内容：
  - 实现新的 `PlatformAdapter` 基类接口（+514 行）
  - 适配 `Candidate` 数据结构
  - 集成代理切换、模型缓存、账号池等
- 改动影响：
  - Qwen 平台完整适配新架构

### src/platforms/qwen/core/client.py

- 修改内容：
  - 大幅重写（+2193 行）
  - 新增完整 DashScope API 客户端
  - 支持聊天、视觉、工具调用等
- 改动影响：
  - Qwen 平台功能大幅增强

### src/platforms/qwen/core/constants.py

- 修改内容：
  - 更新 API 端点和模型常量
- 改动影响：
  - 适配 DashScope API

### src/platforms/qwen/util.py

- 修改内容：
  - 更新工具函数
- 改动影响：
  - 与新架构对齐

### src/routes/__init__.py

- 修改内容：
  - 更新路由模块导出
  - 移除旧的 `chat`、`function_call`、`health`、`models` 导出
  - 新增 `anthropic`、`openai`、`static` 导出
- 改动影响：
  - 适配新路由架构

### src/routes/chat.py（删除）

- 修改内容：
  - 整个文件被删除，功能迁移到 `src/routes/openai.py`
- 改动影响：
  - 路由职责重新划分

### src/routes/function_call.py（删除）

- 修改内容：
  - 整个文件被删除，功能迁移到 `src/core/tools.py`
- 改动影响：
  - 工具调用处理集中到核心模块

### src/routes/health.py（删除）

- 修改内容：
  - 整个文件被删除，功能迁移到 `src/routes/static.py`
- 改动影响：
  - 静态路由集中管理

### src/routes/models.py（删除）

- 修改内容：
  - 整个文件被删除，功能迁移到 `src/routes/static.py` 和 `src/routes/openai.py`
- 改动影响：
  - 模型列表路由重新组织

### src/core/candidate.py（新增）

- 修改内容：
  - 定义 `Candidate` 数据类，包含全部能力布尔字段及元数据
  - 定义 `ALL_CAPABILITIES` 元组（32 种能力）
  - 提供 `make_id()` 生成全局唯一候选项 ID
  - `Candidate` 包含 `has_capability()`、`to_model_dict()` 方法
- 改动影响：
  - 统一的候选项数据模型，支持细粒度能力描述

### src/core/config/（新增目录）

- 修改内容：
  - 新配置系统，包含 `__init__.py`、`base.py`、`sections.py`、`manager.py`、`resolver.py`
  - `sections.py`：定义所有配置段数据类（ServerCfg、GatewayCfg、ProxyCfg 等）
  - `manager.py`：配置管理器，支持模板合并、版本检查、watchdog 热重载
  - `resolver.py`：共享模型名称解析器
  - `base.py`：配置基类
  - 使用 `tomlkit` 保留注释，使用 `watchdog` 实时监控
  - 支持 `AppConfig.from_dict()` 从字典构造配置
- 改动影响：
  - 配置系统从单文件重构为模块化架构
  - 新增配置文件实时监控和热重载能力
  - 新增模板合并和版本管理机制

### src/core/errors.py（新增）

- 修改内容：
  - 定义完整的异常层次结构
  - 根基类 `ProviderError`，包含 `original` 和 `status_code`
  - 平台级异常：`PlatformError`、`AuthError`、`RateLimitError`、`ServerError` 等
  - 业务异常：`NoCandidateError`、`ModelNotFoundError`、`ContextLengthError` 等
  - 新增 `classify_http_error()` 根据 HTTP 状态码自动分类异常
- 改动影响：
  - 统一的异常体系，便于错误处理和调试

### src/core/files.py（新增）

- 修改内容：
  - `FileUtil` 工具类，静态方法集合
  - MIME 类型推断、Data URI 解析、文件保存、MD5 计算等
  - 支持图像、音频、视频、PDF 等文件类型
- 改动影响：
  - 文件处理工具函数集中管理

### src/core/gateway.py（新增）

- 修改内容：
  - 核心请求分发模块 `dispatch()` 函数
  - 支持单候选项执行和多候选项竞速
  - 集成 TAS 候选项选择器
  - 注入 fncall 工具调用
  - 处理 token 估算和 usage 规范化
  - `_single()` 单候选项执行，`_race()` 多候选项竞速
- 改动影响：
  - 核心请求分发逻辑，支持并发竞速模式

### src/core/models_cache.py（新增）

- 修改内容：
  - 通用模型列表缓存管理器 `ModelsCache`
  - 支持从 `persist/{platform}/models.json` 读取缓存
  - 定时刷新远程模型列表
  - 支持覆盖或追加策略
- 改动影响：
  - 统一的模型缓存实现，替代各平台独立实现

### src/core/proxy.py（新增）

- 修改内容：
  - 完整的代理支持模块
  - 支持 HTTP/HTTPS/SOCKS5 代理
  - 自动检测环境变量和配置文件
  - Patch `requests` 和 `aiohttp` 库以使用代理
  - SOCKS 代理使用 `aiohttp-socks`
  - SSL 验证全局禁用
- 改动影响：
  - 从旧代理模块重构，功能更完善

### src/core/registry.py（新增）

- 修改内容：
  - 平台注册表 `Registry` 类
  - 递归发现 `src.platforms` 下所有平台适配器
  - 黑白名单过滤
  - 热重载平台适配器（清理 sys.modules）
  - 提供 `get_candidates`、`ensure_candidates`、`adapter_for` 等方法
  - 集成 TAS 选择器
- 改动影响：
  - 统一的平台注册和管理中心

### src/core/retry.py（新增）

- 修改内容：
  - 重试工具模块
  - `retry_with_backoff`：指数退避重试
  - `retry_on_empty`：空响应重试
  - `retry_on_exception`：指定异常类型重试
- 改动影响：
  - 通用重试逻辑，各平台复用

### src/core/selector.py（新增）

- 修改内容：
  - TAS（Thompson Sampling + 冷却机制）选择器
  - `CandidateStats` 统计类（Beta 分布 + EMA）
  - `Selector` 类实现 TAS 算法
  - 滑动窗口、探索率衰减、冷却时间等超参数
  - 提供 `select()`、`record()`、`get_stats()` 方法
- 改动影响：
  - 智能候选项选择，优化请求延迟和成功率

### src/core/tools.py（新增）

- 修改内容：
  - fncall 模板注入与解析模块（1655 行）
  - 支持 en/zh 双语
  - Schema 感知类型转换（JSON Schema）
  - 流式解析状态机 `FncallStreamParser`
  - Agent 循环检测 `detect_tool_loop`
  - UUIDv7 生成
  - XML 格式 tool call 解析
- 改动影响：
  - 完整的工具调用处理系统，从旧 `function_call.py` 大幅增强

### src/core/watcher.py（新增）

- 修改内容：
  - 文件变更监视器 `FileWatcher`
  - 扫描 `src/` 下所有 `.py` 文件和 `config.toml`
  - 分类变更为核心文件或平台文件
  - 核心文件变更触发进程重启（exit code 42）
  - 平台文件变更触发热重载
- 改动影响：
  - 支持代码和配置热重载

### src/platforms/base.py（新增）

- 修改内容：
  - 平台适配器抽象基类 `PlatformAdapter`
  - 定义必需接口：`name`、`init`、`candidates`、`ensure_candidates`、`complete`、`close`
  - 提供可选能力方法默认实现（embedding、image、audio、video、moderation、rerank 等）
  - 代理切换方法 `set_proxy_enabled`、`is_proxy_enabled`
- 改动影响：
  - 统一的平台适配器规范

### src/platforms/qwen/core/shared.py（新增）

- 修改内容：
  - Qwen 平台共享工具和常量
- 改动影响：
  - 减少 Qwen 平台内部代码重复

### src/routes/anthropic.py（新增）

- 修改内容：
  - Anthropic 兼容路由（1097 行）
  - `POST /v1/messages`、`POST /messages`
  - `GET /anthropic/v1/models`、`GET /anthropic/v1/models/{model_id}`
  - `POST /v1/messages/count_tokens`
  - 支持流式/非流式、thinking 模式、工具调用、多模态内容
  - Anthropic 格式与 OpenAI 格式转换
- 改动影响：
  - 新增 Anthropic API 兼容支持

### src/routes/openai.py（新增）

- 修改内容：
  - OpenAI 兼容路由（2085 行）
  - `POST /v1/chat/completions`、`POST /v1/responses`
  - `POST /v1/embeddings`、图片、音频、视频端点
  - Files、Fine-tuning、Batch、Assistants、Threads、Runs、Vector Stores、Uploads 端点
  - 完整支持流式输出和工具调用
  - 文件上传提取（base64 data URI）
- 改动影响：
  - 从旧 `chat.py` 大幅扩展，实现完整 OpenAI API 兼容

### src/routes/static.py（新增）

- 修改内容：
  - 静态路由模块
  - `GET /`、`GET /health`、`GET /docs`
  - `GET /v1/models`、`GET /v1/models/{model_id}`
  - `GET /v1/status`（含 TAS 统计数据）
  - `GET /v1/capabilities`（能力矩阵查询）
  - `POST /v1/admin/refresh_models`（手动触发模型刷新）
- 改动影响：
  - 集中管理健康检查、模型列表、状态等基础路由

### tests/（新增目录）

- 修改内容：
  - 新增测试目录
  - 当前为空目录结构
- 改动影响：
  - 为后续测试代码提供存放位置
