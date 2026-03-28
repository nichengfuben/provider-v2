// 为了解决vite的legacy打包不支持处理node_modules，导致里有hasOwn未处理，导致低版本浏览器(例如推推webview)不支持的问题
if (!Object.hasOwn) {
  Object.hasOwn = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
}

import { VueNodeViewRenderer } from "@tiptap/vue-3";
import CodeBlockComponent from "./codeBlockComponent.vue";
// @tiptap/extension-code-block-lowlight 有性能问题，故不使用，改用@tiptap/extension-code-block，然后重写 lowlightPlugin 自己实现代码高亮
import CodeBlock from "@tiptap/extension-code-block";
import { LowlightPlugin } from "./lowlight-plugin.js";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

const CodeBlock1 = CodeBlock
  .extend({
    // marks: "remark", // 支持批注
    isolating: true, // 光标放代码块内的第一个位置，删除整个代码块，而不是变成纯文本

    addOptions() {
      return {
        ...this.parent?.(),
        lowlight: {},
        defaultLanguage: null
      };
    },

    addAttributes() {
      return {
        ...this.parent?.(),
        autoWrapLine: {
          default: false
        }
      };
    },

    addNodeView() {
      return VueNodeViewRenderer(CodeBlockComponent);
    },

    addProseMirrorPlugins() {
      return [
        ...this.parent?.() || [],
        LowlightPlugin({
          name: this.name,
          lowlight: this.options.lowlight,
          defaultLanguage: this.options.defaultLanguage
        })
      ];
    }
  })
  .configure({
    lowlight
  });

export default CodeBlock1;
