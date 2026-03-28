<template>
  <MenusButton
    label="下划线"
    iconName="icon-k-underline"
    :active="editor.isActive('underline')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "underline",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props) {
    const handleClick = () => props.editor.chain().focus().toggleUnderline().run();
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
