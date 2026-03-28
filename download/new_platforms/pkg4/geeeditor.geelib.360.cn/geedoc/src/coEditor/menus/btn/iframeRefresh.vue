<template>
  <MenusButton
    label="刷新"
    iconName="icon-k-refresh"
    :active="false"
    @btn-click="handleClick()"
  ></MenusButton>
</template>

<script>
import MenusButton from "../menusButton.vue";

export default {
  name: "iframeRefresh",
  components: { MenusButton },
  setup(props, context) {
    const handleClick = () => {
      context.emit("handleClick");
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
