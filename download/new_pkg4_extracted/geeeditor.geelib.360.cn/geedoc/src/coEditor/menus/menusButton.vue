<template>
  <!-- 不知道为什么，只有是button时，工具栏点按钮后才不会闪烁，span或者div都会闪烁 -->
  <button
    ref="menusButtonRef"
    class="btn"
    :class="{ disabled, active }"
    @click.stop="handleClick">
    <slot>
      <i class="iconfont-knowledge" :class="iconName"></i>
      <span class="label" v-if="labelText">{{ labelText }}</span>
    </slot>
  </button>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import tippy from "tippy.js";

export default {
  name: "MenusButton",
  emits: ["btn-click"],
  props: {
    label: String,
    iconName: String,
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    isBlueActive: { // 高亮时，样式时蓝色，而不是默认的背景色
      type: Boolean,
      default: false
    },
    labelText: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    const menusButtonRef = ref();

    const tooltipInstance = ref(null);
    onMounted(() => {
      tooltipInstance.value = tippy(menusButtonRef.value, {
        appendTo: "parent",
        duration: 0,
        content: props.label,
        interactive: true, // 为防止遮挡其他按钮，鼠标移开后立刻消失
        placement: "top",
        hideOnClick: "toggle",
        theme: "dark"
        // trigger: "click"
      });
    });

    watch(() => props.label, () => {
      if (!tooltipInstance.value) return;

      tooltipInstance.value.setContent(props.label);
    });

    watch(() => props.disabled, () => {
      if (!tooltipInstance.value) return;

      if (props.disabled) {
        tooltipInstance.value.disable();
      } else {
        tooltipInstance.value.enable();
      }
    });

    onBeforeUnmount(() => {
      tooltipInstance.value && tooltipInstance.value.destroy();
      tooltipInstance.value = null;
    });

    function handleClick(e) {
      if (props.disabled) return;

      context.emit("btn-click", e);
    }

    return {
      handleClick,
      menusButtonRef
    };
  }
};
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  padding: 3px;
  box-sizing: border-box;
  color: $gray-6;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: $gray-2;
    border-radius: 4px;
  }

  &.disabled {
    color: $font-4;
    cursor: not-allowed;
  }

  i {
    font-size: 18px;
  }
}

.btn + .btn {
  margin-left: 6px;
}

button {
  border: none;
  background: transparent;
  padding: 0;
}
.label {
  font-size: 14px;
  color: #202224;
}
</style>

<style lang="scss">
.tippy-box[data-theme~=dark] {
  position: relative;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  white-space: normal;
  outline: 0;
  transition-property: transform, visibility, opacity;

  &[data-placement^="top"] > .tippy-arrow {
    bottom: 0;
  }
  &[data-placement^="top"] > .tippy-arrow:before {
    bottom: -7px;
    left: 0;
    border-width: 8px 8px 0;
    border-top-color: initial;
    transform-origin: center top;
  }
  &[data-placement^="bottom"] > .tippy-arrow {
    top: 0;
  }
  &[data-placement^="bottom"] > .tippy-arrow:before {
    top: -7px;
    left: 0;
    border-width: 0 8px 8px;
    border-bottom-color: initial;
    transform-origin: center bottom;
  }
  &[data-placement^="left"] > .tippy-arrow {
    right: 0;
  }
  &[data-placement^="left"] > .tippy-arrow:before {
    border-width: 8px 0 8px 8px;
    border-left-color: initial;
    right: -7px;
    transform-origin: center left;
  }
  &[data-placement^="right"] > .tippy-arrow {
    left: 0;
  }
  &[data-placement^="right"] > .tippy-arrow:before {
    left: -7px;
    border-width: 8px 8px 8px 0;
    border-right-color: initial;
    transform-origin: center right;
  }
  &[data-inertia][data-state="visible"] {
    transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
  }
  .tippy-arrow {
    width: 16px;
    height: 16px;
    color: #333;
  }
  .tippy-arrow:before {
    content: "";
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }

  .tippy-content {
    position: relative;
    padding: 5px 9px;
    z-index: 1;

    word-break: keep-all;
  }
}

</style>
