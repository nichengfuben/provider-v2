<template>
  <div class="toc"
    :style="{
      'padding-top': titleIsEnabled ? '50px' : '30px'
    }">
    <el-tooltip effect="dark" :content="isShrink ? '展开大纲' : '收起大纲'" placement="top">
      <svg-icon
        class="tocShrinkIcon"
        :icon-class="isShrink ? 'list' : 'double-left'"
        v-show="toc.headingList?.length"
        @click="changeTocShowOrHide()" ></svg-icon>
    </el-tooltip>
    <ul v-show="!isShrink">
      <li v-for="(item, index) in toc.headingList" :key="index"
        :style="`margin-left: ${item.level - 1}em; width: calc(100% - ${item.level - 1}em)`"
        :class="{
          level1: item.level === 1,
          active: toc.active === item.id
        }"
        v-show="!isBeCollapsed(item, index)"
        @click="handleScrollTo(item, index)">
        <svg-icon
          icon-class="arrow-down"
          class="collapse-toggle"
          :class="{
            collapsed: !!toc.collapseObj[item.id],
            hidden: index === toc.headingList.length - 1 ||toc.headingList[index + 1]?.level <= item.level
          }"
          size="16px"
          @click.stop="handleCollapse(item, index)"
        ></svg-icon>
        <EllipsisTooltip :content="item.text" v-if="item.text"></EllipsisTooltip>
        <span v-else>&nbsp;</span>
      </li>
    </ul>
  </div>
</template>

<script setup name="toc">
import { reactive, watch, onBeforeUnmount, onMounted, nextTick, computed, ref } from "vue";
import EllipsisTooltip from "@/components/EllipsisTooltip.vue";
import { throttle, debounce } from "lodash-es";
import { Hash } from "@/utils/utils.js";
import { useEditorStore } from "@/store/index.js";
import { getScreenSize, eventTrack } from "@/utils/utils.js";
import SvgIcon from "@/components/svgIcon.vue";
import { setDomBlink } from "./utils/setDomBlink.js";

const props = defineProps({
  editor: Object,
  headings: {
    type: Array,
    default: () => ([])
  },
  isShrink: {
    type: Boolean,
    default: false
  },
  noHash: {
    type: Boolean,
    default: false
  },
  scrollParentDom: {
    type: Function
  }
});

const emits = defineEmits(["update:isShrink"]);

const editorStore = useEditorStore();

const toc = reactive({
  headingList: [],
  active: null,
  collapseObj: {}
});

// eslint-disable-next-line vue/no-dupe-keys
let scrollParentDom;
const addHashValue = throttle((val) => {
  Hash.addValue("anchor", val);
}, 1000);

// 如果没有锚点则初始化，如果有则移动过去。
const initAnchor = () => {
  if (Hash.getValue("anchor")) {
    // 移动到锚点
    const targetId = `heading-${Hash.getValue("anchor")}`;
    nextTick(() => scrollTo(targetId));
  }
};

onBeforeUnmount(() => {
  waitForActiveId = null;
  Hash.remove("anchor");
});

watch(() => editorStore.docId, (newDocId, oldDocId) => {
  if (String(oldDocId) !== String(newDocId)) {
    Hash.remove("anchor");
    toc.collapseObj = {};
  }
});

const haveHeadings = ref(undefined); // 由于props.headings总是默认上来就会是空数组，因此需要解决，仅当headings有值与无值时触发toc伸缩更新
watch(() => props.headings, (val) => {
  getTocs();
  haveHeadings.value = val && val.length !== 0; // 大纲有内容
});

watch(() => haveHeadings.value, (val) => {
  const isBigWidth = ["xl", "lg"].includes(getScreenSize());
  if (isBigWidth) {
    changeTocShowOrHide(!val, false);
  } else {
    // 大屏默认显示大纲，中小屏折叠
    changeTocShowOrHide(true, false);
  }
});

function getTocs() {
  if (!props.headings || !props.headings.length) {
    toc.headingList = [];
    return;
  }
  toc.headingList = props.headings.map(c => ({
    level: c.level,
    text: c.text,
    id: c.id
  }));
}

// 不能直接取 offsetTop，由于从编辑器根部到这个dom中可能有一些css position的设置，导致 dom 的 offsetParent 与 scrollParentDom 不是同一个dom
function getEditorDomOffsetTop(dom) {
  const scrollParentDom = props.scrollParentDom();
  if (!dom || !scrollParentDom) return 0;

  return dom.getBoundingClientRect().top + scrollParentDom.scrollTop - scrollParentDom.getBoundingClientRect().top;
}

onMounted(() => {
  getTocs();

  scrollParentDom = props.scrollParentDom(); // 最近可滚动的dom
  scrollParentDom.addEventListener("scroll", scrollHandler);

  // 首次进来时
  const timer = setTimeout(() => {
    initAnchor();

    scrollHandler();
    clearTimeout(timer);
  }, 1000);
});

onBeforeUnmount(() => {
  scrollParentDom.removeEventListener("scroll", scrollHandler);
});

function scrollHandler() {
  handleTocActive();
  handleScrollEnd();
}

function isCollapseHeading(dom) {
  return dom?.style.display === "none";
}

// 当选择位于末尾的几个大纲时因为滚动条已经置底，通过实时计算的active已经不正确，要借用此变量在置底时纠正。
let waitForActiveId;

const handleTocActive = throttle(() => {
  // getTocs未获取到大纲则不用绘制active
  if (toc.headingList.length === 0) {
    return;
  }

  // 已经滚动到最底部，此时active的大纲可能需要纠正为点击时记录的大纲
  if (isScrollBottom() && isInViewport(document.getElementById(waitForActiveId))) {
    toc.active = waitForActiveId;
    waitForActiveId = undefined;
    return;
  }

  const scroll = scrollParentDom.scrollTop;
  const headerDom = scrollParentDom.querySelectorAll("h1,h2,h3,h4,h5,h6");
  const headerTopList = [];

  headerDom.forEach((el, index) => {
    let top;
    // 内容区域被折叠时，高度就等于上一个的高度
    if (isCollapseHeading(el)) {
      top = headerTopList[index - 1];
    } else {
      // 上面 scrollParentDom.scrollTop 的值是四舍五入后的整数，但是这里直接返回的是有小数的，有数值上的小偏差，下面直接比较有时候不准，所以这里也Math.round处理一下
      top = Math.round(getEditorDomOffsetTop(el));
    }
    headerTopList.push(top);
  });

  toc.active = null;

  if (headerTopList[0] >= scroll) {
    // 如果第一个大纲距离父级顶部的高度大于等于滚动条滚过的距离则激活
    toc.active = toc.headingList[0].id;
  } else if (headerTopList[headerTopList.length - 1] <= scroll) {
    // 如果最后一个大纲距离父级顶部的高度小于等于滚动条滚过的距离则激活
    toc.active = toc.headingList[headerTopList.length - 1].id;
  } else {
    for (let i = 0; i < headerTopList.length - 1; i++) {
      if (headerTopList[i] === scroll) {
        toc.active = toc.headingList[i].id;
        break;
      } else if (headerTopList[i] < scroll) {
        // 因为有折叠的，值是一样的，所以会出现headerTopList[] === headerTopList[i] 的情况，需要找到下一个不同高度的
        let nextIndex = i + 1;
        while (headerTopList[nextIndex] === headerTopList[i]) {
          nextIndex++;
        }

        if (headerTopList[nextIndex] > scroll) {
          toc.active = toc.headingList[i].id;
          break;
        }
      }
    }
  }
}, 300);

let handleScrollEnd = debounce(function () {
  // 滚动结束时，清掉 waitForActiveId
  waitForActiveId = undefined;
}, 600);

// 滚动条已经触底
function isScrollBottom() {
  if (!scrollParentDom) return false;

  return scrollParentDom.scrollTop + scrollParentDom.clientHeight === scrollParentDom.scrollHeight;
}

// dom在可视区域内
function isInViewport(dom) {
  if (!dom) return false;

  return dom.getBoundingClientRect().top >= 0;
}

function scrollTo(domId) {
  const element = document.getElementById(domId);
  if (element) {
    // 点击一瞬间直接将目标置蓝，后续如果有滚动则会动态改变该值最终又变成该值
    toc.active = domId;

    element.scrollIntoView({ behavior: "smooth" });

    setDomBlink(element);
  }
}

function handleScrollTo(item) {
  const domId = item.id;

  if (!props.noHash) { // 模板预览的大纲，不增加地址栏hash
    addHashValue(domId.replace("heading-", ""));
  }

  eventTrack("editorTocHeadingClick");

  // 记录需要的滚动到的地方，防止后续如果因为页面高度限制没滚动到时，依然能对应高亮大纲
  waitForActiveId = domId;

  const element = document.getElementById(domId);

  // 如果滚动时，在这个标题是被折叠的，需要展开
  if (isCollapseHeading(element)) {
    props.editor.commands.expandHeading(domId);
    nextTick(() => {
      scrollTo(domId);
    });
  } else {
    scrollTo(domId);
  }
}

const changeTocShowOrHide = (val = !props.isShrink, needEventTrack = true) => {
  emits("update:isShrink", val);

  // 打点
  needEventTrack && eventTrack("editorTocShrink");
};

const titleIsEnabled = computed(() => editorStore.extensionIsEnabled("title"));

function handleCollapse(item) {
  if (toc.collapseObj[item.id] === undefined) {
    toc.collapseObj[item.id] = true;
  } else {
    toc.collapseObj[item.id] = !toc.collapseObj[item.id];
  }

  eventTrack("editorTocHeadingShrink");
}

function isBeCollapsed(item, index) {
  if (index === 0) return false;

  let searchLevel = item.level;

  for (let i = index - 1; i >= 0; i--) {
    const el = toc.headingList[i];

    if (el.level < searchLevel) {
      if (toc.collapseObj[el.id]) {
        return true;
      } else {
        searchLevel = el.level;
      }
    }

    if (el.level === 1) {
      break;
    }
  }

  return false;
}
</script>

<style lang="scss" scoped>
.toc {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .tocShrinkIcon {
    color: $gray-5;
    cursor: pointer;
    margin-left: 16px;
  }

  ul {
    flex: 1;
    width: 100%;
    overflow: hidden auto;
    font-size: 14px;
    margin-top: 8px;

    li {
      display: flex;
      align-items: center;
      padding: 4px 0;
      color: $font-2;
      cursor: pointer;

      &.level1 {
        color: $font-1;
      }

      &.active {
        color: $color-primary;
      }
    }
  }
}

li:hover .collapse-toggle {
  visibility: visible;
}

.collapse-toggle {
  cursor: pointer;
  color: $gray-5;
  user-select: none;
  visibility: hidden;
  display: inline-block;  // mac兼容问题。rotate 需要是 inline-block
  flex-shrink: 0;

  &:hover {
    color: $color-primary;
  }

  &.hidden {
    visibility: hidden !important;
  }

  &.collapsed {
    visibility: visible;
    transform: rotate(-90deg);
  }
}
</style>
