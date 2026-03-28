;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="6580b06b-d49c-e5c7-94d9-cff7b44fd660")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,96923,e=>{"use strict";let t,r,i;var n,a,s,l,o,u,d,c,h=e.i(474076),f=e.i(822315),p=e.i(235971),m=e.i(77270),v=e.i(472856),y=e.i(692278),g=e.i(596580),b=e.i(884364);let _=String.raw,E=_`
  :root,
  :host {
    --chakra-vh: 100vh;
  }

  @supports (height: -webkit-fill-available) {
    :root,
    :host {
      --chakra-vh: -webkit-fill-available;
    }
  }

  @supports (height: -moz-fill-available) {
    :root,
    :host {
      --chakra-vh: -moz-fill-available;
    }
  }

  @supports (height: 100dvh) {
    :root,
    :host {
      --chakra-vh: 100dvh;
    }
  }
`,C=()=>(0,h.jsx)(b.Global,{styles:E}),w=({scope:e=""})=>(0,h.jsx)(b.Global,{styles:_`
      html {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        font-family: system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        touch-action: manipulation;
      }

      body {
        position: relative;
        min-height: 100%;
        margin: 0;
        font-feature-settings: "kern";
      }

      ${e} :where(*, *::before, *::after) {
        border-width: 0;
        border-style: solid;
        box-sizing: border-box;
        word-wrap: break-word;
      }

      main {
        display: block;
      }

      ${e} hr {
        border-top-width: 1px;
        box-sizing: content-box;
        height: 0;
        overflow: visible;
      }

      ${e} :where(pre, code, kbd,samp) {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 1em;
      }

      ${e} a {
        background-color: transparent;
        color: inherit;
        text-decoration: inherit;
      }

      ${e} abbr[title] {
        border-bottom: none;
        text-decoration: underline;
        -webkit-text-decoration: underline dotted;
        text-decoration: underline dotted;
      }

      ${e} :where(b, strong) {
        font-weight: bold;
      }

      ${e} small {
        font-size: 80%;
      }

      ${e} :where(sub,sup) {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }

      ${e} sub {
        bottom: -0.25em;
      }

      ${e} sup {
        top: -0.5em;
      }

      ${e} img {
        border-style: none;
      }

      ${e} :where(button, input, optgroup, select, textarea) {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
      }

      ${e} :where(button, input) {
        overflow: visible;
      }

      ${e} :where(button, select) {
        text-transform: none;
      }

      ${e} :where(
          button::-moz-focus-inner,
          [type="button"]::-moz-focus-inner,
          [type="reset"]::-moz-focus-inner,
          [type="submit"]::-moz-focus-inner
        ) {
        border-style: none;
        padding: 0;
      }

      ${e} fieldset {
        padding: 0.35em 0.75em 0.625em;
      }

      ${e} legend {
        box-sizing: border-box;
        color: inherit;
        display: table;
        max-width: 100%;
        padding: 0;
        white-space: normal;
      }

      ${e} progress {
        vertical-align: baseline;
      }

      ${e} textarea {
        overflow: auto;
      }

      ${e} :where([type="checkbox"], [type="radio"]) {
        box-sizing: border-box;
        padding: 0;
      }

      ${e} input[type="number"]::-webkit-inner-spin-button,
      ${e} input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
      }

      ${e} input[type="number"] {
        -moz-appearance: textfield;
      }

      ${e} input[type="search"] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
      }

      ${e} input[type="search"]::-webkit-search-decoration {
        -webkit-appearance: none !important;
      }

      ${e} ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
      }

      ${e} details {
        display: block;
      }

      ${e} summary {
        display: list-item;
      }

      template {
        display: none;
      }

      [hidden] {
        display: none !important;
      }

      ${e} :where(
          blockquote,
          dl,
          dd,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          hr,
          figure,
          p,
          pre
        ) {
        margin: 0;
      }

      ${e} button {
        background: transparent;
        padding: 0;
      }

      ${e} fieldset {
        margin: 0;
        padding: 0;
      }

      ${e} :where(ol, ul) {
        margin: 0;
        padding: 0;
      }

      ${e} textarea {
        resize: vertical;
      }

      ${e} :where(button, [role="button"]) {
        cursor: pointer;
      }

      ${e} button::-moz-focus-inner {
        border: 0 !important;
      }

      ${e} table {
        border-collapse: collapse;
      }

      ${e} :where(h1, h2, h3, h4, h5, h6) {
        font-size: inherit;
        font-weight: inherit;
      }

      ${e} :where(button, input, optgroup, select, textarea) {
        padding: 0;
        line-height: inherit;
        color: inherit;
      }

      ${e} :where(img, svg, video, canvas, audio, iframe, embed, object) {
        display: block;
      }

      ${e} :where(img, video) {
        max-width: 100%;
        height: auto;
      }

      [data-js-focus-visible]
        :focus:not([data-focus-visible-added]):not(
          [data-focus-visible-disabled]
        ) {
        outline: none;
        box-shadow: none;
      }

      ${e} select::-ms-expand {
        display: none;
      }

      ${E}
    `});var R=e.i(390550),x=e.i(735734),S=e.i(989028);let P=e=>{let{children:t,colorModeManager:r,portalZIndex:i,resetScope:n,resetCSS:a=!0,theme:s={},environment:l,cssVarsRoot:o,disableEnvironment:u,disableGlobalStyle:d}=e,c=(0,h.jsx)(S.EnvironmentProvider,{environment:l,disabled:u,children:t});return(0,h.jsx)(R.ThemeProvider,{theme:s,cssVarsRoot:o,children:(0,h.jsxs)(g.ColorModeProvider,{colorModeManager:r,options:s.config,children:[a?(0,h.jsx)(w,{scope:n}):(0,h.jsx)(C,{}),!d&&(0,h.jsx)(R.GlobalStyle,{}),i?(0,h.jsx)(x.PortalManager,{zIndex:i,children:c}):c]})})};var L=e.i(677642);let T=(t=y.theme,function({children:e,theme:r=t,toastOptions:i,...n}){return(0,h.jsxs)(P,{theme:r,...n,children:[(0,h.jsx)(L.ToastOptionProvider,{value:i?.defaultOptions,children:e}),(0,h.jsx)(L.ToastProvider,{...i})]})});var k=e.i(474610);e.i(134880),e.i(189807);var U=e.i(192448),A=e.i(338703),I=e.i(827085),O=e.i(945368),N=e.i(474041),M=e.i(271645);e.i(138821);var D=e.i(375369);e.i(5725);var K=e.i(900974),j=e.i(770703),B=e.i(618566),q=e.i(200347);let $="u">typeof window?M.default.useLayoutEffect:M.default.useEffect,Q=M.default.createContext(void 0);Q.displayName="ClerkNextOptionsCtx";let F=()=>{let e=M.default.useContext(Q);return null==e?void 0:e.value},z=e=>{let{children:t,options:r}=e;return M.default.createElement(Q.Provider,{value:{value:r}},t)};e.i(797651);var X=e.i(417970),W=e.i(3303);function V(e){let{publishableKey:t,clerkJSUrl:r,clerkJSVersion:i,clerkJSVariant:n,nonce:a}=F(),{domain:s,proxyUrl:l}=(0,I.useClerk)();if(!t)return null;let o={domain:s,proxyUrl:l,publishableKey:t,clerkJSUrl:r,clerkJSVersion:i,clerkJSVariant:n,nonce:a},u=(0,X.clerkJsScriptUrl)(o),d="app"===e.router?"script":W.default;return M.default.createElement(d,{src:u,"data-clerk-js-script":!0,async:!0,defer:"pages"!==e.router&&void 0,crossOrigin:"anonymous",strategy:"pages"===e.router?"beforeInteractive":void 0,...(0,X.buildClerkJsScriptAttributes)(o)})}e.i(2193);var Y=e.i(441383),G=e.i(247167),H=e.i(893375);e.i(96248),e.i(704816);var J=e.i(28069);e.i(922375);var Z=e.i(215331);G.default.env.NEXT_PUBLIC_CLERK_JS_VERSION,G.default.env.NEXT_PUBLIC_CLERK_JS_URL,G.default.env.CLERK_API_VERSION,G.default.env.CLERK_SECRET_KEY,G.default.env.CLERK_MACHINE_SECRET_KEY,G.default.env.CLERK_ENCRYPTION_KEY,G.default.env.CLERK_API_URL||(r=(0,J.parsePublishableKey)("pk_live_Y2xlcmsudmVuaWNlLmFpJA")?.frontendApi,r?.startsWith("clerk.")&&H.LEGACY_DEV_INSTANCE_SUFFIXES.some(e=>r?.endsWith(e))?H.PROD_API_URL:H.LOCAL_ENV_SUFFIXES.some(e=>r?.endsWith(e))?H.LOCAL_API_URL:H.STAGING_ENV_SUFFIXES.some(e=>r?.endsWith(e))?H.STAGING_API_URL:H.PROD_API_URL),G.default.env.NEXT_PUBLIC_CLERK_DOMAIN,G.default.env.NEXT_PUBLIC_CLERK_PROXY_URL,(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_IS_SATELLITE);let ee={name:"@clerk/nextjs",version:"6.37.4",environment:"production"};(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED),(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG);let et=(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_KEYLESS_DISABLED)||!1,er=null!=(o=null==(l=null==(s=q.default)?void 0:s.version)?void 0:l.startsWith("13."))&&o||null!=(c=null==(d=null==(u=q.default)?void 0:u.version)?void 0:d.startsWith("14.0"))&&c;n=0,(null==(a=q.default)?void 0:a.version)&&isNaN(parseInt(q.default.version.split(".")[0],10));let ei=!er&&(0,Y.isDevelopmentEnvironment)()&&!et,en=e=>{var t;return{...e,publishableKey:e.publishableKey||"pk_live_Y2xlcmsudmVuaWNlLmFpJA",clerkJSUrl:e.clerkJSUrl||G.default.env.NEXT_PUBLIC_CLERK_JS_URL,clerkJSVersion:e.clerkJSVersion||G.default.env.NEXT_PUBLIC_CLERK_JS_VERSION,proxyUrl:e.proxyUrl||G.default.env.NEXT_PUBLIC_CLERK_PROXY_URL||"",domain:e.domain||G.default.env.NEXT_PUBLIC_CLERK_DOMAIN||"",isSatellite:e.isSatellite||(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_IS_SATELLITE),signInUrl:e.signInUrl||"/sign-in",signUpUrl:e.signUpUrl||"/sign-up",signInForceRedirectUrl:e.signInForceRedirectUrl||"/chat",signUpForceRedirectUrl:e.signUpForceRedirectUrl||"/sign-up-migration",signInFallbackRedirectUrl:e.signInFallbackRedirectUrl||G.default.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL||"",signUpFallbackRedirectUrl:e.signUpFallbackRedirectUrl||G.default.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL||"",afterSignInUrl:e.afterSignInUrl||G.default.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL||"",afterSignUpUrl:e.afterSignUpUrl||G.default.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL||"",newSubscriptionRedirectUrl:e.newSubscriptionRedirectUrl||G.default.env.NEXT_PUBLIC_CLERK_CHECKOUT_CONTINUE_URL||"",telemetry:null!=(t=e.telemetry)?t:{disabled:(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED),debug:(0,Z.isTruthy)(G.default.env.NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG)},sdkMetadata:ee}};e.i(875372);var ea=e.i(624440),es=e.i(622528);let el=()=>{var e,t;let r=(0,I.useClerk)(),{pagesRouter:i}=(0,es.usePagesRouter)();return null==(t=r.telemetry)||t.record((0,ea.eventFrameworkMetadata)({router:i?"pages":"app",...(null==(e=null==globalThis?void 0:globalThis.next)?void 0:e.version)?{nextjsVersion:globalThis.next.version}:{}})),null};var eo=e.i(95187);let eu=(0,eo.createServerReference)("0049e133319e781a29e80071f298f295f9b3786bcf",eo.callServer,void 0,eo.findSourceMapURL,"detectKeylessEnvDriftAction"),ed=(0,eo.createServerReference)("001d3fb43afca4b0cf429da9c5272d43c7d36ee6de",eo.callServer,void 0,eo.findSourceMapURL,"invalidateCacheAction"),ec=e=>{var t;return null!=window.__clerk_internal_navigations||(window.__clerk_internal_navigations={}),null!=(t=window.__clerk_internal_navigations)[e]||(t[e]={}),window.__clerk_internal_navigations[e]},eh=e=>{let{windowNav:t,routerNav:r,name:i}=e,n=(0,B.usePathname)(),[a,s]=(0,M.useTransition)();t&&(ec(i).fun=(e,n)=>new Promise(a=>{var l,o;null!=(l=ec(i)).promisesBuffer||(l.promisesBuffer=[]),null==(o=ec(i).promisesBuffer)||o.push(a),s(()=>{var i,a,s;(null==(i=null==n?void 0:n.__internal_metadata)?void 0:i.navigationType)==="internal"?t((null!=(s=null==(a=window.next)?void 0:a.version)?s:"")<"14.1.0"?history.state:null,"",e):r(e)})}));let l=()=>{var e;null==(e=ec(i).promisesBuffer)||e.forEach(e=>e()),ec(i).promisesBuffer=[]};return(0,M.useEffect)(()=>(l(),l),[]),(0,M.useEffect)(()=>{a||l()},[n,a]),(0,M.useCallback)((e,t)=>ec(i).fun(e,t),[])},ef=(0,j.default)(()=>e.A(98943).then(e=>e.KeylessCreatorOrReader)),ep=e=>{let t,r;if(er){let e=`Clerk:
Your current Next.js version (${q.default.version}) will be deprecated in the next major release of "@clerk/nextjs". Please upgrade to next@14.1.0 or later.`;(0,D.inBrowser)()?K.logger.warnOnce(e):K.logger.logOnce(`
\x1b[43m----------
${e}
----------\x1b[0m
`)}let{__unstable_invokeMiddlewareOnAuthStateChange:i=!0,children:n}=e,a=(0,B.useRouter)(),s=(t=(0,B.useRouter)(),eh({windowNav:"u">typeof window?window.history.pushState.bind(window.history):void 0,routerNav:t.push.bind(t),name:"push"})),l=(r=(0,B.useRouter)(),eh({windowNav:"u">typeof window?window.history.replaceState.bind(window.history):void 0,routerNav:r.replace.bind(r),name:"replace"})),[o,u]=(0,M.useTransition)();if($(()=>{ei&&eu()},[]),F())return e.children;(0,M.useEffect)(()=>{var e;o||null==(e=window.__clerk_internal_invalidateCachePromise)||e.call(window)},[o]),$(()=>{window.__unstable__onBeforeSetActive=e=>new Promise(t=>{var r;window.__clerk_internal_invalidateCachePromise=t;let i=(null==(r=null==window?void 0:window.next)?void 0:r.version)||"";i.startsWith("13")?u(()=>{a.refresh()}):(i.startsWith("15")||i.startsWith("16"))&&"sign-out"===e?t():ed().then(()=>t())}),window.__unstable__onAfterSetActive=()=>{if(i)return a.refresh()}},[]);let d=en({...e,routerPush:s,routerReplace:l});return M.default.createElement(z,{options:d},M.default.createElement(U.ClerkProvider,{...d},M.default.createElement(el,null),M.default.createElement(V,{router:"app"}),n))},em=e=>{let{children:t,disableKeyless:r=!1,...i}=e;return en(i).publishableKey||!ei||r?M.default.createElement(ep,{...i},t):M.default.createElement(ef,null,M.default.createElement(ep,{...i},t))};var ev=e.i(565909);let ey=()=>{if("u"<typeof window)return;let e=e=>{Object.keys(e).forEach(t=>{delete e[t]})};try{e(window.next.router.sdc),e(window.next.router.sbc)}catch{return}};function eg({children:e,...t}){var r;let{__unstable_invokeMiddlewareOnAuthStateChange:i=!0}=t,{push:n,replace:a}=(0,ev.useRouter)();U.ClerkProvider.displayName="ReactClerkProvider",$(()=>{window.__unstable__onBeforeSetActive=ey},[]),$(()=>{window.__unstable__onAfterSetActive=()=>{i&&n(window.location.href)}},[]);let s=en({...t,routerPush:e=>n(e),routerReplace:e=>a(e)}),l=(null==(r=t.authServerSideProps)?void 0:r.__clerk_ssr_state)||t.__clerk_ssr_state;return M.default.createElement(z,{options:s},M.default.createElement(U.ClerkProvider,{...s,initialState:l},M.default.createElement(el,null),M.default.createElement(V,{router:"pages"}),e))}(0,O.setErrorThrowerOptions)({packageName:"@clerk/nextjs"}),(0,X.setClerkJsLoadingErrorPackageName)("@clerk/nextjs");let eb=function(e){let t=(0,N.useRouter)();return M.default.createElement(t?eg:em,{...e})};k.SignedIn,k.SignedOut,k.Protect;var e_=e.i(619273),eE=e.i(286491),eC=e.i(540143),ew=e.i(915823),eR=class extends ew.Subscribable{constructor(e={}){super(),this.config=e,this.#e=new Map}#e;build(e,t,r){let i=t.queryKey,n=t.queryHash??(0,e_.hashQueryKeyByOptions)(i,t),a=this.get(n);return a||(a=new eE.Query({cache:this,queryKey:i,queryHash:n,options:e.defaultQueryOptions(t),state:r,defaultOptions:e.getQueryDefaults(i)}),this.add(a)),a}add(e){this.#e.has(e.queryHash)||(this.#e.set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){let t=this.#e.get(e.queryHash);t&&(e.destroy(),t===e&&this.#e.delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){eC.notifyManager.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return this.#e.get(e)}getAll(){return[...this.#e.values()]}find(e){let t={exact:!0,...e};return this.getAll().find(e=>(0,e_.matchQuery)(t,e))}findAll(e={}){let t=this.getAll();return Object.keys(e).length>0?t.filter(t=>(0,e_.matchQuery)(e,t)):t}notify(e){eC.notifyManager.batch(()=>{this.listeners.forEach(t=>{t(e)})})}onFocus(){eC.notifyManager.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){eC.notifyManager.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},ex=e.i(213927),eS=ew,eP=class extends eS.Subscribable{constructor(e={}){super(),this.config=e,this.#t=new Map,this.#r=Date.now()}#t;#r;build(e,t,r){let i=new ex.Mutation({mutationCache:this,mutationId:++this.#r,options:e.defaultMutationOptions(t),state:r});return this.add(i),i}add(e){let t=eL(e),r=this.#t.get(t)??[];r.push(e),this.#t.set(t,r),this.notify({type:"added",mutation:e})}remove(e){let t=eL(e);if(this.#t.has(t)){let r=this.#t.get(t)?.filter(t=>t!==e);r&&(0===r.length?this.#t.delete(t):this.#t.set(t,r))}this.notify({type:"removed",mutation:e})}canRun(e){let t=this.#t.get(eL(e))?.find(e=>"pending"===e.state.status);return!t||t===e}runNext(e){let t=this.#t.get(eL(e))?.find(t=>t!==e&&t.state.isPaused);return t?.continue()??Promise.resolve()}clear(){eC.notifyManager.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}getAll(){return[...this.#t.values()].flat()}find(e){let t={exact:!0,...e};return this.getAll().find(e=>(0,e_.matchMutation)(t,e))}findAll(e={}){return this.getAll().filter(t=>(0,e_.matchMutation)(e,t))}notify(e){eC.notifyManager.batch(()=>{this.listeners.forEach(t=>{t(e)})})}resumePausedMutations(){let e=this.getAll().filter(e=>e.state.isPaused);return eC.notifyManager.batch(()=>Promise.all(e.map(e=>e.continue().catch(e_.noop))))}};function eL(e){return e.options.scope?.id??String(e.mutationId)}var eT=e.i(175555),ek=e.i(814448),eU=e.i(992571),eA=class{#i;#n;#a;#s;#l;#o;#u;#d;constructor(e={}){this.#i=e.queryCache||new eR,this.#n=e.mutationCache||new eP,this.#a=e.defaultOptions||{},this.#s=new Map,this.#l=new Map,this.#o=0}mount(){this.#o++,1===this.#o&&(this.#u=eT.focusManager.subscribe(async e=>{e&&(await this.resumePausedMutations(),this.#i.onFocus())}),this.#d=ek.onlineManager.subscribe(async e=>{e&&(await this.resumePausedMutations(),this.#i.onOnline())}))}unmount(){this.#o--,0===this.#o&&(this.#u?.(),this.#u=void 0,this.#d?.(),this.#d=void 0)}isFetching(e){return this.#i.findAll({...e,fetchStatus:"fetching"}).length}isMutating(e){return this.#n.findAll({...e,status:"pending"}).length}getQueryData(e){let t=this.defaultQueryOptions({queryKey:e});return this.#i.get(t.queryHash)?.state.data}ensureQueryData(e){let t=this.defaultQueryOptions(e),r=this.#i.build(this,t),i=r.state.data;return void 0===i?this.fetchQuery(e):(e.revalidateIfStale&&r.isStaleByTime((0,e_.resolveStaleTime)(t.staleTime,r))&&this.prefetchQuery(t),Promise.resolve(i))}getQueriesData(e){return this.#i.findAll(e).map(({queryKey:e,state:t})=>[e,t.data])}setQueryData(e,t,r){let i=this.defaultQueryOptions({queryKey:e}),n=this.#i.get(i.queryHash),a=n?.state.data,s=(0,e_.functionalUpdate)(t,a);if(void 0!==s)return this.#i.build(this,i).setData(s,{...r,manual:!0})}setQueriesData(e,t,r){return eC.notifyManager.batch(()=>this.#i.findAll(e).map(({queryKey:e})=>[e,this.setQueryData(e,t,r)]))}getQueryState(e){let t=this.defaultQueryOptions({queryKey:e});return this.#i.get(t.queryHash)?.state}removeQueries(e){let t=this.#i;eC.notifyManager.batch(()=>{t.findAll(e).forEach(e=>{t.remove(e)})})}resetQueries(e,t){let r=this.#i,i={type:"active",...e};return eC.notifyManager.batch(()=>(r.findAll(e).forEach(e=>{e.reset()}),this.refetchQueries(i,t)))}cancelQueries(e,t={}){let r={revert:!0,...t};return Promise.all(eC.notifyManager.batch(()=>this.#i.findAll(e).map(e=>e.cancel(r)))).then(e_.noop).catch(e_.noop)}invalidateQueries(e,t={}){return eC.notifyManager.batch(()=>{if(this.#i.findAll(e).forEach(e=>{e.invalidate()}),e?.refetchType==="none")return Promise.resolve();let r={...e,type:e?.refetchType??e?.type??"active"};return this.refetchQueries(r,t)})}refetchQueries(e,t={}){let r={...t,cancelRefetch:t.cancelRefetch??!0};return Promise.all(eC.notifyManager.batch(()=>this.#i.findAll(e).filter(e=>!e.isDisabled()).map(e=>{let t=e.fetch(void 0,r);return r.throwOnError||(t=t.catch(e_.noop)),"paused"===e.state.fetchStatus?Promise.resolve():t}))).then(e_.noop)}fetchQuery(e){let t=this.defaultQueryOptions(e);void 0===t.retry&&(t.retry=!1);let r=this.#i.build(this,t);return r.isStaleByTime((0,e_.resolveStaleTime)(t.staleTime,r))?r.fetch(t):Promise.resolve(r.state.data)}prefetchQuery(e){return this.fetchQuery(e).then(e_.noop).catch(e_.noop)}fetchInfiniteQuery(e){return e.behavior=(0,eU.infiniteQueryBehavior)(e.pages),this.fetchQuery(e)}prefetchInfiniteQuery(e){return this.fetchInfiniteQuery(e).then(e_.noop).catch(e_.noop)}ensureInfiniteQueryData(e){return e.behavior=(0,eU.infiniteQueryBehavior)(e.pages),this.ensureQueryData(e)}resumePausedMutations(){return ek.onlineManager.isOnline()?this.#n.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#i}getMutationCache(){return this.#n}getDefaultOptions(){return this.#a}setDefaultOptions(e){this.#a=e}setQueryDefaults(e,t){this.#s.set((0,e_.hashKey)(e),{queryKey:e,defaultOptions:t})}getQueryDefaults(e){let t=[...this.#s.values()],r={};return t.forEach(t=>{(0,e_.partialMatchKey)(e,t.queryKey)&&Object.assign(r,t.defaultOptions)}),r}setMutationDefaults(e,t){this.#l.set((0,e_.hashKey)(e),{mutationKey:e,defaultOptions:t})}getMutationDefaults(e){let t=[...this.#l.values()],r={};return t.forEach(t=>{(0,e_.partialMatchKey)(e,t.mutationKey)&&(r={...r,...t.defaultOptions})}),r}defaultQueryOptions(e){if(e._defaulted)return e;let t={...this.#a.queries,...this.getQueryDefaults(e.queryKey),...e,_defaulted:!0};return t.queryHash||(t.queryHash=(0,e_.hashQueryKeyByOptions)(t.queryKey,t)),void 0===t.refetchOnReconnect&&(t.refetchOnReconnect="always"!==t.networkMode),void 0===t.throwOnError&&(t.throwOnError=!!t.suspense),!t.networkMode&&t.persister&&(t.networkMode="offlineFirst"),t.queryFn===e_.skipToken&&(t.enabled=!1),t}defaultMutationOptions(e){return e?._defaulted?e:{...this.#a.mutations,...e?.mutationKey&&this.getMutationDefaults(e.mutationKey),...e,_defaulted:!0}}clear(){this.#i.clear(),this.#n.clear()}},eI=e.i(912598),eO=e.i(943380),eN=e.i(526732),eM=e.i(617089),eD=e.i(604570),eK=e.i(720565),ej=e.i(464767),eB=e.i(475188),eq=e.i(325960);function e$({children:e}){let t=(0,eq.useSettingsStore)(e=>e.settings.disableTelemetry);return(0,M.useEffect)(()=>{t||(eD.default.init("phc_4Yg9V0hm9Lgavwcr6LZACe64tya7UqfyHePVNOzYREF",{api_host:"https://t.venice.ai",ui_host:"https://us.posthog.com",person_profiles:"always",capture_pageview:!1,disable_session_recording:!0,autocapture:!1,opt_in_site_apps:!ej.IS_PRODUCTION_ENVIRONMENT,advanced_enable_surveys:!0,sanitize_properties:(e,t)=>(["$current_url","$referrer"].forEach(t=>{e[t]&&(e[t]=function(e){try{let t=new URL(e);return t.origin+t.pathname}catch{return e}}(e[t]))}),e)}),eD.default.register({installType:eB.isPwa?"PWA":"WEB_BROWSER"}),eD.default.setPersonProperties({},{created_at:new Date().toISOString()}))},[t]),(0,h.jsx)(eK.PostHogProvider,{client:eD.default,children:e})}var eQ=e.i(222245),eF=e.i(395648);let ez=({children:e})=>{let{setColorMode:t}=(0,eQ.useColorMode)();return(0,M.useEffect)(()=>{"system"===(0,eF.getStoredPreference)()&&t((0,eF.getSystemColorMode)());let e=window.matchMedia("(prefers-color-scheme: dark)"),r=e=>{"system"===(0,eF.getStoredPreference)()&&t(e.matches?"dark":"light")};return e.addEventListener("change",r),()=>{e.removeEventListener("change",r)}},[t]),(0,h.jsx)(h.Fragment,{children:e})},eX=()=>((0,M.useEffect)(()=>{let e=document.getElementById("pre-js-loader");e&&(e.classList.add("fade-out"),e.addEventListener("transitionend",()=>e.remove(),{once:!0}))},[]),null);var eW=e.i(558959),eV=e.i(478387),eY=e.i(914682),eG=e.i(120559),eH=e.i(985346);let eJ=["/token","/sign-in","/sign-up","/checkout/crypto"],eZ=({children:e})=>(0,h.jsx)(h.Fragment,{children:e}),e0=e=>null,e1=()=>(0,h.jsx)(eY.Center,{height:"100%",width:"100%",children:(0,h.jsx)(eG.Spinner,{size:"xl",thickness:"6px",color:"background.button.secondary.base"})}),e3=({children:t})=>{let r=(0,B.usePathname)(),{status:i}=(0,eN.useSession)(),{t:n}=(0,eO.useTranslate)(),a=eJ.some(e=>r?.startsWith(e)),s="authenticated"===i,[l,o]=(0,M.useState)(()=>a),[u,d]=(0,M.useState)(null),[c,f]=(0,M.useState)(null),[p,m]=(0,M.useState)({isConnected:!1}),v=(0,M.useRef)(()=>{}),y=(0,M.useRef)(async()=>{}),g=(0,M.useRef)(async()=>{}),b=(0,M.useRef)(null),_=(0,M.useRef)(!1);(0,M.useEffect)(()=>{s&&!l&&o(!0)},[s,l]),(0,M.useEffect)(()=>{a&&!l&&o(!0)},[a,l]),(0,M.useEffect)(()=>{!l||u||c||e.A(852332).then(e=>{d({"default":e.default,WagmiBridge:e.WagmiBridge})}).catch(e=>{f(e instanceof Error?e:Error("Failed to load Web3 module"))})},[l,u,c]);let E=(0,M.useCallback)(()=>{o(!0)},[]),C=(0,M.useCallback)(e=>{m(e)},[]),w=(0,M.useCallback)(e=>{v.current=e},[]),R=(0,M.useCallback)(e=>{y.current=e},[]),x=(0,M.useCallback)(e=>{g.current=e},[]),S=(0,M.useCallback)(()=>{v.current()},[]),P=(0,M.useCallback)(async()=>{await y.current()},[]),L=l&&null!==u;_.current=L,(0,M.useEffect)(()=>{if(L&&null!==b.current){let e=b.current;b.current=null,g.current(e)}},[L]);let T=(0,M.useCallback)(async e=>{if(!_.current){b.current=e??{},o(!0);return}await g.current(e)},[]),k=(0,M.useMemo)(()=>({isWeb3Ready:L,activateWeb3:E,isWagmiConnected:p.isConnected,reconnectWagmi:S,disconnectWallet:P,openWeb3Modal:T}),[L,E,p.isConnected,S,P,T]),U=a&&!L,A=L?k:{...eH.web3ContextDefaultValue,activateWeb3:E,openWeb3Modal:T},I=u?.default??eZ,O=u?.WagmiBridge??e0,N=u?"web3":"pending";return(0,h.jsx)(eH.Web3Context.Provider,{value:A,children:(0,h.jsxs)(I,{children:[(0,h.jsx)(O,{onWagmiStateChange:C,onReconnectChange:w,onDisconnectChange:R,onOpenModalChange:x}),U&&c?(0,h.jsx)(eY.Center,{height:"100%",width:"100%",children:n("Failed to load Web3. Please refresh the page.")}):U?(0,h.jsx)(e1,{}):t]},N)})};var e2=e.i(34188),e4=e.i(461476),e5=e.i(112121),e7=e.i(873715);let e9=({children:e})=>{let{locale:t}=(0,eO.useTranslate)(),r=(0,e4.useFeatureFlag)("memoriaEnabled"),i=(0,e4.useFeatureFlag)("insightExtractionEnabled"),{session:n,isSignedIn:a}=(0,I.useSession)(),{user:s}=(0,I.useUser)(),{userId:l,getToken:o}=(0,A.useAuth)(),u=(0,M.useMemo)(()=>({platform:"web",cryptoVvvStakingContractAddress:ej.T0KEN_STAKING_CONTRACT_ADDRESS,cryptoVvvTokenContractAddress:ej.T0KEN_CONTRACT_ADDRESS,cryptoDiemTokenContractAddress:ej.DIEM_TOKEN_CONTRACT_ADDRESS,clientDomain:ej.PRIMARY_DOMAIN,authStrategy:{getAuthHeaders:async()=>{let e=await o(),r=eD.default.get_distinct_id?.();return{"Content-Type":"application/json","X-Venice-Version":(0,e7.releaseVersion)(),[`x-${ej.LOCALE_COOKIE_NAME}`]:t,...e&&{Authorization:`Bearer ${e}`},...r&&{"x-venice-distinct-id":r}}},isAuthError:e=>e.response?.status===401||e.response?.status===403},baseURL:ej.OUTERFACE_URL,storageURL:ej.OUTERFACE_STORAGE_URL,tokenRefreshStrategy:{refreshToken:async()=>{await o({skipCache:!0})}},validateStatus:e=>e>=200&&e<300,maxRetries:3,timeout:0}),[o,t]),d=l||a?n?.lastActiveToken?.getRawString()??"":"",c=l||(a?s?.id??void 0:void 0),f=r||i,p=(0,e5.useIndexedDbAvailability)(f),m=f&&"available"===p.status;return f&&"checking"===p.status?null:m?(0,h.jsx)(e2.MiddlefaceReactProvider,{apiClientConfig:u,token:d,userId:c,children:e}):(0,h.jsx)(e2.MiddlefaceNoDBProvider,{apiClientConfig:u,token:d,userId:c,children:e})};var e8=e.i(700735);f.default.extend(v.default),f.default.extend(m.default),f.default.extend(p.default);let e6="u">typeof navigator?navigator.language:"en-US";f.default.locale(["en-US","en-CA","en-BZ"].includes(e6)?"en":"en-GB");let te=(0,M.lazy)(()=>e.A(549851).then(e=>({"default":e.RendleyEditingSuiteModal})));function tt(){return i||(i=new eA({defaultOptions:{queries:{staleTime:6e4}}})),i}function tr({children:e}){let t=(0,M.useRef)(null),[r]=(0,M.useState)(()=>tt()),{t:i}=(0,eO.useTranslate)();return(0,h.jsxs)(eb,{afterSignOutUrl:"/chat",localization:{unstable__errors:{form_email_address_blocked:i("Disposable email addresses are not permitted. Please choose a permanent email address or reach out to support@venice.ai for assistance.")}},children:[(0,h.jsx)(eX,{}),(0,h.jsx)(eN.SessionProvider,{baseUrl:ej.OUTERFACE_URL,children:(0,h.jsx)(eV.DialogProvider,{children:(0,h.jsx)(T,{theme:eM.theme,portalZIndex:2001,toastOptions:{portalProps:{containerRef:t},defaultOptions:{variant:"basic"}},children:(0,h.jsx)(ez,{children:(0,h.jsx)(e$,{children:(0,h.jsx)(eI.QueryClientProvider,{client:r,children:(0,h.jsx)(e3,{children:(0,h.jsx)(e4.UserProvider,{children:(0,h.jsx)(e9,{children:(0,h.jsx)(eW.AudioPlayerContextProvider,{children:(0,h.jsxs)(e8.MusicPlayerContextProvider,{children:[e,(0,h.jsx)(M.Suspense,{fallback:null,children:(0,h.jsx)(te,{})}),(0,h.jsx)("div",{ref:t})]})})})})})})})})})})})]})}e.s(["Providers",()=>tr,"getQueryClient",()=>tt],96923)},428042,e=>{e.n(e.i(96923))}]);

//# debugId=6580b06b-d49c-e5c7-94d9-cff7b44fd660
