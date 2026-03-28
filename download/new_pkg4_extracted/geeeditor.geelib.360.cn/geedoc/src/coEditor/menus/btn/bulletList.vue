<template>
  <MenusButton
    label="无序列表"
    iconName="icon-k-unorderedlist"
    :active="active !== null ? active : editor.isActive('bulletList')"
    @btn-click="toggleBulletList"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "bulletList",
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
    const toggleBulletList = () => {
      if (props.beforeClickFunc) {
        props.beforeClickFunc();
      }
      props.editor.chain().focus().toggleBulletList().run();
    };

    return {
      toggleBulletList
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
