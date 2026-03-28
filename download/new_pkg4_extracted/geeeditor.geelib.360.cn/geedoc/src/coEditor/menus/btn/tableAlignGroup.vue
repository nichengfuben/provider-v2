<template>
  <subMenusButton
    iconName="icon-k-align"
    popperPadding="8px"
    ref="subMenusRef"
  >
    <div class="list">
      <div class="menuItem" v-show="cellContentHaveText" @click="handleClickTextAlign('left')" :class="{ active: isActiveTextAlign('left') }">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-align-left"></i>
          左对齐
        </div>
        <i v-show="isActiveTextAlign('left')" class="iconfont-knowledge icon-k-correct"></i>
      </div>
      <div class="menuItem" v-show="cellContentHaveText" @click="handleClickTextAlign('center')" :class="{ active: isActiveTextAlign('center') }">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-align-center"></i>
          居中对齐
        </div>
        <i v-show="isActiveTextAlign('center')" class="iconfont-knowledge icon-k-correct"></i>
      </div>
      <div class="menuItem" v-show="cellContentHaveText" @click="handleClickTextAlign('right')" :class="{ active: isActiveTextAlign('right') }">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-align-right"></i>
          右对齐
        </div>
        <i v-show="isActiveTextAlign('right')" class="iconfont-knowledge icon-k-correct"></i>
      </div>
      <el-divider v-show="cellContentHaveText" />

      <div class="menuItem" @click="handleClickVerticalAlign('top')" :class="{ active: isActiveVerticalAlign('top') }">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-align-top"></i>
          顶部对齐
        </div>
        <i v-show="isActiveVerticalAlign('top')" class="iconfont-knowledge icon-k-correct"></i>
      </div>
      <div class="menuItem" @click="handleClickVerticalAlign('middle')" :class="{ active: isActiveVerticalAlign('middle') }">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-align-middle"></i>
          垂直对齐
        </div>
        <i v-show="isActiveVerticalAlign('middle')" class="iconfont-knowledge icon-k-correct"></i>
      </div>
      <div class="menuItem" @click="handleClickVerticalAlign('bottom')" :class="{ active: isActiveVerticalAlign('bottom') }">
        <div class="leftPart">
          <i class="iconfont-knowledge icon-k-align-bottom"></i>
          底部对齐
        </div>
        <i v-show="isActiveVerticalAlign('bottom')" class="iconfont-knowledge icon-k-correct"></i>
      </div>
    </div>
  </subMenusButton>
</template>

<script>
import subMenusButton from "../subMenusButton.vue";
import { ref } from "vue";

export default {
  name: "tableAlignGroup",
  props: {
    editor: Object
  },
  components: {
    subMenusButton
  },
  setup(props) {
    const subMenusRef = ref();

    function closeTooltip() {
      subMenusRef.value.tooltipInstance?.hide();
    }

    const handleClickTextAlign = (type) => {
      props.editor.chain().focus().setTextAlign(type).run();
      closeTooltip();
    };

    const handleClickVerticalAlign = (type) => {
      props.editor.commands.setCellAttribute("verticalAlign", type);
      closeTooltip();
    };

    const cellContentHaveText = ref(true);// 当前单元格内没有文字类内容，则不显示textalign按钮
    const isActiveTextAlign = (type) => {
      type = type === "left" ? "" : type;
      // 当前单元格内有可能是列表等隔着一层，因此统一手动获取，通过dom上的textAlign判断激活的是哪个
      const ranges = props.editor.state.selection.ranges;
      let hasText = false;// 本次选择的单元格是否有文字类型，用于决定是否显示文字对齐
      let textAlignResult = "";// 以最后一个有p或h标签的textAlign为准

      ranges.forEach((c) => {
        const nowDom = props.editor.view.nodeDOM(c.$from.pos);
        if (!nowDom) return false;

        const cellDom = nowDom.parentNode;
        const sonpOrhDom = cellDom.querySelector("p,h1,h2,h3,h4,h5,h6");
        if (sonpOrhDom) { // p标签或者h只要有一个就行
          hasText = true;
          textAlignResult = sonpOrhDom.style.textAlign;
        }
      });
      cellContentHaveText.value = hasText;
      return textAlignResult === type;// 以最后一个有 P 或 H 的单元格的textAlign为准
    };

    const isActiveVerticalAlign = (type) => {
      if (type === "top") {
        return props.editor.isActive({ verticalAlign: null }) || props.editor.isActive({ verticalAlign: "top" });
      } else {
        return props.editor.isActive({ verticalAlign: type });
      }
    };

    return {
      handleClickTextAlign,
      isActiveTextAlign,
      handleClickVerticalAlign,
      isActiveVerticalAlign,
      cellContentHaveText,
      subMenusRef
    };
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-divider--horizontal){
  margin: 1px 0;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menuItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 14px;
  color: $font-1;
  padding: 9px 8px;
  line-height: 22px;
  width: 154px;

  i {
    font-size: 16px;
  }

  &:hover {
    background-color: $gray-1;
    border-radius: 4px;
  }

  &.active {
    background-color: $brand-1;
    color: $color-primary;
    border-radius: 4px;
  }
}
</style>
