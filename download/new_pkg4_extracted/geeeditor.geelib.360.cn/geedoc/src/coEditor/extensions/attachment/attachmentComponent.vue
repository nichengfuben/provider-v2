<template>
  <node-view-wrapper class="node-attachment" :class="{ selected: editor.isFocused && selected }">
    <div class="loadingMode" v-if="!url">
      <div class="loadingBlock">
        <div class="textPart">
          <span style="cursor: pointer">{{`正在上传中  ${uploadProcess}%` }}</span>
        </div>
        <div class="processBar" :style="{width:uploadProcess+'%'}"></div>
      </div>
    </div>

    <div class="card" v-else>
      <div class="card-header" @dblclick="toggleShow">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-video" style="font-size: 18px; color: #FFA64D" v-if="fileType === 'video' || fileType === 'audio'"></i>
          <i class="iconfont-knowledge icon-k-picture" style="font-size: 18px; color: #3364FF" v-else-if="fileType === 'image'"></i>
          <i class="iconfont-knowledge icon-k-file" style="font-size: 18px; color: #3364FF" v-else></i>
          <span class="namePart">{{fileName}}{{fileExt && `.${fileExt}`}}</span>
          <span class="size">({{fileSizeText}})</span>
        </div>
        <div>
          <menusButton label="收起" iconName="icon-k-close" v-if="showBody" @btn-click="toggleShow"></menusButton>
          <menusButton label="预览" iconName="icon-k-view" v-else @btn-click="toggleShow"></menusButton>
          <menusButton label="全屏预览" v-if="!disableOpen" iconName="icon-k-newPage"  @btn-click="jumpOutViewFile"></menusButton>
          <menusButton label="下载" v-if="!disableDownload" iconName="icon-k-download" @btn-click="handleDownload"></menusButton>
        </div>
      </div>

      <el-collapse-transition>
        <div class="card-body" v-if="showBody">
          <iframe :src="getPreviewFileUrlFun(url)" frameborder="0" allowfullscreen></iframe>
        </div>
      </el-collapse-transition>
    </div>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { normalizeFileType, normalizeFileSize } from "../../utils/file.js";
import menusButton from "../../menus/menusButton.vue";
import { downloadFileByUrlWithATag } from "@/utils/utils.js";
import PubSub from "pubsub-js";
import { useEditorStore } from "@/store/index.js";
import { knowledgeDownloadFromUrlApi } from "@/api/knowledge.js";

export default {
  name: "attachmentComponent",
  components: {
    NodeViewWrapper,
    menusButton
  },
  props: nodeViewProps,
  setup(props) {
    const editorStore = useEditorStore();
    const updateAttributes = props.updateAttributes;
    const error = computed(() => props.node.attrs.error);
    const url = computed(() => (props.node.attrs.url));
    const fileName = computed(() => props.node.attrs.fileName);
    const fileSizeText = computed(() => normalizeFileSize(props.node.attrs.fileSize));
    const fileExt = computed(() => props.node.attrs.fileExt);
    const fileType = computed(() => normalizeFileType(props.node.attrs.fileType));
    const uploadProcess = computed(() => (props.node.attrs.uploadProcess));

    const disableDownload = computed(() => editorStore.extensionConfig.attachment.disableDownload);
    const disableOpen = computed(() => editorStore.extensionConfig.attachment.disableOpen);
    const getPreviewFileUrlFun = editorStore.extensionConfig.attachment.getPreviewFileUrlFun;

    const subscription = PubSub.subscribe("attachmentMessage", function (_, data) {
      const { id, mes } = JSON.parse(data);
      if (props.node.attrs.id === id) {
        updateAttributes(mes);
      }
    });

    onBeforeUnmount(() => {
      PubSub.unsubscribe(subscription);
    });
    watch(() => error.value, () => {
      props.deleteNode();
    });

    const showBody = ref(false);

    function toggleShow() {
      showBody.value = !showBody.value;
    }

    function handleDownload() {
      if (!url.value) return;
      knowledgeDownloadFromUrlApi({
        url: url.value,
        fileName: fileName.value
      }).then((res) => {
        const href = window.URL.createObjectURL(res.data);
        const fileName = res.headers["content-disposition"]?.split("=")[1];
        downloadFileByUrlWithATag(href, decodeURI(fileName));
        window.URL.revokeObjectURL(href);
      });
    }

    function jumpOutViewFile() {
      window.open(getPreviewFileUrlFun(url.value), "_blank");
    }

    return {
      error,
      url,
      fileName,
      fileExt,
      fileSizeText,
      fileType,
      uploadProcess,
      showBody,
      toggleShow,
      handleDownload,
      disableDownload,
      jumpOutViewFile,
      disableOpen,
      getPreviewFileUrlFun
    };
  }
};
</script>

<style lang="scss" scoped>
.node-attachment {
  margin-top: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:hover,
  &.selected {
    border: 1px solid $color-primary;
  }
}

.loadingMode {
  cursor: pointer;
  .loadingBlock{
    position: relative;
    .textPart{
      padding: 8px 16px;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    .processBar{
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background-color: $brand-1;
      z-index: 0;
    }
  }
}

.card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;

    // 改代码为了去除因代码换行引起的空格
    .leftPart {
      font-size: 0;
      span {
        font-size: 14px;
      }
    }
    .namePart {
      padding: 0 4px;
    }

    .size {
      color: #999;
    }

    .icon {
      cursor: pointer;

      &:hover{
        color:  $color-primary;
      }
    }
  }

  .card-body {
    display: flex;
    padding: 12px;
    justify-content: center;
    border-top: 1px solid rgba(28,31,35,.08);
    iframe{
      width: 100%;
      min-height: 500px;
    }
  }
}

video,
audio,
img {
  max-width: 100%;
}

:deep(.el-image-viewer__wrapper) {
  background-color: #fff;

  .el-image-viewer__mask {
    opacity: 1;
    background: #fff;
  }
}
</style>
