<template>
  <boxAfterCursor
    v-if="showDialog"
    :editor="editor"
    @closed="closeDialog">
    <div class="row">
      <span>链接</span>
      <el-input
        ref="inputRef"
        v-model="formData.url"
        style="width: 462px"
        placeholder="粘贴或者输入链接"
        @keyup.enter="handleSubmit"
      ></el-input>

      <el-button type="primary" :disabled="!isValid" @click="handleSubmit">确定</el-button>
    </div>

    <div class="tips">通过iframe插入网页，不是所有的网站都支持通过iframe嵌入</div>
  </boxAfterCursor>
</template>

<script setup name="iframeDialog">
import { ref, reactive, watch, computed } from "vue";
import boxAfterCursor from "../../components/boxAfterCursor.vue";
import { useEditorStore } from "@/store/index.js";

const props = defineProps({
  editor: Object
});

const editorStore = useEditorStore();

const showDialog = computed({
  get: () => editorStore.showIframeDialog,
  set: val => editorStore.$patch({ showIframeDialog: val })
});

const formData = reactive({
  url: ""
});

const inputRef = ref();

watch(() => showDialog.value, (newVal) => {
  if (newVal) {
    formData.url = "";

    setTimeout(() => {
      inputRef.value.focus();
    }, 200);
  }
});

function closeDialog() {
  formData.url = "";
  showDialog.value = false;
}

const isValid = computed(() => {
  const url = formData.url.trim();
  return url.startsWith("http");
});

function handleSubmit() {
  if (!isValid.value) return;

  const url = formData.url.trim();
  props.editor.chain().focus().setIframe({ url }).run();

  closeDialog();
}

</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  color: $font-2;
}

.tips {
  color: $font-2;
  font-size: 12px;
  line-height: 20px;
  margin-top: 9px;
  margin-left: 47px;
}

</style>
