<template>
  <div class="menubar">
    <div class="list" ref="topMenuRef" :style="{width: sourceFromNamiAiEdi ? 'calc(100% - 263px)' : 'calc(100% - 123px)'}">
      <div class="leftList" ref="btnListRef">
        <undo :editor="editor" v-if="redoIsEnabled"></undo>
        <redo :editor="editor" v-if="redoIsEnabled"></redo>

        <el-divider direction="vertical"  v-if="redoIsEnabled"/>

        <AI :editor="editor" theme="blue" v-if="AIIsEnabled"></AI>

        <el-divider direction="vertical" v-if="AIIsEnabled" />

        <normalText :editor="editor"></normalText>
        <heading :editor="editor" :level="1"></heading>
        <heading :editor="editor" :level="2"></heading>
        <heading :editor="editor" :level="3"></heading>
        <heading :editor="editor" :level="4"></heading>

        <el-divider direction="vertical" />

        <bold :editor="editor"></bold>
        <italic :editor="editor"></italic>
        <underline :editor="editor"></underline>
        <strikeBtn :editor="editor"></strikeBtn>
        <!-- <textColorGroup :editor="editor"></textColorGroup> -->
        <!-- <backgroundColorGroup :editor="editor"></backgroundColorGroup> -->
        <!-- <inlineCode :editor="editor"></inlineCode> -->

        <el-divider direction="vertical" />

        <orderedList :editor="editor"></orderedList>
        <bulletList :editor="editor"></bulletList>
        <!-- <taskList :editor="editor"></taskList> -->
        <alignGroup :editor="editor"></alignGroup>

        <el-divider direction="vertical" />

        <tableBtn :editor="editor" v-if="tableIsEnabled"></tableBtn>
        <codeBlock :editor="editor" v-if="codeBlockIsEnabled"></codeBlock>
        <addLink :editor="editor"></addLink>
        <imageBtn :editor="editor" v-if="imageIsEnabled"></imageBtn>
        <!-- <horizontalRule :editor="editor"></horizontalRule> -->
        <!-- <blockquoteBtn :editor="editor"></blockquoteBtn> -->
        <!-- <insertGroup :editor="editor"></insertGroup> -->

        <!-- <el-divider direction="vertical" v-if="remarkIsEnabled"/> -->

        <!-- <remark :editor="editor" v-if="remarkIsEnabled"></remark> -->
      </div>

      <div ref="moreListRef" class="morelist"></div>

      <el-divider direction="vertical" v-if="showMore && showMoreDivider"/>

      <subMenusButton v-if="showMore"
        iconName="icon-k-more"
        :showArrow="false"
        :contentDom="() => moreListRef">
      </subMenusButton>

      <!-- <el-divider direction="vertical" v-if="fullScreenIsEnabled" /> -->
      <!-- <fullScreen  v-if="fullScreenIsEnabled"></fullScreen> -->

    </div>
    <div class="rightBtn">
      <copy :editor="editor" v-if="sourceFromNamiAiEdi"></copy>
      <downLoad :editor="editor" v-if="sourceFromNamiAiEdi"></downLoad>
    </div>
  </div>
</template>

<script setup name="topMenu">
import { ref, onMounted, onBeforeUnmount, computed, inject } from "vue";

import undo from "../btn/undo.vue";
import redo from "../btn/redo.vue";
import AI from "../btn/AI.vue";
import normalText from "../btn/normalText.vue";
import heading from "../btn/heading.vue";
import orderedList from "../btn/orderedList.vue";
import bulletList from "../btn/bulletList.vue";

import codeBlock from "../btn/codeBlock.vue";
// import blockquoteBtn from "../btn/blockquoteBtn.vue";
// import horizontalRule from "../btn/horizontalRule.vue";
import tableBtn from "../btn/table.vue";
import bold from "../btn/bold.vue";
import italic from "../btn/italic.vue";
import underline from "../btn/underline.vue";
import strikeBtn from "../btn/strike.vue";
// import textColorGroup from "../btn/textColorGroup.vue";
// import backgroundColorGroup from "../btn/backgroundColorGroup.vue";
// import inlineCode from "../btn/inlineCode.vue";
import addLink from "../btn/addLink.vue";
// import taskList from "../btn/taskList.vue";
// import remark from "../btn/remark.vue";
import alignGroup from "../btn/alignGroup.vue";
import imageBtn from "../btn/imageBtn.vue";
// import insertGroup from "./insertGroup.vue";
// import fullScreen from "../btn/fullScreen.vue";
import copy from "../btn/copy.vue";
import downLoad from "../btn/downLoad.vue";

import subMenusButton from "../subMenusButton.vue";

import { useEditorStore } from "@/store/index.js";
import { debounce } from "lodash-es";

defineProps({
  editor: Object
});

const editorStore = useEditorStore();

const sourceFromNamiAiEdi = computed(() => editorStore.source === "xie" || editorStore.source === "wenku" || editorStore.source === "bangong");

const redoIsEnabled = computed(() => editorStore.extensionIsEnabled("redo"));
const AIIsEnabled = computed(() => editorStore.extensionIsEnabled("AI"));
const imageIsEnabled = computed(() => editorStore.extensionIsEnabled("image"));
const codeBlockIsEnabled = computed(() => editorStore.extensionIsEnabled("codeBlock"));
const tableIsEnabled = computed(() => editorStore.extensionIsEnabled("table"));

// const remarkIsEnabled = editorStore.extensionIsEnabled("remark");
// const fullScreenIsEnabled = !!editorStore.extensionConfig.menubar?.fullScreen;

const topMenuRef = ref();
const btnListRef = ref();
const moreListRef = ref();
const showMore = ref(false);
const showMoreDivider = ref(false);

let observer = null;
onMounted(() => {
  const dom = topMenuRef.value;

  if (dom) {
    observer = new ResizeObserver(debounceCheckWidth);
    observer.observe(dom, { box: "border-box" });
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const debounceCheckWidth = debounce(checkWidth, 200);

function checkWidth() {
  if (!topMenuRef.value) return;

  const maxWidth = topMenuRef.value.getBoundingClientRect().width;
  let total = 0;
  let hasMore = false;

  for (const child of btnListRef.value.children) {
    if (hasMore) {
      child.setAttribute("attr-remove", 1);
    } else {
      let width = Number(child.getAttribute("attr-width"));
      if (!width) {
        width = getElementWidthWithMargin(child);
        child.setAttribute("attr-width", width); // 存一下，避免重复计算
      }
      if (total + width >= maxWidth) {
        child.setAttribute("attr-remove", 1);

        hasMore = true;
      } else {
        total += width;
      }
    }
  }

  if (hasMore) {
    const children = btnListRef.value.children;
    // 如果只多余1个，就把最后两个都移动到more中去。否则more也是一个按钮，多余按钮也是一个，没有意义
    if (btnListRef.value.querySelectorAll("[attr-remove]").length === 1 && moreListRef.value.children.length === 0) {
      children[children.length - 2].setAttribute("attr-remove", 1);
      children[children.length - 3].setAttribute("attr-remove", 1); // 因为倒数第2个是竖线，所以把倒数第三个也移到more中去
    }

    Array.from(btnListRef.value.querySelectorAll("[attr-remove]")).reverse().forEach((child) => {
      moreListRef.value.insertAdjacentElement("afterbegin", child);
      child.removeAttribute("attr-remove");
    });
  } else {
    for (const child of moreListRef.value.children) {
      let width = Number(child.getAttribute("attr-width"));

      if (!width) {
        width = getElementWidthWithMargin(child);
        child.setAttribute("attr-width", width);
      }
      if (total + width >= maxWidth) {
        hasMore = true;
        break;
      } else {
        child.setAttribute("attr-add", 1);
        total += width;
      }
    }

    Array.from(moreListRef.value.querySelectorAll("[attr-add]")).forEach((child) => {
      btnListRef.value.appendChild(child);
      child.removeAttribute("attr-add");
    });
  }

  // 判断最后一个元素是不是竖线，是的话，more按钮不显示竖线
  const children = btnListRef.value.children;
  const lastChild = children[children.length - 1];
  const isDivider = lastChild.classList.contains("el-divider");
  showMoreDivider.value = !isDivider;

  showMore.value = hasMore;
}

function getElementWidthWithMargin(element) {
  const style = window.getComputedStyle(element);
  const width = element.offsetWidth;

  const marginLeft = Number(style.getPropertyValue("margin-left").replace("px", ""));
  const marginRight = Number(style.getPropertyValue("margin-right").replace("px", ""));

  return width + marginLeft + marginRight;
}

</script>

<style lang="scss" scoped>
.menubar {
  border-bottom: 1px solid $gray-2;
  height: 56px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.list {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;
}

.leftList {
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: flex-end;
}

.morelist {
  //  第一个dom如果是竖线，就不显示
  :first-child.el-divider {
    display: none;
  }
}
.rightBtn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 33px;
}
</style>
