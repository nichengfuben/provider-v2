<template>
  <bubble-menu
    :editor="editor"
    :shouldShow="shouldShow"
    :tippyOptions="{ zIndex: 3000, maxWidth: 'none',appendTo: () => bodyElement }">
    <div class="btnlist">

      <MenusButton
        label="向下插入一行"
        iconName="icon-k-addRow"
        @btn-click="addRowAfter"
      ></MenusButton>

      <MenusButton
        label="向后插入一列"
        iconName="icon-k-addcolumn"
        @btn-click="addColumnAfter"
      ></MenusButton>

      <el-divider direction="vertical" />

      <MenusButton v-if="!isMergedCell"
        label="合并单元格"
        iconName="icon-k-mergecell"
        @btn-click="mergeCells"
      ></MenusButton>

      <MenusButton v-if="isMergedCell"
        label="分离单元格"
        iconName="icon-k-unmergecell"
        @btn-click="splitCell"
      ></MenusButton>

      <MenusButton v-if="isFirstRowSelected"
        label="设置(或取消)标题行"
        iconName="icon-k-table-row-header"
        @btn-click="toggleHeaderRow"
      ></MenusButton>

      <MenusButton v-if="isFirstColumnSelected"
        label="设置(或取消)标题列"
        iconName="icon-k-table-column-header"
        :active="editor.isActive('tableHeader')"
        @btn-click="toggleHeaderColumn"
      ></MenusButton>

      <el-divider direction="vertical" />

      <tableAlignGroup ref="tableAlignGroupRef" :editor="editor"></tableAlignGroup>

      <el-divider direction="vertical" />

      <bold :editor="editor"></bold>
      <italic :editor="editor"></italic>
      <underline :editor="editor"></underline>
      <strikeBtn :editor="editor"></strikeBtn>
      <!-- <textColorGroup :editor="editor"></textColorGroup>
      <backgroundColorGroup :editor="editor"></backgroundColorGroup> -->

      <el-divider direction="vertical" />

      <MenusButton
        label="删除当前行"
        iconName="icon-k-deleteline"
        @btn-click="deleteRow"
      ></MenusButton>

      <MenusButton
        label="删除当前列"
        iconName="icon-k-deletecolumn"
        @btn-click="deleteColumn"
      ></MenusButton>
    </div>
  </bubble-menu>
</template>

<script>
import { BubbleMenu } from "@tiptap/vue-3";
import MenusButton from "./menusButton.vue";
import { isActive } from "@tiptap/core";
import { isCellSelection, isTableFirstRowSelected, isTableFirstColumnSelected, selectCellIsMerged } from "../utils/table";
import tableAlignGroup from "./btn/tableAlignGroup.vue";
import bold from "./btn/bold.vue";
import italic from "./btn/italic.vue";
import underline from "./btn/underline.vue";
import strikeBtn from "./btn/strike.vue";
// import textColorGroup from "./btn/textColorGroup.vue";
// import backgroundColorGroup from "./btn/backgroundColorGroup.vue";
import { computed, ref } from "vue";
import { selectNowColumn, selectNowRow } from "@/coEditor/utils/table.js";

export default {
  name: "tableMenu",
  props: {
    editor: Object
  },
  components: {
    BubbleMenu,
    MenusButton,
    tableAlignGroup,
    bold,
    italic,
    underline,
    strikeBtn
    // textColorGroup,
    // backgroundColorGroup
  },
  setup(props) {
    const bodyElement = ref(document.querySelector("body"));
    function shouldShow({ state }) {
      const result = isActive(state, "table") && isCellSelection(state.selection);
      return result;
    }

    const mergeCells = () => props.editor.chain().focus().mergeCells().run();
    const splitCell = () => props.editor.chain().focus().splitCell().run();
    const deleteRow = () => {
      // 删除行后自动选中下一行
      props.editor.chain().focus().deleteRow().run();
      selectNowRow(props.editor.state, props.editor.view);// 选中当前光标所在行
    };
    const deleteColumn = () => {
      // 删除列后自动选中下一列
      props.editor.chain().focus().deleteColumn().run();
      selectNowColumn(props.editor.state, props.editor.view);// 选中当前光标所在列
    };
    const toggleHeaderColumn = () => props.editor.commands.toggleHeaderColumn();
    const toggleHeaderRow = () => props.editor.commands.toggleHeaderRow();
    const addColumnAfter = () => props.editor.commands.addColumnAfter();
    const addRowAfter = () => props.editor.commands.addRowAfter();

    const tableAlignGroupRef = ref();

    const isFirstRowSelected = computed(() => {
      return isTableFirstRowSelected(props.editor.state.selection);
    });

    const isFirstColumnSelected = computed(() => {
      return isTableFirstColumnSelected(props.editor.state.selection);
    });

    const isRowSelection = computed(() => {
      const selection = props.editor.state?.selection;
      return !!(selection && isCellSelection(selection) && selection?.isRowSelection());
    });

    const isColSelection = computed(() => {
      const selection = props.editor.state?.selection;
      return !!(selection && isCellSelection(selection) && selection?.isColSelection());
    });

    const isMergedCell = computed(() => {
      const selection = props.editor.state?.selection;
      return !!(selection && isCellSelection(selection) && selectCellIsMerged(selection));
    });

    return {
      shouldShow,
      mergeCells,
      splitCell,
      deleteRow,
      deleteColumn,
      toggleHeaderColumn,
      toggleHeaderRow,
      addColumnAfter,
      addRowAfter,

      isFirstRowSelected,
      isFirstColumnSelected,
      isRowSelection,
      isColSelection,
      isMergedCell,
      tableAlignGroupRef,
      bodyElement
    };
  }
};
</script>

<style lang="scss" scoped>
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
