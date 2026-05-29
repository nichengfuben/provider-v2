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

**重构 + 新功能：**
- `src/core/fncall/` — 新建协议包，包含 ToolProtocol ABC、注册表、共享工具、5 种协议实现
  - `base.py` — ToolProtocol 抽象基类 + 协议注册表
  - `registry.py` — get_protocol() 配置驱动解析 + list_protocols()
  - `shared/coercion.py` — Schema 感知类型转换（从 tools.py 迁移）
  - `shared/normalization.py` — normalize_content, format_tool_descs
  - `shared/loop_detect.py` — detect_tool_loop, LoopDetectionResult
  - `shared/uuid7.py` — UUIDv7 生成
  - `parsers/xml_parser.py` — parse_fncall, parse_fncall_xml（从 tools.py 迁移）
  - `parsers/stream.py` — FncallStreamParser 改造为协议感知版本
  - `prompt/templates.py` — 内置 prompt 模板（从 tools.py 迁移）
  - `prompt/history.py` — 对话历史格式化（从 tools.py 迁移）
  - `prompt/inject.py` — inject_fncall 改造为协议感知
  - `protocols/xml.py` — XML 协议（现有默认行为）
  - `protocols/original.py` — codexResponses JSON 协议
  - `protocols/antml.py` — anthropicToolUse 协议（含硬性 prompt）
  - `protocols/bracket.py` — managedBracket 方括号协议
  - `protocols/custom.py` — 自定义 prompt 协议（不解析响应）
- `src/core/tools.py` — 改为薄适配层，从 fncall/ 重新导出所有名称，FncallStreamParser shim 自动解析协议
- `src/core/http.py` — clean_fncall/safe_flush 改为从当前协议获取标签检测逻辑
- `src/core/config/sections.py` — FncallCfg 新增 protocol/custom_prompt_en/custom_prompt_zh/print_prompt 字段，删除 call_start_tag 等 4 个 tag 字段
- `template/template_config.toml` — [fncall] 段落：protocol = "xml" 默认值，新增 custom_prompt 字段，删除 tag 配置
- 版本号 2.2.3 → 2.2.4

### 验证结果

- py_compile: 23 files OK
- pytest: 25 passed, 0 failed, 0 skipped
- 5 种协议全部注册并可用：xml, original, antml, bracket, custom
- 向后兼容：所有现有导入（gateway.py, routes/*, tests/*）无需修改

---

2026-05-29 | Session 自动审查 — hook 配置增强 + .gitignore 优化

### 变更文件

- .gitignore
- .qoder/hooks/session-cleanup.py
- .qoder/settings.local.json
- record.md

### 变更说明

**配置优化：**
- `.gitignore` — 添加 `agents.md`（小写）到忽略列表，防止与 `AGENTS.md` 冲突
- `.qoder/hooks/session-cleanup.py` — 增强变更检测逻辑：新增 `excluded_files` 集合排除 `record.md` 和 `config.toml`，防止 hook 误触发自身管理的文件导致死循环
- `.qoder/settings.local.json` — 新增 SessionStart hook：自动运行 `inject-provider-guide.py` 脚本注入 provider-guide skill，跳过已注入状态，确保每次会话自动加载项目技能

### 验证结果

- `py_compile` 通过（.qoder/hooks/session-cleanup.py）
- pytest: 0 tests（tests/ 目录存在但无测试文件）

---

2026-05-29 | Skill 自动更新 — gen_merger.py 误用 + 犯错自动更新原则

### 变更文件

- .agents/provider-guide/SKILL.md

### 变更说明

**错误记录：**
- 用户明确要求合并 8 个指定路径的 `.ts` 文件，但 agent 直接运行 `gen_merger.py` 对整个目录树进行递归合并（18个文件），未按用户指定的文件列表操作
- 根因：SKILL.md 缺少"当用户明确指定文件列表时，不应使用目录遍历脚本"的规则

**Skill 更新：**
- 新增 `Script usage rules` 章节：要求运行脚本前确认输入路径、用户给文件列表时精确合并、先 dry run、确认输出位置
- 新增 `Failure-driven skill auto-update principle` 章节：犯错后立即更新 skill、根因分析、规则具体化、保留旧规则、record.md 记录、版本号递增

**版本递增（2.2.3 → 2.2.4）：**
- SKILL.md frontmatter version → 2.2.4

### 验证结果

- 待确认 upload.txt 内容正确

---

2026-05-24 | 修复 WebUI 日志实时推送 — 在 _on_startup 中捕获事件循环

### 变更文件

- src/webui/logs_ws.py
- src/core/server.py

### 变更说明

**Bug 修复：**
- `src/core/server.py` — 将 `setup_loguru_sink()` 和 `log_broker.set_loop()` 移到 `_on_startup` 回调中执行，确保在事件循环已运行后捕获正确的 loop 引用
- `src/webui/logs_ws.py` — 简化回直接 `run_coroutine_threadsafe`，移除不可靠的 queue+worker 方案
- 修复前 sink 在 `create_app()` 中初始化时事件循环尚未启动，导致 loop 为 None，日志无法推送

### 验证结果

- `py_compile` 通过

---

2026-05-24 | 修复 WebUI 日志实时推送 — 使用队列+worker 替代 run_coroutine_threadsafe

### 变更文件

- src/webui/logs_ws.py

### 变更说明

**Bug 修复：**
- `src/webui/logs_ws.py` — 重写 `_loguru_sink`：改用 `queue.Queue` 缓冲 + `_queue_worker()` 协程消费，替代不可靠的 `asyncio.run_coroutine_threadsafe`
- 新增 `set_loop()` / `_start_worker()` / `_queue_worker()` 方法，确保日志在主事件循环中正确广播
- 修复前日志面板"卡着不动"，修复后实时推送服务器日志到 WebUI

### 验证结果

- `py_compile` 通过

---

2026-05-24 | 修复 WebUI 日志同步 — 注册 loguru sink 到 WebSocket broker

### 变更文件

- src/webui/logs_ws.py
- src/core/server.py

### 变更说明

**Bug 修复：**
- `src/webui/logs_ws.py` — 新增 `WebUILogBroker._loguru_sink()` 方法，作为 loguru 的同步 sink，将每条日志推入 asyncio 事件循环并通过 WebSocket 广播
- `src/webui/logs_ws.py` — 新增 `setup_loguru_sink()` 函数，用于注册 loguru sink
- `src/core/server.py` — 在 `create_app()` 中调用 `setup_loguru_sink()`，使所有 loguru 日志（控制台+文件）同步推送到 WebUI 日志面板
- 修复前日志面板为空（`log_broker.broadcast` 从未被调用），修复后实时显示服务器日志

### 验证结果

- `py_compile` 通过

---

2026-05-24 | 修复 WebUI 日志面板 — 移除前端动作日志淹没服务器日志

### 变更文件

- src/webui/templates/scripts_actions.py

### 变更说明

**体验优化：**
- `src/webui/templates/scripts_actions.py` — `refreshAll()` 删除 `log('开始刷新状态。')` 和 `log('状态刷新完成。')` 调用，避免每次自动刷新时在日志面板产生冗余消息
- `src/webui/templates/scripts_actions.py` — `refreshModels()` 删除成功时的 `log('模型刷新完成：...')` 调用（失败时仍保留日志）
- 日志面板现在只显示真实的服务器端日志（通过 WebSocket 推送），不再被前端 UI 动作日志淹没

### 验证结果

- `py_compile` 通过

---

2026-05-24 | 修复 WebUI 重载按钮 — reload_service 回退到配置重载

### 变更文件

- src/webui/routers/admin.py

### 变更说明

**Bug 修复：**
- `src/webui/routers/admin.py` — `reload_service` 原逻辑在 `webui_server` 不存在时直接返回 503 错误，修复为：当 WebUI 挂载在主服务器中（无独立 WebUIServer 实例）时，回退到 `reload_config()` 重载配置
- 修复前报错：`{"error": "server not available"}`，修复后返回：`{"status": "ok", "message": "Config reloaded (WebUI routes are static)"}`

### 验证结果

- `py_compile` 通过
- POST `/v1/admin/reload` 正常返回 200

---

2026-05-24 | 修复 /docs 路由冲突 — 移除静态占位符，释放 WebUI 文档页面

### 变更文件

- src/routes/static.py

### 变更说明

**Bug 修复：**
- `src/routes/static.py` — 删除 `/docs` 静态路由（返回 JSON `{"docs": "暂未提供在线文档"}`），该路由优先于 WebUI 的 `/docs` 页面导致文档无法渲染
- `src/routes/static.py` — 根路由 `/` 的 `docs` 字段从 `"/docs"` 改为 `"/webui"`，指向正确的管理界面
- 删除不再使用的 `docs()` 函数

### 验证结果

- `py_compile` 通过
- `/docs` 和 `/webui` 均正常返回 HTML 页面

---

2026-05-24 | ServerCfg 补全 STARTUP_FORCE_KILL_PORT + Hook 版本管理规则重写

### 变更文件

- src/core/config/sections.py
- src/core/config.py
- .qoder/hooks/session-cleanup.py
- .qoder/settings.local.json
- template/template_config.toml
- config.toml
- README.md
- .agents/provider-guide/SKILL.md

### 变更说明

**配置修复：**
- `src/core/config/sections.py` — `ServerCfg` 补全缺失的 `STARTUP_FORCE_KILL_PORT: bool = True` 字段（模板中已有但 dataclass 未定义）
- `src/core/config.py` — 同步更新 legacy `ServerCfg` 版本默认值及 `_from_dict` 回退值

**Hook 基础设施：**
- `.qoder/hooks/session-cleanup.py` — 重写版本管理规则：明确 `template_config.toml` 为版本唯一基准，config.toml/SKILL.md/README 等跟随模板；+0.0.1 递增；排除 record.md/config.toml 防止死循环
- `.qoder/settings.local.json` — 新增 SessionStart hook，自动注入 provider-guide skill（防重复注入）

**版本递增（2.2.2 → 2.2.3）：**
- 所有版本引用同步更新：template、config、sections.py、config.py、README 徽章/路线图、SKILL.md frontmatter

### 验证结果

- 待 py_compile 验证

---

2026-05-24 | CODE_GUIDE 合规修复 + 版本统一

### 变更文件

- src/core/config/__init__.py
- src/core/config/sections.py
- src/core/server.py
- src/core/watcher.py
- src/core/registry.py
- src/core/config/manager.py
- src/routes/openai.py
- src/routes/anthropic.py
- src/logger.py
- src/platforms/chutes/__init__.py
- src/platforms/n1n/__init__.py
- src/platforms/openrouter/__init__.py
- src/platforms/edgetts/core/websocket.py
- README.md
- .agents/provider-guide/SKILL.md

### 变更说明

**CODE_GUIDE 合规修复：**
- `src/core/config/__init__.py` + 4 个平台 `__init__.py` — 补全缺失的 `from __future__ import annotations`
- `src/routes/openai.py` (3处) + `src/routes/anthropic.py` (1处) + `src/logger.py` (3处) + `src/core/watcher.py` (2处) + `src/core/registry.py` (1处) + `src/core/config/manager.py` (2处) + `src/platforms/edgetts/core/websocket.py` (2处) — 消除 silent `except Exception: pass` 模式，改为具体异常+日志记录
- `src/core/server.py` — 补全 `json_response()` 和 `create_app()` 的 docstring
- `src/core/config/__init__.py` — 补全 `get_config()`/`reload_config()`/`start_config_watcher()` docstring
- `src/core/config/sections.py` — 补全 11 个配置数据类的 class docstring
- `src/core/config/sections.py` — 修复 `ServerCfg` 缺少 `version` 字段

**版本统一（2.2.2）：**
- README.md 版本徽章 → 2.2.2
- README.md 路线图更新 → 2.2.2
- SKILL.md frontmatter version → 2.2.2

### 验证结果

- 所有修改文件 `py_compile` 通过

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
