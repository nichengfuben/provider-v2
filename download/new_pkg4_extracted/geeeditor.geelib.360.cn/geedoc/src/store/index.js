import { defineStore } from "pinia";

export const useEditorStore = defineStore("editor", {
  state: () => {
    return {
      isVip: false,
      docId: null,
      docInfo: null,
      userInfo: null,
      source: "", // iframe URL中的source参数
      activeNode: null, // +菜单 用
      showEditorAddMenu: false, // +菜单是否显示
      showLinkDialog: {
        show: false,
        addNextLine: false, // 是否是在下一行添加模式打开
        attr: { // 修改时使用
          text: "",
          href: ""
        }
      },
      aiPopupConfig: {
        show: false,
        from: null,
        to: null,
        useBackup: false
      },
      miniDocPopupConfig: {
        show: false,
        content: "",
        showToolbar: false,
        useBackup: false
      },
      showIframeDialog: false,
      showFigmaDialog: false,
      isWidescreenMode: false, // 宽屏模式
      isTocShrink: false, // 大纲是否收起
      extensionConfig: {},
      extraParams: {}, // 额外参数
      isFullScreen: false, // 全屏
      isPresentationMode: false // 演示模式
    };
  },
  actions: {
    extensionIsEnabled(extentsionName) { // 某个插件是否开启
      const ex = this.extensionConfig[extentsionName];
      if (!ex) return true;
      return !!ex.show;
    }
  }
});
