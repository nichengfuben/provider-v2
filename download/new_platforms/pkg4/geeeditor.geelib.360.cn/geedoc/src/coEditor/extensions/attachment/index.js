import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import AttachmentWrapper from "./attachmentComponent.vue";
import { handleFileEvent } from "../../utils/upload.js";
const Attachment = Node.create({
  name: "attachment",
  content: "",
  marks: "",
  group: "block",
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "attachment"
      }
    };
  },

  parseHTML() {
    return [{ tag: "div[class=attachment]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addAttributes() {
    return {
      fileName: {
        default: ""
      },
      fileSize: {
        default: ""
      },
      fileType: {
        default: null
      },
      fileExt: {
        default: null
      },
      url: {
        default: null
      },
      error: {
        default: ""
      },
      accept: { // input 接受的文件类型
        default: ""
      },
      uploadProcess: { // 进度
        default: 0
      },
      // 用于避免同时上传多个附件时导致的仅一个能获取到上传状态与在文字间插入附件，无法更新上传成功状态的bug
      id: {
        default: null
      }
    };
  },

  addCommands() {
    return {
      setAttachment:
        (attrs = {}) =>
          (params) => {
            const { chain, editor } = params;
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "";
            fileInput.onchange = (e) => {
              const file = e.target.files && e.target.files[0];
              handleFileEvent({ file, editor });
            };
            setTimeout(() => {
              fileInput.click();
            }, 200);
            return chain();
          }
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(AttachmentWrapper);
  }
});

export default Attachment;
