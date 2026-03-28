export function getCurrentNode(view) {
  const { state } = view;
  const { selection } = state;
  const { ranges } = selection;
  const from = Math.min(...ranges.map(range => range.$from.pos));
  const domAtPos = view.domAtPos(from).node;
  const nodeDOM = view.nodeDOM(from);
  const node = nodeDOM || domAtPos;
  return node;
}

export function getNodeAtPos(state, pos) {
  const $head = state.doc.resolve(pos);
  let node = null;

  for (let d = $head.depth; d > 0; d--) {
    node = $head.node(d);
  }

  return node;
}

export const isNodeEmpty = (node) => {
  if (node.isAtom && !node.isTextblock) return false;

  return node.type.name === "paragraph" && node.nodeSize === 2;
};

const nodeIsNotBlock = node => !node.type.isBlock;

const nodeIsFirstChild = (pos) => {
  let parent = pos.parent;
  const node = pos.node();

  if (parent === node) {
    parent = pos.node(pos.depth - 1);
  }
  if (!parent || parent.type.name === "doc") return false;

  return parent.firstChild === node;
};

const getDOMByPos = (
  view,
  root,
  $pos
) => {
  const { node } = view.domAtPos($pos.pos);

  let el = node;
  let parent = el.parentElement;
  while (parent && parent !== root && $pos.pos === view.posAtDOM(parent, 0)) {
    el = parent;
    parent = parent.parentElement;
  }

  return el;
};

export const selectRootNodeByDom = (
  dom,
  view
) => {
  const root = view.dom.parentElement;

  if (!root) return null;

  const pos = view.posAtDOM(dom, 0);
  /**
   * img attachment 等空内容的节点修正
   */
  const nodeRoot = findParent(dom, (el) => {
    const classStr = el.className;

    const classList = [
      "node-attachment",
      "node-image",
      "node-flowChart",
      "node-iframe",
      "node-insertYun",
      "node-dynamic"
    ];
    return classList.includes(classStr);
  });

  if (pos <= 0 && !nodeRoot) return null;

  let $pos = view.state.doc.resolve(pos);
  let node = $pos.node();

  /**
   * 自定义节点修正
   */
  if (node.type.name === "doc") {
    const nodeAtPos = view.state.doc.nodeAt(pos);

    if (
      nodeAtPos
      && nodeAtPos.type.name !== "doc"
      && nodeAtPos.type.name !== "text"
    ) {
      node = nodeAtPos;
      $pos = view.state.doc.resolve(pos);
      const el = view.nodeDOM(pos);
      return { node, $pos, el, offset: 0, pos };
    }
  }
  const judgement = (node, $pos) => {
    if (!node) {
      return false;
    }
    if (nodeIsNotBlock(node)) {
      return true;// 继续循环
    }
    if ($pos.node(1).type.name === "table") { // 如果在表格内部
      const allowType = ["tableHeader", "tableCell", "table"];
      const curNodeName = $pos.node().type.name;
      return !(allowType.includes(curNodeName) && !nodeIsFirstChild($pos));// 不是第一子节点且是表格类标签则跳出循环，否则继续循环
    }
    return nodeIsFirstChild($pos);
  };
  while (judgement(node, $pos)) {
    $pos = view.state.doc.resolve($pos.before());
    node = $pos.node();
  }

  if (node.type.name.includes("table")) {
    while (node.type.name !== "table") {
      $pos = view.state.doc.resolve($pos.before());
      node = $pos.node();
    }
  }

  if (node.type.name.includes("listItem")) {
    while (!["orderedList", "bulletList"].includes(node.type.name)) {
      $pos = view.state.doc.resolve($pos.before());
      node = $pos.node();
    }
  }

  if (node.type.name.includes("taskItem")) {
    while (node.type.name !== "taskList") {
      $pos = view.state.doc.resolve($pos.before());
      node = $pos.node();
    }
  }

  $pos = view.state.doc.resolve($pos.pos - $pos.parentOffset);
  const el = getDOMByPos(view, root, $pos);

  return { node, $pos, el, offset: 1, pos };
};

function findParent(dom, func) {
  const parent = dom.parentElement;
  if (!parent || parent?.className?.includes?.("ProseMirror")) {
    return false;
  }

  if (func(parent)) {
    return parent;
  }

  return findParent(parent, func);
}

// export function findRootNodeDom(dom) {
//   const parent = dom.parentElement;
//   if (!parent) return null;

//   if (parent.className.includes("ProseMirror")) {
//     return dom;
//   }

//   return findRootNodeDom(parent);
// }
