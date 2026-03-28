import { findParentNode } from "@tiptap/core";
import { CellSelection, TableMap, tableNodeTypes } from "@tiptap/pm/tables";
import { Slice } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";

export const isRectSelected = rect => (selection) => {
  const map = TableMap.get(selection.$anchorCell.node(-1));
  const start = selection.$anchorCell.start(-1);
  const cells = map.cellsInRect(rect);
  const selectedCells = map.cellsInRect(
    map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start)
  );

  for (let i = 0, count = cells.length; i < count; i++) {
    if (selectedCells.indexOf(cells[i]) === -1) {
      return false;
    }
  }

  return true;
};

export const findTable = selection =>
  findParentNode(node => node.type.spec.tableRole && node.type.spec.tableRole === "table")(selection);

export const isCellSelection = (selection) => {
  return selection instanceof CellSelection;
};

export const isColumnSelected = (preSpanNum, curSpanNum) => (selection) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: preSpanNum,
      right: preSpanNum + curSpanNum,
      top: 0,
      bottom: map.height
    })(selection);
  }

  return false;
};

export const isRowSelected = (preSpanNum, curSpanNum) => (selection) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: 0,
      right: map.width,
      top: preSpanNum,
      bottom: preSpanNum + curSpanNum
    })(selection);
  }

  return false;
};

export const isTableSelected = (selection) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    return isRectSelected({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height
    })(selection);
  }

  return false;
};

export const isTableFirstRowSelected = (selection) => {
  if (isCellSelection(selection)) {
    const table = findTable(selection);
    const map = TableMap.get(table.node);
    const cells = getCellsInRow(0)(selection);
    if (selection.ranges.length === cells.length) {
      return isRectSelected({
        left: 0,
        right: map.width,
        top: 0,
        bottom: 1
      })(selection);
    }
  }

  return false;
};

export const isTableFirstColumnSelected = (selection) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1));
    const cells = getCellsInColumn(0)(selection);
    if (selection.ranges.length === cells.length) {
      return isRectSelected({
        left: 0,
        right: 1,
        top: 0,
        bottom: map.height
      })(selection);
    }
  }

  return false;
};

export const getCellsInColumn = columnIndex => (selection) => {
  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const indexes = Array.isArray(columnIndex) ? columnIndex : Array.from([columnIndex]);
    return indexes.reduce((acc, index) => {
      if (index >= 0 && index <= map.width - 1) {
        const cells = map.cellsInRect({
          left: index,
          right: index + 1,
          top: 0,
          bottom: map.height
        });
        return acc.concat(
          cells.map((nodePos) => {
            const node = table.node.nodeAt(nodePos);
            const pos = nodePos + table.start;
            return { pos, start: pos + 1, node };
          })
        );
      }
      return acc;
    }, []);
  }
};

export const getAllCell = (selection) => {
  const table = findTable(selection);
  if (table) {
    const coloumNum = TableMap.get(table.node).width;
    const cellsArr = [];
    for (let i = 0; i < coloumNum; i++) {
      cellsArr.push(...getCellsInColumn(i)(selection));
    }

    return cellsArr;
  }
};

export const getCellsInRow = rowIndex => (selection) => {
  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const indexes = Array.isArray(rowIndex) ? rowIndex : Array.from([rowIndex]);
    return indexes.reduce((acc, index) => {
      if (index >= 0 && index <= map.height - 1) {
        const cells = map.cellsInRect({
          left: 0,
          right: map.width,
          top: index,
          bottom: index + 1
        });
        return acc.concat(
          cells.map((nodePos) => {
            const node = table.node.nodeAt(nodePos);
            const pos = nodePos + table.start;
            return { pos, start: pos + 1, node };
          })
        );
      }
      return acc;
    }, []);
  }
};

export const getCellsInTable = (selection) => {
  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const cells = map.cellsInRect({
      left: 0,
      right: map.width,
      top: 0,
      bottom: map.height
    });
    return cells.map((nodePos) => {
      const node = table.node.nodeAt(nodePos);
      const pos = nodePos + table.start;
      return { pos, start: pos + 1, node };
    });
  }
};

export const findParentNodeClosestToPos = ($pos, predicate) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node
      };
    }
  }
};

export const findCellClosestToPos = ($pos) => {
  const predicate = node => node.type.spec.tableRole && /cell/i.test(node.type.spec.tableRole);
  return findParentNodeClosestToPos($pos, predicate);
};

// type: 'row' | 'column'
const select = type => (preSpanNum, curSpanNum) => (tr) => {
  const table = findTable(tr.selection);
  const isRowSelection = type === "row";
  if (table) {
    const map = TableMap.get(table.node);

    // Check if the index is valid
    const total = preSpanNum + curSpanNum;
    if (total > 0 && total <= (isRowSelection ? map.height : map.width)) {
      const left = isRowSelection ? 0 : preSpanNum;
      const top = isRowSelection ? preSpanNum : 0;
      const right = isRowSelection ? map.width : preSpanNum + curSpanNum;
      const bottom = isRowSelection ? preSpanNum + curSpanNum : map.height;

      const cellsInFirstRow = map.cellsInRect({
        left,
        top,
        right: isRowSelection ? right : left + 1,
        bottom: isRowSelection ? top + 1 : bottom
      });

      const cellsInLastRow
        = bottom - top === 1
          ? cellsInFirstRow
          : map.cellsInRect({
            left: isRowSelection ? left : right - 1,
            top: isRowSelection ? bottom - 1 : top,
            right,
            bottom
          });

      const head = table.start + cellsInFirstRow[0];
      const anchor = table.start + cellsInLastRow[cellsInLastRow.length - 1];
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      return tr.setSelection(new CellSelection($anchor, $head));
    }
  }
  return tr;
};

export const selectColumn = select("column");

export const selectRow = select("row");

export const selectTable = (tr) => {
  const table = findTable(tr.selection);
  if (table) {
    const { map } = TableMap.get(table.node);
    if (map && map.length) {
      const head = table.start + map[0];
      const anchor = table.start + map[map.length - 1];
      const $head = tr.doc.resolve(head);
      const $anchor = tr.doc.resolve(anchor);

      return tr.setSelection(new CellSelection($anchor, $head));
    }
  }
  return tr;
};

export function selectCellIsMerged(selection) {
  if (!isCellSelection(selection)) return false;

  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const start = selection.$anchorCell.start(-1);

    const selectedCells = map.cellsInRect(
      map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start)
    );

    return selectedCells.length === 1;
  }
}

// 重写表格删除逻辑
export function deleteCellSelection(
  state,
  dispatch
) {
  const sel = state.selection;
  if (!(sel instanceof CellSelection)) return false;
  if (dispatch) {
    const tr = state.tr;
    const baseContent = tableNodeTypes(state.schema).cell.createAndFill().content;
    let lastCellPos = 0;
    sel.forEachCell((cell, pos) => {
      lastCellPos = lastCellPos || pos;
      if (!cell.content.eq(baseContent))
        tr.replace(
          tr.mapping.map(pos + 1),
          tr.mapping.map(pos + cell.nodeSize - 1),
          new Slice(baseContent, 0, 0)
        );
    });
    const mappedPos = tr.mapping.map(lastCellPos); // 将节点的旧位置映射到新位置

    // 获取变动后的文档
    const doc = tr.doc;
    const resolvedPos = doc.resolve(mappedPos); // 通过新位置获取节点的新位置信息

    const posAfter = resolvedPos.pos; // 变动后节点的位置

    // 设置光标焦点到指定位置
    tr.setSelection(TextSelection.create(doc, posAfter + 2));// +2为了定位到textNode，posAfter为tableCell的pos

    dispatch(tr);
  }
  return true;
}

// 选中当前光标所在列
export function selectNowColumn(
  state,
  view
) {
  const cells = getCellsInRow(0)(state.selection);
  const selection = state.selection;
  if (!cells || !selection.$anchorCell) { // 当删除最后一列之后，会自动聚焦到表格外，因此此处是undefined
    return;
  }
  const map = TableMap.get(selection.$anchorCell.node(-1));
  const tablePos = cells[0].pos - map.map[0];
  const nowCell = findCellClosestToPos(selection.$anchor);
  const nowCellInMapPos = nowCell.pos - tablePos;
  const nowCellInMapIndex = map.map.findIndex(c => c === nowCellInMapPos);
  const nowHeadCellPos = map.map[nowCellInMapIndex % map.width] + tablePos;

  const preSpanNum = cells.reduce((acc, cur) => {
    if (nowHeadCellPos > cur.pos) {
      acc += cur.node.attrs.colspan;
    }
    return acc;
  }, 0);
  const curSpanNum = nowCell.node.attrs.colspan;
  view.dispatch(selectColumn(preSpanNum, curSpanNum)(state.tr));
}

// 选中当前光标所在行
export function selectNowRow(
  state,
  view
) {
  const cells = getCellsInColumn(0)(state.selection);
  if (!cells) return;// 当删除最后一列之后，会自动聚焦到表格外，因此此处是undefined
  const nowCell = findCellClosestToPos(state.selection.$anchor);
  const preSpanNum = cells.reduce((acc, cur) => {
    if (nowCell.pos > cur.pos) {
      acc += cur.node.attrs.rowspan;
    }
    return acc;
  }, 0);
  const curSpanNum = nowCell.node.attrs.rowspan;
  view.dispatch(selectRow(preSpanNum, curSpanNum)(state.tr));
}
