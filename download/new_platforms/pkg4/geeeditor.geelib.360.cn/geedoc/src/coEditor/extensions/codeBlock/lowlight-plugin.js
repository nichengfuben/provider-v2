// 原本 tiptap 的 extension-code-block-lowlight ，当编辑代码块时，所有代码块的装饰器都重新创建渲染，有性能问题。
// 参考 remirror 中的实现，只重新渲染变更的代码块，解决此性能问题
// 参考代码：
// tiptap https://github.com/ueberdosis/tiptap/blob/95545539efd983c0f4d815527479037d36e568bb/packages/extension-code-block-lowlight/src/lowlight-plugin.ts
// remirror https://github.com/remirror/remirror/blob/main/packages/remirror__extension-code-block/src/code-block-plugin.ts

import { findChildren } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import highlight from "highlight.js/lib/core";

import { getChangedNodes } from "./code-block-utils.js";

function parseNodes(nodes, className = []) {
  return nodes
    .map((node) => {
      const classes = [...className, ...(node.properties ? node.properties.className : [])];

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes
      };
    })
    .flat();
}

function getHighlightNodes(result) {
  // `.value` for lowlight v1, `.children` for lowlight v2
  return result.value || result.children || [];
}

function registered(aliasOrLanguage) {
  return Boolean(highlight.getLanguage(aliasOrLanguage));
}

function getDecorations({ lowlight, defaultLanguage, blocks }) {
  const decorations = [];

  blocks.forEach((block) => {
    let from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    const languages = lowlight.listLanguages();

    const nodes
      = language && (languages.includes(language) || registered(language))
        ? getHighlightNodes(lowlight.highlight(language, block.node.textContent))
        : getHighlightNodes(lowlight.highlightAuto(block.node.textContent));

    parseNodes(nodes).forEach((node) => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(" ")
        });

        decorations.push(decoration);
      }

      from = to;
    });
  });

  return decorations;
}

function isFunction(param) {
  return typeof param === "function";
}

let isComposing = false;

export function LowlightPlugin({ name, lowlight, defaultLanguage }) {
  if (!["highlight", "highlightAuto", "listLanguages"].every(api => isFunction(lowlight[api]))) {
    throw Error("You should provide an instance of lowlight to use the code-block-lowlight extension");
  }

  const lowlightPlugin = new Plugin({
    key: new PluginKey("lowlight"),

    state: {
      init: (_, { doc }) => {
        const blocks = findChildren(doc, node => node.type.name === name);
        const decorations = getDecorations({
          lowlight,
          defaultLanguage,
          blocks
        });

        return DecorationSet.create(doc, decorations);
      },
      apply: (transaction, decorationSet) => {
        if (!transaction.docChanged) {
          return decorationSet;
        }

        let newDecorationSet = decorationSet.map(transaction.mapping, transaction.doc);

        // 如果处于拼音输入状态，直接返回。解决“代码块中输入拼音时，高亮装饰器变化导致拼音内容变成正文内容的bug”
        if (isComposing) {
          return newDecorationSet;
        }

        // 只重新渲染变更的代码块
        const changedBlocks = getChangedNodes(transaction, {
          descend: true,
          predicate: node => node.type.name === name,
          StepTypes: []
        });

        if (changedBlocks.length === 0) {
          return newDecorationSet;
        }

        for (const { node, pos } of changedBlocks) {
          newDecorationSet = newDecorationSet.remove(newDecorationSet.find(pos, pos + node.nodeSize));
        }

        const decorations = getDecorations({ lowlight, defaultLanguage, blocks: changedBlocks });
        newDecorationSet = newDecorationSet.add(transaction.doc, decorations);

        return newDecorationSet;
      }
    },

    props: {
      decorations(state) {
        return lowlightPlugin.getState(state);
      },
      handleDOMEvents: {
        compositionstart() {
          isComposing = true;
          return false;
        },
        compositionend() {
          isComposing = false;
          return false;
        },
        keydown(view, event) {
          // 如果按下回车键
          if (event.key === "Enter" || event.key === "Return") {
            isComposing = false;
            return false;
          }
        }
      }
    }
  });

  return lowlightPlugin;
}
