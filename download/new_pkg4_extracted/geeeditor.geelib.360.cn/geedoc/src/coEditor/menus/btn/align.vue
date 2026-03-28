<template>
  <MenusButton
    :label="label"
    :iconName="`icon-k-align-${type}`"
    :active="editor.isActive({ textAlign: type })"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";
import { computed } from "vue";

export default {
  name: "align",
  components: { MenusButton },
  props: {
    editor: Object,
    type: String
  },
  setup(props) {
    const editor = props.editor;

    const handleClick = () => {
      if (editor.isActive("image")) { // 图片
        editor.chain().updateAttributes("image", { textAlign: props.type })
          .setNodeSelection(editor.state.selection.from)
          .focus()
          .run();
      } else { // 文本
        editor.chain().focus().setTextAlign(props.type).run();
      }
    };

    const label = computed(() => {
      const map = {
        left: "左对齐",
        center: "居中",
        right: "右对齐"
      };

      return map[props.type];
    });

    return {
      handleClick,
      label
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
