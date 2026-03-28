<template>
  <subMenusButton
    iconName="icon-k-align"
  >
    <align :editor="editor" type="left"></align>
    <align :editor="editor" type="center"></align>
    <align :editor="editor" type="right"></align>
  </subMenusButton>

</template>

<script>
import subMenusButton from "../subMenusButton.vue";
import align from "./align.vue";

export default {
  name: "alignGroup",
  props: {
    editor: Object
  },
  components: {
    subMenusButton,
    align
  },
  setup(props, context) {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
