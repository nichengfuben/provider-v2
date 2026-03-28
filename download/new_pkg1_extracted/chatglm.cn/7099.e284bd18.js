"use strict";(self.webpackChunkzp_chat_glm=self.webpackChunkzp_chat_glm||[]).push([["7099"],{96227:function(n,e,t){var r=t(24064),o=t.n(r),i=t(27872),a=t.n(i),s=t(5019),c=t.n(s),l=new URL(t(26029),t.b),A=new URL(t(18212),t.b),d=new URL(t(97900),t.b),p=new URL(t(68103),t.b),f=a()(o()),g=c()(l),m=c()(A),u=c()(d),h=c()(p);f.push([n.id,"/**\n * 适配器，采用rem方案适配大部分机型\n */\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n/************ MediaQuery临界值 ************/\n/************ 移动端通用变量 ************/\n/* header 高度 */\n/************ PC端通用变量 ************/\n/* header 高度 */\n/* sessionList样式 */\n/*****************************************公用颜色***********************************************/\n.error-container[data-v-4f689cc8] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n}\n.error-container .error-icon[data-v-4f689cc8] {\n  width: 80px;\n  height: 80px;\n  background: url("+g+") no-repeat;\n  background-size: cover;\n}\n.error-container .error-icon.dark[data-v-4f689cc8] {\n  background-image: url("+m+");\n}\n.error-container .error-message[data-v-4f689cc8] {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 22px;\n  /* 157.143% */\n}\n.loading-container[data-v-4f689cc8] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n}\n.loading-container .loading-spinner[data-v-4f689cc8] {\n  width: 26px;\n  height: 26px;\n  justify-content: center;\n  align-items: center;\n  background: url("+u+") no-repeat;\n  background-size: cover;\n  animation: rotate 1s linear infinite;\n}\n.loading-container .loading-spinner.dark[data-v-4f689cc8] {\n  background-image: url("+h+");\n}\n.loading-container .loading-text[data-v-4f689cc8] {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 24px;\n  /* 171.429% */\n}\n","",{version:3,sources:["webpack://./HTMLRender.vue","webpack://./src/components/Conversation/Artifacts/CodePreviewTabs/HTMLRender.vue"],names:[],mappings:"AAAA;;EAEE;AACF;;;;;;;;;;;;;;;;CAgBC;AACD,wCAAwC;AACxC,kCAAkC;AAClC,cAAc;AACd,kCAAkC;AAClC,cAAc;AACd,kBAAkB;AAClB,6FAA6F;AC6E7F;EACE,kBAAA;EACA,MAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,mBAAA;EACA,QAAA;AD3EF;ACiEA;EAYI,WAAA;EACA,YAAA;EACA,6DAAA;EACA,sBAAA;AD1EJ;AC2EI;EACE,yDAAA;ADzEN;ACwDA;EAqBI,sCAAA;EACA,eAAA;EACA,iBAAA;ED1EF,aAAa;AACf;AC4EA;EACE,kBAAA;EACA,MAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,mBAAA;EACA,SAAA;AD1EF;ACgEA;EAaI,WAAA;EACA,YAAA;EACA,uBAAA;EACA,mBAAA;EACA,6DAAA;EACA,sBAAA;EACA,oCAAA;AD1EJ;AC2EI;EACE,yDAAA;ADzEN;ACoDA;EA0BI,sCAAA;EACA,eAAA;EACA,iBAAA;ED3EF,aAAa;AACf",sourcesContent:["/**\n * 适配器，采用rem方案适配大部分机型\n */\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n/************ MediaQuery临界值 ************/\n/************ 移动端通用变量 ************/\n/* header 高度 */\n/************ PC端通用变量 ************/\n/* header 高度 */\n/* sessionList样式 */\n/*****************************************公用颜色***********************************************/\n.error-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n}\n.error-container .error-icon {\n  width: 80px;\n  height: 80px;\n  background: url('~@/assets/images/artifacts/error.png') no-repeat;\n  background-size: cover;\n}\n.error-container .error-icon.dark {\n  background-image: url('~@/assets/images/artifacts/error-dark.png');\n}\n.error-container .error-message {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 22px;\n  /* 157.143% */\n}\n.loading-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n}\n.loading-container .loading-spinner {\n  width: 26px;\n  height: 26px;\n  justify-content: center;\n  align-items: center;\n  background: url('~@/assets/image/common/loading-icon.png') no-repeat;\n  background-size: cover;\n  animation: rotate 1s linear infinite;\n}\n.loading-container .loading-spinner.dark {\n  background-image: url('~@/assets/image/common/loading-icon-dark.png');\n}\n.loading-container .loading-text {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 24px;\n  /* 171.429% */\n}\n","/**\n * 适配器，采用rem方案适配大部分机型\n */\n// rem因子单位，除字体外所有单位均需除以这个单位换算成rem\n// 移动端通用设计稿为750使用@rem\n// 如: width: 100/@rem; 这里100指设计稿上量出的100px，不需要人工除以2\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n@default-w: 750;\n\n.convert(@px, @width: @default-w) {\n  @var: unit(@px / @width) * 10;\n  @rem: ~'@{var}rem';\n}\n\n.remMixin() {\n  @functions: ~`(function() {\n      var clientWidth='750px';\n\n      function convert(size) {\n        return typeof size==='string' ? +size.replace('px', '') : size;\n      }\n\n      this.rem=function(size) {\n        return convert(size) / convert(clientWidth) * 10 + 'rem';\n      }\n    })()`;\n}\n\n.remMixin();\n\n/************ MediaQuery临界值 ************/\n@criticalValue: 6px;\n\n@detailCriticalValue: 1073px;\n\n\n/************ 移动端通用变量 ************/\n/* header 高度 */\n@headerHeightM: 6vh;\n\n\n/************ PC端通用变量 ************/\n/* header 高度 */\n@headerHeight: 135px;\n\n\n/* sessionList样式 */\n@sessionListWidth: 260px;\n@newSessionListWidth: 190px;\n@newVideoSessionListWidth: 256px;\n@sessionListBgColor: #FAFCFF;\n\n@sessionListAndSideWidth: 320px;\n\n/*****************************************公用颜色***********************************************/\n@blue-cff-color: #2a7cff;\n@blue-bf8-color: #7aabf8;\n\n@grey-fe6-color: #dcdfe6;\n@grey-ef0-color: #ebeef0;\n\n// 会会 要求修改的颜色\n// @theme-block-bgColor: #f3f6fc;\n// @code-panel-color: #f3f6fc;\n// @code-bgColor:#fff;\n// @bg-color: #fff;\n// @session-item-active: #fff;\n// @session-bgColor: #f1f5f9;\n// @session-border-width: 0px;\n\n@theme-block-bgColor: #f1f5f9;\n@code-bgColor: rgba(62, 111, 251, .1);\n@code-panel-color: #f8f8f8;\n@bg-color: #fff;\n@session-item-active: var(--bg_stroke_grey_3_5, #f8f8f8);\n@session-bgColor: #fff;\n@session-border-width: 1px;\n\n// 大屏适配\n@large-screen: 1920px;\n\n@screen-min-height: 300px;\n@container-min-width: 1161px;\n@input-min-width: 388px;\n\n@input-box-border-radius: 24px;\n\n.error-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n  .error-icon {\n    width: 80px;\n    height: 80px;\n    background: url('~@/assets/images/artifacts/error.png') no-repeat;\n    background-size: cover;\n    &.dark {\n      background-image: url('~@/assets/images/artifacts/error-dark.png');\n    }\n  }\n  .error-message {\n    color: var(--txt_icon_grey_6, #b0b7c0);\n    font-size: 14px;\n    line-height: 22px; /* 157.143% */\n  }\n}\n.loading-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n\n  .loading-spinner {\n    width: 26px;\n    height: 26px;\n    justify-content: center;\n    align-items: center;\n    background: url('~@/assets/image/common/loading-icon.png') no-repeat;\n    background-size: cover;\n    animation: rotate 1s linear infinite;\n    &.dark {\n      background-image: url('~@/assets/image/common/loading-icon-dark.png');\n    }\n  }\n\n  .loading-text {\n    color: var(--txt_icon_grey_6, #b0b7c0);\n    font-size: 14px;\n    line-height: 24px; /* 171.429% */\n  }\n}\n"],sourceRoot:""}]),e.A=f},76848:function(n,e,t){t.d(e,{$N:function(){return a},R5:function(){return i},RR:function(){return s}});var r=t(5251);let o="https://chatglm.cn/chatglm";function i(n){return(0,r.Ay)({url:`${o}/share-api/short/artifact`,method:"post",data:n},{loading:!1})}function a(n){return(0,r.Ay)({url:`${o}/share-api/artifact/info/${n.artifact_id}`,method:"get"},{loading:!1})}function s(n){return(0,r.Ay)({url:`${o}/mainchat-api/conversation/copy_share_artifact`,method:"post",data:n},{loading:!1})}},32581:function(n,e,t){t.d(e,{A:function(){return L}}),t(10894),t(38728),t(98982);var r=t(94421),o=t(8427),i=t(47997),a=t(45634);let s={key:0,class:"error-container"},c={class:"error-message"},l={key:1,class:"loading-container"},A="https://cdn-proxy.chatglm.cn/",d=`
<!DOCTYPE html>
<html style="overflow: auto;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rendered HTML</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 16px;
    }
    button, input, select, textarea {
      font-family: inherit;
      font-size: 1rem;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    button {
      background: #f0f0f0;
      cursor: pointer;
    }
    button:hover {
      background: #e0e0e0;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  CONTENT_PLACEHOLDER
</body>
</html>
`,p=`
<script>
  (function() {
    // 存储原始控制台方法
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
      clear: console.clear
    };

    // 覆盖所有控制台方法
    Object.keys(originalConsole).forEach(method => {
      console[method] = function() {
        const timestamp = new Date().toISOString();
        const args = Array.from(arguments).map(arg => {
          if (arg instanceof Error) {
            return {
              type: 'Error',
              message: arg.message,
              stack: arg.stack
            };
          }
          return arg;
        });

        // 如果是clear方法，发送清除消息
        if (method === 'clear') {
          window.parent.postMessage({
            type: 'console',
            method: 'clear',
            timestamp
          }, '*');
        } else {
          // 通过postMessage发送到父窗口
          try {
            window.parent.postMessage({
              type: 'console',
              method,
              args,
              timestamp
            }, '*');
          } catch (e) {
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              args: ['[无法序列化的控制台输出]'],
              timestamp
            }, '*');
          }
        }

        // 调用原始方法
        return originalConsole[method].apply(console, arguments);
      };
    });

    // 捕获未捕获的错误
    window.addEventListener('error', function(event) {
      console.error('[未捕获的错误]', event.message, '在', event.filename, '行:', event.lineno);
      return false;
    });

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', function(event) {
      console.error('[未处理的Promise拒绝]', event.reason);
      return false;
    });

    // 监听所有资源加载完成
    window.addEventListener('load', function(event) {
      // 通知父窗口页面已完全加载
      window.parent.postMessage({
        type: 'resourceStatus',
        status: 'complete'
      }, '*');
      return false;
    });
  })();
</script>
`,f=`
<style>
  body{
    height: 100%;
  }
</style>
`;var g=t(87077),m=t.n(g),u=t(55954),h=t.n(u),x=t(57810),C=t.n(x),b=t(30861),E=t.n(b),y=t(92281),v=t.n(y),k=t(10406),w=t.n(k),z=t(96227),_={};_.styleTagTransform=w(),_.setAttributes=E(),_.insert=C().bind(null,"head"),_.domAPI=h(),_.insertStyleElement=v(),m()(z.A,_),z.A&&z.A.locals&&z.A.locals;var L=(0,t(55553).default)({__name:"HTMLRender",props:{code:{type:String,required:!0},from:{type:String,default:""}},emits:["triggerError"],setup(n,{emit:e}){let{isDarkMode:t}=(0,o.J0)("DarkMode",["isDarkMode"]),{conversationId:g,logId:m}=(0,o.J0)("CodePreview",["conversationId","logId"]),u=(0,r.KR)(null),h=(0,r.KR)(!1),x=(0,r.KR)(null);function C(n){if(n.data?.type==="console"){if("clear"===n.data.method);else if(n.data?.method==="error"){let e=n.data.args||[];Array.isArray(e)?e.map(n=>"object"==typeof n?JSON.stringify(n):String(n)).join(" "):String(e)}}else n.data?.type==="resourceStatus"&&n.data?.status==="complete"&&(h.value=!0,setTimeout(()=>{u.value||(0,i._2)({pd:"zpqy",md:"main_chat",ct:"artifacts_preview_success",ctid:g.value,ctnm:m.value})},500))}return(0,r.sV)(()=>{window.addEventListener("message",C);try{var e;let t,r,o=(e=n.code,t=/<html[\s>]/i.test(e),r=/<body[\s>]/i.test(e),t?e.replace(/<html([\s>])/i,'<html style="overflow: auto;"$1'):r?`<!DOCTYPE html><html style="overflow: auto;"><head><meta charset="UTF-8"></head>${e}</html>`:d.replace("CONTENT_PLACEHOLDER",e));o=function(e){if("react"===n.from)return e;try{e=(e=(e=(e=e.replace(/<head>/i,'<head><base href="about:srcdoc">')).replace(/<script\s+src=["'](?!https?:\/\/)([^"']+)["'][^>]*><\/script>/gi,"\x3c!-- 本地脚本已移除: $1 --\x3e")).replace(/<link\s+[^>]*href=["'](?!https?:\/\/)([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi,"\x3c!-- 本地CSS已移除: $1 --\x3e")).replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["'](?!https?:\/\/)([^"']+)["'][^>]*>/gi,"\x3c!-- 本地CSS已移除: $1 --\x3e");let n=[{regex:/<img[^>]+src=["']([^"']+)["']/gi,process:(n,e)=>(0,a.tb)(e)?n.replace(e,`${A}${encodeURIComponent(e)}`):n},{regex:/<script[^>]+src=["']([^"']+)["']/gi,process:(n,e)=>(0,a.tb)(e)?n.replace(e,`${A}${encodeURIComponent(e)}`):n},{regex:/<link[^>]+href=["']([^"']+)["'][^>]*>/gi,process:(n,e)=>n.includes("stylesheet")&&(0,a.tb)(e)?n.replace(e,`${A}${encodeURIComponent(e)}`):n},{regex:/<source[^>]+src=["']([^"']+)["']/gi,process:(n,e)=>(0,a.tb)(e)?n.replace(e,`${A}${encodeURIComponent(e)}`):n},{regex:/<iframe[^>]+src=["']([^"']+)["']/gi,process:(n,e)=>(0,a.tb)(e)?n.replace(e,`${A}${encodeURIComponent(e)}`):n}],t=e;return n.forEach(n=>{t=t.replace(n.regex,n.process)}),t}catch(n){return e}}(o),o=/<head[\s>]/i.test(o)?o.replace("</head>",`${f}${p}</head>`):o.replace(/<html[^>]*>/,"$&<head>"+p+"</head>"),x.value&&(x.value.srcdoc=o)}catch(n){h.value=!0}}),(0,r.xo)(()=>{window.removeEventListener("message",C)}),(n,e)=>((0,r.uX)(),(0,r.CE)(r.FK,null,[(0,r.R1)(u)?((0,r.uX)(),(0,r.CE)("div",s,[(0,r.Lk)("p",{class:(0,r.C4)(["error-icon",{dark:(0,r.R1)(t)}])},null,2),(0,r.Lk)("p",c,(0,r.v_)((0,r.R1)(u)),1)])):(0,r.R1)(h)?(0,r.Q3)("",!0):((0,r.uX)(),(0,r.CE)("div",l,[(0,r.Lk)("div",{class:(0,r.C4)(["loading-spinner",{dark:(0,r.R1)(t)}])},null,2),e[0]||(e[0]=(0,r.Lk)("p",{class:"loading-text"},"加载中，请稍候...",-1))])),(0,r.Lk)("iframe",{ref_key:"iframeRef",ref:x,className:"w-full h-full",title:"HTML Content",sandbox:"allow-scripts allow-same-origin allow-forms",style:(0,r.Tr)({width:"100%",height:"100%",border:"none",visibility:(0,r.R1)(h)?"visible":"hidden"})},null,4)],64))}},[["__scopeId","data-v-4f689cc8"]])}}]);
//# sourceMappingURL=7099.e284bd18.js.map