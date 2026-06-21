# Project Decisions

Architecture Decision Records (ADR) for Provider-V2.

Each entry uses the format: Context / Options / Decision / Consequences.

---

## ADR-001: aiohttp as the HTTP framework

**Context**: Provider-V2 is an async API gateway that proxies requests to multiple AI model providers. It requires streaming SSE support, WebSocket endpoints for the WebUI, and low-overhead async I/O.

**Options considered**:
- **FastAPI** — Modern, type-safe, auto-generates OpenAPI docs. Built on Starlette/uvicorn.
- **aiohttp** — Mature async HTTP framework with built-in WebSocket, client + server in one package.
- **Flask + asyncio** — Familiar ecosystem but requires additional async middleware.

**Decision**: aiohttp.

**Rationale**:
- Native WebSocket support without additional dependencies (critical for terminal and log streaming)
- `aiohttp.ClientSession` provides connection pooling and session reuse for upstream proxy calls
- Single package handles both server and client HTTP — no need for separate `httpx` or `requests`
- Lower memory footprint than FastAPI/uvicorn for long-running proxy workloads

**Consequences**:
- No automatic OpenAPI doc generation (handled manually via static HTML)
- Requires `aiohttp.web` routing syntax instead of decorator-based FastAPI routes
- WebSocket handlers are first-class citizens, simplifying terminal and log streaming

---

## ADR-002: loguru for logging

**Context**: The project needs structured, colorized logging across console and file outputs, with per-module tags and configurable log levels driven by `config.toml`.

**Options considered**:
- **stdlib `logging`** — Built-in, widely understood, but verbose configuration.
- **loguru** — Modern logging library with zero-config defaults, colorized output, and simple sink-based architecture.
- **structlog** — Structured logging with JSON output, better for log aggregation systems.

**Decision**: loguru.

**Rationale**:
- Zero-config colorized console output out of the box
- Simple `logger.add()` API for file sinks with rotation
- Custom sink function enables single-letter level abbreviations (`[I]`, `[E]`) for compact console output
- `config.toml`-driven log level changes via `logger.remove()` + `logger.add()` without restarting

**Consequences**:
- Adds `loguru>=0.7.0` as a dependency
- Non-standard API means contributors familiar with stdlib logging need a brief learning period
- Not compatible with log aggregation systems expecting JSON structured logs (acceptable for this project's scope)

---

## ADR-003: echotools as a separate shared infrastructure package

**Context**: Provider-V2 shares significant infrastructure code (config management, terminal sessions, HTTP utilities, function-call parsing, proxy selection) with other projects by the same author.

**Options considered**:
- **Inline all shared code** — Copy/paste into each project. Simple but creates maintenance burden.
- **Git submodule** — Share code via git submodule. Adds complexity to clone and CI workflows.
- **Separate PyPI package** — Publish shared code as `echotools` on PyPI. Clean dependency, versioned releases.

**Decision**: Separate PyPI package (`echotools`).

**Rationale**:
- Clean versioned dependency in `requirements.txt` (`echotools>=1.0.29`)
- Independent test suite and CI for the shared infrastructure
- Multiple projects can pin to specific echotools versions for stability
- Extracted ~6,000 lines of duplicated code from Provider-V2

**Consequences**:
- Changes to shared code require a two-step workflow: update echotools, publish, then update Provider-V2's `requirements.txt`
- Version mismatch risk if Provider-V2 pins to an older echotools version
- Contributors need to understand the boundary between Provider-V2 code and echotools code

---

## ADR-004: Platform adapter pattern

**Context**: Provider-V2 supports 16+ AI model providers (OpenAI-compatible, Anthropic-compatible, and proprietary APIs). Each provider has unique authentication, request formatting, streaming protocols, and error handling.

**Options considered**:
- **Monolithic router with if/elif chains** — Single route handler with provider-specific branches. Simple initially but unscalable.
- **Strategy pattern with base class** — Abstract `Adapter` base class with per-provider implementations. Clean separation but more files.
- **Plugin system** — Dynamic loading of provider plugins at runtime. Maximum flexibility but complex lifecycle.

**Decision**: Strategy pattern with abstract `Adapter` base class (`src/platforms/base.py`).

**Rationale**:
- Each platform lives in its own package (`src/platforms/{name}/`) with `adapter.py`, `core/`, and optional `accounts.py`
- `Adapter` base class defines the interface: `init()`, `chat()`, `models()`, `capabilities`
- Gateway (`src/core/dispatch/gateway.py`) dispatches to the correct adapter based on model name
- New platforms can be added without modifying existing code (open/closed principle)

**Consequences**:
- More files per platform (typically 3-8 files per adapter)
- Consistent structure makes it easy to navigate any platform's code
- `accounts.py` for platforms with complex auth (e.g., Qwen) can grow large — needs periodic decomposition

---

## ADR-005: pydantic for configuration and request validation

**Context**: The project needs to validate `config.toml` structures, API request bodies, and internal data models.

**Options considered**:
- **Manual dict validation** — Check keys and types manually. Simple but error-prone and verbose.
- **dataclasses + manual validation** — Type hints via dataclasses, manual checks. Moderate effort.
- **pydantic v2** — Full validation framework with type coercion, nested models, and serialization.

**Decision**: pydantic v2.

**Rationale**:
- Automatic type coercion (string "1337" -> int 1337 for port numbers)
- Nested model validation for complex config structures (accounts, platform settings)
- `model_dump()` for clean serialization to JSON
- `ConfigDict` for controlling extra field handling (ignore, forbid, allow)

**Consequences**:
- Adds `pydantic>=2.0.0` as a dependency (significant package size)
- Pydantic v2 API differs from v1 — contributors need v2-specific knowledge
- Validation errors produce detailed error messages useful for config debugging

---

## ADR-006: echotools optional runtime dependencies

**Context**: echotools (the shared infrastructure package, ADR-003) uses several libraries via lazy imports that are not direct dependencies of Provider-V2 but are required at runtime for specific features: SOCKS proxy support (aiohttp-socks), config hot-reload (watchdog), and SSH terminal access (paramiko).

**Options considered**:
- **Make echotools hard-depend on all** — Simplest but adds 3 packages to every consumer.
- **Use echotools optional dependency groups** — echotools provides `[socks]`, `[watch]`, `[ssh]` extras. Provider-V2 lists them directly.
- **Document and pin in Provider-V2** — List them in Provider-V2's requirements.txt with version constraints.

**Decision**: Document and pin in Provider-V2's requirements.txt directly.

**Rationale**:
- Provider-V2 uses all three features (proxy rotation, config hot-reload, SSH terminal)
- Listing directly ensures `pip install -r requirements.txt` gets everything needed
- Version constraints prevent surprise breakage from echotools dependency updates

**Consequences**:
- 3 additional entries in requirements.txt that may appear unused to linters
- Must keep versions aligned with echotools optional dependency specifications

---

## ADR-007: wasmtime for DeepSeek proof-of-work

**Context**: DeepSeek's API requires solving a JavaScript-based proof-of-work challenge before accepting requests. The challenge uses WebAssembly for performance.

**Options considered**:
- **Node.js subprocess** — Spawn Node.js to run the WASM. Adds a heavy runtime dependency.
- **wasmtime Python binding** — Run WASM directly from Python using the wasmtime library. Lightweight, fast.
- **Reverse-engineer the algorithm** — Implement in pure Python. Fragile, breaks on API updates.

**Decision**: wasmtime Python binding.

**Rationale**:
- Native WASM execution without external process overhead
- `wasmtime>=0.40.0` provides stable Python bindings for Python 3.8+
- WASM binary is bundled in the DeepSeek adapter (`src/platforms/deepseek/core/pow.py`)

**Consequences**:
- Adds `wasmtime>=0.40.0` (~15 MB) to dependencies
- Platform-specific binary wheels required (Windows/Linux/macOS)

---

## ADR-008: pycryptodome for Qwen authentication

**Context**: Qwen's API requires AES-CBC encrypted authentication headers (`bx-ua`) that cannot be generated with stdlib alone.

**Options considered**:
- **cryptography** — Modern, well-maintained, but complex API.
- **pycryptodome** — Drop-in replacement for PyCrypto with clean AES API.
- **pyaes** — Pure Python AES. No C extensions, but slower.

**Decision**: pycryptodome.

**Rationale**:
- Simple `AES.new(key, AES.MODE_CBC, iv)` API for the specific encryption needed
- C-accelerated performance for repeated auth header generation
- Well-established library with stable API

**Consequences**:
- Adds `pycryptodome>=3.20.0` as a dependency
- Only used by the Qwen platform adapter

---

## ADR-009: beautifulsoup4 and requests for Ollama

**Context**: The Ollama adapter scrapes the local Ollama web interface for model discovery and uses synchronous HTTP for proxy pool fetching (due to Ollama's local-only nature).

**Options considered**:
- **aiohttp-only** — Use the existing async HTTP client. But Ollama model listing HTML needs parsing.
- **beautifulsoup4 + requests** — Separate sync HTTP + HTML parser. Clear separation of concerns.
- **lxml** — Faster HTML parser but heavier dependency.

**Decision**: beautifulsoup4 for HTML parsing, requests for synchronous HTTP operations in Ollama-specific code.

**Rationale**:
- `beautifulsoup4>=4.12.0` provides robust HTML parsing for scraping Ollama's model list
- `requests>=2.31.0` is used for synchronous proxy pool fetching in Ollama adapter
- Both are mature, widely-used libraries with excellent documentation

**Consequences**:
- Adds two dependencies that overlap partially with aiohttp's capabilities
- requests is synchronous (blocking) — acceptable since Ollama operations are fast local calls

---

## ADR-010: cerebras-cloud-sdk for Cerebras platform

**Context**: Cerebras provides a dedicated cloud SDK for their AI inference platform, offering optimized access beyond generic OpenAI-compatible endpoints.

**Options considered**:
- **Generic OpenAI client** — Use the OpenAI-compatible endpoint. Loses Cerebras-specific optimizations.
- **cerebras-cloud-sdk** — Official SDK with platform-specific features.
- **Custom HTTP client** — Hand-roll the API calls. More work, less maintainable.

**Decision**: cerebras-cloud-sdk.

**Rationale**:
- Official SDK ensures compatibility with Cerebras API changes
- Provides optimized inference access beyond the generic REST endpoint
- Lazy-loaded only when Cerebras platform is active

**Consequences**:
- Adds `cerebras-cloud-sdk>=1.0.0` as a dependency
- Only imported when the Cerebras adapter is initialized

---

## ADR-011: Core module shim consolidation

**Context**: `src/core/` had 17 individual 2-line shim files (`autoupdate.py`, `candidate.py`, `files.py`, `gateway.py`, `http.py`, `ids.py`, `io_utils.py`, `process.py`, `proxy.py`, `registry.py`, `retry.py`, `runtime_view.py`, `scheduler.py`, `selector.py`, `server.py`, `watcher.py`), each re-exporting symbols from subpackages. Every file contained only an import and a re-export, creating unnecessary file sprawl.

**Options considered**:
- **Keep individual shims** — One file per module, easy to find by name but 17 nearly-empty files clutter the directory.
- **Single `shims.py`** — Consolidate all re-exports into one file with a comprehensive docstring.
- **Direct imports everywhere** — Remove shims entirely, update all call sites to import from subpackages directly. High refactoring cost.

**Decision**: Consolidate into `src/core/shims.py` with a comprehensive docstring documenting each re-exported symbol and its origin.

**Rationale**:
- Reduces file count in `src/core/` by 59% (17 files to 1)
- Single point of maintenance for all cross-module re-exports
- Docstring in `shims.py` serves as a map of the indirection layer
- `__init__.py` expanded to promote symbols at the package level, preserving existing import paths

**Consequences**:
- 59% file reduction (17 -> 1) in the shim layer
- All existing `from src.core.xxx import Yyy` call sites continue to work via `__init__.py` promotions
- Future shim additions require editing one file instead of creating a new file
- Git history for individual shim files is lost after deletion

---

## ADR-012: fncall protocol plugin system via echotools

**Context**: Tool-calling protocols (XML, ANTML, bracket, etc.) define how AI models format function calls. Different platforms and model families require different protocol formats. The project needed a way to support multiple protocols without hardcoding each one.

**Options considered**:
- **Hardcoded protocols** — Inline each protocol's formatting logic. Simple but rigid; adding a protocol requires modifying core code.
- **Plugin system** — Strategy pattern with an ABC, auto-registration at import time, protocols as independent modules.
- **Config-driven templates** — Define protocols as template strings in config files. Flexible but harder to validate and test.

**Decision**: Strategy pattern with `ToolProtocol` ABC in the `echotools` package, auto-registration at import time, 7 built-in protocols (`xml`, `antml`, `original`, `bracket`, `nous`, `dsml`, `custom`).

**Rationale**:
- Clean separation between protocol definition and protocol selection
- Each protocol is independently testable without the gateway context
- Auto-registration via import means new protocols are discovered automatically
- Protocol selection via `config.toml` or per-request override provides runtime flexibility

**Consequences**:
- Adding a new protocol requires an `echotools` update + PyPI publish cycle
- 7 built-in protocols cover all currently supported platforms
- Protocol selection is configurable per-platform in `config.toml`
- The `custom` protocol allows user-defined formats without modifying `echotools`

---

## ADR-013: Runner-Worker dual-process architecture

**Context**: The long-running proxy gateway needs resilience against crashes, memory leaks, and code hot-reload without dropping active connections. A single-process design cannot handle all three requirements simultaneously.

**Options considered**:
- **Single process with restart** — Simple but loses all state on crash; no hot-reload capability.
- **Multi-worker with supervisor** — Robust but over-engineered for a single-gateway deployment; adds complexity of load balancing.
- **Runner-Worker fork pattern** — Runner process supervises a single Worker subprocess, auto-restarts on failure, supports file-watcher-based hot-reload.

**Decision**: Runner process monitors Worker subprocess via `subprocess.Popen`, auto-restarts on exit code 42, supports hot-reload via file watcher.

**Rationale**:
- Two Python processes running at all times: Runner (supervisor) and Worker (actual server)
- Worker exit code 42 signals a restart request (e.g., after config or code changes)
- File watcher in Runner detects source file modifications and triggers graceful restart
- Log output from Worker is piped through Runner with color preservation (`CLICOLOR_FORCE=1`)
- `Ctrl+C` gracefully shuts down both processes in the correct order

**Consequences**:
- Two Python processes visible in process list at all times
- Worker crash triggers automatic restart (up to 50 consecutive restarts)
- Hot-reload via file watcher avoids manual restart during development
- Log output is line-buffered through Runner using `readline()` to avoid buffering issues
- Graceful shutdown ensures no orphaned subprocess on `Ctrl+C`
