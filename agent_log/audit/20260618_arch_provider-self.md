# Architecture Audit: provider-self

**Date**: 20260618  |  **Target**: whole project  |  **Skill**: arch-audit

---

## Score Summary

| Area                              | Score   | Status      |
|-----------------------------------|---------|-------------|
| Separation of Concerns            |  7/10   | Good        |
| Windows Compatibility             |  8/10   | Good        |
| Component Design                  |  7/10   | Good        |
| Error & Logging Strategy          |  7/10   | Good        |
| Technology Choices                |  3/10   | Poor        |
| Scalability & Performance Arch.   |  7/10   | Good        |
| Architectural Documentation       |  4/10   | Acceptable  |
| **Overall**                       | **6.1/10** | Acceptable |

**Status key**: 1-3 Poor &nbsp;|&nbsp; 4-6 Acceptable &nbsp;|&nbsp; 7-8 Good &nbsp;|&nbsp; 9-10 Excellent
**Overall** = arithmetic mean of all 7 area scores, rounded to 1 decimal place.

---

## Area Findings

### Separation of Concerns -- 7/10

**Key Findings**:
- Well-defined top-level layers (`src/core/`, `src/routes/`, `src/platforms/`, `src/webui/`, `persist/`) with clean lateral boundaries: no cross-imports among routes, platforms, and webui
- Critical upward dependency: `src/core/server/server.py` imports from `src/routes/` and `src/webui/`, making core depend on higher layers (composition root misplaced inside core)
- Massive route files conflate routing with protocol translation and business logic (`openai.py` = 2150 lines, `anthropic.py` = 1127 lines)
- 17 backward-compatibility shim files clutter `src/core/` root after sub-package refactoring
- `src/logger.py` sits outside all layers; duplicate `ModelsCache` implementations in core and deepseek platform

**Top 3 Suggestions**:
1. Extract the composition root from `src/core/server/server.py` into `main.py` or a dedicated `src/bootstrap.py`, eliminating the core-depends-on-routes violation
2. Split `src/routes/openai.py` into a `src/routes/openai/` package with domain modules (`chat.py`, `media.py`, `files.py`, `embeddings.py`)
3. Remove the 17 shim files and consolidate `src/logger.py` into `src/core/`, updating all callers to use canonical sub-package import paths

---

### Windows Compatibility -- 8/10

**Key Findings**:
- Strong pathlib adoption: 57 `Path()` calls across 23 files in core infrastructure; only 2 residual `os.path` uses in non-critical peripheral code
- Unix-only modules (`fcntl`, `termios`, `os.killpg`, `signal.SIGTERM`, `uvloop`) all properly guarded behind `sys.platform` checks or try/except with graceful fallback
- All 17 dependencies in `requirements.txt` are cross-platform; no Unix-only packages
- One string path concatenation (`PERSIST_PATH + ".tmp"`) in Qwen client atomic write path
- Hard-coded relative paths use forward slashes throughout, which work correctly on Windows via Python's cross-platform file I/O

**Top 3 Suggestions**:
1. Convert `local_store.py` (webui) to pathlib, replacing remaining `os.path.exists()` and `os.path.dirname()` calls
2. Define path constants (`PERSIST_PATH`, `TASK_TIMERS_PATH`) as `Path` objects instead of `str` to eliminate string concatenation issues
3. Convert remaining ~8 `os.path.exists()` and ~10 `os.path.basename()` calls scattered across platform code to pathlib equivalents

---

### Component Design -- 7/10

**Key Findings**:
- Strong Strategy pattern via `PlatformAdapter` ABC (`src/platforms/base.py`); all 23 platform adapters follow a consistent 3-layer architecture with zero platform-specific if/elif chains in dispatch
- `QwenClient` is a god-class: 2385 lines, 22 public methods handling login, chat, file upload, video, TTS, proxy management, and session management
- Class size distribution is healthy: median 79 lines across 145 classes, 76% under 200 lines; but 9 classes exceed 400 lines
- Route files are large flat function collections without classes (50+ handler functions in `openai.py`), lacking logical grouping
- `echotools.PluginRegistry` auto-discovery eliminates manual platform registration, a strong architectural choice

**Top 3 Suggestions**:
1. Decompose `QwenClient` into focused service classes (`QwenFileService`, `QwenVideoService`, `QwenTtsService`) following the pattern already seen in aitianhu2's `ChatService`/`UploadService`
2. Group route handlers into handler classes by domain (`ChatHandlers`, `ImageHandlers`, `FileHandlers`) to improve navigability of the 2150-line openai.py
3. Extract the module-level config singleton into a structured pattern with explicit initialization lifecycle

---

### Error & Logging Strategy -- 7/10

**Key Findings**:
- Excellent custom exception hierarchy: 25 types in a well-structured 3-level hierarchy rooted at `ProviderError`, with HTTP status classifier `classify_http_error()`
- Comprehensive logging architecture: custom loguru-based logger with dual sinks (console + file), 100MB rotation, 30-day retention; 88 files use the custom logger
- Mixed logging implementations: 45 files use standard `import logging` whose output is NOT captured in loguru file handler (no InterceptHandler), creating blind spots
- 31 silent exception swallows (`except Exception: pass`), concentrated in webui/terminal.py (11 instances) and cleanup code
- Excellent sensitive data masking: API keys truncated to 8 chars, emails masked, tokens referenced by count not value; zero `print()` calls

**Top 3 Suggestions**:
1. Unify logging: add loguru's `InterceptHandler` to capture standard logging output, or migrate 45 files to `get_logger()`
2. Add `logger.debug()` to all 31 silent exception handlers for observability while preserving "don't crash on cleanup" behavior
3. Add request correlation IDs via middleware to enable tracing a single request through dispatch, platform, and route layers

---

### Technology Choices -- 3/10

**Key Findings**:
- `PROJECT_DECISIONS.md` is completely missing; zero documentation of why any library was chosen over alternatives
- All 17 dependencies use `>=` (floor-only) versioning with no exact pins (`==`), making builds non-reproducible
- No deprecated or abandoned libraries detected; all dependencies appear actively maintained
- Key technology choices (aiohttp, pydantic, loguru, uvloop, tomlkit, watchdog) are sound but entirely undocumented
- No lockfile (`requirements.lock`, `poetry.lock`, etc.) exists for deterministic deployments

**Top 3 Suggestions**:
1. Create `PROJECT_DECISIONS.md` with ADRs for each significant library choice (aiohttp vs FastAPI, loguru vs stdlib logging, pydantic vs dataclasses, tomlkit vs tomllib)
2. Pin dependency versions in `requirements.txt` using `==` for known-working versions; consider `pip-compile` for a fully resolved `requirements.lock`
3. Adopt a lockfile workflow (`pip-compile`, `poetry`, or `uv`) to capture the full transitive dependency tree at known-good versions

---

### Scalability & Performance Architecture -- 7/10

**Key Findings**:
- Connection pooling well-configured: `TCPConnector(limit=200)` shared session; per-account isolated sessions in aitianhu2 (`limit=32`)
- File-backed caching with TTLs via echotools `ListCache` and platform-specific `MODEL_CACHE_TTL` (24h default)
- Streaming properly implemented via SSE with async generators; concurrent streaming via `asyncio.Queue` per candidate with proper cancellation
- Most in-memory structures are bounded (`deque(maxlen=100)`, `_RingBuffer(capacity=1000)`, pruned `_time_buckets`); but `_latencies` list grows to 10,000 then copies to 5,000
- Unbounded file accumulation: `persist/gateway/` contains 10,027 JSON files with no cleanup/pruning mechanism, impacting startup I/O

**Top 3 Suggestions**:
1. Add cleanup for `persist/gateway/` file accumulation: periodic deletion of stale records or consolidation into a single JSON file with compaction
2. Replace `_latencies` list trimming with a ring buffer (pattern already used for `_timeline`) to eliminate copy overhead
3. Consider per-platform connection pool isolation to prevent a single slow platform from exhausting the shared pool and starving others

---

### Architectural Documentation -- 4/10

**Key Findings**:
- `PROJECT_DECISIONS.md` is completely absent; no ADRs exist anywhere in the project for key decisions (aiohttp vs FastAPI, Runner-Worker architecture, custom XML tool-call format, echotools extraction, TAS selector strategy)
- README.md is comprehensive (72KB) with version badges, tech stack table, feature matrix, installation guides, annotated project structure, configuration examples, and API documentation
- ARCHITECTURE.md exists in `docs-src/` with ASCII-art component diagrams (request flow, Runner-Worker process tree), core module table, adapter interface spec, and data flow description; but it is buried in a mirrored docs-src tree rather than at the project root
- No rendered diagrams (PNG/SVG/Mermaid/drawio) exist anywhere; only ASCII art
- `AGENTS.md` (12KB) provides rich operational documentation for agents but is not architectural documentation

**Top 3 Suggestions**:
1. Create `PROJECT_DECISIONS.md` at project root with ADRs for the 6 major architectural choices (aiohttp, Runner-Worker, XML tool-call format, echotools, TAS, TOML hot-reload)
2. Promote `ARCHITECTURE.md` to the project root for immediate discoverability alongside `README.md`; deduplicate the two identical copies in docs-src
3. Add Mermaid diagrams for request lifecycle sequence, deployment architecture, and module dependency graph (GitHub renders Mermaid natively in markdown)

---

## Priority Actions

Top 5 cross-area improvements ranked by impact:

1. **[Technology Choices + Documentation]** -- Create `PROJECT_DECISIONS.md` at project root with ADRs for all major architectural and library choices. This single action addresses the two lowest-scoring areas (3/10 and 4/10) and would raise both to 7-8/10. Document: aiohttp vs FastAPI, Runner-Worker dual-process, custom XML tool-call format, echotools extraction, TAS selector, TOML hot-reload.

2. **[Separation of Concerns]** -- Extract the composition root from `src/core/server/server.py` into `main.py` or `src/bootstrap.py`. The core layer must not import from routes or webui. This eliminates the most significant architectural violation and restores proper dependency direction.

3. **[Component Design]** -- Decompose `QwenClient` (2385 lines, 22 public methods) into focused service classes (`QwenFileService`, `QwenVideoService`, `QwenTtsService`). This is the project's only true god-class and concentrates disproportionate risk.

4. **[Error & Logging]** -- Unify logging by adding loguru `InterceptHandler` to capture the 45 files still using standard `import logging`. Without this, log files have blind spots and the dual-sink architecture is incomplete.

5. **[Scalability]** -- Add cleanup/pruning for `persist/gateway/` (10,027 unbounded JSON files). Implement periodic deletion of stale records or consolidation to prevent unbounded disk growth and reduce startup I/O overhead.
