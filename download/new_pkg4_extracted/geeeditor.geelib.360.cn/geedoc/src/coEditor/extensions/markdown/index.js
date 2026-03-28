import { Extension } from "@tiptap/core";
import { markdownToJson } from "./markdown.js";

const markdownExtension = Extension.create({
  name: "markdownExtension",
  addOptions() {
    return {
      extensions: []
    };
  },

  addCommands() {
    return {
      setMarkdown: (text, emitUpdate = false) => ({ commands, state, dispatch }) => {
        const { tr } = state;

        const json = markdownToJson(text, this.options.extensions);
        commands.setContent(json, emitUpdate);

        if (dispatch) {
          dispatch(tr);
        }

        return true;
      },
      insertMarkdown: (text, emitUpdate = false) => ({ commands, state, dispatch }) => {
        const { tr } = state;

        const json = markdownToJson(text, this.options.extensions);
        commands.insertContent(json, emitUpdate);

        if (dispatch) {
          dispatch(tr);
        }

        return true;
      },
      insertMarkdownAt: (pos, text, emitUpdate = false) => ({ commands, state, dispatch }) => {
        const { tr } = state;

        const json = markdownToJson(text, this.options.extensions);
        commands.insertContentAt(pos, json, emitUpdate);

        if (dispatch) {
          dispatch(tr);
        }

        return true;
      }
    };
  }
});

export default markdownExtension;
