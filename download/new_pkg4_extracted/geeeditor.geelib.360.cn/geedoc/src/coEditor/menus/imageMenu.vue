<template>
  <bubble-menu
    :editor="editor"
    :shouldShow="shouldShow"
    :tippyOptions="{ zIndex: 3000, getReferenceClientRect, appendTo: () => bodyElement }"
>
    <div class="btnlist">
      <align :editor="editor" type="left"></align>
      <align :editor="editor" type="center"></align>
      <align :editor="editor" type="right"></align>
    </div>
  </bubble-menu>
</template>

<script>
import { ref } from "vue";
import { BubbleMenu } from "@tiptap/vue-3";
import align from "./btn/align.vue";
import { getCurrentNode } from "../utils/node.js";
import { isActive, getAttributes } from "@tiptap/core";

export default {
  name: "imageMenu",
  props: {
    editor: Object
  },
  components: {
    BubbleMenu,
    align
  },
  setup(props) {
    const bodyElement = ref(document.querySelector("body"));

    function shouldShow({ state }) {
      // 如果在表格内选中父单元格isActive(state, "image")也为true，!state.selection.$anchorCell 用于判断当前是不是选中单元格
      return !state.selection.$anchorCell && isActive(state, "image") && !!getAttributes(state, "image").src;
    }

    const getReferenceClientRect = () => {
      const view = props.editor.view;
      const node = getCurrentNode(view);

      const inner = node.querySelector(".preview img");
      const dom = inner || node;

      return dom?.getBoundingClientRect();
    };

    return {
      shouldShow,
      getReferenceClientRect,
      bodyElement
    };
  }
};
</script>

<style lang="scss" scoped>
.btnlist {
  background-color: #fff;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid $gray-2;
  box-shadow: $shadow-4-down;
}
</style>
