<template>
  <!-- aiPopup 这个class 在深色主题里用到 -->
  <div class="box aiPopup"
    v-if="miniDocPopupConfig.show"
    ref="boxRef"
    :style="{
      top: boxPos.top + 'px',
      left: '10%',
    }">
    <!-- bodyWrap 为深色主题的渐变边框的实现需要 -->
    <div class="bodyWrap" @click.stop>
      <div class="body">
      <div class="content">
        <editor-content :editor="resultEditor" class="editorContent" ref="resultEditorRef" />

        <div class="doneTool" v-if="miniDocPopupConfig.showToolbar">
          <div class="row">
            <div class="gray-btn" @click="replaceToEditor">
              <svg-icon icon-class="ai-replace" />替换
            </div>
          </div>

          <div class="row">
            <el-tooltip content="复制" placement="top" :teleported="false">
              <span class="icon-btn" @click="handleCopy">
                <svg-icon icon-class="ai-copy2" />
              </span>
            </el-tooltip>
            <el-tooltip content="放弃" placement="top" :teleported="false">
              <span class="icon-btn" @click="handleDelete">
                <svg-icon icon-class="ai-delete2" />
              </span>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>

  <!-- 不能使用mask的方式，因为还想正文能滚动 -->
  <!-- <div class="mask" v-if="miniDocPopupConfig.show" @click="handleClickOutside"></div> -->

  <transition name="fade-slide">
    <div class="aitip aiPopup" v-if="showResetTip" @click.stop>
      <div class="bodyWrap">
        <div class="aitip-body">
          <div class="aitip-content">
            生成的内容未保存
            <div class="border-button" @click="reopenAIBox">恢复编辑</div>
          </div>
          <div class="aitip-close">
            <div class="icon-btn2" @click="closeAITip">
              <svg-icon icon-class="ai-close2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup name="miniDocPopup">
import { computed, onBeforeUnmount, reactive, ref, watch, onMounted, nextTick } from "vue";
import { useEditorStore } from "@/store/index.js";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { getDefaultExtensions } from "@/coEditor/extensions/index.js";
import SvgIcon from "@/components/svgIcon.vue";
import copyToClipboard from "../../utils/copy-to-clipboard.js";
import { ElMessage } from "element-plus";

const props = defineProps({
  editor: Object,
  scrollParentDom: Function
});

const editorStore = useEditorStore();

const miniDocPopupConfig = computed({
  get: () => editorStore.miniDocPopupConfig,
  set: val => editorStore.$patch({ miniDocPopupConfig: val })
});

const boxPos = reactive({
  top: 0
});

function getEditorDomOffsetTop(dom) {
  const scrollParentDom = props.scrollParentDom();
  if (!dom || !scrollParentDom) return 0;

  return dom.getBoundingClientRect().top + scrollParentDom.scrollTop - scrollParentDom.getBoundingClientRect().top;
}

watch(() => miniDocPopupConfig.value.show, (val) => {
  if (val) {
    // 如果是恢复则恢复数据
    if (miniDocPopupConfig.value.useBackup && backup.content) {
      clearBackup();
    }
    closeAITip();

    const state = props.editor.state;
    const firstPos = props.editor.view.coordsAtPos(0);
    const endPos = props.editor.view.coordsAtPos(state.doc.content.size);

    const editorDom = props.editor.view.dom;
    const offset = getEditorDomOffsetTop(editorDom);

    boxPos.top = offset + endPos.bottom - firstPos.top + 10;

    nextTick(() => {
      scrollCard();
    });
  }
});

watch(() => miniDocPopupConfig.value.content, (val) => {
  insertResultDoc(val);
});

function insertResultDoc(str) {
  resultEditor.value.chain().setMarkdown(str).run();
  // 滚动到底部，scrollIntoView不生效
  const dom = resultEditorRef.value?.$el;
  if (dom) {
    dom.scrollTop = dom.scrollHeight;
  }

  nextTick(() => {
    scrollCard();
  });
}

watch(() => miniDocPopupConfig.value.showToolbar, (val) => {
  nextTick(() => {
    scrollCard();
  });
});

function scrollCard() {
  const scrollParentDom = props.scrollParentDom();

  // 滚动到最底部
  nextTick(() => {
    scrollParentDom.scrollTo({ top: scrollParentDom.scrollHeight, behavior: "smooth" });
  });
}

function replaceToEditor() {
  props.editor.chain().setMarkdown(miniDocPopupConfig.value.content).run();

  closePopup();
}

function handleCopy() {
  const resultState = resultEditor.value.state;
  const text = resultState.doc.textBetween(0, resultState.doc.content.size, "\n");

  copyToClipboard(text, () => ElMessage.success("复制成功"));
}

function handleDelete() {
  closePopup();
}

onBeforeUnmount(() => {
  closePopup();
});

function closePopup() {
  if (!miniDocPopupConfig.value.show) return;

  editorStore.$patch({
    miniDocPopupConfig: {
      show: false,
      content: "",
      showToolbar: false,
      useBackup: false
    }
  });
}

watch(() => miniDocPopupConfig.value.show, (val) => {
  if (val) {
    document.addEventListener("click", handleClickOutside, true); // 为 true，捕获监听，因为有的dom设置了 stop
  } else {
    document.removeEventListener("click", handleClickOutside, true);
  }
});

// 确保在组件卸载时移除监听器
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside, true);
});

const boxRef = ref();

function handleClickOutside(event) {
  if (!boxRef.value || boxRef.value.contains(event.target)) return;

  const content = miniDocPopupConfig.value.content;
  if (content) {
    backup.content = content;

    showResetTip.value = true;
  }
  closePopup();

  event.stopImmediatePropagation(); // 阻止事件传递
}

const showResetTip = ref(false);
const backup = reactive({
  content: ""
});

function reopenAIBox() {
  editorStore.$patch({
    miniDocPopupConfig: {
      show: true,
      content: backup.content,
      showToolbar: true,
      useBackup: true
    }
  });

  showResetTip.value = false;
}

function closeAITip() {
  showResetTip.value = false;
  clearBackup();
}

function clearBackup() {
  backup.content = "";
}

const resultEditor = ref();
const resultEditorRef = ref();
onMounted(() => {
  resultEditor.value = new Editor({
    editable: false,
    extensions: getDefaultExtensions(),
    content: ""
  });
});

</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100vw - 8px); // 留个滚动条的宽度
  height: 100vh;
  z-index: 3100;
  background: transparent;
}

.box {
  position: absolute;
  width: 80%;
  z-index: 3101;
  font-size: 14px;
}

.body {
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 12px;
  outline: none;
  border: 1px solid #7900FB;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.16), 0px 4px 16px -6px rgba(0, 0, 0, 0.12), 0px 6px 20px 2px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.content {
  padding-top: 8px;
  white-space: pre-wrap;
}

.editorContent {
  padding: 0 12px;
  max-height: 344px;
  overflow: auto;
}

.doneTool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gray-btn {
  box-sizing: border-box;
  font-size: 14px;
  color:#202224;
  padding: 6px 5px;
  width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  background-color: rgba(0, 40, 120, 0.06);

  svg {
    margin-right: 4px;
  }

  &:hover {
    background-color: rgba(0, 40, 120, 0.12);
  }

  &:active {
    background-color: rgba(0, 40, 120, 0.20);
  }
}

.icon-btn {
  color: #888D93;
  padding: 8px;
  line-height: 1;
  font-size: 0;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    color: #505355;
    background-color: rgba(0, 40, 120, 0.06);
  }

  &:active {
    color: #505355;
    background-color: rgba(0, 40, 120, 0.12);
  }
}

.icon-btn2 {
  color: #888D93;
  padding: 6px;
  line-height: 1;
  font-size: 0;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    color: #202224;
    background-color: rgba(0, 40, 120, 0.06);
  }

  &:active {
    color: #202224;
    background-color: rgba(0, 40, 120, 0.12);
  }
}

.aitip {
  box-sizing: border-box;
  position: fixed;
  width: 400px;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.16), 0px 4px 16px -6px rgba(0, 0, 0, 0.12), 0px 6px 20px 2px rgba(0, 0, 0, 0.08);

  .aitip-body {
    display: flex;
    border-radius: 12px;
    background: #ffffff;
  }

  .aitip-content {
    flex: 1;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #202224;
    font-size: 14px;
  }

  .aitip-close {
    padding: 10px;
    border-left: 1px solid rgba(0, 0, 0, 0.12);
  }
}

.border-button {
  font-size: 14px;
  display: inline-flex;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  cursor: pointer;
  color: #505355;

  &:hover {
    color: #000000;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 40, 120, 0.06);
  }

  &:active {
    color: #000000;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 40, 120, 0.12);
  }
}

// aitip 的动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 200ms ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  bottom: 0;
  opacity: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  bottom: 60px;
  opacity: 1;
}
</style>
