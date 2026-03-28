<template>
  <boxAfterCursor
    v-if="showDialog"
    :editor="editor"
    @closed="closeDialog">
    <div class="row">
      <svg-icon icon-class="figma" size="20px"></svg-icon>

      <el-input
        ref="inputRef"
        v-model="formData.url"
        style="width: 462px"
        placeholder="https://www.figma.com/..."
        @keyup.enter="handleSubmit"
      ></el-input>

      <el-button type="primary" :disabled="!isValid" @click="handleSubmit">确定</el-button>
    </div>
  </boxAfterCursor>
</template>

<script setup name="figmaDialog">
import { ref, reactive, watch, computed } from "vue";
import { useEditorStore } from "@/store/index.js";
import boxAfterCursor from "../../components/boxAfterCursor.vue";
import SvgIcon from "@/components/svgIcon.vue";

const props = defineProps({
  editor: Object
});

const editorStore = useEditorStore();

const showDialog = computed({
  get: () => editorStore.showFigmaDialog,
  set: val => editorStore.$patch({ showFigmaDialog: val })
});

const formData = reactive({
  url: ""
});
const inputRef = ref();

watch(() => showDialog.value, (newVal) => {
  if (newVal) {
    formData.url = "";

    setTimeout(() => {
      inputRef.value?.focus();
    }, 200);
  }
});

function closeDialog() {
  formData.url = "";
  showDialog.value = false;
}

const isValid = computed(() => {
  const url = formData.url.trim();
  return url.startsWith("https://www.figma.com");
});

function handleSubmit() {
  if (!isValid.value) return;

  const url = formData.url.trim();
  props.editor.chain().focus().setFigma({ url }).run();

  closeDialog();
}

</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
