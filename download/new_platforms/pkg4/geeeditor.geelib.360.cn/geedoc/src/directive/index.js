import iframeClick from "./iframeClick"; // 跨域iframe点击事件
import clickoutside from "./clickoutside";
import copy from "./copy"; // 引入需要的指令

const directivesList = {
  "click-iframe": iframeClick,
  clickoutside,
  copy
};

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key]); // 注册
    });
  }
};

export default directives;
