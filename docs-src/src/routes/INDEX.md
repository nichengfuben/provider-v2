# src/routes 索引

路由层负责对外协议兼容，包括 OpenAI、Anthropic 与静态页面入口。

## OpenAI 路由模块结构

`openai.py` 为聚合入口，导入以下 4 个子模块：

| 子模块 | 说明 |
|--------|------|
| `openai_helpers.py` | 共享工具、常量、ID 生成器 |
| `openai_chat.py` | Chat Completions 端点（流式 + 非流式） |
| `openai_media.py` | 媒体端点：图片、音频、视频、embeddings |
| `openai_stubs.py` | 存根/未实现处理器（Files、Fine-Tuning、Batch 等） |
