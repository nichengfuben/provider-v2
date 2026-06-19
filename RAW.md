---COMMAND---
N/A

---RESULT---
N/A

---CONTEXT---
Finalizing Provider-V2 requirements after complete source code review

---RESPONSE---
1. Gateway dispatch must use Thompson Sampling (TAS) selector with candidate filtering via GatewayCfg.is_platform_enabled() and concurrent_count limiting
2. Request routing must resolve model names through three-level mapping and wait for candidates with 15-second timeout via _wait_for_candidates()
3. Single-candidate execution must inject function calling protocols per platform and yield platform metadata via _single()
4. Concurrent racing must use worker tasks with queue-based chunk collection, min_tokens threshold (default 10), and 120-second race chunk timeout
5. Race winner selection must stop other workers via Event and cancel tasks, then drain winner's buffer and continue streaming
6. Selection recording must track latency, tokens, duration, generation duration, and completion tokens via selector.record()
7. Token usage must be normalized or fallback-calculated from prompt length and accumulated response text
8. Function calling must support protocol injection via get_protocol(platform_id) and FncallStreamParser for streaming tool call detection
9. System message folding must merge system role content into first user message when tools are absent to ensure platform compatibility
10. Authentication bypass must skip API key validation for /health, /v1/models, and root WebUI paths
11. Configuration hot-reload must use ConfigManager with watchdog monitoring and preserve runtime state (queues, active tasks)
12. Error responses must use ProviderError hierarchy with HTTP status classification for API compatibility
13. Health check must return version and status, with platform health aggregation to be implemented
14. Platform adapter interface must define init(), candidates(), ensure_candidates(), complete(), close() abstract methods
15. Model mapping must merge protocol-level, root-level, and global fallback with priority order in AppConfig.from_dict()
16. Proxy routing must compile regex patterns from proxy_urls and apply when proxy_enabled is true using aiohttp-socks
17. Auto-update must use git pull with configured branch and mirrors, then restart via exit code 42
18. Logging must use loguru with configurable level, color output via colorama, and access_log toggling
19. Platform-specific API keys must be stored in [platforms.{name}] sections with per-platform endpoint and timeout overrides
20. Deployment must support Docker with python:3.11-slim base, expose port 1337, and use CMD python main.py

---COUNT---
20
