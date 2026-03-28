<template>
  <MenusButton
    label="有序列表"
    iconName="icon-k-orderedlist"
    :active="active !== null ? active : editor.isActive('orderedList')"
    @btn-click="toggleOrderedList"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "orderedList",
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
    const toggleOrderedList = () => {
      if (props.beforeClickFunc) {
        props.beforeClickFunc();
      }
      props.editor.chain().focus().toggleOrderedList().run();
    };

    return {
      toggleOrderedList
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
