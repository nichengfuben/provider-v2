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
