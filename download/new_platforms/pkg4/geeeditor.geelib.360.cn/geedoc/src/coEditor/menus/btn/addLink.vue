<template>
  <MenusButton
    label="链接"
    iconName="icon-k-link"
    :active="active !== null ? active : editor.isActive('link')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";
import { useEditorStore } from "@/store/index.js";

export default {
  name: "addLink",
  components: { MenusButton },
  props: {
    editor: Object,
    active: { // 默认使用 editor.isActive，可以自己指定
      type: Boolean,
      default: null
    },
    beforeClickFunc: {
      type: Function,
      default: null
    },
    addNextLine: { // 是否为在下一行添加
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const editorStore = useEditorStore();

    const handleClick = () => {
      const editor = props.editor;

      if (props.beforeClickFunc) {
        props.beforeClickFunc();
      }

      if (editor.isActive("link")) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        editorStore.$patch({
          showLinkDialog: {
            show: true,
            addNextLine: props.addNextLine // 是否是在下一行添加模式打开弹窗
          }
        });
      }
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
