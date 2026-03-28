<template>
  <node-view-wrapper class="node-code-block">
    <div class="header"
      :class="{ active: isShow }">
      <geelibPopover
        v-model:value="selectedLanguage"
        :width="160"
        :options="languages"
        showSearch
        trigger="click"
        @show="() => isShow = true"
        @hide="() => isShow = false">
      </geelibPopover>

      <div class="row">
        <span class="btn" @click="autoWrapLine = !autoWrapLine">
          <svg-icon icon-class="collapse" v-if="autoWrapLine"></svg-icon>
          <svg-icon icon-class="wrapline" v-else></svg-icon>
          {{ autoWrapLine ? '取消': ''}}自动换行
        </span>

        <el-divider direction="vertical" />

        <span class="btn" @click="handleCopy">
          <svg-icon icon-class="copy"></svg-icon>
          复制
        </span>
      </div>
    </div>

    <pre ref="codeRef" :class="{ autoWrapLine }"><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup name="codeBlockComponent">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { ElMessage } from "element-plus";
import { ref, computed } from "vue";
import copyToClipboard from "../../utils/copy-to-clipboard.js";
import geelibPopover from "@/components/geelibPopover.vue";
import SvgIcon from "@/components/svgIcon.vue";

const props = defineProps(nodeViewProps);

const languages = [{ label: "auto", value: "auto" }].concat(props.extension.options.lowlight.listLanguages().map((el) => {
  return {
    label: el,
    value: el
  };
}));

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language || "auto";
  },
  set(val) {
    props.updateAttributes({ language: val });
  }
});

const isShow = ref(false);

const codeRef = ref();
function handleCopy() {
  copyToClipboard(codeRef.value.innerText, () => ElMessage.success("复制成功"));
}

const autoWrapLine = computed({
  get() {
    return props.node.attrs.autoWrapLine || false;
  },
  set(val) {
    props.updateAttributes({ autoWrapLine: val });
  }
});

</script>

<style lang="scss" scoped>
.node-code-block {
  position: relative;
  margin-top: 0.75rem;
  background: #F8F9FA;
  border: 1px solid $gray-3;
  border-radius: 4px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px 0;
    visibility: hidden;
    opacity: 0;
  }

  .header.active,
  &:hover .header {
    visibility: visible;
    opacity: 1;
  }
}

.row {
  display: flex;
  align-items: center;
}

.btn {
  padding: 0 8px;
  font-size: 14px;
  color: $font-2;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 4px;
  line-height: 22px;
  display: flex;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  &:hover {
    background-color: $gray-2;
  }
}

pre {
  padding-top: 0px !important;
}

pre code > div {
  white-space: pre !important;
}

pre.autoWrapLine code > div {
  white-space: pre-wrap !important;
}
</style>
