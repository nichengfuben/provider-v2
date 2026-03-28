<template>
  <el-tooltip
    :teleported="teleported"
    effect="dark"
    :disabled="isDisabled"
    :placement="placement"
  >
    <template #content>
      <div class="content">{{ content }}</div>
    </template>
    <div class="ellipsis" @mouseover="onMouseOver">
      <span ref="contentRef">{{ content }}</span>
    </div>
  </el-tooltip>
</template>

<script setup name="EllipsisTooltip">
import { ref } from "vue";

defineProps({
  // 显示的文字内容
  content: {
    default: ""
  },
  placement: {
    type: String,
    default: "top"
  },
  teleported: {
    type: Boolean,
    default: false
  }
});

const isDisabled = ref(true);
const contentRef = ref();

function onMouseOver() {
  const parentWidth = contentRef.value.parentNode.offsetWidth;
  const contentWidth = contentRef.value.offsetWidth;
  // 判断是否开启tooltip功能
  isDisabled.value = contentWidth <= parentWidth;
}
</script>

<style lang="scss" scoped>
:focus,
:focus-visible {
  outline: 0;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.content {
  max-width: 320px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
