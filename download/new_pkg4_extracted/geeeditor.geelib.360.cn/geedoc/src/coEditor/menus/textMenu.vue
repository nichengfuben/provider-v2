<template>
  <bubble-menu
    :editor="editor"
    :shouldShow="shouldShow"
    :tippyOptions="{ zIndex: 3000, maxWidth: 'none', appendTo: () => bodyElement }">
    <div class="btnlist">
      <AI :editor="editor" isSelection v-if="AIIsEnabled"></AI>
      <textGroup :editor="editor"></textGroup>
      <alignGroup :editor="editor"></alignGroup>

      <el-divider direction="vertical" />

      <bold :editor="editor"></bold>
      <italic :editor="editor"></italic>
      <underline :editor="editor"></underline>
      <strikeBtn :editor="editor"></strikeBtn>
      <!-- <textColorGroup :editor="editor"></textColorGroup>
      <backgroundColorGroup :editor="editor"></backgroundColorGroup> -->

      <el-divider direction="vertical" />

      <inlineCode :editor="editor"></inlineCode>
      <addLink :editor="editor"></addLink>
      <!-- <customAnchor :editor="editor"></customAnchor> -->
      <!-- <taskList :editor="editor"></taskList> -->

      <!-- <el-divider direction="vertical" v-if="remarkIsEnabled"/> -->

      <!-- <remark :editor="editor" v-if="remarkIsEnabled"></remark> -->
    </div>
  </bubble-menu>
</template>

<script>
import { ref, computed } from "vue";
import { BubbleMenu } from "@tiptap/vue-3";
import { isActive } from "@tiptap/core";
import { useEditorStore } from "@/store/index.js";
import AI from "./btn/AI.vue";
import textGroup from "./btn/textGroup.vue";
import alignGroup from "./btn/alignGroup.vue";
import bold from "./btn/bold.vue";
import italic from "./btn/italic.vue";
import underline from "./btn/underline.vue";
import strikeBtn from "./btn/strike.vue";
import addLink from "./btn/addLink.vue";
// import customAnchor from "./btn/customAnchor.vue";
// import textColorGroup from "./btn/textColorGroup.vue";
// import backgroundColorGroup from "./btn/backgroundColorGroup.vue";
import inlineCode from "./btn/inlineCode.vue";
// import taskList from "./btn/taskList.vue";
// import remark from "./btn/remark.vue";

export default {
  name: "textMenus",
  props: {
    editor: Object
  },
  components: {
    BubbleMenu,
    AI,
    textGroup,
    alignGroup,
    bold,
    italic,
    underline,
    strikeBtn,
    // textColorGroup,
    // backgroundColorGroup,
    inlineCode,
    addLink
    // taskList,
    // customAnchor,
    // remark
  },
  setup() {
    const bodyElement = ref(document.querySelector("body"));
    const editorStore = useEditorStore();

    const AIIsEnabled = editorStore.extensionIsEnabled("AI");
    const remarkIsEnabled = editorStore.extensionIsEnabled("remark");

    function shouldShow({ state }) {
      if (!state || state.selection.empty) return false;
      if (isActive(state, "link")) return false;

      const fromPos = state.selection.from;
      const currentNode = state.doc.nodeAt(fromPos);
      return currentNode?.type.name === "text";
    }

    return {
      shouldShow,
      bodyElement,
      AIIsEnabled,
      remarkIsEnabled
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

  display: flex;
  align-items: center;
}
</style>
