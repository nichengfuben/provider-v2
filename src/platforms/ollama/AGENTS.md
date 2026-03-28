# AGENTS.md — Ollama 平台错误、意外与易混淆点

> **用途**：本文件记录 AI 代理在 Ollama 平台工作时常见的错误和易混淆之处。
> 如果你遇到了意外情况，请立即告知开发者并追加到本文件中，
> 以防未来的代理重蹈覆辙。
>
> **活文档**：在工作过程中实时更新本文件。

**最后更新**：2026-03-21T13:30:00+08:00
**更新者**：AI Agent (自动分析任务)

---

## 必须避免的严重错误

### [CRITICAL] 响应流格式错误
**你会假设**：使用标准 SSE（Server-Sent Events）格式
**实际情况**：Ollama 使用 NDJSON（非 SSE）
**犯错后果**：流式响应解析失败
**正确做法**：使用 NDJSON 解析器，每行是一个独立的 JSON 对象

### [CRITICAL] 参数名称错误
**你会假设**：使用标准 OpenAI 的 `max_tokens`
**实际情况**：Ollama 使用 `options.num_predict`（非 `max_tokens`）
**犯错后果**：参数被忽略，使用默认值
**正确做法**：使用 `options.num_predict` 参数

### [CRITICAL] 服务器发现函数错误
**你会假设**：可以直接调用服务器发现函数
**实际情况**：服务器发现是同步函数，需要 `run_in_executor` 桥接
**犯错后果**：阻塞事件循环
**正确做法**：代码会自动使用 `loop.run_in_executor`

## 易混淆之处

### [WARNING] embedding 回退字段
**混淆之处**：embedding 响应使用什么字段
**澄清**：`/api/embed` 可能回退到 `embedding` 字段
**示例**：检查 `data` 或 `embedding` 字段

### [WARNING] thinking/search 忽略
**混淆之处**：如何处理 thinking 和 search 参数
**澄清**：Ollama 不支持 thinking 和 search，这些参数会被忽略
**示例**：不需要发送这些参数

## 最近发现的发现意外日志

<!-- 当你遇到意外时，在此追加：
### {ISO date} — {标题}
**上下文**：{你正在执行的任务}
**意外**：{发生了什么}
**解决方案**：{正确的行为/做法是什么}
-->
