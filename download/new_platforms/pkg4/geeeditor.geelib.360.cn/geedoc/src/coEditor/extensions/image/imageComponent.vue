<template>
  <node-view-wrapper class="node-image" :class="{ selected: editor.isFocused && selected }">
    <div class="loading" v-if="!src">
      {{fileName ? `正在上传${fileName}中...` : ''}}
    </div>
    <div class="preview" v-loading="loadingImg" :style="{ textAlign,  maxWidth: '100%' }" v-else>
      <resizeTools
        :locktRatio="true"
        :disableResizeTool="disableResizeTool"
        :width="node.attrs.width"
        :height="node.attrs.height"
        @changeSize="changeSize"
      >
        <img @click="singleClickViewPic&&previewImage(src, $event)" @dblclick="!singleClickViewPic&&previewImage(src, $event)" :src="src" :alt="alt" />
      </resizeTools>
    </div>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { ref, computed, nextTick, onBeforeUnmount, watch } from "vue";
import { ElMessage } from "element-plus";
import resizeTools from "../../components/resizeTools.vue";
import PubSub from "pubsub-js";
import { useEditorStore } from "@/store/index.js";
import { previewImg } from "@/utils/utils.js";

export default {
  name: "imageComponent",
  components: {
    NodeViewWrapper,
    resizeTools
  },
  props: nodeViewProps,
  setup(props) {
    const editor = props.editor;
    const updateAttributes = props.updateAttributes;
    const fileName = props.node.attrs.fileName;

    const editorStore = useEditorStore();
    const disableResizeTool = computed(() => editorStore.extensionConfig.image.disableResizeTool);

    // 默认是双击图片开启预览,因为存在左右对齐,拖拽等需要点击图片,移动端预览不存在这些问题因此使用单击预览,
    const singleClickViewPic = computed(() => editorStore.extensionConfig.image.singleClickViewPic);

    const subscription = PubSub.subscribe("imageMessage", function (_, data) {
      const { id, mes } = JSON.parse(data);
      if (props.node.attrs.id === id) {
        updateAttributes(mes);
      }
    });

    onBeforeUnmount(() => {
      PubSub.unsubscribe(subscription);
    });

    const error = computed(() => props.node.attrs.error);

    watch(() => error.value, () => {
      props.deleteNode();
    });

    const src = computed(() => (props.node.attrs.src));
    const hasTriggerUpdateUrl = computed(() => (props.node.attrs.hasTriggerUpdateUrl));

    const loadingImg = ref(false);

    // 做图片的处理
    if (!hasTriggerUpdateUrl.value && src.value && typeof src.value === "string") {
      // blob为推推对话框中复制出的图片，是获取不到图片信息的，需要提示错误并删除。
      if (src.value.includes("blob")) {
        if (editor.isEditable) {
          ElMessage.error("图片粘贴失败"); // 在编辑模式触发时肯定为手动新增出现的图片，需要提示粘贴失败
        }
        // 必须加nextTick不然会阻塞页面
        nextTick(() => {
          props.deleteNode();
        });
      } else {
        const needUpdateSrc = editorStore.extensionConfig.image.needUpdateSrc;
        const uploadFromUrlFunc = editorStore.extensionConfig.image.uploadFromUrlFunc;
        if (needUpdateSrc && needUpdateSrc({ url: src.value }) && uploadFromUrlFunc) {
          loadingImg.value = true;

          uploadFromUrlFunc({
            url: src.value
          }).then((res) => {
            if (res?.downloadUrl?.length > 0) {
              updateAttributes({ src: res.downloadUrl });
            }
          }).finally(() => {
            loadingImg.value = false;
            updateAttributes({ hasTriggerUpdateUrl: true }); // 保证每个图片组件只调用一次转存接口，否则失败后每次打开都会调用
          });
        }
      }
    }

    const alt = computed(() => props.node.attrs.alt);
    const textAlign = computed(() => props.node.attrs.textAlign);

    const changeSize = (width, height) => {
      updateAttributes({ width, height });
    };

    const previewImage = (src, e) => {
      const customViewFun = editorStore.extensionConfig.image?.customViewFun;

      if (customViewFun) {
        customViewFun(src);
      } else {
        previewImg(e.target);
      }
    };

    return {
      src,
      alt,
      textAlign,
      changeSize,
      previewImage,
      loadingImg,
      fileName,
      disableResizeTool,
      singleClickViewPic
    };
  }
};
</script>

<style lang="scss" scoped>
.node-image {
  margin-top: 0.75rem;
  &:hover,
  &.selected  {
    .loading{
      border: 1px solid $color-primary;
    }
  }
  .loading {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 16px;
    white-space: nowrap;
    text-align: center;
  }
  .preview {
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>
