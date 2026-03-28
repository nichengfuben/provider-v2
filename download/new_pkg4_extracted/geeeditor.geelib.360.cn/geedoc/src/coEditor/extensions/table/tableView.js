import { updateColumnsOnResize } from "@tiptap/pm/tables";
import ScrollTool from "./canvasStickyScroll.js";
import { isTableSelected } from "../../utils/table.js";
import PubSub from "pubsub-js";
import { useEditorStore } from "@/store/index.js";
import { debounce } from "lodash-es";

class TableView {
  constructor(node, cellMinWidth, editor) {
    // 是否使用批注
    // const editorStore = useEditorStore().extensionConfig.remark.show;

    // 禁用粘滞滚动条
    this.disableStickyScroll = useEditorStore().extensionConfig.table.disableStickyScroll;

    this.editor = editor;
    this.node = node;
    this.cellMinWidth = cellMinWidth;
    this.dom = document.createElement("div");
    this.dom.className = "node-table";
    // 监听editorWrap的宽度改变表格的宽度

    // const morePlace = editorStore ? 65 : 25; // 表格最右侧需要增加空白宽度一遍最后一格容易拖拽，该值不得小于25，因为在编辑模式会有小工具的宽度。并且给右侧批注竖条留30px
    const morePlace = 65; // 表格最右侧需要增加空白宽度一遍最后一格容易拖拽
    const _this = this;
    const changeEditorWrapDom = debounce(function (entries) {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        // 由于有小数点，而赋值时style.width自动保留后两位，如果不加这个会疯狂反复调用observer
        // 10px是因为编辑模式时左侧有小工具占位，如果不减去会导致表格右侧露出不全
        if (Math.abs(parseInt(_this.dom.style.width) + morePlace - parseInt(newWidth)) > 1) { // 小于1是因为parseInt取整可能会有1的偏差
          _this.dom.style.width = newWidth - morePlace + "px";// -fileContentPaddingRight像素为了露出表格最后一行，否则会遮挡
          !_this.disableStickyScroll && _this.updateScrollTool(_this.dom, _this.scrollWrapperDom, "observer");
        }
      }
    }, 300);
    this.PubSubToken = PubSub.subscribe("editorWrapDomObserverChange", (_, entries) => {
      changeEditorWrapDom(entries);
    });
    // 10px是因为编辑模式时左侧有小工具占位，如果不减去会导致表格右侧露出不全
    this.dom.style.width = document.querySelector(".component-editor-right").clientWidth - morePlace + "px";
    this.scrollWrapperDom = document.createElement("div");
    this.scrollWrapperDom.className = "scrollWrapper";
    if (this.disableStickyScroll) {
      this.scrollWrapperDom.style.overflow = "auto";
      this.scrollWrapperDom.style.paddingLeft = "15px";
      this.scrollWrapperDom.style.paddingTop = "0px";
    }
    this.dom.appendChild(this.scrollWrapperDom);
    this.tableBorderWrap = document.createElement("div");
    this.tableBorderWrap.className = "sellectAllTable"; // 这个dom完全就是为了增加全选时的外边框
    this.table = this.tableBorderWrap.appendChild(document.createElement("table"));
    this.scrollWrapperDom.appendChild(this.tableBorderWrap);
    this.colgroup = this.table.appendChild(document.createElement("colgroup"));
    updateColumnsOnResize(node, this.colgroup, this.table, cellMinWidth);
    this.contentDOM = this.table.appendChild(document.createElement("tbody"));

    // 为了防止变量作用域污染，采用函数封装的形式，注意不能提到constructor外，那样还会有污染
    const toolObj = ScrollTool();
    const initScrollTool = toolObj.initScrollTool;
    this.updateScrollTool = toolObj.updateScrollTool;
    !this.disableStickyScroll && initScrollTool(this.scrollWrapperDom, this.dom, editor);
  }

  update(node) {
    if (node.type !== this.node.type) {
      return false;
    }
    // 表格全选的外边框
    if (isTableSelected(this.editor.state.selection)) {
      this.tableBorderWrap.style.borderColor = "#3364FF";
    } else {
      this.tableBorderWrap.style.borderColor = "transparent";
    }
    this.tableBorderWrap.style.width = this.table.style.width;
    this.node = node;
    updateColumnsOnResize(node, this.colgroup, this.table, this.cellMinWidth);
    !this.disableStickyScroll && this.updateScrollTool(this.dom, this.scrollWrapperDom);
    return true;
  }

  destroy() {
    this.dom.onwheel = null;// 释放触控板左右事件
    PubSub.unsubscribe(this.PubSubToken);
  }

  ignoreMutation(mutation = { type: "selection", target: undefined }) {
    return (
      mutation.type === "attributes"
      && (mutation.target === this.table || this.colgroup.contains(mutation.target))
    );
  }
}

export default TableView;
