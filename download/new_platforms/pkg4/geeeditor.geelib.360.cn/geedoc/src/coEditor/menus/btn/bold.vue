<template>
  <MenusButton
    label="粗体"
    iconName="icon-k-bold"
    :active="editor.isActive('bold')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "bold",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props, context) {
    const handleClick = () => props.editor.chain().focus().toggleBold().run();
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
