<template>
  <div
    ref="editorContainerRef"
    class="component-editor"
    :class="{
      isFullScreen: editorStore.isFullScreen,
      isPresentationMode: isPresentationMode,
    }"
  >

    <topMenu :editor="editor" v-if="editor && !isReadOnly"></topMenu>

    <div
      class="component-editor-content"
      :style="{
        height: isReadOnly ? '100%' : 'calc(100% - 56px)',
      }"
    >
      <!-- 演示模式也不显示大纲 -->
      <toc
        v-if="!disableToc && !isPresentationMode"
        :style="{ width: getTocWidth }"
        :editor="editor"
        :headings="headingList"
        v-model:isShrink="isTocShrink"
        :scrollParentDom="() => scrollParentDomRef"
        :noHash="noHash"
      ></toc>

      <div
        class="component-editor-right"
        id="componentEditorRight"
        ref="scrollParentDomRef"
        :style="{
          overflow: 'auto',
          width: getContentWidth,
        }"
      >
        <!-- 只读/编辑时，padding-left 编辑器内容左侧+工具栏的宽度 -->
        <div
          v-if="titleIsEnabled"
          class="titleWrap"
          :style="{
            width: getContentTitleWidth,
            'padding-left': getPaddingLeft,
            'margin-top': isPresentationMode ? '32px' : '16px',
            'box-sizing': 'border-box',
          }"
        >
          <!-- 需要在外面套一层div，padding-left 不能直接写在docTitle上，不然影响输入框的位置 -->
          <docTitle :value="doc.title" :disabled="isReadOnly"></docTitle>
        </div>

        <!-- 如果需要的话，有一个slot可以使用 -->
        <div
          :style="{
            'padding-left': getPaddingLeft,
          }"
        >
          <slot name="tools"></slot>
        </div>

        <div ref="editorRef" @dragstart.prevent>
          <editor-content
            :editor="editor"
            id="knowledge-editor"
            :style="{
              width: getContentMainWidth,
              'padding-left': getPaddingLeft,
              'margin-top': '24px',
            }"
          />

          <div v-if="editor && !isReadOnly">
            <!-- <quick-menu
              :editor="editor"
              :scrollParentDom="() => scrollParentDomRef"
            ></quick-menu> -->
            <!-- 用 v-if 在ai框显示，关闭 text-menu 时浏览器选中文字效果没了-->
            <text-menu
              :editor="editor"
              v-show="!aiPopupIsShow"
            ></text-menu>
            <image-menu :editor="editor"></image-menu>
            <link-menu :editor="editor"></link-menu>
            <table-menu :editor="editor"></table-menu>

            <AI-popup :editor="editor" :scrollParentDom="() => scrollParentDomRef"></AI-popup>
            <mini-doc-popup :editor="editor" :scrollParentDom="() => scrollParentDomRef"></mini-doc-popup>
            <link-dialog :editor="editor"></link-dialog>
            <iframe-dialog :editor="editor"></iframe-dialog>
            <figma-dialog :editor="editor"></figma-dialog>
          </div>
        </div>
      </div>
    </div>

    <div class="bottomFloatPart" v-if="editor">
      <el-alert
        v-if="tips"
        :title="tips"
        :type="isConnected === 'init' ? 'success' : 'error'"
        :closable="false"
      />
    </div>

    <debugDialog
      v-if="editor && isDebug"
      :editor="editor"
      :editorUsers="editorUsers"
      :provider="provider"
    ></debugDialog>
  </div>
</template>

<script setup name="CoEditor">
import { onBeforeUnmount, computed, ref, watch, shallowRef, onMounted, nextTick, defineAsyncComponent, provide } from "vue";
import { useEditorStore } from "@/store/index.js";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { debounce, merge } from "lodash-es";
import toc from "./toc.vue";
import defaultConfig from "../extensionConfig/defaultConfig.js";

// 扩展
import { getDefaultExtensions } from "./extensions/index.js";

import { getScreenSize, eventTrack } from "@/utils/utils.js";
// import { handleFileEvent } from "./utils/upload.js";
// import { generateUniqueId } from "./utils/uniqueId.js";
import { Slice, Fragment } from "@tiptap/pm/model";
import PubSub from "pubsub-js";
import { setActivePinia } from "pinia";
import * as idb from "lib0/indexeddb";
import { ElMessage } from "element-plus";
import getCoverPicFun from "@/coEditor/utils/getCoverPic.js";

const aiTemWindowShow = ref(false);

// 加载 iconfont 图标。不直接写在index.html 中，因为打包插件的时候就没有了
function loadIconfont() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.setAttribute("crossorigin", "anonymous"); // 为了解决截取封面时跨域资源的问题
  link.href = "//at.alicdn.com/t/c/font_3885442_fwdzyayyhm.css";
  document.head.appendChild(link);
}

loadIconfont();

const props = defineProps({
  // 文档信息
  doc: {
    required: true,
    type: Object,
    default: () => {
      return {
        id: null,
        title: ""
      };
    }
  },
  // 当前用户的信息，用于显示协同时的人名或者其他功能
  userInfo: {
    required: true,
    type: Object
  },
  // 只读模式，编辑模式
  readOnly: {
    type: Boolean,
    default: false
  },
  // 非必要字段。一些编辑器插件的开关控制，或者其他参数传递。默认配置见 defaultConfig
  extensionConfig: {
    type: Object,
    default: () => ({})
  },
  // 不用协同服务。此时文档内容需要靠 doc.content 填充。配合 isJsonOrHtml 使用
  noCollaboration: {
    type: Boolean,
    default: false
  },
  // 不是协同时，使用 doc.content 填充文档，此时 content 是不是 json 格式内容
  isJsonOrHtml: {
    default: false
  },
  // toc 中，点击大纲是否需要记录到url的hash中
  noHash: {
    type: Boolean,
    default: false
  },
  // 有一些接口需要额外的参数，例如@需要调用获取空间成员接口，需要空间id。不用时，可以不传
  extraParams: {
    type: Object,
    default: () => ({})
  },
  // 内部使用。是否是空文档时下方显示的模板编辑器。此时不显示批注，但是不能通过extensionConfig，否则污染 pinia 数据。
  isInnerTemplate: {
    type: Boolean,
    default: false
  },
  // 手动初始化
  handleInit: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits([
  "tocShrinkChange",
  "widerModeChange",
  "titleChange",
  "contentChange",
  "update:readOnly",
  "showAdvancedSearch",
  "openDynamicNodeSettingDia",
  "create",
  "focus",
  "blur",
  "aiLog",
  "event"
]);

const docTitle = defineAsyncComponent(() => import("./docTitle.vue"));

const linkDialog = defineAsyncComponent(() =>
  import("./extensions/link/linkDialog.vue")
);
const iframeDialog = defineAsyncComponent(() =>
  import("./extensions/iframe/iframeDialog.vue")
);
const figmaDialog = defineAsyncComponent(() =>
  import("./extensions/iframeFigma/figmaDialog.vue")
);
const quickMenu = defineAsyncComponent(() =>
  import("./menus/quickMenu/index.vue")
);
const textMenu = defineAsyncComponent(() => import("./menus/textMenu.vue"));
const imageMenu = defineAsyncComponent(() => import("./menus/imageMenu.vue"));
const linkMenu = defineAsyncComponent(() => import("./menus/linkMenu.vue"));
const tableMenu = defineAsyncComponent(() => import("./menus/tableMenu.vue"));

const AIPopup = defineAsyncComponent(() =>
  import("./extensions/aiBlockPopup/AIPopup.vue")
);
const miniDocPopup = defineAsyncComponent(() =>
  import("./extensions/miniDocPopup/miniDocPopup.vue")
);

const debugDialog = defineAsyncComponent(() => import("./debugDialog.vue"));
const topMenu = defineAsyncComponent(() => import("./menus/topMenu/index.vue"));

setActivePinia(window.pinia); // 用vue组件的方式时，需要外部应用设置  window.pinia = pinia； 然后这里接收，否则报错

const editorStore = useEditorStore();

// 禁用大纲
const disableToc = computed(() => !editorStore.extensionConfig.toc.show);

// 路由参数上有 isEditorDebug 时，显示调试工具
const isDebug
  = editorStore.extensionIsEnabled("debug")
  && window.location.href.includes("isEditorDebug");

watch(
  () => props.doc.id,
  (val) => {
    if (!props.isInnerTemplate) {
      editorStore.$patch({
        docInfo: props.doc,
        docId: val
      });
    }
  },
  { immediate: true }
);
watch(
  () => props.userInfo,
  (val) => {
    if (!props.isInnerTemplate) {
      editorStore.$patch({
        userInfo: val
      });
    }
  },
  { immediate: true }
);

watch(
  () => props.extraParams,
  (val) => {
    if (!props.isInnerTemplate) {
      editorStore.$patch({
        extraParams: val
      });
    }
  },
  { immediate: true }
);

watch(
  () => props.readOnly,
  (val) => {
    editor.value?.setEditable(!props.readOnly);
    if (val && aiTemWindowShow.value) {
      aiTemWindowShow.value = false;
    }
  }
);

watch(
  () => props.doc.id,
  (id) => {
    // 如果没有nexttick，watch 会在 onBeforeUnmount 之前执行，当切换不同文档类型的文档时会出现问题
    nextTick(() => {
      if (!id) return;

      !props.handleInit && initEditor();
    });
  }
);

// 模板的大纲不保存在editorStore中，避免互相影响
const isTocShrink = props.isInnerTemplate
  ? ref(true)
  : computed({
    get: () => editorStore.isTocShrink,
    set: (val) => {
      editorStore.$patch({ isTocShrink: val });
      emits("tocShrinkChange", val);
    }
  });

const isWidescreenMode = computed({
  get: () => editorStore.isWidescreenMode,
  set: (val) => {
    editorStore.$patch({ isWidescreenMode: val });
    emits("widerModeChange", val);
  }
});

// initMode();
// function initMode() {
//   const isBigWidth = ["xl", "lg"].includes(getScreenSize());
//   // 大屏默认为窄屏模式，中小屏为宽屏模式
//   isWidescreenMode.value = !isBigWidth;
// }

const getTocWidth = computed(() => {
  if (isTocShrink.value) return "40px";

  return "20%";
});

const getContentWidth = computed(() => {
  // 不能用flex 1。 flex 1 内部又width 80%，会出现缓慢缩放区域的情况
  if (disableToc.value || isPresentationMode.value) return "100%"; // 没有toc就是100%

  if (isTocShrink.value) return "calc(100% - 40px)"; // 留大纲按钮位置

  return "80%";
});

const getContentMainWidth = computed(() => {
  if (props.isInnerTemplate) {
    return "100%";
  }
  // 宽屏模式, 如果有批注功能给右侧批注竖条留30px的空间
  // 演示模式自动宽屏
  if (isWidescreenMode.value || isPresentationMode.value) {
    return remarkIsEnabled.value ? "calc(100% - 30px)" : "100%";
  }
  return "75%";
});

const getContentTitleWidth = computed(() => {
  if (disableToc.value || props.isInnerTemplate) return "100%";

  // 宽屏模式, 如果有批注功能给右侧批注竖条留30px的空间
  if (isWidescreenMode.value || isPresentationMode.value) {
    return remarkIsEnabled.value ? "calc(100% - 30px)" : "100%";
  }
  return "75%";
});

const getPaddingLeft = computed(() => {
  // 演示模式，左右各40px边距
  if (isPresentationMode.value) return "40px";

  return isReadOnly.value ? "20px" : "42px";
});

const isReadOnly = computed(() => {
  // 演示模式只能只读
  return props.readOnly || isPresentationMode.value;
});

const getRandomElement = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};

function getRandomColor() {
  return getRandomElement([
    "#958DF1",
    "#F98181",
    "#FBBC88",
    "#FAF594",
    "#70CFF8",
    "#94FADB",
    "#B9F18D"
  ]);
}

const editorUsers = ref([]);
const editorRef = ref();
const scrollParentDomRef = ref();
const editorContainerRef = ref();
const headingList = ref([]);

const editor = shallowRef(null);
let provider = null;
let indexdbProvider = null;

// 必须加debounce，否则会瞬间触发几十上百次
const watchDomPublishMes = debounce(function (entries) {
  PubSub.publish("editorWrapDomObserverChange", entries);
}, 200);

// 监听容器dom以帮助表格溢出功能在父dom改变时动态改变自己的宽度
const observer = new ResizeObserver((entries) => {
  watchDomPublishMes(entries);
});

onMounted(() => {
  observer.observe(editorRef.value);
});
onBeforeUnmount(() => {
  observer.disconnect();
});

// 粘贴的时候，做的一些格式化操作
function formatPastedContent(obj) {
  // if (!obj) return obj;

  // if (obj.type === "paragraph" && obj.attrs.id) {
  //   // 移除段落id
  //   obj.attrs.id = null;
  // }

  // if (obj.type === "flowChart" || obj.type === "dynamic") {
  //   // 打开流程图时候是根据id打开的，复制而来的流程图会是重复的id，因此需要洗一遍
  //   // 动态需要使用state储存，存取数据借用id，因此不能重复
  //   obj.attrs.id = generateUniqueId();
  // }

  // if (obj.marks) {
  //   // 移除 remark
  //   obj.marks = obj.marks.filter(el => el.type !== "remark");
  // }

  // if (obj.content?.length) {
  //   obj.content.forEach((el) => {
  //     return formatPastedContent(el);
  //   });
  // }

  return obj;
}

onMounted(() => {
  !props.handleInit && initEditor();
});

initExtensionConfig();
function initExtensionConfig() {
  const mergedResult = merge({}, defaultConfig, props.extensionConfig);
  if (!props.isInnerTemplate) {
    editorStore.$patch({ extensionConfig: mergedResult });
  }
}

watch(() => props.extensionConfig, () => {
  initExtensionConfig();
}, {
  deep: true
});

const extensionsForAiTemplate = ref([]);

function creatEditor() {
  if (editor.value) {
    return;
  }
  let extensions = getDefaultExtensions();

  extensionsForAiTemplate.value = extensions;
  editor.value = new Editor({
    editable: !props.readOnly,
    autofocus: false,
    extensions,
    editorProps: {
      transformPasted: (slice, view) => {
        // 粘贴的时候，做的一些格式化操作
        slice = Slice.fromJSON(
          view.state.schema,
          formatPastedContent(slice.toJSON())
        );
        return slice;
      }
    },
    onCreate() {
      emits("create");
    },
    onUpdate() {
      emits("contentChange");
    },
    onFocus() {
      emits("focus");
    },
    onBlur() {
      emits("blur");
    }

  });

  // 将容器绑定到editor上，方便其他地方获取
  editor.value.editorDom = editorContainerRef.value;

  // 不用协同服务时，如果是json，就直接显示，如果不是，就需要转成json
  if (props.noCollaboration) {
    if (!props.isJsonOrHtml) {
      setContentwithBase64YDoc();
    } else {
      const content = props.doc.content;
      setContentWithJsonOrHtml(content);
    }
  } else {
    // 协同时
    // 如果是复制的文档，content 会有值，将content转成json，插入到文档中。如果不是，content没值，文档内容走协同
    const isCopy = props.doc.isCopy === 1;
    const hasContent = !!props.doc.content;
    if (isCopy && hasContent) {
      setContentwithBase64YDoc({
        jsonFormatFunc: formatPastedContent // 复制的文档，需要做一些内容格式化
      });
    }

    offlineStore();
  }
}

function initEditor() {
  const docId = props.doc.id;
  if (!docId && !props.noCollaboration) return;
  headingList.value = []; // 尽早清空toc大纲
  destoryEditor();
  isCustomMsg.value = "";
  isConnected.value = "init";
  noAuth.value = false;

  // 如果是 json 就直接显示，不用协同服务
  if (props.noCollaboration) {
    creatEditor();
  } else {
    const fileName = props.doc.title;

    const parameters = {
      fileId: docId,
      fileName: fileName,
      userId: props.userInfo?.id,
      userMail: props.userInfo?.mail,
      username: props.userInfo?.real_name,
      serials: Math.floor(Number(docId) / 10) % 5 // 负载用，通过序号负载到对应的机器上。集团这边id是加1，所以 %5 就行，哪吒id是+5，直接%5全部都是一个数值，所有先÷10
    };

    const providerConfig = {
      url: editorStore.extensionConfig.collaboration.backendUrl,
      name: String(docId),
      maxAttempts: 5,
      parameters: parameters,
      preserveConnection: false,
      onAwarenessChange: ({ states }) => {
        editorUsers.value = states.map(state => state.user);
      },
      onConnect() {
        noAuth.value = false;
        isConnected.value = true;
      },
      onSynced() {
        creatEditor();
        recoverVersionIfNeed();
      },
      onAuthenticationFailed: () => {
        //  有 preserveConnection 为 false 时，auth 失败，直接 close。为 true 时，30秒后会close
        noAuth.value = true;
      },
      onClose: () => {
        isConnected.value = false; // 不能写在onDisconnect事件中。如果打开页面时，协同服务就没有启动，会调用 onClose ，但是不会调用 onDisconnect
        creatEditor(); // 无法连接到yjs时创建实例
        recoverVersionIfNeed(); // 无法连接到yjs时不支持恢复文档，但给个提示且删除indexdb储存
      },
      onStateless({ payload }) {
        isCustomMsg.value = payload;
      }
    };

    const token = editorStore.extensionConfig.collaboration.token;

    if (token) {
      providerConfig.token = token;
    }

    provider = new HocuspocusProvider(providerConfig);

    // 仅在debug模式使用的断开yjs
    if (sessionStorage.getItem("offlineYjs") === "offline") {
      provider.disconnect();
    }
  }
}

// 离线存储
function offlineStore() {
  // import("y-indexeddb").then(({ IndexeddbPersistence }) => {
  import("./utils/indexeddb.js").then(({ IndexeddbPersistence }) => {
    const docId = String(props.doc.id);
    indexdbProvider = new IndexeddbPersistence(docId, provider.document, {
      beforeUpdate() {
        return indexdbProvider.get("time").then((lastTime) => {
          lastTime = lastTime || 1;
          const indexddbValidTime = props.doc.indexdbTime
            ? new Date(props.doc.indexdbTime).getTime()
            : 0; // 离线内容的时间大于这个时间，则有效
          const needUpdate = lastTime > indexddbValidTime;
          if (!needUpdate) {
            indexdbProvider.clearData();
          }

          return needUpdate;
        });
      },
      afterStore() {
        const now = new Date().getTime();
        indexdbProvider.set("time", now);
      }
    });
  });
}

function setContentwithBase64YDoc({
  content = props.doc.content,
  isZip = !!props.doc.isZip,
  jsonFormatFunc = null
} = {}) {
  return Promise.all([
    import("yjs"),
    import("y-prosemirror"),
    import("js-base64"),
    import("pako")
  ]).then(([Y, { yDocToProsemirrorJSON }, { toUint8Array }, pako]) => {
    if (content) {
      const ydoc = new Y.Doc();
      let binaryEncoded = toUint8Array(content);
      if (isZip) {
        binaryEncoded = pako.inflate(binaryEncoded); // 解压
      }
      Y.applyUpdate(ydoc, binaryEncoded);
      let json = yDocToProsemirrorJSON(ydoc, "default");

      if (jsonFormatFunc) {
        // 处理一下json，比如排除一些项
        json = jsonFormatFunc(json);
      }

      if (json) {
        setContentWithJsonOrHtml(json);
      }
    }
  });
}

function setContentWithJsonOrHtml(content) {
  editor.value.commands.setContent(content, true);
}

async function recoverVersionIfNeed() {
  const docId = props.doc.id;
  const idbIns = idb.openDB(docId, db =>
    idb.createStores(db, [["updates", { autoIncrement: true }], ["custom"]])
  );
  const versionData = await idbIns.then(async (db) => {
    const [custom] = idb.transact(db, ["custom"], "readonly");
    const result = {
      content: await idb.get(custom, "versionContent"),
      id: await idb.get(custom, "versionId")
    };
    return result;
  });
  if (versionData.content) {
    if (isConnected.value) {
      const recoverVersion = JSON.parse(versionData.content);
      const { isZip, content } = recoverVersion;

      if (content.length) {
        setContentwithBase64YDoc({ content, isZip });
      } else {
        // 新建文档后只改标题点击发布就会content没内容
        setContentWithJsonOrHtml("<p></p>");
      }
      ElMessage.success("恢复成功");
    } else {
      // yjs没连接时，如果此处不删除缓存，用户会发现文档没有任何变化，缓存就会一直留在indexdb中，直到下一次用户进入该文档且yjs连接成功时文档会被立刻恢复到历史版本，
      // 有可能用户是几天之后再进入的该文档，会导致这几天之间的所有用户的输入内容都会丢失掉，其他用户会发现文档莫名其妙变到了一个历史版本
      ElMessage({
        message: "当前文档连接已断开，请等待连接恢复后再恢复版本！",
        type: "warning"
      });
    }
    // 只要有versionData.content，无论成功与否都删除indexdb的储存
    idbIns.then((db) => {
      const [custom] = idb.transact(db, ["custom"]);
      return idb.del(custom, "versionContent");
    });
  }
}

function destoryEditor() {
  editor.value?.destroy();
  provider?.destroy();
  indexdbProvider?.destroy();
  editor.value = null;
  provider = null;
  indexdbProvider = null;
}

onBeforeUnmount(() => {
  destoryEditor();
  PubSub.unsubscribe(PubSubEmitToRootToken);
});

const aiPopupIsShow = computed(() => {
  return editorStore.aiPopupConfig?.show;
});

const remarkIsEnabled = ref(false);
const titleIsEnabled = computed(() => editorStore.extensionIsEnabled("title"));

const isConnected = ref("init");
const isCustomMsg = ref("");
const noAuth = ref(false);
const tips = computed(() => {
  if (props.noCollaboration) return "";

  if (isConnected.value === "init") return "正在连接...";

  if (noAuth.value) return "身份认证失败，请重新登陆";

  if (isCustomMsg.value) return isCustomMsg.value;

  if (!isConnected.value) {
    return props.readOnly
      ? "您已断开连接。我们会尝试重连，一旦重新连接，会显示最新的文档内容"
      : "您已断开连接，您可以继续编辑文档。我们会尝试重连，一旦重新连接，我们会自动重新提交数据。为了确保数据不会丢失，建议您点“发布”按钮保存历史版本";
  }

  return "";
});

// 对外暴露
// 设置宽屏模式
function setWiderMode(val) {
  editorStore.$patch({ isWidescreenMode: !!val });
}

// 对外暴露
// 设置大纲是否收缩
function setTocShrink(val) {
  editorStore.$patch({ isTocShrink: !!val });
}

// 对外暴露
function getJSON() {
  return editor.value?.getJSON();
}

// 对外暴露
function getHTML() {
  return editor.value?.getHTML();
}

// 对外暴露
// yjs 转换后的最终存到数据库的内容
function getBase64() {
  return Promise.all([import("yjs"), import("js-base64"), import("pako")]).then(
    ([Y, { fromUint8Array }, pako]) => {
      const documentState = Y.encodeStateAsUpdate(provider.document);
      const base64Encoded = fromUint8Array(pako.deflate(documentState)); // 压缩，转base64

      return base64Encoded;
    }
  );
}

// 在子组件内，向根处emit事件
const emitToRoot = (event, data) => {
  emits(event, data);
};

const PubSubEmitToRootToken = PubSub.subscribe(
  "emitToRoot",
  function (_, data) {
    const { event, value } = data;

    emits(event, value);
  }
);

provide("emitToRoot", emitToRoot);

// 演示模式
const isPresentationMode = ref(false);

defineExpose({
  setWiderMode,
  setTocShrink,
  getJSON,
  getHTML,
  getBase64,
  setContentWithJsonOrHtml,
  initEditor,
  editor,
  getCoverPicFun
});
</script>

<style lang="scss">
@import "./styles/index.scss";

  .component-editor {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    transition: width 0.5s;

    &.isFullScreen {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      z-index: 3100;
    }

    &.isPresentationMode {
      .component-editor-content {
        zoom: 1.8;
      }
    }

    .component-editor-content {
      display: flex;
      background-color: #fff;
    }

    .component-editor-right {
      position: relative;
    }

    #knowledge-editor {
      outline: none;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .bottomFloatPart {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
</style>
