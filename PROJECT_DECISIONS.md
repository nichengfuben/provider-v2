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
