<template>
  <MenusButton
    label="代码块"
    iconName="icon-k-codeblock"
    :active="active !== null ? active : editor.isActive('codeBlock')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "codeBlock",
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
    }

  },
  setup(props, context) {
    const handleClick = () => {
      if (props.beforeClickFunc) {
        props.beforeClickFunc();
      }
      props.editor.chain().focus().toggleCodeBlock().run();
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
