from __future__ import annotations

"""WebUI Terminal WebSocket router.

Provides local and SSH remote terminal sessions via WebSocket,
using xterm.js on the frontend.
"""

import asyncio
import json
import os
import signal
import subprocess
import sys
import uuid
from typing import Any, Dict, Optional

import aiohttp.web

__all__ = ["terminal_ws", "terminal_sessions_api"]

# Active terminal sessions: session_id -> TerminalSession
_sessions: Dict[str, "TerminalSession"] = {}


class TerminalSession:
    """Manages a single terminal process (local or SSH)."""

    def __init__(self, session_id: str, kind: str = "local") -> None:
        self.session_id = session_id
        self.kind = kind
        self.process: Optional[subprocess.Popen] = None
        self._fd: Optional[int] = None  # pty master fd (Unix)
        self._reader_task: Optional[asyncio.Task] = None
        self._ws: Optional[aiohttp.web.WebSocketResponse] = None
        self._ssh_client = None  # paramiko.SSHClient
        self._ssh_channel = None  # paramiko.Channel
        self._alive = False

    async def start_local(self, cols: int = 80, rows: int = 24) -> bool:
        """Start a local shell process."""
        try:
            if sys.platform == "win32":
                return await self._start_local_windows(cols, rows)
            else:
                return await self._start_local_unix(cols, rows)
        except Exception as e:
            await self._send_error(f"Failed to start local terminal: {e}")
            return False

    async def _start_local_windows(self, cols: int, rows: int) -> bool:
        """Start local terminal on Windows using cmd.exe with UTF-8 encoding."""
        env = os.environ.copy()
        env["TERM"] = "xterm-256color"
        env["PYTHONIOENCODING"] = "utf-8"
        env["ANSICON"] = "1"  # Enable ANSI escape code support

        # Use cmd.exe as primary shell with UTF-8 code page
        self.process = subprocess.Popen(
            ["cmd.exe", "/K", "chcp 65001 >nul & title Provider-V2 Terminal"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            env=env,
        )
        self._alive = True
        # Start reader thread (bridged to asyncio)
        loop = asyncio.get_event_loop()
        self._reader_task = loop.create_task(self._read_windows_output())
        return True

    async def _read_windows_output(self) -> None:
        """Read from Windows process stdout and send to WebSocket."""
        loop = asyncio.get_event_loop()
        proc = self.process
        if not proc or not proc.stdout:
            return
        try:
            while self._alive and proc.poll() is None:
                # Read in a thread to avoid blocking
                data = await loop.run_in_executor(None, self._read_chunk)
                if data is None:
                    break
                if data and self._ws and not self._ws.closed:
                    await self._ws.send_json({
                        "type": "output",
                        "data": data.decode("utf-8", errors="replace"),
                    })
        except Exception:
            pass
        finally:
            if self._ws and not self._ws.closed:
                await self._ws.send_json({"type": "exit", "code": proc.returncode if proc else -1})

    def _read_chunk(self) -> Optional[bytes]:
        """Read a chunk from process stdout (blocking, runs in executor)."""
        if not self.process or not self.process.stdout:
            return None
        try:
            data = self.process.stdout.read1(4096)
            if not data:
                return None
            return data
        except Exception:
            return None

    async def _start_local_unix(self, cols: int, rows: int) -> bool:
        """Start local terminal on Unix using pty."""
        import pty

        master_fd, slave_fd = pty.openpty()
        shell = os.environ.get("SHELL", "/bin/bash")

        env = os.environ.copy()
        env["TERM"] = "xterm-256color"
        env["COLUMNS"] = str(cols)
        env["LINES"] = str(rows)

        self.process = subprocess.Popen(
            [shell],
            stdin=slave_fd,
            stdout=slave_fd,
            stderr=slave_fd,
            env=env,
            preexec_fn=os.setsid,
            bufsize=0,
        )
        os.close(slave_fd)
        self._fd = master_fd
        self._alive = True

        # Set window size
        self._set_pty_size(cols, rows)

        # Start reader
        loop = asyncio.get_event_loop()
        self._reader_task = loop.create_task(self._read_pty_output())
        return True

    async def _read_pty_output(self) -> None:
        """Read from pty master fd and send to WebSocket."""
        loop = asyncio.get_event_loop()
        try:
            while self._alive and self._fd is not None:
                data = await loop.run_in_executor(None, self._read_pty_chunk)
                if data is None:
                    break
                if data and self._ws and not self._ws.closed:
                    await self._ws.send_json({
                        "type": "output",
                        "data": data.decode("utf-8", errors="replace"),
                    })
        except Exception:
            pass
        finally:
            if self._ws and not self._ws.closed:
                code = self.process.returncode if self.process else -1
                await self._ws.send_json({"type": "exit", "code": code})

    def _read_pty_chunk(self) -> Optional[bytes]:
        """Read from pty fd (blocking, runs in executor)."""
        if self._fd is None:
            return None
        try:
            data = os.read(self._fd, 4096)
            if not data:
                return None
            return data
        except OSError:
            return None

    def _set_pty_size(self, cols: int, rows: int) -> None:
        """Set pty window size (Unix only)."""
        if self._fd is None or sys.platform == "win32":
            return
        try:
            import fcntl
            import struct
            import termios
            winsize = struct.pack("HHHH", rows, cols, 0, 0)
            fcntl.ioctl(self._fd, termios.TIOCSWINSZ, winsize)
        except Exception:
            pass

    async def start_ssh(
        self,
        host: str,
        port: int = 22,
        username: str = "",
        password: str = "",
        key_data: str = "",
        cols: int = 80,
        rows: int = 24,
    ) -> bool:
        """Start an SSH remote terminal session using paramiko."""
        try:
            import paramiko
        except ImportError:
            await self._send_error("paramiko is not installed. Add 'paramiko>=3.0.0' to requirements.txt and restart.")
            return False

        try:
            self._ssh_client = paramiko.SSHClient()
            self._ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

            connect_kwargs: Dict[str, Any] = {
                "hostname": host,
                "port": port,
                "username": username,
                "timeout": 15,
            }

            if key_data:
                import io
                # Try RSA key first, then Ed25519
                for key_class in (paramiko.RSAKey, paramiko.Ed25519Key, paramiko.ECDSAKey):
                    try:
                        pkey = key_class.from_private_key(io.StringIO(key_data))
                        connect_kwargs["pkey"] = pkey
                        break
                    except Exception:
                        continue
                if "pkey" not in connect_kwargs:
                    await self._send_error("Failed to parse private key. Supported formats: RSA, Ed25519, ECDSA.")
                    return False
            elif password:
                connect_kwargs["password"] = password
            else:
                # Try system keys
                connect_kwargs["look_for_keys"] = True
                connect_kwargs["allow_agent"] = True

            await asyncio.get_event_loop().run_in_executor(
                None, lambda: self._ssh_client.connect(**connect_kwargs)
            )

            self._ssh_channel = self._ssh_client.get_transport().open_session()
            self._ssh_channel.get_pty(term="xterm-256color", width=cols, height=rows)
            self._ssh_channel.invoke_shell()
            self._alive = True

            loop = asyncio.get_event_loop()
            self._reader_task = loop.create_task(self._read_ssh_output())
            return True

        except Exception as e:
            await self._send_error(f"SSH connection failed: {e}")
            return False

    async def _read_ssh_output(self) -> None:
        """Read from SSH channel and send to WebSocket."""
        loop = asyncio.get_event_loop()
        try:
            while self._alive and self._ssh_channel:
                data = await loop.run_in_executor(None, self._read_ssh_chunk)
                if data is None:
                    break
                if data and self._ws and not self._ws.closed:
                    await self._ws.send_json({
                        "type": "output",
                        "data": data.decode("utf-8", errors="replace"),
                    })
        except Exception:
            pass
        finally:
            if self._ws and not self._ws.closed:
                await self._ws.send_json({"type": "exit", "code": 0})

    def _read_ssh_chunk(self) -> Optional[bytes]:
        """Read from SSH channel (blocking, runs in executor)."""
        if not self._ssh_channel:
            return None
        try:
            if self._ssh_channel.recv_ready():
                data = self._ssh_channel.recv(4096)
                if not data:
                    return None
                return data
            elif self._ssh_channel.closed or self._ssh_channel.eof_received:
                return None
            else:
                # Small sleep to avoid busy-waiting
                import time
                time.sleep(0.05)
                return b""
        except Exception:
            return None

    async def write_input(self, data: str) -> None:
        """Write input data to the terminal process."""
        try:
            encoded = data.encode("utf-8")
            if self.kind == "ssh" and self._ssh_channel:
                await asyncio.get_event_loop().run_in_executor(
                    None, self._ssh_channel.send, encoded
                )
            elif self.process and self.process.stdin:
                await asyncio.get_event_loop().run_in_executor(
                    None, self._write_stdin, encoded
                )
            elif self._fd is not None:
                await asyncio.get_event_loop().run_in_executor(
                    None, os.write, self._fd, encoded
                )
        except Exception:
            pass

    def _write_stdin(self, data: bytes) -> None:
        """Write data to process stdin and flush."""
        if self.process and self.process.stdin:
            self.process.stdin.write(data)
            self.process.stdin.flush()

    async def resize(self, cols: int, rows: int) -> None:
        """Resize the terminal."""
        try:
            if self.kind == "ssh" and self._ssh_channel:
                await asyncio.get_event_loop().run_in_executor(
                    None, lambda: self._ssh_channel.resize_pty(width=cols, height=rows)
                )
            elif self._fd is not None:
                self._set_pty_size(cols, rows)
            # Windows pipe-based terminals don't support resize
        except Exception:
            pass

    async def _send_error(self, message: str) -> None:
        """Send an error message to the WebSocket client."""
        if self._ws and not self._ws.closed:
            await self._ws.send_json({"type": "error", "message": message})

    async def close(self) -> None:
        """Terminate the session and clean up resources."""
        self._alive = False

        # Cancel reader task
        if self._reader_task and not self._reader_task.done():
            self._reader_task.cancel()
            try:
                await self._reader_task
            except (asyncio.CancelledError, Exception):
                pass

        # Close SSH channel/client
        if self._ssh_channel:
            try:
                self._ssh_channel.close()
            except Exception:
                pass
        if self._ssh_client:
            try:
                self._ssh_client.close()
            except Exception:
                pass

        # Close pty fd
        if self._fd is not None:
            try:
                os.close(self._fd)
            except Exception:
                pass
            self._fd = None

        # Kill process
        if self.process:
            try:
                if sys.platform != "win32":
                    try:
                        os.killpg(os.getpgid(self.process.pid), signal.SIGTERM)
                    except Exception:
                        pass
                self.process.terminate()
                self.process.wait(timeout=3)
            except Exception:
                try:
                    self.process.kill()
                except Exception:
                    pass

        # Remove from sessions dict
        _sessions.pop(self.session_id, None)


async def terminal_ws(request: aiohttp.web.Request) -> aiohttp.web.WebSocketResponse:
    """WebSocket endpoint at /v1/webui/ws/terminal/{session_id}.

    Protocol (client -> server):
      {"type": "init", "kind": "local"|"ssh", "cols": N, "rows": N, ...ssh_params}
      {"type": "input", "data": "..."}
      {"type": "resize", "cols": N, "rows": N}

    Protocol (server -> client):
      {"type": "ready", "session_id": "..."}
      {"type": "output", "data": "..."}
      {"type": "error", "message": "..."}
      {"type": "exit", "code": N}
    """
    session_id = request.match_info.get("session_id", str(uuid.uuid4()))

    ws = aiohttp.web.WebSocketResponse(heartbeat=30.0)
    await ws.prepare(request)

    session: Optional[TerminalSession] = None

    try:
        async for msg in ws:
            if msg.type in (aiohttp.WSMsgType.CLOSE, aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.ERROR):
                break

            if msg.type != aiohttp.WSMsgType.TEXT:
                continue

            try:
                payload = json.loads(msg.data)
            except (json.JSONDecodeError, TypeError):
                continue

            msg_type = payload.get("type")

            if msg_type == "init":
                # Initialize terminal session
                kind = payload.get("kind", "local")
                cols = int(payload.get("cols", 80))
                rows = int(payload.get("rows", 24))

                session = TerminalSession(session_id, kind)
                session._ws = ws
                _sessions[session_id] = session

                if kind == "ssh":
                    ok = await session.start_ssh(
                        host=payload.get("host", ""),
                        port=int(payload.get("port", 22)),
                        username=payload.get("username", ""),
                        password=payload.get("password", ""),
                        key_data=payload.get("key_data", ""),
                        cols=cols,
                        rows=rows,
                    )
                else:
                    ok = await session.start_local(cols, rows)

                if ok:
                    await ws.send_json({"type": "ready", "session_id": session_id})
                else:
                    # Error already sent by start_local/start_ssh
                    _sessions.pop(session_id, None)

            elif msg_type == "input" and session:
                data = payload.get("data", "")
                if data:
                    await session.write_input(data)

            elif msg_type == "resize" and session:
                cols = int(payload.get("cols", 80))
                rows = int(payload.get("rows", 24))
                await session.resize(cols, rows)

            elif msg_type == "ping":
                await ws.send_json({"type": "pong"})

    finally:
        if session:
            await session.close()

    return ws


async def terminal_sessions_api(request: aiohttp.web.Request) -> aiohttp.web.Response:
    """GET /v1/webui/terminal/sessions — list active terminal sessions."""
    result = []
    for sid, sess in _sessions.items():
        result.append({
            "session_id": sid,
            "kind": sess.kind,
            "alive": sess._alive,
        })
    return aiohttp.web.json_response(result)
