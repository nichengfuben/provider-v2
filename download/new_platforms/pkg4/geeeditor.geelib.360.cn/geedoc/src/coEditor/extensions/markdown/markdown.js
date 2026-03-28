import { generateJSON } from "@tiptap/core";
import MarkdownIt from "markdown-it";
import markdownItTaskLists from "./markdownItTaskLists.js";

export function isMarkdown(str) {
  if (typeof str !== "string") return false;

  const markdownPatterns = [
    /^#{1,6}\s.+/, // 标题，如 # Heading
    /^>\s.+/, // 引用，如 > blockquote
    /^(?:-{3,}|_{3,}|\*{3,})$/, // 分隔线，如 --- 或 *** 或 ___
    /^[*\-+]\s.+/, // 无序列表，如 * item, - item, + item
    /^\d+\.\s.+/, // 有序列表，如 1. item
    /\[(.*?)\]\((.*?)\)/, // 链接，如 [text](url)
    /!\[(.*?)\]\((.*?)\)/, // 图片，如 ![alt](url)
    /(\*\*|__)(.*?)\1/, // 粗体，如 **bold** 或 __bold__
    /\*(.*?)\*/, // 斜体，*italic*
    /(^|\s)_(.*?)_(\s|$)/, // 斜体，_italic_，需要前后有空格，或者在段首段尾，否则容易误识别。代码中常见以_为分割的变量名
    /`{1,3}[^`]+`{1,3}/, // 行内代码，如 `code`
    /^```[\s\S]*?```/, // 代码块，如 ```code```
    /^\[ \]|\[x\]/i, // 任务列表，如 [ ] 或 [x]
    /~~(.*?)~~/, // 删除线，如 ~~strikethrough~~
    /^\|(.+)\|$/ // 表格行，如 | header |
  ];

  // 按行分割字符串，检测每行是否匹配任意 Markdown 模式
  return str.split("\n").some(line =>
    markdownPatterns.some(pattern => pattern.test(line))
  );
}

export function markdownToJson(mdtext, extensions, editorConfig) {
  const md = new MarkdownIt({
    html: true, // 支持 HTML 标签，如 <br>
    linkify: true, // 自动转化url为link
    breaks: true, // 处理换行，否则不同类型间必须强制空行才能识别。因为Markdown 通常会将没有空行分隔的内容视为同一段落的一部分。
    highlight: function (str, lang) {
      // 处理一下语言的缩写
      const shortLangMap = {
        js: "javascript",
        ts: "typescript",
        py: "python",
        rb: "ruby",
        md: "markdown",
        sh: "bash",
        cs: "csharp",
        kt: "kotlin",
        rs: "rust",
        docker: "dockerfile",
        objc: "objectivec",
        coffee: "coffeescript",
        tex: "latex",
        bat: "dos",
        ps1: "powershell",
        clj: "clojure",
        cljs: "clojurescript",
        hs: "haskell",
        rkt: "racket"
      };

      if (shortLangMap[lang]) {
        lang = shortLangMap[lang];
      }

      return `<pre><code class="${lang ? "language-" + lang : ""}">${str}</code></pre>`;
    }
  });

  md.use(markdownItTaskLists); // 支持 [x] 的任务列表

  // md.block.ruler.disable("code"); // 禁止“将缩进的文本转成代码块”

  // img 外不要被 p 标签包裹
  md.renderer.rules.paragraph_open = function (tokens, idx) {
    // 如果下一个 token 是 image，则不渲染 <p> 标签
    const nextToken = tokens[idx + 1];
    if (nextToken && nextToken.type === "inline" && nextToken.children.some(child => child.type === "image")) {
      return "";
    }
    return "<p>";
  };

  md.renderer.rules.paragraph_close = function (tokens, idx) {
    // 如果前一个 token 是 image，则不渲染 </p> 标签
    const prevToken = tokens[idx - 1];
    if (prevToken && prevToken.type === "inline" && prevToken.children.some(child => child.type === "image")) {
      return "";
    }
    return "</p>";
  };

  const html = md.render(mdtext);

  // console.log(html);

  const json = generateJSON(html, extensions, {
    parseOptions: {
      preserveWhitespace: false
    }
  });

  // 处理 JSON 对象，为 h1 标题设置对齐方式（从配置读取）
  if (json && json.content) {
    // 从传入的editorConfig中获取h1的对齐方式
    let h1TextAlign = "left";

    // 如果传入了editorConfig，则从中获取h1的对齐方式
    if (editorConfig && editorConfig.heading && editorConfig.heading.h1) {
      h1TextAlign = editorConfig.heading.h1.textAlign || "left";
    }

    json.content.forEach((node) => {
      // 如果是 h1 标题，设置 textAlign 为配置中的值
      if (node.type === "heading" && node.attrs && node.attrs.level === 1) {
        node.attrs.textAlign = h1TextAlign;
      }
    });
  }

  // console.log(json);

  return json;
}
