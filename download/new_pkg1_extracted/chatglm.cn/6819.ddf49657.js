"use strict";(self.webpackChunkzp_chat_glm=self.webpackChunkzp_chat_glm||[]).push([["6819"],{7058:function(e,n,t){var o=t(24064),r=t.n(o),a=t(27872),i=t.n(a)()(r());i.push([e.id,"/**\n * 适配器，采用rem方案适配大部分机型\n */\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n/************ MediaQuery临界值 ************/\n/************ 移动端通用变量 ************/\n/* header 高度 */\n/************ PC端通用变量 ************/\n/* header 高度 */\n/* sessionList样式 */\n/*****************************************公用颜色***********************************************/\n.catelogue-icon-container[data-v-79c62a0f] {\n  align-self: flex-start;\n  margin-right: auto;\n  position: sticky;\n  top: 16px;\n  z-index: 1000;\n  font-family: 'PingFang SC', sans-serif;\n}\n.catelogue-icon-container.full[data-v-79c62a0f] {\n  margin-left: 0;\n  position: static;\n  height: 100%;\n  box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n}\n.catelogue-icon-container.full .expand-box[data-v-79c62a0f] {\n  box-sizing: border-box;\n  height: 100%;\n  padding: 8px 8px 16px 8px;\n  border-radius: 0;\n  border: 0 none;\n  border-right: 1px solid var(--bg_stroke_grey_3_1);\n  background: var(--bg_floating_white_1, #fff);\n  box-shadow: unset;\n}\n.catelogue-icon-container.full .expand-box .header .text[data-v-79c62a0f] {\n  color: var(--txt_icon_black_1, #1a2029);\n}\n.catelogue-icon-container.full .expand-box .header .expand-icon-box[data-v-79c62a0f]:hover {\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container.full .expand-box .header .expand-icon-box .expand-icon[data-v-79c62a0f] {\n  color: var(--txt_icon_black_1, rgba(255, 255, 255, 0.95));\n}\n.catelogue-icon-container.full .expand-box .content[data-v-79c62a0f] {\n  max-height: unset;\n  flex: 1;\n  height: 0;\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .text[data-v-79c62a0f] {\n  color: var(--txt_icon_black_1, #1a2029);\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .text[data-v-79c62a0f]:hover {\n  border-radius: 10px;\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .level-2-item[data-v-79c62a0f] {\n  color: var(--txt_icon_black_2, #4f5866);\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .level-2-item[data-v-79c62a0f]:hover {\n  border-radius: 10px;\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container .catelogue-icon-box[data-v-79c62a0f] {\n  cursor: pointer;\n  display: inline-flex;\n  padding: 12px;\n  justify-content: center;\n  align-items: flex-start;\n  gap: 8px;\n  border-radius: 12px;\n  border: 1px solid #eee;\n  background: #fff;\n  box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n}\n.catelogue-icon-container .catelogue-icon-box[data-v-79c62a0f]:hover {\n  opacity: 0.8;\n}\n.catelogue-icon-container .catelogue-icon-box.full[data-v-79c62a0f] {\n  border: 0 none;\n  background: transparent;\n  box-shadow: unset;\n}\n.catelogue-icon-container .catelogue-icon-box.full[data-v-79c62a0f]:hover {\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container .collapse-box[data-v-79c62a0f] {\n  box-sizing: border-box;\n  height: 100%;\n  padding: 8px;\n  background: var(--bg_floating_white_1, #fff);\n}\n.catelogue-icon-container .collapse-box .catelogue-icon-box[data-v-79c62a0f] {\n  padding: 8px;\n}\n.catelogue-icon-container .collapse-box .catelogue-icon-box .catelogue-icon[data-v-79c62a0f] {\n  color: var(--txt_icon_black_1, #1a2029);\n}\n.catelogue-icon-container .expand-box[data-v-79c62a0f] {\n  box-sizing: border-box;\n  display: flex;\n  width: 300px;\n  padding: 16px 8px;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 12px;\n  border-radius: 16px;\n  border: 1px solid #eee;\n  background: #fff;\n  box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n}\n.catelogue-icon-container .expand-box .header[data-v-79c62a0f] {\n  box-sizing: border-box;\n  width: 100%;\n  padding-left: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.catelogue-icon-container .expand-box .header .text[data-v-79c62a0f] {\n  color: #1a2029;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 28px;\n  /* 186.667% */\n}\n.catelogue-icon-container .expand-box .header .expand-icon-box[data-v-79c62a0f] {\n  cursor: pointer;\n  display: flex;\n  padding: 8px;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n}\n.catelogue-icon-container .expand-box .header .expand-icon-box[data-v-79c62a0f]:hover {\n  border-radius: 8px;\n  background: rgba(79, 88, 102, 0.08);\n}\n.catelogue-icon-container .expand-box .header .expand-icon-box .expand-icon[data-v-79c62a0f] {\n  rotate: transform(180deg);\n  color: #1a2029;\n}\n.catelogue-icon-container .expand-box .content[data-v-79c62a0f] {\n  width: 100%;\n  max-height: 532px;\n  overflow-y: auto;\n}\n.catelogue-icon-container .expand-box .content .level-1-item[data-v-79c62a0f] {\n  width: 100%;\n}\n.catelogue-icon-container .expand-box .content .level-1-item .text[data-v-79c62a0f] {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px;\n  gap: 10px;\n  color: #1a2029;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 24px;\n  /* 160% */\n  text-align: left;\n  cursor: pointer;\n}\n.catelogue-icon-container .expand-box .content .level-1-item .text[data-v-79c62a0f]:hover {\n  border-radius: 10px;\n  background: rgba(79, 88, 102, 0.08);\n}\n.catelogue-icon-container .expand-box .content .level-1-item .level-2-item[data-v-79c62a0f] {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px 8px 8px 24px;\n  gap: 10px;\n  color: #4f5866;\n  font-size: 15px;\n  font-weight: 400;\n  line-height: 24px;\n  /* 160% */\n  text-align: left;\n  cursor: pointer;\n}\n.catelogue-icon-container .expand-box .content .level-1-item .level-2-item[data-v-79c62a0f]:hover {\n  border-radius: 10px;\n  background: rgba(79, 88, 102, 0.08);\n}\n","",{version:3,sources:["webpack://./Catelogue.vue","webpack://./src/components/Conversation/Answer/answerType/TaskEngine/Catelogue.vue"],names:[],mappings:"AAAA;;EAEE;AACF;;;;;;;;;;;;;;;;CAgBC;AACD,wCAAwC;AACxC,kCAAkC;AAClC,cAAc;AACd,kCAAkC;AAClC,cAAc;AACd,kBAAkB;AAClB,6FAA6F;AC6E7F;EACE,sBAAA;EACA,kBAAA;EACA,gBAAA;EACA,SAAA;EACA,aAAA;EACA,sCAAA;AD3EF;AC4EE;EACE,cAAA;EACA,gBAAA;EACA,YAAA;EACA,4CAAA;AD1EJ;ACsEE;EAMI,sBAAA;EACA,YAAA;EACA,yBAAA;EACA,gBAAA;EACA,cAAA;EACA,iDAAA;EACA,4CAAA;EACA,iBAAA;ADzEN;AC4DE;EAgBQ,uCAAA;ADzEV;AC4EU;EACE,8DAAA;AD1EZ;ACsDE;EAuBU,yDAAA;AD1EZ;ACmDE;EA4BM,iBAAA;EACA,OAAA;EACA,SAAA;AD5ER;AC8CE;EAiCU,uCAAA;AD5EZ;AC6EY;EACE,mBAAA;EACA,8DAAA;AD3Ed;ACuCE;EAwCU,uCAAA;AD5EZ;AC6EY;EACE,mBAAA;EACA,8DAAA;AD3Ed;ACyBA;EA0DI,eAAA;EACA,oBAAA;EACA,aAAA;EACA,uBAAA;EACA,uBAAA;EACA,QAAA;EACA,mBAAA;EACA,sBAAA;EACA,gBAAA;EACA,4CAAA;ADhFJ;ACiFI;EACE,YAAA;AD/EN;ACiFI;EACE,cAAA;EACA,uBAAA;EACA,iBAAA;AD/EN;ACgFM;EACE,8DAAA;AD9ER;ACEA;EAiFI,sBAAA;EACA,YAAA;EACA,YAAA;EACA,4CAAA;ADhFJ;ACJA;EAsFM,YAAA;AD/EN;ACPA;EAwFQ,uCAAA;AD9ER;ACVA;EA6FI,sBAAA;EACA,aAAA;EACA,YAAA;EACA,iBAAA;EACA,sBAAA;EACA,uBAAA;EACA,SAAA;EACA,mBAAA;EACA,sBAAA;EACA,gBAAA;EACA,4CAAA;ADhFJ;ACvBA;EAyGM,sBAAA;EACA,WAAA;EACA,iBAAA;EACA,aAAA;EACA,8BAAA;EACA,mBAAA;AD/EN;AC/BA;EAgHQ,cAAA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;ED9EN,aAAa;AACf;ACtCA;EAsHQ,eAAA;EACA,aAAA;EACA,YAAA;EACA,uBAAA;EACA,mBAAA;EACA,SAAA;AD7ER;AC8EQ;EACE,kBAAA;EACA,mCAAA;AD5EV;AClDA;EAiIU,yBAAA;EACA,cAAA;AD5EV;ACtDA;EAuIM,WAAA;EACA,iBAAA;EACA,gBAAA;AD9EN;AC3DA;EA2IQ,WAAA;AD7ER;AC9DA;EA6IU,sBAAA;EACA,WAAA;EACA,YAAA;EACA,SAAA;EACA,cAAA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;ED5ER,SAAS;EC6ED,gBAAA;EACA,eAAA;AD3EV;AC4EU;EACE,mBAAA;EACA,mCAAA;AD1EZ;AC/EA;EA6JU,sBAAA;EACA,WAAA;EACA,yBAAA;EACA,SAAA;EACA,cAAA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;ED3ER,SAAS;EC4ED,gBAAA;EACA,eAAA;AD1EV;AC2EU;EACE,mBAAA;EACA,mCAAA;ADzEZ",sourcesContent:["/**\n * 适配器，采用rem方案适配大部分机型\n */\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n/************ MediaQuery临界值 ************/\n/************ 移动端通用变量 ************/\n/* header 高度 */\n/************ PC端通用变量 ************/\n/* header 高度 */\n/* sessionList样式 */\n/*****************************************公用颜色***********************************************/\n.catelogue-icon-container {\n  align-self: flex-start;\n  margin-right: auto;\n  position: sticky;\n  top: 16px;\n  z-index: 1000;\n  font-family: 'PingFang SC', sans-serif;\n}\n.catelogue-icon-container.full {\n  margin-left: 0;\n  position: static;\n  height: 100%;\n  box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n}\n.catelogue-icon-container.full .expand-box {\n  box-sizing: border-box;\n  height: 100%;\n  padding: 8px 8px 16px 8px;\n  border-radius: 0;\n  border: 0 none;\n  border-right: 1px solid var(--bg_stroke_grey_3_1);\n  background: var(--bg_floating_white_1, #fff);\n  box-shadow: unset;\n}\n.catelogue-icon-container.full .expand-box .header .text {\n  color: var(--txt_icon_black_1, #1a2029);\n}\n.catelogue-icon-container.full .expand-box .header .expand-icon-box:hover {\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container.full .expand-box .header .expand-icon-box .expand-icon {\n  color: var(--txt_icon_black_1, rgba(255, 255, 255, 0.95));\n}\n.catelogue-icon-container.full .expand-box .content {\n  max-height: unset;\n  flex: 1;\n  height: 0;\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .text {\n  color: var(--txt_icon_black_1, #1a2029);\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .text:hover {\n  border-radius: 10px;\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .level-2-item {\n  color: var(--txt_icon_black_2, #4f5866);\n}\n.catelogue-icon-container.full .expand-box .content .level-1-item .level-2-item:hover {\n  border-radius: 10px;\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container .catelogue-icon-box {\n  cursor: pointer;\n  display: inline-flex;\n  padding: 12px;\n  justify-content: center;\n  align-items: flex-start;\n  gap: 8px;\n  border-radius: 12px;\n  border: 1px solid #eee;\n  background: #fff;\n  box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n}\n.catelogue-icon-container .catelogue-icon-box:hover {\n  opacity: 0.8;\n}\n.catelogue-icon-container .catelogue-icon-box.full {\n  border: 0 none;\n  background: transparent;\n  box-shadow: unset;\n}\n.catelogue-icon-container .catelogue-icon-box.full:hover {\n  background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n}\n.catelogue-icon-container .collapse-box {\n  box-sizing: border-box;\n  height: 100%;\n  padding: 8px;\n  background: var(--bg_floating_white_1, #fff);\n}\n.catelogue-icon-container .collapse-box .catelogue-icon-box {\n  padding: 8px;\n}\n.catelogue-icon-container .collapse-box .catelogue-icon-box .catelogue-icon {\n  color: var(--txt_icon_black_1, #1a2029);\n}\n.catelogue-icon-container .expand-box {\n  box-sizing: border-box;\n  display: flex;\n  width: 300px;\n  padding: 16px 8px;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 12px;\n  border-radius: 16px;\n  border: 1px solid #eee;\n  background: #fff;\n  box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n}\n.catelogue-icon-container .expand-box .header {\n  box-sizing: border-box;\n  width: 100%;\n  padding-left: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.catelogue-icon-container .expand-box .header .text {\n  color: #1a2029;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 28px;\n  /* 186.667% */\n}\n.catelogue-icon-container .expand-box .header .expand-icon-box {\n  cursor: pointer;\n  display: flex;\n  padding: 8px;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n}\n.catelogue-icon-container .expand-box .header .expand-icon-box:hover {\n  border-radius: 8px;\n  background: rgba(79, 88, 102, 0.08);\n}\n.catelogue-icon-container .expand-box .header .expand-icon-box .expand-icon {\n  rotate: transform(180deg);\n  color: #1a2029;\n}\n.catelogue-icon-container .expand-box .content {\n  width: 100%;\n  max-height: 532px;\n  overflow-y: auto;\n}\n.catelogue-icon-container .expand-box .content .level-1-item {\n  width: 100%;\n}\n.catelogue-icon-container .expand-box .content .level-1-item .text {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px;\n  gap: 10px;\n  color: #1a2029;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 24px;\n  /* 160% */\n  text-align: left;\n  cursor: pointer;\n}\n.catelogue-icon-container .expand-box .content .level-1-item .text:hover {\n  border-radius: 10px;\n  background: rgba(79, 88, 102, 0.08);\n}\n.catelogue-icon-container .expand-box .content .level-1-item .level-2-item {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px 8px 8px 24px;\n  gap: 10px;\n  color: #4f5866;\n  font-size: 15px;\n  font-weight: 400;\n  line-height: 24px;\n  /* 160% */\n  text-align: left;\n  cursor: pointer;\n}\n.catelogue-icon-container .expand-box .content .level-1-item .level-2-item:hover {\n  border-radius: 10px;\n  background: rgba(79, 88, 102, 0.08);\n}\n","/**\n * 适配器，采用rem方案适配大部分机型\n */\n// rem因子单位，除字体外所有单位均需除以这个单位换算成rem\n// 移动端通用设计稿为750使用@rem\n// 如: width: 100/@rem; 这里100指设计稿上量出的100px，不需要人工除以2\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n@default-w: 750;\n\n.convert(@px, @width: @default-w) {\n  @var: unit(@px / @width) * 10;\n  @rem: ~'@{var}rem';\n}\n\n.remMixin() {\n  @functions: ~`(function() {\n      var clientWidth='750px';\n\n      function convert(size) {\n        return typeof size==='string' ? +size.replace('px', '') : size;\n      }\n\n      this.rem=function(size) {\n        return convert(size) / convert(clientWidth) * 10 + 'rem';\n      }\n    })()`;\n}\n\n.remMixin();\n\n/************ MediaQuery临界值 ************/\n@criticalValue: 6px;\n\n@detailCriticalValue: 1073px;\n\n\n/************ 移动端通用变量 ************/\n/* header 高度 */\n@headerHeightM: 6vh;\n\n\n/************ PC端通用变量 ************/\n/* header 高度 */\n@headerHeight: 135px;\n\n\n/* sessionList样式 */\n@sessionListWidth: 260px;\n@newSessionListWidth: 190px;\n@newVideoSessionListWidth: 256px;\n@sessionListBgColor: #FAFCFF;\n\n@sessionListAndSideWidth: 320px;\n\n/*****************************************公用颜色***********************************************/\n@blue-cff-color: #2a7cff;\n@blue-bf8-color: #7aabf8;\n\n@grey-fe6-color: #dcdfe6;\n@grey-ef0-color: #ebeef0;\n\n// 会会 要求修改的颜色\n// @theme-block-bgColor: #f3f6fc;\n// @code-panel-color: #f3f6fc;\n// @code-bgColor:#fff;\n// @bg-color: #fff;\n// @session-item-active: #fff;\n// @session-bgColor: #f1f5f9;\n// @session-border-width: 0px;\n\n@theme-block-bgColor: #f1f5f9;\n@code-bgColor: rgba(62, 111, 251, .1);\n@code-panel-color: #f8f8f8;\n@bg-color: #fff;\n@session-item-active: var(--bg_stroke_grey_3_5, #f8f8f8);\n@session-bgColor: #fff;\n@session-border-width: 1px;\n\n// 大屏适配\n@large-screen: 1920px;\n\n@screen-min-height: 300px;\n@container-min-width: 1161px;\n@input-min-width: 388px;\n\n@input-box-border-radius: 24px;\n\n.catelogue-icon-container {\n  align-self: flex-start;\n  margin-right: auto;\n  position: sticky;\n  top: 16px;\n  z-index: 1000;\n  font-family: 'PingFang SC', sans-serif;\n  &.full {\n    margin-left: 0;\n    position: static;\n    height: 100%;\n    box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n    .expand-box {\n      box-sizing: border-box;\n      height: 100%;\n      padding: 8px 8px 16px 8px;\n      border-radius: 0;\n      border: 0 none;\n      border-right: 1px solid var(--bg_stroke_grey_3_1);\n      background: var(--bg_floating_white_1, #fff);\n      box-shadow: unset;\n      .header {\n        .text {\n          color: var(--txt_icon_black_1, #1a2029);\n        }\n        .expand-icon-box {\n          &:hover {\n            background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n          }\n          .expand-icon {\n            color: var(--txt_icon_black_1, rgba(255, 255, 255, 0.95));\n          }\n        }\n      }\n      .content {\n        max-height: unset;\n        flex: 1;\n        height: 0;\n        .level-1-item {\n          .text {\n            color: var(--txt_icon_black_1, #1a2029);\n            &:hover {\n              border-radius: 10px;\n              background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n            }\n          }\n          .level-2-item {\n            color: var(--txt_icon_black_2, #4f5866);\n            &:hover {\n              border-radius: 10px;\n              background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n            }\n          }\n        }\n      }\n    }\n  }\n  .catelogue-icon-box {\n    cursor: pointer;\n    display: inline-flex;\n    padding: 12px;\n    justify-content: center;\n    align-items: flex-start;\n    gap: 8px;\n    border-radius: 12px;\n    border: 1px solid #eee;\n    background: #fff;\n    box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n    &:hover {\n      opacity: 0.8;\n    }\n    &.full {\n      border: 0 none;\n      background: transparent;\n      box-shadow: unset;\n      &:hover {\n        background: var(--hover-icon-grey-28, rgba(79, 88, 102, 0.08));\n      }\n    }\n  }\n  .collapse-box {\n    box-sizing: border-box;\n    height: 100%;\n    padding: 8px;\n    background: var(--bg_floating_white_1, #fff);\n    .catelogue-icon-box {\n      padding: 8px;\n      .catelogue-icon {\n        color: var(--txt_icon_black_1, #1a2029);\n      }\n    }\n  }\n  .expand-box {\n    box-sizing: border-box;\n    display: flex;\n    width: 300px;\n    padding: 16px 8px;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 12px;\n    border-radius: 16px;\n    border: 1px solid #eee;\n    background: #fff;\n    box-shadow: 0 0 8px 0 rgba(34, 34, 34, 0.06);\n    .header {\n      box-sizing: border-box;\n      width: 100%;\n      padding-left: 8px;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      .text {\n        color: #1a2029;\n        font-size: 15px;\n        font-weight: 600;\n        line-height: 28px; /* 186.667% */\n      }\n      .expand-icon-box {\n        cursor: pointer;\n        display: flex;\n        padding: 8px;\n        justify-content: center;\n        align-items: center;\n        gap: 20px;\n        &:hover {\n          border-radius: 8px;\n          background: rgba(79, 88, 102, 0.08);\n        }\n        .expand-icon {\n          rotate: transform(180deg);\n          color: #1a2029;\n        }\n      }\n    }\n    .content {\n      width: 100%;\n      max-height: 532px;\n      overflow-y: auto;\n      .level-1-item {\n        width: 100%;\n        .text {\n          box-sizing: border-box;\n          width: 100%;\n          padding: 8px;\n          gap: 10px;\n          color: #1a2029;\n          font-size: 15px;\n          font-weight: 600;\n          line-height: 24px; /* 160% */\n          text-align: left;\n          cursor: pointer;\n          &:hover {\n            border-radius: 10px;\n            background: rgba(79, 88, 102, 0.08);\n          }\n        }\n        .level-2-item {\n          box-sizing: border-box;\n          width: 100%;\n          padding: 8px 8px 8px 24px;\n          gap: 10px;\n          color: #4f5866;\n          font-size: 15px;\n          font-weight: 400;\n          line-height: 24px; /* 160% */\n          text-align: left;\n          cursor: pointer;\n          &:hover {\n            border-radius: 10px;\n            background: rgba(79, 88, 102, 0.08);\n          }\n        }\n      }\n    }\n  }\n}\n"],sourceRoot:""}]),n.A=i},45146:function(e,n,t){var o=t(24064),r=t.n(o),a=t(27872),i=t.n(a),c=t(5019),l=t.n(c),s=new URL(t(26029),t.b),d=new URL(t(18212),t.b),A=new URL(t(97900),t.b),u=new URL(t(68103),t.b),p=new URL(t(66833),t.b),g=new URL(t(5303),t.b),f=i()(r()),x=l()(s),b=l()(d),m=l()(A),h=l()(u),v=l()(p),E=l()(g);f.push([e.id,"/**\n * 适配器，采用rem方案适配大部分机型\n */\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n/************ MediaQuery临界值 ************/\n/************ 移动端通用变量 ************/\n/* header 高度 */\n/************ PC端通用变量 ************/\n/* header 高度 */\n/* sessionList样式 */\n/*****************************************公用颜色***********************************************/\n.error-container[data-v-f9a3c74c] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n}\n.error-container .error-icon[data-v-f9a3c74c] {\n  width: 80px;\n  height: 80px;\n  background: url("+x+") no-repeat;\n  background-size: cover;\n}\n.error-container .error-icon.dark[data-v-f9a3c74c] {\n  background-image: url("+b+");\n}\n.error-container .error-message[data-v-f9a3c74c] {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 22px;\n  /* 157.143% */\n}\n.loading-container[data-v-f9a3c74c] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n}\n.loading-container .loading-spinner[data-v-f9a3c74c] {\n  width: 24px;\n  height: 24px;\n  justify-content: center;\n  align-items: center;\n  background: url("+m+") no-repeat;\n  background-size: cover;\n  animation: rotate 1s linear infinite;\n}\n.loading-container .loading-spinner.dark[data-v-f9a3c74c] {\n  background-image: url("+h+");\n}\n.loading-container .loading-text[data-v-f9a3c74c] {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 24px;\n  /* 171.429% */\n}\n.watermark[data-v-f9a3c74c] {\n  position: absolute;\n  right: 0px;\n  bottom: 0px;\n  width: 10%;\n  aspect-ratio: 3.35;\n  background: url("+v+") no-repeat center center;\n  background-size: 100% 100%;\n}\n.word-watermark[data-v-f9a3c74c] {\n  background: url("+E+") no-repeat center center;\n  background-size: 100% 100%;\n}\n","",{version:3,sources:["webpack://./HTMLRender.vue","webpack://./src/components/Conversation/Answer/answerType/TaskEngine/HTMLRender.vue"],names:[],mappings:"AAAA;;EAEE;AACF;;;;;;;;;;;;;;;;CAgBC;AACD,wCAAwC;AACxC,kCAAkC;AAClC,cAAc;AACd,kCAAkC;AAClC,cAAc;AACd,kBAAkB;AAClB,6FAA6F;AC6E7F;EACE,kBAAA;EACA,MAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,mBAAA;EACA,QAAA;AD3EF;ACiEA;EAYI,WAAA;EACA,YAAA;EACA,6DAAA;EACA,sBAAA;AD1EJ;AC2EI;EACE,yDAAA;ADzEN;ACwDA;EAqBI,sCAAA;EACA,eAAA;EACA,iBAAA;ED1EF,aAAa;AACf;AC4EA;EACE,kBAAA;EACA,MAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,mBAAA;EACA,SAAA;AD1EF;ACgEA;EAaI,WAAA;EACA,YAAA;EACA,uBAAA;EACA,mBAAA;EACA,6DAAA;EACA,sBAAA;EACA,oCAAA;AD1EJ;AC2EI;EACE,yDAAA;ADzEN;ACoDA;EA0BI,sCAAA;EACA,eAAA;EACA,iBAAA;ED3EF,aAAa;AACf;AC6EA;EACE,kBAAA;EACA,UAAA;EACA,WAAA;EACA,UAAA;EACA,kBAAA;EACA,2EAAA;EACA,0BAAA;AD3EF;AC6EA;EACE,2EAAA;EACA,0BAAA;AD3EF",sourcesContent:["/**\n * 适配器，采用rem方案适配大部分机型\n */\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n/************ MediaQuery临界值 ************/\n/************ 移动端通用变量 ************/\n/* header 高度 */\n/************ PC端通用变量 ************/\n/* header 高度 */\n/* sessionList样式 */\n/*****************************************公用颜色***********************************************/\n.error-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n}\n.error-container .error-icon {\n  width: 80px;\n  height: 80px;\n  background: url('~@/assets/images/artifacts/error.png') no-repeat;\n  background-size: cover;\n}\n.error-container .error-icon.dark {\n  background-image: url('~@/assets/images/artifacts/error-dark.png');\n}\n.error-container .error-message {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 22px;\n  /* 157.143% */\n}\n.loading-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n}\n.loading-container .loading-spinner {\n  width: 24px;\n  height: 24px;\n  justify-content: center;\n  align-items: center;\n  background: url('~@/assets/image/common/loading-icon.png') no-repeat;\n  background-size: cover;\n  animation: rotate 1s linear infinite;\n}\n.loading-container .loading-spinner.dark {\n  background-image: url('~@/assets/image/common/loading-icon-dark.png');\n}\n.loading-container .loading-text {\n  color: var(--txt_icon_grey_6, #b0b7c0);\n  font-size: 14px;\n  line-height: 24px;\n  /* 171.429% */\n}\n.watermark {\n  position: absolute;\n  right: 0px;\n  bottom: 0px;\n  width: 10%;\n  aspect-ratio: 3.35;\n  background: url(~@/assets/image/aippt_watermark.png) no-repeat center center;\n  background-size: 100% 100%;\n}\n.word-watermark {\n  background: url(~@/assets/image/aiword_watermark.png) no-repeat center center;\n  background-size: 100% 100%;\n}\n","/**\n * 适配器，采用rem方案适配大部分机型\n */\n// rem因子单位，除字体外所有单位均需除以这个单位换算成rem\n// 移动端通用设计稿为750使用@rem\n// 如: width: 100/@rem; 这里100指设计稿上量出的100px，不需要人工除以2\n/**\n* 字号规则\n* 超小号字： font-size: 24/@rem;\n* 超小号字： font-size: 12px;\n\n* 小号字： font-size: 28/@rem;\n* 小号字： font-size: 14px;\n\n* 中号字： font-size: 32/@rem;\n* 中号字： font-size: 16px;\n\n* 大号字： font-size: 36/@rem;\n* 大号字： font-size: 18px;\n\n* 超大号字： font-size: 40/@rem;\n* 超大号字： font-size: 20px;\n*/\n@default-w: 750;\n\n.convert(@px, @width: @default-w) {\n  @var: unit(@px / @width) * 10;\n  @rem: ~'@{var}rem';\n}\n\n.remMixin() {\n  @functions: ~`(function() {\n      var clientWidth='750px';\n\n      function convert(size) {\n        return typeof size==='string' ? +size.replace('px', '') : size;\n      }\n\n      this.rem=function(size) {\n        return convert(size) / convert(clientWidth) * 10 + 'rem';\n      }\n    })()`;\n}\n\n.remMixin();\n\n/************ MediaQuery临界值 ************/\n@criticalValue: 6px;\n\n@detailCriticalValue: 1073px;\n\n\n/************ 移动端通用变量 ************/\n/* header 高度 */\n@headerHeightM: 6vh;\n\n\n/************ PC端通用变量 ************/\n/* header 高度 */\n@headerHeight: 135px;\n\n\n/* sessionList样式 */\n@sessionListWidth: 260px;\n@newSessionListWidth: 190px;\n@newVideoSessionListWidth: 256px;\n@sessionListBgColor: #FAFCFF;\n\n@sessionListAndSideWidth: 320px;\n\n/*****************************************公用颜色***********************************************/\n@blue-cff-color: #2a7cff;\n@blue-bf8-color: #7aabf8;\n\n@grey-fe6-color: #dcdfe6;\n@grey-ef0-color: #ebeef0;\n\n// 会会 要求修改的颜色\n// @theme-block-bgColor: #f3f6fc;\n// @code-panel-color: #f3f6fc;\n// @code-bgColor:#fff;\n// @bg-color: #fff;\n// @session-item-active: #fff;\n// @session-bgColor: #f1f5f9;\n// @session-border-width: 0px;\n\n@theme-block-bgColor: #f1f5f9;\n@code-bgColor: rgba(62, 111, 251, .1);\n@code-panel-color: #f8f8f8;\n@bg-color: #fff;\n@session-item-active: var(--bg_stroke_grey_3_5, #f8f8f8);\n@session-bgColor: #fff;\n@session-border-width: 1px;\n\n// 大屏适配\n@large-screen: 1920px;\n\n@screen-min-height: 300px;\n@container-min-width: 1161px;\n@input-min-width: 388px;\n\n@input-box-border-radius: 24px;\n\n.error-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n  .error-icon {\n    width: 80px;\n    height: 80px;\n    background: url('~@/assets/images/artifacts/error.png') no-repeat;\n    background-size: cover;\n    &.dark {\n      background-image: url('~@/assets/images/artifacts/error-dark.png');\n    }\n  }\n  .error-message {\n    color: var(--txt_icon_grey_6, #b0b7c0);\n    font-size: 14px;\n    line-height: 22px; /* 157.143% */\n  }\n}\n.loading-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n\n  .loading-spinner {\n    width: 24px;\n    height: 24px;\n    justify-content: center;\n    align-items: center;\n    background: url('~@/assets/image/common/loading-icon.png') no-repeat;\n    background-size: cover;\n    animation: rotate 1s linear infinite;\n    &.dark {\n      background-image: url('~@/assets/image/common/loading-icon-dark.png');\n    }\n  }\n\n  .loading-text {\n    color: var(--txt_icon_grey_6, #b0b7c0);\n    font-size: 14px;\n    line-height: 24px; /* 171.429% */\n  }\n}\n.watermark {\n  position: absolute;\n  right: 0px;\n  bottom: 0px;\n  width: 10%;\n  aspect-ratio: 134 / 40;\n  background: url(~@/assets/image/aippt_watermark.png) no-repeat center center;\n  background-size: 100% 100%;\n}\n.word-watermark {\n  background: url(~@/assets/image/aiword_watermark.png) no-repeat center center;\n  background-size: 100% 100%;\n}\n"],sourceRoot:""}]),n.A=f},45633:function(e,n,t){t.d(n,{$z:function(){return r},BR:function(){return i},FC:function(){return l},IC:function(){return c},gG:function(){return o},kl:function(){return a},n4:function(){return s},u1:function(){return d}});let o=/^【\d+†.*?】/,r=/【(\d+)†([^【】]+)(?:,([^\d,]*[\d-]+))?】/g,a=/^【|^【\d+|^【\d+†[^】]$/,i=/^【[^\d]|^【\d+[^†]/,c=/(【|\[)(turn\d+(?:search|fetch|click|find)\d+)(】|\])/g,l={recommend:"recommend"},s={ppt:"ppt",drAuto:"deep_research_auto"},d={"670e3c3e119b48fe5a851149":"ppt","668d03b2e99d661ed3c32516":"video","67c66a1b3ea6af772310b112":"4o"}},90586:function(e,n,t){t.d(n,{A:function(){return z}});var o=t(94421),r=t(8427),a=t(19630),i=t(30121);let c={key:1,class:"collapse-box"},l={key:2,class:"expand-box"},s={class:"header"},d={class:"text"},A=["data-href","onClick"],u=["data-href","onClick"];var p=t(87077),g=t.n(p),f=t(55954),x=t.n(f),b=t(57810),m=t.n(b),h=t(30861),v=t.n(h),E=t(92281),C=t.n(E),y=t(10406),k=t.n(y),w=t(7058),_={};_.styleTagTransform=k(),_.setAttributes=v(),_.insert=m().bind(null,"head"),_.domAPI=x(),_.insertStyleElement=C(),g()(w.A,_),w.A&&w.A.locals&&w.A.locals;var z=(0,t(55553).default)({__name:"Catelogue",props:{initExpand:{type:Boolean,default:!1}},setup(e,{expose:n}){let{t}=i.Ay.global,{showTaskAside:p,isFullScreen:g,catalogueList:f}=(0,r.J0)("TaskAside",["showTaskAside","isFullScreen","catalogueList"]),x=(0,o.KR)(!1),b=(0,o.KR)(null),m=(0,o.KR)(e.initExpand),h=()=>{m.value=!m.value},v=(0,o.EW)(()=>!p.value||g.value),E=(0,o.KR)(""),C=e=>{E.value=e;let n=document.querySelector("iframe"),t=n?.contentDocument?.querySelector(`a[href="${e}"]`);t&&(t.click(),v.value||h())};function y(){v.value||(m.value=!1,x.value=!0,clearTimeout(b.value),b.value=setTimeout(()=>{x.value=!1},300))}(0,o.sV)(()=>{let e=document.querySelector(".preview-container");e?.addEventListener("scroll",y)}),(0,o.hi)(()=>{let e=document.querySelector(".preview-container");e?.removeEventListener("scroll",y),b.value&&clearTimeout(b.value)});let k=()=>{!v.value&&m.value&&(m.value=!1)};return n({expand:m}),(e,n)=>{let r=(0,o.g2)("el-tooltip"),i=(0,o.gN)("click-outside");return(0,o.R1)(x)?(0,o.Q3)("",!0):((0,o.uX)(),(0,o.CE)("div",{key:0,class:(0,o.C4)(["catelogue-icon-container",{full:(0,o.R1)(v),expand:(0,o.R1)(m)}])},[(0,o.R1)(m)||(0,o.R1)(v)?!(0,o.R1)(m)&&(0,o.R1)(v)?((0,o.uX)(),(0,o.CE)("div",c,[(0,o.bF)(r,{content:(0,o.R1)(t)("common.expandDirectory"),placement:"right"},{default:(0,o.k6)(()=>[(0,o.Lk)("div",{class:"catelogue-icon-box full",onClick:(0,o.D$)(h,["stop"])},[(0,o.bF)((0,o.R1)(a.SaN),{class:"size-20 catelogue-icon"})])]),_:1},8,["content"])])):(0,o.bo)(((0,o.uX)(),(0,o.CE)("div",l,[(0,o.Lk)("div",s,[(0,o.Lk)("p",d,(0,o.v_)((0,o.R1)(t)("common.directoryNavigation")),1),(0,o.bF)(r,{content:(0,o.R1)(t)("common.collapseDirectory"),placement:"right"},{default:(0,o.k6)(()=>[(0,o.Lk)("div",{class:"expand-icon-box",onClick:h},[(0,o.bF)((0,o.R1)(a.SaN),{class:"size-20 catelogue-icon expand-icon"})])]),_:1},8,["content"])]),(0,o.Lk)("div",{class:"content",onScroll:n[0]||(n[0]=(0,o.D$)(()=>{},["stop"]))},[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)((0,o.R1)(f),(e,n)=>((0,o.uX)(),(0,o.CE)("div",{class:"level-1-item",key:"level-1"+n},[(0,o.Lk)("p",{class:(0,o.C4)(["text dot"]),"data-href":e.href,onClick:n=>C(e.href)},(0,o.v_)(e.title),9,A),((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(e.children,(e,n)=>((0,o.uX)(),(0,o.CE)("div",{class:(0,o.C4)(["level-2-item dot"]),key:"level-2"+n,"data-href":e.href,onClick:n=>C(e.href)},(0,o.v_)(e.title),9,u))),128))]))),128))],32)])),[[i,k]]):((0,o.uX)(),(0,o.Wv)(r,{key:0,content:(0,o.R1)(t)("common.expandDirectory"),placement:"right"},{default:(0,o.k6)(()=>[(0,o.Lk)("div",{class:"catelogue-icon-box",onClick:(0,o.D$)(h,["stop"])},[(0,o.bF)((0,o.R1)(a.SaN),{class:"size-20 catelogue-icon"})])]),_:1},8,["content"]))],2))}}},[["__scopeId","data-v-79c62a0f"]])},11038:function(e,n,t){t.d(n,{A:function(){return S}}),t(10894),t(38728),t(90832),t(15417),t(43477),t(98982);var o=t(94421),r=t(8427),a=t(45634),i=t(90586),c=t(45633),l=t(9830),s=t(56517);let d={key:1,class:"error-container"},A={class:"error-message"},u={key:2,class:"loading-container"},p="https://cdn-proxy.chatglm.cn/",g=`
<!DOCTYPE html>
<html>
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
    .slide {
      width: auto !important;
      height: auto !important;
    }
  </style>
</head>
<body>
  CONTENT_PLACEHOLDER
</body>
</html>
`,f=`
<style>
  body > div.container {
    margin: 0;
  }
  span.source-item {
    cursor: pointer;
    border-radius: 14px;
    user-select: none;
    // background: #4f5866;
    width: 24px;
    height: 18px;
    text-align: center;
    color: var(--bg_blue_2, rgba(36, 84, 255, 0.06));
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    .source-text-flex {
      display: flex;
    }
    .source-item-num {
      position: relative;
      display: inline-flex;
      border-radius: 8px;
      width: 16px;
      height: 16px;
      align-items: center;
      justify-content: center;
      top: -2px;
      background: var(--bg_blue-1, var(--bg_blue_2, rgba(36, 84, 255, 0.06)));
      color: var(--white-text-1, var(--txt_icon_black_2, #4f5866));
      font-size: 10px;
      line-height: 15px;
      font-weight: 600;
      &:hover {
        background: var(--bg-lable_grey_216, rgba(79, 88, 102, 0.16));
      }
    }
  }
</style>
`,x=`
<style>
  @keyframes caretRainbow {
    0%   { caret-color: #ef4444; }
    16%  { caret-color: #f97316; }
    32%  { caret-color: #eab308; }
    48%  { caret-color: #22c55e; }
    64%  { caret-color: #3b82f6; }
    80%  { caret-color: #8b5cf6; }
    100% { caret-color: #ec4899; }
  }
  .editable-hover {
    outline: 2px dashed var(--txt_stroke_blue_1, #2454FF) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }
  .element-editing {
    outline: 2px solid var(--txt_stroke_blue_1, #2454FF) !important;
  }
</style>
`,b=`
function initInnerEditor() {
	let currentEditElement = null;

	// 鼠标进入事件
	function handleMouseOver(event) {
		event.stopPropagation();
		event.target.classList.add('editable-hover');
	}

	// 鼠标离开事件
	function handleMouseOut(event) {
		event.stopPropagation();
		event.target.classList.remove('editable-hover');
	}

	// 直接编辑元素的输入事件
	function handleInput(event) {
		const value = event.target.innerHTML;
		if (event.target.hasAttribute('data-z-edit-id')) {
			const editID = event.target.getAttribute('data-z-edit-id');
			window.parent.postMessage({
				type: 'manualEdit',
				data: {
					text: value,
					editID
				}
			});
		}
	}

	// 输入框失去焦点
	function handleElementBlur() {}

  function disableCurrentEdit() {
		if (currentEditElement) {
			currentEditElement.removeAttribute('contenteditable');
			currentEditElement.classList.remove('element-editing');
			currentEditElement.removeEventListener('input', handleInput);
			currentEditElement.removeEventListener('blur', handleElementBlur);
			currentEditElement = null;
		}
	}

	// 点击事件
	function handleClick(event) {
		event.preventDefault();
		event.stopPropagation();

		const element = event.target;
		if (currentEditElement === element || element.className.indexOf('source-item') > -1) return;
    disableCurrentEdit();
		currentEditElement = element;
		// 如果element的子节点是文本节点,那么自动focus
		if ([...element.childNodes].find((el) => {
			return el.nodeType === Node.TEXT_NODE && el.data.trim().length > 0;
		})) {
			element.setAttribute('contenteditable', 'true');
			element.focus();
		}
		element.classList.remove('editable-hover');
		element.classList.add('element-editing');

		element.addEventListener('input', handleInput);
		element.addEventListener('blur', handleElementBlur);
	}

	// 编辑元素的点击事件
	function enableEditBlock() {
		// 获取所有块级和行内元素
		const elements = document.body.querySelectorAll('*');

		// 为每个元素添加鼠标事件监听
		elements.forEach((element) => {
			element.addEventListener('mouseover', handleMouseOver);
			element.addEventListener('mouseout', handleMouseOut);
			element.addEventListener('click', handleClick);
		});
	}

	enableEditBlock();
}

initInnerEditor();
`;var m=t(87077),h=t.n(m),v=t(55954),E=t.n(v),C=t(57810),y=t.n(C),k=t(30861),w=t.n(k),_=t(92281),z=t.n(_),B=t(10406),D=t.n(B),R=t(45146),L={};L.styleTagTransform=D(),L.setAttributes=w(),L.insert=y().bind(null,"head"),L.domAPI=E(),L.insertStyleElement=z(),h()(R.A,L),R.A&&R.A.locals&&R.A.locals;var S=(0,t(55553).default)({__name:"HTMLRender",props:{id:{type:String,required:!0},code:{type:String,required:!0},from:{type:String,default:""},isLast:{type:Boolean,default:!1},isPlay:{type:Boolean,default:!1},shareCitations:{type:Array,default:()=>[]}},emits:["iframe-loaded","post-iframe-sizes"],setup(e,{expose:n,emit:t}){let{isDarkMode:m}=(0,r.J0)("DarkMode",["isDarkMode"]),{isSearching:h}=(0,r.J0)("Conversation",["isSearching"]),{showTaskAside:v,isEdit:E,isFullScreen:C,localReportList:y,curHistoryId:k}=(0,r.J0)("TaskAside",["showTaskAside","isEdit","isFullScreen","localReportList","curHistoryId"]),{modelType:w}=(0,r.J0)("Session",["modelType"]),_=(0,o.KR)(null),z=(0,o.KR)(e.id),B=(0,o.KR)(null),D=(0,o.KR)(!1),R=(0,o.KR)(null),L=(0,s.lq)()?.query,S=!!L?.share_report_id,I=(0,o.lW)(e,"shareCitations"),F=`
<script>
  (function() {
    // 为每个iframe生成唯一标识
    const iframeId = '${e.id}';

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
            iframeId: iframeId,
            method,
            args,
            timestamp
          }, '*');
        } catch (e) {
          window.parent.postMessage({
            type: 'console',
            iframeId: iframeId,
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

    // 监听DOM结构加载完成
    document.addEventListener('DOMContentLoaded', function(event) {
      console.log('[iframe] DOM结构加载完成');
      window.parent.postMessage({
        type: 'resourceStatus',
        iframeId: iframeId,
        status: 'domReady'
      }, '*');
    });

    // 监听所有资源加载完成
    window.addEventListener('load', function(event) {
      // 通知父窗口页面已完全加载
      window.parent.postMessage({
        type: 'resourceStatus',
        iframeId: iframeId,
        status: 'complete'
      }, '*');
      return false;
    });

    // 监听来自父窗口的消息
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'injectScript') {
        try {
          // 动态执行脚本
          const script = document.createElement('script');
          script.textContent = event.data.script;
          document.head.appendChild(script);
        } catch (e) {
          console.error('注入脚本失败:', e);
        }
      }
    });

    window.addEventListener('click', function(event) {
      window.parent.postMessage({
        type: 'iframeClick',
        iframeId: iframeId
      }, '*');
      // 点击的目录锚点元素传给外层的目录 实现联动
      if (event.target.tagName === 'A' && event.target.href.includes('#')) {
        window.parent.postMessage({
          type: 'anchorClick',
          iframeId: iframeId,
          href: decodeURIComponent(event.target.href?.split('#')?.[1])
        }, '*');
      }
      // 溯源信息点击
      const className = event.target?.className;
       if (className && className.indexOf('source-item-num') > -1) {
          window.parent.postMessage({
            type: 'sourceItemClick',
            iframeId: iframeId,
            url: event.target.dataset?.id
          }, '*');
      }
    });
  })();
</script>
`;function M(e){if(e.data?.iframeId===z.value){if(e.data?.type==="console"){if("clear"===e.data.method);else if(e.data?.method==="error"){let n=e.data.args||[],o=Array.isArray(n)?n.map(e=>"object"==typeof e?JSON.stringify(e):String(e)).join(" "):String(n);R.value&&o.startsWith("Warning"),t("iframe-loaded")}}else if(e.data?.type==="resourceStatus")e.data?.status==="domReady"?(D.value=!0,Q("domReady"),T(),t("iframe-loaded")):e.data?.status==="complete"&&(T(),Q("complete"));else if(e.data?.type==="anchorClick"){let n=document.querySelector(".expand-box");n&&n.querySelectorAll("[data-href]").forEach(n=>{n.classList.remove("active"),n.dataset.href===`#${e.data.href}`&&n.classList.add("active")})}else e.data?.type==="iframeClick"&&_.value&&(_.value.expand=!1);if(e.data?.type==="sourceItemClick"){let n=e.data?.url;n&&window.open(n,"_blank")}}}function W(){let e=R.value;if(!e)return null;try{let n=e.contentDocument||e.contentWindow.document;if(!n)return null;let t=n.querySelector("body");if(!t)return null;let o=t.offsetWidth||t.scrollWidth||1280,r=t.offsetHeight||t.scrollHeight||720;return{width:o,height:r}}catch(e){return null}}function T(){return W()||{width:1280,height:720}}(0,o.sV)(()=>{window.addEventListener("message",M);try{var n;let t,r,i=(n=e.code,t=/<html[\s>]/i.test(n),r=/<body[\s>]/i.test(n),t?n.replace(/<html([\s>])/i,'<html style="overflow: hidden;"$1'):r?`<!DOCTYPE html><html style="overflow: hidden;"><head><meta charset="UTF-8"></head>${n}</html>`:g.replace("CONTENT_PLACEHOLDER",n));i=function(n){if("react"===e.from)return n;try{n=(n=(n=(n=(n=n.replace(/<head>/i,'<head><base href="about:srcdoc">')).replace(/<script\s+src=["'](?!https?:\/\/)([^"']+)["'][^>]*><\/script>/gi,"\x3c!-- 本地脚本已移除: $1 --\x3e")).replace(/<link\s+[^>]*href=["'](?!https?:\/\/)([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi,"\x3c!-- 本地CSS已移除: $1 --\x3e")).replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["'](?!https?:\/\/)([^"']+)["'][^>]*>/gi,"\x3c!-- 本地CSS已移除: $1 --\x3e")).replace(/maintainAspectRatio:\s*false/g,"maintainAspectRatio: true");let e=[{regex:/<img[^>]+src=["']([^"']+)["']/gi,process:(e,n)=>(0,a.tb)(n)?e.replace(n,`${p}${encodeURIComponent(n)}`):e},{regex:/<script[^>]+src=["']([^"']+)["']/gi,process:(e,n)=>(0,a.tb)(n)?e.replace(n,`${p}${encodeURIComponent(n)}`):e},{regex:/<link[^>]+href=["']([^"']+)["'][^>]*>/gi,process:(e,n)=>{if(e.includes("stylesheet")){let t=e;return(0,a.tb)(n)&&(t=t.replace(n,`${p}${encodeURIComponent(n)}`)),t.includes("crossorigin")||(t=t.replace(">",' crossorigin="anonymous">')),t}return e}},{regex:/<source[^>]+src=["']([^"']+)["']/gi,process:(e,n)=>(0,a.tb)(n)?e.replace(n,`${p}${encodeURIComponent(n)}`):e},{regex:/<iframe[^>]+src=["']([^"']+)["']/gi,process:(e,n)=>(0,a.tb)(n)?e.replace(n,`${p}${encodeURIComponent(n)}`):e}],t=n;return e.forEach(e=>{t=t.replace(e.regex,e.process)}),t}catch(e){return n}}(i),i=/<head[\s>]/i.test(i)?i.replace("</head>",`${f}${x}${F}</head>`):i.replace(/<html[^>]*>/,"$&<head>"+x+F+"</head>");let l=(0,o.R1)(y).filter(e=>e.history_id===k.value),s=S?I.value:!!l?.length&&l[0]?.meta_data?.msearch_list;i=i.replace(c.$z,(e,n)=>{let t=+n,o=s?.find(e=>e.index===t);return o?`<span class='source-item item-${n}' data-id='${o?.url}' contenteditable="false"><span class='source-item-num' data-id='${o?.url}' contenteditable="false">${t}</span></span>`:""}),R.value&&(R.value.srcdoc=i)}catch(e){D.value=!0,t("iframe-loaded")}}),(0,o.wB)(E,e=>{if(e){if(R.value){let e=R.value;try{let n=b.trim();e.contentWindow.postMessage({type:"injectScript",script:n},"*")}catch(e){}}}else R.value&&R.value.contentWindow.location.reload()}),(0,o.xo)(()=>{window.removeEventListener("message",M)}),n({handleSave:function(){if(R.value)try{let e=R.value,n=e.contentDocument||e.contentWindow.document;if(n){let e=n.documentElement.cloneNode(!0);e.querySelectorAll("script").forEach(e=>{(e.textContent.includes("initInnerEditor")||e.textContent.includes("originalConsole")||e.textContent.includes("postMessage"))&&e.remove()}),e.querySelectorAll("style").forEach(e=>{(e.textContent.includes("editable-hover")||e.textContent.includes("caretRainbow")||e.textContent.includes("element-editing"))&&e.remove()});let t=e.querySelectorAll("*");return t.forEach(e=>{e.classList.remove("editable-hover","element-editing"),e.hasAttribute("contenteditable")&&e.removeAttribute("contenteditable"),e.hasAttribute("data-z-edit-id")&&e.removeAttribute("data-z-edit-id")}),t.forEach(e=>{if(e.className.indexOf("source-item")>-1){let n=e.className.split(" "),t="0";for(let e of n)if(e.startsWith("item-")){t=e.replace("item-","");break}e=`【${t}†source】`}}),e.outerHTML}}catch(e){}},getAllPageSizes:T,getBodySize:W,isIframeLoaded:D,id:e.id});let N=(0,o.KR)(null),$=(0,o.KR)(1),j=(0,o.KR)(1280),U=(0,o.KR)(720),O=(0,o.EW)(()=>({width:j.value+"px",height:U.value+"px",transform:`translate(-50%, -50%) scale(${$.value})`,transformOrigin:"center center",border:"none",position:"absolute",left:"50%",top:"50%",overflow:"hidden",background:"#fff",visibility:D.value?"visible":"hidden",borderRadius:"16px"}));function P(){let n=N.value;if(n){if(e.isPlay){n.style.maxWidth="100%",n.style.border="0 none",n.style.borderRadius="0",n.style.backgroundColor="transparent",$.value=Math.min(n.offsetWidth/j.value,n.offsetHeight/U.value);return}$.value=n.offsetWidth/j.value,n.style.height=U.value*$.value+"px"}}let q=new ResizeObserver(()=>{P()});(0,o.sV)(()=>{P();let e=document.querySelector(".task-aside-container");e&&q.observe(e)}),(0,o.xo)(()=>{q.disconnect()}),(0,o.wB)(C,()=>{P()});let H=["script","style","link","meta","noscript"];function Q(n){let o=R.value;if(o)try{let r=o.contentDocument||o.contentWindow.document,a=r.querySelector(".slide")||r.querySelector(".poster-container");if(!a){let e=r.querySelector("body"),n=function e(n){if(!n)return null;let t=Array.from(n.children).filter(e=>{let n=e.tagName.toLowerCase();return!H.includes(n)});if(t.length>1)return n;for(let n of t){let t=e(n);if(t)return t}return null}(e);a=n||e}a&&(a.tagName?.toLowerCase()==="svg"?(j.value=a.viewBox?.baseVal?.width||a.getAttribute("width"),U.value=a.viewBox?.baseVal?.height||a.getAttribute("height")):(j.value=a.offsetWidth,U.value=a.offsetHeight),t("post-iframe-sizes",{type:n,id:e.id,width:j.value,height:U.value}),P())}catch(e){}}function V(){t("mousemove")}function K(e){t("keydown",e)}(0,o.wB)(D,n=>{if(n&&e.isPlay&&R.value&&R.value.contentWindow)try{R.value.contentWindow.document.addEventListener("mousemove",V),R.value.contentWindow.document.addEventListener("keydown",K)}catch(e){}}),(0,o.xo)(()=>{R.value&&R.value.contentWindow&&(R.value.contentWindow.document.removeEventListener("mousemove",V),R.value.contentWindow.document.removeEventListener("keydown",K))});let{SET_STATE:Y}=(0,r.kn)("TaskAside",["SET_STATE"]),J=(0,o.KR)([]);return(0,o.sV)(()=>{if(e.code){let n;J.value=function(e){let n=document.createElement("div");n.innerHTML=e;let t=n.querySelector("ul.toc-level-2");if(!t)return[];let o=[];return Array.from(t.children).forEach(e=>{let n=function e(n,t){if("LI"===n.tagName){let o=n.querySelector("a");if(!o)return null;let r={title:o.textContent.trim(),href:o.getAttribute("href")||"",level:t,children:[]},a=n.querySelector("ul");return a&&Array.from(a.children).forEach(n=>{let o=e(n,t+1);o&&r.children.push(o)}),r}return null}(e,0);n&&o.push(n)}),o}((n=e.code.match(/<nav class="toc">[\s\S]*<\/nav>/),n?.[0]||"")),Y({catalogueList:J.value})}}),(n,t)=>((0,o.uX)(),(0,o.CE)("div",{key:e.id,ref_key:"containerRef",ref:N,class:"html",style:{"align-self":"center","box-sizing":"border-box",width:"100%","max-width":"1280px",position:"relative",display:"flex","align-items":"center","justify-content":"center","border-radius":"16px",border:"1px solid rgb(0 0 0 / 4%)"}},[(0,o.R1)(v)&&!(0,o.R1)(C)&&(0,o.R1)(J).length?((0,o.uX)(),(0,o.Wv)(i.A,{key:0,ref_key:"catelogueRef",ref:_},null,512)):(0,o.Q3)("",!0),(0,o.R1)(B)?((0,o.uX)(),(0,o.CE)("div",d,[(0,o.Lk)("p",{class:(0,o.C4)(["error-icon",{dark:(0,o.R1)(m)}])},null,2),(0,o.Lk)("p",A,(0,o.v_)((0,o.R1)(B)),1)])):(0,o.R1)(D)?(0,o.Q3)("",!0):((0,o.uX)(),(0,o.CE)("div",u,[(0,o.Lk)("div",{class:(0,o.C4)(["loading-spinner",{dark:(0,o.R1)(m)}])},null,2),t[0]||(t[0]=(0,o.Lk)("p",{class:"loading-text"},"加载中，请稍候...",-1))])),(0,o.Lk)("iframe",{ref_key:"iframeRef",ref:R,title:"HTML Content",sandbox:"allow-scripts allow-same-origin allow-forms",style:(0,o.Tr)((0,o.R1)(O))},null,4),e.isLast&&!(0,o.R1)(h)?((0,o.uX)(),(0,o.CE)("div",{key:3,class:(0,o.C4)(["watermark",{"word-watermark":(0,o.R1)(w)===(0,o.R1)(l.bJ)}])},null,2)):(0,o.Q3)("",!0)]))}},[["__scopeId","data-v-f9a3c74c"]])}}]);
//# sourceMappingURL=6819.ddf49657.js.map