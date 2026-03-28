import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { Image as BuiltInImage } from "@tiptap/extension-image";
import imageComponent from "./imageComponent.vue";
import { handleFileEvent } from "../../utils/upload.js";
const resolveImageEl = element => (element.nodeName === "IMG" ? element : element.querySelector("img"));

const Image = BuiltInImage.extend({
  allowGapCursor: false,

  draggable: false,
  atom: true,

  addOptions() {
    return {
      ...this.parent?.()
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          const img = resolveImageEl(element);
          return img.getAttribute("src") || img.dataset.src;
        }
      },
      alt: {
        default: null,
        parseHTML: (element) => {
          const img = resolveImageEl(element);
          return img.getAttribute("alt");
        }
      },
      width: {
        default: "auto",
        parseHTML: (element) => {
          const img = resolveImageEl(element);
          return img.getAttribute("width") || img.dataset.width;
        }
      },
      height: {
        default: "auto",
        parseHTML: (element) => {
          const img = resolveImageEl(element);
          return img.getAttribute("height") || img.dataset.height;
        }
      },
      textAlign: {
        default: "left"
      },
      hasTriggerUpdateUrl: { // 防止第三方失效图片反复调用转存接口
        default: false
      },
      fileName: {
        default: ""
      },
      error: {
        default: undefined
      },
      id: {
        default: undefined
      }
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setEmptyImage:
        (attrs = {}) =>
          (params) => {
            const { chain, editor } = params;
            // 加个延时，不然在表格里插入时，报错
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.onchange = function () {
              const file = fileInput.files[0];
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
    return VueNodeViewRenderer(imageComponent);
  }
}).configure({
  allowBase64: true
});

export default Image;
