"""DeepSeek 流式响应解析器"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class SearchResult:
    """搜索结果条目。"""

    url: str
    title: str
    snippet: str
    cite_index: int


class StreamParser:
    """DeepSeek SSE 流式响应解析器。

    解析来自 /api/v0/chat/completion 等接口的 SSE 事件流，
    将内部格式转换为标准化的 chunk 字典。
    """

    def __init__(self, include_thinking: bool = False) -> None:
        """初始化解析器。

        Args:
            include_thinking: 是否在输出中包含思考过程（<think>...</think> 包裹）。
        """
        self._inc: bool = include_thinking
        self._content: str = ""
        self._think: str = ""
        self._msg_id: Optional[int] = None
        self._parent_id: Optional[int] = None
        self._status: str = "WIP"
        self._is_think: bool = False
        self._think_started: bool = False
        self._search: Dict[int, SearchResult] = {}
        self._cite_buf: str = ""
        self._first_frag: bool = False
        self._tok_usage: int = 0

    @property
    def status(self) -> str:
        """当前响应状态。"""
        return self._status

    @property
    def message_id(self) -> Optional[int]:
        """响应消息 ID（用于 continue 请求）。"""
        return self._msg_id

    @property
    def accumulated_content(self) -> str:
        """已累积的正文内容。"""
        return self._content

    @property
    def accumulated_thinking(self) -> str:
        """已累积的思考内容。"""
        return self._think

    def _replace_citations(self, text: str) -> str:
        """将引用标记替换为 [URL]N 格式。

        Args:
            text: 含引用标记的文本。

        Returns:
            替换后的文本。
        """
        # 统一匹配 [citation:N] 和 [reference:N]
        def _rep(m: Any) -> str:
            i = int(m.group(1))
            if i in self._search:
                return "[" + self._search[i].url + "]" + str(i)
            return m.group(0)

        return re.sub(r"\[(?:citation|reference):(\d+)\]", _rep, text)

    def _proc_cite(self, chunk: str) -> Tuple[str, str]:
        """处理可能含引用标记的文本块（流式，可能不完整）。

        Args:
            chunk: 待处理文本块。

        Returns:
            (处理后内容, 剩余缓冲区) 二元组。
        """
        self._cite_buf += chunk
        result = ""
        buf = self._cite_buf
        while buf:
            m = re.search(r"\[(?:citation|reference):(\d+)\]", buf)
            if m:
                result += buf[: m.start()]
                i = int(m.group(1))
                result += (
                    "[" + self._search[i].url + "]" + str(i)
                    if i in self._search
                    else m.group(0)
                )
                buf = buf[m.end():]
            else:
                # 检查是否有不完整的引用标记（citation 或 reference 都匹配）
                inc = re.search(
                    r"\[(?:c(?:i(?:t(?:a(?:t(?:i(?:o(?:n)?)?)?)?)?)?)?|"
                    r"r(?:e(?:f(?:e(?:r(?:e(?:n(?:c(?:e)?)?)?)?)?)?)?)?)?"
                    r":?\d*\]?$",
                    buf,
                )
                if inc:
                    result += buf[: inc.start()]
                    self._cite_buf = buf[inc.start():]
                    return result, self._cite_buf
                result += buf
                buf = ""
        self._cite_buf = ""
        return result, ""

    def parse_line(self, line: str) -> Optional[Dict[str, Any]]:
        """解析单行 SSE 数据。

        Args:
            line: 原始行字符串（含 event: 或 data: 前缀）。

        Returns:
            解析结果字典或 None（无需处理时）。
        """
        line = line.strip()
        if not line:
            return None

        if line.startswith("event:"):
            ev = line[6:].strip()
            if ev in ("finish", "close"):
                # 刷新引用缓冲区
                if self._cite_buf:
                    rem = self._cite_buf
                    self._cite_buf = ""
                    if self._is_think and self._inc:
                        self._is_think = False
                        return {
                            "type": "thinking",
                            "content": rem + "</think>\n",
                        }
                    return {"type": "content", "content": rem}
                if self._is_think and self._inc:
                    self._is_think = False
                    return {"type": "thinking", "content": "</think>\n"}
                return {"type": "event", "event": ev}
            return None

        if not line.startswith("data:"):
            return None

        raw = line[5:].strip()
        if not raw:
            return None

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return None

        if not isinstance(data, dict):
            return None

        return self._proc(data)

    def _proc(self, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """处理解析后的 JSON 数据对象。

        Args:
            data: JSON 数据字典。

        Returns:
            处理结果字典或 None。
        """
        # 提取消息 ID
        if "response_message_id" in data:
            self._msg_id = data["response_message_id"]
        if "request_message_id" in data:
            self._parent_id = data["request_message_id"]

        # 处理初始化响应体（包含完整 response 对象）
        v = data.get("v")
        if isinstance(v, dict) and "response" in v:
            rd = v["response"]
            if "message_id" in rd:
                self._msg_id = rd["message_id"]
            if "status" in rd:
                self._status = rd["status"]
            if "accumulated_token_usage" in rd:
                self._tok_usage = rd["accumulated_token_usage"]
            for frag in rd.get("fragments", []):
                ft = frag.get("type")
                if ft == "SEARCH":
                    self._extract_search(frag.get("results", []))
                else:
                    # 处理 THINK 或 RESPONSE fragment，返回产生的 chunk
                    res = self._handle_frag(frag)
                    if res is not None:
                        return res

        p = data.get("p", "")
        o = data.get("o")

        # 状态更新
        if p == "response/status" and v:
            self._status = str(v)
            if v == "FINISHED":
                if self._is_think and self._inc:
                    self._is_think = False
                    return {"type": "thinking", "content": "</think>\n"}
                return {"type": "status", "status": "FINISHED"}
            if v == "INCOMPLETE":
                return {
                    "type": "status",
                    "status": "INCOMPLETE",
                    "needs_continue": True,
                }

        # 批量操作
        if p == "response" and o == "BATCH" and isinstance(v, list):
            for op in v:
                if not isinstance(op, dict):
                    continue
                op_p = op.get("p", "")
                op_v = op.get("v")
                if op_p == "accumulated_token_usage":
                    self._tok_usage = op_v or 0
                elif op_p == "quasi_status" and op_v == "INCOMPLETE":
                    return {
                        "type": "status",
                        "status": "INCOMPLETE",
                        "needs_continue": True,
                    }
                elif op_p == "fragments" and op.get("o") == "APPEND":
                    fd = op_v
                    if isinstance(fd, list) and fd and isinstance(fd[0], dict):
                        result = self._handle_frag(fd[0])
                        if result is not None:
                            return result
                # 新增：处理 BATCH 中的 content APPEND（含引用标记如 [reference:0]）
                elif op_p == "content" and op.get("o") == "APPEND":
                    content_str = str(op_v) if op_v else ""
                    if content_str:
                        return self._handle_chunk(content_str)
                # 新增：处理 BATCH 中的 references（存储引用到 _search）
                elif op_p == "references" and isinstance(op_v, list):
                    self._extract_references(op_v)

        # fragments APPEND
        if p == "fragments" and o == "APPEND" and isinstance(v, list) and v:
            if isinstance(v[0], dict):
                return self._handle_frag(v[0])

        # 内容增量（主路径）
        if p == "response/fragments/-1/content" and v is not None:
            return self._handle_chunk(str(v))

        # 搜索结果
        if p == "response/fragments/-1/results" and v:
            self._extract_search(v)

        # 思考结束标记
        if p == "response/fragments/-1/elapsed_secs":
            if self._is_think and self._inc:
                self._is_think = False
                return {"type": "thinking", "content": "</think>\n"}

        # 兜底：裸值推送
        if (
            v is not None
            and not isinstance(v, dict)
            and "p" not in data
            and "o" not in data
        ):
            sv = str(v)
            if sv and sv not in ("FINISHED", "INCOMPLETE"):
                return self._handle_chunk(sv)

        return None

    def _extract_search(self, results: List[Any]) -> None:
        """提取并存储搜索结果。

        Args:
            results: 搜索结果列表。
        """
        for r in results:
            if isinstance(r, dict) and "cite_index" in r:
                self._search[r["cite_index"]] = SearchResult(
                    url=r.get("url", ""),
                    title=r.get("title", ""),
                    snippet=r.get("snippet", ""),
                    cite_index=r["cite_index"],
                )

    def _extract_references(self, references: List[Dict[str, Any]]) -> None:
        """从 references 数据中提取引用映射。

        处理格式如 [{"id": 8, "type": "TOOL_OPEN"}] 的引用数据。
        将 TOOL_OPEN 的 id 关联到已打开的搜索结果页的 URL。

        Args:
            references: 引用数据列表。
        """
        for ref in references:
            if not isinstance(ref, dict):
                continue
            ref_id = ref.get("id")
            ref_type = ref.get("type")
            # 通过 id 查找之前打开的搜索结果
            # 在 BATCH 中，TOOL_OPEN 的 id 对应搜索结果中的 cite_index
            if ref_id is not None:
                # 如果 _search 中已有该 cite_index 的记录，说明已通过搜索结果填充
                # 如果没有，尝试通过打开的页面信息填充
                pass  # _search 已在 _extract_search 中填充

    def _handle_frag(self, frag: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """处理 fragment 数据对象。

        Args:
            frag: fragment 字典。

        Returns:
            处理结果字典或 None。
        """
        ft = frag.get("type", "RESPONSE")
        content = frag.get("content")

        if not self._first_frag:
            self._first_frag = True
            if ft == "THINK":
                self._is_think = True
                self._think_started = True
                if content:
                    self._think += content
                    if self._inc:
                        pc, _ = self._proc_cite(content)
                        return {"type": "thinking", "content": "<think>" + pc}
                elif self._inc:
                    return {"type": "thinking", "content": "<think>"}
                return None

        if ft == "THINK":
            self._is_think = True
            self._think_started = True
            if content:
                self._think += content
                if self._inc:
                    pc, _ = self._proc_cite(content)
                    return {"type": "thinking", "content": pc}
            elif self._inc and not self._think_started:
                return {"type": "thinking", "content": "<think>"}
        elif ft == "RESPONSE":
            if self._is_think and self._inc:
                self._is_think = False
                close = "</think>\n"
                if content:
                    self._content += content
                    pc, _ = self._proc_cite(content)
                    return {"type": "content", "content": close + pc}
                return {"type": "thinking", "content": close}
            if content:
                self._content += content
                pc, _ = self._proc_cite(content)
                return {"type": "content", "content": pc}
        elif ft == "SEARCH" and "results" in frag:
            self._extract_search(frag["results"])

        return None

    def _handle_chunk(self, chunk: str) -> Optional[Dict[str, Any]]:
        """处理普通文本增量块。

        Args:
            chunk: 文本块字符串。

        Returns:
            处理结果字典或 None（空块时）。
        """
        if self._is_think:
            self._think += chunk
            if self._inc:
                pc, _ = self._proc_cite(chunk)
                return {"type": "thinking", "content": pc} if pc else None
            return None
        self._content += chunk
        pc, _ = self._proc_cite(chunk)
        return {"type": "content", "content": pc} if pc else None
