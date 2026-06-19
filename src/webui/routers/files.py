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
    "files_write",
    "files_upload",
    "files_copy",
    "files_move",
    "files_search",
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

# Path components that are forbidden for write operations
_SENSITIVE_PATH_PARTS = frozenset({
    ".git", ".env", ".htaccess", ".gitignore",
    "config.toml", "RECORD.md",
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


def _is_write_forbidden(path: Path) -> bool:
    """Return True if *path* touches a sensitive file or directory."""
    parts = path.resolve().relative_to(_PROJECT_ROOT).parts
    # Block writes inside or to sensitive path components
    for part in parts:
        if part in _SENSITIVE_PATH_PARTS:
            return True
    return False


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


# ---------------------------------------------------------------------------
# POST /v1/webui/files/write
# ---------------------------------------------------------------------------

async def files_write(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Save file content to disk.

    Body: {"path": "/relative/path/to/file", "content": "file content string"}
    Response: {"status": "ok"} on success
    """
    try:
        body = await request.json()
    except Exception:
        return aiohttp.web.json_response({"error": "invalid JSON"}, status=400)

    rel_path = body.get("path", "")
    content = body.get("content")

    if not rel_path:
        return aiohttp.web.json_response(
            {"error": "path is required"}, status=400,
        )

    if content is None:
        return aiohttp.web.json_response(
            {"error": "content is required"}, status=400,
        )

    target = _safe_resolve(rel_path)
    if target is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    # Prevent writing to the project root itself
    if target == _PROJECT_ROOT:
        return aiohttp.web.json_response(
            {"error": "cannot overwrite project root"}, status=400,
        )

    # Block writes to sensitive files/directories
    if _is_write_forbidden(target):
        return aiohttp.web.json_response(
            {"error": "writing to this path is not allowed"}, status=403,
        )

    # Ensure content is a string
    if not isinstance(content, str):
        return aiohttp.web.json_response(
            {"error": "content must be a string"}, status=400,
        )

    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        return aiohttp.web.json_response({"status": "ok"})
    except PermissionError:
        return aiohttp.web.json_response(
            {"error": "permission denied"}, status=403,
        )
    except OSError as e:
        return aiohttp.web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /v1/webui/files/upload
# ---------------------------------------------------------------------------

# Maximum upload size per file: 100 MB
_MAX_UPLOAD_SIZE = 100 * 1024 * 1024


async def files_upload(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Upload one or more files to a target directory.

    Multipart form data:
    - "dir": target directory path (relative to project root)
    - "files": one or more file fields

    Returns: {"status": "ok", "uploaded": ["file1.txt", "file2.png"]}
    """
    content_type = request.content_type or ""
    if "multipart" not in content_type:
        return aiohttp.web.json_response(
            {"error": "multipart/form-data expected"}, status=400,
        )

    reader = await request.multipart()

    # --- Read "dir" field first ---
    dir_field = await reader.next()
    if dir_field is None or dir_field.name != "dir":
        return aiohttp.web.json_response(
            {"error": "dir field is required as the first form field"}, status=400,
        )

    dir_value = (await dir_field.read()).decode("utf-8").strip()
    if not dir_value:
        return aiohttp.web.json_response(
            {"error": "dir path is required"}, status=400,
        )

    target_dir = _safe_resolve(dir_value)
    if target_dir is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not target_dir.exists():
        return aiohttp.web.json_response(
            {"error": "target directory does not exist"}, status=404,
        )

    if not target_dir.is_dir():
        return aiohttp.web.json_response(
            {"error": "target path is not a directory"}, status=400,
        )

    # Block uploads into sensitive directories
    if _is_write_forbidden(target_dir):
        return aiohttp.web.json_response(
            {"error": "uploading to this directory is not allowed"}, status=403,
        )

    # --- Read file fields ---
    uploaded: List[str] = []

    while True:
        part = await reader.next()
        if part is None:
            break

        if part.name != "files":
            continue

        filename = part.filename
        if not filename:
            continue

        # Sanitise filename: strip path separators (prevent directory traversal)
        filename = Path(filename).name
        if not filename or filename in (".", ".."):
            continue

        dest = target_dir / filename

        # Safety: ensure resolved dest stays inside project root
        try:
            dest.resolve().relative_to(_PROJECT_ROOT)
        except ValueError:
            continue

        # Block overwriting sensitive files
        if _is_write_forbidden(dest):
            continue

        # Stream file to disk with size limit
        try:
            total = 0
            with open(dest, "wb") as f:
                while True:
                    chunk = await part.read_chunk()
                    if not chunk:
                        break
                    total += len(chunk)
                    if total > _MAX_UPLOAD_SIZE:
                        # Remove partial file and reject
                        f.close()
                        try:
                            dest.unlink(missing_ok=True)
                        except OSError:
                            pass
                        return aiohttp.web.json_response(
                            {"error": f"file '{filename}' exceeds {_MAX_UPLOAD_SIZE // (1024*1024)} MB limit"},
                            status=413,
                        )
                    f.write(chunk)

            uploaded.append(filename)
        except OSError:
            # Clean up partial file on error
            try:
                dest.unlink(missing_ok=True)
            except OSError:
                pass
            continue

    if not uploaded:
        return aiohttp.web.json_response(
            {"error": "no files uploaded"}, status=400,
        )

    return aiohttp.web.json_response({
        "status": "ok",
        "uploaded": uploaded,
    })


# ---------------------------------------------------------------------------
# Helpers for copy / move
# ---------------------------------------------------------------------------

def _unique_dest(dest: Path) -> Path:
    """Return *dest* if it does not exist, otherwise append a numeric suffix."""
    if not dest.exists():
        return dest
    stem = dest.stem
    suffix = dest.suffix
    parent = dest.parent
    counter = 1
    while True:
        candidate = parent / f"{stem}_{counter}{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


# ---------------------------------------------------------------------------
# POST /v1/webui/files/copy
# ---------------------------------------------------------------------------

async def files_copy(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Copy a file or directory.

    Body: {"source": "/path/to/source", "dest": "/path/to/destination"}
    """
    try:
        body = await request.json()
    except Exception:
        return aiohttp.web.json_response({"error": "invalid JSON"}, status=400)

    source_rel = body.get("source", "")
    dest_rel = body.get("dest", "")
    if not source_rel or not dest_rel:
        return aiohttp.web.json_response(
            {"error": "source and dest are required"}, status=400,
        )

    src = _safe_resolve(source_rel)
    dst = _safe_resolve(dest_rel)
    if src is None or dst is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not src.exists():
        return aiohttp.web.json_response(
            {"error": "source path not found"}, status=404,
        )

    # Prevent copying the project root itself
    if src == _PROJECT_ROOT:
        return aiohttp.web.json_response(
            {"error": "cannot copy project root"}, status=400,
        )

    # Block writes to sensitive paths
    if _is_write_forbidden(dst):
        return aiohttp.web.json_response(
            {"error": "copying to this path is not allowed"}, status=403,
        )

    try:
        # If dest is an existing directory, copy into it using source name
        if dst.is_dir():
            dst = dst / src.name

        dst = _unique_dest(dst)
        dst.parent.mkdir(parents=True, exist_ok=True)

        if src.is_dir():
            shutil.copytree(str(src), str(dst))
        else:
            shutil.copy2(str(src), str(dst))

        dest_rel_out = "/" + str(dst.relative_to(_PROJECT_ROOT)).replace("\\", "/")
        return aiohttp.web.json_response({"status": "ok", "dest": dest_rel_out})
    except OSError as e:
        return aiohttp.web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# POST /v1/webui/files/move
# ---------------------------------------------------------------------------

async def files_move(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Move a file or directory.

    Body: {"source": "/path/to/source", "dest": "/path/to/destination"}
    """
    try:
        body = await request.json()
    except Exception:
        return aiohttp.web.json_response({"error": "invalid JSON"}, status=400)

    source_rel = body.get("source", "")
    dest_rel = body.get("dest", "")
    if not source_rel or not dest_rel:
        return aiohttp.web.json_response(
            {"error": "source and dest are required"}, status=400,
        )

    src = _safe_resolve(source_rel)
    dst = _safe_resolve(dest_rel)
    if src is None or dst is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not src.exists():
        return aiohttp.web.json_response(
            {"error": "source path not found"}, status=404,
        )

    # Prevent moving the project root
    if src == _PROJECT_ROOT:
        return aiohttp.web.json_response(
            {"error": "cannot move project root"}, status=400,
        )

    # Block writes to sensitive paths
    if _is_write_forbidden(dst):
        return aiohttp.web.json_response(
            {"error": "moving to this path is not allowed"}, status=403,
        )

    try:
        # If dest is an existing directory, move into it using source name
        if dst.is_dir():
            dst = dst / src.name

        dst = _unique_dest(dst)
        dst.parent.mkdir(parents=True, exist_ok=True)

        shutil.move(str(src), str(dst))

        dest_rel_out = "/" + str(dst.relative_to(_PROJECT_ROOT)).replace("\\", "/")
        return aiohttp.web.json_response({"status": "ok", "dest": dest_rel_out})
    except OSError as e:
        return aiohttp.web.json_response({"error": str(e)}, status=500)


# ---------------------------------------------------------------------------
# GET /v1/webui/files/search?dir=/&query=pattern
# ---------------------------------------------------------------------------

async def files_search(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """Search files by name within a directory tree.

    Query params:
    - dir: directory to search in (required)
    - query: search pattern, case-insensitive substring match (required)
    - recursive: "true" to search subdirectories (default "true")
    - max_results: limit results (default 100)

    Returns results sorted by relevance: exact match first, then prefix
    match, then substring match.
    """
    dir_rel = request.query.get("dir", "")
    query = request.query.get("query", "")

    if not dir_rel:
        return aiohttp.web.json_response(
            {"error": "dir is required"}, status=400,
        )
    if not query:
        return aiohttp.web.json_response(
            {"error": "query is required"}, status=400,
        )

    target = _safe_resolve(dir_rel)
    if target is None:
        return aiohttp.web.json_response(
            {"error": "invalid or unsafe path"}, status=400,
        )

    if not target.exists():
        return aiohttp.web.json_response(
            {"error": "directory not found"}, status=404,
        )

    if not target.is_dir():
        return aiohttp.web.json_response(
            {"error": "path is not a directory"}, status=400,
        )

    recursive = request.query.get("recursive", "true").lower() != "false"
    try:
        max_results = int(request.query.get("max_results", "100"))
    except (ValueError, TypeError):
        max_results = 100
    max_results = max(1, min(max_results, 500))

    query_lower = query.lower()

    # Collect matches with relevance scores:
    # 0 = exact match (case-insensitive), 1 = prefix match, 2 = substring match
    exact: List[Dict[str, Any]] = []
    prefix: List[Dict[str, Any]] = []
    substring: List[Dict[str, Any]] = []

    # Directories to skip during search for performance
    _skip_dirs = frozenset({
        ".git", "node_modules", "__pycache__", ".backup", ".tmp",
        "logs", "persist", "uploads", ".qoder", ".agents",
    })

    def _match_entry(entry_path: Path) -> None:
        name = entry_path.name
        name_lower = name.lower()

        if name_lower == query_lower:
            bucket = exact
        elif name_lower.startswith(query_lower):
            bucket = prefix
        elif query_lower in name_lower:
            bucket = substring
        else:
            return

        try:
            st = entry_path.stat()
        except OSError:
            return

        is_dir = stat.S_ISDIR(st.st_mode)
        try:
            rel = str(entry_path.relative_to(_PROJECT_ROOT)).replace("\\", "/")
        except ValueError:
            return

        if rel == ".":
            rel = "/"

        bucket.append({
            "name": name,
            "path": "/" + rel if not rel.startswith("/") else rel,
            "is_dir": is_dir,
            "size": st.st_size if not is_dir else None,
            "modified": st.st_mtime,
        })

    try:
        if recursive:
            for dirpath, dirnames, filenames in os.walk(str(target)):
                # Prune skip directories in-place to avoid descending
                dirnames[:] = [
                    d for d in dirnames if d not in _skip_dirs
                ]
                dp = Path(dirpath)
                for name in filenames:
                    _match_entry(dp / name)
                for name in dirnames:
                    _match_entry(dp / name)
        else:
            try:
                for child in target.iterdir():
                    _match_entry(child)
            except PermissionError:
                pass
    except PermissionError:
        return aiohttp.web.json_response(
            {"error": "permission denied"}, status=403,
        )

    # Combine results in relevance order, then alphabetical within each group
    def _sort_key(item: Dict[str, Any]) -> str:
        return item["name"].lower()

    exact.sort(key=_sort_key)
    prefix.sort(key=_sort_key)
    substring.sort(key=_sort_key)

    results = (exact + prefix + substring)[:max_results]

    return aiohttp.web.json_response({"results": results})
