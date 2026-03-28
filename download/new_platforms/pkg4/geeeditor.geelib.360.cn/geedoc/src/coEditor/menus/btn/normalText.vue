<template>
  <MenusButton
    label="正文"
    iconName="icon-k-text"
    :active="active !== null ? active : editor.isActive('paragraph')"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "normalText",
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
      if (props.editor.isActive("paragraph")) { // 为解决当前是任务、有序、无序列表时，左侧悬浮菜单选择正文无反应的问题
        if (props.editor.isActive("taskItem")) {
          props.editor.chain().focus().toggleTaskList().run();// 取消任务列表
        } else if (props.editor.isActive("orderedList") && props.editor.isActive("listItem")) {
          props.editor.chain().focus().toggleOrderedList().run();// 取消有序列表
        } else if (props.editor.isActive("bulletList") && props.editor.isActive("listItem")) {
          props.editor.chain().focus().toggleBulletList().run();// 取消无序列表
        }
      } else {
        props.editor.chain().focus().setParagraph().run();
      }
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
