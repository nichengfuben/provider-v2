;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="a1e29f1b-0b91-d598-9db3-3cea35f27813")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,442696,e=>{"use strict";e.i(812207);var t=e.i(604148),i=e.i(654479);e.i(374576);var o=e.i(120119),r=e.i(56350);e.i(234051);var n=e.i(829389),a=e.i(241845),l=e.i(436220),s=e.i(960398),c=e.i(227302),d=e.i(803468),u=e.i(82283);e.i(404041);var p=e.i(645975),h=t;e.i(852634),e.i(864380),e.i(383227),e.i(839009),e.i(73944);var m=e.i(459088),w=e.i(112699);e.i(221803);var g=e.i(162611);let f=g.css`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e["20"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[16]};
    height: 32px;
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: box-shadow;
  }

  button wui-flex.avatar-container {
    width: 28px;
    height: 24px;
    position: relative;

    wui-flex.network-image-container {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
    }

    wui-flex.network-image-container wui-icon {
      background: ${({tokens:e})=>e.theme.foregroundPrimary};
    }

    wui-avatar {
      width: 24px;
      min-width: 24px;
      height: 24px;
    }

    wui-icon {
      width: 12px;
      height: 12px;
    }
  }

  wui-image,
  wui-icon {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-text {
    white-space: nowrap;
  }

  button wui-flex.balance-container {
    height: 100%;
    border-radius: ${({borderRadius:e})=>e[16]};
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
    background: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:focus-visible:enabled,
  button:active:enabled {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);

    wui-flex.balance-container {
      background: ${({tokens:e})=>e.theme.foregroundTertiary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled wui-text,
  button:disabled wui-flex.avatar-container {
    opacity: 0.3;
  }
`;var b=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let C=class extends h.LitElement{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return i.html`
      <button
        ?disabled=${this.disabled}
        class=${(0,n.ifDefined)(this.balance?void 0:"local-no-balance")}
        data-error=${(0,n.ifDefined)(this.isUnsupportedChain)}
      >
        ${this.imageTemplate()} ${this.addressTemplate()} ${this.balanceTemplate()}
      </button>
    `}imageTemplate(){let e=this.networkSrc?i.html`<wui-image src=${this.networkSrc}></wui-image>`:i.html` <wui-icon size="inherit" color="inherit" name="networkPlaceholder"></wui-icon> `;return i.html`<wui-flex class="avatar-container">
      <wui-avatar
        .imageSrc=${this.avatarSrc}
        alt=${this.address}
        address=${this.address}
      ></wui-avatar>

      <wui-flex class="network-image-container">${e}</wui-flex>
    </wui-flex>`}addressTemplate(){return i.html`<wui-text variant="md-regular" color="inherit">
      ${this.address?w.UiHelperUtil.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
    </wui-text>`}balanceTemplate(){if(this.balance){let e=this.loading?i.html`<wui-loading-spinner size="md" color="inherit"></wui-loading-spinner>`:i.html`<wui-text variant="md-regular" color="inherit"> ${this.balance}</wui-text>`;return i.html`<wui-flex alignItems="center" justifyContent="center" class="balance-container"
        >${e}</wui-flex
      >`}return null}};C.styles=[m.resetStyles,m.elementStyles,f],b([(0,o.property)()],C.prototype,"networkSrc",void 0),b([(0,o.property)()],C.prototype,"avatarSrc",void 0),b([(0,o.property)()],C.prototype,"balance",void 0),b([(0,o.property)({type:Boolean})],C.prototype,"isUnsupportedChain",void 0),b([(0,o.property)({type:Boolean})],C.prototype,"disabled",void 0),b([(0,o.property)({type:Boolean})],C.prototype,"loading",void 0),b([(0,o.property)()],C.prototype,"address",void 0),b([(0,o.property)()],C.prototype,"profileName",void 0),b([(0,o.property)()],C.prototype,"charsStart",void 0),b([(0,o.property)()],C.prototype,"charsEnd",void 0),C=b([(0,p.customElement)("wui-account-button")],C);var y=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};class v extends t.LitElement{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=!!u.OptionsController.state.allowUnsupportedChain||!s.ChainController.state.activeChain||s.ChainController.checkIfSupportedNetwork(s.ChainController.state.activeChain)}connectedCallback(){super.connectedCallback(),this.setAccountData(s.ChainController.getAccountData(this.namespace)),this.setNetworkData(s.ChainController.getNetworkData(this.namespace))}firstUpdated(){let e=this.namespace;e?this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{this.setAccountData(e)},e),s.ChainController.subscribeChainProp("networkState",t=>{this.setNetworkData(t),this.isSupported=s.ChainController.checkIfSupportedNetwork(e,t?.caipNetwork?.caipNetworkId)},e)):this.unsubscribe.push(a.AssetController.subscribeNetworkImages(()=>{this.networkImage=l.AssetUtil.getNetworkImage(this.network)}),s.ChainController.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),s.ChainController.subscribeChainProp("accountState",e=>{this.setAccountData(e)}),s.ChainController.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=l.AssetUtil.getNetworkImage(e),this.isSupported=!e?.chainNamespace||s.ChainController.checkIfSupportedNetwork(e?.chainNamespace),this.fetchNetworkImage(e)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!s.ChainController.state.activeChain)return null;let e="show"===this.balance,t="string"!=typeof this.balanceVal,{formattedText:o}=c.CoreHelperUtil.parseBalance(this.balanceVal,this.balanceSymbol);return i.html`
      <wui-account-button
        .disabled=${!!this.disabled}
        .isUnsupportedChain=${!u.OptionsController.state.allowUnsupportedChain&&!this.isSupported}
        address=${(0,n.ifDefined)(c.CoreHelperUtil.getPlainAddress(this.caipAddress))}
        profileName=${(0,n.ifDefined)(this.profileName)}
        networkSrc=${(0,n.ifDefined)(this.networkImage)}
        avatarSrc=${(0,n.ifDefined)(this.profileImage)}
        balance=${e?o:""}
        @click=${this.onClick.bind(this)}
        data-testid=${`account-button${this.namespace?`-${this.namespace}`:""}`}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${t}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||u.OptionsController.state.allowUnsupportedChain?d.ModalController.open({namespace:this.namespace}):d.ModalController.open({view:"UnsupportedChain"})}async fetchNetworkImage(e){e?.assets?.imageId&&(this.networkImage=await l.AssetUtil.fetchNetworkImage(e?.assets?.imageId))}setAccountData(e){e&&(this.caipAddress=e.caipAddress,this.balanceVal=e.balance,this.balanceSymbol=e.balanceSymbol,this.profileName=e.profileName,this.profileImage=e.profileImage)}setNetworkData(e){e&&(this.network=e.caipNetwork,this.networkImage=l.AssetUtil.getNetworkImage(e.caipNetwork))}}y([(0,o.property)({type:Boolean})],v.prototype,"disabled",void 0),y([(0,o.property)()],v.prototype,"balance",void 0),y([(0,o.property)()],v.prototype,"charsStart",void 0),y([(0,o.property)()],v.prototype,"charsEnd",void 0),y([(0,o.property)()],v.prototype,"namespace",void 0),y([(0,r.state)()],v.prototype,"caipAddress",void 0),y([(0,r.state)()],v.prototype,"balanceVal",void 0),y([(0,r.state)()],v.prototype,"balanceSymbol",void 0),y([(0,r.state)()],v.prototype,"profileName",void 0),y([(0,r.state)()],v.prototype,"profileImage",void 0),y([(0,r.state)()],v.prototype,"network",void 0),y([(0,r.state)()],v.prototype,"networkImage",void 0),y([(0,r.state)()],v.prototype,"isSupported",void 0);let x=class extends v{};x=y([(0,p.customElement)("w3m-account-button")],x);let $=class extends v{};$=y([(0,p.customElement)("appkit-account-button")],$),e.s(["AppKitAccountButton",()=>$,"W3mAccountButton",()=>x],237287);var k=t,E=e.i(592057);let S=E.css`
  :host {
    display: block;
    width: max-content;
  }
`;var A=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};class R extends k.LitElement{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}firstUpdated(){this.caipAddress=this.namespace?s.ChainController.getAccountData(this.namespace)?.caipAddress:s.ChainController.state.activeCaipAddress,this.namespace?this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},this.namespace)):this.unsubscribe.push(s.ChainController.subscribeKey("activeCaipAddress",e=>this.caipAddress=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.caipAddress?i.html`
          <appkit-account-button
            .disabled=${!!this.disabled}
            balance=${(0,n.ifDefined)(this.balance)}
            .charsStart=${(0,n.ifDefined)(this.charsStart)}
            .charsEnd=${(0,n.ifDefined)(this.charsEnd)}
            namespace=${(0,n.ifDefined)(this.namespace)}
          >
          </appkit-account-button>
        `:i.html`
          <appkit-connect-button
            size=${(0,n.ifDefined)(this.size)}
            label=${(0,n.ifDefined)(this.label)}
            loadingLabel=${(0,n.ifDefined)(this.loadingLabel)}
            namespace=${(0,n.ifDefined)(this.namespace)}
          ></appkit-connect-button>
        `}}R.styles=S,A([(0,o.property)({type:Boolean})],R.prototype,"disabled",void 0),A([(0,o.property)()],R.prototype,"balance",void 0),A([(0,o.property)()],R.prototype,"size",void 0),A([(0,o.property)()],R.prototype,"label",void 0),A([(0,o.property)()],R.prototype,"loadingLabel",void 0),A([(0,o.property)()],R.prototype,"charsStart",void 0),A([(0,o.property)()],R.prototype,"charsEnd",void 0),A([(0,o.property)()],R.prototype,"namespace",void 0),A([(0,r.state)()],R.prototype,"caipAddress",void 0);let T=class extends R{};T=A([(0,p.customElement)("w3m-button")],T);let I=class extends R{};I=A([(0,p.customElement)("appkit-button")],I),e.s(["AppKitButton",()=>I,"W3mButton",()=>T],972801);var O=t,N=t;let U=g.css`
  :host {
    position: relative;
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='sm'] {
    padding: ${({spacing:e})=>e[2]};
  }

  button[data-size='md'] {
    padding: ${({spacing:e})=>e[3]};
  }

  button[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]};
  }

  button[data-variant='primary'] {
    background: ${({tokens:e})=>e.core.backgroundAccentPrimary};
  }

  button[data-variant='secondary'] {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button:hover:enabled {
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  button:disabled {
    cursor: not-allowed;
  }

  button[data-loading='true'] {
    cursor: not-allowed;
  }

  button[data-loading='true'][data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
  }

  button[data-loading='true'][data-size='md'] {
    border-radius: ${({borderRadius:e})=>e[20]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[4]};
  }

  button[data-loading='true'][data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[16]};
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[5]};
  }
`;var P=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let D=class extends N.LitElement{constructor(){super(...arguments),this.size="md",this.variant="primary",this.loading=!1,this.text="Connect Wallet"}render(){return i.html`
      <button
        data-loading=${this.loading}
        data-variant=${this.variant}
        data-size=${this.size}
        ?disabled=${this.loading}
      >
        ${this.contentTemplate()}
      </button>
    `}contentTemplate(){let e={primary:"invert",secondary:"accent-primary"};return this.loading?i.html`<wui-loading-spinner
      color=${e[this.variant]}
      size=${this.size}
    ></wui-loading-spinner>`:i.html` <wui-text variant=${({lg:"lg-regular",md:"md-regular",sm:"sm-regular"})[this.size]} color=${e[this.variant]}>
        ${this.text}
      </wui-text>`}};D.styles=[m.resetStyles,m.elementStyles,U],P([(0,o.property)()],D.prototype,"size",void 0),P([(0,o.property)()],D.prototype,"variant",void 0),P([(0,o.property)({type:Boolean})],D.prototype,"loading",void 0),P([(0,o.property)()],D.prototype,"text",void 0),D=P([(0,p.customElement)("wui-connect-button")],D);var L=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};class W extends O.LitElement{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=d.ModalController.state.open,this.loading=this.namespace?d.ModalController.state.loadingNamespaceMap.get(this.namespace):d.ModalController.state.loading,this.unsubscribe.push(d.ModalController.subscribe(e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-connect-button
        size=${(0,n.ifDefined)(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${`connect-button${this.namespace?`-${this.namespace}`:""}`}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?d.ModalController.close():this.loading||d.ModalController.open({view:"Connect",namespace:this.namespace})}}L([(0,o.property)()],W.prototype,"size",void 0),L([(0,o.property)()],W.prototype,"label",void 0),L([(0,o.property)()],W.prototype,"loadingLabel",void 0),L([(0,o.property)()],W.prototype,"namespace",void 0),L([(0,r.state)()],W.prototype,"open",void 0),L([(0,r.state)()],W.prototype,"loading",void 0);let j=class extends W{};j=L([(0,p.customElement)("w3m-connect-button")],j);let z=class extends W{};z=L([(0,p.customElement)("appkit-connect-button")],z),e.s(["AppKitConnectButton",()=>z,"W3mConnectButton",()=>j],885873);var B=t,F=e.i(653157),_=t;e.i(912190);let H=g.css`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:e})=>e[32]};
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]}
      ${({spacing:e})=>e[1]} ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button[data-size='sm'] > wui-icon-box,
  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-icon-box,
  button[data-size='md'] > wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-icon-box,
  button[data-size='lg'] > wui-image {
    width: 24px;
    height: 24px;
  }

  wui-image,
  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e[32]};
  }
`;var M=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let V=class extends _.LitElement{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.size="lg"}render(){return i.html`
      <button data-size=${this.size} data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant=${({sm:"sm-regular",md:"md-regular",lg:"lg-regular"})[this.size]} color="primary">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?i.html` <wui-icon-box color="error" icon="warningCircle"></wui-icon-box> `:this.imageSrc?i.html`<wui-image src=${this.imageSrc}></wui-image>`:i.html` <wui-icon size="xl" color="default" name="networkPlaceholder"></wui-icon> `}};V.styles=[m.resetStyles,m.elementStyles,H],M([(0,o.property)()],V.prototype,"imageSrc",void 0),M([(0,o.property)({type:Boolean})],V.prototype,"isUnsupportedChain",void 0),M([(0,o.property)({type:Boolean})],V.prototype,"disabled",void 0),M([(0,o.property)()],V.prototype,"size",void 0),V=M([(0,p.customElement)("wui-network-button")],V);let K=E.css`
  :host {
    display: block;
    width: max-content;
  }
`;var q=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};class G extends B.LitElement{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=s.ChainController.state.activeCaipNetwork,this.networkImage=l.AssetUtil.getNetworkImage(this.network),this.caipAddress=s.ChainController.state.activeCaipAddress,this.loading=d.ModalController.state.loading,this.isSupported=!!u.OptionsController.state.allowUnsupportedChain||!s.ChainController.state.activeChain||s.ChainController.checkIfSupportedNetwork(s.ChainController.state.activeChain),this.unsubscribe.push(a.AssetController.subscribeNetworkImages(()=>{this.networkImage=l.AssetUtil.getNetworkImage(this.network)}),s.ChainController.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),s.ChainController.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=l.AssetUtil.getNetworkImage(e),this.isSupported=!e?.chainNamespace||s.ChainController.checkIfSupportedNetwork(e.chainNamespace),l.AssetUtil.fetchNetworkImage(e?.assets?.imageId)}),d.ModalController.subscribeKey("loading",e=>this.loading=e))}firstUpdated(){l.AssetUtil.fetchNetworkImage(this.network?.assets?.imageId)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=!this.network||s.ChainController.checkIfSupportedNetwork(this.network.chainNamespace);return i.html`
      <wui-network-button
        .disabled=${!!(this.disabled||this.loading)}
        .isUnsupportedChain=${!u.OptionsController.state.allowUnsupportedChain&&!e}
        imageSrc=${(0,n.ifDefined)(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?this.isSupported||u.OptionsController.state.allowUnsupportedChain?this.network.name:"Switch Network":this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(F.EventsController.sendEvent({type:"track",event:"CLICK_NETWORKS"}),d.ModalController.open({view:"Networks"}))}}G.styles=K,q([(0,o.property)({type:Boolean})],G.prototype,"disabled",void 0),q([(0,o.property)({type:String})],G.prototype,"label",void 0),q([(0,r.state)()],G.prototype,"network",void 0),q([(0,r.state)()],G.prototype,"networkImage",void 0),q([(0,r.state)()],G.prototype,"caipAddress",void 0),q([(0,r.state)()],G.prototype,"loading",void 0),q([(0,r.state)()],G.prototype,"isSupported",void 0);let X=class extends G{};X=q([(0,p.customElement)("w3m-network-button")],X);let Y=class extends G{};Y=q([(0,p.customElement)("appkit-network-button")],Y),e.s(["AppKitNetworkButton",()=>Y,"W3mNetworkButton",()=>X],619295);var Q=e.i(465487),J=e.i(590404),Z=t,ee=e.i(401564),et=e.i(971080),ei=e.i(149454),eo=e.i(360334),er=e.i(221728),en=e.i(811424);e.i(62238),e.i(907170),e.i(143053);var ea=t;e.i(624947);let el=g.css`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  wui-flex > wui-icon {
    padding: ${({spacing:e})=>e[2]};
    color: ${({tokens:e})=>e.theme.textInvert};
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    border-radius: ${({borderRadius:e})=>e[2]};
    align-items: center;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent020};
    }
  }
`;var es=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ec=class extends ea.LitElement{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return i.html`
      <button>
        <wui-flex gap="2" alignItems="center">
          <wui-icon weight="fill" size="lg" name=${this.icon} color="inherit"></wui-icon>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.label}</wui-text>
            <wui-text variant="md-regular" color="tertiary">${this.description}</wui-text>
          </wui-flex>
        </wui-flex>
        <wui-icon size="lg" color="accent-primary" name="chevronRight"></wui-icon>
      </button>
    `}};ec.styles=[m.resetStyles,m.elementStyles,el],es([(0,o.property)()],ec.prototype,"label",void 0),es([(0,o.property)()],ec.prototype,"description",void 0),es([(0,o.property)()],ec.prototype,"icon",void 0),ec=es([(0,p.customElement)("wui-notice-card")],ec),e.i(249536);var ed=t,eu=e.i(758331),ep=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let eh=class extends ed.LitElement{constructor(){super(),this.unsubscribe=[],this.socialProvider=eu.StorageUtil.getConnectedSocialProvider(),this.socialUsername=eu.StorageUtil.getConnectedSocialUsername(),this.namespace=s.ChainController.state.activeChain,this.unsubscribe.push(s.ChainController.subscribeKey("activeChain",e=>{this.namespace=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=ei.ConnectorController.getConnectorId(this.namespace),t=ei.ConnectorController.getAuthConnector();if(!t||e!==ee.ConstantsUtil.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;let o=t.provider.getEmail()??"";return o||this.socialUsername?i.html`
      <wui-list-item
        ?rounded=${!0}
        icon=${this.socialProvider??"mail"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(o,this.socialProvider)}}
      >
        <wui-text variant="lg-regular" color="primary">${this.getAuthName(o)}</wui-text>
      </wui-list-item>
    `:(this.style.cssText="display: none",null)}onGoToUpdateEmail(e,t){t||er.RouterController.push("UpdateEmailWallet",{email:e,redirectView:"Account"})}getAuthName(e){return this.socialUsername?"discord"===this.socialProvider&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};ep([(0,r.state)()],eh.prototype,"namespace",void 0),eh=ep([(0,p.customElement)("w3m-account-auth-button")],eh);var em=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ew=class extends Z.LitElement{constructor(){super(),this.usubscribe=[],this.networkImages=a.AssetController.state.networkImages,this.address=s.ChainController.getAccountData()?.address,this.profileImage=s.ChainController.getAccountData()?.profileImage,this.profileName=s.ChainController.getAccountData()?.profileName,this.network=s.ChainController.state.activeCaipNetwork,this.disconnecting=!1,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.usubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{e&&(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName)}),s.ChainController.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}),u.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.usubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-account-settings-view: No account provided");let e=this.networkImages[this.network?.assets?.imageId??""];return i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["0","5","3","5"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${(0,n.ifDefined)(this.profileImage)}
          size="lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="1" alignItems="center" justifyContent="center">
            <wui-text variant="h5-medium" color="primary" data-testid="account-settings-address">
              ${w.UiHelperUtil.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="default"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            imageSrc=${(0,n.ifDefined)(e)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            ?fullSize=${!0}
            ?rounded=${!0}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="lg-regular" color="primary">
              ${this.network?.name??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.smartAccountSettingsTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            ?rounded=${!0}
            icon="power"
            iconColor="error"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){let e=this.network?.chainNamespace,t=ei.ConnectorController.getConnectorId(e),o=ei.ConnectorController.getAuthConnector();return s.ChainController.checkIfNamesSupported()&&o&&t===ee.ConstantsUtil.CONNECTOR_ID.AUTH&&!this.profileName?i.html`
      <wui-list-item
        icon="id"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="lg-regular" color="primary">Choose account name </wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){let e=ei.ConnectorController.getConnectorId(this.network?.chainNamespace),t=ei.ConnectorController.getAuthConnector(),{origin:o}=location;return!t||e!==ee.ConstantsUtil.CONNECTOR_ID.AUTH||o.includes(eo.ConstantsUtil.SECURE_SITE)?null:i.html`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){let e=s.ChainController.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=e?.find(({id:e})=>e===this.network?.id);return t||!i}onCopyAddress(){try{this.address&&(c.CoreHelperUtil.copyToClopboard(this.address),en.SnackController.showSuccess("Address copied"))}catch{en.SnackController.showError("Failed to copy")}}smartAccountSettingsTemplate(){let e=this.network?.chainNamespace,t=s.ChainController.checkIfSmartAccountEnabled(),o=ei.ConnectorController.getConnectorId(e);return ei.ConnectorController.getAuthConnector()&&o===ee.ConstantsUtil.CONNECTOR_ID.AUTH&&t?i.html`
      <wui-list-item
        icon="user"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onSmartAccountSettings.bind(this)}
        data-testid="account-smart-account-settings-button"
      >
        <wui-text variant="lg-regular" color="primary">Smart Account Settings</wui-text>
      </wui-list-item>
    `:null}onChooseName(){er.RouterController.push("ChooseAccountName")}onNetworks(){this.isAllowedNetworkSwitch()&&er.RouterController.push("Networks")}async onDisconnect(){try{this.disconnecting=!0;let e=this.network?.chainNamespace,t=et.ConnectionController.getConnections(e).length>0,i=e&&ei.ConnectorController.state.activeConnectorIds[e],o=this.remoteFeatures?.multiWallet;await et.ConnectionController.disconnect(o?{id:i,namespace:e}:{}),t&&o&&(er.RouterController.push("ProfileWallets"),en.SnackController.showSuccess("Wallet deleted"))}catch{F.EventsController.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),en.SnackController.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){F.EventsController.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),er.RouterController.push("UpgradeEmailWallet")}onSmartAccountSettings(){er.RouterController.push("SmartAccountSettings")}};em([(0,r.state)()],ew.prototype,"address",void 0),em([(0,r.state)()],ew.prototype,"profileImage",void 0),em([(0,r.state)()],ew.prototype,"profileName",void 0),em([(0,r.state)()],ew.prototype,"network",void 0),em([(0,r.state)()],ew.prototype,"disconnecting",void 0),em([(0,r.state)()],ew.prototype,"remoteFeatures",void 0),ew=em([(0,p.customElement)("w3m-account-settings-view")],ew),e.s(["W3mAccountSettingsView",()=>ew],269311);var eg=t,ef=t,eb=e.i(849694),eC=e.i(564126);e.i(534420),e.i(443452);var ey=t,ev=t;let ex=g.css`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`;var e$=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ek={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},eE={lg:"md",md:"sm",sm:"sm"},eS=class extends ev.LitElement{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return i.html`
      <button data-active=${this.active}>
        ${this.icon?i.html`<wui-icon size=${eE[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${ek[this.size]}> ${this.label} </wui-text>
      </button>
    `}};eS.styles=[m.resetStyles,m.elementStyles,ex],e$([(0,o.property)()],eS.prototype,"icon",void 0),e$([(0,o.property)()],eS.prototype,"size",void 0),e$([(0,o.property)()],eS.prototype,"label",void 0),e$([(0,o.property)({type:Boolean})],eS.prototype,"active",void 0),eS=e$([(0,p.customElement)("wui-tab-item")],eS);let eA=g.css`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var eR=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let eT=class extends ey.LitElement{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,t)=>{let o=t===this.activeTab;return i.html`
        <wui-tab-item
          @click=${()=>this.onTabClick(t)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${o}
          data-active=${o}
          data-testid="tab-${e.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};eT.styles=[m.resetStyles,m.elementStyles,eA],eR([(0,o.property)({type:Array})],eT.prototype,"tabs",void 0),eR([(0,o.property)()],eT.prototype,"onTabChange",void 0),eR([(0,o.property)()],eT.prototype,"size",void 0),eR([(0,r.state)()],eT.prototype,"activeTab",void 0),eT=eR([(0,p.customElement)("wui-tabs")],eT),e.i(988016),e.i(604415);var eI=e.i(979484);let eO=g.css`
  wui-icon-link {
    margin-right: calc(${({spacing:e})=>e["8"]} * -1);
  }

  wui-notice-card {
    margin-bottom: ${({spacing:e})=>e["1"]};
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .balance-container {
    display: inline;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .symbol {
    transform: translateY(-2px);
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e["3"]};
    height: 48px;
    padding: ${({spacing:e})=>e["2"]};
    padding-right: ${({spacing:e})=>e["3"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  .account-button:hover {
    background-color: ${({tokens:e})=>e.core.glass010};
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
  }

  wui-wallet-switch {
    margin-top: ${({spacing:e})=>e["2"]};
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color ${({durations:e})=>e.md}
        ${({easings:e})=>e["ease-out-power-1"]},
      opacity ${({durations:e})=>e.md} ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`;var eN=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let eU=class extends ef.LitElement{constructor(){super(),this.unsubscribe=[],this.caipAddress=s.ChainController.getAccountData()?.caipAddress,this.address=c.CoreHelperUtil.getPlainAddress(s.ChainController.getAccountData()?.caipAddress),this.profileImage=s.ChainController.getAccountData()?.profileImage,this.profileName=s.ChainController.getAccountData()?.profileName,this.disconnecting=!1,this.balance=s.ChainController.getAccountData()?.balance,this.balanceSymbol=s.ChainController.getAccountData()?.balanceSymbol,this.features=u.OptionsController.state.features,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.namespace=s.ChainController.state.activeChain,this.activeConnectorIds=ei.ConnectorController.state.activeConnectorIds,this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{this.address=c.CoreHelperUtil.getPlainAddress(e?.caipAddress),this.caipAddress=e?.caipAddress,this.balance=e?.balance,this.balanceSymbol=e?.balanceSymbol,this.profileName=e?.profileName,this.profileImage=e?.profileImage}),u.OptionsController.subscribeKey("features",e=>this.features=e),u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),ei.ConnectorController.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),s.ChainController.subscribeKey("activeChain",e=>this.namespace=e),s.ChainController.subscribeKey("activeCaipNetwork",e=>{e?.chainNamespace&&(this.namespace=e?.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.caipAddress||!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],t=e?ei.ConnectorController.getConnectorById(e):void 0,o=l.AssetUtil.getConnectorImage(t),{value:r,decimals:a,symbol:s}=c.CoreHelperUtil.parseBalance(this.balance,this.balanceSymbol);return i.html`<wui-flex
        flexDirection="column"
        .padding=${["0","5","4","5"]}
        alignItems="center"
        gap="3"
      >
        <wui-avatar
          alt=${(0,n.ifDefined)(this.caipAddress)}
          address=${(0,n.ifDefined)(c.CoreHelperUtil.getPlainAddress(this.caipAddress))}
          imageSrc=${(0,n.ifDefined)(null===this.profileImage?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${o}
          alt=${t?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <div class="balance-container">
          <wui-text variant="h3-regular" color="primary">${r}</wui-text>
          <wui-text variant="h3-regular" color="secondary">.${a}</wui-text>
          <wui-text variant="h6-medium" color="primary" class="symbol">${s}</wui-text>
        </div>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="2" .padding=${["0","3","3","3"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          .rounded=${!0}
          icon="power"
          iconColor="error"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          .rightIcon=${!1}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=eo.ConstantsUtil.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),t=!!this.features?.receive,o=this.remoteFeatures?.onramp&&e,r=eb.ExchangeController.isPayWithExchangeEnabled();return o||t||r?i.html`
      <wui-list-item
        .rounded=${!0}
        data-testid="w3m-account-default-fund-wallet-button"
        iconVariant="blue"
        icon="dollar"
        ?chevron=${!0}
        @click=${this.handleClickFundWallet.bind(this)}
      >
        <wui-text variant="lg-regular" color="primary">Fund wallet</wui-text>
      </wui-list-item>
    `:null}orderedFeaturesTemplate(){return(this.features?.walletFeaturesOrder||eo.ConstantsUtil.DEFAULT_FEATURES.walletFeaturesOrder).map(e=>{switch(e){case"onramp":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}activityTemplate(){return this.namespace&&this.remoteFeatures?.activity&&eo.ConstantsUtil.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?i.html` <wui-list-item
          .rounded=${!0}
          icon="clock"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="lg-regular" color="primary">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){let e=this.remoteFeatures?.swaps,t=s.ChainController.state.activeChain===ee.ConstantsUtil.CHAIN.EVM;return e&&t?i.html`
      <wui-list-item
        .rounded=${!0}
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="lg-regular" color="primary">Swap</wui-text>
      </wui-list-item>
    `:null}sendTemplate(){let e=this.features?.send,t=s.ChainController.state.activeChain;if(!t)throw Error("SendController:sendTemplate - namespace is required");let o=eo.ConstantsUtil.SEND_SUPPORTED_NAMESPACES.includes(t);return e&&o?i.html`
      <wui-list-item
        .rounded=${!0}
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="lg-regular" color="primary">Send</wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){let e=s.ChainController.state.activeChain;if(!e)throw Error("AuthCardTemplate:authCardTemplate - namespace is required");let t=ei.ConnectorController.getConnectorId(e),o=ei.ConnectorController.getAuthConnector(),{origin:r}=location;return!o||t!==ee.ConstantsUtil.CONNECTOR_ID.AUTH||r.includes(eo.ConstantsUtil.SECURE_SITE)?null:i.html`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickFundWallet(){er.RouterController.push("FundWallet")}handleClickSwap(){er.RouterController.push("Swap")}handleClickSend(){er.RouterController.push("WalletSend")}explorerBtnTemplate(){return s.ChainController.getAccountData()?.addressExplorerUrl?i.html`
      <wui-button size="md" variant="accent-primary" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){F.EventsController.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:(0,eC.getPreferredAccountType)(s.ChainController.state.activeChain)===eI.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}}),er.RouterController.push("Transactions")}async onDisconnect(){try{this.disconnecting=!0;let e=et.ConnectionController.getConnections(this.namespace).length>0,t=this.namespace&&ei.ConnectorController.state.activeConnectorIds[this.namespace],i=this.remoteFeatures?.multiWallet;await et.ConnectionController.disconnect(i?{id:t,namespace:this.namespace}:{}),e&&i&&(er.RouterController.push("ProfileWallets"),en.SnackController.showSuccess("Wallet deleted"))}catch{F.EventsController.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),en.SnackController.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){let e=s.ChainController.getAccountData()?.addressExplorerUrl;e&&c.CoreHelperUtil.openHref(e,"_blank")}onGoToUpgradeView(){F.EventsController.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),er.RouterController.push("UpgradeEmailWallet")}onGoToProfileWalletsView(){er.RouterController.push("ProfileWallets")}};eU.styles=eO,eN([(0,r.state)()],eU.prototype,"caipAddress",void 0),eN([(0,r.state)()],eU.prototype,"address",void 0),eN([(0,r.state)()],eU.prototype,"profileImage",void 0),eN([(0,r.state)()],eU.prototype,"profileName",void 0),eN([(0,r.state)()],eU.prototype,"disconnecting",void 0),eN([(0,r.state)()],eU.prototype,"balance",void 0),eN([(0,r.state)()],eU.prototype,"balanceSymbol",void 0),eN([(0,r.state)()],eU.prototype,"features",void 0),eN([(0,r.state)()],eU.prototype,"remoteFeatures",void 0),eN([(0,r.state)()],eU.prototype,"namespace",void 0),eN([(0,r.state)()],eU.prototype,"activeConnectorIds",void 0),eU=eN([(0,p.customElement)("w3m-account-default-widget")],eU);var eP=t,eD=e.i(770850),eL=t;let eW=g.css`
  span {
    font-weight: 500;
    font-size: 38px;
    color: ${({tokens:e})=>e.theme.textPrimary};
    line-height: 38px;
    letter-spacing: -2%;
    text-align: center;
    font-family: var(--apkt-fontFamily-regular);
  }

  .pennies {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }
`;var ej=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ez=class extends eL.LitElement{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return i.html`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};ez.styles=[m.resetStyles,eW],ej([(0,o.property)()],ez.prototype,"dollars",void 0),ej([(0,o.property)()],ez.prototype,"pennies",void 0),ez=ej([(0,p.customElement)("wui-balance")],ez);var eB=t;let eF=g.css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  /* -- Variants --------------------------------------------------------- */
  :host([data-variant='fill']) {
    background-color: ${({colors:e})=>e.neutrals100};
  }

  :host([data-variant='shade']) {
    background-color: ${({colors:e})=>e.neutrals900};
  }

  :host([data-variant='fill']) > wui-text {
    color: ${({colors:e})=>e.black};
  }

  :host([data-variant='shade']) > wui-text {
    color: ${({colors:e})=>e.white};
  }

  :host([data-variant='fill']) > wui-icon {
    color: ${({colors:e})=>e.neutrals100};
  }

  :host([data-variant='shade']) > wui-icon {
    color: ${({colors:e})=>e.neutrals900};
  }

  /* -- Sizes --------------------------------------------------------- */
  :host([data-size='sm']) {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='md']) {
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  /* -- Placements --------------------------------------------------------- */
  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var e_=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let eH={sm:"sm-regular",md:"md-regular"},eM=class extends eB.LitElement{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.size="md",this.message=""}render(){return this.dataset.variant=this.variant,this.dataset.size=this.size,i.html`<wui-icon data-placement=${this.placement} size="inherit" name="cursor"></wui-icon>
      <wui-text variant=${eH[this.size]}>${this.message}</wui-text>`}};eM.styles=[m.resetStyles,m.elementStyles,eF],e_([(0,o.property)()],eM.prototype,"placement",void 0),e_([(0,o.property)()],eM.prototype,"variant",void 0),e_([(0,o.property)()],eM.prototype,"size",void 0),e_([(0,o.property)()],eM.prototype,"message",void 0),eM=e_([(0,p.customElement)("wui-tooltip")],eM);var eV=e.i(305840),eK=t;e.i(389676);let eq=E.css`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`,eG=class extends eK.LitElement{render(){return i.html`<w3m-activity-list page="account"></w3m-activity-list>`}};eG.styles=eq,eG=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-account-activity-widget")],eG);var eX=t,eY=t;e.i(630352);let eQ=g.css`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({spacing:e})=>e[4]};
    padding: ${({spacing:e})=>e[4]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    max-width: 174px;
  }

  .tag-container {
    width: fit-content;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var eJ=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let eZ=class extends eY.LitElement{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.disabled=!1}render(){return i.html`
      <button ?disabled=${this.disabled}>
        <wui-flex alignItems="center" gap="3">
          <wui-icon-box padding="2" color="secondary" icon=${this.icon} size="lg"></wui-icon-box>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.text}</wui-text>
            ${this.description?i.html`<wui-text variant="md-regular" color="secondary">
                  ${this.description}</wui-text
                >`:null}
          </wui-flex>
        </wui-flex>

        <wui-flex class="tag-container" alignItems="center" gap="1" justifyContent="flex-end">
          ${this.tag?i.html`<wui-tag tagType="main" size="sm">${this.tag}</wui-tag>`:null}
          <wui-icon size="md" name="chevronRight" color="default"></wui-icon>
        </wui-flex>
      </button>
    `}};eZ.styles=[m.resetStyles,m.elementStyles,eQ],eJ([(0,o.property)()],eZ.prototype,"icon",void 0),eJ([(0,o.property)()],eZ.prototype,"text",void 0),eJ([(0,o.property)()],eZ.prototype,"description",void 0),eJ([(0,o.property)()],eZ.prototype,"tag",void 0),eJ([(0,o.property)({type:Boolean})],eZ.prototype,"disabled",void 0),eZ=eJ([(0,p.customElement)("wui-list-description")],eZ),e.i(923838);let e0=E.css`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`;var e3=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let e1=class extends eX.LitElement{constructor(){super(),this.unsubscribe=[],this.tokenBalance=s.ChainController.getAccountData()?.tokenBalance,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{this.tokenBalance=e?.tokenBalance}),u.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`${this.tokenTemplate()}`}tokenTemplate(){return this.tokenBalance&&this.tokenBalance?.length>0?i.html`<wui-flex class="contentContainer" flexDirection="column" gap="2">
        ${this.tokenItemTemplate()}
      </wui-flex>`:i.html` <wui-flex flexDirection="column">
      ${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Scan the QR code and receive funds"
        icon="qrCode"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="w3m-account-receive-button"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){return this.remoteFeatures?.onramp?i.html`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="w3m-account-onramp-button"
      ></wui-list-description>`:i.html``}tokenItemTemplate(){return this.tokenBalance?.map(e=>i.html`<wui-list-token
          tokenName=${e.name}
          tokenImageUrl=${e.iconUrl}
          tokenAmount=${e.quantity.numeric}
          tokenValue=${e.value}
          tokenCurrency=${e.symbol}
        ></wui-list-token>`)}onReceiveClick(){er.RouterController.push("WalletReceive")}onBuyClick(){F.EventsController.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:(0,eC.getPreferredAccountType)(s.ChainController.state.activeChain)===eI.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}}),er.RouterController.push("OnRampProviders")}};e1.styles=e0,e3([(0,r.state)()],e1.prototype,"tokenBalance",void 0),e3([(0,r.state)()],e1.prototype,"remoteFeatures",void 0),e1=e3([(0,p.customElement)("w3m-account-tokens-widget")],e1),e.i(741611),e.i(748449);let e2=g.css`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * ${({spacing:e})=>e["4"]});
  }

  wui-promo + wui-profile-button {
    margin-top: ${({spacing:e})=>e["4"]};
  }

  wui-tabs {
    width: 100%;
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e["3"]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;var e5=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let e4=class extends eP.LitElement{constructor(){super(...arguments),this.unsubscribe=[],this.network=s.ChainController.state.activeCaipNetwork,this.profileName=s.ChainController.getAccountData()?.profileName,this.address=s.ChainController.getAccountData()?.address,this.currentTab=s.ChainController.getAccountData()?.currentTab,this.tokenBalance=s.ChainController.getAccountData()?.tokenBalance,this.features=u.OptionsController.state.features,this.namespace=s.ChainController.state.activeChain,this.activeConnectorIds=ei.ConnectorController.state.activeConnectorIds,this.remoteFeatures=u.OptionsController.state.remoteFeatures}firstUpdated(){s.ChainController.fetchTokenBalance(),this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{e?.address?(this.address=e.address,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):d.ModalController.close()}),ei.ConnectorController.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),s.ChainController.subscribeKey("activeChain",e=>this.namespace=e),s.ChainController.subscribeKey("activeCaipNetwork",e=>this.network=e),u.OptionsController.subscribeKey("features",e=>this.features=e),u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),clearInterval(this.watchTokenBalance)}render(){if(!this.address)throw Error("w3m-account-features-widget: No account provided");if(!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],t=e?ei.ConnectorController.getConnectorById(e):void 0,{icon:o,iconSize:r}=this.getAuthData();return i.html`<wui-flex
      flexDirection="column"
      .padding=${["0","3","4","3"]}
      alignItems="center"
      gap="4"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="2">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${o}
          iconSize=${r}
          alt=${t?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){let e=this.features?.walletFeaturesOrder||eo.ConstantsUtil.DEFAULT_FEATURES.walletFeaturesOrder;if(e.every(e=>"send"===e||"receive"===e?!this.features?.[e]:"swaps"!==e&&"onramp"!==e||!this.remoteFeatures?.[e]))return null;let t=[...new Set(e.map(e=>"receive"===e||"onramp"===e?"fund":e))];return i.html`<wui-flex gap="2">
      ${t.map(e=>{switch(e){case"fund":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}
    </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=eo.ConstantsUtil.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),t=this.features?.receive,o=this.remoteFeatures?.onramp&&e,r=eb.ExchangeController.isPayWithExchangeEnabled();return o||t||r?i.html`
      <w3m-tooltip-trigger text="Fund wallet">
        <wui-button
          data-testid="wallet-features-fund-wallet-button"
          @click=${this.onFundWalletClick.bind(this)}
          variant="accent-secondary"
          size="lg"
          fullWidth
        >
          <wui-icon name="dollar"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `:null}swapsTemplate(){let e=this.remoteFeatures?.swaps,t=s.ChainController.state.activeChain===ee.ConstantsUtil.CHAIN.EVM;return e&&t?i.html`
      <w3m-tooltip-trigger text="Swap">
        <wui-button
          fullWidth
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="recycleHorizontal"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `:null}sendTemplate(){let e=this.features?.send,t=s.ChainController.state.activeChain,o=eo.ConstantsUtil.SEND_SUPPORTED_NAMESPACES.includes(t);return e&&o?i.html`
      <w3m-tooltip-trigger text="Send">
        <wui-button
          fullWidth
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="send"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `:null}watchSwapValues(){this.watchTokenBalance=setInterval(()=>s.ChainController.fetchTokenBalance(e=>this.onTokenBalanceError(e)),1e4)}onTokenBalanceError(e){e instanceof Error&&e.cause instanceof Response&&e.cause.status===ee.ConstantsUtil.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}listContentTemplate(){return 0===this.currentTab?i.html`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:1===this.currentTab?i.html`<w3m-account-activity-widget></w3m-account-activity-widget>`:i.html`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){if(this.tokenBalance&&this.tokenBalance?.length>=0){let e=c.CoreHelperUtil.calculateBalance(this.tokenBalance),{dollars:t="0",pennies:o="00"}=c.CoreHelperUtil.formatTokenBalance(e);return i.html`<wui-balance dollars=${t} pennies=${o}></wui-balance>`}return i.html`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){let e=eV.HelpersUtil.getTabsByNamespace(s.ChainController.state.activeChain);return 0===e.length?null:i.html`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      .tabs=${e}
    ></wui-tabs>`}onTabChange(e){s.ChainController.setAccountProp("currentTab",e,this.namespace)}onFundWalletClick(){er.RouterController.push("FundWallet")}onSwapClick(){this.network?.caipNetworkId&&!eo.ConstantsUtil.SWAP_SUPPORTED_NETWORKS.includes(this.network?.caipNetworkId)?er.RouterController.push("UnsupportedChain",{swapUnsupportedChain:!0}):(F.EventsController.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:(0,eC.getPreferredAccountType)(s.ChainController.state.activeChain)===eI.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}}),er.RouterController.push("Swap"))}getAuthData(){let e=eu.StorageUtil.getConnectedSocialProvider(),t=eu.StorageUtil.getConnectedSocialUsername(),i=ei.ConnectorController.getAuthConnector(),o=i?.provider.getEmail()??"";return{name:eD.ConnectorUtil.getAuthName({email:o,socialUsername:t,socialProvider:e}),icon:e??"mail",iconSize:e?"xl":"md"}}onGoToProfileWalletsView(){er.RouterController.push("ProfileWallets")}onSendClick(){F.EventsController.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:(0,eC.getPreferredAccountType)(s.ChainController.state.activeChain)===eI.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}}),er.RouterController.push("WalletSend")}};e4.styles=e2,e5([(0,r.state)()],e4.prototype,"watchTokenBalance",void 0),e5([(0,r.state)()],e4.prototype,"network",void 0),e5([(0,r.state)()],e4.prototype,"profileName",void 0),e5([(0,r.state)()],e4.prototype,"address",void 0),e5([(0,r.state)()],e4.prototype,"currentTab",void 0),e5([(0,r.state)()],e4.prototype,"tokenBalance",void 0),e5([(0,r.state)()],e4.prototype,"features",void 0),e5([(0,r.state)()],e4.prototype,"namespace",void 0),e5([(0,r.state)()],e4.prototype,"activeConnectorIds",void 0),e5([(0,r.state)()],e4.prototype,"remoteFeatures",void 0),e4=e5([(0,p.customElement)("w3m-account-wallet-features-widget")],e4);var e6=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let e8=class extends eg.LitElement{constructor(){super(),this.unsubscribe=[],this.namespace=s.ChainController.state.activeChain,this.unsubscribe.push(s.ChainController.subscribeKey("activeChain",e=>{this.namespace=e}))}render(){if(!this.namespace)return null;let e=ei.ConnectorController.getConnectorId(this.namespace),t=ei.ConnectorController.getAuthConnector();return i.html`
      ${t&&e===ee.ConstantsUtil.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return i.html`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return i.html`<w3m-account-default-widget></w3m-account-default-widget>`}};e6([(0,r.state)()],e8.prototype,"namespace",void 0),e8=e6([(0,p.customElement)("w3m-account-view")],e8),e.s(["W3mAccountView",()=>e8],979890);var e7=t;e.i(653976);var e9=e.i(293090),te=e.i(150576),tt=e.i(210087),ti=e.i(608601),to=t;e.i(695553),e.i(720226);let tr=g.css`
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    border-radius: ${({borderRadius:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:e})=>e["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var tn=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ta=class extends to.LitElement{constructor(){super(...arguments),this.address="",this.profileName="",this.content=[],this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadge=void 0,this.iconBadgeSize="md",this.buttonVariant="neutral-primary",this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return i.html`
      <wui-flex flexDirection="column" rowgap="2">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return i.html`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?i.html`<wui-icon-link
              variant="secondary"
              size="md"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return i.html` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?i.html`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?i.html`<wui-icon
                  color="accent-primary"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:i.html`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return 0===this.content.length?null:i.html`
      <wui-flex flexDirection="column" rowgap="3">
        ${this.content.map(e=>this.labelAndTagTemplate(e))}
      </wui-flex>
    `}labelAndTagTemplate({address:e,profileName:t,label:o,description:r,enableButton:n,buttonType:a,buttonLabel:l,buttonVariant:s,tagVariant:c,tagLabel:d,alignItems:u="flex-end"}){return i.html`
      <wui-flex justifyContent="space-between" alignItems=${u} columngap="1">
        <wui-flex flexDirection="column" rowgap="01">
          ${o?i.html`<wui-text variant="sm-medium" color="secondary">${o}</wui-text>`:null}

          <wui-flex alignItems="center" columngap="1">
            <wui-text variant="md-regular" color="primary">
              ${w.UiHelperUtil.getTruncateString({string:t||e,charsStart:t?16:this.charsStart,charsEnd:t?0:this.charsEnd,truncate:t?"end":"middle"})}
            </wui-text>

            ${c&&d?i.html`<wui-tag variant=${c} size="sm">${d}</wui-tag>`:null}
          </wui-flex>

          ${r?i.html`<wui-text variant="sm-regular" color="secondary">${r}</wui-text>`:null}
        </wui-flex>

        ${n?this.buttonTemplate({buttonType:a,buttonLabel:l,buttonVariant:s}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:e,buttonLabel:t,buttonVariant:o}){return i.html`
      <wui-button
        size="sm"
        variant=${o}
        @click=${"disconnect"===e?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${"disconnect"===e?"wui-active-profile-wallet-item-disconnect-button":"wui-active-profile-wallet-item-switch-button"}
      >
        ${t}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent("disconnect",{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("switch",{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent("externalLink",{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent("more",{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent("copy",{bubbles:!0,composed:!0}))}};ta.styles=[m.resetStyles,m.elementStyles,tr],tn([(0,o.property)()],ta.prototype,"address",void 0),tn([(0,o.property)()],ta.prototype,"profileName",void 0),tn([(0,o.property)({type:Array})],ta.prototype,"content",void 0),tn([(0,o.property)()],ta.prototype,"alt",void 0),tn([(0,o.property)()],ta.prototype,"imageSrc",void 0),tn([(0,o.property)()],ta.prototype,"icon",void 0),tn([(0,o.property)()],ta.prototype,"iconSize",void 0),tn([(0,o.property)()],ta.prototype,"iconBadge",void 0),tn([(0,o.property)()],ta.prototype,"iconBadgeSize",void 0),tn([(0,o.property)()],ta.prototype,"buttonVariant",void 0),tn([(0,o.property)({type:Boolean})],ta.prototype,"enableMoreButton",void 0),tn([(0,o.property)({type:Number})],ta.prototype,"charsStart",void 0),tn([(0,o.property)({type:Number})],ta.prototype,"charsEnd",void 0),ta=tn([(0,p.customElement)("wui-active-profile-wallet-item")],ta),e.i(746650);var tl=t;let ts=g.css`
  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:e})=>e["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var tc=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let td=class extends tl.LitElement{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.buttonLabel="",this.buttonVariant="accent-primary",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadgeSize="md",this.rightIcon="signOut",this.rightIconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return i.html`
      <wui-flex alignItems="center" columngap="2">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?i.html`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?i.html`<wui-icon
                  color="default"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:i.html`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return i.html`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="lg-regular" color="primary">
          ${w.UiHelperUtil.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return i.html`
      <wui-flex columngap="1" alignItems="center" justifyContent="center">
        <wui-button
          size="sm"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          variant="secondary"
          size="md"
          icon=${(0,n.ifDefined)(this.rightIcon)}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent("buttonClick",{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent("iconClick",{bubbles:!0,composed:!0}))}};td.styles=[m.resetStyles,m.elementStyles,ts],tc([(0,o.property)()],td.prototype,"address",void 0),tc([(0,o.property)()],td.prototype,"profileName",void 0),tc([(0,o.property)()],td.prototype,"alt",void 0),tc([(0,o.property)()],td.prototype,"buttonLabel",void 0),tc([(0,o.property)()],td.prototype,"buttonVariant",void 0),tc([(0,o.property)()],td.prototype,"imageSrc",void 0),tc([(0,o.property)()],td.prototype,"icon",void 0),tc([(0,o.property)()],td.prototype,"iconSize",void 0),tc([(0,o.property)()],td.prototype,"iconBadge",void 0),tc([(0,o.property)()],td.prototype,"iconBadgeSize",void 0),tc([(0,o.property)()],td.prototype,"rightIcon",void 0),tc([(0,o.property)()],td.prototype,"rightIconSize",void 0),tc([(0,o.property)({type:Boolean})],td.prototype,"loading",void 0),tc([(0,o.property)({type:Number})],td.prototype,"charsStart",void 0),tc([(0,o.property)({type:Number})],td.prototype,"charsEnd",void 0),td=tc([(0,p.customElement)("wui-inactive-profile-wallet-item")],td),e.i(79929);var tu=e.i(769718);let tp={getAuthData(e){let t=e.connectorId===ee.ConstantsUtil.CONNECTOR_ID.AUTH;if(!t)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};let i=e?.auth?.name??eu.StorageUtil.getConnectedSocialProvider(),o=e?.auth?.username??eu.StorageUtil.getConnectedSocialUsername(),r=ei.ConnectorController.getAuthConnector(),n=r?.provider.getEmail()??"";return{isAuth:!0,icon:i??"mail",iconSize:i?"xl":"md",name:t?eD.ConnectorUtil.getAuthName({email:n,socialUsername:o,socialProvider:i}):void 0}}},th=g.css`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
  }

  .balance-amount {
    flex: 1;
  }

  .wallet-list {
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: opacity;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
      black 40px,
      black calc(100% - 40px),
      rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
    );
  }

  .active-wallets {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: ${({spacing:e})=>e["4"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
  }

  wui-separator {
    margin: ${({spacing:e})=>e["2"]} 0 ${({spacing:e})=>e["2"]} 0;
  }

  .active-connection {
    padding: ${({spacing:e})=>e["2"]};
  }

  .recent-connection {
    padding: ${({spacing:e})=>e["2"]} 0 ${({spacing:e})=>e["2"]} 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`;var tm=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tw=4,tg=6,tf="md",tb="lightbulb",tC=[0,1],ty={eip155:"ethereum",solana:"solana",bip122:"bitcoin",ton:"ton"},tv=[{namespace:"eip155",icon:ty.eip155,label:"EVM"},{namespace:"solana",icon:ty.solana,label:"Solana"},{namespace:"bip122",icon:ty.bip122,label:"Bitcoin"},{namespace:"ton",icon:ty.ton,label:"Ton"}],tx={eip155:{title:"Add EVM Wallet",description:"Add your first EVM wallet"},solana:{title:"Add Solana Wallet",description:"Add your first Solana wallet"},bip122:{title:"Add Bitcoin Wallet",description:"Add your first Bitcoin wallet"},ton:{title:"Add TON Wallet",description:"Add your first TON wallet"}},t$=class extends e7.LitElement{constructor(){super(),this.unsubscribers=[],this.currentTab=0,this.namespace=s.ChainController.state.activeChain,this.namespaces=Array.from(s.ChainController.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=ei.ConnectorController.state.activeConnectorIds,this.lastSelectedAddress="",this.lastSelectedConnectorId="",this.isSwitching=!1,this.caipNetwork=s.ChainController.state.activeCaipNetwork,this.user=s.ChainController.getAccountData()?.user,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=s.ChainController.getAccountData(this.namespace)?.caipAddress,this.profileName=s.ChainController.getAccountData(this.namespace)?.profileName,this.unsubscribers.push(et.ConnectionController.subscribeKey("connections",()=>this.onConnectionsChange()),et.ConnectionController.subscribeKey("recentConnections",()=>this.requestUpdate()),ei.ConnectorController.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),s.ChainController.subscribeKey("activeCaipNetwork",e=>this.caipNetwork=e),s.ChainController.subscribeChainProp("accountState",e=>{this.user=e?.user}),u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.chainListener=s.ChainController.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName},this.namespace)}disconnectedCallback(){this.unsubscribers.forEach(e=>e()),this.resizeObserver?.disconnect(),this.removeScrollListener(),this.chainListener?.()}firstUpdated(){let e=this.shadowRoot?.querySelector(".wallet-list");if(!e)return;let t=()=>this.updateScrollOpacity(e);requestAnimationFrame(t),e.addEventListener("scroll",t),this.resizeObserver=new ResizeObserver(t),this.resizeObserver.observe(e),t()}render(){let e=this.namespace;if(!e)throw Error("Namespace is not set");return i.html`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="4">
        ${this.renderTabs()} ${this.renderHeader(e)} ${this.renderConnections(e)}
        ${this.renderAddConnectionButton(e)}
      </wui-flex>
    `}renderTabs(){let e=this.namespaces.map(e=>tv.find(t=>t.namespace===e)).filter(Boolean);return e.length>1?i.html`
        <wui-tabs
          .onTabChange=${e=>this.handleTabChange(e)}
          .activeTab=${this.currentTab}
          .tabs=${e}
        ></wui-tabs>
      `:null}renderHeader(e){let t=this.getActiveConnections(e).flatMap(({accounts:e})=>e).length+ +!!this.caipAddress;return i.html`
      <wui-flex alignItems="center" columngap="1">
        <wui-icon
          size="sm"
          name=${ty[e]??ty.eip155}
        ></wui-icon>
        <wui-text color="secondary" variant="lg-regular"
          >${t>1?"Wallets":"Wallet"}</wui-text
        >
        <wui-text
          color="primary"
          variant="lg-regular"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${t}
        </wui-text>
        <wui-link
          color="secondary"
          variant="secondary"
          @click=${()=>et.ConnectionController.disconnect({namespace:e})}
          ?disabled=${!this.hasAnyConnections(e)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(e){let t=this.hasAnyConnections(e);return i.html`
      <wui-flex flexDirection="column" class=${(0,e9.classMap)({"wallet-list":!0,"active-wallets-box":t,"empty-wallet-list-box":!t})} rowgap="3">
        ${t?this.renderActiveConnections(e):this.renderEmptyState(e)}
      </wui-flex>
    `}renderActiveConnections(e){let t=this.getActiveConnections(e),o=this.activeConnectorIds[e],r=this.getPlainAddress();return i.html`
      ${r||o||t.length>0?i.html`<wui-flex
            flexDirection="column"
            .padding=${["4","0","4","0"]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(e)} ${this.renderActiveConnectionsList(e)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(e)}
    `}renderActiveProfile(e){let t=this.activeConnectorIds[e];if(!t)return null;let{connections:o}=tt.ConnectionControllerUtil.getConnectionsData(e),r=ei.ConnectorController.getConnectorById(t),n=l.AssetUtil.getConnectorImage(r),a=this.getPlainAddress();if(!a)return null;let s=e===ee.ConstantsUtil.CHAIN.BITCOIN,c=tp.getAuthData({connectorId:t,accounts:[]}),d=this.getActiveConnections(e).flatMap(e=>e.accounts).length>0,u=o.find(e=>e.connectorId===t),p=u?.accounts.filter(e=>!tu.HelpersUtil.isLowerCaseMatch(e.address,a));return i.html`
      <wui-flex flexDirection="column" .padding=${["0","4","0","4"]}>
        <wui-active-profile-wallet-item
          address=${a}
          alt=${r?.name}
          .content=${this.getProfileContent({address:a,connections:o,connectorId:t,namespace:e})}
          .charsStart=${tw}
          .charsEnd=${tg}
          .icon=${c.icon}
          .iconSize=${c.iconSize}
          .iconBadge=${this.isSmartAccount(a)?tb:void 0}
          .iconBadgeSize=${this.isSmartAccount(a)?tf:void 0}
          imageSrc=${n}
          ?enableMoreButton=${c.isAuth}
          @copy=${()=>this.handleCopyAddress(a)}
          @disconnect=${()=>this.handleDisconnect(e,t)}
          @switch=${()=>{s&&u&&p?.[0]&&this.handleSwitchWallet(u,p[0].address,e)}}
          @externalLink=${()=>this.handleExternalLink(a)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${d?i.html`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(e){let t=this.getActiveConnections(e);return 0===t.length?null:i.html`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
        ${this.renderConnectionList(t,!1,e)}
      </wui-flex>
    `}renderRecentConnections(e){let{recentConnections:t}=tt.ConnectionControllerUtil.getConnectionsData(e);return 0===t.flatMap(e=>e.accounts).length?null:i.html`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]} rowGap="2">
        <wui-text color="secondary" variant="sm-medium" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
          ${this.renderConnectionList(t,!0,e)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(e,t,o){return e.filter(e=>e.accounts.length>0).map((e,r)=>{let n=ei.ConnectorController.getConnectorById(e.connectorId),a=l.AssetUtil.getConnectorImage(n)??"",s=tp.getAuthData(e);return e.accounts.map((n,l)=>{let c=this.isAccountLoading(e.connectorId,n.address);return i.html`
            <wui-flex flexDirection="column">
              ${0!==r||0!==l?i.html`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${n.address}
                alt=${e.connectorId}
                buttonLabel=${t?"Connect":"Switch"}
                buttonVariant=${t?"neutral-secondary":"accent-secondary"}
                rightIcon=${t?"bin":"power"}
                rightIconSize="sm"
                class=${t?"recent-connection":"active-connection"}
                data-testid=${t?"recent-connection":"active-connection"}
                imageSrc=${a}
                .iconBadge=${this.isSmartAccount(n.address)?tb:void 0}
                .iconBadgeSize=${this.isSmartAccount(n.address)?tf:void 0}
                .icon=${s.icon}
                .iconSize=${s.iconSize}
                .loading=${c}
                .showBalance=${!1}
                .charsStart=${tw}
                .charsEnd=${tg}
                @buttonClick=${()=>this.handleSwitchWallet(e,n.address,o)}
                @iconClick=${()=>this.handleWalletAction({connection:e,address:n.address,isRecentConnection:t,namespace:o})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(e){if(!this.isMultiWalletEnabled()&&this.caipAddress||!this.hasAnyConnections(e))return null;let{title:t}=this.getChainLabelInfo(e);return i.html`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(e)}
        data-testid="add-connection-button"
      >
        <wui-text variant="md-medium" color="secondary">${t}</wui-text>
      </wui-list-item>
    `}renderEmptyState(e){let{title:t,description:o}=this.getChainLabelInfo(e);return i.html`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowgap="3"
          class="empty-box"
        >
          <wui-icon-box size="xl" icon="wallet" color="secondary"></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="1">
            <wui-text color="primary" variant="lg-regular" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="secondary" variant="md-regular" data-testid="empty-state-description"
              >${o}</wui-text
            >
          </wui-flex>

          <wui-link
            @click=${()=>this.handleAddConnection(e)}
            data-testid="empty-state-button"
            icon="plus"
          >
            ${t}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(e){let t=this.namespaces[e];t&&(this.chainListener?.(),this.currentTab=this.namespaces.indexOf(t),this.namespace=t,this.caipAddress=s.ChainController.getAccountData(t)?.caipAddress,this.profileName=s.ChainController.getAccountData(t)?.profileName,this.chainListener=s.ChainController.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},t))}async handleSwitchWallet(e,t,i){try{this.isSwitching=!0,this.lastSelectedConnectorId=e.connectorId,this.lastSelectedAddress=t,this.caipNetwork?.chainNamespace!==i&&e?.caipNetwork&&(ei.ConnectorController.setFilterByNamespace(i),await s.ChainController.switchActiveNetwork(e?.caipNetwork)),await et.ConnectionController.switchConnection({connection:e,address:t,namespace:i,closeModalOnConnect:!1,onChange({hasSwitchedAccount:e,hasSwitchedWallet:t}){t?en.SnackController.showSuccess("Wallet switched"):e&&en.SnackController.showSuccess("Account switched")}})}catch(e){en.SnackController.showError("Failed to switch wallet")}finally{this.isSwitching=!1}}handleWalletAction(e){let{connection:t,address:i,isRecentConnection:o,namespace:r}=e;o?(eu.StorageUtil.deleteAddressFromConnection({connectorId:t.connectorId,address:i,namespace:r}),et.ConnectionController.syncStorageConnections(),en.SnackController.showSuccess("Wallet deleted")):this.handleDisconnect(r,t.connectorId)}async handleDisconnect(e,t){try{await et.ConnectionController.disconnect({id:t,namespace:e}),en.SnackController.showSuccess("Wallet disconnected")}catch{en.SnackController.showError("Failed to disconnect wallet")}}handleCopyAddress(e){c.CoreHelperUtil.copyToClopboard(e),en.SnackController.showSuccess("Address copied")}handleMore(){er.RouterController.push("AccountSettings")}handleExternalLink(e){let t=this.caipNetwork?.blockExplorers?.default.url;t&&c.CoreHelperUtil.openHref(`${t}/address/${e}`,"_blank")}handleAddConnection(e){ei.ConnectorController.setFilterByNamespace(e),er.RouterController.push("Connect",{addWalletForNamespace:e})}getChainLabelInfo(e){return tx[e]??{title:"Add Wallet",description:"Add your first wallet"}}isSmartAccount(e){if(!this.namespace)return!1;let t=this.user?.accounts?.find(e=>"smartAccount"===e.type);return!!t&&!!e&&tu.HelpersUtil.isLowerCaseMatch(t.address,e)}getPlainAddress(){return this.caipAddress?c.CoreHelperUtil.getPlainAddress(this.caipAddress):void 0}getActiveConnections(e){let t=this.activeConnectorIds[e],{connections:i}=tt.ConnectionControllerUtil.getConnectionsData(e),[o]=i.filter(e=>tu.HelpersUtil.isLowerCaseMatch(e.connectorId,t));if(!t)return i;let r=e===ee.ConstantsUtil.CHAIN.BITCOIN,{address:n}=this.caipAddress?te.ParseUtil.parseCaipAddress(this.caipAddress):{},a=[...n?[n]:[]];return r&&o&&(a=o.accounts.map(e=>e.address)||[]),tt.ConnectionControllerUtil.excludeConnectorAddressFromConnections({connectorId:t,addresses:a,connections:i})}hasAnyConnections(e){let t=this.getActiveConnections(e),{recentConnections:i}=tt.ConnectionControllerUtil.getConnectionsData(e);return!!this.caipAddress||t.length>0||i.length>0}isAccountLoading(e,t){return tu.HelpersUtil.isLowerCaseMatch(this.lastSelectedConnectorId,e)&&tu.HelpersUtil.isLowerCaseMatch(this.lastSelectedAddress,t)&&this.isSwitching}getProfileContent(e){let{address:t,connections:i,connectorId:o,namespace:r}=e,[n]=i.filter(e=>tu.HelpersUtil.isLowerCaseMatch(e.connectorId,o));if(r===ee.ConstantsUtil.CHAIN.BITCOIN&&n?.accounts.every(e=>"string"==typeof e.type))return this.getBitcoinProfileContent(n.accounts,t);let a=tp.getAuthData({connectorId:o,accounts:[]});return[{address:t,tagLabel:"Active",tagVariant:"success",enableButton:!0,profileName:this.profileName,buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary",...a.isAuth?{description:this.isSmartAccount(t)?"Smart Account":"EOA Account"}:{}}]}getBitcoinProfileContent(e,t){let i=e.length>1,o=this.getPlainAddress();return e.map(e=>{let r=tu.HelpersUtil.isLowerCaseMatch(e.address,o),n="PAYMENT";return"ordinal"===e.type&&(n="ORDINALS"),{address:e.address,tagLabel:tu.HelpersUtil.isLowerCaseMatch(e.address,t)?"Active":void 0,tagVariant:tu.HelpersUtil.isLowerCaseMatch(e.address,t)?"success":void 0,enableButton:!0,...i?{label:n,alignItems:"flex-end",buttonType:r?"disconnect":"switch",buttonLabel:r?"Disconnect":"Switch",buttonVariant:r?"neutral-secondary":"accent-secondary"}:{alignItems:"center",buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary"}}})}removeScrollListener(){let e=this.shadowRoot?.querySelector(".wallet-list");e&&e.removeEventListener("scroll",()=>this.handleConnectListScroll())}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(".wallet-list");e&&this.updateScrollOpacity(e)}isMultiWalletEnabled(){return!!this.remoteFeatures?.multiWallet}updateScrollOpacity(e){e.style.setProperty("--connect-scroll--top-opacity",ti.MathUtil.interpolate([0,50],tC,e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",ti.MathUtil.interpolate([0,50],tC,e.scrollHeight-e.scrollTop-e.offsetHeight).toString())}onConnectionsChange(){if(this.isMultiWalletEnabled()&&this.namespace){let{connections:e}=tt.ConnectionControllerUtil.getConnectionsData(this.namespace);0===e.length&&er.RouterController.reset("ProfileWallets")}this.requestUpdate()}};t$.styles=th,tm([(0,r.state)()],t$.prototype,"currentTab",void 0),tm([(0,r.state)()],t$.prototype,"namespace",void 0),tm([(0,r.state)()],t$.prototype,"namespaces",void 0),tm([(0,r.state)()],t$.prototype,"caipAddress",void 0),tm([(0,r.state)()],t$.prototype,"profileName",void 0),tm([(0,r.state)()],t$.prototype,"activeConnectorIds",void 0),tm([(0,r.state)()],t$.prototype,"lastSelectedAddress",void 0),tm([(0,r.state)()],t$.prototype,"lastSelectedConnectorId",void 0),tm([(0,r.state)()],t$.prototype,"isSwitching",void 0),tm([(0,r.state)()],t$.prototype,"caipNetwork",void 0),tm([(0,r.state)()],t$.prototype,"user",void 0),tm([(0,r.state)()],t$.prototype,"remoteFeatures",void 0),t$=tm([(0,p.customElement)("w3m-profile-wallets-view")],t$),e.s(["W3mProfileWalletsView",()=>t$],674950);var tk=t,tE=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tS=class extends tk.LitElement{constructor(){super(),this.unsubscribe=[],this.activeCaipNetwork=s.ChainController.state.activeCaipNetwork,this.features=u.OptionsController.state.features,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.exchangesLoading=eb.ExchangeController.state.isLoading,this.exchanges=eb.ExchangeController.state.exchanges,this.unsubscribe.push(u.OptionsController.subscribeKey("features",e=>this.features=e),u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),s.ChainController.subscribeKey("activeCaipNetwork",e=>{this.activeCaipNetwork=e,this.setDefaultPaymentAsset()}),eb.ExchangeController.subscribeKey("isLoading",e=>this.exchangesLoading=e),eb.ExchangeController.subscribeKey("exchanges",e=>this.exchanges=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){eb.ExchangeController.isPayWithExchangeSupported()&&(await this.setDefaultPaymentAsset(),await eb.ExchangeController.fetchExchanges())}render(){return i.html`
      <wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="2">
        ${this.onrampTemplate()} ${this.receiveTemplate()} ${this.depositFromExchangeTemplate()}
      </wui-flex>
    `}async setDefaultPaymentAsset(){if(!this.activeCaipNetwork)return;let e=await eb.ExchangeController.getAssetsForNetwork(this.activeCaipNetwork.caipNetworkId),t=e.find(e=>"USDC"===e.metadata.symbol)||e[0];t&&eb.ExchangeController.setPaymentAsset(t)}onrampTemplate(){if(!this.activeCaipNetwork)return null;let e=this.remoteFeatures?.onramp,t=eo.ConstantsUtil.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.activeCaipNetwork.chainNamespace);return e&&t?i.html`
      <wui-list-item
        @click=${this.onBuyCrypto.bind(this)}
        icon="card"
        data-testid="wallet-features-onramp-button"
      >
        <wui-text variant="lg-regular" color="primary">Buy crypto</wui-text>
      </wui-list-item>
    `:null}depositFromExchangeTemplate(){return this.activeCaipNetwork&&eb.ExchangeController.isPayWithExchangeSupported()?i.html`
      <wui-list-item
        @click=${this.onDepositFromExchange.bind(this)}
        icon="arrowBottomCircle"
        data-testid="wallet-features-deposit-from-exchange-button"
        ?loading=${this.exchangesLoading}
        ?disabled=${this.exchangesLoading||!this.exchanges.length}
      >
        <wui-text variant="lg-regular" color="primary">Deposit from exchange</wui-text>
      </wui-list-item>
    `:null}receiveTemplate(){return this.features?.receive?i.html`
      <wui-list-item
        @click=${this.onReceive.bind(this)}
        icon="qrCode"
        data-testid="wallet-features-receive-button"
      >
        <wui-text variant="lg-regular" color="primary">Receive funds</wui-text>
      </wui-list-item>
    `:null}onBuyCrypto(){er.RouterController.push("OnRampProviders")}onReceive(){er.RouterController.push("WalletReceive")}onDepositFromExchange(){eb.ExchangeController.reset(),er.RouterController.push("PayWithExchange",{redirectView:er.RouterController.state.data?.redirectView})}};tE([(0,r.state)()],tS.prototype,"activeCaipNetwork",void 0),tE([(0,r.state)()],tS.prototype,"features",void 0),tE([(0,r.state)()],tS.prototype,"remoteFeatures",void 0),tE([(0,r.state)()],tS.prototype,"exchangesLoading",void 0),tE([(0,r.state)()],tS.prototype,"exchanges",void 0),tS=tE([(0,p.customElement)("w3m-fund-wallet-view")],tS),e.s(["W3mFundWalletView",()=>tS],107337);var tA=t,tR=t,tT=t;e.i(684326);var tI=e.i(765090);let tO=g.css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`;var tN=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tU=class extends tT.LitElement{constructor(){super(...arguments),this.inputElementRef=(0,tI.createRef)(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return i.html`
      <label data-size=${this.size}>
        <input
          ${(0,tI.ref)(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};tU.styles=[m.resetStyles,m.elementStyles,tO],tN([(0,o.property)({type:Boolean})],tU.prototype,"checked",void 0),tN([(0,o.property)({type:Boolean})],tU.prototype,"disabled",void 0),tN([(0,o.property)()],tU.prototype,"size",void 0),tU=tN([(0,p.customElement)("wui-toggle")],tU);let tP=g.css`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["3"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["4"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var tD=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tL=class extends tR.LitElement{constructor(){super(...arguments),this.checked=!1}render(){return i.html`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};tL.styles=[m.resetStyles,m.elementStyles,tP],tD([(0,o.property)({type:Boolean})],tL.prototype,"checked",void 0),tL=tD([(0,p.customElement)("wui-certified-switch")],tL);var tW=t;e.i(835902);let tj=g.css`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`;var tz=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tB=class extends tW.LitElement{constructor(){super(...arguments),this.inputComponentRef=(0,tI.createRef)(),this.inputValue=""}render(){return i.html`
      <wui-input-text
        ${(0,tI.ref)(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?i.html`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){let e=this.inputComponentRef.value,t=e?.inputElementRef.value;t&&(t.value="",this.inputValue="",t.focus(),t.dispatchEvent(new Event("input")))}};tB.styles=[m.resetStyles,tj],tz([(0,o.property)()],tB.prototype,"inputValue",void 0),tB=tz([(0,p.customElement)("wui-search-bar")],tB);var tF=t,t_=e.i(886259),tH=e.i(197730),tM=t,tV=e.i(252157);e.i(864576);let tK=g.css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var tq=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tG=class extends tM.LitElement{constructor(){super(...arguments),this.type="wallet"}render(){return i.html`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?i.html` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${tV.networkSvgMd}`:i.html`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};tG.styles=[m.resetStyles,m.elementStyles,tK],tq([(0,o.property)()],tG.prototype,"type",void 0),tG=tq([(0,p.customElement)("wui-card-select-loader")],tG);var tX=t;let tY=E.css`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var tQ=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let tJ=class extends tX.LitElement{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&w.UiHelperUtil.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&w.UiHelperUtil.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&w.UiHelperUtil.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&w.UiHelperUtil.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&w.UiHelperUtil.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&w.UiHelperUtil.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&w.UiHelperUtil.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&w.UiHelperUtil.getSpacingStyles(this.margin,3)};
    `,i.html`<slot></slot>`}};tJ.styles=[m.resetStyles,tY],tQ([(0,o.property)()],tJ.prototype,"gridTemplateRows",void 0),tQ([(0,o.property)()],tJ.prototype,"gridTemplateColumns",void 0),tQ([(0,o.property)()],tJ.prototype,"justifyItems",void 0),tQ([(0,o.property)()],tJ.prototype,"alignItems",void 0),tQ([(0,o.property)()],tJ.prototype,"justifyContent",void 0),tQ([(0,o.property)()],tJ.prototype,"alignContent",void 0),tQ([(0,o.property)()],tJ.prototype,"columnGap",void 0),tQ([(0,o.property)()],tJ.prototype,"rowGap",void 0),tQ([(0,o.property)()],tJ.prototype,"gap",void 0),tQ([(0,o.property)()],tJ.prototype,"padding",void 0),tQ([(0,o.property)()],tJ.prototype,"margin",void 0),tJ=tQ([(0,p.customElement)("wui-grid")],tJ);var tZ=t;e.i(780313),e.i(956303);let t0=g.css`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["0"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e["4"]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var t3=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let t1=class extends tZ.LitElement{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let e=this.wallet?.badge_type==="certified";return i.html`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${(0,n.ifDefined)(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?i.html`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return(this.visible||this.imageSrc)&&!this.imageLoading?i.html`
      <wui-wallet-image
        size="lg"
        imageSrc=${(0,n.ifDefined)(this.imageSrc)}
        name=${(0,n.ifDefined)(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `:this.shimmerTemplate()}shimmerTemplate(){return i.html`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){!this.wallet||(this.imageSrc=l.AssetUtil.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await l.AssetUtil.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){this.wallet&&!this.isImpressed&&(this.isImpressed=!0,F.EventsController.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:er.RouterController.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};t1.styles=t0,t3([(0,r.state)()],t1.prototype,"visible",void 0),t3([(0,r.state)()],t1.prototype,"imageSrc",void 0),t3([(0,r.state)()],t1.prototype,"imageLoading",void 0),t3([(0,r.state)()],t1.prototype,"isImpressed",void 0),t3([(0,o.property)()],t1.prototype,"explorerId",void 0),t3([(0,o.property)()],t1.prototype,"walletQuery",void 0),t3([(0,o.property)()],t1.prototype,"certified",void 0),t3([(0,o.property)()],t1.prototype,"displayIndex",void 0),t3([(0,o.property)({type:Object})],t1.prototype,"wallet",void 0),t1=t3([(0,p.customElement)("w3m-all-wallets-list-item")],t1);let t2=g.css`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:e})=>e["4"]};
    padding-bottom: ${({spacing:e})=>e["4"]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var t5=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let t4="local-paginator",t6=class extends tF.LitElement{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!t_.ApiController.state.wallets.length,this.wallets=t_.ApiController.state.wallets,this.mobileFullScreen=u.OptionsController.state.enableMobileFullScreen,this.unsubscribe.push(t_.ApiController.subscribeKey("wallets",e=>this.wallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),i.html`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let e=this.shadowRoot?.querySelector("wui-grid");e&&(await t_.ApiController.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map(()=>i.html`
        <wui-card-select-loader type="wallet" id=${(0,n.ifDefined)(t)}></wui-card-select-loader>
      `)}walletsTemplate(){return tH.WalletUtil.getWalletConnectWallets(this.wallets).map((e,t)=>i.html`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${"certified"===this.badge}
          displayIndex=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:e,recommended:t,featured:i,count:o,mobileFilteredOutWalletsLength:r}=t_.ApiController.state,n=window.innerWidth<352?3:4,a=e.length+t.length,l=Math.ceil(a/n)*n-a+n;return(l-=e.length?i.length%n:0,0===o&&i.length>0)?null:0===o||[...i,...e,...t].length<o-(r??0)?this.shimmerTemplate(l,t4):null}createPaginationObserver(){let e=this.shadowRoot?.querySelector(`#${t4}`);e&&(this.paginationObserver=new IntersectionObserver(([e])=>{if(e?.isIntersecting&&!this.loading){let{page:e,count:t,wallets:i}=t_.ApiController.state;i.length<t&&t_.ApiController.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){ei.ConnectorController.selectWalletConnector(e)}};t6.styles=t2,t5([(0,r.state)()],t6.prototype,"loading",void 0),t5([(0,r.state)()],t6.prototype,"wallets",void 0),t5([(0,r.state)()],t6.prototype,"badge",void 0),t5([(0,r.state)()],t6.prototype,"mobileFullScreen",void 0),t6=t5([(0,p.customElement)("w3m-all-wallets-list")],t6);var t8=t;e.i(421147);let t7=E.css`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var t9=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ie=class extends t8.LitElement{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=u.OptionsController.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?i.html`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await t_.ApiController.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:e}=t_.ApiController.state,t=tH.WalletUtil.markWalletsAsInstalled(e),o=tH.WalletUtil.filterWalletsByWcSupport(t);return o.length?i.html`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${o.map((e,t)=>i.html`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
              explorerId=${e.id}
              certified=${"certified"===this.badge}
              walletQuery=${this.query}
              displayIndex=${t}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:i.html`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){ei.ConnectorController.selectWalletConnector(e)}};ie.styles=t7,t9([(0,r.state)()],ie.prototype,"loading",void 0),t9([(0,r.state)()],ie.prototype,"mobileFullScreen",void 0),t9([(0,o.property)()],ie.prototype,"query",void 0),t9([(0,o.property)()],ie.prototype,"badge",void 0),ie=t9([(0,p.customElement)("w3m-all-wallets-search")],ie);var it=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ii=class extends tA.LitElement{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=c.CoreHelperUtil.debounce(e=>{this.search=e})}render(){let e=this.search.length>=2;return i.html`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${"certified"===this.badge}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?i.html`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:i.html`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",en.SnackController.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return c.CoreHelperUtil.isMobile()?i.html`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){er.RouterController.push("ConnectingWalletConnect")}};it([(0,r.state)()],ii.prototype,"search",void 0),it([(0,r.state)()],ii.prototype,"badge",void 0),ii=it([(0,p.customElement)("w3m-all-wallets-view")],ii),e.s(["W3mAllWalletsView",()=>ii],210149);var io=t,ir=e.i(455587),ia=t;let il=g.css`
  button {
    display: flex;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[4]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    justify-content: center;
    align-items: center;
  }

  :host([data-size='sm']) button {
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='md']) button {
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var is=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ic=class extends ia.LitElement{constructor(){super(...arguments),this.text="",this.disabled=!1,this.size="lg",this.icon="copy",this.tabIdx=void 0}render(){this.dataset.size=this.size;let e=`${this.size}-regular`;return i.html`
      <button ?disabled=${this.disabled} tabindex=${(0,n.ifDefined)(this.tabIdx)}>
        <wui-icon name=${this.icon} size=${this.size} color="default"></wui-icon>
        <wui-text align="center" variant=${e} color="primary">${this.text}</wui-text>
      </button>
    `}};ic.styles=[m.resetStyles,m.elementStyles,il],is([(0,o.property)()],ic.prototype,"text",void 0),is([(0,o.property)({type:Boolean})],ic.prototype,"disabled",void 0),is([(0,o.property)()],ic.prototype,"size",void 0),is([(0,o.property)()],ic.prototype,"icon",void 0),is([(0,o.property)()],ic.prototype,"tabIdx",void 0),ic=is([(0,p.customElement)("wui-list-button")],ic),e.i(803596);var id=e.i(16555),iu=t,ip=e.i(851887);e.i(39299);var ih=e.i(535568);let im=g.css`
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: ${({spacing:e})=>e["2"]};
  }

  wui-loading-spinner {
    right: ${({spacing:e})=>e["3"]};
  }

  wui-text {
    margin: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["3"]}
      ${({spacing:e})=>e["0"]} ${({spacing:e})=>e["3"]};
  }
`;var iw=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ig=class extends iu.LitElement{constructor(){super(),this.unsubscribe=[],this.formRef=(0,tI.createRef)(),this.email="",this.loading=!1,this.error="",this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.hasExceededUsageLimit=t_.ApiController.state.plan.hasExceededUsageLimit,this.unsubscribe.push(u.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}),t_.ApiController.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{"Enter"===e.key&&this.onSubmitEmail(e)})}render(){let e=et.ConnectionController.hasAnyConnection(ee.ConstantsUtil.CONNECTOR_ID.AUTH);return i.html`
      <form ${(0,tI.ref)(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${(0,n.ifDefined)(this.tabIdx)}
          ?disabled=${e||this.hasExceededUsageLimit}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?i.html`
          <wui-icon-link
            size="lg"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?i.html`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:null}templateError(){return this.error?i.html`<wui-text variant="sm-medium" color="error">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=""}async onSubmitEmail(e){if(!eV.HelpersUtil.isValidEmail(this.email))return void ip.AlertController.open({displayMessage:ih.ErrorUtil.ALERT_WARNINGS.INVALID_EMAIL.displayMessage},"warning");if(!ee.ConstantsUtil.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===s.ChainController.state.activeChain)){let e=s.ChainController.getFirstCaipNetworkSupportsAuthConnector();if(e)return void er.RouterController.push("SwitchNetwork",{network:e})}try{if(this.loading)return;this.loading=!0,e.preventDefault();let t=ei.ConnectorController.getAuthConnector();if(!t)throw Error("w3m-email-login-widget: Auth connector not found");let{action:i}=await t.provider.connectEmail({email:this.email});if(F.EventsController.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),"VERIFY_OTP"===i)F.EventsController.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),er.RouterController.push("EmailVerifyOtp",{email:this.email});else if("VERIFY_DEVICE"===i)er.RouterController.push("EmailVerifyDevice",{email:this.email});else if("CONNECT"===i){let e=this.remoteFeatures?.multiWallet;await et.ConnectionController.connectExternal(t,s.ChainController.state.activeChain),e?(er.RouterController.replace("ProfileWallets"),en.SnackController.showSuccess("New Wallet Added")):er.RouterController.replace("Account")}}catch(t){let e=c.CoreHelperUtil.parseError(t);e?.includes("Invalid email")?this.error="Invalid email. Try again.":en.SnackController.showError(t)}finally{this.loading=!1}}onFocusEvent(){F.EventsController.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};ig.styles=im,iw([(0,o.property)()],ig.prototype,"tabIdx",void 0),iw([(0,r.state)()],ig.prototype,"email",void 0),iw([(0,r.state)()],ig.prototype,"loading",void 0),iw([(0,r.state)()],ig.prototype,"error",void 0),iw([(0,r.state)()],ig.prototype,"remoteFeatures",void 0),iw([(0,r.state)()],ig.prototype,"hasExceededUsageLimit",void 0),ig=iw([(0,p.customElement)("w3m-email-login-widget")],ig),e.i(729084);var ib=t,iC=e.i(328182);e.i(655934);var iy=t;e.i(496969);let iv=g.css`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;var ix=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let i$=class extends iy.LitElement{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return i.html`
      <button ?disabled=${this.disabled} tabindex=${(0,n.ifDefined)(this.tabIdx)}>
        <wui-icon size="xxl" name=${this.logo}></wui-icon>
      </button>
    `}};i$.styles=[m.resetStyles,m.elementStyles,iv],ix([(0,o.property)()],i$.prototype,"logo",void 0),ix([(0,o.property)({type:Boolean})],i$.prototype,"disabled",void 0),ix([(0,o.property)()],i$.prototype,"tabIdx",void 0),i$=ix([(0,p.customElement)("wui-logo-select")],i$);var ik=e.i(542991);let iE=g.css`
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var iS=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iA=class extends ib.LitElement{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=ei.ConnectorController.state.connectors,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.isPwaLoading=!1,this.hasExceededUsageLimit=t_.ApiController.state.plan.hasExceededUsageLimit,this.unsubscribe.push(ei.ConnectorController.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type)}),u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),t_.ApiController.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="2"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){let e="explore"===this.walletGuide,t=this.remoteFeatures?.socials;return!t&&e?(t=eo.ConstantsUtil.DEFAULT_SOCIALS,this.renderTopViewContent(t)):t?this.renderTopViewContent(t):null}renderTopViewContent(e){return 2===e.length?i.html` <wui-flex gap="2">
        ${e.slice(0,2).map(e=>i.html`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${(0,n.ifDefined)(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:i.html` <wui-list-button
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      size="lg"
      icon=${(0,n.ifDefined)(e[0])}
      text=${`Continue with ${w.UiHelperUtil.capitalize(e[0])}`}
      tabIdx=${(0,n.ifDefined)(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-button>`}bottomViewTemplate(){let e=this.remoteFeatures?.socials,t="explore"===this.walletGuide;return(this.authConnector&&e&&0!==e.length||!t||(e=eo.ConstantsUtil.DEFAULT_SOCIALS),!e||e.length<=2)?null:e&&e.length>6?i.html`<wui-flex gap="2">
        ${e.slice(1,5).map(e=>i.html`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${(0,n.ifDefined)(this.tabIdx)}
              ?focusable=${void 0!==this.tabIdx&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${(0,n.ifDefined)(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:e?i.html`<wui-flex gap="2">
      ${e.slice(1,e.length).map(e=>i.html`<wui-logo-select
            data-testid=${`social-selector-${e}`}
            @click=${()=>{this.onSocialClick(e)}}
            logo=${e}
            tabIdx=${(0,n.ifDefined)(this.tabIdx)}
            ?focusable=${void 0!==this.tabIdx&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null}onMoreSocialsClick(){er.RouterController.push("ConnectSocials")}async onSocialClick(e){if(this.hasExceededUsageLimit)return void er.RouterController.push("UsageExceeded");if(!ee.ConstantsUtil.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===s.ChainController.state.activeChain)){let e=s.ChainController.getFirstCaipNetworkSupportsAuthConnector();if(e)return void er.RouterController.push("SwitchNetwork",{network:e})}e&&await (0,iC.executeSocialLogin)(e)}async handlePwaFrameLoad(){if(c.CoreHelperUtil.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof ik.W3mFrameProvider&&await this.authConnector.provider.init()}catch(e){ip.AlertController.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}hasConnection(){return et.ConnectionController.hasAnyConnection(ee.ConstantsUtil.CONNECTOR_ID.AUTH)}};iA.styles=iE,iS([(0,o.property)()],iA.prototype,"walletGuide",void 0),iS([(0,o.property)()],iA.prototype,"tabIdx",void 0),iS([(0,r.state)()],iA.prototype,"connectors",void 0),iS([(0,r.state)()],iA.prototype,"remoteFeatures",void 0),iS([(0,r.state)()],iA.prototype,"authConnector",void 0),iS([(0,r.state)()],iA.prototype,"isPwaLoading",void 0),iS([(0,r.state)()],iA.prototype,"hasExceededUsageLimit",void 0),iA=iS([(0,p.customElement)("w3m-social-login-widget")],iA);var iR=t,iT=t;e.i(987789);var iI=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iO=class extends iT.LitElement{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=ei.ConnectorController.state.connectors,this.count=t_.ApiController.state.count,this.filteredCount=t_.ApiController.state.filteredWallets.length,this.isFetchingRecommendedWallets=t_.ApiController.state.isFetchingRecommendedWallets,this.unsubscribe.push(ei.ConnectorController.subscribeKey("connectors",e=>this.connectors=e),t_.ApiController.subscribeKey("count",e=>this.count=e),t_.ApiController.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),t_.ApiController.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.find(e=>"walletConnect"===e.id),{allWallets:t}=u.OptionsController.state;if(!e||"HIDE"===t||"ONLY_MOBILE"===t&&!c.CoreHelperUtil.isMobile())return null;let o=t_.ApiController.state.featured.length,r=this.count+o,a=r<10?r:10*Math.floor(r/10),l=this.filteredCount>0?this.filteredCount:a,s=`${l}`;this.filteredCount>0?s=`${this.filteredCount}`:l<r&&(s=`${l}+`);let d=et.ConnectionController.hasAnyConnection(ee.ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT);return i.html`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${s}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${(0,n.ifDefined)(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${d}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){F.EventsController.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),er.RouterController.push("AllWallets",{redirectView:er.RouterController.state.data?.redirectView})}};iI([(0,o.property)()],iO.prototype,"tabIdx",void 0),iI([(0,r.state)()],iO.prototype,"connectors",void 0),iI([(0,r.state)()],iO.prototype,"count",void 0),iI([(0,r.state)()],iO.prototype,"filteredCount",void 0),iI([(0,r.state)()],iO.prototype,"isFetchingRecommendedWallets",void 0),iO=iI([(0,p.customElement)("w3m-all-wallets-widget")],iO);var iN=t;let iU=g.css`
  :host {
    margin-top: ${({spacing:e})=>e["1"]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["2"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var iP=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iD=class extends iN.LitElement{constructor(){super(),this.unsubscribe=[],this.explorerWallets=t_.ApiController.state.explorerWallets,this.connections=et.ConnectionController.state.connections,this.connectorImages=a.AssetController.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(et.ConnectionController.subscribeKey("connections",e=>this.connections=e),a.AssetController.subscribeKey("connectorImages",e=>this.connectorImages=e),t_.ApiController.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=e?.length?e:t_.ApiController.state.explorerWallets}),t_.ApiController.subscribeKey("explorerWallets",e=>{this.explorerWallets?.length||(this.explorerWallets=e)})),c.CoreHelperUtil.isTelegram()&&c.CoreHelperUtil.isIos()&&(this.loadingTelegram=!et.ConnectionController.state.wcUri,this.unsubscribe.push(et.ConnectionController.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){return eD.ConnectorUtil.connectorList().map((e,t)=>"connector"===e.kind?this.renderConnector(e,t):this.renderWallet(e,t))}getConnectorNamespaces(e){return"walletConnect"===e.subtype?[]:"multiChain"===e.subtype?e.connector.connectors?.map(e=>e.chain)||[]:[e.connector.chain]}renderConnector(e,t){let o,r,a=e.connector,s=l.AssetUtil.getConnectorImage(a)||this.connectorImages[a?.imageId??""],c=(this.connections.get(a.chain)??[]).some(e=>tu.HelpersUtil.isLowerCaseMatch(e.connectorId,a.id));"walletConnect"===e.subtype?(o="qr code",r="accent"):"injected"===e.subtype||"announced"===e.subtype?(o=c?"connected":"installed",r=c?"info":"success"):(o=void 0,r=void 0);let d=et.ConnectionController.hasAnyConnection(ee.ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT),u=("walletConnect"===e.subtype||"external"===e.subtype)&&d;return i.html`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${(0,n.ifDefined)(s)}
        .installed=${!0}
        name=${a.name??"Unknown"}
        .tagVariant=${r}
        tagLabel=${(0,n.ifDefined)(o)}
        data-testid=${`wallet-selector-${a.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${(0,n.ifDefined)(this.tabIdx)}
        ?disabled=${u}
        rdnsId=${(0,n.ifDefined)(a.explorerWallet?.rdns||void 0)}
        walletRank=${(0,n.ifDefined)(a.explorerWallet?.order)}
        .namespaces=${this.getConnectorNamespaces(e)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){let t=er.RouterController.state.data?.redirectView;if("walletConnect"===e.subtype){ei.ConnectorController.setActiveConnector(e.connector),c.CoreHelperUtil.isMobile()?er.RouterController.push("AllWallets"):er.RouterController.push("ConnectingWalletConnect",{redirectView:t});return}if("multiChain"===e.subtype){ei.ConnectorController.setActiveConnector(e.connector),er.RouterController.push("ConnectingMultiChain",{redirectView:t});return}if("injected"===e.subtype){ei.ConnectorController.setActiveConnector(e.connector),er.RouterController.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet});return}if("announced"===e.subtype)return"walletConnect"===e.connector.id?void(c.CoreHelperUtil.isMobile()?er.RouterController.push("AllWallets"):er.RouterController.push("ConnectingWalletConnect",{redirectView:t})):(er.RouterController.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet}),void 0);er.RouterController.push("ConnectingExternal",{connector:e.connector,redirectView:t})}renderWallet(e,t){let o=e.wallet,r=l.AssetUtil.getWalletImage(o),a=et.ConnectionController.hasAnyConnection(ee.ConstantsUtil.CONNECTOR_ID.WALLET_CONNECT),s=this.loadingTelegram,c="recent"===e.subtype?"recent":void 0,d="recent"===e.subtype?"info":void 0;return i.html`
      <w3m-list-wallet
        displayIndex=${t}
        imageSrc=${(0,n.ifDefined)(r)}
        name=${o.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${o.id}`}
        tabIdx=${(0,n.ifDefined)(this.tabIdx)}
        ?loading=${s}
        ?disabled=${a}
        rdnsId=${(0,n.ifDefined)(o.rdns||void 0)}
        walletRank=${(0,n.ifDefined)(o.order)}
        tagLabel=${(0,n.ifDefined)(c)}
        .tagVariant=${d}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){let t=er.RouterController.state.data?.redirectView,i=s.ChainController.state.activeChain;if("featured"===e.subtype)return void ei.ConnectorController.selectWalletConnector(e.wallet);if("recent"===e.subtype){if(this.loadingTelegram)return;ei.ConnectorController.selectWalletConnector(e.wallet);return}if("custom"===e.subtype){if(this.loadingTelegram)return;er.RouterController.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t});return}if(this.loadingTelegram)return;let o=i?ei.ConnectorController.getConnector({id:e.wallet.id,namespace:i}):void 0;o?er.RouterController.push("ConnectingExternal",{connector:o,redirectView:t}):er.RouterController.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t})}};iD.styles=iU,iP([(0,o.property)({type:Number})],iD.prototype,"tabIdx",void 0),iP([(0,r.state)()],iD.prototype,"explorerWallets",void 0),iP([(0,r.state)()],iD.prototype,"connections",void 0),iP([(0,r.state)()],iD.prototype,"connectorImages",void 0),iP([(0,r.state)()],iD.prototype,"loadingTelegram",void 0),iD=iP([(0,p.customElement)("w3m-connector-list")],iD);var iL=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iW=class extends iR.LitElement{constructor(){super(...arguments),this.tabIdx=void 0}render(){return i.html`
      <wui-flex flexDirection="column" gap="2">
        <w3m-connector-list tabIdx=${(0,n.ifDefined)(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${(0,n.ifDefined)(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};iL([(0,o.property)()],iW.prototype,"tabIdx",void 0),iW=iL([(0,p.customElement)("w3m-wallet-login-list")],iW);let ij=g.css`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var iz=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iB=class extends io.LitElement{constructor(){super(),this.unsubscribe=[],this.connectors=ei.ConnectorController.state.connectors,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.features=u.OptionsController.state.features,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.enableWallets=u.OptionsController.state.enableWallets,this.noAdapters=s.ChainController.state.noAdapters,this.walletGuide="get-started",this.checked=ir.OptionsStateController.state.isLegalCheckboxChecked,this.isEmailEnabled=this.remoteFeatures?.email&&!s.ChainController.state.noAdapters,this.isSocialEnabled=this.remoteFeatures?.socials&&this.remoteFeatures.socials.length>0&&!s.ChainController.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(ei.ConnectorController.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),u.OptionsController.subscribeKey("features",e=>{this.features=e}),u.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),u.OptionsController.subscribeKey("enableWallets",e=>this.enableWallets=e),s.ChainController.subscribeKey("noAdapters",e=>this.setEmailAndSocialEnableCheck(e,this.remoteFeatures)),ir.OptionsStateController.subscribeKey("isLegalCheckboxChecked",e=>this.checked=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect();let e=this.shadowRoot?.querySelector(".connect");e?.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(".connect");e&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),e?.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),this.resizeObserver?.observe(e),this.handleConnectListScroll())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.OptionsController.state,o=u.OptionsController.state.features?.legalCheckbox,r=!!(e||t)&&!!o&&"get-started"===this.walletGuide&&!this.checked,n=u.OptionsController.state.enableWalletGuide,a=this.enableWallets,l=this.isSocialEnabled||this.authConnector;return i.html`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          .padding=${["0","0","4","0"]}
          class=${(0,e9.classMap)({connect:!0,disabled:r})}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="2"
            .padding=${l&&a&&n&&"get-started"===this.walletGuide?["0","3","0","3"]:["0","3","3","3"]}
          >
            ${this.renderConnectMethod(r?-1:void 0)}
          </wui-flex>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}reownBrandingTemplate(){return eV.HelpersUtil.hasFooter()||!this.remoteFeatures?.reownBranding?null:i.html`<wui-ux-by-reown></wui-ux-by-reown>`}setEmailAndSocialEnableCheck(e,t){this.isEmailEnabled=t?.email&&!e,this.isSocialEnabled=t?.socials&&t.socials.length>0&&!e,this.remoteFeatures=t,this.noAdapters=e}checkIfAuthEnabled(e){let t=e.filter(e=>e.type===id.ConstantsUtil.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return ee.ConstantsUtil.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}renderConnectMethod(e){let t=tH.WalletUtil.getConnectOrderMethod(this.features,this.connectors);return i.html`${t.map((t,o)=>{switch(t){case"email":return i.html`${this.emailTemplate(e)} ${this.separatorTemplate(o,"email")}`;case"social":return i.html`${this.socialListTemplate(e)}
          ${this.separatorTemplate(o,"social")}`;case"wallet":return i.html`${this.walletListTemplate(e)}
          ${this.separatorTemplate(o,"wallet")}`;default:return null}})}`}checkMethodEnabled(e){switch(e){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){let t=tH.WalletUtil.getConnectOrderMethod(this.features,this.connectors)[e+1];return t?this.checkMethodEnabled(t)?t:this.checkIsThereNextMethod(e+1):void 0}separatorTemplate(e,t){let o=this.checkIsThereNextMethod(e),r="explore"===this.walletGuide;switch(t){case"wallet":return this.enableWallets&&o&&!r?i.html`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":return this.isAuthEnabled&&this.isEmailEnabled&&"social"!==o&&o?i.html`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null;case"social":return this.isAuthEnabled&&this.isSocialEnabled&&"email"!==o&&o?i.html`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;default:return null}}emailTemplate(e){return this.isEmailEnabled&&this.isAuthEnabled?i.html`<w3m-email-login-widget tabIdx=${(0,n.ifDefined)(e)}></w3m-email-login-widget>`:null}socialListTemplate(e){return this.isSocialEnabled&&this.isAuthEnabled?i.html`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${(0,n.ifDefined)(e)}
    ></w3m-social-login-widget>`:null}walletListTemplate(e){let t=this.enableWallets,o=this.features?.emailShowWallets===!1,r=this.features?.collapseWallets;return t?(c.CoreHelperUtil.isTelegram()&&(c.CoreHelperUtil.isSafari()||c.CoreHelperUtil.isIos())&&et.ConnectionController.connectWalletConnect().catch(e=>({})),"explore"===this.walletGuide)?null:this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&(o||r)?i.html`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${(0,n.ifDefined)(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
        icon="wallet"
      ></wui-list-button>`:i.html`<w3m-wallet-login-list tabIdx=${(0,n.ifDefined)(e)}></w3m-wallet-login-list>`:null}legalCheckboxTemplate(){return"explore"===this.walletGuide?null:i.html`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(".connect");e&&(e.scrollHeight>470?(e.style.setProperty("--connect-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
          black 100px,
          black calc(100% - 100px),
          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--connect-scroll--top-opacity",ti.MathUtil.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",ti.MathUtil.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--connect-mask-image","none"),e.style.setProperty("--connect-scroll--top-opacity","0"),e.style.setProperty("--connect-scroll--bottom-opacity","0")))}onContinueWalletClick(){er.RouterController.push("ConnectWallets")}};iB.styles=ij,iz([(0,r.state)()],iB.prototype,"connectors",void 0),iz([(0,r.state)()],iB.prototype,"authConnector",void 0),iz([(0,r.state)()],iB.prototype,"features",void 0),iz([(0,r.state)()],iB.prototype,"remoteFeatures",void 0),iz([(0,r.state)()],iB.prototype,"enableWallets",void 0),iz([(0,r.state)()],iB.prototype,"noAdapters",void 0),iz([(0,o.property)()],iB.prototype,"walletGuide",void 0),iz([(0,r.state)()],iB.prototype,"checked",void 0),iz([(0,r.state)()],iB.prototype,"isEmailEnabled",void 0),iz([(0,r.state)()],iB.prototype,"isSocialEnabled",void 0),iz([(0,r.state)()],iB.prototype,"isAuthEnabled",void 0),iB=iz([(0,p.customElement)("w3m-connect-view")],iB),e.s(["W3mConnectView",()=>iB],28218);var iF=e.i(683075),i_=e.i(592279),iH=t,iM=e.i(639403);e.i(210380),e.i(595157);var iV=t,iK=t;let iq=g.css`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var iG=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iX=class extends iK.LitElement{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return i.html`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};iX.styles=[m.resetStyles,m.elementStyles,iq],iG([(0,o.property)({type:Boolean})],iX.prototype,"disabled",void 0),iG([(0,o.property)()],iX.prototype,"label",void 0),iG([(0,o.property)()],iX.prototype,"buttonLabel",void 0),iX=iG([(0,p.customElement)("wui-cta-button")],iX);let iY=g.css`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e["5"]} ${({spacing:e})=>e["5"]};
  }
`;var iQ=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let iJ=class extends iV.LitElement{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:e,app_store:t,play_store:o,chrome_store:r,homepage:n}=this.wallet,a=c.CoreHelperUtil.isMobile(),l=c.CoreHelperUtil.isIos(),s=c.CoreHelperUtil.isAndroid(),d=[t,o,n,r].filter(Boolean).length>1,u=w.UiHelperUtil.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return d&&!a?i.html`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${()=>er.RouterController.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&n?i.html`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&l?i.html`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&s?i.html`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&c.CoreHelperUtil.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&c.CoreHelperUtil.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&c.CoreHelperUtil.openHref(this.wallet.homepage,"_blank")}};iJ.styles=[iY],iQ([(0,o.property)({type:Object})],iJ.prototype,"wallet",void 0),iJ=iQ([(0,p.customElement)("w3m-mobile-download-links")],iJ);let iZ=g.css`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var i0=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};class i3 extends iH.LitElement{constructor(){super(),this.wallet=er.RouterController.state.data?.wallet,this.connector=er.RouterController.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=l.AssetUtil.getConnectorImage(this.connector)??l.AssetUtil.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=et.ConnectionController.state.wcUri,this.error=et.ConnectionController.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(et.ConnectionController.subscribeKey("wcUri",e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),et.ConnectionController.subscribeKey("wcError",e=>this.error=e)),(c.CoreHelperUtil.isTelegram()||c.CoreHelperUtil.isSafari())&&c.CoreHelperUtil.isIos()&&et.ConnectionController.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),et.ConnectionController.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,t="";return this.label?t=this.label:(t=`Continue in ${this.name}`,this.error&&(t="Connection declined")),i.html`
      <wui-flex
        data-error=${(0,n.ifDefined)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${(0,n.ifDefined)(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${t}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?i.html`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?i.html`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){et.ConnectionController.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let e=iM.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return i.html`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(c.CoreHelperUtil.copyToClopboard(this.uri),en.SnackController.showSuccess("Link copied"))}catch{en.SnackController.showError("Failed to copy")}}}i3.styles=iZ,i0([(0,r.state)()],i3.prototype,"isRetrying",void 0),i0([(0,r.state)()],i3.prototype,"uri",void 0),i0([(0,r.state)()],i3.prototype,"error",void 0),i0([(0,r.state)()],i3.prototype,"ready",void 0),i0([(0,r.state)()],i3.prototype,"showRetry",void 0),i0([(0,r.state)()],i3.prototype,"label",void 0),i0([(0,r.state)()],i3.prototype,"secondaryBtnLabel",void 0),i0([(0,r.state)()],i3.prototype,"secondaryLabel",void 0),i0([(0,r.state)()],i3.prototype,"isLoading",void 0),i0([(0,o.property)({type:Boolean})],i3.prototype,"isMobile",void 0),i0([(0,o.property)()],i3.prototype,"onRetry",void 0);let i1=class extends i3{constructor(){if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=et.ConnectionController.getConnections(this.connector?.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.currentActiveConnectorId=ei.ConnectorController.state.activeConnectorIds[this.connector?.chain],!this.connector)throw Error("w3m-connecting-view: No connector provided");const e=this.connector?.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:er.RouterController.state.view}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(ei.ConnectorController.subscribeKey("activeConnectorIds",t=>{let i=t[e],o=this.remoteFeatures?.multiWallet,{redirectView:r}=er.RouterController.state.data??{};i!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&o?(er.RouterController.replace("ProfileWallets"),en.SnackController.showSuccess("New Wallet Added")):r?er.RouterController.replace(r):d.ModalController.close())}),et.ConnectionController.subscribeKey("connections",this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(e=>e())}async onConnectProxy(){try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;this.connector.id===ee.ConstantsUtil.CONNECTOR_ID.COINBASE_SDK&&this.error||await et.ConnectionController.connectExternal(this.connector,this.connector.chain)}}catch(e){e instanceof i_.AppKitError&&e.originalName===iF.ErrorUtil.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?F.EventsController.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):F.EventsController.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}onConnectionsChange(e){if(this.connector?.chain&&e.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){let t=e.get(this.connector.chain)??[],i=this.remoteFeatures?.multiWallet;if(0===t.length)er.RouterController.replace("Connect");else{let e=tt.ConnectionControllerUtil.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(e=>e.accounts),o=tt.ConnectionControllerUtil.getConnectionsByConnectorId(t,this.connector.id).flatMap(e=>e.accounts);0===o.length?this.hasMultipleConnections&&i?(er.RouterController.replace("ProfileWallets"),en.SnackController.showSuccess("Wallet deleted")):d.ModalController.close():!e.every(e=>o.some(t=>tu.HelpersUtil.isLowerCaseMatch(e.address,t.address)))&&i&&er.RouterController.replace("ProfileWallets")}}}isAlreadyConnected(e){return!!e&&this.connectionsByNamespace.some(t=>tu.HelpersUtil.isLowerCaseMatch(t.connectorId,e.id))}};i1=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-connecting-external-view")],i1),e.s(["W3mConnectingExternalView",()=>i1],217283);var i2=t;let i5=E.css`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`;var i4=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let i6=class extends i2.LitElement{constructor(){super(),this.unsubscribe=[],this.activeConnector=ei.ConnectorController.state.activeConnector,this.unsubscribe.push(ei.ConnectorController.subscribeKey("activeConnector",e=>this.activeConnector=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${(0,n.ifDefined)(l.AssetUtil.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["0","3","0","3"]}
        >
          <wui-text variant="lg-medium" color="primary">
            Select Chain for ${this.activeConnector?.name}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","2","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){return this.activeConnector?.connectors?.map((e,t)=>e.name?i.html`
            <w3m-list-wallet
              displayIndex=${t}
              imageSrc=${(0,n.ifDefined)(l.AssetUtil.getChainImage(e.chain))}
              name=${ee.ConstantsUtil.CHAIN_NAME_MAP[e.chain]}
              @click=${()=>this.onConnector(e)}
              size="sm"
              data-testid="wui-list-chain-${e.chain}"
              rdnsId=${e.explorerWallet?.rdns}
            ></w3m-list-wallet>
          `:null)}onConnector(e){let t=this.activeConnector?.connectors?.find(t=>t.chain===e.chain),i=er.RouterController.state.data?.redirectView;t?"walletConnect"===t.id?c.CoreHelperUtil.isMobile()?er.RouterController.push("AllWallets"):er.RouterController.push("ConnectingWalletConnect",{redirectView:i}):er.RouterController.push("ConnectingExternal",{connector:t,redirectView:i,wallet:this.activeConnector?.explorerWallet}):en.SnackController.showError("Failed to find connector")}};i6.styles=i5,i4([(0,r.state)()],i6.prototype,"activeConnector",void 0),i6=i4([(0,p.customElement)("w3m-connecting-multi-chain-view")],i6),e.s(["W3mConnectingMultiChainView",()=>i6],904356);var i8=t,i7=e.i(334523),i9=t,oe=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ot=class extends i9.LitElement{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.generateTabs();return i.html`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let e=this.platforms.map(e=>{if("browser"===e)return{label:"Browser",icon:"extension",platform:"browser"};if("mobile"===e)return{label:"Mobile",icon:"mobile",platform:"mobile"};if("qrcode"===e)return{label:"Mobile",icon:"mobile",platform:"qrcode"};if("web"===e)return{label:"Webapp",icon:"browser",platform:"web"};if("desktop"===e)return{label:"Desktop",icon:"desktop",platform:"desktop"};return{label:"Browser",icon:"extension",platform:"unsupported"}});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){let t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};oe([(0,o.property)({type:Array})],ot.prototype,"platforms",void 0),oe([(0,o.property)()],ot.prototype,"onSelectPlatfrom",void 0),ot=oe([(0,p.customElement)("w3m-connecting-header")],ot);let oi=class extends i3{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:er.RouterController.state.view}})}async onConnectProxy(){try{this.error=!1;let{connectors:e}=ei.ConnectorController.state,t=e.find(e=>"ANNOUNCED"===e.type&&e.info?.rdns===this.wallet?.rdns||"INJECTED"===e.type||e.name===this.wallet?.name);if(t)await et.ConnectionController.connectExternal(t,t.chain);else throw Error("w3m-connecting-wc-browser: No connector found");d.ModalController.close()}catch(e){e instanceof i_.AppKitError&&e.originalName===iF.ErrorUtil.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?F.EventsController.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):F.EventsController.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};oi=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-connecting-wc-browser")],oi);let oo=class extends i3{constructor(){if(super(),!this.wallet)throw Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:er.RouterController.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:e,name:t}=this.wallet,{redirect:i,href:o}=c.CoreHelperUtil.formatNativeUrl(e,this.uri);et.ConnectionController.setWcLinking({name:t,href:o}),et.ConnectionController.setRecentWallet(this.wallet),c.CoreHelperUtil.openHref(i,"_blank")}catch{this.error=!0}}};oo=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-connecting-wc-desktop")],oo);var or=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let on=class extends i3{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=u.OptionsController.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{tt.ConnectionControllerUtil.onConnectMobile(this.wallet)},!this.wallet)throw Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=eo.ConstantsUtil.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(et.ConnectionController.subscribeKey("wcUri",()=>{this.onHandleURI()})),F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:er.RouterController.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){et.ConnectionController.setWcError(!1),this.onConnect?.()}};or([(0,r.state)()],on.prototype,"redirectDeeplink",void 0),or([(0,r.state)()],on.prototype,"redirectUniversalLink",void 0),or([(0,r.state)()],on.prototype,"target",void 0),or([(0,r.state)()],on.prototype,"preferUniversalLinks",void 0),or([(0,r.state)()],on.prototype,"isLoading",void 0),on=or([(0,p.customElement)("w3m-connecting-wc-mobile")],on),e.i(732965);let oa=g.css`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var ol=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let os=class extends i3{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:er.RouterController.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e())}render(){return this.onRenderProxy(),i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.wallet?this.wallet.name:void 0;et.ConnectionController.setWcLinking(void 0),et.ConnectionController.setRecentWallet(this.wallet);let t=iM.ThemeController.state.themeVariables["--apkt-qr-color"]??iM.ThemeController.state.themeVariables["--w3m-qr-color"];return i.html` <wui-qr-code
      theme=${iM.ThemeController.state.themeMode}
      uri=${this.uri}
      imageSrc=${(0,n.ifDefined)(l.AssetUtil.getWalletImage(this.wallet))}
      color=${(0,n.ifDefined)(t)}
      alt=${(0,n.ifDefined)(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return i.html`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};os.styles=oa,ol([(0,o.property)({type:Boolean})],os.prototype,"basic",void 0),os=ol([(0,p.customElement)("w3m-connecting-wc-qrcode")],os);var oc=t;let od=class extends oc.LitElement{constructor(){if(super(),this.wallet=er.RouterController.state.data?.wallet,!this.wallet)throw Error("w3m-connecting-wc-unsupported: No wallet provided");F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:er.RouterController.state.view}})}render(){return i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${(0,n.ifDefined)(l.AssetUtil.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};od=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-connecting-wc-unsupported")],od);var ou=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let op=class extends i3{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=eo.ConstantsUtil.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(et.ConnectionController.subscribeKey("wcUri",()=>{this.updateLoadingState()})),F.EventsController.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:er.RouterController.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:e,name:t}=this.wallet,{redirect:i,href:o}=c.CoreHelperUtil.formatUniversalUrl(e,this.uri);et.ConnectionController.setWcLinking({name:t,href:o}),et.ConnectionController.setRecentWallet(this.wallet),c.CoreHelperUtil.openHref(i,"_blank")}catch{this.error=!0}}};ou([(0,r.state)()],op.prototype,"isLoading",void 0),op=ou([(0,p.customElement)("w3m-connecting-wc-web")],op);let oh=g.css`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var om=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ow=class extends i8.LitElement{constructor(){super(),this.wallet=er.RouterController.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!u.OptionsController.state.siwx,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u.OptionsController.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),i.html`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding&&this.displayBranding?i.html`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(e=!1){if("browser"!==this.platform&&(!u.OptionsController.state.manualWCControl||e))try{let{wcPairingExpiry:t,status:i}=et.ConnectionController.state,{redirectView:o}=er.RouterController.state.data??{};if(e||u.OptionsController.state.enableEmbedded||c.CoreHelperUtil.isPairingExpired(t)||"connecting"===i){let e=et.ConnectionController.getConnections(s.ChainController.state.activeChain),t=this.remoteFeatures?.multiWallet,i=e.length>0;await et.ConnectionController.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(i&&t?(er.RouterController.replace("ProfileWallets"),en.SnackController.showSuccess("New Wallet Added")):o?er.RouterController.replace(o):d.ModalController.close())}}catch(e){if(e instanceof Error&&e.message.includes("An error occurred when attempting to switch chain")&&!u.OptionsController.state.enableNetworkSwitch&&s.ChainController.state.activeChain){s.ChainController.setActiveCaipNetwork(i7.CaipNetworksUtil.getUnsupportedNetwork(`${s.ChainController.state.activeChain}:${s.ChainController.state.activeCaipNetwork?.id}`)),s.ChainController.showUnsupportedChainUI();return}e instanceof i_.AppKitError&&e.originalName===iF.ErrorUtil.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?F.EventsController.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):F.EventsController.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),et.ConnectionController.setWcError(!0),en.SnackController.showError(e.message??"Connection error"),et.ConnectionController.resetWcConnection(),er.RouterController.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:e,desktop_link:t,webapp_link:i,injected:o,rdns:r}=this.wallet,n=o?.map(({injected_id:e})=>e).filter(Boolean),a=[...r?[r]:n??[]],l=!u.OptionsController.state.isUniversalProvider&&a.length,d=et.ConnectionController.checkInstalled(a),p=l&&d,h=t&&!c.CoreHelperUtil.isMobile();p&&!s.ChainController.state.noAdapters&&this.platforms.push("browser"),e&&this.platforms.push(c.CoreHelperUtil.isMobile()?"mobile":"qrcode"),i&&this.platforms.push("web"),h&&this.platforms.push("desktop"),p||!l||s.ChainController.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return i.html`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return i.html`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return i.html`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return i.html`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return i.html`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return i.html`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?i.html`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){let t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};ow.styles=oh,om([(0,r.state)()],ow.prototype,"platform",void 0),om([(0,r.state)()],ow.prototype,"platforms",void 0),om([(0,r.state)()],ow.prototype,"isSiwxEnabled",void 0),om([(0,r.state)()],ow.prototype,"remoteFeatures",void 0),om([(0,o.property)({type:Boolean})],ow.prototype,"displayBranding",void 0),om([(0,o.property)({type:Boolean})],ow.prototype,"basic",void 0),ow=om([(0,p.customElement)("w3m-connecting-wc-view")],ow),e.s(["W3mConnectingWcView",()=>ow],90344);var og=t,of=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ob=class extends og.LitElement{constructor(){super(),this.unsubscribe=[],this.isMobile=c.CoreHelperUtil.isMobile(),this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.unsubscribe.push(u.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){let{featured:e,recommended:t}=t_.ApiController.state,{customWallets:o}=u.OptionsController.state,r=eu.StorageUtil.getRecentWallets(),n=e.length||t.length||o?.length||r.length;return i.html`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${n?i.html`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return i.html`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?i.html` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};of([(0,r.state)()],ob.prototype,"isMobile",void 0),of([(0,r.state)()],ob.prototype,"remoteFeatures",void 0),ob=of([(0,p.customElement)("w3m-connecting-wc-basic-view")],ob),e.s(["W3mConnectingWcBasicView",()=>ob],612639);var oC=t,oy=e.i(576599);let ov=E.css`
  .continue-button-container {
    width: 100%;
  }
`;var ox=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let o$=class extends oC.LitElement{constructor(){super(...arguments),this.loading=!1}render(){return i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{c.CoreHelperUtil.openHref(oy.NavigationUtil.URLS.FAQ,"_blank")}}
        >
          Learn more about names
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return i.html` <wui-flex
      flexDirection="column"
      gap="6"
      alignItems="center"
      .padding=${["0","6","0","6"]}
    >
      <wui-flex gap="3" alignItems="center" justifyContent="center">
        <wui-icon-box icon="id" size="xl" iconSize="xxl" color="default"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="lg-medium" color="primary">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return i.html`<wui-flex
      .padding=${["0","8","0","8"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){er.RouterController.push("RegisterAccountName"),F.EventsController.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:(0,eC.getPreferredAccountType)(s.ChainController.state.activeChain)===eI.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}})}};o$.styles=ov,ox([(0,r.state)()],o$.prototype,"loading",void 0),o$=ox([(0,p.customElement)("w3m-choose-account-name-view")],o$),e.s(["W3mChooseAccountNameView",()=>o$],669783);var ok=t;let oE=class extends ok.LitElement{constructor(){super(...arguments),this.wallet=er.RouterController.state.data?.wallet}render(){if(!this.wallet)throw Error("w3m-downloads-view");return i.html`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?i.html`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?i.html`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?i.html`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?i.html`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(F.EventsController.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),c.CoreHelperUtil.openHref(e.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};oE=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-downloads-view")],oE),e.s(["W3mDownloadsView",()=>oE],108201);var oS=t;let oA=class extends oS.LitElement{render(){return i.html`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.recommendedWalletsTemplate()}
        <w3m-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          size="sm"
          @click=${()=>{c.CoreHelperUtil.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></w3m-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){let{recommended:e,featured:t}=t_.ApiController.state,{customWallets:o}=u.OptionsController.state;return[...t,...o??[],...e].slice(0,4).map((e,t)=>i.html`
        <w3m-list-wallet
          displayIndex=${t}
          name=${e.name??"Unknown"}
          tagVariant="accent"
          size="sm"
          imageSrc=${(0,n.ifDefined)(l.AssetUtil.getWalletImage(e))}
          @click=${()=>{this.onWalletClick(e)}}
        ></w3m-list-wallet>
      `)}onWalletClick(e){F.EventsController.sendEvent({type:"track",event:"GET_WALLET",properties:{name:e.name,walletRank:void 0,explorerId:e.id,type:"homepage"}}),c.CoreHelperUtil.openHref(e.homepage??"https://walletconnect.com/explorer","_blank")}};oA=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-get-wallet-view")],oA),e.s(["W3mGetWalletView",()=>oA],64077);var oR=t,oT=t;e.i(357650);var oI=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let oO=class extends oT.LitElement{constructor(){super(...arguments),this.data=[]}render(){return i.html`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        ${this.data.map(e=>i.html`
            <wui-flex flexDirection="column" alignItems="center" gap="5">
              <wui-flex flexDirection="row" justifyContent="center" gap="1">
                ${e.images.map(e=>i.html`<wui-visual size="sm" name=${e}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="1">
              <wui-text variant="md-regular" color="primary" align="center">${e.title}</wui-text>
              <wui-text variant="sm-regular" color="secondary" align="center"
                >${e.text}</wui-text
              >
            </wui-flex>
          `)}
      </wui-flex>
    `}};oI([(0,o.property)({type:Array})],oO.prototype,"data",void 0),oO=oI([(0,p.customElement)("w3m-help-widget")],oO);let oN=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}],oU=class extends oR.LitElement{render(){return i.html`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${oN}></w3m-help-widget>
        <wui-button variant="accent-primary" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){F.EventsController.sendEvent({type:"track",event:"CLICK_GET_WALLET_HELP"}),er.RouterController.push("GetWallet")}};oU=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-what-is-a-wallet-view")],oU),e.s(["W3mWhatIsAWalletView",()=>oU],667772);var oP=t;let oD=g.css`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var oL=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let oW=class extends oP.LitElement{constructor(){super(),this.unsubscribe=[],this.checked=ir.OptionsStateController.state.isLegalCheckboxChecked,this.unsubscribe.push(ir.OptionsStateController.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.OptionsController.state,o=u.OptionsController.state.features?.legalCheckbox,r=!!(e||t)&&!!o,a=r&&!this.checked;return i.html`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${r?["0","3","3","3"]:"3"}
        gap="2"
        class=${(0,n.ifDefined)(a?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${(0,n.ifDefined)(a?-1:void 0)}></w3m-wallet-login-list>
      </wui-flex>
    `}};oW.styles=oD,oL([(0,r.state)()],oW.prototype,"checked",void 0),oW=oL([(0,p.customElement)("w3m-connect-wallets-view")],oW),e.s(["W3mConnectWalletsView",()=>oW],744216);var oj=t,oz=e.i(218454),oB=t;let oF=g.css`
  :host {
    display: block;
    width: 120px;
    height: 120px;
  }

  svg {
    width: 120px;
    height: 120px;
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: ${e=>e.colors.accent100};
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`,o_=class extends oB.LitElement{render(){return i.html`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};o_.styles=[m.resetStyles,oF],o_=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("wui-loading-hexagon")],o_),e.i(774339);let oH=E.css`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`;var oM=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let oV=class extends oj.LitElement{constructor(){super(),this.network=er.RouterController.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw Error("w3m-network-switch-view: No network provided");this.onShowRetry();let e=this.getLabel(),t=this.getSubLabel();return i.html`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","10","5"]}
        gap="7"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${(0,n.ifDefined)(l.AssetUtil.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:i.html`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="h6-regular" color="primary">${e}</wui-text>
          <wui-text align="center" variant="md-regular" color="secondary">${t}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent-primary"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){let e=ei.ConnectorController.getConnectorId(s.ChainController.state.activeChain);return ei.ConnectorController.getAuthConnector()&&e===ee.ConstantsUtil.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){let e=ei.ConnectorController.getConnectorId(s.ChainController.state.activeChain);return ei.ConnectorController.getAuthConnector()&&e===ee.ConstantsUtil.CONNECTOR_ID.AUTH?`Switching to ${this.network?.name??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;let e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}async onSwitchNetwork(){try{this.error=!1,s.ChainController.state.activeChain!==this.network?.chainNamespace&&s.ChainController.setIsSwitchingNamespace(!0),this.network&&(await s.ChainController.switchActiveNetwork(this.network),await oz.SIWXUtil.isAuthenticated()&&er.RouterController.goBack())}catch(e){this.error=!0}}};oV.styles=oH,oM([(0,r.state)()],oV.prototype,"showRetry",void 0),oM([(0,r.state)()],oV.prototype,"error",void 0),oV=oM([(0,p.customElement)("w3m-network-switch-view")],oV),e.s(["W3mNetworkSwitchView",()=>oV],569962);var oK=t,oq=e.i(798852);e.i(6957);var oG=t;let oX=g.css`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var oY=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let oQ=class extends oG.LitElement{constructor(){super(...arguments),this.imageSrc=void 0,this.name="Ethereum",this.disabled=!1}render(){return i.html`
      <button ?disabled=${this.disabled} tabindex=${(0,n.ifDefined)(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          ${this.imageTemplate()}
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}imageTemplate(){return this.imageSrc?i.html`<wui-image ?boxed=${!0} src=${this.imageSrc}></wui-image>`:i.html`<wui-image
      ?boxed=${!0}
      icon="networkPlaceholder"
      size="lg"
      iconColor="default"
    ></wui-image>`}};oQ.styles=[m.resetStyles,m.elementStyles,oX],oY([(0,o.property)()],oQ.prototype,"imageSrc",void 0),oY([(0,o.property)()],oQ.prototype,"name",void 0),oY([(0,o.property)()],oQ.prototype,"tabIdx",void 0),oY([(0,o.property)({type:Boolean})],oQ.prototype,"disabled",void 0),oQ=oY([(0,p.customElement)("wui-list-network")],oQ);let oJ=E.css`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`;var oZ=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let o0=class extends oK.LitElement{constructor(){super(),this.unsubscribe=[],this.network=s.ChainController.state.activeCaipNetwork,this.requestedCaipNetworks=s.ChainController.getCaipNetworks(),this.search="",this.onDebouncedSearch=c.CoreHelperUtil.debounce(e=>{this.search=e},100),this.unsubscribe.push(a.AssetController.subscribeNetworkImages(()=>this.requestUpdate()),s.ChainController.subscribeKey("activeCaipNetwork",e=>this.network=e),s.ChainController.subscribe(()=>{this.requestedCaipNetworks=s.ChainController.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","3","3","3"]}
        flexDirection="column"
        gap="2"
      >
        ${this.networksTemplate()}
      </wui-flex>
    `}templateSearchInput(){return i.html`
      <wui-flex gap="2" .padding=${["0","3","3","3"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}networksTemplate(){let e=s.ChainController.getAllApprovedCaipNetworkIds(),t=c.CoreHelperUtil.sortRequestedNetworks(e,this.requestedCaipNetworks);return this.search?this.filteredNetworks=t?.filter(e=>e?.name?.toLowerCase().includes(this.search.toLowerCase())):this.filteredNetworks=t,this.filteredNetworks?.map(e=>i.html`
        <wui-list-network
          .selected=${this.network?.id===e.id}
          imageSrc=${(0,n.ifDefined)(l.AssetUtil.getNetworkImage(e))}
          type="network"
          name=${e.name??e.id}
          @click=${()=>this.onSwitchNetwork(e)}
          .disabled=${s.ChainController.isCaipNetworkDisabled(e)}
          data-testid=${`w3m-network-switch-${e.name??e.id}`}
        ></wui-list-network>
      `)}onSwitchNetwork(e){oq.NetworkUtil.onSwitchNetwork({network:e})}};o0.styles=oJ,oZ([(0,r.state)()],o0.prototype,"network",void 0),oZ([(0,r.state)()],o0.prototype,"requestedCaipNetworks",void 0),oZ([(0,r.state)()],o0.prototype,"filteredNetworks",void 0),oZ([(0,r.state)()],o0.prototype,"search",void 0),o0=oZ([(0,p.customElement)("w3m-networks-view")],o0),e.s(["W3mNetworksView",()=>o0],505676);var o3=t;let o1=g.css`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} * 9 - ${({borderRadius:e})=>e["3"]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} * 9 - ${({borderRadius:e})=>e["3"]}
    );
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:e})=>e["01"]} ${({spacing:e})=>e["2"]};
  }

  .capitalize {
    text-transform: capitalize;
  }
`;var o2=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let o5={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0},o4=class extends o3.LitElement{constructor(){super(...arguments),this.unsubscribe=[],this.switchToChain=er.RouterController.state.data?.switchToChain,this.caipNetwork=er.RouterController.state.data?.network,this.activeChain=s.ChainController.state.activeChain}firstUpdated(){this.unsubscribe.push(s.ChainController.subscribeKey("activeChain",e=>this.activeChain=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.switchToChain?ee.ConstantsUtil.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;let t=ee.ConstantsUtil.CHAIN_NAME_MAP[this.switchToChain];return i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["4","2","2","2"]}
        gap="4"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="2">
          <wui-visual
            size="md"
            name=${(0,n.ifDefined)(o5[this.switchToChain])}
          ></wui-visual>
          <wui-flex gap="2" flexDirection="column" alignItems="center">
            <wui-text
              data-testid=${`w3m-switch-active-chain-to-${t}`}
              variant="lg-regular"
              color="primary"
              align="center"
              >Switch to <span class="capitalize">${t}</span></wui-text
            >
            <wui-text variant="md-regular" color="secondary" align="center">
              Connected wallet doesn't support connecting to ${e} chain. You
              need to connect with a different wallet.
            </wui-text>
          </wui-flex>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(s.ChainController.setIsSwitchingNamespace(!0),ei.ConnectorController.setFilterByNamespace(this.switchToChain),this.caipNetwork?await s.ChainController.switchActiveNetwork(this.caipNetwork):s.ChainController.setActiveNamespace(this.switchToChain),er.RouterController.reset("Connect"))}};o4.styles=o1,o2([(0,o.property)()],o4.prototype,"activeChain",void 0),o4=o2([(0,p.customElement)("w3m-switch-active-chain-view")],o4),e.s(["W3mSwitchActiveChainView",()=>o4],317016);var o6=t;let o8=[{images:["network","layers","system"],title:"The system’s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}],o7=class extends o6.LitElement{render(){return i.html`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${o8}></w3m-help-widget>
        <wui-button
          variant="accent-primary"
          size="md"
          @click=${()=>{c.CoreHelperUtil.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};o7=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-what-is-a-network-view")],o7),e.s(["W3mWhatIsANetworkView",()=>o7],843476);var o9=t;let re=E.css`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var rt=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ri=class extends o9.LitElement{constructor(){super(),this.swapUnsupportedChain=er.RouterController.state.data?.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=u.OptionsController.state.remoteFeatures,this.unsubscribe.push(a.AssetController.subscribeNetworkImages(()=>this.requestUpdate()),u.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["3","5","2","5"]}
          alignItems="center"
          gap="5"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="3" gap="2"> ${this.networksTemplate()} </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="3" gap="2">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="signOut"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="md-medium" color="secondary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?i.html`
        <wui-text variant="sm-regular" color="secondary" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:i.html`
      <wui-text variant="sm-regular" color="secondary" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){let e=s.ChainController.getAllRequestedCaipNetworks(),t=s.ChainController.getAllApprovedCaipNetworkIds(),o=c.CoreHelperUtil.sortRequestedNetworks(t,e);return(this.swapUnsupportedChain?o.filter(e=>eo.ConstantsUtil.SWAP_SUPPORTED_NETWORKS.includes(e.caipNetworkId)):o).map(e=>i.html`
        <wui-list-network
          imageSrc=${(0,n.ifDefined)(l.AssetUtil.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(e)}
        >
        </wui-list-network>
      `)}async onDisconnect(){try{this.disconnecting=!0;let e=s.ChainController.state.activeChain,t=et.ConnectionController.getConnections(e).length>0,i=e&&ei.ConnectorController.state.activeConnectorIds[e],o=this.remoteFeatures?.multiWallet;await et.ConnectionController.disconnect(o?{id:i,namespace:e}:{}),t&&o&&(er.RouterController.push("ProfileWallets"),en.SnackController.showSuccess("Wallet deleted"))}catch{F.EventsController.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),en.SnackController.showError("Failed to disconnect")}finally{this.disconnecting=!1}}async onSwitchNetwork(e){let t=s.ChainController.getActiveCaipAddress(),i=s.ChainController.getAllApprovedCaipNetworkIds(),o=(s.ChainController.getNetworkProp("supportsAllNetworks",e.chainNamespace),er.RouterController.state.data);t?i?.includes(e.caipNetworkId)?await s.ChainController.switchActiveNetwork(e):er.RouterController.push("SwitchNetwork",{...o,network:e}):t||(s.ChainController.setActiveCaipNetwork(e),er.RouterController.push("Connect"))}};ri.styles=re,rt([(0,r.state)()],ri.prototype,"disconnecting",void 0),rt([(0,r.state)()],ri.prototype,"remoteFeatures",void 0),ri=rt([(0,p.customElement)("w3m-unsupported-chain-view")],ri),e.s(["W3mUnsupportedChainView",()=>ri],516519);var ro=t,rr=t;let rn=g.css`
  wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
  }

  /* -- Types --------------------------------------------------------- */
  wui-flex[data-type='info'] {
    color: ${({tokens:e})=>e.theme.textSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-flex[data-type='success'] {
    color: ${({tokens:e})=>e.core.textSuccess};
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] {
    color: ${({tokens:e})=>e.core.textError};
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  wui-flex[data-type='warning'] {
    color: ${({tokens:e})=>e.core.textWarning};
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  wui-flex[data-type='info'] wui-icon-box {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex[data-type='success'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  wui-flex[data-type='warning'] wui-icon-box {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  wui-text {
    flex: 1;
  }
`;var ra=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let rl=class extends rr.LitElement{constructor(){super(...arguments),this.icon="externalLink",this.text="",this.type="info"}render(){return i.html`
      <wui-flex alignItems="center" data-type=${this.type}>
        <wui-icon-box size="sm" color="inherit" icon=${this.icon}></wui-icon-box>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
      </wui-flex>
    `}};rl.styles=[m.resetStyles,m.elementStyles,rn],ra([(0,o.property)()],rl.prototype,"icon",void 0),ra([(0,o.property)()],rl.prototype,"text",void 0),ra([(0,o.property)()],rl.prototype,"type",void 0),rl=ra([(0,p.customElement)("wui-banner")],rl);let rs=E.css`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`,rc=class extends ro.LitElement{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html` <wui-flex flexDirection="column" .padding=${["2","3","3","3"]} gap="2">
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=s.ChainController.getAllRequestedCaipNetworks(),t=s.ChainController.getAllApprovedCaipNetworkIds(),o=s.ChainController.state.activeCaipNetwork,r=s.ChainController.checkIfSmartAccountEnabled(),a=c.CoreHelperUtil.sortRequestedNetworks(t,e);if(r&&(0,eC.getPreferredAccountType)(o?.chainNamespace)===eI.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT){if(!o)return null;a=[o]}return a.filter(e=>e.chainNamespace===o?.chainNamespace).map(e=>i.html`
        <wui-list-network
          imageSrc=${(0,n.ifDefined)(l.AssetUtil.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};rc.styles=rs,rc=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-wallet-compatible-networks-view")],rc),e.s(["W3mWalletCompatibleNetworksView",()=>rc],427159);var rd=t,ru=t,rp=t;let rh=g.css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    box-shadow: 0 0 0 8px ${({tokens:e})=>e.theme.borderPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
  }

  :host([data-border-radius-full='true']) {
    border-radius: 50px;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`;var rm=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let rw=class extends rp.LitElement{render(){return this.dataset.borderRadiusFull=this.borderRadiusFull?"true":"false",i.html`${this.templateVisual()}`}templateVisual(){return this.imageSrc?i.html`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:i.html`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};rw.styles=[m.resetStyles,rh],rm([(0,o.property)()],rw.prototype,"imageSrc",void 0),rm([(0,o.property)()],rw.prototype,"alt",void 0),rm([(0,o.property)({type:Boolean})],rw.prototype,"borderRadiusFull",void 0),rw=rm([(0,p.customElement)("wui-visual-thumbnail")],rw);let rg=g.css`
  :host {
    display: flex;
    justify-content: center;
    gap: ${({spacing:e})=>e["4"]};
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`,rf=class extends ru.LitElement{constructor(){super(...arguments),this.dappImageUrl=u.OptionsController.state.metadata?.icons,this.walletImageUrl=s.ChainController.getAccountData()?.connectedWalletInfo?.icon}firstUpdated(){let e=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");e?.[0]&&this.createAnimation(e[0],"translate(18px)"),e?.[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){return i.html`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:"translateX(0px)"},{transform:t}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};rf.styles=rg,rf=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,p.customElement)("w3m-siwx-sign-message-thumbnails")],rf);var rb=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let rC=class extends rd.LitElement{constructor(){super(...arguments),this.dappName=u.OptionsController.state.metadata?.name,this.isCancelling=!1,this.isSigning=!1}render(){return i.html`
      <wui-flex justifyContent="center" .padding=${["8","0","6","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex .padding=${["0","20","5","20"]} gap="3" justifyContent="space-between">
        <wui-text variant="lg-medium" align="center" color="primary"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["0","10","4","10"]} gap="3" justifyContent="space-between">
        <wui-text variant="md-regular" align="center" color="secondary"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["4","5","5","5"]} gap="3" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-secondary"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?"Cancelling...":"Cancel"}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-primary"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0;try{await oz.SIWXUtil.requestSignMessage()}catch(e){if(e instanceof Error&&e.message.includes("OTP is required")){en.SnackController.showError({message:"Something went wrong. We need to verify your account again."}),er.RouterController.replace("DataCapture");return}throw e}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,await oz.SIWXUtil.cancelSignMessage().finally(()=>this.isCancelling=!1)}};rb([(0,r.state)()],rC.prototype,"isCancelling",void 0),rb([(0,r.state)()],rC.prototype,"isSigning",void 0),rC=rb([(0,p.customElement)("w3m-siwx-sign-message-view")],rC),e.s(["W3mSIWXSignMessageView",()=>rC],149566),e.s([],910842),e.i(910842),e.i(237287),e.i(972801),e.i(885873),e.i(619295),e.i(269311),e.i(979890),e.i(674950),e.i(107337),e.i(210149),e.i(28218),e.i(217283),e.i(904356),e.i(90344),e.i(612639),e.i(669783),e.i(108201),e.i(64077),e.i(667772),e.i(744216),e.i(569962),e.i(505676),e.i(317016),e.i(843476),e.i(516519),e.i(427159),e.i(149566),e.s(["AppKitAccountButton",()=>$,"AppKitButton",()=>I,"AppKitConnectButton",()=>z,"AppKitNetworkButton",()=>Y,"W3mAccountButton",()=>x,"W3mAccountSettingsView",()=>ew,"W3mAccountView",()=>e8,"W3mAllWalletsView",()=>ii,"W3mButton",()=>T,"W3mChooseAccountNameView",()=>o$,"W3mConnectButton",()=>j,"W3mConnectView",()=>iB,"W3mConnectWalletsView",()=>oW,"W3mConnectingExternalView",()=>i1,"W3mConnectingMultiChainView",()=>i6,"W3mConnectingWcBasicView",()=>ob,"W3mConnectingWcView",()=>ow,"W3mDownloadsView",()=>oE,"W3mFooter",()=>J.W3mFooter,"W3mFundWalletView",()=>tS,"W3mGetWalletView",()=>oA,"W3mNetworkButton",()=>X,"W3mNetworkSwitchView",()=>oV,"W3mNetworksView",()=>o0,"W3mProfileWalletsView",()=>t$,"W3mRouter",()=>Q.W3mRouter,"W3mSIWXSignMessageView",()=>rC,"W3mSwitchActiveChainView",()=>o4,"W3mUnsupportedChainView",()=>ri,"W3mWalletCompatibleNetworksView",()=>rc,"W3mWhatIsANetworkView",()=>o7,"W3mWhatIsAWalletView",()=>oU],442696)}]);

//# debugId=a1e29f1b-0b91-d598-9db3-3cea35f27813
