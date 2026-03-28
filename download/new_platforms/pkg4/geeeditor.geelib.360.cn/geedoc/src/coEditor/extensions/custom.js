import { Extension } from "@tiptap/core";
import { AllSelection } from "@tiptap/pm/state";

const Custom = Extension.create({
  name: "customExtension",

  addKeyboardShortcuts() {
    return {
      // 复写tiptap的selectAll快捷键，它是从1开始，而不是0，V2.11.版本修复了，但是现在还未升级到该版本
      "Mod-a": ({ editor }) => {
        const state = editor.state;
        const view = editor.view;

        const tr = state.tr.setSelection(new AllSelection(state.doc));
        view.dispatch(tr);

        return true;
      }
    };
  }
});

export default Custom;
