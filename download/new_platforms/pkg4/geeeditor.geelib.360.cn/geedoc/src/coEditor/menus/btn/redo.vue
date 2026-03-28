<template>
  <MenusButton
    label="重做"
    iconName="icon-k-redo"
    :disabled="!editor.can().redo()"
    isBlueActive
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "redo",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props) {
    const handleClick = () => props.editor.chain().focus().redo().run();

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
