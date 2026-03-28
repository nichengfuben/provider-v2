<template>
  <bubble-menu
    :editor="editor"
    :shouldShow="shouldShow"
    :tippyOptions="{ zIndex: 3000, maxWidth: 550, appendTo: () => bodyElement }">
    <div class="btnlist">
      <div class="link">{{ editor.getAttributes('link').href }}</div>
      <div class="btnGroup">
        <el-button type="primary" link @click="handleOpenLink">打开</el-button>
        <el-button type="primary" link @click="changeLink">修改</el-button>
        <el-button type="primary" link @click="handleCancelLink">取消链接</el-button>
        <el-button type="primary" link v-copy="editor.getAttributes('link').href" >复制链接</el-button>
      </div>

    </div>
  </bubble-menu>
</template>

<script>
import { ref } from "vue";
import { BubbleMenu } from "@tiptap/vue-3";
import { isActive } from "@tiptap/core";
import { useEditorStore } from "@/store/index.js";

export default {
  name: "textMenus",
  props: {
    editor: Object
  },
  components: {
    BubbleMenu
  },
  setup(props, context) {
    const bodyElement = ref(document.querySelector("body"));
    const editorStore = useEditorStore();
    function shouldShow({ state }) {
      return state.selection.from === state.selection.to && isActive(state, "link");// from与to相等是为了避免在表格中选中单元格激活该悬浮菜单
    }

    const handleOpenLink = () => {
      const href = props.editor.getAttributes("link").href;
      window.open(href, "_blank");
    };

    const handleCancelLink = () => {
      if (props.editor.isActive("link")) {
        props.editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }
    };

    const changeLink = () => {
      const nowText = props.editor.state.doc.nodeAt(props.editor.state.selection.anchor).textContent;
      const nowHerf = props.editor.getAttributes("link").href;

      editorStore.$patch({ showLinkDialog: { show: true, addNextLine: false,
        attr: {
          text: nowText,
          href: nowHerf
        } } });
    };

    return {
      shouldShow,
      handleOpenLink,
      handleCancelLink,
      bodyElement,
      changeLink
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
  .btnGroup{
    display: flex;
  }
}

.link {
  word-break: break-all;
  margin-right: 10px;
}
</style>
