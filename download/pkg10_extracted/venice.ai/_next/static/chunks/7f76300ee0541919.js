;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="f9da3621-aef0-959b-e9e2-a08f036eb593")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,538822,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(684326);var i=e.i(765090),a=e.i(162611),n=e.i(459088),s=e.i(112699),l=e.i(645975);let c=a.css`
  :host {
    position: relative;
    display: inline-block;
  }

  :host([data-error='true']) > input {
    color: ${({tokens:e})=>e.core.textError};
  }

  :host([data-error='false']) > input {
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  input {
    background: transparent;
    height: auto;
    box-sizing: border-box;
    color: ${({tokens:e})=>e.theme.textPrimary};
    font-feature-settings: 'case' on;
    font-size: ${({textSize:e})=>e.h4};
    caret-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    line-height: ${({typography:e})=>e["h4-regular-mono"].lineHeight};
    letter-spacing: ${({typography:e})=>e["h4-regular-mono"].letterSpacing};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    font-family: ${({fontFamily:e})=>e.mono};
  }

  :host([data-width-variant='auto']) input {
    width: 100%;
  }

  :host([data-width-variant='fit']) input {
    width: 1ch;
  }

  .wui-input-amount-fit-mirror {
    position: absolute;
    visibility: hidden;
    white-space: pre;
    font-size: var(--local-font-size);
    line-height: 130%;
    letter-spacing: -1.28px;
    font-family: ${({fontFamily:e})=>e.mono};
  }

  .wui-input-amount-fit-width {
    display: inline-block;
    position: relative;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }
`;var d=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let u=class extends t.LitElement{constructor(){super(...arguments),this.inputElementRef=(0,i.createRef)(),this.disabled=!1,this.value="",this.placeholder="0",this.widthVariant="auto",this.maxDecimals=void 0,this.maxIntegers=void 0,this.fontSize="h4",this.error=!1}firstUpdated(){this.resizeInput()}updated(){this.style.setProperty("--local-font-size",a.vars.textSize[this.fontSize]),this.resizeInput()}render(){return(this.dataset.widthVariant=this.widthVariant,this.dataset.error=String(this.error),this.inputElementRef?.value&&this.value&&(this.inputElementRef.value.value=this.value),"auto"===this.widthVariant)?this.inputTemplate():o.html`
      <div class="wui-input-amount-fit-width">
        <span class="wui-input-amount-fit-mirror"></span>
        ${this.inputTemplate()}
      </div>
    `}inputTemplate(){return o.html`<input
      ${(0,i.ref)(this.inputElementRef)}
      type="text"
      inputmode="decimal"
      pattern="[0-9,.]*"
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      autofocus
      value=${this.value??""}
      @input=${this.dispatchInputChangeEvent.bind(this)}
    />`}dispatchInputChangeEvent(){this.inputElementRef.value&&(this.inputElementRef.value.value=s.UiHelperUtil.maskInput({value:this.inputElementRef.value.value,decimals:this.maxDecimals,integers:this.maxIntegers}),this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value.value,bubbles:!0,composed:!0})),this.resizeInput())}resizeInput(){if("fit"===this.widthVariant){let e=this.inputElementRef.value;if(e){let t=e.previousElementSibling;t&&(t.textContent=e.value||"0",e.style.width=`${t.offsetWidth}px`)}}}};u.styles=[n.resetStyles,n.elementStyles,c],d([(0,r.property)({type:Boolean})],u.prototype,"disabled",void 0),d([(0,r.property)({type:String})],u.prototype,"value",void 0),d([(0,r.property)({type:String})],u.prototype,"placeholder",void 0),d([(0,r.property)({type:String})],u.prototype,"widthVariant",void 0),d([(0,r.property)({type:Number})],u.prototype,"maxDecimals",void 0),d([(0,r.property)({type:Number})],u.prototype,"maxIntegers",void 0),d([(0,r.property)({type:String})],u.prototype,"fontSize",void 0),d([(0,r.property)({type:Boolean})],u.prototype,"error",void 0),u=d([(0,l.customElement)("wui-input-amount")],u),e.s([],538822)},47755,e=>{"use strict";var t=e.i(365801),o=e.i(742710),r=e.i(675457),i=e.i(401564),a=e.i(979484),n=e.i(518887),s=e.i(564126),l=e.i(360334),c=e.i(227302),d=e.i(664717);let u={getGasPriceInEther:(e,t)=>Number(t*e)/1e18,getGasPriceInUSD(e,t,o){let i=u.getGasPriceInEther(t,o);return r.NumberUtil.bigNumber(e).times(i).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:o,toTokenAmount:i}){let a=r.NumberUtil.bigNumber(e).times(t),n=r.NumberUtil.bigNumber(i).times(o);return a.minus(n).div(a).times(100).toNumber()},getMaxSlippage(e,t){let o=r.NumberUtil.bigNumber(e).div(100);return r.NumberUtil.multiply(t,o).toNumber()},getProviderFee:(e,t=.0085)=>r.NumberUtil.bigNumber(e).times(t).toString(),isInsufficientNetworkTokenForGas:(e,t)=>!!r.NumberUtil.bigNumber(e).eq(0)||r.NumberUtil.bigNumber(r.NumberUtil.bigNumber(t||"0")).gt(e),isInsufficientSourceTokenForSwap(e,t,o){let i=o?.find(e=>e.address===t)?.quantity?.numeric;return r.NumberUtil.bigNumber(i||"0").lt(e)}};var p=e.i(592279),h=e.i(851887),m=e.i(24742),g=e.i(960398),b=e.i(971080),v=e.i(149454),f=e.i(653157),y=e.i(221728),k=e.i(811424);let w={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,switchingTokens:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:l.ConstantsUtil.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},x=(0,t.proxy)({...w}),T={state:x,subscribe:e=>(0,t.subscribe)(x,()=>e(x)),subscribeKey:(e,t)=>(0,o.subscribeKey)(x,e,t),getParams(){let e=g.ChainController.state.activeChain,t=g.ChainController.getAccountData(e)?.caipAddress??g.ChainController.state.activeCaipAddress,o=c.CoreHelperUtil.getPlainAddress(t),a=(0,s.getActiveNetworkTokenAddress)(),n=v.ConnectorController.getConnectorId(g.ChainController.state.activeChain);if(!o)throw Error("No address found to swap the tokens from.");let l=!x.toToken?.address||!x.toToken?.decimals,d=!x.sourceToken?.address||!x.sourceToken?.decimals||!r.NumberUtil.bigNumber(x.sourceTokenAmount).gt(0),u=!x.sourceTokenAmount;return{networkAddress:a,fromAddress:o,fromCaipAddress:t,sourceTokenAddress:x.sourceToken?.address,toTokenAddress:x.toToken?.address,toTokenAmount:x.toTokenAmount,toTokenDecimals:x.toToken?.decimals,sourceTokenAmount:x.sourceTokenAmount,sourceTokenDecimals:x.sourceToken?.decimals,invalidToToken:l,invalidSourceToken:d,invalidSourceTokenAmount:u,availableToSwap:t&&!l&&!d&&!u,isAuthConnector:n===i.ConstantsUtil.CONNECTOR_ID.AUTH}},async setSourceToken(e){if(!e){x.sourceToken=e,x.sourceTokenAmount="",x.sourceTokenPriceInUSD=0;return}x.sourceToken=e,await $.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){x.sourceTokenAmount=e},async setToToken(e){if(!e){x.toToken=e,x.toTokenAmount="",x.toTokenPriceInUSD=0;return}x.toToken=e,await $.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){x.toTokenAmount=e?r.NumberUtil.toFixed(e,6):""},async setTokenPrice(e,t){let o=x.tokensPriceMap[e]||0;o||(x.loadingPrices=!0,o=await $.getAddressPrice(e)),"sourceToken"===t?x.sourceTokenPriceInUSD=o:"toToken"===t&&(x.toTokenPriceInUSD=o),x.loadingPrices&&(x.loadingPrices=!1),$.getParams().availableToSwap&&!x.switchingTokens&&$.swapTokens()},async switchTokens(){if(!x.initializing&&x.initialized&&!x.switchingTokens){x.switchingTokens=!0;try{let e=x.toToken?{...x.toToken}:void 0,t=x.sourceToken?{...x.sourceToken}:void 0,o=e&&""===x.toTokenAmount?"1":x.toTokenAmount;$.setSourceTokenAmount(o),$.setToTokenAmount(""),await $.setSourceToken(e),await $.setToToken(t),x.switchingTokens=!1,$.swapTokens()}catch(e){throw x.switchingTokens=!1,e}}},resetState(){x.myTokensWithBalance=w.myTokensWithBalance,x.tokensPriceMap=w.tokensPriceMap,x.initialized=w.initialized,x.initializing=w.initializing,x.switchingTokens=w.switchingTokens,x.sourceToken=w.sourceToken,x.sourceTokenAmount=w.sourceTokenAmount,x.sourceTokenPriceInUSD=w.sourceTokenPriceInUSD,x.toToken=w.toToken,x.toTokenAmount=w.toTokenAmount,x.toTokenPriceInUSD=w.toTokenPriceInUSD,x.networkPrice=w.networkPrice,x.networkTokenSymbol=w.networkTokenSymbol,x.networkBalanceInUSD=w.networkBalanceInUSD,x.inputError=w.inputError},resetValues(){let{networkAddress:e}=$.getParams(),t=x.tokens?.find(t=>t.address===e);$.setSourceToken(t),$.setToToken(void 0)},getApprovalLoadingState:()=>x.loadingApprovalTransaction,clearError(){x.transactionError=void 0},async initializeState(){if(!x.initializing){if(x.initializing=!0,!x.initialized)try{await $.fetchTokens(),x.initialized=!0}catch(e){x.initialized=!1,k.SnackController.showError("Failed to initialize swap"),y.RouterController.goBack()}x.initializing=!1}},async fetchTokens(){let{networkAddress:e}=$.getParams();await $.getNetworkTokenPrice(),await $.getMyTokensWithBalance();let t=x.myTokensWithBalance?.find(t=>t.address===e);t&&(x.networkTokenSymbol=t.symbol,$.setSourceToken(t),$.setSourceTokenAmount("0"))},async getTokenList(){let e=g.ChainController.state.activeCaipNetwork?.caipNetworkId;if(x.caipNetworkId!==e||!x.tokens)try{x.tokensLoading=!0;let t=await d.SwapApiUtil.getTokenList(e);x.tokens=t,x.caipNetworkId=e,x.popularTokens=t.sort((e,t)=>e.symbol<t.symbol?-1:+(e.symbol>t.symbol));let o=(e&&l.ConstantsUtil.SUGGESTED_TOKENS_BY_CHAIN?.[e]||[]).map(e=>t.find(t=>t.symbol===e)).filter(e=>!!e),r=(l.ConstantsUtil.SWAP_SUGGESTED_TOKENS||[]).map(e=>t.find(t=>t.symbol===e)).filter(e=>!!e).filter(e=>!o.some(t=>t.address===e.address));x.suggestedTokens=[...o,...r]}catch(e){x.tokens=[],x.popularTokens=[],x.suggestedTokens=[]}finally{x.tokensLoading=!1}},async getAddressPrice(e){let t=x.tokensPriceMap[e];if(t)return t;let o=await m.BlockchainApiController.fetchTokenPrice({addresses:[e]}),r=o?.fungibles||[],i=[...x.tokens||[],...x.myTokensWithBalance||[]],a=i?.find(t=>t.address===e)?.symbol,n=parseFloat((r.find(e=>e.symbol.toLowerCase()===a?.toLowerCase())?.price||0).toString());return x.tokensPriceMap[e]=n,n},async getNetworkTokenPrice(){let{networkAddress:e}=$.getParams(),t=await m.BlockchainApiController.fetchTokenPrice({addresses:[e]}).catch(()=>(k.SnackController.showError("Failed to fetch network token price"),{fungibles:[]})),o=t.fungibles?.[0],r=o?.price.toString()||"0";x.tokensPriceMap[e]=parseFloat(r),x.networkTokenSymbol=o?.symbol||"",x.networkPrice=r},async getMyTokensWithBalance(e){let t=await n.BalanceUtil.getMyTokensWithBalance({forceUpdate:e,caipNetwork:g.ChainController.state.activeCaipNetwork,address:g.ChainController.getAccountData()?.address}),o=d.SwapApiUtil.mapBalancesToSwapTokens(t);o&&(await $.getInitialGasPrice(),$.setBalances(o))},setBalances(e){let{networkAddress:t}=$.getParams(),o=g.ChainController.state.activeCaipNetwork;if(!o)return;let i=e.find(e=>e.address===t);e.forEach(e=>{x.tokensPriceMap[e.address]=e.price||0}),x.myTokensWithBalance=e.filter(e=>e.address.startsWith(o.caipNetworkId)),x.networkBalanceInUSD=i?r.NumberUtil.multiply(i.quantity.numeric,i.price).toString():"0"},async getInitialGasPrice(){let e=await d.SwapApiUtil.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(g.ChainController.state?.activeCaipNetwork?.chainNamespace){case i.ConstantsUtil.CHAIN.SOLANA:return x.gasFee=e.standard??"0",x.gasPriceInUSD=r.NumberUtil.multiply(e.standard,x.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(x.gasFee),gasPriceInUSD:Number(x.gasPriceInUSD)};case i.ConstantsUtil.CHAIN.EVM:default:let t=e.standard??"0",o=BigInt(t),a=BigInt(15e4),n=u.getGasPriceInUSD(x.networkPrice,a,o);return x.gasFee=t,x.gasPriceInUSD=n,{gasPrice:o,gasPriceInUSD:n}}},async swapTokens(){let e=g.ChainController.getAccountData()?.address,t=x.sourceToken,o=x.toToken,i=r.NumberUtil.bigNumber(x.sourceTokenAmount).gt(0);if(i||$.setToTokenAmount(""),!o||!t||x.loadingPrices||!i||!e)return;x.loadingQuote=!0;let a=r.NumberUtil.bigNumber(x.sourceTokenAmount).times(10**t.decimals).round(0).toFixed(0);try{let i=await m.BlockchainApiController.fetchSwapQuote({userAddress:e,from:t.address,to:o.address,gasPrice:x.gasFee,amount:a.toString()});x.loadingQuote=!1;let n=i?.quotes?.[0]?.toAmount;if(!n)return void h.AlertController.open({displayMessage:"Incorrect amount",debugMessage:"Please enter a valid amount"},"error");let s=r.NumberUtil.bigNumber(n).div(10**o.decimals).toString();$.setToTokenAmount(s),$.hasInsufficientToken(x.sourceTokenAmount,t.address)?x.inputError="Insufficient balance":(x.inputError=void 0,$.setTransactionDetails())}catch(t){let e=await d.SwapApiUtil.handleSwapError(t);x.loadingQuote=!1,x.inputError=e||"Insufficient balance"}},async getTransaction(){let{fromCaipAddress:e,availableToSwap:t}=$.getParams(),o=x.sourceToken,r=x.toToken;if(e&&t&&o&&r&&!x.loadingQuote)try{let t;return x.loadingBuildTransaction=!0,t=await d.SwapApiUtil.fetchSwapAllowance({userAddress:e,tokenAddress:o.address,sourceTokenAmount:x.sourceTokenAmount,sourceTokenDecimals:o.decimals})?await $.createSwapTransaction():await $.createAllowanceTransaction(),x.loadingBuildTransaction=!1,x.fetchError=!1,t}catch(e){y.RouterController.goBack(),k.SnackController.showError("Failed to check allowance"),x.loadingBuildTransaction=!1,x.approvalTransaction=void 0,x.swapTransaction=void 0,x.fetchError=!0;return}},async createAllowanceTransaction(){let{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:o}=$.getParams();if(e&&o){if(!t)throw Error("createAllowanceTransaction - No source token address found.");try{let r=await m.BlockchainApiController.generateApproveCalldata({from:t,to:o,userAddress:e}),i=c.CoreHelperUtil.getPlainAddress(r.tx.from);if(!i)throw Error("SwapController:createAllowanceTransaction - address is required");let a={data:r.tx.data,to:i,gasPrice:BigInt(r.tx.eip155.gasPrice),value:BigInt(r.tx.value),toAmount:x.toTokenAmount};return x.swapTransaction=void 0,x.approvalTransaction={data:a.data,to:a.to,gasPrice:a.gasPrice,value:a.value,toAmount:a.toAmount},{data:a.data,to:a.to,gasPrice:a.gasPrice,value:a.value,toAmount:a.toAmount}}catch(e){y.RouterController.goBack(),k.SnackController.showError("Failed to create approval transaction"),x.approvalTransaction=void 0,x.swapTransaction=void 0,x.fetchError=!0;return}}},async createSwapTransaction(){let{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:o}=$.getParams(),r=x.sourceToken,i=x.toToken;if(!t||!o||!r||!i)return;let a=b.ConnectionController.parseUnits(o,r.decimals)?.toString();try{let o=await m.BlockchainApiController.generateSwapCalldata({userAddress:t,from:r.address,to:i.address,amount:a,disableEstimate:!0}),n=r.address===e,s=BigInt(o.tx.eip155.gas),l=BigInt(o.tx.eip155.gasPrice),d=c.CoreHelperUtil.getPlainAddress(o.tx.to);if(!d)throw Error("SwapController:createSwapTransaction - address is required");let p={data:o.tx.data,to:d,gas:s,gasPrice:l,value:n?BigInt(a??"0"):BigInt("0"),toAmount:x.toTokenAmount};return x.gasPriceInUSD=u.getGasPriceInUSD(x.networkPrice,s,l),x.approvalTransaction=void 0,x.swapTransaction=p,p}catch(e){y.RouterController.goBack(),k.SnackController.showError("Failed to create transaction"),x.approvalTransaction=void 0,x.swapTransaction=void 0,x.fetchError=!0;return}},onEmbeddedWalletApprovalSuccess(){k.SnackController.showLoading("Approve limit increase in your wallet"),y.RouterController.replace("SwapPreview")},async sendTransactionForApproval(e){let{fromAddress:t,isAuthConnector:o}=$.getParams();x.loadingApprovalTransaction=!0,o?y.RouterController.pushTransactionStack({onSuccess:$.onEmbeddedWalletApprovalSuccess}):k.SnackController.showLoading("Approve limit increase in your wallet");try{await b.ConnectionController.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:i.ConstantsUtil.CHAIN.EVM}),await $.swapTokens(),await $.getTransaction(),x.approvalTransaction=void 0,x.loadingApprovalTransaction=!1}catch(e){x.transactionError=e?.displayMessage,x.loadingApprovalTransaction=!1,k.SnackController.showError(e?.displayMessage||"Transaction error"),f.EventsController.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:e?.displayMessage||e?.message||"Unknown",network:g.ChainController.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:$.state.sourceToken?.symbol||"",swapToToken:$.state.toToken?.symbol||"",swapFromAmount:$.state.sourceTokenAmount||"",swapToAmount:$.state.toTokenAmount||"",isSmartAccount:(0,s.getPreferredAccountType)(i.ConstantsUtil.CHAIN.EVM)===a.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;let{fromAddress:t,toTokenAmount:o,isAuthConnector:n}=$.getParams();x.loadingTransaction=!0;let l=`Swapping ${x.sourceToken?.symbol} to ${r.NumberUtil.formatNumberToLocalString(o,3)} ${x.toToken?.symbol}`,c=`Swapped ${x.sourceToken?.symbol} to ${r.NumberUtil.formatNumberToLocalString(o,3)} ${x.toToken?.symbol}`;n?y.RouterController.pushTransactionStack({onSuccess(){y.RouterController.replace("Account"),k.SnackController.showLoading(l),T.resetState()}}):k.SnackController.showLoading("Confirm transaction in your wallet");try{let o=[x.sourceToken?.address,x.toToken?.address].join(","),r=await b.ConnectionController.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:i.ConstantsUtil.CHAIN.EVM});return x.loadingTransaction=!1,k.SnackController.showSuccess(c),f.EventsController.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:g.ChainController.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:$.state.sourceToken?.symbol||"",swapToToken:$.state.toToken?.symbol||"",swapFromAmount:$.state.sourceTokenAmount||"",swapToAmount:$.state.toTokenAmount||"",isSmartAccount:(0,s.getPreferredAccountType)(i.ConstantsUtil.CHAIN.EVM)===a.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}}),T.resetState(),n||y.RouterController.replace("Account"),T.getMyTokensWithBalance(o),r}catch(e){x.transactionError=e?.displayMessage,x.loadingTransaction=!1,k.SnackController.showError(e?.displayMessage||"Transaction error"),f.EventsController.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:e?.displayMessage||e?.message||"Unknown",network:g.ChainController.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:$.state.sourceToken?.symbol||"",swapToToken:$.state.toToken?.symbol||"",swapFromAmount:$.state.sourceTokenAmount||"",swapToAmount:$.state.toTokenAmount||"",isSmartAccount:(0,s.getPreferredAccountType)(i.ConstantsUtil.CHAIN.EVM)===a.W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken:(e,t)=>u.isInsufficientSourceTokenForSwap(e,t,x.myTokensWithBalance),setTransactionDetails(){let{toTokenAddress:e,toTokenDecimals:t}=$.getParams();e&&t&&(x.gasPriceInUSD=u.getGasPriceInUSD(x.networkPrice,BigInt(x.gasFee),BigInt(15e4)),x.priceImpact=u.getPriceImpact({sourceTokenAmount:x.sourceTokenAmount,sourceTokenPriceInUSD:x.sourceTokenPriceInUSD,toTokenPriceInUSD:x.toTokenPriceInUSD,toTokenAmount:x.toTokenAmount}),x.maxSlippage=u.getMaxSlippage(x.slippage,x.toTokenAmount),x.providerFee=u.getProviderFee(x.sourceTokenAmount))}},$=(0,p.withErrorBoundary)(T);e.s(["SwapController",0,$],47755)},497521,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(852634),e.i(864380),e.i(864576),e.i(839009),e.i(73944);var i=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.css`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
  }

  .left-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] .token-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .token-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .token-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .chain-image {
    width: 12px;
    height: 12px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='md'] .chain-image {
    width: 10px;
    height: 10px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='sm'] .chain-image {
    width: 8px;
    height: 8px;
    bottom: 2px;
    right: -3px;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let c={lg:"lg-regular",md:"lg-regular",sm:"md-regular"},d={lg:"lg",md:"md",sm:"sm"},u=class extends t.LitElement{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.text="",this.loading=!1}render(){return this.loading?o.html` <wui-flex alignItems="center" gap="01" padding="01">
        <wui-shimmer width="20px" height="20px"></wui-shimmer>
        <wui-shimmer width="32px" height="18px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:o.html`
      <button ?disabled=${this.disabled} data-size=${this.size}>
        ${this.imageTemplate()} ${this.textTemplate()}
      </button>
    `}imageTemplate(){if(this.imageSrc&&this.chainImageSrc)return o.html`<wui-flex class="left-image-container">
        <wui-image src=${this.imageSrc} class="token-image"></wui-image>
        <wui-image src=${this.chainImageSrc} class="chain-image"></wui-image>
      </wui-flex>`;if(this.imageSrc)return o.html`<wui-image src=${this.imageSrc} class="token-image"></wui-image>`;let e=d[this.size];return o.html`<wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}textTemplate(){let e=c[this.size];return o.html`<wui-text color="primary" variant=${e}
      >${this.text}</wui-text
    >`}};u.styles=[i.resetStyles,i.elementStyles,s],l([(0,r.property)()],u.prototype,"size",void 0),l([(0,r.property)()],u.prototype,"imageSrc",void 0),l([(0,r.property)()],u.prototype,"chainImageSrc",void 0),l([(0,r.property)({type:Boolean})],u.prototype,"disabled",void 0),l([(0,r.property)()],u.prototype,"text",void 0),l([(0,r.property)({type:Boolean})],u.prototype,"loading",void 0),u=l([(0,a.customElement)("wui-token-button")],u),e.s([],497521)},443452,e=>{"use strict";e.i(852634),e.s([])},864380,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(234051);var i=e.i(829389),a=e.i(459088),n=e.i(645975),s=e.i(162611);let l=s.css`
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
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-boxed='true']) img {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[16]};
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
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var c=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends t.LitElement{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.boxed=!1,this.rounded=!1,this.fullSize=!1}render(){let e={inherit:"inherit",xxs:"2",xs:"3",sm:"4",md:"4",mdl:"5",lg:"5",xl:"6",xxl:"7","3xl":"8","4xl":"9","5xl":"10"};return(this.style.cssText=`
      --local-width: ${this.size?`var(--apkt-spacing-${e[this.size]});`:"100%"};
      --local-height: ${this.size?`var(--apkt-spacing-${e[this.size]});`:"100%"};
      `,this.dataset.boxed=this.boxed?"true":"false",this.dataset.rounded=this.rounded?"true":"false",this.dataset.full=this.fullSize?"true":"false",this.dataset.icon=this.iconColor||"inherit",this.icon)?o.html`<wui-icon
        color=${this.iconColor||"inherit"}
        name=${this.icon}
        size="lg"
      ></wui-icon> `:this.logo?o.html`<wui-icon size="lg" color="inherit" name=${this.logo}></wui-icon> `:o.html`<img src=${(0,i.ifDefined)(this.src)} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};d.styles=[a.resetStyles,l],c([(0,r.property)()],d.prototype,"src",void 0),c([(0,r.property)()],d.prototype,"logo",void 0),c([(0,r.property)()],d.prototype,"icon",void 0),c([(0,r.property)()],d.prototype,"iconColor",void 0),c([(0,r.property)()],d.prototype,"alt",void 0),c([(0,r.property)()],d.prototype,"size",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"boxed",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"rounded",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"fullSize",void 0),d=c([(0,n.customElement)("wui-image")],d),e.s([],864380)},912190,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(234051);var i=e.i(829389);e.i(852634);var a=e.i(459088),n=e.i(645975),s=e.i(162611);let l=s.css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e[2]};
    padding: ${({spacing:e})=>e[1]} !important;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: relative;
  }

  :host([data-padding='2']) {
    padding: ${({spacing:e})=>e[2]} !important;
  }

  :host:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host > wui-icon {
    z-index: 10;
  }

  /* -- Colors --------------------------------------------------- */
  :host([data-color='accent-primary']) {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  :host([data-color='accent-primary']):after {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  :host([data-color='default']),
  :host([data-color='secondary']) {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  :host([data-color='default']):after {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-color='secondary']):after {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-color='success']) {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  :host([data-color='success']):after {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  :host([data-color='error']) {
    color: ${({tokens:e})=>e.core.iconError};
  }

  :host([data-color='error']):after {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  :host([data-color='warning']) {
    color: ${({tokens:e})=>e.core.iconWarning};
  }

  :host([data-color='warning']):after {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  :host([data-color='inverse']) {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  :host([data-color='inverse']):after {
    background-color: transparent;
  }
`;var c=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends t.LitElement{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,o.html`
      <wui-icon size=${(0,i.ifDefined)(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};d.styles=[a.resetStyles,a.elementStyles,l],c([(0,r.property)()],d.prototype,"icon",void 0),c([(0,r.property)()],d.prototype,"size",void 0),c([(0,r.property)()],d.prototype,"padding",void 0),c([(0,r.property)()],d.prototype,"color",void 0),d=c([(0,n.customElement)("wui-icon-box")],d),e.s([],912190)},383227,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119),i=e.i(162611),a=e.i(459088),n=e.i(645975),s=e.i(592057);let l=s.css`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 1.4s linear infinite;
    color: var(--local-color);
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;var c=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends t.LitElement{constructor(){super(...arguments),this.color="primary",this.size="lg"}render(){let e={primary:i.vars.tokens.theme.textPrimary,secondary:i.vars.tokens.theme.textSecondary,tertiary:i.vars.tokens.theme.textTertiary,invert:i.vars.tokens.theme.textInvert,error:i.vars.tokens.core.textError,warning:i.vars.tokens.core.textWarning,"accent-primary":i.vars.tokens.core.textAccentPrimary};return this.style.cssText=`
      --local-color: ${"inherit"===this.color?"inherit":e[this.color]};
      `,this.dataset.size=this.size,o.html`<svg viewBox="0 0 16 17" fill="none">
      <path
        d="M8.75 2.65625V4.65625C8.75 4.85516 8.67098 5.04593 8.53033 5.18658C8.38968 5.32723 8.19891 5.40625 8 5.40625C7.80109 5.40625 7.61032 5.32723 7.46967 5.18658C7.32902 5.04593 7.25 4.85516 7.25 4.65625V2.65625C7.25 2.45734 7.32902 2.26657 7.46967 2.12592C7.61032 1.98527 7.80109 1.90625 8 1.90625C8.19891 1.90625 8.38968 1.98527 8.53033 2.12592C8.67098 2.26657 8.75 2.45734 8.75 2.65625ZM14 7.90625H12C11.8011 7.90625 11.6103 7.98527 11.4697 8.12592C11.329 8.26657 11.25 8.45734 11.25 8.65625C11.25 8.85516 11.329 9.04593 11.4697 9.18658C11.6103 9.32723 11.8011 9.40625 12 9.40625H14C14.1989 9.40625 14.3897 9.32723 14.5303 9.18658C14.671 9.04593 14.75 8.85516 14.75 8.65625C14.75 8.45734 14.671 8.26657 14.5303 8.12592C14.3897 7.98527 14.1989 7.90625 14 7.90625ZM11.3588 10.9544C11.289 10.8846 11.2062 10.8293 11.115 10.7915C11.0239 10.7538 10.9262 10.7343 10.8275 10.7343C10.7288 10.7343 10.6311 10.7538 10.54 10.7915C10.4488 10.8293 10.366 10.8846 10.2963 10.9544C10.2265 11.0241 10.1711 11.107 10.1334 11.1981C10.0956 11.2893 10.0762 11.387 10.0762 11.4856C10.0762 11.5843 10.0956 11.682 10.1334 11.7731C10.1711 11.8643 10.2265 11.9471 10.2963 12.0169L11.7106 13.4312C11.8515 13.5721 12.0426 13.6513 12.2419 13.6513C12.4411 13.6513 12.6322 13.5721 12.7731 13.4312C12.914 13.2904 12.9932 13.0993 12.9932 12.9C12.9932 12.7007 12.914 12.5096 12.7731 12.3687L11.3588 10.9544ZM8 11.9062C7.80109 11.9062 7.61032 11.9853 7.46967 12.1259C7.32902 12.2666 7.25 12.4573 7.25 12.6562V14.6562C7.25 14.8552 7.32902 15.0459 7.46967 15.1866C7.61032 15.3272 7.80109 15.4062 8 15.4062C8.19891 15.4062 8.38968 15.3272 8.53033 15.1866C8.67098 15.0459 8.75 14.8552 8.75 14.6562V12.6562C8.75 12.4573 8.67098 12.2666 8.53033 12.1259C8.38968 11.9853 8.19891 11.9062 8 11.9062ZM4.64125 10.9544L3.22688 12.3687C3.08598 12.5096 3.00682 12.7007 3.00682 12.9C3.00682 13.0993 3.08598 13.2904 3.22688 13.4312C3.36777 13.5721 3.55887 13.6513 3.75813 13.6513C3.95738 13.6513 4.14848 13.5721 4.28937 13.4312L5.70375 12.0169C5.84465 11.876 5.9238 11.6849 5.9238 11.4856C5.9238 11.2864 5.84465 11.0953 5.70375 10.9544C5.56285 10.8135 5.37176 10.7343 5.1725 10.7343C4.97324 10.7343 4.78215 10.8135 4.64125 10.9544ZM4.75 8.65625C4.75 8.45734 4.67098 8.26657 4.53033 8.12592C4.38968 7.98527 4.19891 7.90625 4 7.90625H2C1.80109 7.90625 1.61032 7.98527 1.46967 8.12592C1.32902 8.26657 1.25 8.45734 1.25 8.65625C1.25 8.85516 1.32902 9.04593 1.46967 9.18658C1.61032 9.32723 1.80109 9.40625 2 9.40625H4C4.19891 9.40625 4.38968 9.32723 4.53033 9.18658C4.67098 9.04593 4.75 8.85516 4.75 8.65625ZM4.2875 3.88313C4.1466 3.74223 3.95551 3.66307 3.75625 3.66307C3.55699 3.66307 3.3659 3.74223 3.225 3.88313C3.0841 4.02402 3.00495 4.21512 3.00495 4.41438C3.00495 4.61363 3.0841 4.80473 3.225 4.94562L4.64125 6.35813C4.78215 6.49902 4.97324 6.57818 5.1725 6.57818C5.37176 6.57818 5.56285 6.49902 5.70375 6.35813C5.84465 6.21723 5.9238 6.02613 5.9238 5.82688C5.9238 5.62762 5.84465 5.43652 5.70375 5.29563L4.2875 3.88313Z"
        fill="currentColor"
      />
    </svg>`}};d.styles=[a.resetStyles,l],c([(0,r.property)()],d.prototype,"color",void 0),c([(0,r.property)()],d.prototype,"size",void 0),d=c([(0,n.customElement)("wui-loading-spinner")],d),e.s([],383227)},534420,624947,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(852634),e.i(383227),e.i(839009);var i=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.css`
  :host {
    width: var(--local-width);
  }

  button {
    width: var(--local-width);
    white-space: nowrap;
    column-gap: ${({spacing:e})=>e[2]};
    transition:
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: scale, background-color, border-radius;
    cursor: pointer;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[2]};
    padding: 0 ${({spacing:e})=>e[2]};
    height: 28px;
  }

  button[data-size='md'] {
    border-radius: ${({borderRadius:e})=>e[3]};
    padding: 0 ${({spacing:e})=>e[4]};
    height: 38px;
  }

  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: 0 ${({spacing:e})=>e[5]};
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent-primary'] {
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='accent-secondary'] {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button[data-variant='neutral-primary'] {
    background-color: ${({tokens:e})=>e.theme.backgroundInvert};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='neutral-secondary'] {
    background-color: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-variant='neutral-tertiary'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-variant='error-primary'] {
    background-color: ${({tokens:e})=>e.core.textError};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='error-secondary'] {
    background-color: ${({tokens:e})=>e.core.backgroundError};
    color: ${({tokens:e})=>e.core.textError};
  }

  button[data-variant='shade'] {
    background: var(--wui-color-gray-glass-002);
    color: var(--wui-color-fg-200);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-size='sm']:focus-visible:enabled {
    border-radius: 28px;
  }

  button[data-size='md']:focus-visible:enabled {
    border-radius: 38px;
  }

  button[data-size='lg']:focus-visible:enabled {
    border-radius: 48px;
  }
  button[data-variant='shade']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button[data-size='sm']:hover:enabled {
      border-radius: 28px;
    }

    button[data-size='md']:hover:enabled {
      border-radius: 38px;
    }

    button[data-size='lg']:hover:enabled {
      border-radius: 48px;
    }

    button[data-variant='shade']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='shade']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }
  }

  button[data-size='sm']:active:enabled {
    border-radius: 28px;
  }

  button[data-size='md']:active:enabled {
    border-radius: 38px;
  }

  button[data-size='lg']:active:enabled {
    border-radius: 48px;
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    opacity: 0.3;
  }
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let c={lg:"lg-regular-mono",md:"md-regular-mono",sm:"sm-regular-mono"},d={lg:"md",md:"md",sm:"sm"},u=class extends t.LitElement{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="accent-primary"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
     `;let e=this.textVariant??c[this.size];return o.html`
      <button data-variant=${this.variant} data-size=${this.size} ?disabled=${this.disabled}>
        ${this.loadingTemplate()}
        <slot name="iconLeft"></slot>
        <wui-text variant=${e} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}loadingTemplate(){if(this.loading){let e=d[this.size],t="neutral-primary"===this.variant||"accent-primary"===this.variant?"invert":"primary";return o.html`<wui-loading-spinner color=${t} size=${e}></wui-loading-spinner>`}return null}};u.styles=[i.resetStyles,i.elementStyles,s],l([(0,r.property)()],u.prototype,"size",void 0),l([(0,r.property)({type:Boolean})],u.prototype,"disabled",void 0),l([(0,r.property)({type:Boolean})],u.prototype,"fullWidth",void 0),l([(0,r.property)({type:Boolean})],u.prototype,"loading",void 0),l([(0,r.property)()],u.prototype,"variant",void 0),l([(0,r.property)()],u.prototype,"textVariant",void 0),u=l([(0,a.customElement)("wui-button")],u),e.s([],624947),e.s([],534420)},864576,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119),i=e.i(645975),a=e.i(162611);let n=a.css`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundPrimary} 0%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 50%,
      ${({tokens:e})=>e.theme.foregroundPrimary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;var s=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let l=class extends t.LitElement{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",o.html`<slot></slot>`}};l.styles=[n],s([(0,r.property)()],l.prototype,"width",void 0),s([(0,r.property)()],l.prototype,"height",void 0),s([(0,r.property)()],l.prototype,"variant",void 0),s([(0,r.property)({type:Boolean})],l.prototype,"rounded",void 0),l=s([(0,i.customElement)("wui-shimmer")],l),e.s([],864576)},79929,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(839009);var i=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.css`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:e})=>e.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  :host([data-bg-color='primary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  :host([data-bg-color='secondary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let c=class extends t.LitElement{constructor(){super(...arguments),this.text="",this.bgColor="primary"}render(){return this.dataset.bgColor=this.bgColor,o.html`${this.template()}`}template(){return this.text?o.html`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};c.styles=[i.resetStyles,s],l([(0,r.property)()],c.prototype,"text",void 0),l([(0,r.property)()],c.prototype,"bgColor",void 0),c=l([(0,a.customElement)("wui-separator")],c),e.s([],79929)},210380,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(852634),e.i(839009);var i=e.i(459088),a=e.i(645975),n=e.i(162611);let s=n.css`
  button {
    border: none;
    background: transparent;
    height: 20px;
    padding: ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[1]};
    padding: 0 ${({spacing:e})=>e[1]};
    border-radius: ${({spacing:e})=>e[1]};
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent'] {
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button[data-variant='secondary'] {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[data-variant='accent']:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-variant='accent']:hover:enabled {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='secondary']:hover:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let c={sm:"sm-medium",md:"md-medium"},d={accent:"accent-primary",secondary:"secondary"},u=class extends t.LitElement{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return o.html`
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
    `}iconTemplate(){return this.icon?o.html`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};u.styles=[i.resetStyles,i.elementStyles,s],l([(0,r.property)()],u.prototype,"size",void 0),l([(0,r.property)({type:Boolean})],u.prototype,"disabled",void 0),l([(0,r.property)()],u.prototype,"variant",void 0),l([(0,r.property)()],u.prototype,"icon",void 0),u=l([(0,a.customElement)("wui-link")],u),e.s([],210380)},746650,e=>{"use strict";e.i(912190),e.s([])},215951,226499,e=>{"use strict";let{I:t}=e.i(654479)._$LH,o=e=>null===e||"object"!=typeof e&&"function"!=typeof e,r=e=>void 0===e.strings;e.s(["isPrimitive",()=>o,"isSingleExpression",()=>r],226499);var i=e.i(391909);let a=(e,t)=>{let o=e._$AN;if(void 0===o)return!1;for(let e of o)e._$AO?.(t,!1),a(e,t);return!0},n=e=>{let t,o;do{if(void 0===(t=e._$AM))break;(o=t._$AN).delete(e),e=t}while(0===o?.size)},s=e=>{for(let t;t=e._$AM;e=t){let o=t._$AN;if(void 0===o)t._$AN=o=new Set;else if(o.has(e))break;o.add(e),d(t)}};function l(e){void 0!==this._$AN?(n(this),this._$AM=e,s(this)):this._$AM=e}function c(e,t=!1,o=0){let r=this._$AH,i=this._$AN;if(void 0!==i&&0!==i.size)if(t)if(Array.isArray(r))for(let e=o;e<r.length;e++)a(r[e],!1),n(r[e]);else null!=r&&(a(r,!1),n(r));else a(this,e)}let d=e=>{e.type==i.PartType.CHILD&&(e._$AP??=c,e._$AQ??=l)};class u extends i.Directive{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,o){super._$AT(e,t,o),s(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(a(this,e),n(this))}setValue(e){if(r(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}e.s(["AsyncDirective",()=>u],215951)},684326,765090,e=>{"use strict";var t=e.i(654479),o=e.i(215951),r=e.i(391909);let i=()=>new a;class a{}let n=new WeakMap,s=(0,r.directive)(class extends o.AsyncDirective{render(e){return t.nothing}update(e,[o]){let r=o!==this.G;return r&&void 0!==this.G&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.G=o,this.ht=e.options?.host,this.rt(this.ct=e.element)),t.nothing}rt(e){if(this.isConnected||(e=void 0),"function"==typeof this.G){let t=this.ht??globalThis,o=n.get(t);void 0===o&&(o=new WeakMap,n.set(t,o)),void 0!==o.get(this.G)&&this.G.call(this.ht,void 0),o.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?n.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});e.s(["createRef",()=>i,"ref",()=>s],765090),e.s([],684326)},835902,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(234051);var i=e.i(829389);e.i(684326);var a=e.i(765090);e.i(852634),e.i(839009);var n=e.i(459088),s=e.i(645975),l=e.i(162611);let c=l.css`
  :host {
    position: relative;
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    gap: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  .wui-input-text-container {
    position: relative;
    display: flex;
  }

  input {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    color: inherit;
    background: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[3]} ${({spacing:e})=>e[10]};
    font-size: ${({textSize:e})=>e.large};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    font-weight: ${({fontWeight:e})=>e.regular};
    font-family: ${({fontFamily:e})=>e.regular};
  }

  input[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[4]} ${({spacing:e})=>e[10]};
  }

  @media (hover: hover) and (pointer: fine) {
    input:hover:enabled {
      border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    }
  }

  input:disabled {
    cursor: unset;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  input:focus:enabled {
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  div.wui-input-text-container:has(input:disabled) {
    opacity: 0.5;
  }

  wui-icon.wui-input-text-left-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    left: ${({spacing:e})=>e[4]};
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button.wui-input-text-submit-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: ${({borderRadius:e})=>e[2]};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button.wui-input-text-submit-button:disabled {
    opacity: 1;
  }

  button.wui-input-text-submit-button.loading wui-icon {
    animation: spin 1s linear infinite;
  }

  button.wui-input-text-submit-button:hover {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  input:has(+ .wui-input-text-submit-button) {
    padding-right: ${({spacing:e})=>e[12]};
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  /* -- Keyframes --------------------------------------------------- */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;var d=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let u=class extends t.LitElement{constructor(){super(...arguments),this.inputElementRef=(0,a.createRef)(),this.disabled=!1,this.loading=!1,this.placeholder="",this.type="text",this.value="",this.size="md"}render(){return o.html` <div class="wui-input-text-container">
        ${this.templateLeftIcon()}
        <input
          data-size=${this.size}
          ${(0,a.ref)(this.inputElementRef)}
          data-testid="wui-input-text"
          type=${this.type}
          enterkeyhint=${(0,i.ifDefined)(this.enterKeyHint)}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this.dispatchInputChangeEvent.bind(this)}
          @keydown=${this.onKeyDown}
          .value=${this.value||""}
        />
        ${this.templateSubmitButton()}
        <slot class="wui-input-text-slot"></slot>
      </div>
      ${this.templateError()} ${this.templateWarning()}`}templateLeftIcon(){return this.icon?o.html`<wui-icon
        class="wui-input-text-left-icon"
        size="md"
        data-size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}templateSubmitButton(){return this.onSubmit?o.html`<button
        class="wui-input-text-submit-button ${this.loading?"loading":""}"
        @click=${this.onSubmit?.bind(this)}
        ?disabled=${this.disabled||this.loading}
      >
        ${this.loading?o.html`<wui-icon name="spinner" size="md"></wui-icon>`:o.html`<wui-icon name="chevronRight" size="md"></wui-icon>`}
      </button>`:null}templateError(){return this.errorText?o.html`<wui-text variant="sm-regular" color="error">${this.errorText}</wui-text>`:null}templateWarning(){return this.warningText?o.html`<wui-text variant="sm-regular" color="warning">${this.warningText}</wui-text>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};u.styles=[n.resetStyles,n.elementStyles,c],d([(0,r.property)()],u.prototype,"icon",void 0),d([(0,r.property)({type:Boolean})],u.prototype,"disabled",void 0),d([(0,r.property)({type:Boolean})],u.prototype,"loading",void 0),d([(0,r.property)()],u.prototype,"placeholder",void 0),d([(0,r.property)()],u.prototype,"type",void 0),d([(0,r.property)()],u.prototype,"value",void 0),d([(0,r.property)()],u.prototype,"errorText",void 0),d([(0,r.property)()],u.prototype,"warningText",void 0),d([(0,r.property)()],u.prototype,"onSubmit",void 0),d([(0,r.property)()],u.prototype,"size",void 0),d([(0,r.property)({attribute:!1})],u.prototype,"onKeyDown",void 0),u=d([(0,s.customElement)("wui-input-text")],u),e.s([],835902)},6957,e=>{"use strict";e.i(835902),e.s([])},923838,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119),i=e.i(675457);e.i(852634),e.i(864380),e.i(839009),e.i(73944);var a=e.i(459088),n=e.i(645975),s=e.i(162611);let l=s.css`
  :host {
    width: 100%;
  }

  button {
    padding: ${({spacing:e})=>e[3]};
    display: flex;
    gap: ${({spacing:e})=>e[3]};
    justify-content: space-between;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: transparent;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: ${({spacing:e})=>e[10]};
    height: ${({spacing:e})=>e[10]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  .token-name-container {
    flex: 1;
  }
`;var c=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends t.LitElement{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return o.html`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="2" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex
            flexDirection="column"
            justifyContent="space-between"
            gap="1"
            class="token-name-container"
          >
            <wui-text variant="md-regular" color="primary" lineClamp="1">
              ${this.tokenName}
            </wui-text>
            <wui-text variant="sm-regular-mono" color="secondary">
              ${i.NumberUtil.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          justifyContent="space-between"
          gap="1"
          alignItems="flex-end"
          width="auto"
        >
          <wui-text variant="md-regular-mono" color="primary"
            >$${this.tokenValue.toFixed(2)}</wui-text
          >
          <wui-text variant="sm-regular-mono" color="secondary">
            ${i.NumberUtil.formatNumberToLocalString(this.tokenAmount,4)}
          </wui-text>
        </wui-flex>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?o.html`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:o.html`<wui-icon name="coinPlaceholder" color="default"></wui-icon>`}};d.styles=[a.resetStyles,a.elementStyles,l],c([(0,r.property)()],d.prototype,"tokenName",void 0),c([(0,r.property)()],d.prototype,"tokenImageUrl",void 0),c([(0,r.property)({type:Number})],d.prototype,"tokenValue",void 0),c([(0,r.property)()],d.prototype,"tokenAmount",void 0),c([(0,r.property)()],d.prototype,"tokenCurrency",void 0),c([(0,r.property)({type:Boolean})],d.prototype,"clickable",void 0),d=c([(0,n.customElement)("wui-list-token")],d),e.s([],923838)},221803,e=>{"use strict";e.i(812207);var t=e.i(604148),o=e.i(654479);e.i(374576);var r=e.i(120119);e.i(864380);var i=e.i(459088),a=e.i(112699),n=e.i(645975),s=e.i(162611);let l=s.css`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
    border-radius: ${({borderRadius:e})=>e[16]};
    overflow: hidden;
    position: relative;
  }

  :host([data-variant='generated']) {
    --mixed-local-color-1: var(--local-color-1);
    --mixed-local-color-2: var(--local-color-2);
    --mixed-local-color-3: var(--local-color-3);
    --mixed-local-color-4: var(--local-color-4);
    --mixed-local-color-5: var(--local-color-5);
  }

  :host([data-variant='generated']) {
    background: radial-gradient(
      var(--local-radial-circle),
      #fff 0.52%,
      var(--mixed-local-color-5) 31.25%,
      var(--mixed-local-color-3) 51.56%,
      var(--mixed-local-color-2) 65.63%,
      var(--mixed-local-color-1) 82.29%,
      var(--mixed-local-color-4) 100%
    );
  }

  :host([data-variant='default']) {
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      #f5ccfc 31.25%,
      #dba4f5 51.56%,
      #9a8ee8 65.63%,
      #6493da 82.29%,
      #6ebdea 100%
    );
  }
`;var c=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends t.LitElement{constructor(){super(...arguments),this.imageSrc=void 0,this.alt=void 0,this.address=void 0,this.size="xl"}render(){let e={inherit:"inherit",xxs:"3",xs:"5",sm:"6",md:"8",mdl:"8",lg:"10",xl:"16",xxl:"20"};return this.style.cssText=`
    --local-width: var(--apkt-spacing-${e[this.size??"xl"]});
    --local-height: var(--apkt-spacing-${e[this.size??"xl"]});
    `,o.html`${this.visualTemplate()}`}visualTemplate(){if(this.imageSrc)return this.dataset.variant="image",o.html`<wui-image src=${this.imageSrc} alt=${this.alt??"avatar"}></wui-image>`;if(this.address){this.dataset.variant="generated";let e=a.UiHelperUtil.generateAvatarColors(this.address);return this.style.cssText+=`
 ${e}`,null}return this.dataset.variant="default",null}};d.styles=[i.resetStyles,l],c([(0,r.property)()],d.prototype,"imageSrc",void 0),c([(0,r.property)()],d.prototype,"alt",void 0),c([(0,r.property)()],d.prototype,"address",void 0),c([(0,r.property)()],d.prototype,"size",void 0),d=c([(0,n.customElement)("wui-avatar")],d),e.s([],221803)},982012,e=>{e.v(t=>Promise.all(["static/chunks/f79f2c5953f345e0.js"].map(t=>e.l(t))).then(()=>t(596403)))},340171,e=>{e.v(t=>Promise.all(["static/chunks/b218fd65e6ffb811.js"].map(t=>e.l(t))).then(()=>t(169592)))},210729,e=>{e.v(t=>Promise.all(["static/chunks/ea1c0442515bc44e.js"].map(t=>e.l(t))).then(()=>t(786977)))},480342,e=>{e.v(t=>Promise.all(["static/chunks/0cd1a5667c2e4e4e.js"].map(t=>e.l(t))).then(()=>t(532833)))},995724,e=>{e.v(t=>Promise.all(["static/chunks/d5ab41af19e6a5a5.js"].map(t=>e.l(t))).then(()=>t(972412)))},952792,e=>{e.v(t=>Promise.all(["static/chunks/b89837e50110ba10.js"].map(t=>e.l(t))).then(()=>t(126763)))},196302,e=>{e.v(t=>Promise.all(["static/chunks/4e8ef5a5d595698a.js"].map(t=>e.l(t))).then(()=>t(843229)))},344243,e=>{e.v(t=>Promise.all(["static/chunks/75acf4591c63eb7b.js"].map(t=>e.l(t))).then(()=>t(412721)))},959668,e=>{e.v(t=>Promise.all(["static/chunks/4041af2fac6a9121.js"].map(t=>e.l(t))).then(()=>t(336682)))},841373,e=>{e.v(t=>Promise.all(["static/chunks/570b3d7e7744bb4c.js"].map(t=>e.l(t))).then(()=>t(51383)))},969595,e=>{e.v(t=>Promise.all(["static/chunks/23fefe401a57db01.js"].map(t=>e.l(t))).then(()=>t(4289)))},233052,e=>{e.v(t=>Promise.all(["static/chunks/87f44e273cb4e5e7.js"].map(t=>e.l(t))).then(()=>t(656357)))},500280,e=>{e.v(t=>Promise.all(["static/chunks/a4696f09ba9afd99.js"].map(t=>e.l(t))).then(()=>t(478319)))},292833,e=>{e.v(t=>Promise.all(["static/chunks/2f85facf2887e0a0.js"].map(t=>e.l(t))).then(()=>t(861289)))},617096,e=>{e.v(t=>Promise.all(["static/chunks/e5e1dc9e06f2be99.js"].map(t=>e.l(t))).then(()=>t(926703)))},205963,e=>{e.v(t=>Promise.all(["static/chunks/b588583c04ed0374.js"].map(t=>e.l(t))).then(()=>t(409953)))},548774,e=>{e.v(t=>Promise.all(["static/chunks/adb5466e161adf4d.js"].map(t=>e.l(t))).then(()=>t(632295)))},550090,e=>{e.v(t=>Promise.all(["static/chunks/c25aa0dfe5629950.js"].map(t=>e.l(t))).then(()=>t(152019)))},538711,e=>{e.v(t=>Promise.all(["static/chunks/cbb03953703d9882.js"].map(t=>e.l(t))).then(()=>t(164871)))},650621,e=>{e.v(t=>Promise.all(["static/chunks/3ce4429aafead659.js"].map(t=>e.l(t))).then(()=>t(159021)))},105462,e=>{e.v(t=>Promise.all(["static/chunks/5a755da1bbfd47e3.js"].map(t=>e.l(t))).then(()=>t(765788)))},470963,e=>{e.v(t=>Promise.all(["static/chunks/70afb36b7c6f3f82.js"].map(t=>e.l(t))).then(()=>t(617729)))},956906,e=>{e.v(t=>Promise.all(["static/chunks/527aa7d00804c639.js"].map(t=>e.l(t))).then(()=>t(734056)))},978023,e=>{e.v(t=>Promise.all(["static/chunks/3633a97065da4148.js"].map(t=>e.l(t))).then(()=>t(271507)))},69039,e=>{e.v(t=>Promise.all(["static/chunks/fd73af2dcad2036d.js"].map(t=>e.l(t))).then(()=>t(402658)))},63605,e=>{e.v(t=>Promise.all(["static/chunks/27d1bb06a569fc58.js"].map(t=>e.l(t))).then(()=>t(739621)))},542324,e=>{e.v(t=>Promise.all(["static/chunks/d8815c6e982e855e.js"].map(t=>e.l(t))).then(()=>t(111923)))},784968,e=>{e.v(t=>Promise.all(["static/chunks/9260b0073bc27263.js"].map(t=>e.l(t))).then(()=>t(674571)))},944020,e=>{e.v(t=>Promise.all(["static/chunks/c7bffff505a3f1cc.js"].map(t=>e.l(t))).then(()=>t(384535)))},750711,e=>{e.v(t=>Promise.all(["static/chunks/6c06d9eb4d536639.js"].map(t=>e.l(t))).then(()=>t(15680)))},956601,e=>{e.v(t=>Promise.all(["static/chunks/9957999e48ddb0da.js"].map(t=>e.l(t))).then(()=>t(301958)))},281254,e=>{e.v(t=>Promise.all(["static/chunks/9c096cd7c35afd5b.js"].map(t=>e.l(t))).then(()=>t(111420)))},179893,e=>{e.v(t=>Promise.all(["static/chunks/c77b5b2f65d349d4.js"].map(t=>e.l(t))).then(()=>t(852452)))},201514,e=>{e.v(t=>Promise.all(["static/chunks/21259a4d5813cc21.js"].map(t=>e.l(t))).then(()=>t(335252)))},144980,e=>{e.v(t=>Promise.all(["static/chunks/ffadb9c65e964efc.js"].map(t=>e.l(t))).then(()=>t(680835)))},684074,e=>{e.v(t=>Promise.all(["static/chunks/01ea06d1fad36eea.js"].map(t=>e.l(t))).then(()=>t(294301)))},967422,e=>{e.v(t=>Promise.all(["static/chunks/7e1ea45fe40513ab.js"].map(t=>e.l(t))).then(()=>t(389931)))},413200,e=>{e.v(t=>Promise.all(["static/chunks/0190c23ef20d9915.js"].map(t=>e.l(t))).then(()=>t(969097)))},248479,e=>{e.v(t=>Promise.all(["static/chunks/c16e09491885a16c.js"].map(t=>e.l(t))).then(()=>t(288299)))},123903,e=>{e.v(t=>Promise.all(["static/chunks/2045decda27eea90.js"].map(t=>e.l(t))).then(()=>t(266712)))},177793,e=>{e.v(t=>Promise.all(["static/chunks/ec4ce3dab523212f.js"].map(t=>e.l(t))).then(()=>t(71960)))},104447,e=>{e.v(t=>Promise.all(["static/chunks/de8fd5c7ea6619a8.js"].map(t=>e.l(t))).then(()=>t(465425)))},593690,e=>{e.v(t=>Promise.all(["static/chunks/4be28e5e9b07f360.js"].map(t=>e.l(t))).then(()=>t(365891)))},551383,e=>{e.v(t=>Promise.all(["static/chunks/d487e7f2549e7b24.js"].map(t=>e.l(t))).then(()=>t(284131)))},365739,e=>{e.v(t=>Promise.all(["static/chunks/90b00338dcc1aa6b.js"].map(t=>e.l(t))).then(()=>t(709900)))},183589,e=>{e.v(t=>Promise.all(["static/chunks/29ac59ae03a247ad.js"].map(t=>e.l(t))).then(()=>t(645017)))},809957,e=>{e.v(t=>Promise.all(["static/chunks/6af9c0d473cfd028.js"].map(t=>e.l(t))).then(()=>t(644919)))},722236,e=>{e.v(t=>Promise.all(["static/chunks/b2389478ea8ca9e5.js"].map(t=>e.l(t))).then(()=>t(906501)))},40934,e=>{e.v(t=>Promise.all(["static/chunks/f952c4ad43b5d787.js"].map(t=>e.l(t))).then(()=>t(713559)))},971802,e=>{e.v(t=>Promise.all(["static/chunks/b5190ac36d32e4ab.js"].map(t=>e.l(t))).then(()=>t(994384)))},557792,e=>{e.v(t=>Promise.all(["static/chunks/c91fa96a3ee248c2.js"].map(t=>e.l(t))).then(()=>t(576208)))},807885,e=>{e.v(t=>Promise.all(["static/chunks/588ba01ddf63ba8f.js"].map(t=>e.l(t))).then(()=>t(56529)))}]);

//# debugId=f9da3621-aef0-959b-e9e2-a08f036eb593
