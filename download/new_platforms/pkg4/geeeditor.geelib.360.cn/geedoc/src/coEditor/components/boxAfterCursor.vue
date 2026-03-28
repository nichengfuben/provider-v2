<template>
  <!-- boxAfterCursor 这个class 在深色主题里用到 -->
  <div
    ref="boxRef"
    class="boxAfterCursor"
    :style="{
      top: boxPos.top + 'px',
      left: boxPos.left + 'px',
    }">
    <slot></slot>
  </div>

  <div class="mask" @click="closeDialog"></div>
</template>

<script setup name="boxAfterCursor">
import { reactive, onMounted, ref } from "vue";

const props = defineProps({
  editor: Object
});

const emits = defineEmits(["closed"]);

const boxPos = reactive({
  top: 0,
  left: 0
});

function getEditorDomOffsetTop(dom) {
  const scrollParentDom = document.querySelector(".component-editor-right");
  if (!dom || !scrollParentDom) return 0;

  return dom.getBoundingClientRect().top + scrollParentDom.scrollTop - scrollParentDom.getBoundingClientRect().top;
}

const boxRef = ref();

onMounted(() => {
  const selection = props.editor.state.selection;
  const cur = selection.$cursor || selection.$from;
  const pos = props.editor.view.coordsAtPos(cur.pos);

  const firstPos = props.editor.view.coordsAtPos(0);

  const editorDom = props.editor.view.dom;
  const offset = getEditorDomOffsetTop(editorDom);

  const bodyHeight = document.body.clientHeight;
  const cardHeight = boxRef.value.clientHeight;

  if (bodyHeight - pos.bottom - cardHeight > 30) {
    boxPos.top = offset + pos.bottom - firstPos.top + 10;
  } else {
    // 如果下方位置不够，弹框就显示在上面
    boxPos.top = offset + pos.top - firstPos.top - cardHeight - 10;
  }

  boxPos.left = 34;
});

function closeDialog() {
  emits("closed");
}

</script>

<style lang="scss" scoped>
.boxAfterCursor {
  position: absolute;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: $shadow-4-down;
  border-radius: 8px;
  border: 1px solid $gray-2;
  padding: 12px;
  z-index: 3101;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3100;
  background: transparent;
}
</style>
