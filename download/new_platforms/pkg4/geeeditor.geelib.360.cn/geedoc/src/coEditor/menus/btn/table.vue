<template>
  <subMenusButton
    placement="bottom"
    iconName="icon-k-table"
    :disabled="disabeldTable"
    :showArrow="false">

    <gridSelect @onSelect="createTable"></gridSelect>
  </subMenusButton>
</template>

<script setup name="tableBtn">
import subMenusButton from "../subMenusButton.vue";
import gridSelect from "../quickMenu/gridSelect.vue";
import { computed } from "vue";

const props = defineProps({
  editor: Object
});

const disabeldTable = computed(() => props.editor.isActive("table")); // 表格中不允许添加表格

const createTable = ({ rows, cols }) => {
  props.editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
};

</script>

<style lang="scss" scoped>
</style>
