import { TableHeader as BuiltInTableHeader } from "@tiptap/extension-table-header";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { getCellsInRow, isColumnSelected, selectColumn } from "../../utils/table.js";
let nowActiveCol = [];
const TableHeader = BuiltInTableHeader.extend({
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: [150],
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;

          return value;
        }
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, "");
        },
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};

          return {
            style: `background-color: ${attributes.backgroundColor}`
          };
        }
      },
      verticalAlign: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.verticalAlign) return {};

          return {
            style: `vertical-align: ${attributes.verticalAlign}`
          };
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const isEditable = this.editor.isEditable;
            if (!isEditable) {
              return DecorationSet.empty;
            }

            const { doc, selection } = state;
            const decorations = [];
            const cells = getCellsInRow(0)(selection);

            if (cells) {
              cells.forEach(({ pos }, index) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const preSpanNum = cells.reduce((acc, cur, idx) => {
                      if (idx < index) {
                        acc += cur.node.attrs.colspan;
                      }
                      return acc;
                    }, 0);

                    const curSpanNum = cells[index].node.attrs.colspan;

                    const colSelected = isColumnSelected(preSpanNum, curSpanNum)(selection);

                    let className = "grip-column";
                    if (colSelected) {
                      className += " selected";
                    }
                    if (index === 0) {
                      className += " first";
                    } else if (index === cells.length - 1) {
                      className += " last";
                    }
                    const grip = document.createElement("a");
                    grip.className = className;

                    grip.addEventListener("mousedown", (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();

                      this.editor.view.dispatch(selectColumn(preSpanNum, curSpanNum)(this.editor.state.tr));
                      nowActiveCol = [preSpanNum];
                    });
                    grip.addEventListener("mouseenter", (e) => {
                      if (e.buttons === 1 && nowActiveCol.length > 0) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        if (nowActiveCol.length === 0 || nowActiveCol[nowActiveCol.length - 1] === preSpanNum) { // 防止无效调用
                          return;
                        }
                        nowActiveCol.push(preSpanNum);
                        const from = nowActiveCol[0] < nowActiveCol[nowActiveCol.length - 1] ? nowActiveCol[0] : nowActiveCol[nowActiveCol.length - 1];// 谁小取谁
                        const toPreSpanNum = nowActiveCol[0] < nowActiveCol[nowActiveCol.length - 1] ? nowActiveCol[nowActiveCol.length - 1] : nowActiveCol[0];// 谁大取谁
                        // from到to一共有多少span
                        const spanLength = toPreSpanNum - from + 1;
                        const tr = selectColumn(from, spanLength)(this.editor.state.tr);
                        this.editor.view.dispatch(tr);
                      }
                    });
                    return grip;
                  })
                );
              });
            }

            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  }
}).configure({
  HTMLAttributes: { // 复制或者导出html时，会带上 HTMLAttributes
    style: "min-width: 50px; padding: 4px 8px; border: 1px solid rgba(46, 50, 56, 0.13);" // 为了复制到outlook，能有边框
  }
});

export default TableHeader;
