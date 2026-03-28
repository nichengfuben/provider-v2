<!-- 通用的resize组件，使用方法，将你的内容以默认slot的方式传进来就ok了,支持最大宽度入参，若没有传入，默认初始时宽度为最大 -->
<template>
  <div class="wrap-box" @mouseover="mouseoverState = true" @mouseout="mouseoverState = false" ref="wrapBoxRef">
    <div class="resizeBox" style="height:auto" ref="resizeBoxRef">
      <div class="verticalBox">
        <div class="realContent" ref="realResizeRef" :style="{'border-color':disableTool?'#ddd':mouseoverState?'#4787f0':'#ddd'}">
          <slot></slot>
        </div>
        <div class="resizeHorizontalLine" v-show="!disableTool&!locktRatio">
          <div class="blueLine"></div>
        </div>
      </div>
      <div class="resizeVerticalLine" v-show="!disableTool&!locktRatio">
        <div class="blueLine"></div>
      </div>
      <div class="circle" ref="circleRefRB" v-show="!disableTool&mouseoverState" style="cursor: nwse-resize;" ></div>
      <div class="circle" ref="circleRefLT" v-show="!disableTool&mouseoverState" style="cursor: nwse-resize;left: -4px; top: -4px;"></div>
      <div class="circle" ref="circleRefLB" v-show="!disableTool&mouseoverState" style="cursor: nesw-resize;left: -4px; bottom: -4px;"></div>
      <div class="circle" ref="circleRefRT" v-show="!disableTool&mouseoverState" style="cursor: nesw-resize;right: -2px; top: -4px;"></div>

    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
const resizeBoxRef = ref();
const realResizeRef = ref();
const circleRefRB = ref();// 右下角的圈
const circleRefLB = ref();// 左下角的圈
const circleRefRT = ref();// 右上角的圈
const circleRefLT = ref();// 左上角的圈
const wrapBoxRef = ref(null);
const mouseoverState = ref(false);

const props = defineProps({
  minWidthAndHeight: {
    type: Number,
    default: 50
  },
  width: {
    type: [Number, String],
    default: undefined
  },
  height: {
    type: [Number, String],
    default: undefined
  },
  locktRatio: { // 锁定宽高比，高通过宽计算得来
    type: Boolean,
    default: false
  },
  disableResizeTool: {
    type: Boolean,
    default: false
  }
});
const disableTool = ref(props.disableResizeTool);

onMounted(() => {
  let img = realResizeRef.value.querySelector("img");
  if (img) {
    img.onload = () => {
    // 图片加载完成后的操作
      if (img && img.offsetWidth === 0) { // 此时为破损图片，隐藏拖拽插件
        disableTool.value = true;
      }
      img = null;
    };
    img.onerror = function () { // 此时为破损图片，隐藏拖拽插件
      disableTool.value = true;
      img = null;
    };
  }
});
const emits = defineEmits(["changeSize"]);
watch(() => props.width, (val) => {
  resizeBoxRef.value.style.width = typeof (val) === "number" ? (val + "px") : val;
});
if (!props.locktRatio) {
  watch(() => props.height, (val) => {
    resizeBoxRef.value.style.height = typeof (val) === "number" ? (val + "px") : val;
  });
}
let iframes;

// 监听编辑区大小改变从而动态改变图片的max-width以确保图片在超级大时以内容区最大宽度为宽度。
let resizeObserver;
const watchContentWidthChangeAndSetMaxWidth = (contentDom) => {
  resizeObserver = new ResizeObserver((entries) => {
    if (resizeBoxRef.value) {
      resizeBoxRef.value.style.maxWidth = entries[0].target.clientWidth - 10 + "px";
    }
  });
  resizeObserver.observe(contentDom);
};

// 用于在拖拽松开鼠标时计算wrapBox的高度与宽度
let wrapBoxRefPaddingTopAddBottom;
let wrapBoxRefPaddingLeftAddRight;

onMounted(() => {
  // 用于在拖拽松开鼠标时计算wrapBox的高度
  wrapBoxRefPaddingTopAddBottom = parseInt(window.getComputedStyle(wrapBoxRef.value).paddingTop) + parseInt(window.getComputedStyle(wrapBoxRef.value).paddingBottom);
  wrapBoxRefPaddingLeftAddRight = parseInt(window.getComputedStyle(wrapBoxRef.value).paddingLeft) + parseInt(window.getComputedStyle(wrapBoxRef.value).paddingRight);

  iframes = document.getElementsByTagName("iframe");

  watchContentWidthChangeAndSetMaxWidth(wrapBoxRef.value.parentNode);
  const fatherDom = wrapBoxRef.value.parentNode.parentNode.parentNode;
  if (fatherDom?.tagName === "TD" || fatherDom?.tagName === "TH") {
    if (typeof props.width === "number" && fatherDom.clientWidth < props.width) {
      emits("changeSize", "100%", props.locktRatio ? "auto" : parseInt(resizeBoxRef.value.style.height));
    }
  }

  resizeBoxRef.value.style.width = typeof (props.width) === "number" ? (props.width + "px") : props.width;
  if (!props.locktRatio) {
    resizeBoxRef.value.style.height = typeof (props.height) === "number" ? (props.height + "px") : props.height;
  }
  dragResize();
});
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
const sizeChange = () => {
  const width = resizeBoxRef.value.style.width.indexOf("%") > -1 ? resizeBoxRef.value.style.width : parseInt(resizeBoxRef.value.style.width);
  emits("changeSize", width, props.locktRatio ? "auto" : parseInt(resizeBoxRef.value.style.height));
};
const dragResize = function () {
  const containerEl = wrapBoxRef.value;
  const bodyWrapEl = document.getElementsByTagName("body")[0];

  const resizeVerticalEl = containerEl.querySelector(".resizeVerticalLine");
  const resizeHorizontalEl = containerEl.querySelector(".resizeHorizontalLine");
  // 防止因拖拽过程中，进入iframe导致bug
  function stopIframeEvent(val) {
    for (const i in iframes) {
      if (typeof iframes[i] === "object") {
        iframes[i].style["pointer-events"] = val;
      }
    }
  }

  function cancelDrag() {
    // 父级取消拖拽时才改变大小，避免在拖拽过程中重新渲染整个内容区引起bug
    wrapBoxRef.value.style.height = parseInt(resizeBoxRef.value.offsetHeight) + wrapBoxRefPaddingTopAddBottom + "px";
    wrapBoxRef.value.style.width = parseInt(resizeBoxRef.value.offsetWidth) + wrapBoxRefPaddingLeftAddRight + "px";

    stopIframeEvent("auto");
    bodyWrapEl.onmousemove = null;
    bodyWrapEl.onmouseup = null;
    bodyWrapEl.onmouseleave = null;
    resizeHorizontalEl.classList.remove("active");
    resizeVerticalEl.classList.remove("active");
    realResizeRef.value.style["border-color"] = "#ddd";
    sizeChange();
  }

  // 高度更改线条鼠标按下事件
  resizeVerticalEl.onmousedown = function (e) {
    stopIframeEvent("none");
    // 颜色改变提醒
    resizeVerticalEl.classList.add("active");
    const startY = e.clientY;
    const startHeight = resizeBoxRef.value.offsetHeight;

    // 父级先不变大小，避免在拖拽过程中重新渲染整个内容区引起bug
    wrapBoxRef.value.style.height = startHeight + wrapBoxRefPaddingTopAddBottom + "px";

    // 鼠标拖动事件
    let moveLen;
    bodyWrapEl.onmousemove = function (e) {
      const endY = e.clientY;
      moveLen = endY - startY; // （endY-startY）=移动的距离。resize.top+移动的距离=上部分区域最后的宽度
      if (resizeBoxRef.value.offsetHeight <= props.minWidthAndHeight && moveLen < 0) {
        resizeBoxRef.value.style.height = props.minWidthAndHeight + "px";
        cancelDrag();
        return;
      }
      resizeBoxRef.value.style.height = startHeight + moveLen + "px";
    };
    bodyWrapEl.onmouseleave = function () {
      cancelDrag();
    };
    // 鼠标松开事件
    bodyWrapEl.onmouseup = function (evt) {
      cancelDrag();
      resizeVerticalEl.releaseCapture && resizeVerticalEl.releaseCapture(); // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
    };
    resizeVerticalEl.setCapture && resizeVerticalEl.setCapture(); // 该函数在属于当前线程的指定窗口里设置鼠标捕获
    return false;
  };

  // 宽度更改线条鼠标按下事件
  resizeHorizontalEl.onmousedown = function (e) {
    stopIframeEvent("none");
    // 颜色改变提醒
    resizeHorizontalEl.classList.add("active");
    const startX = e.clientX;
    const startWidth = resizeBoxRef.value.offsetWidth;
    // 父级先不变大小，避免在拖拽过程中重新渲染整个内容区引起bug
    wrapBoxRef.value.style.width = startWidth + wrapBoxRefPaddingLeftAddRight + "px";
    // 鼠标拖动事件
    let moveLen;
    bodyWrapEl.onmousemove = function (e) {
      const endX = e.clientX;
      moveLen = endX - startX; // （endY-startY）=移动的距离。resize.top+移动的距离=上部分区域最后的宽度
      if (resizeBoxRef.value.offsetWidth <= props.minWidthAndHeight && moveLen < 0) {
        resizeBoxRef.value.style.width = props.minWidthAndHeight + "px";
        cancelDrag();
        return;
      }
      // 最大宽度
      const fatherWidth = wrapBoxRef.value.parentNode.parentNode.offsetWidth;
      const spaceWidth = 27;// 该值为被改变大小内容与节点父级的宽度差
      // 不允许超越节点父容器的大小，27该值为被改变大小内容与节点父级的宽度差
      if ((resizeBoxRef.value.offsetWidth + spaceWidth >= fatherWidth) && moveLen > 0) {
        resizeBoxRef.value.style.width = fatherWidth - spaceWidth;
        cancelDrag();
        return;
      }

      resizeBoxRef.value.style.width = startWidth + moveLen + "px";
    };
    bodyWrapEl.onmouseleave = function () {
      cancelDrag();
    };
    // 鼠标松开事件
    bodyWrapEl.onmouseup = function (evt) {
      cancelDrag();
      resizeHorizontalEl.releaseCapture && resizeHorizontalEl.releaseCapture(); // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
    };
    resizeHorizontalEl.setCapture && resizeHorizontalEl.setCapture(); // 该函数在属于当前线程的指定窗口里设置鼠标捕获
    return false;
  };

  const mouseDownCircleFun = function (circleType) {
    return function (e) {
      stopIframeEvent("none");
      realResizeRef.value.style["border-color"] = "#2d6cf9";
      const startX = e.clientX;
      const startY = e.clientY;

      const startWidth = resizeBoxRef.value.offsetWidth;
      const startHeight = resizeBoxRef.value.offsetHeight;
      // 父级先不变大小，避免在拖拽过程中重新渲染整个内容区引起bug
      wrapBoxRef.value.style.width = startWidth + wrapBoxRefPaddingLeftAddRight + "px";
      wrapBoxRef.value.style.height = startHeight + wrapBoxRefPaddingTopAddBottom + "px";

      // 鼠标拖动事件
      let moveLenX;
      let moveLenY;

      bodyWrapEl.onmousemove = function (e) {
        const endX = e.clientX;
        const endY = e.clientY;

        moveLenX = endX - startX; // （endY-startY）=移动的距离。resize.top+移动的距离=上部分区域最后的宽度
        moveLenY = endY - startY; // （endY-startY）=移动的距离。resize.top+移动的距离=上部分区域最后的宽度
        if (resizeBoxRef.value?.offsetWidth <= props.minWidthAndHeight && (circleType.indexOf("L") === 0 ? moveLenX > 0 : moveLenX < 0)) {
          resizeBoxRef.value.style.width = props.minWidthAndHeight + "px";
          cancelDrag();
          return;
        }
        // 锁定宽高时不限制高度
        if (!props.locktRatio && resizeBoxRef.value.offsetHeight <= props.minWidthAndHeight && (circleType.indexOf("L") === 0 ? moveLenY > 0 : moveLenY < 0)) {
          resizeBoxRef.value.style.height = props.minWidthAndHeight + "px";
          cancelDrag();
          return;
        }
        // 当宽度大于等于父容器时取父容器大小
        const fatherWidth = wrapBoxRef.value.parentNode.parentNode.offsetWidth;
        const spaceWidth = props.locktRatio ? 10 : 27;// 该值为被改变大小内容与节点父级的宽度差,locktRatio时不显示水平与竖直调节高度工具

        // 不允许超越节点父容器的大小
        if (resizeBoxRef.value.offsetWidth + spaceWidth >= fatherWidth && (circleType.indexOf("L") === 0 ? moveLenX < 0 : moveLenX > 0)) {
          resizeBoxRef.value.style.width = fatherWidth - spaceWidth;
          cancelDrag();
          return;
        }

        resizeBoxRef.value.style.width = startWidth + (circleType.indexOf("L") === 0 ? moveLenX * -1 : moveLenX) + "px";
        if (!props.locktRatio) {
          resizeBoxRef.value.style.height = startHeight + (circleType.indexOf("T") === 1 ? moveLenY * -1 : moveLenY) + "px";
        }
      };
      bodyWrapEl.onmouseleave = function () {
        cancelDrag();
      };
      // 鼠标松开事件
      bodyWrapEl.onmouseup = function () {
        cancelDrag();
        circleRefRB.value.releaseCapture && circleRefRB.value.releaseCapture(); // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      };
      circleRefRB.value.setCapture && circleRefRB.value.setCapture(); // 该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false;
    };
  };

  // 宽高更改右下圆圈鼠标按下事件
  circleRefRB.value.onmousedown = mouseDownCircleFun("RB");
  // 宽高更改右下圆圈鼠标按下事件
  circleRefRT.value.onmousedown = mouseDownCircleFun("RT");
  // 宽高更改右下圆圈鼠标按下事件
  circleRefLB.value.onmousedown = mouseDownCircleFun("LB");
  // 宽高更改右下圆圈鼠标按下事件
  circleRefLT.value.onmousedown = mouseDownCircleFun("LT");
};
</script>

<style scoped lang='scss'>
.wrap-box {
  display: inline-block;
  position: relative;
  padding: 5px;
  box-sizing: border-box;
  // width: 100%;
  flex: 1 1;

  .resizeBox {
    position: relative;
    max-width: 100%;

    .verticalBox {
      display: flex;
      height: 100%;

      .realContent {
        width: calc(100% - 3px);
        border: 1px solid #ddd;
        box-sizing: border-box;
      }

      .resizeHorizontalLine {
        width: 3px;
        cursor: e-resize;
        z-index: 10;
        display: flex;
        justify-content: flex-start;

        .blueLine {
          width: 1px;
          height: 100%;
          background-color: transparent;
        }

        &:hover,
        &.active {
          .blueLine {
            background-color: $color-primary;
          }

        }
      }

    }

  }

  .circle {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    border: 3px solid #4787f0;
    position: absolute;
    bottom: -4px;
    right: -2px;
    z-index: 11;
    background-color: white;
  }

  .resizeVerticalLine {
    width: 100%;
    height: 3px;
    cursor: s-resize;
    z-index: 10;
    display: flex;
    align-items: flex-start;

    .blueLine {
      width: 100%;
      height: 1px;
      background-color: transparent;
    }

    &:hover,
    &.active {
      .blueLine {
        background-color: $color-primary;
      }

    }
  }
}
</style>
