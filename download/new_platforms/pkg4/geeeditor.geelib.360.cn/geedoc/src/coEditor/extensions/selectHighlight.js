import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const selectHighlight = Extension.create({
  name: "selectHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("selectHighlight"),
        state: {
          init: () => ({
            decorations: DecorationSet.empty,
            active: false
          }),
          apply(tr, pluginState) {
            const meta = tr.getMeta("selectHighlight");
            if (meta) {
              const { from, to } = tr.selection;

              if (from !== to) {
                const decorations = [
                  Decoration.inline(from, to, { class: "select-highlight" })
                ];

                return {
                  decorations: DecorationSet.create(tr.doc, decorations),
                  active: true
                };
              }
            } else if (meta === false) {
              return {
                decorations: DecorationSet.empty,
                active: false
              };
            }

            // 映射装饰位置（用于文档变更时）
            return {
              ...pluginState,
              decorations: pluginState.decorations.map(tr.mapping, tr.doc)
            };
          }
        },
        props: {
          decorations(state) {
            return this.getState(state).decorations;
          }
        }
      })
    ];
  }
});

export default selectHighlight;
