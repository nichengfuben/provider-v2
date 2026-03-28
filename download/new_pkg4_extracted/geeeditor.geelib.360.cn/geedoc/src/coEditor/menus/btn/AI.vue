<template>
  <!-- @mousedown.prevent 防止选中文本失去选中效果 -->
  <div class="btn ai"
    :class="{
      'theme-blue': theme === 'blue'
    }"
    @click="handleClick"
    @mousedown.prevent>
    <svg-icon icon-class="ai"></svg-icon>
    <span class="text">AI编辑</span>
  </div>
</template>

<script>
import { useEditorStore } from "@/store/index.js";
import svgIcon from "@/components/svgIcon.vue";

export default {
  name: "ai",
  props: {
    editor: Object,
    theme: {
      type: String,
      default: "white" // white  blue
    },
    isSelection: { // ai的上下文传入selection
      type: Boolean,
      default: false
    }
  },
  components: {
    svgIcon
  },
  setup(props) {
    const editorStore = useEditorStore();

    const handleClick = () => {
      const state = props.editor.state;

      editorStore.$patch({
        aiPopupConfig: {
          show: true,
          from: props.isSelection ? state.selection.from : null,
          to: props.isSelection ? state.selection.to : null
        }
      });
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  padding: 3px;
  box-sizing: border-box;
  color: $color-primary;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.theme-blue {
  border-radius: 8px;
  background: linear-gradient(270deg, #2781FF 0%, #6918F6 100%), var(---text-color-bg-default, rgba(255, 255, 255, 0.00));
  color: #fff;
  padding: 6px 8px;
}

.text {
  font-size: 14px;
  margin-left: 4px;
}
</style>
