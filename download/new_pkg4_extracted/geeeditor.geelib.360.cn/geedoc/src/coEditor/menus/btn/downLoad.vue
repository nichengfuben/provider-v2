<template>
  <div class="downBtn">
    <subMenusButton
      iconName="icon-k-download"
      :showArrow="false"
      :labelText="'下载'"
    >
      <div class="download-menu">
        <div class="menu-item" @click="editorExport('pdf')">
          <i class="iconfont-knowledge icon-k-file-pdf"></i>
          <span>下载 PDF</span>
        </div>
        <div class="menu-item" @click="editorExport('docx')">
          <i class="iconfont-knowledge icon-k-file-word"></i>
          <span>下载 word</span>
        </div>
      </div>
    </subMenusButton>
  </div>
</template>

<script>
import subMenusButton from "../subMenusButton.vue";
// import { htmlToWordOrPDF } from "@/api/knowledge.js";
// import { downloadFileByUrlWithATag } from "@/utils/utils.js";
import { useEditorStore } from "@/store/index.js";
import { inject } from "vue";

export default {
  name: "downLoad",
  components: { subMenusButton },
  props: {
    editor: Object
  },
  setup(props, context) {
    const emitToRoot = inject("emitToRoot");

    function editorExport(transType) {
      const editorStore = useEditorStore();

      const id = editorStore.docInfo.id;
      const title = editorStore.docInfo.title;

      const html = props.editor.getHTML();

      emitToRoot("event", {
        type: "download",
        fileName: title || "未命名文档",
        transType: transType,
        html,
        id: Number(id)
      });
    }

    return {
      editorExport
    };
  }
};
</script>

<style lang="scss" scoped>
.downBtn {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #202224;
  &:hover {
    cursor: pointer;
    background-color: #EBF0F5;
  }
}

.download-menu {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #202224;

  &:hover {
    background-color: #EBF0F5;
    border-radius: 4px;
  }

  .iconfont-knowledge {
    margin-right: 8px;
    font-size: 16px;
  }

  .icon-k-word {
    color: #2b5cbd;
  }

  .icon-k-pdf {
    color: #d41f1c;
  }
}
</style>
