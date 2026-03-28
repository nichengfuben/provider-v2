<template>
  <boxAfterCursor
    v-if="showDialog"
    :editor="editor"
    @closed="closeDialog">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="54px">
      <el-form-item label="文本" prop="text">
        <el-input
          ref="inputRef1"
          v-model="formData.text"
          placeholder="请输入文本"
          style="width: 462px"
        ></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="href">
        <el-input
          ref="inputRef2"
          v-model="formData.href"
          placeholder="请输入链接"
          style="width: 462px; margin-right: 16px;"
          @keyup.enter="handleSubmit"
        ></el-input>

        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </boxAfterCursor>
</template>

<script setup name="linkDialog">
import { ref, reactive, watch, computed } from "vue";
import { useEditorStore } from "@/store/index.js";
import boxAfterCursor from "../../components/boxAfterCursor.vue";

const props = defineProps({
  editor: Object
});

const editorStore = useEditorStore();
const addNextLine = computed(() => editorStore.showLinkDialog.addNextLine);
const changeAttr = computed(() => editorStore.showLinkDialog.attr);

const showDialog = computed({
  get: () => editorStore.showLinkDialog.show,
  set: (val) => {
    editorStore.$patch({
      showLinkDialog: {
        show: val,
        addNextLine: editorStore.showLinkDialog.addNextLine,
        attr: { // 关闭时重置attr
          text: null,
          href: null
        }
      }
    });
  }
});

const formData = reactive({
  text: "",
  href: ""
});

watch(() => showDialog.value, (newVal) => {
  if (newVal) {
    const editor = props.editor;

    const state = editor.state;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to);

    formData.text = changeAttr.value?.text || selectedText || "";
    formData.href = changeAttr.value?.href || "";

    const timer = setTimeout(() => {
      if (formData.text) {
        inputRef2.value.focus();
      } else {
        inputRef1.value.focus();
      }
      clearTimeout(timer);
    }, 200);
  }
});

function closeDialog() {
  showDialog.value = false;
  formRef.value.resetFields();
}

const formRef = ref();
const inputRef1 = ref();
const inputRef2 = ref();

const rules = reactive({
  href: [
    { required: true, message: "请输入链接" },
    {
      // 允许没http前缀的，允许localhost
      pattern: /^(https?:\/\/)?(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s?#]*)?(\?[^\s#]*)?(#.*)?$/,
      message: "请输入有效的链接"
    }
  ]
});

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      let href = formData.href;
      if (!href.startsWith("http")) {
        href = "http://" + href;
      }
      const text = formData.text;

      if (!href) return;
      let commandChain = props.editor.chain().focus();

      if (changeAttr.value.href) { // 修改模式时删除旧的link
        commandChain = commandChain.extendMarkRange("link").deleteSelection();
      }

      // 在下一行添加模式打开
      if (addNextLine.value) {
        commandChain = commandChain.insertContent("<p></p>");
      }

      commandChain = commandChain.extendMarkRange("link").toggleLink({ href, target: "_blank" });

      const isEmpty = props.editor.state.selection.empty;
      if (isEmpty) {
        commandChain = commandChain.insertContent(text || href).unsetMark("link").insertContent(" ");
      }

      commandChain.run();

      closeDialog();
    }
  });
}

</script>

<style lang="scss" scoped>
:deep() .el-form-item__label {
  color: $font-2;
}
</style>
