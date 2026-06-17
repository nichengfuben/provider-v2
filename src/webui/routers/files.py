from __future__ import annotations

"""WebUI File Manager API router.

Provides file system browsing, reading, downloading, and basic
file/directory operations scoped to the project root directory.
"""

import base64
import mimetypes
import os
import shutil
import stat
from pathlib import Path
from typing import Any, Dict, List, Optional

import aiohttp.web

__all__ = [
    "files_list",
    "files_read",
    "files_download",
    "files_mkdir",
    "files_delete",
    "files_rename",
]

# Project root: src/webui/routers/files.py -> project root
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent

# Maximum file size for text preview (2 MB)
_MAX_PREVIEW_SIZE = 2 * 1024 * 1024

# Binary file extensions that should not be read as text
_BINARY_EXTENSIONS = frozenset({
    ".pyc", ".pyo", ".so", ".dll", ".exe", ".bin", ".obj", ".o", ".a", ".lib",
    ".zip", ".tar", ".gz", ".bz2", ".xz", ".7z", ".rar", ".whl", ".egg",
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".svg",
    ".mp3", ".mp4", ".avi", ".mkv", ".wav", ".flac", ".ogg", ".webm",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".sqlite", ".db", ".lock",
})


def _safe_resolve(rel_path: str) -> Optional[Path]:
    """Resolve a relative path and verify it stays within project root.

    Returns the resolved Path if safe, None otherwise.
    """
    # Normalise: strip leading slashes so it's relative
    rel_path = rel_path.strip().replace("\\", "/")
    if rel_path.startswith("/"):
        rel_path = rel_path[1:]

    # Reject obvious traversal attempts before resolve
    # (Path.resolve() handles most, but be explicit)
    parts = Path(rel_path).parts
    if ".." in parts:
        return None

    resolved = (_PROJECT_ROOT / rel_path).resolve()

    # Must start with project root
    try:
        resolved.relative_to(_PROJECT_ROOT)
    except ValueError:
        return None

    return resolved


def _entry_info(entry: Path) -> Dict[str, Any]:
    """Build metadata dict for a single filesystem entry."""
    try:
        st = entry.stat()
    except OSError:
        return {}

    is_dir = stat.S_ISDIR(st.st_mode)
    rel = str(entry.relative_to(_PROJECT_ROOT)).replace("\\", "/")
    # Represent root as "/"
    if rel == ".":
        rel = "/"

    return {
        "name": entry.name,
        "type": "dir" if is_dir else "file",
        "size": st.st_size if not is_dir else None,
        "modified": st.st_mtime,
        "path": "/" + rel if not rel.startswith("/") else rel,
    }


def _is_binary_file(path: Path) -> bool:
    """Check if a file is likely binary based on extension or content sniff."""
    if path.suffix.lower() in _BINARY_EXTENSIONS:
        return True
    # Sniff first 8 KB for null bytes
    try:
        with open(path, "rb") as f:
            chunk = f.read(8192)
        return b"\x00" in chunk
    except OSError:
        return True


# ---------------------------------------------------------------------------
# GET /v1/webui/files/list?path=/
# ---------------------------------------------------------------------------

async def files_list(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """List directory contents at the given path."""
    rel_path = request.query.get("path", "/")

    target = _safe_resolve(rel_path)
    if target is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not target.exists():
        return aiohttp.web.json_response(
            {"error": "path not found"}, status=404,
        )

    if not target.is_dir():
        return aiohttp.web.json_response(
            {"error": "path is not a directory"}, status=400,
        )

    entries: List[Dict[str, Any]] = []
    try:
        for child in sorted(target.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
            info = _entry_info(child)
            if info:
                entries.append(info)
    except PermissionError:
        return aiohttp.web.json_response(
            {"error": "permission denied"}, status=403,
        )

    # Include parent path info for breadcrumb
    current_rel = str(target.relative_to(_PROJECT_ROOT)).replace("\\", "/")
    if current_rel == ".":
        current_rel = "/"

    return aiohttp.web.json_response({
        "entries": entries,
        "path": "/" + current_rel if not current_rel.startswith("/") else current_rel,
        "root": str(_PROJECT_ROOT).replace("\\", "/"),
    })


# ---------------------------------------------------------------------------
# GET /v1/webui/files/read?path=/file.txt&offset=0&limit=500
# ---------------------------------------------------------------------------

async def files_read(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Read file content for preview."""
    rel_path = request.query.get("path", "")
    if not rel_path:
        return aiohttp.web.json_response(
            {"error": "path is required"}, status=400,
        )

    target = _safe_resolve(rel_path)
    if target is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not target.is_file():
        return aiohttp.web.json_response(
            {"error": "path is not a file"}, status=400,
        )

    total_size = target.stat().st_size

    # Check if binary
    if _is_binary_file(target):
        # For images, return base64 data URI
        ext = target.suffix.lower()
        if ext in (".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".ico", ".svg"):
            try:
                with open(target, "rb") as f:
                    data = f.read(_MAX_PREVIEW_SIZE)
                mime = mimetypes.guess_type(str(target))[0] or "image/png"
                b64 = base64.b64encode(data).decode("ascii")
                return aiohttp.web.json_response({
                    "content": f"data:{mime};base64,{b64}",
                    "encoding": "base64",
                    "total_size": total_size,
                    "truncated": total_size > _MAX_PREVIEW_SIZE,
                })
            except OSError as e:
                return aiohttp.web.json_response(
                    {"error": str(e)}, status=500,
                )

        return aiohttp.web.json_response({
            "content": None,
            "encoding": "binary",
            "total_size": total_size,
            "truncated": False,
        })

    # Text file
    offset = int(request.query.get("offset", 0))
    limit = int(request.query.get("limit", 500))

    try:
        with open(target, "r", encoding="utf-8", errors="replace") as f:
            if offset > 0:
                # Skip `offset` lines
                for _ in range(offset):
                    f.readline()
            lines: List[str] = []
            for _ in range(limit):
                line = f.readline()
                if not line:
                    break
                lines.append(line)

        # Count total lines for pagination
        total_lines = 0
        with open(target, "r", encoding="utf-8", errors="replace") as f:
            for _ in f:
                total_lines += 1

        return aiohttp.web.json_response({
            "content": "".join(lines),
            "encoding": "utf-8",
            "total_size": total_size,
            "total_lines": total_lines,
            "offset": offset,
            "limit": limit,
            "truncated": total_size > _MAX_PREVIEW_SIZE,
        })
    except OSError as e:
        return aiohttp.web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# GET /v1/webui/files/download?path=/file.txt
# ---------------------------------------------------------------------------

async def files_download(request: aiohttp.web.Request) -> aiohttp.web.StreamResponse:
    """Download a file as attachment."""
    rel_path = request.query.get("path", "")
    if not rel_path:
        return aiohttp.web.json_response(
            {"error": "path is required"}, status=400,
        )

    target = _safe_resolve(rel_path)
    if target is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not target.is_file():
        return aiohttp.web.json_response(
            {"error": "path is not a file"}, status=400,
        )

    mime = mimetypes.guess_type(str(target))[0] or "application/octet-stream"

    resp = aiohttp.web.StreamResponse(
        status=200,
        headers={
            "Content-Type": mime,
            "Content-Disposition": f'attachment; filename="{target.name}"',
            "Content-Length": str(target.stat().st_size),
        },
    )
    await resp.prepare(request)

    try:
        with open(target, "rb") as f:
            while True:
                chunk = f.read(65536)
                if not chunk:
                    break
                await resp.write(chunk)
    except OSError:
        pass

    await resp.write_eof()
    return resp


# ---------------------------------------------------------------------------
# POST /v1/webui/files/mkdir
# ---------------------------------------------------------------------------

async def files_mkdir(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Create a new directory."""
    try:
        body = await request.json()
    except Exception:
        return aiohttp.web.json_response({"error": "invalid JSON"}, status=400)

    rel_path = body.get("path", "")
    if not rel_path:
        return aiohttp.web.json_response(
            {"error": "path is required"}, status=400,
        )

    target = _safe_resolve(rel_path)
    if target is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    try:
        target.mkdir(parents=True, exist_ok=True)
        return aiohttp.web.json_response({"status": "ok", "path": rel_path})
    except OSError as e:
        return aiohttp.web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /v1/webui/files/delete
# ---------------------------------------------------------------------------

async def files_delete(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Delete one or more files/directories."""
    try:
        body = await request.json()
    except Exception:
        return aiohttp.web.json_response({"error": "invalid JSON"}, status=400)

    paths = body.get("paths", [])
    if not paths or not isinstance(paths, list):
        return aiohttp.web.json_response(
            {"error": "paths array is required"}, status=400,
        )

    results: List[Dict[str, Any]] = []
    for rel_path in paths:
        target = _safe_resolve(str(rel_path))
        if target is None:
            results.append({"path": rel_path, "ok": False, "error": "unsafe path"})
            continue

        # Prevent deleting the project root itself
        if target == _PROJECT_ROOT:
            results.append({"path": rel_path, "ok": False, "error": "cannot delete project root"})
            continue

        try:
            if target.is_dir():
                shutil.rmtree(target)
            elif target.is_file():
                target.unlink()
            else:
                results.append({"path": rel_path, "ok": False, "error": "not found"})
                continue
            results.append({"path": rel_path, "ok": True})
        except OSError as e:
            results.append({"path": rel_path, "ok": False, "error": str(e)})

    return aiohttp.web.json_response({"results": results})


# ---------------------------------------------------------------------------
# POST /v1/webui/files/rename
# ---------------------------------------------------------------------------

async def files_rename(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Rename or move a file/directory."""
    try:
        body = await request.json()
    except Exception:
        return aiohttp.web.json_response({"error": "invalid JSON"}, status=400)

    old_path = body.get("old_path", "")
    new_path = body.get("new_path", "")
    if not old_path or not new_path:
        return aiohttp.web.json_response(
            {"error": "old_path and new_path are required"}, status=400,
        )

    src = _safe_resolve(old_path)
    dst = _safe_resolve(new_path)
    if src is None or dst is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not src.exists():
        return aiohttp.web.json_response(
            {"error": "source path not found"}, status=404,
        )

    # Prevent moving project root
    if src == _PROJECT_ROOT:
        return aiohttp.web.json_response(
            {"error": "cannot rename project root"}, status=400,
        )

    try:
        # Create parent dirs if needed
        dst.parent.mkdir(parents=True, exist_ok=True)
        src.rename(dst)
        return aiohttp.web.json_response({"status": "ok"})
    except OSError as e:
        return aiohttp.web.json_response({"error": str(e)}, status=500)
