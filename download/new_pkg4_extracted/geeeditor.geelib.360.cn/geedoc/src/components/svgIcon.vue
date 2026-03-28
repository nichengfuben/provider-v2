<template>
  <svg class="svg-icon" :class="{ pointer }" aria-hidden="false">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
import { computed } from "vue";

export default {
  name: "svg-icon",
  props: {
    iconClass: {
      type: String,
      required: true
    },
    pointer: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "#9BA7BA"
    },
    size: {
      type: String,
      default: "16px"
    }
  },
  setup(props) {
    const iconName = computed(() => {
      return `#icon-editor-${props.iconClass}`;
    });

    return {
      iconName
    };
  }
};
</script>

<style scoped>
.svg-icon {
  width: v-bind(size);
  height: v-bind(size);
  vertical-align: middle;
  overflow: hidden;
  outline: none;
}

.pointer {
  cursor: pointer;
}
</style>
