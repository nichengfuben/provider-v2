<template>
  <MenusButton
    label="行内代码"
    iconName="icon-k-inlinecode"
    :active="editor.isActive('code')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "inlineCode",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props) {
    const handleClick = () => {
      props.editor.chain().focus().toggleCode().run();
    };
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
