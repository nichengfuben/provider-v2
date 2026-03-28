import { createApp } from "vue";
import { createPinia } from "pinia";
import iframeApp from "./mobileApp.vue";

import "@/styles/base.css";
import "@/styles/tributeMention.scss";
import "@/styles/darkTheme.scss";

import ElementPlus from "element-plus";
import locale from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import directive from "@/directive/index";

import "virtual:svg-icons-register";

createApp(iframeApp)
  .use(ElementPlus, { locale })
  .use(createPinia())
  .use(directive)
  .mount("#app");

// 在main.js 中引入，需要在 lib.js 中注册，否则lib模式打包时没有包含。
// 此时如果宿主应用有同名组件，会使用宿主应用的，否则会找不到。也不能跟宿主应用起同一个名字，否则会覆盖宿主的。
