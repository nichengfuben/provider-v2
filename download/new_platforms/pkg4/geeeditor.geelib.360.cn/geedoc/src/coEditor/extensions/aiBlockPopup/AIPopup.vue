<template>
  <!-- aiPopup 这个class 在深色主题里用到 -->
  <div class="box aiPopup"
    ref="boxRef"
    v-if="aiPopupConfig.show"
    :style="{
      top: boxPos.top + 'px',
      left: '10%',
    }"
    @click="handleClickOutside">
    <!-- bodyWrap 为深色主题的渐变边框的实现需要 -->
    <div class="bodyWrap" @click.stop>
      <div class="body" >
        <div class="content" v-if="showResult">
          <editor-content :editor="resultEditor" class="editorContent" ref="resultEditorRef" />

          <div class="doneTool" v-if="!messageState.isLoading">
            <div class="row">
              <div class="gray-btn" @click="replaceToEditor">
                <svg-icon icon-class="ai-replace" />替换
              </div>
              <div class="gray-btn" @click="insertToEditor">
                <svg-icon icon-class="ai-insert" />插入
              </div>
            </div>

            <div class="row">
              <el-tooltip content="重新生成" placement="top" :teleported="false">
                <span class="icon-btn" @click="handleRetry">
                  <svg-icon icon-class="ai-refresh2" />
                </span>
              </el-tooltip>
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

        <div class="doingTool" v-if="messageState.isLoading">
          <span class="text">AI生成中...</span>
          <div>
            <span class="keyIcon">Esc</span>
            <span class="tips">停止生成</span>
            <svg-icon icon-class="ai-stop" size="28px" class="stopIcon" @click="handleStop"></svg-icon>
          </div>
        </div>

        <div class="inputBox" v-else>
          <el-input
            ref="inputRef"
            class="input"
            v-model="input.search"
            placeholder="输入编辑或优化指令..."
            size="large"
            maxlength="2000"
            @keyup.enter="handleSearch"
          ></el-input>

          <div class="submitIcon"
            :class="{ disabled: !input.search.length }"
            @click="handleSearch">
            <svg-icon icon-class="ai-up"></svg-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="menu" v-show="!input.search.length && validSelectedTextCount && !showResult" @click.stop>
      <div class="header">
        <div class="btn" v-for="item in baseMenuList" :key="item.name" @click="handleMenuClick(item)">
          <svg-icon :icon-class="`ai-${item.icon}`"></svg-icon>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="list">
        <div class="label">推荐指令</div>
        <div class="list-item" v-for="item in menuList" :key="item.name" @click="handleMenuClick(item)">
          <span class="prefix-icon" v-if="item.icon">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="mask" v-if="aiPopupConfig.show" @click="handleClickOutside"></div>

  <transition name="fade-slide">
    <div class="aitip" v-if="showResetTip">
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
  </transition>
</template>

<script setup name="aiPopup">
import { computed, onBeforeUnmount, reactive, ref, watch, onMounted, nextTick, inject } from "vue";
import { chatMessageStreamApi } from "@/api/ai.js";
import { useEditorStore } from "@/store/index.js";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { getDefaultExtensions } from "@/coEditor/extensions/index.js";
import { throttle } from "lodash-es";
import SvgIcon from "@/components/svgIcon.vue";
import copyToClipboard from "../../utils/copy-to-clipboard.js";
import { ElMessage } from "element-plus";
import { TextSelection } from "@tiptap/pm/state";

const props = defineProps({
  editor: Object,
  scrollParentDom: Function
});

const emitToRoot = inject("emitToRoot");

const editorStore = useEditorStore();

const boxRef = ref();

const aiPopupConfig = computed({
  get: () => editorStore.aiPopupConfig,
  set: val => editorStore.$patch({ aiPopupConfig: val })
});

const hasAIAuth = computed(() => editorStore.extensionConfig.AI?.hasAuth);

const inputRef = ref();
const input = reactive({
  search: ""
});

const boxPos = reactive({
  top: 0
});

const baseMenuList = [
  { name: "润色", icon: "polish" },
  { name: "续写", icon: "continue" },
  { name: "缩写", icon: "abbrev" },
  { name: "扩写", icon: "expand" }
];

const menuList = [
  { name: "情感渲染", icon: "✒️" },
  { name: "角度转换", icon: "🎭" },
  { name: "内容升华", icon: "🎨" },
  { name: "加个例子", icon: "📌" },
  { name: "增加反差", icon: "🎯" },
  { name: "强化金句", icon: "🔑" },
  { name: "配点幽默", icon: "👀" },
  { name: "添加悬念", icon: "🏷️" },
  { name: "加入热点话题", icon: "🔥" },
  { name: "加入专家观点", icon: "💡" },
  { name: "加入数据支持", icon: "🚩" },
  { name: "补充权威背书", icon: "📜" }
];

const messageState = reactive({
  session_id: "",
  isLoading: false,
  historyList: []
});

function getEditorDomOffsetTop(dom) {
  const scrollParentDom = props.scrollParentDom();
  if (!dom || !scrollParentDom) return 0;

  return dom.getBoundingClientRect().top + scrollParentDom.scrollTop - scrollParentDom.getBoundingClientRect().top;
}

const selectedText = ref(""); // 选中的上下文

watch(() => aiPopupConfig.value?.show, (val) => {
  if (val) {
    resetData();

    // 如果是恢复则恢复数据
    if (aiPopupConfig.value.useBackup && backup.session_id) {
      messageState.session_id = backup.session_id;
      messageState.historyList = backup.historyList;
      backupInputSearch = backup.backupInputSearch;
      content.value = backup.content;
      clearBackup();
    }
    closeAITip();

    // 如果没传defaultQuery，则默认是全文内容，选中
    const state = props.editor.state;
    const view = props.editor.view;
    let from = aiPopupConfig.value?.from || 0;
    let to = aiPopupConfig.value?.to || state.doc.content.size;
    // 不用tiptap的 props.editor.commands.setTextSelection({ from, to })，它的 from 最小是1而不是0
    // props.editor.commands.setTextSelection({ from, to });
    const tr = state.tr.setSelection(TextSelection.create(state.doc, from, to));
    view.dispatch(tr);

    selectedText.value = state.doc.textBetween(from, to, "\n");

    const selection = state.selection;
    const cursorPos = (selection.$cursor || selection.$to).pos;
    const pos = props.editor.view.coordsAtPos(cursorPos);
    const firstPos = props.editor.view.coordsAtPos(0);

    const editorDom = props.editor.view.dom;
    const offset = getEditorDomOffsetTop(editorDom);

    boxPos.top = offset + pos.bottom - firstPos.top + 10;

    nextTick(() => {
      inputRef.value?.focus();

      setSelectHighlight(true);

      scrollCard();
    });
  }
});

function setSelectHighlight(val) {
  props.editor.view.dispatch(props.editor.state.tr.setMeta("selectHighlight", val));
}

function scrollCard() {
  if (!boxRef.value) return;
  const scrollParentDom = props.scrollParentDom();
  const containerRect = scrollParentDom.getBoundingClientRect();
  const AIBoxRect = boxRef.value.getBoundingClientRect();

  // AIBox 显示不全，则滚动
  if (AIBoxRect.top + AIBoxRect.height > containerRect.top + containerRect.height) {
    const scrollTop = boxPos.top - 100;
    nextTick(() => {
      scrollParentDom.scrollTo({ top: scrollTop, behavior: "smooth" });
    });
  }
}

let backupInputSearch = "";

const content = ref("");

function handleSearch() {
  if (!hasAIAuth.value) {
    emitToRoot("noAIAuth");

    return;
  }

  if (messageState.isLoading) return;

  const inputStr = input.search.trim();

  if (!inputStr) return;

  const requestBody = {
    agent_id: 3834,
    query: selectedText.value.length > 0 ? inputStr + "：" + selectedText.value : inputStr,
    stream: true,
    user: "agent-editor",
    session_id: messageState.session_id,
    version: ""
  };

  messageState.isLoading = true;
  cancelPromise();
  createAbortController();
  backupInputSearch = input.search;
  input.search = "";
  content.value = "";
  resultEditor.value.commands.setMarkdown("");

  chatMessageStreamApi({
    signal: abortController.signal,
    body: requestBody,
    isVip: editorStore.isVip,
    onmessageFunc: (data) => {
      // 记录当前会话id
      messageState.session_id = data.session_id;
      if (data.message) {
        content.value += data.message.content;

        throttleInsertResultDoc(content.value);
      }
    },
    oncloseFunc: () => {
      messageState.isLoading = false;
      addLog();

      scrollCard();
    },
    onerrorFunc: (err) => {
      messageState.isLoading = false;
      ElMessage.error(err.message);
    }
  }, "editor");
}

// 用于终止请求
let abortController = null;
function createAbortController() {
  abortController = new AbortController();
}

function cancelPromise() {
  abortController?.abort();
  abortController = null;
}

function handleStop() {
  cancelPromise();
  messageState.isLoading = false;

  addLog();
}

function handleMenuClick(item) {
  input.search = item.name;
  // 新点击指令都是新开会话
  messageState.session_id = "";
  messageState.historyList = [];
  handleSearch();
}

function insertToEditor() {
  const state = props.editor.state;
  props.editor.chain().insertMarkdownAt(state.selection.to, content.value).run();

  emitLog();
  closePopup();
}

function replaceToEditor() {
  props.editor.chain().insertMarkdown(content.value).run();

  emitLog();
  closePopup();
}

function addLog() {
  if (!backupInputSearch || !content.value) return;

  messageState.historyList.push({ context: selectedText.value, function: backupInputSearch, output: content.value });
}

function emitLog() {
  const list = JSON.parse(JSON.stringify(messageState.historyList));
  emitToRoot("aiLog", list);
}

function handleRetry() {
  input.search = backupInputSearch;
  handleSearch();
}

function handleCopy() {
  const resultState = resultEditor.value.state;
  const text = resultState.doc.textBetween(0, resultState.doc.content.size, "\n");

  copyToClipboard(text, () => ElMessage.success("复制成功"));
}

function handleDelete() {
  resetData();
}

function resetData() {
  input.search = "";
  backupInputSearch = "";
  content.value = "";
  messageState.session_id = "";
  messageState.historyList = [];
}

onBeforeUnmount(() => {
  closePopup();
});

function closePopup() {
  if (!aiPopupConfig.value?.show) return;

  editorStore.$patch({
    aiPopupConfig: {
      show: false,
      from: null,
      to: null,
      useBackup: false
    }
  });

  setSelectHighlight(false);
  moveCursorToEndOfSelection(); // 主要是为了取消选中，不显示textMenu
}

function moveCursorToEndOfSelection() {
  const state = props.editor.state;
  const { to } = state.selection; // 当前选区的末尾
  props.editor.chain().focus().setTextSelection(to).run();
}

function handleClickOutside() {
  if (showResult.value) {
    backup.session_id = messageState.session_id;
    backup.historyList = messageState.historyList;
    backup.from = aiPopupConfig.value?.from;
    backup.to = aiPopupConfig.value?.to;
    backup.backupInputSearch = backupInputSearch;
    backup.content = content.value;

    showResetTip.value = true;
  }
  closePopup();
}

const showResetTip = ref(false);
const backup = reactive({
  session_id: "",
  historyList: [],
  from: null,
  to: null,
  content: "",
  backupInputSearch: ""
});

function reopenAIBox() {
  editorStore.$patch({
    aiPopupConfig: {
      show: true,
      from: backup.from,
      to: backup.to,
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
  backup.session_id = "";
  backup.historyList = [];
  backup.from = null;
  backup.to = null;
  backup.content = "";
  backup.backupInputSearch = "";
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

const throttleInsertResultDoc = throttle(insertResultDoc, 200);

function insertResultDoc(str) {
  resultEditor.value.chain().setMarkdown(str).run();
  // 滚动到底部，scrollIntoView不生效
  const dom = resultEditorRef.value?.$el;
  if (dom) {
    dom.scrollTop = dom.scrollHeight;
  }

  scrollCard();
}

const showResult = computed(() => {
  return messageState.isLoading || content.value.length;
});

// 划词字数控制在10-2000字，英文按照单词计算
const validSelectedTextCount = computed(() => {
  const state = props.editor.state;
  const { from, to } = state.selection;
  const selectedText = state.doc.textBetween(from, to, "\n");

  const count = countWords(selectedText);

  return count >= 10 && count <= 2000;
});

// 英文是一个单词算一个，其他直接算一个
function countWords(text) {
  // 匹配英文单词
  const englishWords = text.match(/\b[a-zA-Z]+\b/g) || [];
  // 匹配其他字符（中文、数字、特殊字符、空白字符）
  const otherChars = text.match(/[\u4e00-\u9fa5\d\s\W]/g) || [];

  // 字数总计：英文单词 + 其他字符
  return englishWords.length + otherChars.length;
}

const handleEscape = (event) => {
  if (event.key === "Escape") {
    if (messageState.isLoading) {
      handleStop();
    }
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscape);
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

.inputBox {
  display: flex;
  align-items: center;
  padding: 4px 0;

  .input {
    width: calc(100% - 40px);

    :deep(.el-input__wrapper) {
      box-shadow: none;
    }
  }

  .submitIcon {
    line-height: 0;
    padding: 6px;
    border-radius: 16px;
    color: #fff;
    background-color: #003FFB;
    cursor: pointer;

    &:hover {
      background-color: #2E68FC;
    }

    &:active {
      background-color: #002DCF;
    }

    &.disabled {
      background-color: #8AB3FD;
      cursor: not-allowed;
    }
  }
}

.doingTool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 0 12px;
  padding: 10px 0;

  .text {
    background: linear-gradient(90deg, rgba(0, 63, 251, 0.00) -38.1%, #5400FB -3.57%, #003FFB 32.71%, rgba(0, 63, 251, 0.00) 128.57%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .keyIcon {
    font-size: 13px;
    padding: 2px 4px;
    border-radius: 6px;
    background: rgba(0, 40, 120, 0.06);
    color: #B0B4B8;
    margin-right: 6px;
  }

  .tips {
    font-size: 13px;
    font-weight: 400;
    color: #B0B4B8;
  }

  .stopIcon {
    margin-left: 12px;
    cursor: pointer;
    color: #202224;

    &:hover,
    &:active  {
      color: #505355;
    }
  }
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

.menu {
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.16), 0px 4px 16px -6px rgba(0, 0, 0, 0.12), 0px 6px 20px 2px rgba(0, 0, 0, 0.08);
  margin-top: 8px;
  width: fit-content;
}

.header {
  padding: 8px 8px 4px;
  display: flex;
  gap: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  .btn {
    padding: 4px 8px;
    text-align: center;
    color: $font-2;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 4px;

    &:hover {
      color: $font-1;
      background-color: rgba(0, 40, 120, 0.06);
    }

    &:active {
      background-color: rgba(0, 40, 120, 0.12);
    }
  }
}

.list {
  margin: 4px 0;
  padding: 4px 0;
  height: 190px;
  overflow: auto;

  .label {
    font-size: 13px;
    color: $font-3;
    padding: 0 16px;
    line-height: 32px;
  }

  .list-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 0 4px;
    padding: 0 12px;
    font-size: 14px;
    line-height: 36px;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
      background-color: rgba(0, 40, 120, 0.06);
    }

    &:active {
      background-color: rgba(0, 40, 120, 0.12);
    }

    .prefix-icon {
      margin-right: 4px;
      color: #636F82;
      font-size: 16px;
    }
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
  display: flex;

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
