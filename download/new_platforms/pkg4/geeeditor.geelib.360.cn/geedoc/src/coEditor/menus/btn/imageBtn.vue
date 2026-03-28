<template>
  <MenusButton
    label="图片"
    iconName="icon-k-picture"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "imageBtn",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props, context) {
    const handleClick = () => props.editor.chain().focus().insertContent("<p></p>").setEmptyImage({ width: "100%" }).run();
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
