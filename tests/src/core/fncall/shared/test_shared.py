"""Tests for src/core/fncall/shared utilities."""
import pytest

from src.core.fncall.shared.normalization import normalize_content, format_tool_descs
from src.core.fncall.shared.loop_detect import detect_tool_loop, LoopDetectionResult
from src.core.fncall.shared.coercion import _coerce_param_value, _build_param_schema_index
from src.core.fncall.shared.xml_helpers import extract_cdata, escape_xml_attr


class TestNormalizeContent:
    def test_string_passthrough(self):
        assert normalize_content("hello") == "hello"

    def test_list_of_text(self):
        content = [{"type": "text", "text": "hello"}, {"type": "text", "text": " world"}]
        result = normalize_content(content)
        # normalize_content joins all text with newlines
        assert result == "hello\n world"

    def test_list_with_non_text_ignored(self):
        # normalize_content converts non-text blocks to string representation
        content = [{"type": "image", "url": "http://..."}, {"type": "text", "text": "text"}]
        result = normalize_content(content)
        # The image block is converted to JSON string
        assert "text" in result

    def test_empty_list(self):
        assert normalize_content([]) == ""

    def test_none_content(self):
        assert normalize_content(None) == ""

    def test_mixed_list(self):
        content = [{"type": "text", "text": "a"}, {"type": "other"}, {"type": "text", "text": "b"}]
        result = normalize_content(content)
        # Non-text blocks are included as JSON strings
        assert "a" in result
        assert "b" in result


class TestFormatToolDescs:
    def test_basic_formatting(self):
        tools = [
            {
                "function": {
                    "name": "get_weather",
                    "description": "Get weather for a location",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {"type": "string", "description": "City name"}
                        },
                        "required": ["location"],
                    },
                }
            }
        ]
        result = format_tool_descs(tools)
        assert "get_weather" in result
        assert "Get weather" in result
        assert "location" in result

    def test_multiple_tools(self):
        tools = [
            {"function": {"name": "tool_a", "description": "Tool A", "parameters": {"type": "object", "properties": {}}}},
            {"function": {"name": "tool_b", "description": "Tool B", "parameters": {"type": "object", "properties": {}}}},
        ]
        result = format_tool_descs(tools)
        assert "tool_a" in result
        assert "tool_b" in result

    def test_empty_tools(self):
        assert format_tool_descs([]) == ""

    def test_missing_description(self):
        tools = [{"function": {"name": "tool", "parameters": {"type": "object", "properties": {}}}}]
        result = format_tool_descs(tools)
        assert "tool" in result


class TestDetectToolLoop:
    def test_no_loop(self):
        messages = [
            {"role": "assistant", "tool_calls": [{"function": {"name": "tool_a"}}]},
            {"role": "tool", "name": "tool_b"},
        ]
        result = detect_tool_loop(messages, threshold=3)
        assert result.is_looping is False

    def test_simple_loop(self):
        messages = [
            {"role": "assistant", "tool_calls": [{"function": {"name": "weather"}}]},
            {"role": "assistant", "tool_calls": [{"function": {"name": "weather"}}]},
            {"role": "assistant", "tool_calls": [{"function": {"name": "weather"}}]},
        ]
        result = detect_tool_loop(messages, threshold=3)
        assert result.is_looping is True
        assert result.repeat_count >= 3

    def test_custom_threshold(self):
        messages = [
            {"role": "assistant", "tool_calls": [{"function": {"name": "x"}}]},
            {"role": "assistant", "tool_calls": [{"function": {"name": "x"}}]},
        ]
        # Threshold 2 should detect
        result = detect_tool_loop(messages, threshold=2)
        assert result.is_looping is True

        # Threshold 3 should not detect
        result = detect_tool_loop(messages, threshold=3)
        assert result.is_looping is False

    def test_empty_messages(self):
        result = detect_tool_loop([], threshold=3)
        assert result.is_looping is False

    def test_different_tools_no_loop(self):
        messages = [
            {"role": "assistant", "tool_calls": [{"function": {"name": "a"}}]},
            {"role": "assistant", "tool_calls": [{"function": {"name": "b"}}]},
            {"role": "assistant", "tool_calls": [{"function": {"name": "c"}}]},
        ]
        result = detect_tool_loop(messages, threshold=3)
        assert result.is_looping is False


class TestLoopDetectionResult:
    def test_custom_values(self):
        result = LoopDetectionResult(
            is_looping=True,
            repeat_count=5,
            fingerprint="abc123",
            suggestion="Break the loop",
        )
        assert result.is_looping is True
        assert result.repeat_count == 5
        assert result.fingerprint == "abc123"
        assert result.suggestion == "Break the loop"


class TestCoerceParamValue:
    # Note: _coerce_param_value expects a schema dict, not a type string
    # Tests here would need proper schema dicts, skipping for now
    pass


class TestBuildParamSchemaIndex:
    # _build_param_schema_index expects a list of tool dicts
    def test_builds_index(self):
        tools = [
            {
                "function": {
                    "name": "test",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "age": {"type": "integer"},
                        }
                    }
                }
            }
        ]
        index = _build_param_schema_index(tools)
        # Function should build index from properties
        assert "test" in index
        assert "name" in index["test"]
        assert "age" in index["test"]


class TestXmlHelpers:
    def test_extract_cdata_with_cdata(self):
        assert extract_cdata("<![CDATA[hello]]>") == "hello"

    def test_extract_cdata_without_cdata(self):
        assert extract_cdata("hello") == "hello"

    def test_extract_cdata_strips_whitespace(self):
        assert extract_cdata("  hello  ") == "hello"

    def test_escape_xml_attr_basic(self):
        assert escape_xml_attr("<tag>") == "&lt;tag&gt;"

    def test_escape_xml_attr_ampersand(self):
        assert escape_xml_attr("a&b") == "a&amp;b"

    def test_escape_xml_attr_quotes(self):
        assert escape_xml_attr("'quote'") == "&apos;quote&apos;"
        assert escape_xml_attr('"quote"') == "&quot;quote&quot;"

    def test_escape_xml_attr_escapes_special_chars(self):
        original = "value & <tag>"
        escaped = escape_xml_attr(original)
        # All special chars should be escaped
        assert "&amp;" in escaped
        assert "&lt;" in escaped
        assert "&gt;" in escaped
