<template>
  <MenusButton
    label="斜体"
    iconName="icon-k-italic"
    :active="editor.isActive('italic')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "italic",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props, context) {
    const handleClick = () => props.editor.chain().focus().toggleItalic().run();
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
