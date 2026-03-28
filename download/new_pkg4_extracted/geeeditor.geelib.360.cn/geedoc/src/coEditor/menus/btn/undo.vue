<template>
  <MenusButton
    label="撤销"
    iconName="icon-k-undo"
    :disabled="!editor.can().undo()"
    isBlueActive
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "undo",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props) {
    const handleClick = () => props.editor.chain().focus().undo().run();

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
