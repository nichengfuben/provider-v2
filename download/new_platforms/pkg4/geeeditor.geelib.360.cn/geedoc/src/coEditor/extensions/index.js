import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import { Codemark } from "./codeMark"; // code 光标修正的工具
import CodeBlock from "./codeBlock";
import Image from "./image";
import Table from "./table/table.js";
import TableCell from "./table/table-cell.js";
import TableHeader from "./table/table-header.js";
import TableRow from "./table/table-row.js";
import { TrailingNode } from "./trailingNode.js";
import Iframe from "./iframe";
import Markdown from "./markdown/index.js";
// import CharacterCount from "@tiptap/extension-character-count";
import selectHighlight from "./selectHighlight.js";
import custom from "./custom.js";

export function getDefaultExtensions() {
  const extensions = [
    // 表格放在list前，否则 list 中的 tab 快捷键会被覆盖。现在 list 在 StarterKit 中一起注册了，所以就放在 StarterKit 前
    Table,
    TableCell,
    TableHeader,
    TableRow,
    StarterKit.configure({
      code: false,
      codeBlock: false
    }),
    Placeholder.configure({
      placeholder: () => {
        return "请输入...";
      },
      includeChildren: true
    }),
    Code.extend({ keepOnSplit: false, excludes: "" }),
    Codemark,
    CodeBlock,
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"]
    }),
    TextStyle,
    Link.configure({
      openOnClick: false,
      autolink: false
    }),
    Image,
    // CharacterCount,
    selectHighlight,
    custom,
    TrailingNode,
    Iframe
  ];

  return extensions.concat(Markdown.configure({
    extensions: extensions
  }));
}
