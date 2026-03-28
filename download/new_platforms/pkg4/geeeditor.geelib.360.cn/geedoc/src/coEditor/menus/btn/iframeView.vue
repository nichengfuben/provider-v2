<template>
  <MenusButton
    label="新标签页打开"
    iconName="icon-k-newPage"
    :active="false"
    @btn-click="handleClick()"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";
export default {
  name: "iframeView",
  components: { MenusButton },
  props: {
    url: String
  },
  setup(props, context) {
    const handleClick = () => {
      window.open(props.url);
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
