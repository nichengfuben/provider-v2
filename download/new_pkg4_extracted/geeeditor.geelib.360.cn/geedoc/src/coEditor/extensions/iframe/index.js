import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import iframeComponent from "./iframeComponent.vue";

const Iframe = Node.create({
  name: "iframe",
  content: "",
  marks: "",
  group: "block",
  selectable: true,
  atom: true,
  draggable: false,
  resizable: true,

  addOptions() {
    return {
    };
  },

  addAttributes() {
    return {
      width: {
        default: "100%"
      },
      height: {
        default: 400
      },
      url: {
        default: null
      },
      srcdoc: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ];
  },

  addCommands() {
    return {
      setIframe: attrs => ({ chain }) => {
        if (!attrs.url && !attrs.srcdoc) return;

        const iframeAttrs = {};
        if (attrs.url) iframeAttrs.url = attrs.url;
        if (attrs.srcdoc) iframeAttrs.srcdoc = attrs.srcdoc;
        if (attrs.width) iframeAttrs.width = attrs.width;
        if (attrs.height) iframeAttrs.height = attrs.height;

        return chain().insertContent({
          type: attrs.type || this.name, // 默认是 iframe, 也可以是是 figma 等特别的类型
          attrs: iframeAttrs
        }).run();
      }
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(iframeComponent);
  }
});

export default Iframe;
