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
