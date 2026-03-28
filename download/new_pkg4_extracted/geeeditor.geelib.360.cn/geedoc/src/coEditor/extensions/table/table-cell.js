import { TableCell as BuiltInTableCell } from "@tiptap/extension-table-cell";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { getCellsInColumn, isRowSelected, isTableSelected, selectRow, selectTable, getAllCell } from "../../utils/table.js";
let nowActiveRow = [];
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const TableCell = BuiltInTableCell.extend({
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
            const cells = getCellsInColumn(0)(selection);
            if (isSafari) {
              const allCellsArr = getAllCell(selection);
              if (allCellsArr) {
                // 此处为了解决safari表格中文输入出现拼音bug与标题行输入中文异常新增列问题
                allCellsArr.forEach(({ pos }, index) => {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      const grip = document.createElement("span");
                      grip.style = "display: block;line-height:0px;";
                      grip.innerHTML = "&ZeroWidthSpace;";
                      return grip;
                    })
                  );
                });
              }
            }

            if (cells) {
              cells.forEach(({ pos }, index) => {
                if (index === 0) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      let className = "grip-table";
                      const selected = isTableSelected(selection);
                      if (selected) {
                        className += " selected";
                      }
                      const grip = document.createElement("a");
                      grip.className = className;
                      grip.addEventListener("mousedown", (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this.editor.view.dispatch(selectTable(this.editor.state.tr));
                      });
                      return grip;
                    })
                  );
                }
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const preSpanNum = cells.reduce((acc, cur, idx) => {
                      if (idx < index) {
                        acc += cur.node.attrs.rowspan;
                      }
                      return acc;
                    }, 0);

                    const curSpanNum = cells[index].node.attrs.rowspan;

                    const rowSelected = isRowSelected(preSpanNum, curSpanNum)(selection);

                    let className = "grip-row";
                    if (rowSelected) {
                      className += " selected";
                    }
                    if (index === 0) {
                      className += " first";
                    }
                    if (index === cells.length - 1) {
                      className += " last";
                    }
                    const grip = document.createElement("a");
                    grip.className = className;

                    grip.addEventListener("mousedown", (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();
                      this.editor.view.dispatch(selectRow(preSpanNum, curSpanNum)(this.editor.state.tr));
                      nowActiveRow = [preSpanNum];
                    });
                    grip.addEventListener("mouseenter", (e) => {
                      if (e.buttons === 1 && nowActiveRow.length > 0) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        nowActiveRow.push(preSpanNum);
                        const from = nowActiveRow[0] < nowActiveRow[nowActiveRow.length - 1] ? nowActiveRow[0] : nowActiveRow[nowActiveRow.length - 1];
                        const toPreSpanNum = nowActiveRow[0] < nowActiveRow[nowActiveRow.length - 1] ? nowActiveRow[nowActiveRow.length - 1] : nowActiveRow[0];
                        const spanLength = toPreSpanNum - from + 1;
                        const tr = selectRow(from, spanLength)(this.editor.state.tr);
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
    style: "min-width: 50px; padding: 4px 8px; border: 1px solid rgba(216, 224, 232, 1);" // 为了复制到outlook，能有边框
  }
});

export default TableCell;
