;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="32fc56ad-9f67-b45d-8d4c-b75c0c337f24")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,854712,683544,749991,752869,891602,662703,972122,746668,e=>{"use strict";e.i(812207);var t=e.i(604148),i=e.i(654479);e.i(374576);var n=e.i(56350);e.i(234051);var r=e.i(829389),a=e.i(436220),s=e.i(960398),o=e.i(971080),l=e.i(149454),c=e.i(803468),u=e.i(221728),d=e.i(811424);e.i(404041);var p=e.i(645975);e.i(534420),e.i(62238),e.i(443452);var m=t,h=e.i(120119);e.i(852634);var g=e.i(459088),y=e.i(162611);let w=y.css`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var f=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let b=class extends m.LitElement{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return i.html`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${(0,r.ifDefined)(this.iconSize)}></wui-icon>
    </button>`}};b.styles=[g.resetStyles,g.elementStyles,w],f([(0,h.property)()],b.prototype,"icon",void 0),f([(0,h.property)()],b.prototype,"variant",void 0),f([(0,h.property)()],b.prototype,"type",void 0),f([(0,h.property)()],b.prototype,"size",void 0),f([(0,h.property)()],b.prototype,"iconSize",void 0),f([(0,h.property)({type:Boolean})],b.prototype,"fullWidth",void 0),f([(0,h.property)({type:Boolean})],b.prototype,"disabled",void 0),b=f([(0,p.customElement)("wui-icon-button")],b),e.s([],683544),e.i(907170),e.i(869609),e.i(143053),e.i(421147),e.i(774339),e.i(79929),e.i(249536),e.i(956303),e.s(["DIRECT_TRANSFER_DEPOSIT_TYPE",()=>ex,"DIRECT_TRANSFER_REQUEST_ID",()=>eb,"DIRECT_TRANSFER_TRANSACTION_TYPE",()=>ev,"PayController",()=>ek],749991);var x=e.i(365801),v=e.i(742710),C=e.i(401564),k=e.i(675457),P=e.i(150576),E=e.i(227302),A=e.i(653157),S=e.i(518887),I=e.i(769718);let $="INVALID_PAYMENT_CONFIG",N="INVALID_RECIPIENT",T="INVALID_ASSET",U="INVALID_AMOUNT",R="UNABLE_TO_INITIATE_PAYMENT",D="INVALID_CHAIN_NAMESPACE",q="GENERIC_PAYMENT_ERROR",O="UNABLE_TO_GET_EXCHANGES",_="ASSET_NOT_SUPPORTED",j="UNABLE_TO_GET_PAY_URL",F="UNABLE_TO_GET_BUY_STATUS",L="UNABLE_TO_GET_QUOTE",z="UNABLE_TO_GET_QUOTE_STATUS",B="INVALID_RECIPIENT_ADDRESS_FOR_ASSET",W={[$]:"Invalid payment configuration",[N]:"Invalid recipient address",[T]:"Invalid asset specified",[U]:"Invalid payment amount",[B]:"Invalid recipient address for the asset selected",UNKNOWN_ERROR:"Unknown payment error occurred",[R]:"Unable to initiate payment",[D]:"Invalid chain namespace",[q]:"Unable to process payment",[O]:"Unable to get exchanges",[_]:"Asset not supported by the selected exchange",[j]:"Unable to get payment URL",[F]:"Unable to get buy status",UNABLE_TO_GET_TOKEN_BALANCES:"Unable to get token balances",[L]:"Unable to get quote. Please choose a different token",[z]:"Unable to get quote status"};class M extends Error{get message(){return W[this.code]}constructor(e,t){super(W[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,M)}}var Q=e.i(364258),H=e.i(82283),K=e.i(564126);let Y="reown_test";var G=e.i(959204),V=e.i(462579);async function J(e,t,i){if(t!==C.ConstantsUtil.CHAIN.EVM)throw new M(D);if(!i.fromAddress)throw new M($,"fromAddress is required for native EVM payments.");let n="string"==typeof i.amount?parseFloat(i.amount):i.amount;if(isNaN(n))throw new M($);let r=e.metadata?.decimals??18,a=o.ConnectionController.parseUnits(n.toString(),r);if("bigint"!=typeof a)throw new M(q);return await o.ConnectionController.sendTransaction({chainNamespace:t,to:i.recipient,address:i.fromAddress,value:a,data:"0x"})??void 0}async function X(e,t){if(!t.fromAddress)throw new M($,"fromAddress is required for ERC20 EVM payments.");let i=e.asset,n=t.recipient,r=Number(e.metadata.decimals),a=o.ConnectionController.parseUnits(t.amount.toString(),r);if(void 0===a)throw new M(q);return await o.ConnectionController.writeContract({fromAddress:t.fromAddress,tokenAddress:i,args:[n,a],method:"transfer",abi:G.ContractUtil.getERC20Abi(i),chainNamespace:C.ConstantsUtil.CHAIN.EVM})??void 0}async function Z(e,t){if(e!==C.ConstantsUtil.CHAIN.SOLANA)throw new M(D);if(!t.fromAddress)throw new M($,"fromAddress is required for Solana payments.");let i="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(i)||i<=0)throw new M($,"Invalid payment amount.");try{if(!V.ProviderController.getProvider(e))throw new M(q,"No Solana provider available.");let n=await o.ConnectionController.sendTransaction({chainNamespace:C.ConstantsUtil.CHAIN.SOLANA,to:t.recipient,value:i,tokenMint:t.tokenMint});if(!n)throw new M(q,"Transaction failed.");return n}catch(e){if(e instanceof M)throw e;throw new M(q,`Solana payment failed: ${e}`)}}async function ee({sourceToken:e,toToken:t,amount:i,recipient:n}){let r=o.ConnectionController.parseUnits(i,e.metadata.decimals),a=o.ConnectionController.parseUnits(i,t.metadata.decimals);return Promise.resolve({type:eb,origin:{amount:r?.toString()??"0",currency:e},destination:{amount:a?.toString()??"0",currency:t},fees:[{id:"service",label:"Service Fee",amount:"0",currency:t}],steps:[{requestId:eb,type:"deposit",deposit:{amount:r?.toString()??"0",currency:e.asset,receiver:n}}],timeInSeconds:6})}function et(e){if(!e)return null;let t=e.steps[0];return t&&t.type===ex?t:null}function ei(e,t=0){if(!e)return[];let i=e.steps.filter(e=>e.type===ev),n=i.filter((e,i)=>i+1>t);return i.length>0&&i.length<3?n:[]}let en=new Q.FetchUtil({baseUrl:E.CoreHelperUtil.getApiUrl(),clientId:null});class er extends Error{}function ea(){let{projectId:e,sdkType:t,sdkVersion:i}=H.OptionsController.state;return{projectId:e,st:t||"appkit",sv:i||"html-wagmi-4.2.2"}}async function es(e,t){let i,n=(i=H.OptionsController.getSnapshot().projectId,`https://rpc.walletconnect.org/v1/json-rpc?projectId=${i}`),{sdkType:r,sdkVersion:a,projectId:s}=H.OptionsController.getSnapshot(),o={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:r,sv:a,projectId:s}},l=await fetch(n,{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}}),c=await l.json();if(c.error)throw new er(c.error.message);return c}async function eo(e){return(await es("reown_getExchanges",e)).result}async function el(e){return(await es("reown_getExchangePayUrl",e)).result}async function ec(e){return(await es("reown_getExchangeBuyStatus",e)).result}async function eu(e){let t=k.NumberUtil.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:i,chainNamespace:n}=P.ParseUtil.parseCaipNetworkId(e.sourceToken.network),{chainId:r,chainNamespace:a}=P.ParseUtil.parseCaipNetworkId(e.toToken.network),s="native"===e.sourceToken.asset?(0,K.getNativeTokenAddress)(n):e.sourceToken.asset,o="native"===e.toToken.asset?(0,K.getNativeTokenAddress)(a):e.toToken.asset;return await en.post({path:"/appkit/v1/transfers/quote",body:{user:e.address,originChainId:i.toString(),originCurrency:s,destinationChainId:r.toString(),destinationCurrency:o,recipient:e.recipient,amount:t},params:ea()})}async function ed(e){let t=I.HelpersUtil.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),i=I.HelpersUtil.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&i?ee(e):eu(e)}async function ep(e){return await en.get({path:"/appkit/v1/transfers/status",params:{requestId:e.requestId,...ea()}})}async function em(e){return await en.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:ea()})}let eh=["eip155","solana"],eg={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function ey(e,t){let{chainNamespace:i,chainId:n}=P.ParseUtil.parseCaipNetworkId(e),r=eg[i];if(!r)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${i}`);let a=r.native.assetNamespace,s=r.native.assetReference;"native"!==t&&(a=r.defaultTokenNamespace,s=t);let o=`${i}:${n}`;return`${o}/${a}:${s}`}function ew(e){let t=k.NumberUtil.bigNumber(e,{safe:!0});return t.lt(.001)?"<0.001":t.round(4).toString()}let ef="unknown",eb="direct-transfer",ex="deposit",ev="transaction",eC=(0,x.proxy)({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[C.ConstantsUtil.CHAIN.EVM]:[],[C.ConstantsUtil.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),ek={state:eC,subscribe:e=>(0,x.subscribe)(eC,()=>e(eC)),subscribeKey:(e,t)=>(0,v.subscribeKey)(eC,e,t),async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),function(){let{chainNamespace:e}=P.ParseUtil.parseCaipNetworkId(ek.state.paymentAsset.network);if(!E.CoreHelperUtil.isAddress(ek.state.recipient,e))throw new M(B,`Provide valid recipient address for namespace "${e}"`)}(),await this.prepareTokenLogo(),eC.isConfigured=!0,A.EventsController.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:eC.exchanges,configuration:{network:eC.paymentAsset.network,asset:eC.paymentAsset.asset,recipient:eC.recipient,amount:eC.amount}}}),await c.ModalController.open({view:"Pay"})},resetState(){eC.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},eC.recipient="0x0",eC.amount=0,eC.isConfigured=!1,eC.error=null,eC.isPaymentInProgress=!1,eC.isLoading=!1,eC.currentPayment=void 0,eC.selectedExchange=void 0,eC.exchangeUrlForQuote=void 0,eC.requestId=void 0},resetQuoteState(){eC.quote=void 0,eC.quoteStatus="waiting",eC.quoteError=null,eC.isFetchingQuote=!1,eC.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new M($);try{eC.choice=e.choice??"pay",eC.paymentAsset=e.paymentAsset,eC.recipient=e.recipient,eC.amount=e.amount,eC.openInNewTab=e.openInNewTab??!0,eC.redirectUrl=e.redirectUrl,eC.payWithExchange=e.payWithExchange,eC.error=null}catch(e){throw new M($,e.message)}},setSelectedPaymentAsset(e){eC.selectedPaymentAsset=e},setSelectedExchange(e){eC.selectedExchange=e},setRequestId(e){eC.requestId=e},setPaymentInProgress(e){eC.isPaymentInProgress=e},getPaymentAsset:()=>eC.paymentAsset,getExchanges:()=>eC.exchanges,async fetchExchanges(){try{eC.isLoading=!0,eC.exchanges=(await eo({page:0})).exchanges.slice(0,2)}catch(e){throw d.SnackController.showError(W.UNABLE_TO_GET_EXCHANGES),new M(O)}finally{eC.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?ey(e.network,e.asset):void 0;return await eo({page:e?.page??0,asset:t,amount:e?.amount?.toString()})}catch(e){throw new M(O)}},async getPayUrl(e,t,i=!1){try{let n=Number(t.amount),r=await el({exchangeId:e,asset:ey(t.network,t.asset),amount:n.toString(),recipient:`${t.network}:${t.recipient}`});return A.EventsController.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:n},currentPayment:{type:"exchange",exchangeId:e},headless:i}}),i&&(this.initiatePayment(),A.EventsController.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:eC.paymentId||ef,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:n},currentPayment:{type:"exchange",exchangeId:e}}})),r}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw new M(_);throw Error(e.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:i,recipient:n}){let r=await el({exchangeId:e,asset:ey(t.network,t.asset),amount:i.toString(),recipient:n});eC.exchangeSessionId=r.sessionId,eC.exchangeUrlForQuote=r.url},async openPayUrl(e,t,i=!1){try{let n=await this.getPayUrl(e.exchangeId,t,i);if(!n)throw new M(j);let r=e.openInNewTab??!0;return E.CoreHelperUtil.openHref(n.url,r?"_blank":"_self"),n}catch(e){throw e instanceof M?eC.error=e.message:eC.error=W.GENERIC_PAYMENT_ERROR,new M(j)}},async onTransfer({chainNamespace:e,fromAddress:t,toAddress:i,amount:n,paymentAsset:r}){if(eC.currentPayment={type:"wallet",status:"IN_PROGRESS"},!eC.isPaymentInProgress)try{this.initiatePayment();let a=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===r.network);if(!a)throw Error("Target network not found");let o=s.ChainController.state.activeCaipNetwork;switch(!I.HelpersUtil.isLowerCaseMatch(o?.caipNetworkId,a.caipNetworkId)&&await s.ChainController.switchActiveNetwork(a),e){case C.ConstantsUtil.CHAIN.EVM:"native"===r.asset&&(eC.currentPayment.result=await J(r,e,{recipient:i,amount:n,fromAddress:t})),r.asset.startsWith("0x")&&(eC.currentPayment.result=await X(r,{recipient:i,amount:n,fromAddress:t})),eC.currentPayment.status="SUCCESS";break;case C.ConstantsUtil.CHAIN.SOLANA:eC.currentPayment.result=await Z(e,{recipient:i,amount:n,fromAddress:t,tokenMint:"native"===r.asset?void 0:r.asset}),eC.currentPayment.status="SUCCESS";break;default:throw new M(D)}}catch(e){throw e instanceof M?eC.error=e.message:eC.error=W.GENERIC_PAYMENT_ERROR,eC.currentPayment.status="FAILED",d.SnackController.showError(eC.error),e}finally{eC.isPaymentInProgress=!1}},async onSendTransaction(e){try{let{namespace:t,transactionStep:i}=e;ek.initiatePayment();let n=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===eC.paymentAsset?.network);if(!n)throw Error("Target network not found");let r=s.ChainController.state.activeCaipNetwork;if(I.HelpersUtil.isLowerCaseMatch(r?.caipNetworkId,n.caipNetworkId)||await s.ChainController.switchActiveNetwork(n),t===C.ConstantsUtil.CHAIN.EVM){let{from:e,to:n,data:r,value:a}=i.transaction;await o.ConnectionController.sendTransaction({address:e,to:n,data:r,value:BigInt(a),chainNamespace:t})}else if(t===C.ConstantsUtil.CHAIN.SOLANA){let{instructions:e}=i.transaction;await o.ConnectionController.writeSolanaTransaction({instructions:e})}}catch(e){throw e instanceof M?eC.error=e.message:eC.error=W.GENERIC_PAYMENT_ERROR,d.SnackController.showError(eC.error),e}finally{eC.isPaymentInProgress=!1}},getExchangeById:e=>eC.exchanges.find(t=>t.id===e),validatePayConfig(e){let{paymentAsset:t,recipient:i,amount:n}=e;if(!t)throw new M($);if(!i)throw new M(N);if(!t.asset)throw new M(T);if(null==n||n<=0)throw new M(U)},async handlePayWithExchange(e){try{eC.currentPayment={type:"exchange",exchangeId:e};let{network:t,asset:i}=eC.paymentAsset,n={network:t,asset:i,amount:eC.amount,recipient:eC.recipient},r=await this.getPayUrl(e,n);if(!r)throw new M(R);return eC.currentPayment.sessionId=r.sessionId,eC.currentPayment.status="IN_PROGRESS",eC.currentPayment.exchangeId=e,this.initiatePayment(),{url:r.url,openInNewTab:eC.openInNewTab}}catch(e){return e instanceof M?eC.error=e.message:eC.error=W.GENERIC_PAYMENT_ERROR,eC.isPaymentInProgress=!1,d.SnackController.showError(eC.error),null}},async getBuyStatus(e,t){try{let i=await ec({sessionId:t,exchangeId:e});return("SUCCESS"===i.status||"FAILED"===i.status)&&A.EventsController.sendEvent({type:"track",event:"SUCCESS"===i.status?"PAY_SUCCESS":"PAY_ERROR",properties:{message:"FAILED"===i.status?E.CoreHelperUtil.parseError(eC.error):void 0,source:"pay",paymentId:eC.paymentId||ef,configuration:{network:eC.paymentAsset.network,asset:eC.paymentAsset.asset,recipient:eC.recipient,amount:eC.amount},currentPayment:{type:"exchange",exchangeId:eC.currentPayment?.exchangeId,sessionId:eC.currentPayment?.sessionId,result:i.txHash}}}),i}catch(e){throw new M(F)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:i}){if(!e)return[];let{address:n}=P.ParseUtil.parseCaipAddress(e),r=t;return i===C.ConstantsUtil.CHAIN.EVM&&(r=void 0),await S.BalanceUtil.getMyTokensWithBalance({address:n,caipNetwork:r})},async fetchTokensFromExchange(){if(!eC.selectedExchange)return[];let e=Object.values((await em(eC.selectedExchange.id)).assets).flat();return await Promise.all(e.map(async e=>{let t={chainId:e.network,address:`${e.network}:${e.asset}`,symbol:e.metadata.symbol,name:e.metadata.name,iconUrl:e.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:e.metadata.decimals.toString()}},{chainNamespace:i}=P.ParseUtil.parseCaipNetworkId(t.chainId),n=t.address;if(E.CoreHelperUtil.isCaipAddress(n)){let{address:e}=P.ParseUtil.parseCaipAddress(n);n=e}return t.iconUrl=await a.AssetUtil.getImageByToken(n??"",i).catch(()=>void 0)??"",t}))},async fetchTokens({caipAddress:e,caipNetwork:t,namespace:i}){try{eC.isFetchingTokenBalances=!0;let n=eC.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:i}),r=await n;eC.tokenBalances={...eC.tokenBalances,[i]:r}}catch(t){let e=t instanceof Error?t.message:"Unable to get token balances";d.SnackController.showError(e)}finally{eC.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:t,sourceToken:i,toToken:n,recipient:r}){try{ek.resetQuoteState(),eC.isFetchingQuote=!0;let a=await ed({amount:e,address:eC.selectedExchange?void 0:t,sourceToken:i,toToken:n,recipient:r});if(eC.selectedExchange){let e=et(a);if(e){let t=`${i.network}:${e.deposit.receiver}`,n=k.NumberUtil.formatNumber(e.deposit.amount,{decimals:i.metadata.decimals??0,round:8});await ek.generateExchangeUrlForQuote({exchangeId:eC.selectedExchange.id,paymentAsset:i,amount:n.toString(),recipient:t})}}eC.quote=a}catch(t){let e=W.UNABLE_TO_GET_QUOTE;if(t instanceof Error&&t.cause&&t.cause instanceof Response)try{let i=await t.cause.json();i.error&&"string"==typeof i.error&&(e=i.error)}catch{}throw eC.quoteError=e,d.SnackController.showError(e),new M(L)}finally{eC.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===eb){let e=eC.selectedExchange,t=eC.exchangeSessionId;if(e&&t){switch((await this.getBuyStatus(e.id,t)).status){case"IN_PROGRESS":case"UNKNOWN":default:eC.quoteStatus="waiting";break;case"SUCCESS":eC.quoteStatus="success",eC.isPaymentInProgress=!1;break;case"FAILED":eC.quoteStatus="failure",eC.isPaymentInProgress=!1}return}eC.quoteStatus="success";return}let{status:t}=await ep({requestId:e});eC.quoteStatus=t}catch{throw eC.quoteStatus="failure",new M(z)}},initiatePayment(){eC.isPaymentInProgress=!0,eC.paymentId=crypto.randomUUID()},initializeAnalytics(){eC.analyticsSet||(eC.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(eC.currentPayment?.status&&"UNKNOWN"!==eC.currentPayment.status){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[eC.currentPayment.status];A.EventsController.sendEvent({type:"track",event:e,properties:{message:"FAILED"===eC.currentPayment.status?E.CoreHelperUtil.parseError(eC.error):void 0,source:"pay",paymentId:eC.paymentId||ef,configuration:{network:eC.paymentAsset.network,asset:eC.paymentAsset.asset,recipient:eC.recipient,amount:eC.amount},currentPayment:{type:eC.currentPayment.type,exchangeId:eC.currentPayment.exchangeId,sessionId:eC.currentPayment.sessionId,result:eC.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!eC.paymentAsset.metadata.logoURI)try{let{chainNamespace:e}=P.ParseUtil.parseCaipNetworkId(eC.paymentAsset.network),t=await a.AssetUtil.getImageByToken(eC.paymentAsset.asset,e);eC.paymentAsset.metadata.logoURI=t}catch{}}},eP=y.css`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`;var eE=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let eA=class extends t.LitElement{constructor(){super(),this.unsubscribe=[],this.amount=ek.state.amount,this.namespace=void 0,this.paymentAsset=ek.state.paymentAsset,this.activeConnectorIds=l.ConnectorController.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=ek.state.exchanges,this.isLoading=ek.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(ek.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(l.ConnectorController.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(ek.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(ek.subscribeKey("isLoading",e=>this.isLoading=e)),ek.fetchExchanges(),ek.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return i.html`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let e=s.ChainController.state.activeChain;this.namespace=e,this.caipAddress=s.ChainController.getAccountData(e)?.caipAddress,this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},e))}paymentDetailsTemplate(){let e=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return i.html`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${ew(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${e?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${(0,r.ifDefined)(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${(0,r.ifDefined)(a.AssetUtil.getNetworkImage(e))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return!function(e){let{chainNamespace:t}=P.ParseUtil.parseCaipNetworkId(e);return eh.includes(t)}(this.paymentAsset.network)?i.html``:this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate()}connectedWalletTemplate(){let{name:e,image:t}=this.getWalletProperties({namespace:this.namespace});return i.html`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${(0,r.ifDefined)(t)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return i.html`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return i.html`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let e=this.exchanges.filter(e=>{var t;let i;return(t=this.paymentAsset,(i=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===t.network))&&i.testnet)?e.id===Y:e.id!==Y});return 0===e.length?i.html`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:e.map(e=>i.html`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(e)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          imageSrc=${(0,r.ifDefined)(e.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${e.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return i.html`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw Error("Namespace not found");this.caipAddress?u.RouterController.push("PayQuote"):(await l.ConnectorController.connect(),await c.ModalController.open({view:"PayQuote"}))}onExchangePayment(e){ek.setSelectedExchange(e),u.RouterController.push("PayQuote")}async onDisconnect(){try{await o.ConnectionController.disconnect(),await c.ModalController.open({view:"Pay"})}catch{console.error("Failed to disconnect"),d.SnackController.showError("Failed to disconnect")}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let i=l.ConnectorController.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};let n=a.AssetUtil.getConnectorImage(i);return{name:i.name,image:n}}};eA.styles=eP,eE([(0,n.state)()],eA.prototype,"amount",void 0),eE([(0,n.state)()],eA.prototype,"namespace",void 0),eE([(0,n.state)()],eA.prototype,"paymentAsset",void 0),eE([(0,n.state)()],eA.prototype,"activeConnectorIds",void 0),eE([(0,n.state)()],eA.prototype,"caipAddress",void 0),eE([(0,n.state)()],eA.prototype,"exchanges",void 0),eE([(0,n.state)()],eA.prototype,"isLoading",void 0),eA=eE([(0,p.customElement)("w3m-pay-view")],eA),e.s(["W3mPayView",()=>eA],752869);var eS=t;e.i(653976);var eI=e.i(293090),e$=e.i(112699),eN=t;let eT=y.css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var eU=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let eR={"accent-primary":y.vars.tokens.core.backgroundAccentPrimary},eD=class extends eN.LitElement{constructor(){super(...arguments),this.rings=3,this.duration=2,this.opacity=.3,this.size="200px",this.variant="accent-primary"}render(){let e=eR[this.variant];this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${e};
      --pulse-opacity: ${this.opacity};
    `;let t=Array.from({length:this.rings},(e,t)=>this.renderRing(t,this.rings));return i.html`
      <div class="pulse-container">
        <div class="pulse-rings">${t}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(e,t){let n=e/t*this.duration,r=`animation-delay: ${n}s;`;return i.html`<div class="pulse-ring" style=${r}></div>`}};eD.styles=[g.resetStyles,eT],eU([(0,h.property)({type:Number})],eD.prototype,"rings",void 0),eU([(0,h.property)({type:Number})],eD.prototype,"duration",void 0),eU([(0,h.property)({type:Number})],eD.prototype,"opacity",void 0),eU([(0,h.property)()],eD.prototype,"size",void 0),eU([(0,h.property)()],eD.prototype,"variant",void 0),eD=eU([(0,p.customElement)("wui-pulse")],eD);let eq=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],eO=["success","submitted","failure","timeout","refund"],e_=y.css`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`;var ej=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let eF={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]},eL=class extends eS.LitElement{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=ek.state.paymentAsset,this.quoteStatus=ek.state.quoteStatus,this.quote=ek.state.quote,this.amount=ek.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=l.ConnectorController.state.activeConnectorIds,this.selectedExchange=ek.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(ek.subscribeKey("quoteStatus",e=>this.quoteStatus=e),ek.subscribeKey("quote",e=>this.quote=e),l.ConnectorController.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e),ek.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(e=>e())}render(){return i.html`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let e=ew(this.amount||"0"),t=this.paymentAsset.metadata.symbol??"Unknown",n=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network),o="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus;return"success"===this.quoteStatus||"submitted"===this.quoteStatus?i.html`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:o?i.html`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:i.html`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${(0,r.ifDefined)(a.AssetUtil.getNetworkImage(n))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${e} ${t}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return i.html`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let e=this.getStepsWithStatus();return i.html`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${e.map(e=>this.renderStep(e))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let e="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus,t="success"===this.quoteStatus||"submitted"===this.quoteStatus;if(e)return i.html`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(t)return i.html`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;let n=this.quote?.timeInSeconds??0;return i.html`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${n} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let e=s.ChainController.getAllRequestedCaipNetworks().find(e=>{let t=this.quote?.origin.currency.network;if(!t)return!1;let{chainId:i}=P.ParseUtil.parseCaipNetworkId(t);return I.HelpersUtil.isLowerCaseMatch(e.id.toString(),i.toString())}),t=ew(k.NumberUtil.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString()),n=this.quote?.origin.currency.metadata.symbol??"Unknown";return i.html`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${t}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${n}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${(0,r.ifDefined)(a.AssetUtil.getNetworkImage(e))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${e?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return i.html`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Wallet</wui-text>

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:e}=this.getWalletProperties({namespace:this.namespace}),{address:t}=this.caipAddress?P.ParseUtil.parseCaipAddress(this.caipAddress):{},n=this.selectedExchange?.name;return this.selectedExchange?i.html`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${n}</wui-text>
          <wui-image src=${(0,r.ifDefined)(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:i.html`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${e$.UiHelperUtil.getTruncateString({string:this.profileName||t||n||"",charsStart:this.profileName?16:4,charsEnd:6*!this.profileName,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${(0,r.ifDefined)(e)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return"failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus?eq.map(e=>({...e,status:"failed"})):eq.map(e=>{let t=(eF[e.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...e,status:t}})}renderStep({title:e,icon:t,status:n}){return i.html`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${t} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${(0,eI.classMap)({"step-icon-box":!0,success:"completed"===n})}>
            ${this.renderStatusIndicator(n)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${e}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(e){return"completed"===e?i.html`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:"failed"===e?i.html`<wui-icon size="sm" color="error" name="close"></wui-icon>`:"pending"===e?i.html`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},3e3))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){let e=ek.state.requestId;if(!e||eO.includes(this.quoteStatus))this.stopPolling();else try{await ek.fetchQuoteStatus({requestId:e}),eO.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let e=s.ChainController.state.activeChain;this.namespace=e,this.caipAddress=s.ChainController.getAccountData(e)?.caipAddress,this.profileName=s.ChainController.getAccountData(e)?.profileName??null,this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null},e))}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let i=l.ConnectorController.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};let n=a.AssetUtil.getConnectorImage(i);return{name:i.name,image:n}}};eL.styles=e_,ej([(0,n.state)()],eL.prototype,"paymentAsset",void 0),ej([(0,n.state)()],eL.prototype,"quoteStatus",void 0),ej([(0,n.state)()],eL.prototype,"quote",void 0),ej([(0,n.state)()],eL.prototype,"amount",void 0),ej([(0,n.state)()],eL.prototype,"namespace",void 0),ej([(0,n.state)()],eL.prototype,"caipAddress",void 0),ej([(0,n.state)()],eL.prototype,"profileName",void 0),ej([(0,n.state)()],eL.prototype,"activeConnectorIds",void 0),ej([(0,n.state)()],eL.prototype,"selectedExchange",void 0),eL=ej([(0,p.customElement)("w3m-pay-loading-view")],eL),e.s(["W3mPayLoadingView",()=>eL],891602);var ez=t;e.i(604415);var eB=t;e.i(780313);var eW=e.i(592057);let eM=eW.css`
  :host {
    display: block;
  }
`,eQ=class extends eB.LitElement{render(){return i.html`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};eQ.styles=[eM],eQ=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s}([(0,p.customElement)("w3m-pay-fees-skeleton")],eQ);var eH=t;let eK=y.css`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var eY=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let eG=class extends eH.LitElement{constructor(){super(),this.unsubscribe=[],this.quote=ek.state.quote,this.unsubscribe.push(ek.subscribeKey("quote",e=>this.quote=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=k.NumberUtil.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return i.html`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${e} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(e=>this.renderFee(e)):null}
      </wui-flex>
    `}renderFee(e){let t="network"===e.id,n=k.NumberUtil.formatNumber(e.amount||"0",{decimals:e.currency.metadata.decimals??0,round:6}).toString();if(t){let t=s.ChainController.getAllRequestedCaipNetworks().find(t=>I.HelpersUtil.isLowerCaseMatch(t.caipNetworkId,e.currency.network));return i.html`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${n} ${e.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${(0,r.ifDefined)(a.AssetUtil.getNetworkImage(t))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${t?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return i.html`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${n} ${e.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};eG.styles=[eK],eY([(0,n.state)()],eG.prototype,"quote",void 0),eG=eY([(0,p.customElement)("w3m-pay-fees")],eG);var eV=t;let eJ=y.css`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var eX=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let eZ=class extends eV.LitElement{constructor(){super(),this.unsubscribe=[],this.selectedExchange=ek.state.selectedExchange,this.unsubscribe.push(ek.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=!!this.selectedExchange;return i.html`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${e?null:i.html`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};eZ.styles=[eJ],eX([(0,h.property)({type:Array})],eZ.prototype,"selectedExchange",void 0),eZ=eX([(0,p.customElement)("w3m-pay-options-empty")],eZ);var e0=t;let e1=y.css`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`,e3=class extends e0.LitElement{render(){return i.html`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return i.html`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};e3.styles=[e1],e3=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s}([(0,p.customElement)("w3m-pay-options-skeleton")],e3);var e2=t,e5=e.i(608601);let e4=y.css`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var e6=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let e8=class extends e2.LitElement{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect();let e=this.shadowRoot?.querySelector(".pay-options-container");e?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(".pay-options-container");e&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),e?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(e),this.handleOptionsListScroll())}render(){return i.html`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(e=>this.payOptionTemplate(e))}
      </wui-flex>
    `}payOptionTemplate(e){let{network:t,metadata:n,asset:o,amount:l="0"}=e,c=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===t),u=`${t}:${o}`,d=`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,p=k.NumberUtil.bigNumber(l,{safe:!0}),m=p.gt(0);return i.html`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(e)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${(0,r.ifDefined)(n.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${(0,r.ifDefined)(a.AssetUtil.getNetworkImage(c))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${n.symbol}</wui-text>
            ${m?i.html`<wui-text variant="sm-regular" color="secondary">
                  ${p.round(6).toString()} ${n.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${u===d?i.html`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let e=this.shadowRoot?.querySelector(".pay-options-container");e&&(e.scrollHeight>300?(e.style.setProperty("--options-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--options-scroll--top-opacity",e5.MathUtil.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--options-scroll--bottom-opacity",e5.MathUtil.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--options-mask-image","none"),e.style.setProperty("--options-scroll--top-opacity","0"),e.style.setProperty("--options-scroll--bottom-opacity","0")))}};e8.styles=[e4],e6([(0,h.property)({type:Array})],e8.prototype,"options",void 0),e6([(0,h.property)()],e8.prototype,"selectedPaymentAsset",void 0),e6([(0,h.property)()],e8.prototype,"onSelect",void 0),e8=e6([(0,p.customElement)("w3m-pay-options")],e8);let e9=y.css`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var e7=function(e,t,i,n){var r,a=arguments.length,s=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(a<3?r(s):a>3?r(t,i,s):r(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let te={eip155:{icon:"ethereum",label:"EVM"},solana:{icon:"solana",label:"Solana"},bip122:{icon:"bitcoin",label:"Bitcoin"},ton:{icon:"ton",label:"Ton"}},tt=class extends ez.LitElement{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=ek.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=ek.state.amount,this.recipient=ek.state.recipient,this.activeConnectorIds=l.ConnectorController.state.activeConnectorIds,this.selectedPaymentAsset=ek.state.selectedPaymentAsset,this.selectedExchange=ek.state.selectedExchange,this.isFetchingQuote=ek.state.isFetchingQuote,this.quoteError=ek.state.quoteError,this.quote=ek.state.quote,this.isFetchingTokenBalances=ek.state.isFetchingTokenBalances,this.tokenBalances=ek.state.tokenBalances,this.isPaymentInProgress=ek.state.isPaymentInProgress,this.exchangeUrlForQuote=ek.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(ek.subscribeKey("paymentAsset",e=>this.paymentAsset=e)),this.unsubscribe.push(ek.subscribeKey("tokenBalances",e=>this.onTokenBalancesChanged(e))),this.unsubscribe.push(ek.subscribeKey("isFetchingTokenBalances",e=>this.isFetchingTokenBalances=e)),this.unsubscribe.push(l.ConnectorController.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(ek.subscribeKey("selectedPaymentAsset",e=>this.selectedPaymentAsset=e)),this.unsubscribe.push(ek.subscribeKey("isFetchingQuote",e=>this.isFetchingQuote=e)),this.unsubscribe.push(ek.subscribeKey("quoteError",e=>this.quoteError=e)),this.unsubscribe.push(ek.subscribeKey("quote",e=>this.quote=e)),this.unsubscribe.push(ek.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(ek.subscribeKey("recipient",e=>this.recipient=e)),this.unsubscribe.push(ek.subscribeKey("isPaymentInProgress",e=>this.isPaymentInProgress=e)),this.unsubscribe.push(ek.subscribeKey("selectedExchange",e=>this.selectedExchange=e)),this.unsubscribe.push(ek.subscribeKey("exchangeUrlForQuote",e=>this.exchangeUrlForQuote=e)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(e=>e())}updated(e){super.updated(e),e.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return i.html`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let e=k.NumberUtil.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return i.html`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?i.html`<wui-text variant="lg-regular" color="primary">
                ${k.NumberUtil.bigNumber(e,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:i.html`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let e=E.CoreHelperUtil.getPlainAddress(this.caipAddress)??"",{name:t,image:n}=this.getWalletProperties({namespace:this.namespace}),{icon:a,label:s}=te[this.namespace]??{};return i.html`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${(0,r.ifDefined)(this.profileName)}
          address=${(0,r.ifDefined)(e)}
          imageSrc=${(0,r.ifDefined)(n)}
          alt=${(0,r.ifDefined)(t)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${(0,r.ifDefined)(s)}
          address=${(0,r.ifDefined)(e)}
          icon=${(0,r.ifDefined)(a)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${(0,r.ifDefined)(s)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let e=s.ChainController.state.activeChain;this.namespace=e,this.caipAddress=s.ChainController.getAccountData(e)?.caipAddress,this.profileName=s.ChainController.getAccountData(e)?.profileName??null,this.unsubscribe.push(s.ChainController.subscribeChainProp("accountState",e=>this.onAccountStateChanged(e),e))}async fetchTokens(){if(this.namespace){let e;if(this.caipAddress){let{chainId:t,chainNamespace:i}=P.ParseUtil.parseCaipAddress(this.caipAddress),n=`${i}:${t}`;e=s.ChainController.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===n)}await ek.fetchTokens({caipAddress:this.caipAddress,caipNetwork:e,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:e}=this.caipAddress?P.ParseUtil.parseCaipAddress(this.caipAddress):{};ek.fetchQuote({amount:this.amount.toString(),address:e,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let i=l.ConnectorController.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};let n=a.AssetUtil.getConnectorImage(i);return{name:i.name,image:n}}paymentOptionsViewTemplate(){return i.html`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let e=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return i.html`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(0===e.length)return i.html`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;let t={disabled:this.isFetchingQuote};return i.html`<w3m-pay-options
      class=${(0,eI.classMap)(t)}
      .options=${e}
      .selectedPaymentAsset=${(0,r.ifDefined)(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?i.html`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:i.html`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let e=this.isFetchingQuote||this.isFetchingTokenBalances,t=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,n=k.NumberUtil.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?e||t?i.html`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:i.html`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:i.html`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${e||t?i.html`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:i.html`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${ew(n)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:e,isDisabled:t})}
      </wui-flex>
    `}actionButtonTemplate(e){let t=ei(this.quote),{isLoading:n,isDisabled:r}=e,a="Pay";return t.length>1&&0===this.completedTransactionsCount&&(a="Approve"),i.html`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${n||this.isPaymentInProgress}
        ?disabled=${r||this.isPaymentInProgress}
        @click=${()=>{t.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${a}
        ${n?null:i.html`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(e=>{try{return function(e){let t=s.ChainController.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.chainId),i=e.address;if(!t)throw Error(`Target network not found for balance chainId "${e.chainId}"`);if(I.HelpersUtil.isLowerCaseMatch(e.symbol,t.nativeCurrency.symbol))i="native";else if(E.CoreHelperUtil.isCaipAddress(i)){let{address:e}=P.ParseUtil.parseCaipAddress(i);i=e}else if(!i)throw Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:t.caipNetworkId,asset:i,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}(e)}catch(e){return null}}).filter(e=>!!e).filter(e=>{let{chainId:t}=P.ParseUtil.parseCaipNetworkId(e.network),{chainId:i}=P.ParseUtil.parseCaipNetworkId(this.paymentAsset.network);return!!I.HelpersUtil.isLowerCaseMatch(e.asset,this.paymentAsset.asset)||!this.selectedExchange||!I.HelpersUtil.isLowerCaseMatch(t.toString(),i.toString())}):[]}onTokenBalancesChanged(e){this.tokenBalances=e;let[t]=this.getPaymentAssetFromTokenBalances();t&&ek.setSelectedPaymentAsset(t)}async onConnectOtherWallet(){await l.ConnectorController.connect(),await c.ModalController.open({view:"PayQuote"})}onAccountStateChanged(e){let{address:t}=this.caipAddress?P.ParseUtil.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null,t){let{address:e}=this.caipAddress?P.ParseUtil.parseCaipAddress(this.caipAddress):{};e?I.HelpersUtil.isLowerCaseMatch(e,t)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):c.ModalController.close()}}onSelectedPaymentAssetChanged(e){this.isFetchingQuote||ek.setSelectedPaymentAsset(e)}async onTransfer(){let e=et(this.quote);if(e){if(!I.HelpersUtil.isLowerCaseMatch(this.selectedPaymentAsset?.asset,e.deposit.currency))throw Error("Quote asset is not the same as the selected payment asset");let t=this.selectedPaymentAsset?.amount??"0",i=k.NumberUtil.formatNumber(e.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!k.NumberUtil.bigNumber(t).gte(i))return void d.SnackController.showError("Insufficient funds");if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:t}=P.ParseUtil.parseCaipAddress(this.caipAddress);await ek.onTransfer({chainNamespace:this.namespace,fromAddress:t,toAddress:e.deposit.receiver,amount:i,paymentAsset:this.selectedPaymentAsset}),ek.setRequestId(e.requestId),u.RouterController.push("PayLoading")}}}async onSendTransactions(){let e=this.selectedPaymentAsset?.amount??"0",t=k.NumberUtil.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!k.NumberUtil.bigNumber(e).gte(t))return void d.SnackController.showError("Insufficient funds");let i=ei(this.quote),[n]=ei(this.quote,this.completedTransactionsCount);n&&this.namespace&&(await ek.onSendTransaction({namespace:this.namespace,transactionStep:n}),this.completedTransactionsCount+=1,this.completedTransactionsCount===i.length&&(ek.setRequestId(n.requestId),u.RouterController.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){let e=E.CoreHelperUtil.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!e)throw Error("Could not create popup window");e.location.href=this.exchangeUrlForQuote;let t=et(this.quote);t&&ek.setRequestId(t.requestId),ek.initiatePayment(),u.RouterController.push("PayLoading")}}resetAssetsState(){ek.setSelectedPaymentAsset(null)}resetQuoteState(){ek.resetQuoteState()}};async function ti(e){return ek.handleOpenPay(e)}async function tn(e,t=3e5){if(t<=0)throw new M($,"Timeout must be greater than 0");try{await ti(e)}catch(e){if(e instanceof M)throw e;throw new M(R,e.message)}return new Promise((e,i)=>{var n;let r=!1,a=setTimeout(()=>{r||(r=!0,o(),i(new M(q,"Payment timeout")))},t);function s(){if(r)return;let t=ek.state.currentPayment,i=ek.state.error,n=ek.state.isPaymentInProgress;if(t?.status==="SUCCESS"){r=!0,o(),clearTimeout(a),e({success:!0,result:t.result});return}if(t?.status==="FAILED"){r=!0,o(),clearTimeout(a),e({success:!1,error:i||"Payment failed"});return}!i||n||t||(r=!0,o(),clearTimeout(a),e({success:!1,error:i}))}let o=(n=[tl("currentPayment",s),tl("error",s),tl("isPaymentInProgress",s)],()=>{n.forEach(e=>{try{e()}catch{}})});s()})}function tr(){return ek.getExchanges()}function ta(){return ek.state.currentPayment?.result}function ts(){return ek.state.error}function to(){return ek.state.isPaymentInProgress}function tl(e,t){return ek.subscribeKey(e,t)}tt.styles=e9,e7([(0,n.state)()],tt.prototype,"profileName",void 0),e7([(0,n.state)()],tt.prototype,"paymentAsset",void 0),e7([(0,n.state)()],tt.prototype,"namespace",void 0),e7([(0,n.state)()],tt.prototype,"caipAddress",void 0),e7([(0,n.state)()],tt.prototype,"amount",void 0),e7([(0,n.state)()],tt.prototype,"recipient",void 0),e7([(0,n.state)()],tt.prototype,"activeConnectorIds",void 0),e7([(0,n.state)()],tt.prototype,"selectedPaymentAsset",void 0),e7([(0,n.state)()],tt.prototype,"selectedExchange",void 0),e7([(0,n.state)()],tt.prototype,"isFetchingQuote",void 0),e7([(0,n.state)()],tt.prototype,"quoteError",void 0),e7([(0,n.state)()],tt.prototype,"quote",void 0),e7([(0,n.state)()],tt.prototype,"isFetchingTokenBalances",void 0),e7([(0,n.state)()],tt.prototype,"tokenBalances",void 0),e7([(0,n.state)()],tt.prototype,"isPaymentInProgress",void 0),e7([(0,n.state)()],tt.prototype,"exchangeUrlForQuote",void 0),e7([(0,n.state)()],tt.prototype,"completedTransactionsCount",void 0),tt=e7([(0,p.customElement)("w3m-pay-quote-view")],tt),e.s(["W3mPayQuoteView",()=>tt],662703),e.s(["getExchanges",()=>tr,"getIsPaymentInProgress",()=>to,"getPayError",()=>ts,"getPayResult",()=>ta,"openPay",()=>ti,"pay",()=>tn],972122),e.s(["arbitrumUSDC",0,{network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},"arbitrumUSDT",0,{network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},"baseETH",0,{network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},"baseSepoliaETH",0,{network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},"baseUSDC",0,{network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},"ethereumUSDC",0,{network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},"ethereumUSDT",0,{network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},"optimismUSDC",0,{network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},"optimismUSDT",0,{network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},"polygonUSDC",0,{network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},"polygonUSDT",0,{network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},"solanaSOL",0,{network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}},"solanaUSDC",0,{network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},"solanaUSDT",0,{network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}}],746668),e.s([],854712)}]);

//# debugId=32fc56ad-9f67-b45d-8d4c-b75c0c337f24
