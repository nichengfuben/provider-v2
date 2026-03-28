;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="5dade49a-0b07-04fb-1147-beadeaf49630")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,210380,t=>{"use strict";t.i(812207);var e=t.i(604148),i=t.i(654479);t.i(374576);var r=t.i(120119);t.i(852634),t.i(839009);var a=t.i(459088),o=t.i(645975),s=t.i(162611);let n=s.css`
  button {
    border: none;
    background: transparent;
    height: 20px;
    padding: ${({spacing:t})=>t[2]};
    column-gap: ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({spacing:t})=>t[1]};
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent'] {
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  button[data-variant='secondary'] {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[data-variant='accent']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-variant='accent']:hover:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:hover:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var l=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let c={sm:"sm-medium",md:"md-medium"},d={accent:"accent-primary",secondary:"secondary"},p=class extends e.LitElement{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return i.html`
      <button ?disabled=${this.disabled} data-variant=${this.variant}>
        <slot name="iconLeft"></slot>
        <wui-text
          color=${d[this.variant]}
          variant=${c[this.size]}
        >
          <slot></slot>
        </wui-text>
        ${this.iconTemplate()}
      </button>
    `}iconTemplate(){return this.icon?i.html`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};p.styles=[a.resetStyles,a.elementStyles,n],l([(0,r.property)()],p.prototype,"size",void 0),l([(0,r.property)({type:Boolean})],p.prototype,"disabled",void 0),l([(0,r.property)()],p.prototype,"variant",void 0),l([(0,r.property)()],p.prototype,"icon",void 0),p=l([(0,o.customElement)("wui-link")],p),t.s([],210380)},864576,t=>{"use strict";t.i(812207);var e=t.i(604148),i=t.i(654479);t.i(374576);var r=t.i(120119),a=t.i(645975),o=t.i(162611);let s=o.css`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:t})=>t.theme.foregroundPrimary} 0%,
      ${({tokens:t})=>t.theme.foregroundSecondary} 50%,
      ${({tokens:t})=>t.theme.foregroundPrimary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    border-radius: ${({borderRadius:t})=>t[1]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:t})=>t[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;var n=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let l=class extends e.LitElement{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",i.html`<slot></slot>`}};l.styles=[s],n([(0,r.property)()],l.prototype,"width",void 0),n([(0,r.property)()],l.prototype,"height",void 0),n([(0,r.property)()],l.prototype,"variant",void 0),n([(0,r.property)({type:Boolean})],l.prototype,"rounded",void 0),l=n([(0,a.customElement)("wui-shimmer")],l),t.s([],864576)},912190,t=>{"use strict";t.i(812207);var e=t.i(604148),i=t.i(654479);t.i(374576);var r=t.i(120119);t.i(234051);var a=t.i(829389);t.i(852634);var o=t.i(459088),s=t.i(645975),n=t.i(162611);let l=n.css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({borderRadius:t})=>t[2]};
    padding: ${({spacing:t})=>t[1]} !important;
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    position: relative;
  }

  :host([data-padding='2']) {
    padding: ${({spacing:t})=>t[2]} !important;
  }

  :host:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host > wui-icon {
    z-index: 10;
  }

  /* -- Colors --------------------------------------------------- */
  :host([data-color='accent-primary']) {
    color: ${({tokens:t})=>t.core.iconAccentPrimary};
  }

  :host([data-color='accent-primary']):after {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  :host([data-color='default']),
  :host([data-color='secondary']) {
    color: ${({tokens:t})=>t.theme.iconDefault};
  }

  :host([data-color='default']):after {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  :host([data-color='secondary']):after {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  :host([data-color='success']) {
    color: ${({tokens:t})=>t.core.iconSuccess};
  }

  :host([data-color='success']):after {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  :host([data-color='error']) {
    color: ${({tokens:t})=>t.core.iconError};
  }

  :host([data-color='error']):after {
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  :host([data-color='warning']) {
    color: ${({tokens:t})=>t.core.iconWarning};
  }

  :host([data-color='warning']):after {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
  }

  :host([data-color='inverse']) {
    color: ${({tokens:t})=>t.theme.iconInverse};
  }

  :host([data-color='inverse']):after {
    background-color: transparent;
  }
`;var c=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let d=class extends e.LitElement{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,i.html`
      <wui-icon size=${(0,a.ifDefined)(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};d.styles=[o.resetStyles,o.elementStyles,l],c([(0,r.property)()],d.prototype,"icon",void 0),c([(0,r.property)()],d.prototype,"size",void 0),c([(0,r.property)()],d.prototype,"padding",void 0),c([(0,r.property)()],d.prototype,"color",void 0),d=c([(0,s.customElement)("wui-icon-box")],d),t.s([],912190)},864380,t=>{"use strict";t.i(812207);var e=t.i(604148),i=t.i(654479);t.i(374576);var r=t.i(120119);t.i(234051);var a=t.i(829389),o=t.i(459088),s=t.i(645975),n=t.i(162611);let l=n.css`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
    user-select: none;
    user-drag: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }

  :host([data-boxed='true']) {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-boxed='true']) img {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:t})=>t[16]};
  }

  :host([data-full='true']) img {
    width: 100%;
    height: 100%;
  }

  :host([data-boxed='true']) wui-icon {
    width: 20px;
    height: 20px;
  }

  :host([data-icon='error']) {
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:t})=>t[16]};
  }
`;var c=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let d=class extends e.LitElement{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.boxed=!1,this.rounded=!1,this.fullSize=!1}render(){let t={inherit:"inherit",xxs:"2",xs:"3",sm:"4",md:"4",mdl:"5",lg:"5",xl:"6",xxl:"7","3xl":"8","4xl":"9","5xl":"10"};return(this.style.cssText=`
      --local-width: ${this.size?`var(--apkt-spacing-${t[this.size]});`:"100%"};
      --local-height: ${this.size?`var(--apkt-spacing-${t[this.size]});`:"100%"};
      `,this.dataset.boxed=this.boxed?"true":"false",this.dataset.rounded=this.rounded?"true":"false",this.dataset.full=this.fullSize?"true":"false",this.dataset.icon=this.iconColor||"inherit",this.icon)?i.html`<wui-icon
        color=${this.iconColor||"inherit"}
        name=${this.icon}
        size="lg"
      ></wui-icon> `:this.logo?i.html`<wui-icon size="lg" color="inherit" name=${this.logo}></wui-icon> `:i.html`<img src=${(0,a.ifDefined)(this.src)} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};d.styles=[o.resetStyles,l],c([(0,r.property)()],d.prototype,"src",void 0),c([(0,r.property)()],d.prototype,"logo",void 0),c([(0,r.property)()],d.prototype,"icon",void 0),c([(0,r.property)()],d.prototype,"iconColor",void 0),c([(0,r.property)()],d.prototype,"alt",void 0),c([(0,r.property)()],d.prototype,"size",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"boxed",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"rounded",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"fullSize",void 0),d=c([(0,s.customElement)("wui-image")],d),t.s([],864380)},746650,t=>{"use strict";t.i(912190),t.s([])},389676,t=>{"use strict";t.i(812207);var e,i,r=t.i(604148),a=t.i(654479);t.i(374576);var o=t.i(120119),s=t.i(56350),n=t.i(48836),l=t.i(960398),c=t.i(227302),d=t.i(653157),p=t.i(82283),u=t.i(221728),h=t.i(426618),m=t.i(564126);t.i(404041);var g=t.i(528994),f=t.i(645975);t.i(62238),t.i(746650),t.i(210380),t.i(249536);var y=r;t.i(234051);var w=t.i(829389);t.i(839009);var b=t.i(459088);(e=i||(i={})).approve="approved",e.bought="bought",e.borrow="borrowed",e.burn="burnt",e.cancel="canceled",e.claim="claimed",e.deploy="deployed",e.deposit="deposited",e.execute="executed",e.mint="minted",e.receive="received",e.repay="repaid",e.send="sent",e.sell="sold",e.stake="staked",e.trade="swapped",e.unstake="unstaked",e.withdraw="withdrawn";var v=r;t.i(852634),t.i(864380),t.i(912190);var x=t.i(162611);let k=x.css`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.core.glass010};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  :host([data-no-images='true']) > wui-flex {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[3]} !important;
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  .swap-fallback-container {
    position: absolute;
    inset: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swap-fallback-container.first {
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-fallback-container.last {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  wui-flex.status-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
    border-radius: ${({borderRadius:t})=>t[4]};
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.theme.backgroundPrimary};
    overflow: hidden;
    width: 16px;
    height: 16px;
  }
`;var $=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let P=class extends v.LitElement{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""},this.failedImageUrls=new Set}handleImageError(t){return e=>{e.stopPropagation(),this.failedImageUrls.add(t),this.requestUpdate()}}render(){let[t,e]=this.images;this.images.length||(this.dataset.noImages="true");let i=t?.type==="NFT",r=e?.url?"NFT"===e.type:i;return this.style.cssText=`
    --local-left-border-radius: ${i?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)"};
    --local-right-border-radius: ${r?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)"};
    `,a.html`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){let[t,e]=this.images;return 2===this.images.length&&(t?.url||e?.url)?this.renderSwapImages(t,e):t?.url&&!this.failedImageUrls.has(t.url)?this.renderSingleImage(t):t?.type==="NFT"?this.renderPlaceholderIcon("nftPlaceholder"):this.renderPlaceholderIcon("coinPlaceholder")}renderSwapImages(t,e){return a.html`<div class="swap-images-container">
      ${t?.url?this.renderImageOrFallback(t,"first",!0):null}
      ${e?.url?this.renderImageOrFallback(e,"last",!0):null}
    </div>`}renderSingleImage(t){return this.renderImageOrFallback(t,void 0,!1)}renderImageOrFallback(t,e,i=!1){return t.url?this.failedImageUrls.has(t.url)?i&&e?this.renderFallbackIconInContainer(e):this.renderFallbackIcon():a.html`<wui-image
      src=${t.url}
      alt="Transaction image"
      @onLoadError=${this.handleImageError(t.url)}
    ></wui-image>`:null}renderFallbackIconInContainer(t){return a.html`<div class="swap-fallback-container ${t}">${this.renderFallbackIcon()}</div>`}renderFallbackIcon(){return a.html`<wui-icon
      size="xl"
      weight="regular"
      color="default"
      name="networkPlaceholder"
    ></wui-icon>`}renderPlaceholderIcon(t){return a.html`<wui-icon size="xl" weight="regular" color="default" name=${t}></wui-icon>`}templateIcon(){let t,e="accent-primary";return(t=this.getIcon(),this.status&&(e=this.getStatusColor()),t)?a.html`
      <wui-flex alignItems="center" justifyContent="center" class="status-box">
        <wui-icon-box size="sm" color=${e} icon=${t}></wui-icon-box>
      </wui-flex>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():"trade"===this.type?"swapHorizontal":"approve"===this.type?"checkmark":"cancel"===this.type?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success";case"failed":return"error";case"pending":return"inverse";default:return"accent-primary"}}};P.styles=[k],$([(0,o.property)()],P.prototype,"type",void 0),$([(0,o.property)()],P.prototype,"status",void 0),$([(0,o.property)()],P.prototype,"direction",void 0),$([(0,o.property)({type:Boolean})],P.prototype,"onlyDirectionIcon",void 0),$([(0,o.property)({type:Array})],P.prototype,"images",void 0),$([(0,o.property)({type:Object})],P.prototype,"secondImage",void 0),$([(0,s.state)()],P.prototype,"failedImageUrls",void 0),P=$([(0,f.customElement)("wui-transaction-visual")],P);let j=x.css`
  :host {
    width: 100%;
  }

  :host > wui-flex:first-child {
    align-items: center;
    column-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var T=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let I=class extends y.LitElement{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[]}render(){return a.html`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${(0,w.ifDefined)(this.direction)}
          type=${this.type}
          .onlyDirectionIcon=${this.onlyDirectionIcon}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="lg-medium" color="primary">
            ${i[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="sm-medium" color="secondary"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){let t=this.descriptions?.[0];return t?a.html`
          <wui-text variant="md-regular" color="secondary">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){let t=this.descriptions?.[1];return t?a.html`
          <wui-icon class="description-separator-icon" size="sm" name="arrowRight"></wui-icon>
          <wui-text variant="md-regular" color="secondary">
            <span>${t}</span>
          </wui-text>
        `:null}};I.styles=[b.resetStyles,j],T([(0,o.property)()],I.prototype,"type",void 0),T([(0,o.property)({type:Array})],I.prototype,"descriptions",void 0),T([(0,o.property)()],I.prototype,"date",void 0),T([(0,o.property)({type:Boolean})],I.prototype,"onlyDirectionIcon",void 0),T([(0,o.property)()],I.prototype,"status",void 0),T([(0,o.property)()],I.prototype,"direction",void 0),T([(0,o.property)({type:Array})],I.prototype,"images",void 0),I=T([(0,f.customElement)("wui-transaction-list-item")],I);var C=r;t.i(864576),t.i(73944);var z=r;let O=x.css`
  wui-flex {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t[128]};
  }

  .fallback-icon {
    color: ${({tokens:t})=>t.theme.iconInverse};
    border-radius: ${({borderRadius:t})=>t[3]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .direction-icon,
  .status-image {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: ${({borderRadius:t})=>t[128]};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  .direction-icon {
    padding: ${({spacing:t})=>t["01"]};
    color: ${({tokens:t})=>t.core.iconSuccess};

    background-color: color-mix(
      in srgb,
      ${({tokens:t})=>t.core.textSuccess} 30%,
      ${({tokens:t})=>t.theme.backgroundPrimary} 70%
    );
  }

  /* -- Sizes --------------------------------------------------- */
  :host([data-size='sm']) > wui-image:not(.status-image),
  :host([data-size='sm']) > wui-flex {
    width: 24px;
    height: 24px;
  }

  :host([data-size='lg']) > wui-image:not(.status-image),
  :host([data-size='lg']) > wui-flex {
    width: 40px;
    height: 40px;
  }

  :host([data-size='sm']) .fallback-icon {
    height: 16px;
    width: 16px;
    padding: ${({spacing:t})=>t[1]};
  }

  :host([data-size='lg']) .fallback-icon {
    height: 32px;
    width: 32px;
    padding: ${({spacing:t})=>t[1]};
  }

  :host([data-size='sm']) .direction-icon,
  :host([data-size='sm']) .status-image {
    transform: translate(40%, 30%);
  }

  :host([data-size='lg']) .direction-icon,
  :host([data-size='lg']) .status-image {
    transform: translate(40%, 10%);
  }

  :host([data-size='sm']) .status-image {
    height: 14px;
    width: 14px;
  }

  :host([data-size='lg']) .status-image {
    height: 20px;
    width: 20px;
  }

  /* -- Crop effects --------------------------------------------------- */
  .swap-crop-left-image,
  .swap-crop-right-image {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .swap-crop-left-image {
    left: 0;
    clip-path: inset(0px calc(50% + 1.5px) 0px 0%);
  }

  .swap-crop-right-image {
    right: 0;
    clip-path: inset(0px 0px 0px calc(50% + 1.5px));
  }
`;var R=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let S={sm:"xxs",lg:"md"},D=class extends z.LitElement{constructor(){super(...arguments),this.type="approve",this.size="lg",this.statusImageUrl="",this.images=[]}render(){return a.html`<wui-flex>${this.templateVisual()} ${this.templateIcon()}</wui-flex>`}templateVisual(){switch(this.dataset.size=this.size,this.type){case"trade":return this.swapTemplate();case"fiat":return this.fiatTemplate();case"unknown":return this.unknownTemplate();default:return this.tokenTemplate()}}swapTemplate(){let[t,e]=this.images;return 2===this.images.length&&(t||e)?a.html`
        <wui-image class="swap-crop-left-image" src=${t} alt="Swap image"></wui-image>
        <wui-image class="swap-crop-right-image" src=${e} alt="Swap image"></wui-image>
      `:t?a.html`<wui-image src=${t} alt="Swap image"></wui-image>`:null}fiatTemplate(){return a.html`<wui-icon
      class="fallback-icon"
      size=${S[this.size]}
      name="dollar"
    ></wui-icon>`}unknownTemplate(){return a.html`<wui-icon
      class="fallback-icon"
      size=${S[this.size]}
      name="questionMark"
    ></wui-icon>`}tokenTemplate(){let[t]=this.images;return t?a.html`<wui-image src=${t} alt="Token image"></wui-image> `:a.html`<wui-icon
      class="fallback-icon"
      name=${"nft"===this.type?"image":"coinPlaceholder"}
    ></wui-icon>`}templateIcon(){return this.statusImageUrl?a.html`<wui-image
        class="status-image"
        src=${this.statusImageUrl}
        alt="Status image"
      ></wui-image>`:a.html`<wui-icon
      class="direction-icon"
      size=${S[this.size]}
      name=${this.getTemplateIcon()}
    ></wui-icon>`}getTemplateIcon(){return"trade"===this.type?"arrowClockWise":"arrowBottom"}};D.styles=[O],R([(0,o.property)()],D.prototype,"type",void 0),R([(0,o.property)()],D.prototype,"size",void 0),R([(0,o.property)()],D.prototype,"statusImageUrl",void 0),R([(0,o.property)({type:Array})],D.prototype,"images",void 0),D=R([(0,f.customElement)("wui-transaction-thumbnail")],D);let A=x.css`
  :host > wui-flex:first-child {
    gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`,E=class extends C.LitElement{render(){return a.html`
      <wui-flex alignItems="center" .padding=${["1","2","1","2"]}>
        <wui-shimmer width="40px" height="40px" rounded></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="124px" height="16px" rounded></wui-shimmer>
          <wui-shimmer width="60px" height="14px" rounded></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" rounded></wui-shimmer>
      </wui-flex>
    `}};E.styles=[b.resetStyles,A],E=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s}([(0,f.customElement)("wui-transaction-list-item-loader")],E);var U=t.i(979484);let B=x.css`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: ${({spacing:t})=>t["3"]};
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:t})=>t["3"]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var L=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let F="last-transaction",Y=class extends r.LitElement{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=l.ChainController.state.activeCaipAddress,this.transactionsByYear=h.TransactionsController.state.transactionsByYear,this.loading=h.TransactionsController.state.loading,this.empty=h.TransactionsController.state.empty,this.next=h.TransactionsController.state.next,h.TransactionsController.clearCursor(),this.unsubscribe.push(l.ChainController.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(h.TransactionsController.resetTransactions(),h.TransactionsController.fetchTransactions(t)),this.caipAddress=t}),l.ChainController.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),h.TransactionsController.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return a.html` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){h.TransactionsController.resetTransactions(),this.caipAddress&&h.TransactionsController.fetchTransactions(c.CoreHelperUtil.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(t=>{let e=parseInt(t,10),i=Array(12).fill(null).map((t,i)=>({groupTitle:g.TransactionUtil.getTransactionGroupTitle(e,i),transactions:this.transactionsByYear[e]?.[i]})).filter(({transactions:t})=>t).reverse();return i.map(({groupTitle:t,transactions:e},r)=>{let o=r===i.length-1;return e?a.html`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${o?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["2","3","3","3"]}
            >
              <wui-text variant="md-medium" color="secondary" data-testid="group-title">
                ${t}
              </wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="2">
              ${this.templateTransactions(e,o)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,e){let{date:i,descriptions:r,direction:o,images:s,status:n,type:l,transfers:c,isAllNFT:d}=this.getTransactionListItemProps(t);return a.html`
      <wui-transaction-list-item
        date=${i}
        .direction=${o}
        id=${e&&this.next?F:""}
        status=${n}
        type=${l}
        .images=${s}
        .onlyDirectionIcon=${d||1===c.length}
        .descriptions=${r}
      ></wui-transaction-list-item>
    `}templateTransactions(t,e){return t.map((i,r)=>{let o=e&&r===t.length-1;return a.html`${this.templateRenderTransaction(i,o)}`})}emptyStateActivity(){return a.html`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["10","5","10","5"]}
      gap="5"
      data-testid="empty-activity-state"
    >
      <wui-icon-box color="default" icon="wallet" size="xl"></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="lg-medium" color="primary">No Transactions yet</wui-text>
        <wui-text align="center" variant="lg-regular" color="secondary"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return a.html`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
      data-testid="empty-account-state"
    >
      <wui-icon-box icon="swapHorizontal" size="lg" color="default"></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="2"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="md-regular" align="center" color="primary">No activity yet</wui-text>
        <wui-text variant="sm-regular" align="center" color="secondary"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return"account"===this.page?a.html`${this.emptyStateAccount()}`:a.html`${this.emptyStateActivity()}`}templateLoading(){return"activity"===this.page?a.html` <wui-flex flexDirection="column" width="100%">
        <wui-flex .padding=${["2","3","3","3"]}>
          <wui-shimmer width="70px" height="16px" rounded></wui-shimmer>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2" width="100%">
          ${Array(7).fill(a.html` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t)}
        </wui-flex>
      </wui-flex>`:null}onReceiveClick(){u.RouterController.push("WalletReceive")}createPaginationObserver(){let{projectId:t}=p.OptionsController.state;this.paginationObserver=new IntersectionObserver(([e])=>{e?.isIntersecting&&!this.loading&&(h.TransactionsController.fetchTransactions(c.CoreHelperUtil.getPlainAddress(this.caipAddress)),d.EventsController.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:c.CoreHelperUtil.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:(0,m.getPreferredAccountType)(l.ChainController.state.activeChain)===U.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();let t=this.shadowRoot?.querySelector(`#${F}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){let e=n.DateUtil.formatDate(t?.metadata?.minedAt),i=g.TransactionUtil.mergeTransfers(t?.transfers||[]),r=g.TransactionUtil.getTransactionDescriptions(t,i),a=i?.[0],o=!!a&&i?.every(t=>!!t.nft_info),s=g.TransactionUtil.getTransactionImages(i);return{date:e,direction:a?.direction,descriptions:r,isAllNFT:o,images:s,status:t.metadata?.status,transfers:i,type:t.metadata?.operationType}}};Y.styles=B,L([(0,o.property)()],Y.prototype,"page",void 0),L([(0,s.state)()],Y.prototype,"caipAddress",void 0),L([(0,s.state)()],Y.prototype,"transactionsByYear",void 0),L([(0,s.state)()],Y.prototype,"loading",void 0),L([(0,s.state)()],Y.prototype,"empty",void 0),L([(0,s.state)()],Y.prototype,"next",void 0),Y=L([(0,f.customElement)("w3m-activity-list")],Y),t.s([],389676)},358323,t=>{"use strict";t.i(812207);var e=t.i(604148),i=t.i(654479);t.i(404041);var r=t.i(645975);t.i(62238),t.i(389676);var a=t.i(592057);let o=a.css`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`,s=class extends e.LitElement{render(){return i.html`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="3">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};s.styles=o,s=function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s}([(0,r.customElement)("w3m-transactions-view")],s),t.s(["W3mTransactionsView",()=>s],945336),t.s([],385877),t.i(385877),t.i(945336),t.s(["W3mTransactionsView",()=>s],358323)},982012,t=>{t.v(e=>Promise.all(["static/chunks/f79f2c5953f345e0.js"].map(e=>t.l(e))).then(()=>e(596403)))},340171,t=>{t.v(e=>Promise.all(["static/chunks/b218fd65e6ffb811.js"].map(e=>t.l(e))).then(()=>e(169592)))},210729,t=>{t.v(e=>Promise.all(["static/chunks/ea1c0442515bc44e.js"].map(e=>t.l(e))).then(()=>e(786977)))},480342,t=>{t.v(e=>Promise.all(["static/chunks/0cd1a5667c2e4e4e.js"].map(e=>t.l(e))).then(()=>e(532833)))},995724,t=>{t.v(e=>Promise.all(["static/chunks/d5ab41af19e6a5a5.js"].map(e=>t.l(e))).then(()=>e(972412)))},952792,t=>{t.v(e=>Promise.all(["static/chunks/b89837e50110ba10.js"].map(e=>t.l(e))).then(()=>e(126763)))},196302,t=>{t.v(e=>Promise.all(["static/chunks/4e8ef5a5d595698a.js"].map(e=>t.l(e))).then(()=>e(843229)))},344243,t=>{t.v(e=>Promise.all(["static/chunks/75acf4591c63eb7b.js"].map(e=>t.l(e))).then(()=>e(412721)))},959668,t=>{t.v(e=>Promise.all(["static/chunks/4041af2fac6a9121.js"].map(e=>t.l(e))).then(()=>e(336682)))},841373,t=>{t.v(e=>Promise.all(["static/chunks/570b3d7e7744bb4c.js"].map(e=>t.l(e))).then(()=>e(51383)))},969595,t=>{t.v(e=>Promise.all(["static/chunks/23fefe401a57db01.js"].map(e=>t.l(e))).then(()=>e(4289)))},233052,t=>{t.v(e=>Promise.all(["static/chunks/87f44e273cb4e5e7.js"].map(e=>t.l(e))).then(()=>e(656357)))},500280,t=>{t.v(e=>Promise.all(["static/chunks/a4696f09ba9afd99.js"].map(e=>t.l(e))).then(()=>e(478319)))},292833,t=>{t.v(e=>Promise.all(["static/chunks/2f85facf2887e0a0.js"].map(e=>t.l(e))).then(()=>e(861289)))},617096,t=>{t.v(e=>Promise.all(["static/chunks/e5e1dc9e06f2be99.js"].map(e=>t.l(e))).then(()=>e(926703)))},205963,t=>{t.v(e=>Promise.all(["static/chunks/b588583c04ed0374.js"].map(e=>t.l(e))).then(()=>e(409953)))},548774,t=>{t.v(e=>Promise.all(["static/chunks/adb5466e161adf4d.js"].map(e=>t.l(e))).then(()=>e(632295)))},550090,t=>{t.v(e=>Promise.all(["static/chunks/c25aa0dfe5629950.js"].map(e=>t.l(e))).then(()=>e(152019)))},538711,t=>{t.v(e=>Promise.all(["static/chunks/cbb03953703d9882.js"].map(e=>t.l(e))).then(()=>e(164871)))},650621,t=>{t.v(e=>Promise.all(["static/chunks/3ce4429aafead659.js"].map(e=>t.l(e))).then(()=>e(159021)))},105462,t=>{t.v(e=>Promise.all(["static/chunks/5a755da1bbfd47e3.js"].map(e=>t.l(e))).then(()=>e(765788)))},470963,t=>{t.v(e=>Promise.all(["static/chunks/70afb36b7c6f3f82.js"].map(e=>t.l(e))).then(()=>e(617729)))},956906,t=>{t.v(e=>Promise.all(["static/chunks/527aa7d00804c639.js"].map(e=>t.l(e))).then(()=>e(734056)))},978023,t=>{t.v(e=>Promise.all(["static/chunks/3633a97065da4148.js"].map(e=>t.l(e))).then(()=>e(271507)))},69039,t=>{t.v(e=>Promise.all(["static/chunks/fd73af2dcad2036d.js"].map(e=>t.l(e))).then(()=>e(402658)))},63605,t=>{t.v(e=>Promise.all(["static/chunks/27d1bb06a569fc58.js"].map(e=>t.l(e))).then(()=>e(739621)))},542324,t=>{t.v(e=>Promise.all(["static/chunks/d8815c6e982e855e.js"].map(e=>t.l(e))).then(()=>e(111923)))},784968,t=>{t.v(e=>Promise.all(["static/chunks/9260b0073bc27263.js"].map(e=>t.l(e))).then(()=>e(674571)))},944020,t=>{t.v(e=>Promise.all(["static/chunks/c7bffff505a3f1cc.js"].map(e=>t.l(e))).then(()=>e(384535)))},750711,t=>{t.v(e=>Promise.all(["static/chunks/6c06d9eb4d536639.js"].map(e=>t.l(e))).then(()=>e(15680)))},956601,t=>{t.v(e=>Promise.all(["static/chunks/9957999e48ddb0da.js"].map(e=>t.l(e))).then(()=>e(301958)))},281254,t=>{t.v(e=>Promise.all(["static/chunks/9c096cd7c35afd5b.js"].map(e=>t.l(e))).then(()=>e(111420)))},179893,t=>{t.v(e=>Promise.all(["static/chunks/c77b5b2f65d349d4.js"].map(e=>t.l(e))).then(()=>e(852452)))},201514,t=>{t.v(e=>Promise.all(["static/chunks/21259a4d5813cc21.js"].map(e=>t.l(e))).then(()=>e(335252)))},144980,t=>{t.v(e=>Promise.all(["static/chunks/ffadb9c65e964efc.js"].map(e=>t.l(e))).then(()=>e(680835)))},684074,t=>{t.v(e=>Promise.all(["static/chunks/01ea06d1fad36eea.js"].map(e=>t.l(e))).then(()=>e(294301)))},967422,t=>{t.v(e=>Promise.all(["static/chunks/7e1ea45fe40513ab.js"].map(e=>t.l(e))).then(()=>e(389931)))},413200,t=>{t.v(e=>Promise.all(["static/chunks/0190c23ef20d9915.js"].map(e=>t.l(e))).then(()=>e(969097)))},248479,t=>{t.v(e=>Promise.all(["static/chunks/c16e09491885a16c.js"].map(e=>t.l(e))).then(()=>e(288299)))},123903,t=>{t.v(e=>Promise.all(["static/chunks/2045decda27eea90.js"].map(e=>t.l(e))).then(()=>e(266712)))},177793,t=>{t.v(e=>Promise.all(["static/chunks/ec4ce3dab523212f.js"].map(e=>t.l(e))).then(()=>e(71960)))},104447,t=>{t.v(e=>Promise.all(["static/chunks/de8fd5c7ea6619a8.js"].map(e=>t.l(e))).then(()=>e(465425)))},593690,t=>{t.v(e=>Promise.all(["static/chunks/4be28e5e9b07f360.js"].map(e=>t.l(e))).then(()=>e(365891)))},551383,t=>{t.v(e=>Promise.all(["static/chunks/d487e7f2549e7b24.js"].map(e=>t.l(e))).then(()=>e(284131)))},365739,t=>{t.v(e=>Promise.all(["static/chunks/90b00338dcc1aa6b.js"].map(e=>t.l(e))).then(()=>e(709900)))},183589,t=>{t.v(e=>Promise.all(["static/chunks/29ac59ae03a247ad.js"].map(e=>t.l(e))).then(()=>e(645017)))},809957,t=>{t.v(e=>Promise.all(["static/chunks/6af9c0d473cfd028.js"].map(e=>t.l(e))).then(()=>e(644919)))},722236,t=>{t.v(e=>Promise.all(["static/chunks/b2389478ea8ca9e5.js"].map(e=>t.l(e))).then(()=>e(906501)))},40934,t=>{t.v(e=>Promise.all(["static/chunks/f952c4ad43b5d787.js"].map(e=>t.l(e))).then(()=>e(713559)))},971802,t=>{t.v(e=>Promise.all(["static/chunks/b5190ac36d32e4ab.js"].map(e=>t.l(e))).then(()=>e(994384)))},557792,t=>{t.v(e=>Promise.all(["static/chunks/c91fa96a3ee248c2.js"].map(e=>t.l(e))).then(()=>e(576208)))},807885,t=>{t.v(e=>Promise.all(["static/chunks/588ba01ddf63ba8f.js"].map(e=>t.l(e))).then(()=>e(56529)))}]);

//# debugId=5dade49a-0b07-04fb-1147-beadeaf49630
