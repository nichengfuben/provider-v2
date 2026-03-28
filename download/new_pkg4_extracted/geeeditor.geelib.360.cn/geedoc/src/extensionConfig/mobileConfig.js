import { encode } from "js-base64";

export default {
  toc: {
    show: false // 大纲
  },
  title: {
    show: false
  },
  template: {
    show: false
  },
  AI: {
    show: true,
    hasAuth: true // 无权限时，依旧能显示初始ai按钮，但是使用AI时，会抛出事件，提示用户开启
  },
  shortcutsPannel: {
    show: false
  },
  remark: {
    show: false // 移动端时屏蔽批注
  },
  image: {
    show: false,
    disableResizeTool: false, // 禁止更改大小
    customViewFun: undefined, // 自定义图片预览的方法，默认使用内置的图片预览
    singleClickViewPic: false,
    needUpdateSrc: false
  },
  attachment: {
    uploadFileFunc: null,
    disableDownload: true, // 禁止下载
    disableOpen: true, // 禁止打开网页预览
    getPreviewFileUrlFun: function (fileSrc) { // 在线预览工具部署地址，移动端需要外网能访问
      // 对fileSrc在线文件地址先解码的原因是，如果url有汉字，需要先进行解码回带汉字的，再base64，再进行url编码
      return "https://geedoc.geelib.360.cn/geedocView/onlinePreview?url=" + encodeURIComponent(encode(decodeURIComponent(fileSrc)));
    }
  },
  table: {
    show: true,
    disableStickyScroll: false // 禁止粘滞滚动条
  },
  redo: {
    show: true
  },
  codeBlock: {
    show: true
  }
};
