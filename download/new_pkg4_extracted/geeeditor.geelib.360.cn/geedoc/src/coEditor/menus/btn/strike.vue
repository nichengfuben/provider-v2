<template>
  <MenusButton
    label="删除线"
    iconName="icon-k-strike"
    :active="editor.isActive('strike')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "strikeBtn",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props, context) {
    const handleClick = () => props.editor.chain().focus().toggleStrike().run();
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
