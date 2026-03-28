<template>
  <button
    class="btn"
    :class="{ disabled, active: active || showTooltip }"
    :style="btnStyle"
    ref="menusButtonRef"
  >
    <slot name="triggerDom">
      <!-- 如果没传插槽则使用下面默认的内容 -->
      <i class="iconfont-knowledge icon" :class="iconName"></i>
      <span class="label" v-if="labelText">{{ labelText }}</span>
      <i class="iconfont-knowledge icon-k-down arrow" v-if="showArrow"></i>
    </slot>

  </button>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, onUpdated, h, createApp, getCurrentInstance } from "vue";
import tippy from "tippy.js";

export default {
  name: "subMenusButton",
  props: {
    iconName: String,
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    popperPadding: {
      type: String,
      default: ""
    },
    btnStyle: {
      type: Object,
      default: () => ({})
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "top"
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    contentDom: { // 默认使用 default slot，但是如果也可以用此字段获取到具体dom
      type: Function,
      default: null
    },
    labelText: {
      type: String,
      default: ""
    }
  },
  emits: ["onShow"],
  setup(props, context) {
    const vm = getCurrentInstance();

    const showTooltip = ref(false);

    const menusButtonRef = ref();

    const tooltipInstance = ref(null);

    function getContent() {
      if (props.contentDom) {
        return props.contentDom;
      }

      const defaultSlot = context.slots.default();
      const vnode = createApp({
        setup: () => {
          return () => defaultSlot.map(el => h(el));
        }
      });

      if (vm) {
        Object.assign(vnode._context, vm.appContext);
      }

      const dom = document.createElement("div");
      dom.style = "display: flex;align-items: center;";
      vnode.mount(dom);

      return () => dom;
    }

    onMounted(() => {
      tooltipInstance.value = tippy(menusButtonRef.value, {
        appendTo: props.appendToBody ? () => document.body : "parent",
        duration: 0,
        content: getContent(),
        interactive: true,
        placement: props.placement,
        hideOnClick: "toggle",
        arrow: false,
        theme: "menus",
        maxWidth: "none",
        // trigger: "click",
        onCreate(instance) {
          if (props.popperPadding) {
            const dom = instance.popper.querySelector(".tippy-content");
            if (dom) {
              dom.style.padding = props.popperPadding;
            }
          }
        },
        onShow() {
          showTooltip.value = true;
          context.emit("onShow");
        },
        onHidden() {
          showTooltip.value = false;
        }
      });
    });

    onUpdated(() => {
      if (!tooltipInstance.value) return;

      tooltipInstance.value.setContent(getContent());
    });

    onBeforeUnmount(() => {
      tooltipInstance.value && tooltipInstance.value.destroy();
      tooltipInstance.value = null;
    });

    watch(() => props.disabled, () => {
      if (!tooltipInstance.value) return;

      if (props.disabled) {
        tooltipInstance.value.disable();
      } else {
        tooltipInstance.value.enable();
      }
    });

    return {
      showTooltip,
      menusButtonRef,
      tooltipInstance // 暴露出去，给外面调用
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

    i {
      color: $font-4;
    }
  }

  .icon {
    font-size: 18px;
    color: $gray-6;
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

.list {
  display: flex;
  align-items: center;
}

.arrow {
  color: $gray-5;
  vertical-align: bottom;
  transition: transform  0.2s linear;
}

.label {
  font-size: 14px;
  color: #202224;
}
</style>

<style lang="scss">
.tippy-box[data-theme~=menus] {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: $shadow-4-down;
  outline: 0;

  .tippy-content {
    position: relative;
    padding: 7px 12px;
    z-index: 1;
  }
}
</style>
