import { nextTick } from "vue";
import { TextSelection } from "@tiptap/pm/state";
import { useEditorStore } from "@/store/index.js";

export default function () {
  // 内容区域可滚动的距离，计算方式为内容区域的总宽度减去内容区域本身的宽度
  let contentMoveLength;
  // 滑块可滑动的距离，计算方式为整个滚动条宽度度减去滑块本身的宽度
  let barMoveLength;
  let tableWidth, ctx, canvas;
  let hasBoundMouseEvent = false;// canvas是否已经绑定了鼠标事件
  // 滚动条的位置和大小信息
  const scrollState = {
    barWidth: 50,
    barX: 0
  };
  // 创建整个滚动条
  function drawRect(color) {
    ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    ctx.fillStyle = color || "#dedee0";
    ctx.fillRect(scrollState.barX, 0, scrollState.barWidth, canvas.height);
  }
  function addEventToScroll(scrollContent, contentWidth, canvas, fatherDom, editor) {
    const table = scrollContent.querySelector("table");
    // 指示鼠标左键是否处于按下状态的变量，在滑块上按下鼠标左键时设为true，在页面上任意位置松开时设回false
    // 由于鼠标拖动滑块时可能会离开滑块，所以mouseup和mousemove事件是注册在window上的
    // 在mousemove事件处理程序中，会检查该变量，以确定当前是否在拖动滑块
    let mouseHeld = false;
    // 记录上一次mousemove事件发生时，鼠标的X轴位置，每次发生mousemove事件时，跟上一次作比较，确定需要滚动多少距离
    let previousClientX = 0;
    // 滑块可滑动的距离，计算方式为整个滚动条宽度度减去滑块本身的宽度
    barMoveLength = canvas.width - scrollState.barWidth;
    // 内容区域可滚动的距离，计算方式为内容区域的总宽度减去内容区域本身的宽度
    contentMoveLength = scrollContent.scrollWidth - contentWidth;
    // 为滑块注册鼠标按下事件处理程序，因为只有在滑块上按下鼠标左键时，才算开始拖动滑块

    const mouseMove = (e) => {
      if (mouseHeld) {
        // 相对滑动距离计算依据为滑块滑动距离占总可滑动距离的比应与内容滚动距离占总可滚动距离的比相等
        scrollToRelative((e.clientX - previousClientX) * contentMoveLength / barMoveLength);
        previousClientX = e.clientX;
      }
    };
    const mouseUp = () => {
      mouseHeld = false;
      const posObj = editor.state.selection.$from;
      if (editor.editable && posObj) {
        editor.dispatch(editor.state.tr.setSelection(new TextSelection(
          posObj
        )));
      }

      // 让页面恢复可选择
      document.body.classList.remove("stickyScroll-unselectable");
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
    hasBoundMouseEvent = true;// 已经绑定过事件，用于解决粘贴表格时不绑定event的bug
    canvas.addEventListener("mousedown", function (e) {
      // 演示模式的扩大系数1.8
      const presentationCoefficient = Number(useEditorStore().isPresentationMode) * 0.8 + 1;
      if (e.offsetX > scrollState.barX * presentationCoefficient && e.offsetX < (scrollState.barX + scrollState.barWidth) * presentationCoefficient) {
        mouseHeld = true;
        previousClientX = e.clientX;
        // 防止页面因为鼠标的拖动而选择上了文本或其他元素
        document.body.classList.add("stickyScroll-unselectable");
        // 鼠标拖动时可能离开滑块，所以mousemove事件也注册在document上
        document.addEventListener("mousemove", mouseMove);
        // 鼠标左键松开时可能不在滑块上，所以mouseup事件注册在document上
        document.addEventListener("mouseup", mouseUp);
      }
    });
    const wheelFun = (e) => {
      const contentWidthPadding = parseInt(window.getComputedStyle(scrollContent).paddingLeft) + parseInt(window.getComputedStyle(scrollContent).paddingRight);
      const contentWidth = scrollContent.clientWidth - contentWidthPadding;// 需要减去padding-left

      // 有滚动条出现且双指在触摸板上移动的x大于y才触发,鼠标没有x向，因此不必区分触摸板与鼠标，有x就是触摸板
      if (contentWidth < (scrollContent.scrollWidth - contentWidthPadding) && Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
        scrollToRelative(Number(e.wheelDeltaX) === 0 ? 0 : Number(e.wheelDeltaX) > 0 ? -50 : 50);
        e.preventDefault();
        e.stopPropagation();
      }
    };
    fatherDom.onwheel = wheelFun;

    // 将内容区域滚动到某一绝对位置
    function scrollTo(left) {
      if (left < 0) {
        scrollContent.scrollLeft = 0;
      } else if (left > contentMoveLength) {
        scrollContent.scrollLeft = contentMoveLength;
      } else {
        scrollContent.scrollLeft = left;
      }
      // 设置滑块的位置，这是通过设置滑块上面的大幅度向上滚动点击区域的宽度实现的
      // 滑块位置计算依据为滑块距左侧距离占总可滑动距离的比应与内容区域距左侧距离占总可滚动距离的比相等
      if (scrollContent.scrollLeft >= (table.offsetWidth - scrollContent.offsetWidth)) { // 在最右侧
        scrollState.barX = canvas.width - scrollState.barWidth;
      } else if (scrollContent.scrollLeft === 0) {
        scrollState.barX = 0;
      } else {
        scrollState.barX = scrollContent.scrollLeft * barMoveLength / contentMoveLength;
      }
      drawRect();
    }

    // 将内容区域滚动某一相对距离
    function scrollToRelative(relative) {
      scrollTo(scrollContent.scrollLeft + relative);
    }
  }
  function initScrollTool(scrollContent, fatherDom, editor) {
    canvas = document.createElement("canvas");
    canvas.className = "stickyScroll-scrollTrack";
    canvas.width = 1000;
    fatherDom.appendChild(canvas);

    nextTick(() => {
      if (fatherDom?.parentElement?.tagName === "TD") {
        drawRect("#00000000");
        return;
      }

      const contentWidthPadding = parseInt(window.getComputedStyle(scrollContent).paddingLeft) + parseInt(window.getComputedStyle(scrollContent).paddingRight);
      const contentWidth = scrollContent.clientWidth - contentWidthPadding;// 需要减去padding-left
      tableWidth = scrollContent.querySelector("table").clientWidth;
      const newScrollBarWidth = parseInt((contentWidth / tableWidth) * canvas.width);
      // 防止因为删除其他元素重新渲染导致的无限回调
      // hasBoundMouseEvent是为了解决粘贴表格时因newScrollBarWidth === parseInt(scrollState.barWidth)为true导致没有绑定事件的问题
      if (newScrollBarWidth === parseInt(scrollState.barWidth) && hasBoundMouseEvent) {
        return;
      }
      scrollState.barWidth = newScrollBarWidth < 50 ? 50 : newScrollBarWidth;
      if (contentWidth === scrollContent.scrollWidth - contentWidthPadding) {
        drawRect("#00000000");
      } else {
        drawRect();
      }
      addEventToScroll(scrollContent, contentWidth, canvas, fatherDom, editor);
    });
  }
  function updateScrollTool(fatherDom, scrollContent) {
    if (!fatherDom.parentElement) return;
    if (fatherDom.parentElement.tagName === "TD") {
      drawRect("#00000000");
      return;
    }
    const newCanvasWidth = fatherDom.querySelector("canvas").clientWidth;
    const newTableWidth = fatherDom.querySelector("table").clientWidth;
    if (newCanvasWidth === canvas.width && newTableWidth === tableWidth) {
      return;
    }
    canvas.width = newCanvasWidth;
    const contentWidthPadding = parseInt(window.getComputedStyle(scrollContent).paddingLeft) + parseInt(window.getComputedStyle(scrollContent).paddingRight);
    const contentWidth = scrollContent.clientWidth - contentWidthPadding;// 需要减去padding-left
    const scrollBarWidth = parseInt((contentWidth / newTableWidth) * canvas.width);
    if (contentWidth >= scrollContent.scrollWidth - contentWidthPadding) {
      drawRect("#00000000");
      return;
    }
    if (scrollBarWidth < 50) {
      scrollState.barWidth = 50;
    }
    scrollState.barWidth = scrollBarWidth;
    // 内容区域可滚动的距离，计算方式为内容区域的总宽度减去内容区域本身的宽度
    contentMoveLength = scrollContent.scrollWidth - contentWidth;
    // 滑块可滑动的距离，计算方式为整个滚动条宽度度减去滑块本身的宽度
    barMoveLength = canvas.width - scrollState.barWidth;
    drawRect();
  }
  return {
    initScrollTool,
    updateScrollTool
  };
}
