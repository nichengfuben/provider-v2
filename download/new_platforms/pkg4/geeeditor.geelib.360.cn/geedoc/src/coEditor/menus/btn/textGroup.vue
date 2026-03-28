<template>
  <subMenusButton
    iconName="icon-k-text"
  >
    <normalText :editor="editor"></normalText>
    <heading :editor="editor" :level="1"></heading>
    <heading :editor="editor" :level="2"></heading>
    <heading :editor="editor" :level="3"></heading>
    <heading :editor="editor" :level="4"></heading>
    <orderedList :editor="editor"></orderedList>
    <bulletList :editor="editor"></bulletList>
    <!-- <codeBlock :editor="editor"></codeBlock> -->
    <!-- <blockquoteBtn :editor="editor"></blockquoteBtn> -->
  </subMenusButton>

</template>

<script>
import subMenusButton from "../subMenusButton.vue";
import normalText from "./normalText.vue";
import heading from "./heading.vue";
import orderedList from "./orderedList.vue";
import bulletList from "./bulletList.vue";
// import codeBlock from "./codeBlock.vue";
// import blockquoteBtn from "./blockquoteBtn.vue";

export default {
  name: "textGroup",
  props: {
    editor: Object
  },
  components: {
    subMenusButton,
    normalText,
    heading,
    orderedList,
    bulletList
    // codeBlock,
    // blockquoteBtn
  },
  setup(props, context) {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
