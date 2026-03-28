<template>
  <div class="copyBtn">
    <MenusButton
      label="复制"
      iconName="icon-k-copy"
      :active="false"
      :labelText="'复制'"
      @btn-click="handleClick"
    ></MenusButton>
  </div>

</template>

<script>
import MenusButton from "../menusButton.vue";
import copy from "../../utils/copy-to-clipboard.js";
import { ElMessage } from "element-plus";
import { inject } from "vue";
export default {
  name: "copy",
  components: { MenusButton },
  props: {
    editor: Object
  },
  setup(props, context) {
    const emitToRoot = inject("emitToRoot");

    const handleClick = () => {
      try {
        const htmlContent = props.editor.getHTML();
        const textContent = props.editor.getText();

        // 创建包含两种格式的数据对象
        const clipboardData = [
          { format: "text/html", text: htmlContent },
          { format: "text/plain", text: textContent }
        ];

        const success = copy(clipboardData, () => {
          emitToRoot("event", { type: "copy" });

          ElMessage.success("复制成功");
        });

        if (!success) {
          ElMessage.error("复制失败");
        }
      } catch (error) {
        ElMessage.error("复制失败");
      }
    };

    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>
.copyBtn {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #202224;
  &:hover {
    cursor: pointer;
    background-color: #EBF0F5;
  }
}
</style>
