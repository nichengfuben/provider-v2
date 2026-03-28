try{let t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},e=(new t.Error).stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="5abbac24-673a-4181-ac65-9c7cfc6dd27e",t._sentryDebugIdIdentifier="sentry-dbid-5abbac24-673a-4181-ac65-9c7cfc6dd27e")}catch(t){}"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8826],{98826:function(t,e){var n=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))(function(o,c){function r(t){try{s(i.next(t))}catch(t){c(t)}}function a(t){try{s(i.throw(t))}catch(t){c(t)}}function s(t){var e;t.done?o(t.value):((e=t.value)instanceof n?e:new n(function(t){t(e)})).then(r,a)}s((i=i.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});let i=()=>{};class o{constructor({tencentProps:t,hsProps:e}){this.isHSInitialized=!1,this.tencent={qdtracker:null,appkey:t.appkey||"",appid:t.appid||"",openid:t.openid||""},this.hs={hstracker:null,appid:e.appid},this.commonAttrStore={}}init(){return n(this,void 0,void 0,function*(){if("undefined"==typeof window)throw Error("Tracker is only used in browser.");yield this._initHS(),this.isHSInitialized=!0})}_initTC(){this.tencent.qdtracker=window.QDTracker.init({appkey:this.tencent.appkey,tid:"",options:{preventAutoTrack:!1,pagestay:!0,useOpenId:!1,appid:this.tencent.appid,openid:this.tencent.openid,ping_method:"POST",encrypt_mode:"close",enable_compression:!1,track_interval:0,batch_max_time:1,url:"https://report.growth.qq.com/data/report"}})}_initHS(){let t=document.createElement("script");t.innerHTML=`(function(win, export_obj) {
        win['TeaAnalyticsObject'] = export_obj;
        if (!win[export_obj]) {
            function _collect() {
                _collect.q.push(arguments);
            }
            _collect.q = _collect.q || [];
            win[export_obj] = _collect;
        }
        win[export_obj].l = +new Date();
    })(window, 'collectEvent');`;let e=document.createElement("script");e.src="https://lf3-data.volccdn.com/obj/data-static/log-sdk/collect/5.0/collect-rangers-v5.2.6.js",e.async=!0;let n=document.createElement("script");n.innerHTML=`window.collectEvent('init', { app_id:${this.hs.appid},
        channel: 'cn',
        channel_domain: 'https://gator.volces.com',
        ab_channel_domain: 'https://tab.volces.com',
        log: true,
        autotrack: false,
        enable_ab_test: true,
        enable_multilink: false,
        enable_ab_visual: false,
        disable_sdk_monitor:true,
        enable_stay_duration: true,
    });
    window.collectEvent('start')`,document.body.appendChild(t),document.body.appendChild(e),document.body.appendChild(n),this.hs.hstracker=window.collectEvent}getWebId(){return new Promise((t,e)=>{if(!this.isHSInitialized){e(Error("请先初始化 SDK"));return}let n=setTimeout(()=>{e(Error("获取 web_id 超时"))},5e3);window.collectEvent("getToken",i=>{clearTimeout(n),(null==i?void 0:i.web_id)?t(i.web_id):e(Error("未能获取有效 web_id"))})})}storeCommonAttrs(t){this.commonAttrStore=Object.assign(Object.assign({},this.commonAttrStore),t)}setCommonAttrsToSDK(t){this.tencent.qdtracker&&this.tencent.qdtracker.setCommonData(t),window.collectEvent("config",t)}track(t,e,n){n||(n=i);let o=Object.assign({},e);for(let t in this.commonAttrStore)this.commonAttrStore[t]&&(o[t]=this.commonAttrStore[t]);this.tencent.qdtracker&&this.tencent.qdtracker.track(t,o,n),window.collectEvent(t,o)}abTestTrack(t,e,n=i){window.collectEvent("getVar",t,e,n)}}e.default=o}}]);
//# sourceMappingURL=8826.e02f1e6cba80cb2e.js.map