<template>
  <el-popover
    ref="popoverRef"
    :placement="placement"
    :width="width"
    :trigger="trigger"
    :popper-style="{ minWidth: '0px', padding: '0px'}"
    :show-arrow="showArrow"
    :teleported="teleported"
    :disabled="disabled"
    @show="handleShow"
    @hide="handleHide">
    <template #reference>
      <slot>
        <span class="popover-label" :class="{ pointer: !disabled }">
          {{ curLabel }}
          <svg-icon icon-class="arrow-down" v-if="!disabled"></svg-icon>
        </span>
      </slot>
    </template>

    <div class="box">
      <el-input
        v-if="showSearch"
        v-model="search"
        placeholder="搜索"
        :prefix-icon="searchIcon"
      ></el-input>

      <ul>
        <li v-for="item in filterList"
            :key="item"
            :class="{ is_active: value === item.value, disabled: item.disabled }"
            :style="{'justify-content': afterIcon || showCheckIcon ? 'space-between': '' }"
            @click="onChangeItem(item)">
          <div class="left">
            <svg-icon v-if="item.icon_name"
                      :icon-class="item.icon_name"
                      class="icon">
            </svg-icon>

            <span class="text">{{ item.label }}</span>
          </div>

          <svg-icon v-if="afterIcon && value === item.value"
                    @click.stop="afterChange(item)"
                    :icon-class="afterIcon">
          </svg-icon>
          <!-- 选中图标 -->
          <svg-icon v-if="showCheckIcon && value === item.value"
                    icon-class="activation">
          </svg-icon>
        </li>
      </ul>
       <slot name="append"></slot>
    </div>
  </el-popover>
</template>

<script setup name="geelibPopover">
import { computed, ref } from "vue";
import SvgIcon from "@/components/svgIcon.vue";
import searchIcon from "./icons/searchIcon.vue";

const props = defineProps({
  width: {
    type: Number,
    default: 200
  },
  value: String,
  placement: {
    type: String,
    default: "bottom"
  },
  trigger: {
    type: String,
    default: "hover"
  },
  options: Array,
  showArrow: {
    type: Boolean,
    default: false
  },
  afterIcon: String,
  showSearch: {
    type: Boolean,
    default: false
  },
  showCheckIcon: {
    type: Boolean,
    default: false
  },
  teleported: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["change", "update:value", "after-click", "show", "hide"]);

const popoverRef = ref();

function onChangeItem(item) {
  if (item.disabled) return;
  emit("update:value", item.value);
  emit("change", item);
  popoverRef.value?.hide();
}

function afterChange(item) {
  emit("after-click", item);
}

function handleShow() {
  emit("show");
}

function handleHide() {
  emit("hide");
}

const search = ref("");

const curLabel = computed(() => {
  const findItem = props.options.find(el => el.value === props.value);
  return findItem ? findItem.label : props.value;
});

const filterList = computed(() => {
  if (search.value) {
    return props.options.filter(el => el.label.includes(search.value));
  } else {
    return props.options;
  }
});
</script>

<style lang="scss" scoped>
.box {
  padding: 8px;
}

ul {
  max-height: 270px;
  overflow: auto;
}

li {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 5px 8px;
  line-height: 22px;
  font-size: 14px;
  color: $font-1;
  cursor: pointer;
  margin: 4px 0;
  border-radius: 4px;

  &:hover {
    background: $gray-1;
  }

  &.disabled {
    cursor: not-allowed;
    color: $font-4;
  }

  .left {
    display: flex;
    align-items: center;

    .icon {
      margin-right: 4px;
      color: $gray-5;
    }
  }

}

.is_active {
  color: $brand-6 !important;

  .icon {
    color: $brand-6 !important;
  }

  .text {
    font-weight: bold;
  }
}

.pointer {
  cursor: pointer;
}

.popover-label {
  white-space: nowrap;
  word-break: keep-all;
  display: flex;
  align-items: center;

  svg {
    color: $font-3;
  }
}
</style>
