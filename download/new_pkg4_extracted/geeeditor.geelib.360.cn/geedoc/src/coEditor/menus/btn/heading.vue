<template>
  <MenusButton
    :label="label"
    :iconName="`icon-k-H${level}`"
    :active="active !== null ? active : editor.isActive('heading', { level: level })"
    @btn-click="handleClick"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";
import { computed } from "vue";

export default {
  name: "heading",
  components: { MenusButton },
  props: {
    editor: Object,
    level: Number,
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
      props.editor.chain().focus().toggleHeading({ level: props.level }).run();
    };

    const label = computed(() => {
      const map = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六"
      };

      return map[props.level] + "级标题";
    });

    return {
      handleClick,
      label
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
