# Provider-V2

> 统一 AI 模型网关，聚合多个 AI 平台，提供 OpenAI 和 Anthropic 兼容 API

## 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [安装指南](#-安装指南)
- [使用说明](#-使用说明)
- [项目结构](#-项目结构)
- [配置说明](#-配置说明)
- [API 文档](#-api-文档)
- [常见问题](#-常见问题)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [联系方式](#-联系方式)

---

## 项目简介

### 项目背景

Provider-V2 是一个高性能的 AI 模型网关，旨在解决多平台接入的复杂性。通过统一的 API 接口，开发者可以轻松访问多个主流 AI 平台，无需关心各平台的差异性实现细节。

### 核心功能

- **多平台聚合**：支持 Qwen、DeepSeek、GLM、Cerebras、Ollama、ChatMoe 六大平台
- **API 兼容性**：同时兼容 OpenAI 和 Anthropic API 规范
- **并发竞速**：智能选择最快响应的候选项，降低延迟
- **工具调用支持**：完整的 function calling 功能，支持中英文模板
- **推理增强**：支持 thinking 和 search 推理增强功能
- **自动回退**：Token 计数失败时自动回退到估算值

### 技术栈

| 类别 | 技术 |
|------|------|
| Web 框架 | FastAPI >= 0.100.0 |
| 异步运行时 | uvicorn[standard] >= 0.20.0 |
| HTTP 客户端 | aiohttp >= 3.9.0 |
| 数据验证 | pydantic >= 2.0.0 |
| 平台 SDK | cerebras-cloud-sdk >= 1.0.0 |
| WASM 运行时 | wasmtime >= 0.40.0 |
| HTML 解析 | beautifulsoup4 >= 4.12.0 |
| HTTP 库 | requests >= 2.31.0 |
| 加密库 | pycryptodome >= 3.20.0 |
| 进度条 | tqdm >= 4.60.0 |

### 为什么选择 Provider-V2

| 特性 | Provider-V2 | 直接接入各平台 |
|------|------------|----------------|
| 统一 API | ✅ OpenAI/Anthropic 兼容 | ❌ 各平台 API 不同 |
| 并发竞速 | ✅ 自动选择最快响应 | ❌ 需自行实现 |
| 多平台切换 | ✅ 配置文件切换 | ❌ 需修改代码 |
| 工具调用 | ✅ 统一 fncall 接口 | ❌ 格式各异 |
| 推理增强 | ✅ thinking/search 支持 | ❌ 仅部分支持 |
| 代理支持 | ✅ 全局代理配置 | ❌ 需逐个配置 |

---

## 功能特性

### 核心功能

- ✅ **多平台聚合** - 统一接入 Qwen、DeepSeek、GLM、Cerebras、Ollama、ChatMoe
- ✅ **OpenAI 兼容 API** - 完整支持 `/v1/chat/completions`、`/v1/models` 等接口
- ✅ **Anthropic 兼容 API** - 完整支持 `/v1/messages`、`/v1/models` 等接口
- ✅ **并发竞速模式** - 同时请求多个候选项，选择最快响应
- ✅ **工具调用（fncall）** - 支持中英文模板，自动注入工具描述
- ✅ **推理增强** - 支持 thinking 和 search 参数增强推理能力
- ✅ **流式响应** - 完整支持 SSE 流式输出
- ✅ **鉴权中间件** - 可配置的 API Key 鉴权机制
- ✅ **配置热加载** - 修改配置文件后自动重载，无需重启
- ✅ **代理支持** - 全局代理配置，自动禁用 SSL 验证

### 高级功能

- 🔧 **智能 Token 回退** - 平台返回 usage 为 0 时自动使用 `len//3` 估算
- 🔧 **模型映射** - 支持自定义模型名称映射
- 🔧 **健康检查** - 内置 `/health` 健康检查端点
- 🔧 **自动文档** - 集成 Swagger UI（`/docs`）和 ReDoc（`/redoc`）
- 🔧 **WASM PoW** - DeepSeek 平台自动管理 WASM PoW 求解
- 🔧 **账号池管理** - 支持多账号轮询和自动登录

---

## 快速开始

### 环境要求

- Python >= 3.8
- pip >= 21.0
- 操作系统：Windows / macOS / Linux

### 30 秒快速体验

```bash
# 1. 克隆项目
git clone https://github.com/nichengfuben/provider-v2.git
cd provider-v2

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置平台账号（编辑 config.toml）
# 详细配置见"配置说明"章节

# 4. 启动服务
python main.py
```

### 验证安装

访问 http://localhost:1337/docs，看到 Swagger UI 页面即表示安装成功。

健康检查：访问 http://localhost:1337/health，返回 `{"status": "ok"}` 表示服务正常运行。

---

## 安装指南

### 方式一：pip 安装

```bash
# 克隆仓库
git clone https://github.com/nichengfuben/provider-v2.git
cd provider-v2

# 安装依赖
pip install -r requirements.txt
```

### 方式二：使用虚拟环境（推荐）

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
.\venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 方式三：Docker 安装

```dockerfile
# Dockerfile 示例
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 1337

CMD ["python", "main.py"]
```

```bash
# 构建镜像
docker build -t provider-v2:latest .

# 运行容器
docker run -d -p 1337:1337 provider-v2:latest
```

### 系统特定说明

#### Windows

```powershell
# 使用虚拟环境
python -m venv venv
.\ven\Scripts\activate
pip install -r requirements.txt
python main.py
```

**注意事项**：Windows 平台使用 `asyncio` 事件循环，其他平台优先使用 `uvloop`。

#### macOS

```bash
# 安装 Homebrew（如已安装可跳过）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Python 3.11
brew install python@3.11

# 创建虚拟环境并安装
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### Linux

```bash
# Ubuntu / Debian
sudo apt-get update
sudo apt-get install python3 python3-pip python3-venv

# 创建虚拟环境并安装
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# 使用 systemd 启动（可选）
sudo systemctl enable python3
```

---

## 使用说明

### 基础用法

#### OpenAI API 调用

```python
import aiohttp

async def chat_with_openai():
    async with aiohttp.ClientSession() as session:
        headers = {
            "Authorization": "Bearer your-api-key",
            "Content-Type": "application/json"
        }
        data = {
            "model": "qwen-plus",
            "messages": [
                {"role": "user", "content": "你好，请介绍一下你自己"}
            ],
            "stream": False
        }

        async with session.post(
            "http://localhost:1337/v1/chat/completions",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            print(result["choices"][0]["message"]["content"])
```

#### Anthropic API 调用

```python
import aiohttp

async def chat_with_anthropic():
    async with aiohttp.ClientSession() as session:
        headers = {
            "x-api-key": "your-api-key",
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        data = {
            "model": "claude-3-sonnet-20240229",
            "max_tokens": 1024,
            "messages": [
                {"role": "user", "content": "你好，请介绍一下你自己"}
            ]
        }

        async with session.post(
            "http://localhost:1337/v1/messages",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            print(result["content"][0]["text"])
```

### 高级用法

#### 工具调用（fncall）

```python
import aiohttp

async def function_calling_example():
    async with aiohttp.ClientSession() as session:
        headers = {
            "Authorization": "Bearer your-api-key",
            "Content-Type": "application/json"
        }
        data = {
            "model": "qwen-plus",
            "messages": [
                {"role": "user", "content": "北京今天的天气怎么样？"}
            ],
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": "get_weather",
                        "description": "获取指定城市的天气",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "city": {
                                    "type": "string",
                                    "description": "城市名称"
                                }
                            },
                            "required": ["city"]
                        }
                    }
                }
            ]
        }

        async with session.post(
            "http://localhost:1337/v1/chat/completions",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            tool_call = result["choices"][0]["message"]["tool_calls"]
            print(f"模型调用了工具: {tool_call[0]['function']['name']}")
```

#### 流式响应

```python
import aiohttp
import json

async def streaming_example():
    async with aiohttp.ClientSession() as session:
        headers = {
            "Authorization": "Bearer your-api-key",
            "Content-Type": "application/json"
        }
        data = {
            "model": "qwen-plus",
            "messages": [
                {"role": "user", "content": "请写一首关于春天的诗"}
            ],
            "stream": True
        }

        async with session.post(
            "http://localhost:1337/v1/chat/completions",
            headers=headers,
            json=data
        ) as response:
            async for line in response.content:
                line = line.decode('utf-8').strip()
                if line.startswith('data: '):
                    data_str = line[6:]
                    if data_str == '[DONE]':
                        break
                    try:
                        chunk = json.loads(data_str)
                        if chunk['choices'][0]['delta'].get('content'):
                            print(chunk['choices'][0]['delta']['content'], end='', flush=True)
                    except json.JSONDecodeError:
                        continue
```

#### Thinking 推理增强

```python
import aiohttp

async def thinking_example():
    async with aiohttp.ClientSession() as session:
        headers = {
            "Authorization": "Bearer your-api-key",
            "Content-Type": "application/json"
        }
        data = {
            "model": "deepseek-reasoner",
            "messages": [
                {"role": "user", "content": "解释量子纠缠现象"}
            ],
            "extra_body": {
                "thinking": True  # 启用 thinking 模式
            }
        }

        async with session.post(
            "http://localhost:1337/v1/chat/completions",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            print("推理过程:", result.get("thinking", ""))
            print("最终答案:", result["choices"][0]["message"]["content"])
```

### 配置选项

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `model` | string | - | 模型名称，如 `qwen-plus`、`deepseek-chat` |
| `messages` | array | - | 消息列表，格式为 `[{role, content}]` |
| `stream` | boolean | `false` | 是否启用流式输出 |
| `max_tokens` | integer | - | 最大生成 Token 数 |
| `temperature` | float | - | 温度参数，控制随机性 |
| `tools` | array | - | 工具定义列表（fncall） |
| `extra_body` | object | - | 额外参数，如 `thinking`、`search` |

---

## 项目结构

```
provider-v2/
├── 📁 persist/                  # 持久化数据目录
│   ├── 📁 deepseek/           # DeepSeek WASM 文件和状态
│   ├── 📁 ollama/             # Ollama 模型缓存
│   └── 📁 qwen/              # Qwen 账号状态
├── 📁 src/                    # 源代码目录
│   ├── 📁 core/               # 核心模块
│   │   ├── 📄 config.py      # 配置管理
│   │   ├── 📄 gateway.py     # 网关核心逻辑
│   │   ├── 📄 proxy.py       # 代理配置
│   │   ├── 📄 registry.py    # 平台注册表
│   │   ├── 📄 selector.py    # 候选项选择器
│   │   └── 📄 tools.py       # 工具调用处理
│   ├── 📁 platforms/          # 平台适配器
│   │   ├── 📁 cerebras/      # Cerebras 平台
│   │   ├── 📁 chatmoe/       # ChatMoe 平台
│   │   ├── 📁 deepseek/      # DeepSeek 平台
│   │   ├── 📁 glm/           # GLM 平台
│   │   ├── 📁 ollama/        # Ollama 平台
│   │   └── 📁 qwen/         # Qwen 平台
│   └── 📁 routes/             # 路由层
│       ├── 📄 anthropic.py   # Anthropic API 路由
│       ├── 📄 openai.py      # OpenAI API 路由
│       └── 📄 static.py      # 静态路由
├── 📄 config.toml            # 配置文件
├── 📄 main.py                # 应用入口
├── 📄 requirements.txt        # Python 依赖
├── 📄 AGENTS.md              # AI 代理工作指南
└── 📄 README.md              # 项目文档
```

### 核心目录说明

| 目录 | 说明 |
|------|------|
| `src/core/` | 核心网关逻辑，包括配置管理、请求分发、候选项选择 |
| `src/platforms/` | 各平台适配器实现，自动发现机制 |
| `src/routes/` | HTTP 路由层，实现 OpenAI 和 Anthropic 兼容接口 |
| `persist/` | 平台状态持久化，如 DeepSeek WASM 文件、账号池等 |

---

## 配置说明

### 配置文件位置

Provider-V2 按以下顺序查找配置文件：
1. 环境变量 `CONFIG_PATH` 指定的路径
2. 项目根目录的 `config.toml`
3. 当前目录的 `config.toml`
4. 向上遍历 5 层目录查找 `config.toml`

### 完整配置示例

```toml
[server]
host = "0.0.0.0"
port = 1337
debug = false

[server.anthropic]
api_version = "2023-06-01"

[server.anthropic.model_mapping]
# 可选：自定义模型映射
# "claude-3-sonnet" = "qwen-plus"

[auth]
enabled = false
keys = ["sk-your-api-key-1", "sk-your-api-key-2"]

[gateway]
concurrent_enabled = true
concurrent_count = 3
min_tokens = 10

[proxy]
proxy_server = "http://proxy.example.com:8080"
proxy_enabled = true

[ollama]
additional_servers = ["host1:port1", "host2:port2"]

[fncall]
call_start_tag = "<function="
call_end_tag = "</function>"
tools_start_tag = "<tools>"
tools_end_tag = "</tools>"
```

### 配置项详解

#### 服务器配置

```toml
[server]
host = "0.0.0.0"        # 监听地址
port = 1337               # 监听端口
debug = false             # 调试模式
```

#### Anthropic 配置

```toml
[server.anthropic]
api_version = "2023-06-01"  # Anthropic API 版本

[server.anthropic.model_mapping]
# 可选：模型名称映射
# "source-model" = "target-model"
```

#### 鉴权配置

```toml
[auth]
enabled = true                                  # 是否启用鉴权
keys = ["key1", "key2", "key3"]               # 允许的 API Key 列表
```

**鉴权方式**：
- 优先从 `Authorization: Bearer {key}` 头提取
- 失败后从 `x-api-key` 头提取
- 以下路径跳过鉴权：`/`、`/health`、`/docs`、`/redoc`、`/openapi.json`

#### 网关配置

```toml
[gateway]
concurrent_enabled = true    # 是否启用并发竞速
concurrent_count = 3        # 并发请求数
min_tokens = 10            # 选择胜者的最小 Token 阈值
```

**并发竞速机制**：
- 同时向 `concurrent_count` 个候选项发送请求
- 当任一候选项累积 Token 数 ≥ `min_tokens` 时立即选择该候选项
- 适用于低延迟场景，会消耗更多配额

#### 代理配置

```toml
[proxy]
proxy_server = "http://proxy.example.com:8080"  # 代理服务器地址
proxy_enabled = true                              # 是否启用代理
```

**注意事项**：
- 代理在 `src.core.proxy` 模块导入时即生效
- 自动禁用 SSL 证书验证
- 修改配置后需重启服务生效

#### Ollama 配置

```toml
[ollama]
additional_servers = ["host1:port1", "host2:port2"]
```

- 配置额外的 Ollama 服务器
- 服务启动时自动发现模型

#### 工具调用配置

```toml
[fncall]
call_start_tag = "<function="
call_end_tag = "</function>"
tools_start_tag = "<tools>"
tools_end_tag = "</tools>"

[fncall.templates]
en = """..."""  # 英文模板
zh = """..."""  # 中文模板
```

### 配置热加载

- 修改 `config.toml` 后自动重载，无需重启
- 配置监听器每 2 秒检查一次变更
- 如需立即生效，可手动重启服务

---

## API 文档

### 接口概览

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/v1/models` | 获取模型列表 |
| POST | `/v1/chat/completions` | OpenAI 聊天补全 |
| POST | `/v1/messages` | Anthropic 聊天接口 |
| GET | `/docs` | Swagger UI 文档 |
| GET | `/redoc` | ReDoc 文档 |

### 接口详情

#### 健康检查

```http
GET /health
```

**响应示例：**
```json
{
  "status": "ok"
}
```

#### 获取模型列表

```http
GET /v1/models
Authorization: Bearer <api-key>
```

**响应示例：**
```json
{
  "object": "list",
  "data": [
    {
      "id": "qwen-plus",
      "object": "model",
      "created": 1234567890,
      "owned_by": "qwen"
    },
    {
      "id": "deepseek-chat",
      "object": "model",
      "created": 1234567890,
      "owned_by": "deepseek"
    }
  ]
}
```

#### OpenAI 聊天补全

```http
POST /v1/chat/completions
Authorization: Bearer <api-key>
Content-Type: application/json
```

**请求示例：**
```json
{
  "model": "qwen-plus",
  "messages": [
    {"role": "user", "content": "你好"}
  ],
  "stream": false,
  "max_tokens": 1024
}
```

**响应示例：**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "qwen-plus",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！我是 AI 助手。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

#### Anthropic 聊天接口

```http
POST /v1/messages
x-api-key: <api-key>
anthropic-version: 2023-06-01
Content-Type: application/json
```

**请求示例：**
```json
{
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}
```

**响应示例：**
```json
{
  "id": "msg-xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "你好！我是 Claude。"
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 20
  }
}
```

### 错误码说明

| HTTP 状态码 | 错误类型 | 说明 |
|------------|---------|------|
| 401 | `authentication_error` | API Key 无效或缺失 |
| 400 | `invalid_request_error` | 请求参数错误 |
| 404 | `not_found_error` | 资源不存在 |
| 429 | `rate_limit_error` | 请求频率超限 |
| 500 | `server_error` | 服务器内部错误 |

### 完整 API 文档

启动服务后访问：
- 📚 Swagger UI: http://localhost:1337/docs
- 📚 ReDoc: http://localhost:1337/redoc

---

## 常见问题

<details>
<summary><b>Q1: 启动时提示 "ModuleNotFoundError: No module named 'xxx'" 怎么办？</b></summary>

**问题描述**：运行 `python main.py` 时提示缺少依赖模块

**解决方案：**
```bash
# 确保已安装所有依赖
pip install -r requirements.txt

# 或使用虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```
</details>

<details>
<summary><b>Q2: 如何配置代理服务器？</b></summary>

**解决方案：**

编辑 `config.toml` 文件：
```toml
[proxy]
proxy_server = "http://proxy.example.com:8080"
proxy_enabled = true
```

**注意事项**：
- 代理配置在 `src.core.proxy` 模块导入时即生效
- 自动禁用 SSL 证书验证
- 修改后需重启服务
</details>

<details>
<summary><b>Q3: 并发竞速模式下如何控制配额消耗？</b></summary>

**解决方案：**

编辑 `config.toml` 调整参数：
```toml
[gateway]
concurrent_enabled = true    # 启用并发竞速
concurrent_count = 2        # 减少并发数（降低配额消耗）
min_tokens = 50            # 增加 Token 阈值（减少早期切换）
```

**建议**：
- 配额紧张时设置 `concurrent_count = 1`（禁用竞速）
- 低延迟优先时设置 `concurrent_count = 3`，`min_tokens = 10`
</details>

<details>
<summary><b>Q4: DeepSeek 平台提示 "WASM 下载失败" 怎么办？</b></summary>

**可能原因**：
1. 代理配置不正确
2. 网络连接问题
3. `persist/deepseek/` 目录无写入权限

**排查步骤：**
```bash
# 检查目录权限
ls -la persist/deepseek/

# 手动创建目录
mkdir -p persist/deepseek/

# 检查代理配置
# 确保 config.toml 中 [proxy] 配置正确
```

**WASM 文件位置**：
- 保存路径：`persist/deepseek/sha3_wasm_bg.7b9ca65ddd.wasm`
- 自动下载 URL：`https://fe-static.deepseek.com/chat/static/sha3_wasm_bg.7b9ca65ddd.wasm`
- 更新检查频率：24 小时
</details>

<details>
<summary><b>Q5: 如何添加新的平台适配器？</b></summary>

**解决方案：**

1. 在 `src/platforms/` 下创建新目录
2. 创建 `adapter.py` 实现 `PlatformAdapter` 接口
3. 创建 `accounts.py` 管理账号
4. 重启服务，系统自动发现新平台

**示例结构**：
```
src/platforms/newplatform/
├── __init__.py
├── adapter.py      # 必需：平台适配器
├── accounts.py     # 必需：账号管理
├── client.py       # 可选：HTTP 客户端
└── util.py        # 可选：工具函数
```
</details>

<details>
<summary><b>Q6: 工具调用（fncall）如何工作？</b></summary>

**工作原理：**

1. 客户端在请求中提供 `tools` 参数
2. Provider-V2 将工具描述注入到提示模板
3. 模型返回工具调用 XML 格式
4. Provider-V2 解析 XML 并返回标准格式

**模板示例（中文）：**
```
你是一个乐于助人的AI助手，可以使用工具来解决任务。

<tools>
<tool>
<name>get_weather</name>
<description>获取天气</description>
</tool>
</tools>

调用函数时，将每个参数值用与参数名同名的XML标签包裹：

<function=get_weather>
<city>北京</city>
</function>
```

**注意事项**：
- 仅支持 `en` 和 `zh` 两种模板
- XML 闭合标签必须用字符串拼接：`"</" + "function>"`
</details>

<details>
<summary><b>Q7: 配置文件修改后不生效怎么办？</b></summary>

**解决方案：**

```bash
# 方法一：等待自动重载（最多延迟 2 秒）

# 方法二：重启服务
# Ctrl+C 停止，然后重新运行
python main.py

# 方法三：检查配置文件语法
python -c "import toml; print(toml.load(open('config.toml', 'rb')))"
```

**代理配置需要重启**：
- `config.toml` 中的 `[proxy]` 配置在模块导入时生效
- 修改代理配置后必须重启服务
</details>

<details>
<summary><b>Q8: 如何禁用鉴权？</b></summary>

**解决方案：**

编辑 `config.toml`：
```toml
[auth]
enabled = false  # 设置为 false
keys = []
```

**跳过鉴权的路径**：
- `/`
- `/health`
- `/docs`
- `/redoc`
- `/openapi.json`
</details>

### 更多问题

- 📖 查看 [AGENTS.md](./AGENTS.md) 了解开发陷阱和易错点
- 🐛 在 [Issues](https://github.com/nichengfuben/provider-v2/issues) 中报告问题
- 💬 加入社区讨论

---

## 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **报告 Bug**：通过 [Issues](https://github.com/nichengfuben/provider-v2/issues) 提交详细报告
2. **功能建议**：在 [Discussions](https://github.com/nichengfuben/provider-v2/discussions) 中提出想法
3. **代码贡献**：提交 Pull Request
4. **文档改进**：帮助完善 README 和 API 文档
5. **分享经验**：在社区分享使用心得

### Pull Request 流程

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 创建 Pull Request

### 代码规范

- 遵循 PEP 8 代码风格
- 使用 `black` 进行格式化
- 使用 `isort` 进行导入排序
- 添加类型注解
- 编写中文注释和文档字符串

### 提交规范

采用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Type 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```
feat(qwen): 添加 qwen3.5-122b 模型支持

fix(gateway): 修复并发竞速时 token 计数错误
```

### 行为准则

- 尊重所有贡献者
- 建设性地提出意见
- 遵守开源协议
- 不接受包含恶意代码的 PR

---

## 许可证

本项目采用 [MIT 许可证](./LICENSE)。

```
MIT License

Copyright (c) 2026 Provider-V2 Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 联系方式

- **作者**：nichengfuben
- **邮箱**：nichengfuben@outlook.com
- **主页**：https://github.com/nichengfuben/provider-v2

### 技术支持

- 📧 技术支持邮箱：nichengfuben@outlook.com
- 🐛 [问题反馈](https://github.com/nichengfuben/provider-v2/issues)
- 💬 [社区讨论](https://github.com/nichengfuben/provider-v2/discussions)

---

<p align="center">
  如果这个项目对你有帮助，请给一个 ⭐️ Star！
</p>
