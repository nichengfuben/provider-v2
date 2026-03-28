<template>
  <div class="gridSelect">
    <div class="tableSizeSelectorHeader">
      <div>插入表格</div>
      <div>
        <span>{{isHover ? `${hoverCell.y} x ${hoverCell.x}` : ""}}</span>
      </div>
    </div>

    <div
      :style="baseStyles"
      @mouseleave="resetHoverCell">
      <template v-for="y in rows">
        <div
          v-for="x in cols"
          :key="`${x}-${y}`"
          class="cell"
          :style=" `width: ${cellSize}px;height: ${cellSize}px`"
          :class="{
            active : x <= activeCell.x && y <= activeCell.y,
            hover: isHover && x <= hoverCell.x && y <= hoverCell.y,
          }"
          @click="handleClick(x, y)"
          @mouseenter="handleHover(x, y)"
        ></div>
      </template>
    </div>

  </div>
</template>

<script>
import { reactive, computed } from "vue";
export default {
  name: "gridSelect",
  props: {
    rows: {
      type: Number,
      default: 8
    },
    cols: {
      type: Number,
      default: 10
    },
    cellSize: {
      type: Number,
      default: 20
    }
  },
  emits: ["onSelect"],
  setup(props, context) {
    const baseStyles = computed(() => {
      return {
        display: "grid",
        gridGap: "4px",
        gridTemplateColumns: Array(props.cols).fill(`${props.cellSize}px`).join(" "),
        margin: "8px 0"
      };
    });

    const activeCell = reactive({
      x: -1,
      y: -1
    });

    const hoverCell = reactive({
      x: -1,
      y: -1
    });

    const isHover = computed(() => {
      return hoverCell.x !== -1 && hoverCell.y !== -1;
    });

    function resetHoverCell() {
      hoverCell.x = -1;
      hoverCell.y = -1;
    }

    function handleHover(x, y) {
      hoverCell.x = x;
      hoverCell.y = y;
    }

    function handleClick(x, y) {
      context.emit("onSelect", {
        rows: y,
        cols: x
      });
    }

    return {
      baseStyles,
      activeCell,
      hoverCell,
      isHover,
      resetHoverCell,
      handleHover,
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>
.gridSelect {
  padding: 4px;
  .tableSizeSelectorHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: $font-1;
  }
}

.cell {
  background: $gray-2;
  cursor: pointer;
  border-radius: 4px;

  &.active {
    background: $brand-3;
  }
  &.hover {
    background: $brand-3;
  }

}
</style>
