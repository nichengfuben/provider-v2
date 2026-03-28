import BuiltInTable from "@tiptap/extension-table";
import { Plugin, AllSelection, TextSelection } from "@tiptap/pm/state";
import { selectTable, isTableSelected, isCellSelection, findCellClosestToPos, deleteCellSelection } from "../../utils/table.js";
import { columnResizing, tableEditing, goToNextCell, CellSelection } from "@tiptap/pm/tables";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import tableView from "./tableView.js";

import { nextTick } from "vue";

const selectAll = (view) => { // 不能使用tiptap自带的，当表格在第一行时会有bug
  const tr = view.state.tr.setSelection(new AllSelection(view.state.doc));
  view.dispatch(tr);
};
// 寻找当前光标的上一个节点
const findPreNodeObj = (pos, view) => {
  const nowIndex = --pos;// 当前位置
  let nodeObj = view.state.doc.nodeAt(nowIndex);
  // 采用遍历的方式往前找
  if (!nodeObj) {
    nodeObj = findPreNodeObj(nowIndex, view).node;
  }
  return {
    node: nodeObj,
    pos: nowIndex
  };
};

const isStopFromKey = (event) => {
  return event.key !== "Backspace" && !event.metaKey && !event.ctrlKey && event.key.indexOf("Arrow") !== 0;
};
let editor, customPlugin;
const keydownEvent = (event) => {
  if (editor.isEditable && customPlugin.getState(editor.view.state).isCellSelectionNow && isStopFromKey(event)) {
    event.preventDefault();
  }
};

const Table = BuiltInTable.extend({
  onDestroy() {
    document.removeEventListener("keydown", keydownEvent, true);
  },
  addProseMirrorPlugins() {
    editor = this.editor;

    const isResizable = this.options.resizable;
    customPlugin = new Plugin({
      state: {
        init() {
          return ({
            isCellSelectionNow: false
          });
        },
        apply(tr, value, oldState, newState) {
          const isCellSelectionBefore = oldState.selection instanceof CellSelection;
          const isCellSelectionNow = newState.selection instanceof CellSelection;
          // 在选中单元格时注册键盘阻拦事件，取消时解绑
          if (!isCellSelectionBefore && isCellSelectionNow) {
            document.addEventListener("keydown", keydownEvent, true);
          } else if (!isCellSelectionNow && isCellSelectionBefore) {
            document.removeEventListener("keydown", keydownEvent, true);
          }
          return {
            isCellSelectionNow
          };
        }
      },
      props: {
        decorations: (state) => {
          const isCellSelectionNow = state.selection instanceof CellSelection;

          if (editor.isEditable && isCellSelectionNow) {
            const tableNode = state.selection.$anchor.node(1);
            if (tableNode?.type?.name !== "table") {
              return DecorationSet.empty;
            }
            const tableNodePos = state.selection.$anchor.posAtIndex(0, 1) - 1;
            const newDes = [Decoration.node(tableNodePos, tableNodePos + tableNode.nodeSize, { contenteditable: String(editor.isEditable && !isCellSelectionNow) })];
            return DecorationSet.create(state.doc, newDes);
          } else {
            return DecorationSet.empty;
          }
        },
        handleKeyDown: (view, event) => {
          const isMac = /Mac/.test(navigator.platform);
          if ((isMac ? event.metaKey : event.ctrlKey) && event.code === "KeyA") {
            if (!editor.isActive("table")) { // 表格外
              selectAll(view);
              return true;// 阻塞默认行为
            } else { // 表格内的话选中当前单元格
              const selection = view.state.selection;
              if (isTableSelected(view.state.selection)) {
                // 判断当前是否选中全表，如果是的话就选全文
                selectAll(view);
              } else if (isCellSelection(view.state.selection)) {
                // 判断当前是否选中了单元格，如果是则选中全表
                editor.view.dispatch(selectTable(editor.state.tr));// 选中全表
              } else {
                const fatherPosCustomObj = findCellClosestToPos(selection.$anchor);
                editor.commands.setNodeSelection(fatherPosCustomObj.pos);
              }
              return true;// 阻塞默认行为
            }
          }
          // 在删除块级元素的时候光标会回退的问题
          if (event.code === "Backspace" && editor.isActive("table")) {
            const anchor = view.state.selection.anchor;
            const currentNode = view.state.doc.nodeAt(anchor);
            if (currentNode?.isAtom && currentNode?.isBlock) {
              nextTick(() => {
                // 前进一位
                goToNextCell(-1)(editor.state, editor.view.dispatch);
              });
            } else if (isCellSelection(view.state.selection)) {
              return deleteCellSelection(view.state, view.dispatch);
            }
          }
        },
        handleClickOn: (view, pos, node, nodePos, event, direct) => {
          // 此处的作用是为了点击表格内的图片网页文件等块级元素的上下左右能够新增一行或者聚焦到单元格内最近的一行
          const isEditable = editor.isEditable;
          if (!isEditable || node.type.name !== "tableCell" || !direct) {
            return;
          }
          // 如果上一个节点是段落则聚焦到该段落，没有的话则创建。
          const curNode = view.state.doc.nodeAt(pos);
          if (curNode && (!curNode.isAtom || !curNode.isBlock)) { // 只处理纯块级元素，图片文件网页等，list、表格、段落不管
            return;
          }
          const preNode = findPreNodeObj(pos, view);
          const posObj = view.state.doc.resolve(preNode.node.type.name === "paragraph" ? preNode.pos : pos);
          const transaction = view.state.tr.setSelection(new TextSelection(posObj));
          view.dispatch(transaction);
          view.focus();
          if (preNode.node.type.name !== "paragraph") {
            editor.chain().focus().insertContent(
              "<p></p>"
            ).run();
          }
        },
        clipboardTextSerializer(content, view) {
          // 解决tiptap复制表格时text剪贴板异常复制其他列的问题
          if (isCellSelection(view.state.selection)) {
            const contentArray = content.content.content;
            let result = "";
            contentArray.forEach((tableRow) => {
              const cellArr = tableRow.content.content;
              cellArr.forEach((cell, cellIndex) => {
                result = `${result}    ${cell.textContent} ${cellIndex === cellArr.length - 1 ? " \n" : ""}`;
              });
            });
            return result;
          }
        }
      }
    });

    return [
      customPlugin,
      ...(isResizable
        ? [
            columnResizing({
              handleWidth: this.options.handleWidth,
              cellMinWidth: this.options.cellMinWidth,
              View: this.options.View,
              lastColumnResizable: this.options.lastColumnResizable
            })
          ]
        : []),
      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection
      })
    ];
  }
}).configure({
  HTMLAttributes: { // 复制或者导出html时，会带上 HTMLAttributes
    border: "1",
    style: "table-layout: fixed; border-collapse: collapse; border: 1px solid #d9d9d9;" // 为了复制到outlook，能有边框
  },
  resizable: true,
  View: tableView,
  cellMinWidth: 50
});

export default Table;
