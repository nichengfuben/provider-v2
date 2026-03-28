<template>
  <node-view-wrapper class="node-iframe">
    <resizeTools
      v-if="hasValidSource"
      :width="node.attrs.width"
      :height="node.attrs.height"
      :disableResizeTool="disableResizeTool"
      @changeSize="changeSize">
      <subMenusButton :appendToBody="true" :btnStyle="{width:'100%',height:'100%'}">

        <iframeRefresh @handleClick="handleClickRefresh"></iframeRefresh>
        <el-divider v-if="!disableOpen" direction="vertical" />
        <iframeView v-if="!disableOpen" :url="node.attrs.url"></iframeView>
        <template v-slot:triggerDom>
          <div ref="iframWrapRef" class="iframWrap">
            <iframe
              ref="myIframRef"
              style="height: 100%;width:100%;border:0;pointer-events:none;"
              :src="node.attrs.srcdoc ? undefined : embedUrl"
              :srcdoc="node.attrs.srcdoc"
              v-bind="node.attrs.srcdoc ? { sandbox: 'allow-scripts' } : {}">
            </iframe>
          </div>
        </template>
      </subMenusButton>
    </resizeTools>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import resizeTools from "../../components/resizeTools.vue";
import { computed, onMounted, ref, nextTick } from "vue";
import subMenusButton from "../../menus/subMenusButton.vue";
import iframeView from "../../menus/btn/iframeView.vue";
import iframeRefresh from "../../menus/btn/iframeRefresh.vue";
import { useEditorStore } from "@/store/index.js";

export default {
  name: "iframeComponent",
  components: {
    NodeViewWrapper,
    resizeTools,
    subMenusButton,
    iframeView,
    iframeRefresh
  },
  props: nodeViewProps,
  setup(props) {
    const updateAttributes = props.updateAttributes;
    const myIframRef = ref();
    const iframWrapRef = ref();
    const editorStore = useEditorStore();
    const disableResizeTool = computed(() => editorStore.extensionConfig.iframe.disableResizeTool);
    const disableOpen = computed(() => editorStore.extensionConfig.iframe.disableOpen);

    // 刷新iframe，subMenusButton在使用appendToBody之后，传进去的editor实例就是去了及时性，因此挪到此处完成逻辑
    const handleClickRefresh = () => {
      // 刷新就是先置为空后恢复
      const realUrl = props.node.attrs.url;
      const realSrcdoc = props.node.attrs.srcdoc;

      if (realSrcdoc) {
        updateAttributes({ srcdoc: "" });
        nextTick(() => {
          updateAttributes({ srcdoc: realSrcdoc });
        });
      } else {
        updateAttributes({ url: "" });
        nextTick(() => {
          updateAttributes({ url: realUrl });
        });
      }
    };

    const embedUrl = computed(() => {
      // 如果有srcdoc属性，则不使用url
      if (props.node.attrs.srcdoc) {
        return null;
      }

      if (props.node.type.name === "figma") {
        return "https://www.figma.com/embed?embed_host=share&url=" + props.node.attrs.url;
      } else {
        return props.node.attrs.url;
      }
    });

    // 判断是否有有效的内容来源（url或srcdoc）
    const hasValidSource = computed(() => {
      return !!(props.node.attrs.url || props.node.attrs.srcdoc);
    });

    onMounted(() => {
      if (iframWrapRef.value) {
        // 此处为了解决在网页组件使用下一行添加，添加图片附件时，导致的将网页替换掉的bug
        // 同时解决了移动端预览时，由于网页组件太长，覆盖全屏，无法拖动父滚动条的问题
        // 同时解决了，网页点击无法删除的bug
        iframWrapRef.value.onmousedown = () => {
          myIframRef.value.style.pointerEvents = "auto";
        };
        iframWrapRef.value.onmouseleave = () => {
          myIframRef.value.style.pointerEvents = "none";
        };
      }
    });

    const changeSize = (width, height) => {
      updateAttributes({ width, height });
    };

    return {
      embedUrl,
      hasValidSource,
      changeSize,
      myIframRef,
      iframWrapRef,
      handleClickRefresh,
      disableResizeTool,
      disableOpen
    };
  }
};
</script>

<style lang="scss" scoped>
.node-iframe {
  position: relative;
  margin-top: 0.75rem;
  display: flex;
  max-width: 100%;
  background: #fff;
}

.text {
  padding: 8px 16px;
  font-size: 14px;
}

.iframWrap {
  height: 100%;
  width: 100%;
}

.btnlist {
  background-color: #fff;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid $gray-2;
  box-shadow: $shadow-4-down;

  display: flex;
  align-items: center;
}
</style>
