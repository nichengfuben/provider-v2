#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# session-cleanup.py — Post-session review and update hook for Provider-V2
#
# Triggered on the `Stop` event (agent finishes a task).
# Reads session context from stdin, compares working tree against HEAD,
# and when actual uncommitted changes are detected, outputs a structured
# prompt for the agent to: review/update docs-src, tests, record.md, README.md,
# template, config.toml (auto +0.0.1 version), requirements.txt,
# .agents/provider-guide/, then stage, commit, and push to dev branch.
#
# If no real changes are detected, the hook exits silently with no prompt.
#
# Exit codes: 0 = success (prompt injected or no-op), 2 = inject message to conversation

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')


def main() -> None:
    try:
        raw = sys.stdin.read()
        input_data = json.loads(raw)
    except Exception:
        print("session-cleanup: failed to parse stdin", file=sys.stderr)
        sys.exit(0)

    session_id: str = input_data.get("session_id", "unknown")
    cwd: str = input_data.get("cwd", ".")

    try:
        os.chdir(cwd)
    except Exception:
        print("session-cleanup: cannot chdir to " + cwd, file=sys.stderr)
        sys.exit(0)

    if not (Path("config.toml").is_file() or Path("src").is_dir()):
        print("session-cleanup: not a Provider-V2 project, skipping", file=sys.stderr)
        sys.exit(0)

    # Check if there are uncommitted changes
    diff_summary = _detect_changes()
    if not diff_summary:
        sys.exit(0)

    changed_files = _collect_changed_files()
    prompt = _build_prompt(session_id, diff_summary, changed_files)

    # For Stop hook: exit 2 + stderr injects message into conversation
    print(prompt, file=sys.stderr)

    sys.exit(2)


def _run_git(args: list[str]) -> str:
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            encoding="utf-8",
            errors="replace",
            timeout=15
        )
        return result.stdout
    except Exception:
        return ""


def _detect_changes() -> str | None:
    """Detect uncommitted changes by comparing working tree against HEAD."""

    diff_files = _run_git(["diff", "--name-only", "-w"]).strip()
    staged_files = _run_git(["diff", "--cached", "--name-only", "-w"]).strip()
    untracked_files = _run_git(["ls-files", "--others", "--exclude-standard"]).strip()

    all_files = set()
    for blob in (diff_files, staged_files, untracked_files):
        for line in blob.splitlines():
            line = line.strip()
            if line:
                all_files.add(line)

    if not all_files:
        return None

    excluded_prefixes = {'logs/', '.git/', '.qoder/'}
    all_files = {f for f in all_files if not any(f.startswith(p) for p in excluded_prefixes)}

    if not all_files:
        return None

    summary_lines = ["## 检测到未提交的变更:"]
    for f in sorted(all_files):
        summary_lines.append("- " + f)
    summary_lines.append("")

    shortstat = _run_git(["diff", "--shortstat"]).strip()
    staged_shortstat = _run_git(["diff", "--cached", "--shortstat"]).strip()
    stats = []
    if shortstat:
        stats.append("未暂存: " + shortstat)
    if staged_shortstat:
        stats.append("已暂存: " + staged_shortstat)
    if stats:
        summary_lines.append("变更统计: " + "; ".join(stats))

    return "\n".join(summary_lines)


def _collect_changed_files() -> str:
    """Collect all changed/staged/untracked file paths."""
    lines: list[str] = []

    lines.extend(_run_git(["diff", "--cached", "--name-only"]).splitlines())
    lines.extend(_run_git(["diff", "--name-only"]).splitlines())
    lines.extend(_run_git(["ls-files", "--others", "--exclude-standard"]).splitlines())

    excluded_prefixes = {'.qoder/', 'logs/'}
    cleaned = sorted({
        l.strip()
        for l in lines
        if l.strip() and not any(l.startswith(p) for p in excluded_prefixes)
    })
    return "\n".join(cleaned)


def _read_gitignore_patterns() -> str:
    """Read .gitignore and return filtered platform/directory patterns."""
    gitignore_path = Path(".gitignore")
    if not gitignore_path.is_file():
        return "(无 .gitignore 文件)"

    patterns = []
    with open(gitignore_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if any(keyword in line for keyword in ["platforms/", "src/", "docs/", "tests/", "accounts.py"]):
                patterns.append(f"- `{line}`")

    if not patterns:
        return "(无相关过滤规则)"

    return "\n".join(patterns)


def _build_prompt(session_id: str, diff_summary: str, changed_files: str) -> str:
    """Build the self-review prompt injected back into the conversation."""
    gitignore_patterns = _read_gitignore_patterns()

    return f"""\
## Session End — 自动审查、更新文档并提交到 dev 分支

Session ID: {session_id}

检测到未提交的代码变更。请在完成以下步骤后**自动推送到 dev 分支**。

---

### 步骤 0: 分析 .gitignore 过滤规则

**.gitignore 当前过滤的平台/目录:**
{gitignore_patterns}

**重要规则:**
- 如果某个平台(如 `src/platforms/xxx/`)被 .gitignore 过滤,则:
  - `docs-src/src/platforms/xxx/` **不需要**更新(因为源码不在版本控制中)
  - `tests/src/platforms/xxx/` **不需要**创建/更新(因为源码不在版本控制中)
  - `record.md` 中**不需要**记录该平台的变更
- 比对变更文件列表时,**自动跳过**被 .gitignore 过滤的平台对应的 docs-src/tests/record.md 路径

---

### 步骤 1: 理解变更

{diff_summary}

分析上述变更的真实语义(新功能、bug 修复、重构、新平台、配置变更等)。

---

### 步骤 2: 更新项目文档(仅在有实质性代码变更时)

> **实质性变更** = 新增/修改/删除了 Python 源码、配置文件、路由、核心模块等。
> 如果仅是空格、注释、文档微调、自动生成的备份文件，**跳过所有以下步骤，不要创建提交**。

#### 2.1 docs-src (文档镜像)
- 如果修改了 `src/`、`src/platforms/`、`src/core/`、`src/webui/`、`src/routes/` 下的源文件，确保 `docs-src/` 下对应的镜像文档已更新。
- **跳过被 .gitignore 过滤的平台**。
- 为新目录添加或更新 `INDEX.md`。

#### 2.2 tests (测试镜像)
- 如果新增或修改了平台适配器、核心模块或 WebUI 组件，确保 `tests/` 下有对应测试。
- **跳过被 .gitignore 过滤的平台**。
- 每个平台至少有一个 MVP 测试。
- 运行 `pytest tests -q` 并记录结果。

#### 2.3 record.md (变更记录)
- **追加**新章节到 `record.md`:
  - 日期(使用当前日期)
  - 变更的简明要点
  - **跳过被 .gitignore 过滤的平台**。
  - 外部阻塞或跳过的测试及原因
  - 测试结果摘要(通过/失败/跳过数量)

#### 2.4 README.md
- 如果新增平台、API 或功能，更新相关章节。
- 如果项目结构有实质性变化，更新目录树图。

#### 2.5 template/template_config.toml
- 如果 `config.toml` 新增了配置项或修改了配置结构，**必须同步到模板**。
- 模板是用户分发的基准文件，遗漏模板更新视为 bug。

#### 2.6 config.toml — 版本号规则(重要)
- **版本号每次只能 +0.0.1**（如 `2.1.1` → `2.1.2`）。
- **当前版本以 `config.toml` 中 `server.version` 的实际值为准**，禁止猜测或凭空设定。
- **禁止私自大幅修改版本号**（如 2.1.x → 2.2.x），除非用户明确说明。
- README.md 中的版本徽章必须与 `config.toml` 中的 `server.version` 保持一致。

#### 2.7 requirements.txt
- 如果引入了新的第三方 Python 包，添加版本约束。

#### 2.8 .agents/provider-guide/ (项目技能)
- 如果平台接口、架构、编码标准或脚本变更，更新 `.agents/provider-guide/references/` 下的相关文档。

#### 2.9 验证
- 对所有修改的 Python 文件运行 `py_compile`。
- 运行 `pytest tests -q` 进行回归测试。
- 将验证结果(通过/失败/跳过数量)记录到 `record.md`。

---

### 步骤 3: 提交并推送到 dev 分支

1. **切换到 dev 分支**: `git checkout dev`
2. 合并当前工作区的变更: `git add -A && git commit`
3. **编写有意义的提交信息**:
   - 使用 Conventional Commits 格式: `type(scope): description`
   - **根据真实变更内容编写**，禁止只写版本号
   - 包含变更要点的 body
4. 创建提交: `git commit -m "..." `
5. **自动推送到远程 dev 分支**: `git push origin dev`

> **注意**: `.qoder/.session-review-active` marker 文件由**用户管理**，hook 脚本和 agent **不要读取、创建或删除它**。

---

### 本次变更文件:
{changed_files}

**重要:** 如果审查后发现没有实质性代码变更(如只有空格、注释或文档微调、自动生成的备份文件)，**跳过以上所有步骤，不要创建提交**。
"""


if __name__ == "__main__":
    main()
