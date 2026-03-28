;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="0d0bf44b-7d26-b278-d683-545966e46b0c")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,899230,t=>{"use strict";let e;var s=t.i(271645),r=t.i(255519),i=t.i(247167);let n={ENOENT:-2,EISDIR:-21,ENOTDIR:-20,EACCES:-13,EEXIST:-17,ENOTEMPTY:-39,EINVAL:-22,EIO:-5,ENOSPC:-28,EBUSY:-16,EINTR:-4,ENOTSUP:-95,ERANGE:-34,EBADF:-9,EROOT:-1};class o extends Error{errno;syscall;path;constructor(t,e,s,r,i){super(t,{cause:i}),this.name=e,this.errno=n[e]||-1,this.path=s,this.syscall=r}}class a extends o{constructor(t,e,s,r){super(e,{argument:"EINVAL",format:"INVALID_FORMAT",descriptor:"EBADF",overflow:"ERANGE"}[t],s,"validate",r)}}let h=[".jpg",".jpeg",".png",".gif",".bmp",".webp",".ico",".tiff",".tga",".mp3",".wav",".ogg",".flac",".aac",".wma",".m4a",".mp4",".avi",".mov",".wmv",".flv",".webm",".mkv",".m4v",".pdf",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".zip",".rar",".7z",".tar",".gz",".bz2",".exe",".dll",".so",".dylib",".dat",".db",".sqlite",".bin",".obj",".fbx",".3ds"];function l(t){let e=t.lastIndexOf(".");if(e<=0)return!0;let s=t.slice(e).toLowerCase();return h.includes(s)}function c(t,e="utf-8"){switch(e){case"utf8":case"utf-8":return new TextEncoder().encode(t);case"utf16le":case"utf-16le":case"ucs2":case"ucs-2":var s=t;let r=new Uint8Array(2*s.length);for(let t=0;t<s.length;t++){let e=s.charCodeAt(t);r[2*t]=255&e,r[2*t+1]=e>>8}return r;case"ascii":var i=t;let n=new Uint8Array(i.length);for(let t=0;t<i.length;t++)n[t]=127&i.charCodeAt(t);return n;case"latin1":var o=t;let h=new Uint8Array(o.length);for(let t=0;t<o.length;t++)h[t]=255&o.charCodeAt(t);return h;case"binary":return Uint8Array.from(t,t=>t.charCodeAt(0));case"base64":return Uint8Array.from(atob(t),t=>t.charCodeAt(0));case"hex":if(!/^[\da-f]+$/i.test(t)||t.length%2!=0)throw new a("format","Invalid hex string");return Uint8Array.from(t.match(/.{1,2}/g).map(t=>parseInt(t,16)));default:return console.warn("Encoding not supported, falling back to UTF-8"),new TextEncoder().encode(t)}}function p(t,e="utf-8"){switch(e){case"utf8":case"utf-8":return new TextDecoder().decode(t);case"utf16le":case"utf-16le":case"ucs2":case"ucs-2":var s;return(s=t).length%2!=0&&(console.warn("Invalid UTF-16LE buffer length, truncating last byte"),s=s.slice(0,s.length-1)),String.fromCharCode(...new Uint16Array(s.buffer,s.byteOffset,s.byteLength/2));case"latin1":return String.fromCharCode(...t);case"ascii":return String.fromCharCode(...t.map(t=>127&t));case"base64":return btoa(String.fromCharCode(...t));case"hex":return Array.from(t).map(t=>t.toString(16).padStart(2,"0")).join("");default:return console.warn("Unsupported encoding, falling back to UTF-8"),new TextDecoder().decode(t)}}var f=((e=f||{}).Added="added",e.Changed="changed",e.Removed="removed",e);let u=(t,e,s)=>{let r=t instanceof RegExp?d(t,s):t,i=e instanceof RegExp?d(e,s):e,n=null!==r&&null!=i&&g(r,i,s);return n&&{start:n[0],end:n[1],pre:s.slice(0,n[0]),body:s.slice(n[0]+r.length,n[1]),post:s.slice(n[1]+i.length)}},d=(t,e)=>{let s=e.match(t);return s?s[0]:null},g=(t,e,s)=>{let r,i,n,o,a,h=s.indexOf(t),l=s.indexOf(e,h+1),c=h;if(h>=0&&l>0){if(t===e)return[h,l];for(r=[],n=s.length;c>=0&&!a;){if(c===h)r.push(c),h=s.indexOf(t,c+1);else if(1===r.length){let t=r.pop();void 0!==t&&(a=[t,l])}else void 0!==(i=r.pop())&&i<n&&(n=i,o=l),l=s.indexOf(e,c+1);c=h<l&&h>=0?h:l}r.length&&void 0!==o&&(a=[n,o])}return a},y="\0SLASH"+Math.random()+"\0",m="\0OPEN"+Math.random()+"\0",w="\0CLOSE"+Math.random()+"\0",b="\0COMMA"+Math.random()+"\0",v="\0PERIOD"+Math.random()+"\0",x=RegExp(y,"g"),E=RegExp(m,"g"),S=RegExp(w,"g"),O=RegExp(b,"g"),P=RegExp(v,"g"),A=/\\\\/g,F=/\\{/g,T=/\\}/g,R=/\\,/g,C=/\\./g;function $(t){return isNaN(t)?t.charCodeAt(0):parseInt(t,10)}function N(t){return t.replace(x,"\\").replace(E,"{").replace(S,"}").replace(O,",").replace(P,".")}function I(t){return"{"+t+"}"}function M(t){return/^-?0\d/.test(t)}function D(t,e){return t<=e}function k(t,e){return t>=e}let _=t=>{if("string"!=typeof t)throw TypeError("invalid pattern");if(t.length>65536)throw TypeError("pattern is too long")},j={"[:alnum:]":["\\p{L}\\p{Nl}\\p{Nd}",!0],"[:alpha:]":["\\p{L}\\p{Nl}",!0],"[:ascii:]":["\\x00-\\x7f",!1],"[:blank:]":["\\p{Zs}\\t",!0],"[:cntrl:]":["\\p{Cc}",!0],"[:digit:]":["\\p{Nd}",!0],"[:graph:]":["\\p{Z}\\p{C}",!0,!0],"[:lower:]":["\\p{Ll}",!0],"[:print:]":["\\p{C}",!0],"[:punct:]":["\\p{P}",!0],"[:space:]":["\\p{Z}\\t\\r\\n\\v\\f",!0],"[:upper:]":["\\p{Lu}",!0],"[:word:]":["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}",!0],"[:xdigit:]":["A-Fa-f0-9",!1]},W=t=>t.replace(/[[\]\\-]/g,"\\$&"),L=(t,e)=>{if("["!==t.charAt(e))throw Error("not in a brace expression");let s=[],r=[],i=e+1,n=!1,o=!1,a=!1,h=!1,l=e,c="";t:for(;i<t.length;){let p=t.charAt(i);if(("!"===p||"^"===p)&&i===e+1){h=!0,i++;continue}if("]"===p&&n&&!a){l=i+1;break}if(n=!0,"\\"===p&&!a){a=!0,i++;continue}if("["===p&&!a){for(let[n,[a,h,l]]of Object.entries(j))if(t.startsWith(n,i)){if(c)return["$.",!1,t.length-e,!0];i+=n.length,l?r.push(a):s.push(a),o=o||h;continue t}}if(a=!1,c){p>c?s.push(W(c)+"-"+W(p)):p===c&&s.push(W(p)),c="",i++;continue}if(t.startsWith("-]",i+1)){s.push(W(p+"-")),i+=2;continue}if(t.startsWith("-",i+1)){c=p,i+=2;continue}s.push(W(p)),i++}if(l<i)return["",!1,0,!1];if(!s.length&&!r.length)return["$.",!1,t.length-e,!0];if(0===r.length&&1===s.length&&/^\\?.$/.test(s[0])&&!h)return[(2===s[0].length?s[0].slice(-1):s[0]).replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),!1,l-e,!1];let p="["+(h?"^":"")+s.join("")+"]",f="["+(h?"":"^")+r.join("")+"]";return[s.length&&r.length?"("+p+"|"+f+")":s.length?p:f,o,l-e,!0]},z=(t,{windowsPathsNoEscape:e=!1}={})=>e?t.replace(/\[([^\/\\])\]/g,"$1"):t.replace(/((?!\\).|^)\[([^\/\\])\]/g,"$1$2").replace(/\\([^\/])/g,"$1"),U=new Set(["!","?","+","*","@"]),B=t=>U.has(t),H="(?!\\.)",G=new Set(["[","."]),V=new Set(["..","."]),Y=new Set("().*{}+?[]^$\\!"),Z=t=>t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),q="[^/]",J=q+"*?",X=q+"+?";class K{type;#t;#e;#s=!1;#r=[];#i;#n;#o;#a=!1;#h;#l;#c=!1;constructor(t,e,s={}){this.type=t,t&&(this.#e=!0),this.#i=e,this.#t=this.#i?this.#i.#t:this,this.#h=this.#t===this?s:this.#t.#h,this.#o=this.#t===this?[]:this.#t.#o,"!"!==t||this.#t.#a||this.#o.push(this),this.#n=this.#i?this.#i.#r.length:0}get hasMagic(){if(void 0!==this.#e)return this.#e;for(let t of this.#r)if("string"!=typeof t&&(t.type||t.hasMagic))return this.#e=!0;return this.#e}toString(){return void 0!==this.#l?this.#l:this.type?this.#l=this.type+"("+this.#r.map(t=>String(t)).join("|")+")":this.#l=this.#r.map(t=>String(t)).join("")}#p(){let t;if(this!==this.#t)throw Error("should only call on root");if(this.#a)return this;for(this.toString(),this.#a=!0;t=this.#o.pop();){if("!"!==t.type)continue;let e=t,s=e.#i;for(;s;){for(let r=e.#n+1;!s.type&&r<s.#r.length;r++)for(let e of t.#r){if("string"==typeof e)throw Error("string part in extglob AST??");e.copyIn(s.#r[r])}s=(e=s).#i}}return this}push(...t){for(let e of t)if(""!==e){if("string"!=typeof e&&!(e instanceof K&&e.#i===this))throw Error("invalid part: "+e);this.#r.push(e)}}toJSON(){let t=null===this.type?this.#r.slice().map(t=>"string"==typeof t?t:t.toJSON()):[this.type,...this.#r.map(t=>t.toJSON())];return this.isStart()&&!this.type&&t.unshift([]),this.isEnd()&&(this===this.#t||this.#t.#a&&this.#i?.type==="!")&&t.push({}),t}isStart(){if(this.#t===this)return!0;if(!this.#i?.isStart())return!1;if(0===this.#n)return!0;let t=this.#i;for(let e=0;e<this.#n;e++){let s=t.#r[e];if(!(s instanceof K&&"!"===s.type))return!1}return!0}isEnd(){if(this.#t===this||this.#i?.type==="!")return!0;if(!this.#i?.isEnd())return!1;if(!this.type)return this.#i?.isEnd();let t=this.#i?this.#i.#r.length:0;return this.#n===t-1}copyIn(t){"string"==typeof t?this.push(t):this.push(t.clone(this))}clone(t){let e=new K(this.type,t);for(let t of this.#r)e.copyIn(t);return e}static #f(t,e,s,r){let i=!1,n=!1,o=-1,a=!1;if(null===e.type){let h=s,l="";for(;h<t.length;){let s=t.charAt(h++);if(i||"\\"===s){i=!i,l+=s;continue}if(n){h===o+1?("^"===s||"!"===s)&&(a=!0):"]"!==s||h===o+2&&a||(n=!1),l+=s;continue}if("["===s){n=!0,o=h,a=!1,l+=s;continue}if(!r.noext&&B(s)&&"("===t.charAt(h)){e.push(l),l="";let i=new K(s,e);h=K.#f(t,i,h,r),e.push(i);continue}l+=s}return e.push(l),h}let h=s+1,l=new K(null,e),c=[],p="";for(;h<t.length;){let s=t.charAt(h++);if(i||"\\"===s){i=!i,p+=s;continue}if(n){h===o+1?("^"===s||"!"===s)&&(a=!0):"]"!==s||h===o+2&&a||(n=!1),p+=s;continue}if("["===s){n=!0,o=h,a=!1,p+=s;continue}if(B(s)&&"("===t.charAt(h)){l.push(p),p="";let e=new K(s,l);l.push(e),h=K.#f(t,e,h,r);continue}if("|"===s){l.push(p),p="",c.push(l),l=new K(null,e);continue}if(")"===s)return""===p&&0===e.#r.length&&(e.#c=!0),l.push(p),p="",e.push(...c,l),h;p+=s}return e.type=null,e.#e=void 0,e.#r=[t.substring(s-1)],h}static fromGlob(t,e={}){let s=new K(null,void 0,e);return K.#f(t,s,0,e),s}toMMPattern(){if(this!==this.#t)return this.#t.toMMPattern();let t=this.toString(),[e,s,r,i]=this.toRegExpSource();return r||this.#e||this.#h.nocase&&!this.#h.nocaseMagicOnly&&t.toUpperCase()!==t.toLowerCase()?Object.assign(RegExp(`^${e}$`,(this.#h.nocase?"i":"")+(i?"u":"")),{_src:e,_glob:t}):s}get options(){return this.#h}toRegExpSource(t){let e=t??!!this.#h.dot;if(this.#t===this&&this.#p(),!this.type){let s=this.isStart()&&this.isEnd(),r=this.#r.map(e=>{let[r,i,n,o]="string"==typeof e?K.#u(e,this.#e,s):e.toRegExpSource(t);return this.#e=this.#e||n,this.#s=this.#s||o,r}).join(""),i="";if(this.isStart()&&"string"==typeof this.#r[0]&&!(1===this.#r.length&&V.has(this.#r[0]))){let s=e&&G.has(r.charAt(0))||r.startsWith("\\.")&&G.has(r.charAt(2))||r.startsWith("\\.\\.")&&G.has(r.charAt(4)),n=!e&&!t&&G.has(r.charAt(0));i=s?"(?!(?:^|/)\\.\\.?(?:$|/))":n?H:""}let n="";return this.isEnd()&&this.#t.#a&&this.#i?.type==="!"&&(n="(?:$|\\/)"),[i+r+n,z(r),this.#e=!!this.#e,this.#s]}let s="*"===this.type||"+"===this.type,r="!"===this.type?"(?:(?!(?:":"(?:",i=this.#d(e);if(this.isStart()&&this.isEnd()&&!i&&"!"!==this.type){let t=this.toString();return this.#r=[t],this.type=null,this.#e=void 0,[t,z(this.toString()),!1,!1]}let n=!s||t||e||!H?"":this.#d(!0);n===i&&(n=""),n&&(i=`(?:${i})(?:${n})*?`);return["!"===this.type&&this.#c?(this.isStart()&&!e?H:"")+X:r+i+("!"===this.type?"))"+(!this.isStart()||e||t?"":H)+J+")":"@"===this.type?")":"?"===this.type?")?":"+"===this.type&&n?")":"*"===this.type&&n?")?":`)${this.type}`),z(i),this.#e=!!this.#e,this.#s]}#d(t){return this.#r.map(e=>{if("string"==typeof e)throw Error("string type in extglob ast??");let[s,r,i,n]=e.toRegExpSource(t);return this.#s=this.#s||n,s}).filter(t=>!(this.isStart()&&this.isEnd())||!!t).join("|")}static #u(t,e,s=!1){let r=!1,i="",n=!1;for(let o=0;o<t.length;o++){let a=t.charAt(o);if(r){r=!1,i+=(Y.has(a)?"\\":"")+a;continue}if("\\"===a){o===t.length-1?i+="\\\\":r=!0;continue}if("["===a){let[s,r,a,h]=L(t,o);if(a){i+=s,n=n||r,o+=a-1,e=e||h;continue}}if("*"===a){s&&"*"===t?i+=X:i+=J,e=!0;continue}if("?"===a){i+=q,e=!0;continue}i+=Z(a)}return[i,z(t),!!e,n]}}let Q=(t,e,s={})=>(_(e),(!!s.nocomment||"#"!==e.charAt(0))&&new tm(e,s).match(t)),tt=/^\*+([^+@!?\*\[\(]*)$/,te=/^\*+\.\*+$/,ts=t=>!t.startsWith(".")&&t.includes("."),tr=t=>"."!==t&&".."!==t&&t.includes("."),ti=/^\.\*+$/,tn=t=>"."!==t&&".."!==t&&t.startsWith("."),to=/^\*+$/,ta=t=>0!==t.length&&!t.startsWith("."),th=t=>0!==t.length&&"."!==t&&".."!==t,tl=/^\?+([^+@!?\*\[\(]*)?$/,tc=([t])=>{let e=t.length;return t=>t.length===e&&!t.startsWith(".")},tp=([t])=>{let e=t.length;return t=>t.length===e&&"."!==t&&".."!==t},tf="object"==typeof i.default&&i.default?"object"==typeof i.default.env&&i.default.env&&i.default.env.__MINIMATCH_TESTING_PLATFORM__||i.default.platform:"posix";Q.sep="win32"===tf?"\\":"/";let tu=Symbol("globstar **");Q.GLOBSTAR=tu;Q.filter=(t,e={})=>s=>Q(s,t,e);let td=(t,e={})=>Object.assign({},t,e);Q.defaults=t=>{if(!t||"object"!=typeof t||!Object.keys(t).length)return Q;let e=Q;return Object.assign((s,r,i={})=>e(s,r,td(t,i)),{Minimatch:class extends e.Minimatch{constructor(e,s={}){super(e,td(t,s))}static defaults(s){return e.defaults(td(t,s)).Minimatch}},AST:class extends e.AST{constructor(e,s,r={}){super(e,s,td(t,r))}static fromGlob(s,r={}){return e.AST.fromGlob(s,td(t,r))}},unescape:(s,r={})=>e.unescape(s,td(t,r)),escape:(s,r={})=>e.escape(s,td(t,r)),filter:(s,r={})=>e.filter(s,td(t,r)),defaults:s=>e.defaults(td(t,s)),makeRe:(s,r={})=>e.makeRe(s,td(t,r)),braceExpand:(s,r={})=>e.braceExpand(s,td(t,r)),match:(s,r,i={})=>e.match(s,r,td(t,i)),sep:e.sep,GLOBSTAR:tu})};let tg=(t,e={})=>{var s;return _(t),e.nobrace||!/\{(?:(?!\{).)*\}/.test(t)?[t]:(s=t)?("{}"===s.slice(0,2)&&(s="\\{\\}"+s.slice(2)),(function t(e,s){let r=[],i=u("{","}",e);if(!i)return[e];let n=i.pre,o=i.post.length?t(i.post,!1):[""];if(/\$$/.test(i.pre))for(let t=0;t<o.length;t++){let e=n+"{"+i.body+"}"+o[t];r.push(e)}else{let a,h,l=/^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(i.body),c=/^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(i.body),p=l||c,f=i.body.indexOf(",")>=0;if(!p&&!f)return i.post.match(/,(?!,).*\}/)?t(e=i.pre+"{"+i.body+w+i.post):[e];if(p)a=i.body.split(/\.\./);else if(1===(a=function t(e){if(!e)return[""];let s=[],r=u("{","}",e);if(!r)return e.split(",");let{pre:i,body:n,post:o}=r,a=i.split(",");a[a.length-1]+="{"+n+"}";let h=t(o);return o.length&&(a[a.length-1]+=h.shift(),a.push.apply(a,h)),s.push.apply(s,a),s}(i.body)).length&&void 0!==a[0]&&1===(a=t(a[0],!1).map(I)).length)return o.map(t=>i.pre+a[0]+t);if(p&&void 0!==a[0]&&void 0!==a[1]){let t=$(a[0]),e=$(a[1]),s=Math.max(a[0].length,a[1].length),r=3===a.length&&void 0!==a[2]?Math.abs($(a[2])):1,i=D;e<t&&(r*=-1,i=k);let n=a.some(M);h=[];for(let o=t;i(o,e);o+=r){let t;if(c)"\\"===(t=String.fromCharCode(o))&&(t="");else if(t=String(o),n){let e=s-t.length;if(e>0){let s=Array(e+1).join("0");t=o<0?"-"+s+t.slice(1):s+t}}h.push(t)}}else{h=[];for(let e=0;e<a.length;e++)h.push.apply(h,t(a[e],!1))}for(let t=0;t<h.length;t++)for(let e=0;e<o.length;e++){let i=n+h[t]+o[e];(!s||p||i)&&r.push(i)}}return r})(s.replace(A,y).replace(F,m).replace(T,w).replace(R,b).replace(C,v),!0).map(N)):[]};Q.braceExpand=tg,Q.makeRe=(t,e={})=>new tm(t,e).makeRe(),Q.match=(t,e,s={})=>{let r=new tm(e,s);return t=t.filter(t=>r.match(t)),r.options.nonull&&!t.length&&t.push(e),t};let ty=/[?*]|[+@!]\(.*?\)|\[|\]/;class tm{options;set;pattern;windowsPathsNoEscape;nonegate;negate;comment;empty;preserveMultipleSlashes;partial;globSet;globParts;nocase;isWindows;platform;windowsNoMagicRoot;regexp;constructor(t,e={}){_(t),e=e||{},this.options=e,this.pattern=t,this.platform=e.platform||tf,this.isWindows="win32"===this.platform,this.windowsPathsNoEscape=!!e.windowsPathsNoEscape||!1===e.allowWindowsEscape,this.windowsPathsNoEscape&&(this.pattern=this.pattern.replace(/\\/g,"/")),this.preserveMultipleSlashes=!!e.preserveMultipleSlashes,this.regexp=null,this.negate=!1,this.nonegate=!!e.nonegate,this.comment=!1,this.empty=!1,this.partial=!!e.partial,this.nocase=!!this.options.nocase,this.windowsNoMagicRoot=void 0!==e.windowsNoMagicRoot?e.windowsNoMagicRoot:!!(this.isWindows&&this.nocase),this.globSet=[],this.globParts=[],this.set=[],this.make()}hasMagic(){if(this.options.magicalBraces&&this.set.length>1)return!0;for(let t of this.set)for(let e of t)if("string"!=typeof e)return!0;return!1}debug(){}make(){let t=this.pattern,e=this.options;if(!e.nocomment&&"#"===t.charAt(0)){this.comment=!0;return}if(!t){this.empty=!0;return}this.parseNegate(),this.globSet=[...new Set(this.braceExpand())],e.debug&&(this.debug=(...t)=>console.error(...t)),this.debug(this.pattern,this.globSet);let s=this.globSet.map(t=>this.slashSplit(t));this.globParts=this.preprocess(s),this.debug(this.pattern,this.globParts);let r=this.globParts.map((t,e,s)=>{if(this.isWindows&&this.windowsNoMagicRoot){let e=""===t[0]&&""===t[1]&&("?"===t[2]||!ty.test(t[2]))&&!ty.test(t[3]),s=/^[a-z]:/i.test(t[0]);if(e)return[...t.slice(0,4),...t.slice(4).map(t=>this.parse(t))];if(s)return[t[0],...t.slice(1).map(t=>this.parse(t))]}return t.map(t=>this.parse(t))});if(this.debug(this.pattern,r),this.set=r.filter(t=>-1===t.indexOf(!1)),this.isWindows)for(let t=0;t<this.set.length;t++){let e=this.set[t];""===e[0]&&""===e[1]&&"?"===this.globParts[t][2]&&"string"==typeof e[3]&&/^[a-z]:$/i.test(e[3])&&(e[2]="?")}this.debug(this.pattern,this.set)}preprocess(t){if(this.options.noglobstar)for(let e=0;e<t.length;e++)for(let s=0;s<t[e].length;s++)"**"===t[e][s]&&(t[e][s]="*");let{optimizationLevel:e=1}=this.options;return e>=2?(t=this.firstPhasePreProcess(t),t=this.secondPhasePreProcess(t)):t=e>=1?this.levelOneOptimize(t):this.adjascentGlobstarOptimize(t),t}adjascentGlobstarOptimize(t){return t.map(t=>{let e=-1;for(;-1!==(e=t.indexOf("**",e+1));){let s=e;for(;"**"===t[s+1];)s++;s!==e&&t.splice(e,s-e)}return t})}levelOneOptimize(t){return t.map(t=>0===(t=t.reduce((t,e)=>{let s=t[t.length-1];return"**"===e&&"**"===s||(".."===e&&s&&".."!==s&&"."!==s&&"**"!==s?t.pop():t.push(e)),t},[])).length?[""]:t)}levelTwoFileOptimize(t){Array.isArray(t)||(t=this.slashSplit(t));let e=!1;do{if(e=!1,!this.preserveMultipleSlashes){for(let s=1;s<t.length-1;s++){let r=t[s];1===s&&""===r&&""===t[0]||("."===r||""===r)&&(e=!0,t.splice(s,1),s--)}"."===t[0]&&2===t.length&&("."===t[1]||""===t[1])&&(e=!0,t.pop())}let s=0;for(;-1!==(s=t.indexOf("..",s+1));){let r=t[s-1];r&&"."!==r&&".."!==r&&"**"!==r&&(e=!0,t.splice(s-1,2),s-=2)}}while(e)return 0===t.length?[""]:t}firstPhasePreProcess(t){let e=!1;do for(let s of(e=!1,t)){let r=-1;for(;-1!==(r=s.indexOf("**",r+1));){let i=r;for(;"**"===s[i+1];)i++;i>r&&s.splice(r+1,i-r);let n=s[r+1],o=s[r+2],a=s[r+3];if(".."!==n||!o||"."===o||".."===o||!a||"."===a||".."===a)continue;e=!0,s.splice(r,1);let h=s.slice(0);h[r]="**",t.push(h),r--}if(!this.preserveMultipleSlashes){for(let t=1;t<s.length-1;t++){let r=s[t];1===t&&""===r&&""===s[0]||("."===r||""===r)&&(e=!0,s.splice(t,1),t--)}"."===s[0]&&2===s.length&&("."===s[1]||""===s[1])&&(e=!0,s.pop())}let i=0;for(;-1!==(i=s.indexOf("..",i+1));){let t=s[i-1];if(t&&"."!==t&&".."!==t&&"**"!==t){e=!0;let t=1===i&&"**"===s[i+1]?["."]:[];s.splice(i-1,2,...t),0===s.length&&s.push(""),i-=2}}}while(e)return t}secondPhasePreProcess(t){for(let e=0;e<t.length-1;e++)for(let s=e+1;s<t.length;s++){let r=this.partsMatch(t[e],t[s],!this.preserveMultipleSlashes);if(r){t[e]=[],t[s]=r;break}}return t.filter(t=>t.length)}partsMatch(t,e,s=!1){let r=0,i=0,n=[],o="";for(;r<t.length&&i<e.length;)if(t[r]===e[i])n.push("b"===o?e[i]:t[r]),r++,i++;else if(s&&"**"===t[r]&&e[i]===t[r+1])n.push(t[r]),r++;else if(s&&"**"===e[i]&&t[r]===e[i+1])n.push(e[i]),i++;else if("*"===t[r]&&e[i]&&(this.options.dot||!e[i].startsWith("."))&&"**"!==e[i]){if("b"===o)return!1;o="a",n.push(t[r]),r++,i++}else{if("*"!==e[i]||!t[r]||!this.options.dot&&t[r].startsWith(".")||"**"===t[r]||"a"===o)return!1;o="b",n.push(e[i]),r++,i++}return t.length===e.length&&n}parseNegate(){if(this.nonegate)return;let t=this.pattern,e=!1,s=0;for(let r=0;r<t.length&&"!"===t.charAt(r);r++)e=!e,s++;s&&(this.pattern=t.slice(s)),this.negate=e}matchOne(t,e,s=!1){let r=this.options;if(this.isWindows){let s="string"==typeof t[0]&&/^[a-z]:$/i.test(t[0]),r=!s&&""===t[0]&&""===t[1]&&"?"===t[2]&&/^[a-z]:$/i.test(t[3]),i="string"==typeof e[0]&&/^[a-z]:$/i.test(e[0]),n=!i&&""===e[0]&&""===e[1]&&"?"===e[2]&&"string"==typeof e[3]&&/^[a-z]:$/i.test(e[3]),o=r?3:s?0:void 0,a=n?3:i?0:void 0;if("number"==typeof o&&"number"==typeof a){let[s,r]=[t[o],e[a]];s.toLowerCase()===r.toLowerCase()&&(e[a]=s,a>o?e=e.slice(a):o>a&&(t=t.slice(o)))}}let{optimizationLevel:i=1}=this.options;i>=2&&(t=this.levelTwoFileOptimize(t)),this.debug("matchOne",this,{file:t,pattern:e}),this.debug("matchOne",t.length,e.length);for(var n=0,o=0,a=t.length,h=e.length;n<a&&o<h;n++,o++){let i;this.debug("matchOne loop");var l=e[o],c=t[n];if(this.debug(e,l,c),!1===l)return!1;if(l===tu){this.debug("GLOBSTAR",[e,l,c]);var p=n,f=o+1;if(f===h){for(this.debug("** at the end");n<a;n++)if("."===t[n]||".."===t[n]||!r.dot&&"."===t[n].charAt(0))return!1;return!0}for(;p<a;){var u=t[p];if(this.debug(`
globstar while`,t,p,e,f,u),this.matchOne(t.slice(p),e.slice(f),s))return this.debug("globstar found match!",p,a,u),!0;if("."===u||".."===u||!r.dot&&"."===u.charAt(0)){this.debug("dot detected!",t,p,e,f);break}this.debug("globstar swallow a segment, and continue"),p++}return!!(s&&(this.debug(`
>>> no match, partial?`,t,p,e,f),p===a))}if("string"==typeof l?(i=c===l,this.debug("string match",l,c,i)):(i=l.test(c),this.debug("pattern match",l,c,i)),!i)return!1}if(n===a&&o===h)return!0;if(n===a)return s;if(o===h)return n===a-1&&""===t[n];throw Error("wtf?")}braceExpand(){return tg(this.pattern,this.options)}parse(t){_(t);let e=this.options;if("**"===t)return tu;if(""===t)return"";let s,r=null;(s=t.match(to))?r=e.dot?th:ta:(s=t.match(tt))?r=(e.nocase?e.dot?t=>(t=t.toLowerCase(),e=>e.toLowerCase().endsWith(t)):t=>(t=t.toLowerCase(),e=>!e.startsWith(".")&&e.toLowerCase().endsWith(t)):e.dot?t=>e=>e.endsWith(t):t=>e=>!e.startsWith(".")&&e.endsWith(t))(s[1]):(s=t.match(tl))?r=(e.nocase?e.dot?([t,e=""])=>{let s=tp([t]);return e?(e=e.toLowerCase(),t=>s(t)&&t.toLowerCase().endsWith(e)):s}:([t,e=""])=>{let s=tc([t]);return e?(e=e.toLowerCase(),t=>s(t)&&t.toLowerCase().endsWith(e)):s}:e.dot?([t,e=""])=>{let s=tp([t]);return e?t=>s(t)&&t.endsWith(e):s}:([t,e=""])=>{let s=tc([t]);return e?t=>s(t)&&t.endsWith(e):s})(s):(s=t.match(te))?r=e.dot?tr:ts:(s=t.match(ti))&&(r=tn);let i=K.fromGlob(t,this.options).toMMPattern();return r&&"object"==typeof i&&Reflect.defineProperty(i,"test",{value:r}),i}makeRe(){if(this.regexp||!1===this.regexp)return this.regexp;let t=this.set;if(!t.length)return this.regexp=!1,this.regexp;let e=this.options,s=e.noglobstar?"[^/]*?":e.dot?"(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?":"(?:(?!(?:\\/|^)\\.).)*?",r=new Set(e.nocase?["i"]:[]),i=t.map(t=>{let e=t.map(t=>{if(t instanceof RegExp)for(let e of t.flags.split(""))r.add(e);return"string"==typeof t?t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"):t===tu?tu:t._src});return e.forEach((t,r)=>{let i=e[r+1],n=e[r-1];t!==tu||n===tu||(void 0===n?void 0!==i&&i!==tu?e[r+1]="(?:\\/|"+s+"\\/)?"+i:e[r]=s:void 0===i?e[r-1]=n+"(?:\\/|"+s+")?":i!==tu&&(e[r-1]=n+"(?:\\/|\\/"+s+"\\/)"+i,e[r+1]=tu))}),e.filter(t=>t!==tu).join("/")}).join("|"),[n,o]=t.length>1?["(?:",")"]:["",""];i="^"+n+i+o+"$",this.negate&&(i="^(?!"+i+").+$");try{this.regexp=new RegExp(i,[...r].join(""))}catch{this.regexp=!1}return this.regexp}slashSplit(t){return this.preserveMultipleSlashes?t.split("/"):this.isWindows&&/^\/\/[^\/]+/.test(t)?["",...t.split(/\/+/)]:t.split(/\/+/)}match(t,e=this.partial){if(this.debug("match",t,this.pattern),this.comment)return!1;if(this.empty)return""===t;if("/"===t&&e)return!0;let s=this.options;this.isWindows&&(t=t.split("\\").join("/"));let r=this.slashSplit(t);this.debug(this.pattern,"split",r);let i=this.set;this.debug(this.pattern,"set",i);let n=r[r.length-1];if(!n)for(let t=r.length-2;!n&&t>=0;t--)n=r[t];for(let t=0;t<i.length;t++){let o=i[t],a=r;if(s.matchBase&&1===o.length&&(a=[n]),this.matchOne(a,o,e))return!!s.flipNegate||!this.negate}return!s.flipNegate&&this.negate}static defaults(t){return Q.defaults(t).Minimatch}}Q.AST=K,Q.Minimatch=tm,Q.escape=(t,{windowsPathsNoEscape:e=!1}={})=>e?t.replace(/[?*()[\]]/g,"[$&]"):t.replace(/[?*()[\]\\]/g,"\\$&"),Q.unescape=z;let tw=`/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const bt = Symbol("Comlink.proxy"), Ht = Symbol("Comlink.endpoint"), Wt = Symbol("Comlink.releaseProxy"), J = Symbol("Comlink.finalizer"), U = Symbol("Comlink.thrown"), Ot = (s) => typeof s == "object" && s !== null || typeof s == "function", jt = {
  canHandle: (s) => Ot(s) && s[bt],
  serialize(s) {
    const { port1: t, port2: e } = new MessageChannel();
    return ot(s, t), [e, [e]];
  },
  deserialize(s) {
    return s.start(), Gt(s);
  }
}, _t = {
  canHandle: (s) => Ot(s) && U in s,
  serialize({ value: s }) {
    let t;
    return s instanceof Error ? t = {
      isError: !0,
      value: {
        message: s.message,
        name: s.name,
        stack: s.stack
      }
    } : t = { isError: !1, value: s }, [t, []];
  },
  deserialize(s) {
    throw s.isError ? Object.assign(new Error(s.value.message), s.value) : s.value;
  }
}, Dt = /* @__PURE__ */ new Map([
  ["proxy", jt],
  ["throw", _t]
]);
function Ut(s, t) {
  for (const e of s)
    if (t === e || e === "*" || e instanceof RegExp && e.test(t))
      return !0;
  return !1;
}
function ot(s, t = globalThis, e = ["*"]) {
  t.addEventListener("message", function n(r) {
    if (!r || !r.data)
      return;
    if (!Ut(e, r.origin)) {
      console.warn(\`Invalid origin '\${r.origin}' for comlink proxy\`);
      return;
    }
    const { id: i, type: o, path: a } = Object.assign({ path: [] }, r.data), l = (r.data.argumentList || []).map(C);
    let h;
    try {
      const c = a.slice(0, -1).reduce((u, d) => u[d], s), f = a.reduce((u, d) => u[d], s);
      switch (o) {
        case "GET":
          h = f;
          break;
        case "SET":
          c[a.slice(-1)[0]] = C(r.data.value), h = !0;
          break;
        case "APPLY":
          h = f.apply(c, l);
          break;
        case "CONSTRUCT":
          {
            const u = new f(...l);
            h = Zt(u);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: u, port2: d } = new MessageChannel();
            ot(s, d), h = B(u, [u]);
          }
          break;
        case "RELEASE":
          h = void 0;
          break;
        default:
          return;
      }
    } catch (c) {
      h = { value: c, [U]: 0 };
    }
    Promise.resolve(h).catch((c) => ({ value: c, [U]: 0 })).then((c) => {
      const [f, u] = Y(c);
      t.postMessage(Object.assign(Object.assign({}, f), { id: i }), u), o === "RELEASE" && (t.removeEventListener("message", n), vt(t), J in s && typeof s[J] == "function" && s[J]());
    }).catch((c) => {
      const [f, u] = Y({
        value: new TypeError("Unserializable return value"),
        [U]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, f), { id: i }), u);
    });
  }), t.start && t.start();
}
function Bt(s) {
  return s.constructor.name === "MessagePort";
}
function vt(s) {
  Bt(s) && s.close();
}
function Gt(s, t) {
  const e = /* @__PURE__ */ new Map();
  return s.addEventListener("message", function(r) {
    const { data: i } = r;
    if (!i || !i.id)
      return;
    const o = e.get(i.id);
    if (o)
      try {
        o(i);
      } finally {
        e.delete(i.id);
      }
  }), nt(s, e, [], t);
}
function W(s) {
  if (s)
    throw new Error("Proxy has been released and is not useable");
}
function At(s) {
  return $(s, /* @__PURE__ */ new Map(), {
    type: "RELEASE"
  }).then(() => {
    vt(s);
  });
}
const q = /* @__PURE__ */ new WeakMap(), V = "FinalizationRegistry" in globalThis && new FinalizationRegistry((s) => {
  const t = (q.get(s) || 0) - 1;
  q.set(s, t), t === 0 && At(s);
});
function qt(s, t) {
  const e = (q.get(t) || 0) + 1;
  q.set(t, e), V && V.register(s, t, s);
}
function Vt(s) {
  V && V.unregister(s);
}
function nt(s, t, e = [], n = function() {
}) {
  let r = !1;
  const i = new Proxy(n, {
    get(o, a) {
      if (W(r), a === Wt)
        return () => {
          Vt(i), At(s), t.clear(), r = !0;
        };
      if (a === "then") {
        if (e.length === 0)
          return { then: () => i };
        const l = $(s, t, {
          type: "GET",
          path: e.map((h) => h.toString())
        }).then(C);
        return l.then.bind(l);
      }
      return nt(s, t, [...e, a]);
    },
    set(o, a, l) {
      W(r);
      const [h, c] = Y(l);
      return $(s, t, {
        type: "SET",
        path: [...e, a].map((f) => f.toString()),
        value: h
      }, c).then(C);
    },
    apply(o, a, l) {
      W(r);
      const h = e[e.length - 1];
      if (h === Ht)
        return $(s, t, {
          type: "ENDPOINT"
        }).then(C);
      if (h === "bind")
        return nt(s, t, e.slice(0, -1));
      const [c, f] = ht(l);
      return $(s, t, {
        type: "APPLY",
        path: e.map((u) => u.toString()),
        argumentList: c
      }, f).then(C);
    },
    construct(o, a) {
      W(r);
      const [l, h] = ht(a);
      return $(s, t, {
        type: "CONSTRUCT",
        path: e.map((c) => c.toString()),
        argumentList: l
      }, h).then(C);
    }
  });
  return qt(i, s), i;
}
function Yt(s) {
  return Array.prototype.concat.apply([], s);
}
function ht(s) {
  const t = s.map(Y);
  return [t.map((e) => e[0]), Yt(t.map((e) => e[1]))];
}
const Nt = /* @__PURE__ */ new WeakMap();
function B(s, t) {
  return Nt.set(s, t), s;
}
function Zt(s) {
  return Object.assign(s, { [bt]: !0 });
}
function Y(s) {
  for (const [t, e] of Dt)
    if (e.canHandle(s)) {
      const [n, r] = e.serialize(s);
      return [
        {
          type: "HANDLER",
          name: t,
          value: n
        },
        r
      ];
    }
  return [
    {
      type: "RAW",
      value: s
    },
    Nt.get(s) || []
  ];
}
function C(s) {
  switch (s.type) {
    case "HANDLER":
      return Dt.get(s.name).deserialize(s.value);
    case "RAW":
      return s.value;
  }
}
function $(s, t, e, n) {
  return new Promise((r) => {
    const i = Xt();
    t.set(i, r), s.start && s.start(), s.postMessage(Object.assign({ id: i }, e), n);
  });
}
function Xt() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
var D = /* @__PURE__ */ ((s) => (s.Added = "added", s.Changed = "changed", s.Removed = "removed", s))(D || {});
const Jt = {
  ENOENT: -2,
  // No such file or directory
  EISDIR: -21,
  // Is a directory
  ENOTDIR: -20,
  // Not a directory
  EACCES: -13,
  // Permission denied
  EEXIST: -17,
  // File exists
  ENOTEMPTY: -39,
  // Directory not empty
  EINVAL: -22,
  // Invalid argument
  EIO: -5,
  // I/O error
  ENOSPC: -28,
  // No space left on device
  EBUSY: -16,
  // Device or resource busy
  EINTR: -4,
  // Interrupted system call
  ENOTSUP: -95,
  // Operation not supported
  ERANGE: -34,
  // Result too large
  EBADF: -9,
  // Bad file descriptor
  EROOT: -1
  // Custom: Cannot remove root directory
};
class w extends Error {
  errno;
  syscall;
  path;
  constructor(t, e, n, r, i) {
    super(t, { cause: i }), this.name = e, this.errno = Jt[e] || -1, this.path = n, this.syscall = r;
  }
}
class Qt extends w {
  constructor(t) {
    super("OPFS is not supported in this browser", "ENOTSUP", void 0, void 0, t);
  }
}
class Kt extends w {
  constructor(t, e, n) {
    super(t, "INVALID_PATH", e, "access", n);
  }
}
class F extends w {
  constructor(t, e, n) {
    const r = {
      file: \`File not found: \${e}\`,
      directory: \`Directory not found: \${e}\`,
      source: \`Source does not exist: \${e}\`
    };
    super(r[t], "ENOENT", e, "access", n);
  }
}
class te extends w {
  constructor(t, e, n) {
    super(\`Permission denied for \${e} on: \${t}\`, "EACCES", t, e, n);
  }
}
class ee extends w {
  constructor(t, e, n) {
    super(t, "ENOSPC", e, "write", n);
  }
}
class se extends w {
  constructor(t, e) {
    super(\`File is busy: \${t}\`, "EBUSY", t, "open", e);
  }
}
class z extends w {
  constructor(t, e, n) {
    const r = t === "directory" ? \`Is a directory: \${e}\` : \`Not a directory: \${e}\`, i = t === "directory" ? "EISDIR" : "ENOTDIR";
    super(r, i, e, "access", n);
  }
}
class N extends w {
  constructor(t, e, n, r) {
    const i = {
      argument: "EINVAL",
      format: "INVALID_FORMAT",
      descriptor: "EBADF",
      overflow: "ERANGE"
    };
    super(e, i[t], n, "validate", r);
  }
}
class ne extends w {
  constructor(t, e) {
    super(\`Operation aborted: \${t}\`, "EINTR", t, "interrupt", e);
  }
}
class ut extends w {
  constructor(t, e, n) {
    super(t, "EIO", e, "io", n);
  }
}
class Ct extends w {
  constructor(t, e) {
    super(\`Operation not supported: \${t}\`, "ENOTSUP", t, "operation", e);
  }
}
class rt extends w {
  constructor(t, e, n) {
    const r = {
      RM_FAILED: \`Failed to remove entry: \${e}\`,
      ENOTEMPTY: \`Directory not empty: \${e}. Use recursive option to force removal.\`,
      EROOT: "Cannot remove root directory"
    };
    super(r[t] || \`Directory operation failed: \${e}\`, t, e, "unlink", n);
  }
}
class re extends w {
  constructor(t, e) {
    super("Failed to initialize OPFS", "INIT_FAILED", t, "init", e);
  }
}
class Q extends w {
  constructor(t, e, n) {
    super(\`Failed to \${t}: \${e}\`, \`\${t.toUpperCase()}_FAILED\`, e, t, n);
  }
}
class K extends w {
  constructor(t, e) {
    super(\`Destination already exists: \${t}\`, "EEXIST", t, "open", e);
  }
}
function j(s, t, e, n) {
  const r = \`\${s.toUpperCase()}_FAILED\`;
  return new w(\`Failed to \${s} file descriptor: \${t}\`, r, e, s, n);
}
function A(s, t) {
  const e = t?.path, n = t?.isDirectory;
  switch (s.name) {
    case "InvalidStateError":
      return new se(e || "unknown", s);
    case "QuotaExceededError":
      return new ee(\`No space left on device: \${e || "unknown"}\`, e, s);
    case "NotFoundError":
      return new F("file", e, s);
    case "TypeMismatchError":
      return n !== void 0 ? n ? new z("directory", e || "unknown", s) : new z("file", e || "unknown", s) : new N("argument", \`Type mismatch: \${e || "unknown"}\`, e, s);
    case "NotAllowedError":
    case "SecurityError":
      return new te(e, "unknown", s);
    case "InvalidModificationError":
      return new N("argument", \`Invalid modification: \${e || "unknown"}\`, e, s);
    case "AbortError":
      return new ne(e || "unknown", s);
    case "OperationError":
      return new ut(\`Operation failed: \${e || "unknown"}\`, e, s);
    case "TypeError":
      return new Ct(e || "unknown", s);
    default:
      return new ut(\`I/O error: \${e || "unknown"}\`, e, s);
  }
}
const Ft = (s, t, e) => {
  const n = s instanceof RegExp ? ft(s, e) : s, r = t instanceof RegExp ? ft(t, e) : t, i = n !== null && r != null && ie(n, r, e);
  return i && {
    start: i[0],
    end: i[1],
    pre: e.slice(0, i[0]),
    body: e.slice(i[0] + n.length, i[1]),
    post: e.slice(i[1] + r.length)
  };
}, ft = (s, t) => {
  const e = t.match(s);
  return e ? e[0] : null;
}, ie = (s, t, e) => {
  let n, r, i, o, a, l = e.indexOf(s), h = e.indexOf(t, l + 1), c = l;
  if (l >= 0 && h > 0) {
    if (s === t)
      return [l, h];
    for (n = [], i = e.length; c >= 0 && !a; ) {
      if (c === l)
        n.push(c), l = e.indexOf(s, c + 1);
      else if (n.length === 1) {
        const f = n.pop();
        f !== void 0 && (a = [f, h]);
      } else
        r = n.pop(), r !== void 0 && r < i && (i = r, o = h), h = e.indexOf(t, c + 1);
      c = l < h && l >= 0 ? l : h;
    }
    n.length && o !== void 0 && (a = [i, o]);
  }
  return a;
}, $t = "\\0SLASH" + Math.random() + "\\0", Mt = "\\0OPEN" + Math.random() + "\\0", at = "\\0CLOSE" + Math.random() + "\\0", Pt = "\\0COMMA" + Math.random() + "\\0", Tt = "\\0PERIOD" + Math.random() + "\\0", oe = new RegExp($t, "g"), ae = new RegExp(Mt, "g"), ce = new RegExp(at, "g"), le = new RegExp(Pt, "g"), he = new RegExp(Tt, "g"), ue = /\\\\\\\\/g, fe = /\\\\{/g, de = /\\\\}/g, pe = /\\\\,/g, ge = /\\\\./g;
function tt(s) {
  return isNaN(s) ? s.charCodeAt(0) : parseInt(s, 10);
}
function we(s) {
  return s.replace(ue, $t).replace(fe, Mt).replace(de, at).replace(pe, Pt).replace(ge, Tt);
}
function me(s) {
  return s.replace(oe, "\\\\").replace(ae, "{").replace(ce, "}").replace(le, ",").replace(he, ".");
}
function Rt(s) {
  if (!s)
    return [""];
  const t = [], e = Ft("{", "}", s);
  if (!e)
    return s.split(",");
  const { pre: n, body: r, post: i } = e, o = n.split(",");
  o[o.length - 1] += "{" + r + "}";
  const a = Rt(i);
  return i.length && (o[o.length - 1] += a.shift(), o.push.apply(o, a)), t.push.apply(t, o), t;
}
function ye(s) {
  return s ? (s.slice(0, 2) === "{}" && (s = "\\\\{\\\\}" + s.slice(2)), I(we(s), !0).map(me)) : [];
}
function Ee(s) {
  return "{" + s + "}";
}
function Se(s) {
  return /^-?0\\d/.test(s);
}
function xe(s, t) {
  return s <= t;
}
function be(s, t) {
  return s >= t;
}
function I(s, t) {
  const e = [], n = Ft("{", "}", s);
  if (!n)
    return [s];
  const r = n.pre, i = n.post.length ? I(n.post, !1) : [""];
  if (/\\$$/.test(n.pre))
    for (let o = 0; o < i.length; o++) {
      const a = r + "{" + n.body + "}" + i[o];
      e.push(a);
    }
  else {
    const o = /^-?\\d+\\.\\.-?\\d+(?:\\.\\.-?\\d+)?$/.test(n.body), a = /^[a-zA-Z]\\.\\.[a-zA-Z](?:\\.\\.-?\\d+)?$/.test(n.body), l = o || a, h = n.body.indexOf(",") >= 0;
    if (!l && !h)
      return n.post.match(/,(?!,).*\\}/) ? (s = n.pre + "{" + n.body + at + n.post, I(s)) : [s];
    let c;
    if (l)
      c = n.body.split(/\\.\\./);
    else if (c = Rt(n.body), c.length === 1 && c[0] !== void 0 && (c = I(c[0], !1).map(Ee), c.length === 1))
      return i.map((u) => n.pre + c[0] + u);
    let f;
    if (l && c[0] !== void 0 && c[1] !== void 0) {
      const u = tt(c[0]), d = tt(c[1]), g = Math.max(c[0].length, c[1].length);
      let p = c.length === 3 && c[2] !== void 0 ? Math.abs(tt(c[2])) : 1, S = xe;
      d < u && (p *= -1, S = be);
      const P = c.some(Se);
      f = [];
      for (let x = u; S(x, d); x += p) {
        let m;
        if (a)
          m = String.fromCharCode(x), m === "\\\\" && (m = "");
        else if (m = String(x), P) {
          const T = g - m.length;
          if (T > 0) {
            const H = new Array(T + 1).join("0");
            x < 0 ? m = "-" + H + m.slice(1) : m = H + m;
          }
        }
        f.push(m);
      }
    } else {
      f = [];
      for (let u = 0; u < c.length; u++)
        f.push.apply(f, I(c[u], !1));
    }
    for (let u = 0; u < f.length; u++)
      for (let d = 0; d < i.length; d++) {
        const g = r + f[u] + i[d];
        (!t || l || g) && e.push(g);
      }
  }
  return e;
}
const Oe = 1024 * 64, Z = (s) => {
  if (typeof s != "string")
    throw new TypeError("invalid pattern");
  if (s.length > Oe)
    throw new TypeError("pattern is too long");
}, De = {
  "[:alnum:]": ["\\\\p{L}\\\\p{Nl}\\\\p{Nd}", !0],
  "[:alpha:]": ["\\\\p{L}\\\\p{Nl}", !0],
  "[:ascii:]": ["\\\\x00-\\\\x7f", !1],
  "[:blank:]": ["\\\\p{Zs}\\\\t", !0],
  "[:cntrl:]": ["\\\\p{Cc}", !0],
  "[:digit:]": ["\\\\p{Nd}", !0],
  "[:graph:]": ["\\\\p{Z}\\\\p{C}", !0, !0],
  "[:lower:]": ["\\\\p{Ll}", !0],
  "[:print:]": ["\\\\p{C}", !0],
  "[:punct:]": ["\\\\p{P}", !0],
  "[:space:]": ["\\\\p{Z}\\\\t\\\\r\\\\n\\\\v\\\\f", !0],
  "[:upper:]": ["\\\\p{Lu}", !0],
  "[:word:]": ["\\\\p{L}\\\\p{Nl}\\\\p{Nd}\\\\p{Pc}", !0],
  "[:xdigit:]": ["A-Fa-f0-9", !1]
}, R = (s) => s.replace(/[[\\]\\\\-]/g, "\\\\$&"), ve = (s) => s.replace(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g, "\\\\$&"), dt = (s) => s.join(""), Ae = (s, t) => {
  const e = t;
  if (s.charAt(e) !== "[")
    throw new Error("not in a brace expression");
  const n = [], r = [];
  let i = e + 1, o = !1, a = !1, l = !1, h = !1, c = e, f = "";
  t: for (; i < s.length; ) {
    const p = s.charAt(i);
    if ((p === "!" || p === "^") && i === e + 1) {
      h = !0, i++;
      continue;
    }
    if (p === "]" && o && !l) {
      c = i + 1;
      break;
    }
    if (o = !0, p === "\\\\" && !l) {
      l = !0, i++;
      continue;
    }
    if (p === "[" && !l) {
      for (const [S, [v, P, x]] of Object.entries(De))
        if (s.startsWith(S, i)) {
          if (f)
            return ["$.", !1, s.length - e, !0];
          i += S.length, x ? r.push(v) : n.push(v), a = a || P;
          continue t;
        }
    }
    if (l = !1, f) {
      p > f ? n.push(R(f) + "-" + R(p)) : p === f && n.push(R(p)), f = "", i++;
      continue;
    }
    if (s.startsWith("-]", i + 1)) {
      n.push(R(p + "-")), i += 2;
      continue;
    }
    if (s.startsWith("-", i + 1)) {
      f = p, i += 2;
      continue;
    }
    n.push(R(p)), i++;
  }
  if (c < i)
    return ["", !1, 0, !1];
  if (!n.length && !r.length)
    return ["$.", !1, s.length - e, !0];
  if (r.length === 0 && n.length === 1 && /^\\\\?.$/.test(n[0]) && !h) {
    const p = n[0].length === 2 ? n[0].slice(-1) : n[0];
    return [ve(p), !1, c - e, !1];
  }
  const u = "[" + (h ? "^" : "") + dt(n) + "]", d = "[" + (h ? "" : "^") + dt(r) + "]";
  return [n.length && r.length ? "(" + u + "|" + d + ")" : n.length ? u : d, a, c - e, !0];
}, k = (s, { windowsPathsNoEscape: t = !1 } = {}) => t ? s.replace(/\\[([^\\/\\\\])\\]/g, "$1") : s.replace(/((?!\\\\).|^)\\[([^\\/\\\\])\\]/g, "$1$2").replace(/\\\\([^\\/])/g, "$1"), Ne = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]), pt = (s) => Ne.has(s), Ce = "(?!(?:^|/)\\\\.\\\\.?(?:$|/))", _ = "(?!\\\\.)", Fe = /* @__PURE__ */ new Set(["[", "."]), $e = /* @__PURE__ */ new Set(["..", "."]), Me = new Set("().*{}+?[]^$\\\\!"), Pe = (s) => s.replace(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g, "\\\\$&"), ct = "[^/]", gt = ct + "*?", wt = ct + "+?";
class E {
  type;
  #s;
  #n;
  #i = !1;
  #t = [];
  #e;
  #o;
  #c;
  #a = !1;
  #r;
  #l;
  // set to true if it's an extglob with no children
  // (which really means one child of '')
  #u = !1;
  constructor(t, e, n = {}) {
    this.type = t, t && (this.#n = !0), this.#e = e, this.#s = this.#e ? this.#e.#s : this, this.#r = this.#s === this ? n : this.#s.#r, this.#c = this.#s === this ? [] : this.#s.#c, t === "!" && !this.#s.#a && this.#c.push(this), this.#o = this.#e ? this.#e.#t.length : 0;
  }
  get hasMagic() {
    if (this.#n !== void 0)
      return this.#n;
    for (const t of this.#t)
      if (typeof t != "string" && (t.type || t.hasMagic))
        return this.#n = !0;
    return this.#n;
  }
  // reconstructs the pattern
  toString() {
    return this.#l !== void 0 ? this.#l : this.type ? this.#l = this.type + "(" + this.#t.map((t) => String(t)).join("|") + ")" : this.#l = this.#t.map((t) => String(t)).join("");
  }
  #d() {
    if (this !== this.#s)
      throw new Error("should only call on root");
    if (this.#a)
      return this;
    this.toString(), this.#a = !0;
    let t;
    for (; t = this.#c.pop(); ) {
      if (t.type !== "!")
        continue;
      let e = t, n = e.#e;
      for (; n; ) {
        for (let r = e.#o + 1; !n.type && r < n.#t.length; r++)
          for (const i of t.#t) {
            if (typeof i == "string")
              throw new Error("string part in extglob AST??");
            i.copyIn(n.#t[r]);
          }
        e = n, n = e.#e;
      }
    }
    return this;
  }
  push(...t) {
    for (const e of t)
      if (e !== "") {
        if (typeof e != "string" && !(e instanceof E && e.#e === this))
          throw new Error("invalid part: " + e);
        this.#t.push(e);
      }
  }
  toJSON() {
    const t = this.type === null ? this.#t.slice().map((e) => typeof e == "string" ? e : e.toJSON()) : [this.type, ...this.#t.map((e) => e.toJSON())];
    return this.isStart() && !this.type && t.unshift([]), this.isEnd() && (this === this.#s || this.#s.#a && this.#e?.type === "!") && t.push({}), t;
  }
  isStart() {
    if (this.#s === this)
      return !0;
    if (!this.#e?.isStart())
      return !1;
    if (this.#o === 0)
      return !0;
    const t = this.#e;
    for (let e = 0; e < this.#o; e++) {
      const n = t.#t[e];
      if (!(n instanceof E && n.type === "!"))
        return !1;
    }
    return !0;
  }
  isEnd() {
    if (this.#s === this || this.#e?.type === "!")
      return !0;
    if (!this.#e?.isEnd())
      return !1;
    if (!this.type)
      return this.#e?.isEnd();
    const t = this.#e ? this.#e.#t.length : 0;
    return this.#o === t - 1;
  }
  copyIn(t) {
    typeof t == "string" ? this.push(t) : this.push(t.clone(this));
  }
  clone(t) {
    const e = new E(this.type, t);
    for (const n of this.#t)
      e.copyIn(n);
    return e;
  }
  static #h(t, e, n, r) {
    let i = !1, o = !1, a = -1, l = !1;
    if (e.type === null) {
      let d = n, g = "";
      for (; d < t.length; ) {
        const p = t.charAt(d++);
        if (i || p === "\\\\") {
          i = !i, g += p;
          continue;
        }
        if (o) {
          d === a + 1 ? (p === "^" || p === "!") && (l = !0) : p === "]" && !(d === a + 2 && l) && (o = !1), g += p;
          continue;
        } else if (p === "[") {
          o = !0, a = d, l = !1, g += p;
          continue;
        }
        if (!r.noext && pt(p) && t.charAt(d) === "(") {
          e.push(g), g = "";
          const S = new E(p, e);
          d = E.#h(t, S, d, r), e.push(S);
          continue;
        }
        g += p;
      }
      return e.push(g), d;
    }
    let h = n + 1, c = new E(null, e);
    const f = [];
    let u = "";
    for (; h < t.length; ) {
      const d = t.charAt(h++);
      if (i || d === "\\\\") {
        i = !i, u += d;
        continue;
      }
      if (o) {
        h === a + 1 ? (d === "^" || d === "!") && (l = !0) : d === "]" && !(h === a + 2 && l) && (o = !1), u += d;
        continue;
      } else if (d === "[") {
        o = !0, a = h, l = !1, u += d;
        continue;
      }
      if (pt(d) && t.charAt(h) === "(") {
        c.push(u), u = "";
        const g = new E(d, c);
        c.push(g), h = E.#h(t, g, h, r);
        continue;
      }
      if (d === "|") {
        c.push(u), u = "", f.push(c), c = new E(null, e);
        continue;
      }
      if (d === ")")
        return u === "" && e.#t.length === 0 && (e.#u = !0), c.push(u), u = "", e.push(...f, c), h;
      u += d;
    }
    return e.type = null, e.#n = void 0, e.#t = [t.substring(n - 1)], h;
  }
  static fromGlob(t, e = {}) {
    const n = new E(null, void 0, e);
    return E.#h(t, n, 0, e), n;
  }
  // returns the regular expression if there's magic, or the unescaped
  // string if not.
  toMMPattern() {
    if (this !== this.#s)
      return this.#s.toMMPattern();
    const t = this.toString(), [e, n, r, i] = this.toRegExpSource();
    if (!(r || this.#n || this.#r.nocase && !this.#r.nocaseMagicOnly && t.toUpperCase() !== t.toLowerCase()))
      return n;
    const a = (this.#r.nocase ? "i" : "") + (i ? "u" : "");
    return Object.assign(new RegExp(\`^\${e}$\`, a), {
      _src: e,
      _glob: t
    });
  }
  get options() {
    return this.#r;
  }
  // returns the string match, the regexp source, whether there's magic
  // in the regexp (so a regular expression is required) and whether or
  // not the uflag is needed for the regular expression (for posix classes)
  // TODO: instead of injecting the start/end at this point, just return
  // the BODY of the regexp, along with the start/end portions suitable
  // for binding the start/end in either a joined full-path makeRe context
  // (where we bind to (^|/), or a standalone matchPart context (where
  // we bind to ^, and not /).  Otherwise slashes get duped!
  //
  // In part-matching mode, the start is:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: ^(?!\\.\\.?$)
  // - if dots allowed or not possible: ^
  // - if dots possible and not allowed: ^(?!\\.)
  // end is:
  // - if not isEnd(): nothing
  // - else: $
  //
  // In full-path matching mode, we put the slash at the START of the
  // pattern, so start is:
  // - if first pattern: same as part-matching mode
  // - if not isStart(): nothing
  // - if traversal possible, but not allowed: /(?!\\.\\.?(?:$|/))
  // - if dots allowed or not possible: /
  // - if dots possible and not allowed: /(?!\\.)
  // end is:
  // - if last pattern, same as part-matching mode
  // - else nothing
  //
  // Always put the (?:$|/) on negated tails, though, because that has to be
  // there to bind the end of the negated pattern portion, and it's easier to
  // just stick it in now rather than try to inject it later in the middle of
  // the pattern.
  //
  // We can just always return the same end, and leave it up to the caller
  // to know whether it's going to be used joined or in parts.
  // And, if the start is adjusted slightly, can do the same there:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: (?:/|^)(?!\\.\\.?$)
  // - if dots allowed or not possible: (?:/|^)
  // - if dots possible and not allowed: (?:/|^)(?!\\.)
  //
  // But it's better to have a simpler binding without a conditional, for
  // performance, so probably better to return both start options.
  //
  // Then the caller just ignores the end if it's not the first pattern,
  // and the start always gets applied.
  //
  // But that's always going to be $ if it's the ending pattern, or nothing,
  // so the caller can just attach $ at the end of the pattern when building.
  //
  // So the todo is:
  // - better detect what kind of start is needed
  // - return both flavors of starting pattern
  // - attach $ at the end of the pattern when creating the actual RegExp
  //
  // Ah, but wait, no, that all only applies to the root when the first pattern
  // is not an extglob. If the first pattern IS an extglob, then we need all
  // that dot prevention biz to live in the extglob portions, because eg
  // +(*|.x*) can match .xy but not .yx.
  //
  // So, return the two flavors if it's #root and the first child is not an
  // AST, otherwise leave it to the child AST to handle it, and there,
  // use the (?:^|/) style of start binding.
  //
  // Even simplified further:
  // - Since the start for a join is eg /(?!\\.) and the start for a part
  // is ^(?!\\.), we can just prepend (?!\\.) to the pattern (either root
  // or start or whatever) and prepend ^ or / at the Regexp construction.
  toRegExpSource(t) {
    const e = t ?? !!this.#r.dot;
    if (this.#s === this && this.#d(), !this.type) {
      const l = this.isStart() && this.isEnd(), h = this.#t.map((d) => {
        const [g, p, S, v] = typeof d == "string" ? E.#p(d, this.#n, l) : d.toRegExpSource(t);
        return this.#n = this.#n || S, this.#i = this.#i || v, g;
      }).join("");
      let c = "";
      if (this.isStart() && typeof this.#t[0] == "string" && !(this.#t.length === 1 && $e.has(this.#t[0]))) {
        const g = Fe, p = (
          // dots are allowed, and the pattern starts with [ or .
          e && g.has(h.charAt(0)) || // the pattern starts with \\., and then [ or .
          h.startsWith("\\\\.") && g.has(h.charAt(2)) || // the pattern starts with \\.\\., and then [ or .
          h.startsWith("\\\\.\\\\.") && g.has(h.charAt(4))
        ), S = !e && !t && g.has(h.charAt(0));
        c = p ? Ce : S ? _ : "";
      }
      let f = "";
      return this.isEnd() && this.#s.#a && this.#e?.type === "!" && (f = "(?:$|\\\\/)"), [
        c + h + f,
        k(h),
        this.#n = !!this.#n,
        this.#i
      ];
    }
    const n = this.type === "*" || this.type === "+", r = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let i = this.#f(e);
    if (this.isStart() && this.isEnd() && !i && this.type !== "!") {
      const l = this.toString();
      return this.#t = [l], this.type = null, this.#n = void 0, [l, k(this.toString()), !1, !1];
    }
    let o = !n || t || e || !_ ? "" : this.#f(!0);
    o === i && (o = ""), o && (i = \`(?:\${i})(?:\${o})*?\`);
    let a = "";
    if (this.type === "!" && this.#u)
      a = (this.isStart() && !e ? _ : "") + wt;
    else {
      const l = this.type === "!" ? (
        // !() must match something,but !(x) can match ''
        "))" + (this.isStart() && !e && !t ? _ : "") + gt + ")"
      ) : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && o ? ")" : this.type === "*" && o ? ")?" : \`)\${this.type}\`;
      a = r + i + l;
    }
    return [
      a,
      k(i),
      this.#n = !!this.#n,
      this.#i
    ];
  }
  #f(t) {
    return this.#t.map((e) => {
      if (typeof e == "string")
        throw new Error("string type in extglob ast??");
      const [n, r, i, o] = e.toRegExpSource(t);
      return this.#i = this.#i || o, n;
    }).filter((e) => !(this.isStart() && this.isEnd()) || !!e).join("|");
  }
  static #p(t, e, n = !1) {
    let r = !1, i = "", o = !1;
    for (let a = 0; a < t.length; a++) {
      const l = t.charAt(a);
      if (r) {
        r = !1, i += (Me.has(l) ? "\\\\" : "") + l;
        continue;
      }
      if (l === "\\\\") {
        a === t.length - 1 ? i += "\\\\\\\\" : r = !0;
        continue;
      }
      if (l === "[") {
        const [h, c, f, u] = Ae(t, a);
        if (f) {
          i += h, o = o || c, a += f - 1, e = e || u;
          continue;
        }
      }
      if (l === "*") {
        n && t === "*" ? i += wt : i += gt, e = !0;
        continue;
      }
      if (l === "?") {
        i += ct, e = !0;
        continue;
      }
      i += Pe(l);
    }
    return [i, k(t), !!e, o];
  }
}
const Te = (s, { windowsPathsNoEscape: t = !1 } = {}) => t ? s.replace(/[?*()[\\]]/g, "[$&]") : s.replace(/[?*()[\\]\\\\]/g, "\\\\$&"), y = (s, t, e = {}) => (Z(t), !e.nocomment && t.charAt(0) === "#" ? !1 : new X(t, e).match(s)), Re = /^\\*+([^+@!?\\*\\[\\(]*)$/, Ie = (s) => (t) => !t.startsWith(".") && t.endsWith(s), ke = (s) => (t) => t.endsWith(s), Le = (s) => (s = s.toLowerCase(), (t) => !t.startsWith(".") && t.toLowerCase().endsWith(s)), ze = (s) => (s = s.toLowerCase(), (t) => t.toLowerCase().endsWith(s)), He = /^\\*+\\.\\*+$/, We = (s) => !s.startsWith(".") && s.includes("."), je = (s) => s !== "." && s !== ".." && s.includes("."), _e = /^\\.\\*+$/, Ue = (s) => s !== "." && s !== ".." && s.startsWith("."), Be = /^\\*+$/, Ge = (s) => s.length !== 0 && !s.startsWith("."), qe = (s) => s.length !== 0 && s !== "." && s !== "..", Ve = /^\\?+([^+@!?\\*\\[\\(]*)?$/, Ye = ([s, t = ""]) => {
  const e = It([s]);
  return t ? (t = t.toLowerCase(), (n) => e(n) && n.toLowerCase().endsWith(t)) : e;
}, Ze = ([s, t = ""]) => {
  const e = kt([s]);
  return t ? (t = t.toLowerCase(), (n) => e(n) && n.toLowerCase().endsWith(t)) : e;
}, Xe = ([s, t = ""]) => {
  const e = kt([s]);
  return t ? (n) => e(n) && n.endsWith(t) : e;
}, Je = ([s, t = ""]) => {
  const e = It([s]);
  return t ? (n) => e(n) && n.endsWith(t) : e;
}, It = ([s]) => {
  const t = s.length;
  return (e) => e.length === t && !e.startsWith(".");
}, kt = ([s]) => {
  const t = s.length;
  return (e) => e.length === t && e !== "." && e !== "..";
}, Lt = typeof process == "object" && process ? typeof process.env == "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix", mt = {
  win32: { sep: "\\\\" },
  posix: { sep: "/" }
}, Qe = Lt === "win32" ? mt.win32.sep : mt.posix.sep;
y.sep = Qe;
const O = Symbol("globstar **");
y.GLOBSTAR = O;
const Ke = "[^/]", ts = Ke + "*?", es = "(?:(?!(?:\\\\/|^)(?:\\\\.{1,2})($|\\\\/)).)*?", ss = "(?:(?!(?:\\\\/|^)\\\\.).)*?", ns = (s, t = {}) => (e) => y(e, s, t);
y.filter = ns;
const b = (s, t = {}) => Object.assign({}, s, t), rs = (s) => {
  if (!s || typeof s != "object" || !Object.keys(s).length)
    return y;
  const t = y;
  return Object.assign((n, r, i = {}) => t(n, r, b(s, i)), {
    Minimatch: class extends t.Minimatch {
      constructor(r, i = {}) {
        super(r, b(s, i));
      }
      static defaults(r) {
        return t.defaults(b(s, r)).Minimatch;
      }
    },
    AST: class extends t.AST {
      /* c8 ignore start */
      constructor(r, i, o = {}) {
        super(r, i, b(s, o));
      }
      /* c8 ignore stop */
      static fromGlob(r, i = {}) {
        return t.AST.fromGlob(r, b(s, i));
      }
    },
    unescape: (n, r = {}) => t.unescape(n, b(s, r)),
    escape: (n, r = {}) => t.escape(n, b(s, r)),
    filter: (n, r = {}) => t.filter(n, b(s, r)),
    defaults: (n) => t.defaults(b(s, n)),
    makeRe: (n, r = {}) => t.makeRe(n, b(s, r)),
    braceExpand: (n, r = {}) => t.braceExpand(n, b(s, r)),
    match: (n, r, i = {}) => t.match(n, r, b(s, i)),
    sep: t.sep,
    GLOBSTAR: O
  });
};
y.defaults = rs;
const zt = (s, t = {}) => (Z(s), t.nobrace || !/\\{(?:(?!\\{).)*\\}/.test(s) ? [s] : ye(s));
y.braceExpand = zt;
const is = (s, t = {}) => new X(s, t).makeRe();
y.makeRe = is;
const os = (s, t, e = {}) => {
  const n = new X(t, e);
  return s = s.filter((r) => n.match(r)), n.options.nonull && !s.length && s.push(t), s;
};
y.match = os;
const yt = /[?*]|[+@!]\\(.*?\\)|\\[|\\]/, as = (s) => s.replace(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g, "\\\\$&");
class X {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  regexp;
  constructor(t, e = {}) {
    Z(t), e = e || {}, this.options = e, this.pattern = t, this.platform = e.platform || Lt, this.isWindows = this.platform === "win32", this.windowsPathsNoEscape = !!e.windowsPathsNoEscape || e.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\\\/g, "/")), this.preserveMultipleSlashes = !!e.preserveMultipleSlashes, this.regexp = null, this.negate = !1, this.nonegate = !!e.nonegate, this.comment = !1, this.empty = !1, this.partial = !!e.partial, this.nocase = !!this.options.nocase, this.windowsNoMagicRoot = e.windowsNoMagicRoot !== void 0 ? e.windowsNoMagicRoot : !!(this.isWindows && this.nocase), this.globSet = [], this.globParts = [], this.set = [], this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1)
      return !0;
    for (const t of this.set)
      for (const e of t)
        if (typeof e != "string")
          return !0;
    return !1;
  }
  debug(...t) {
  }
  make() {
    const t = this.pattern, e = this.options;
    if (!e.nocomment && t.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!t) {
      this.empty = !0;
      return;
    }
    this.parseNegate(), this.globSet = [...new Set(this.braceExpand())], e.debug && (this.debug = (...i) => console.error(...i)), this.debug(this.pattern, this.globSet);
    const n = this.globSet.map((i) => this.slashSplit(i));
    this.globParts = this.preprocess(n), this.debug(this.pattern, this.globParts);
    let r = this.globParts.map((i, o, a) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const l = i[0] === "" && i[1] === "" && (i[2] === "?" || !yt.test(i[2])) && !yt.test(i[3]), h = /^[a-z]:/i.test(i[0]);
        if (l)
          return [...i.slice(0, 4), ...i.slice(4).map((c) => this.parse(c))];
        if (h)
          return [i[0], ...i.slice(1).map((c) => this.parse(c))];
      }
      return i.map((l) => this.parse(l));
    });
    if (this.debug(this.pattern, r), this.set = r.filter((i) => i.indexOf(!1) === -1), this.isWindows)
      for (let i = 0; i < this.set.length; i++) {
        const o = this.set[i];
        o[0] === "" && o[1] === "" && this.globParts[i][2] === "?" && typeof o[3] == "string" && /^[a-z]:$/i.test(o[3]) && (o[2] = "?");
      }
    this.debug(this.pattern, this.set);
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(t) {
    if (this.options.noglobstar)
      for (let n = 0; n < t.length; n++)
        for (let r = 0; r < t[n].length; r++)
          t[n][r] === "**" && (t[n][r] = "*");
    const { optimizationLevel: e = 1 } = this.options;
    return e >= 2 ? (t = this.firstPhasePreProcess(t), t = this.secondPhasePreProcess(t)) : e >= 1 ? t = this.levelOneOptimize(t) : t = this.adjascentGlobstarOptimize(t), t;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(t) {
    return t.map((e) => {
      let n = -1;
      for (; (n = e.indexOf("**", n + 1)) !== -1; ) {
        let r = n;
        for (; e[r + 1] === "**"; )
          r++;
        r !== n && e.splice(n, r - n);
      }
      return e;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(t) {
    return t.map((e) => (e = e.reduce((n, r) => {
      const i = n[n.length - 1];
      return r === "**" && i === "**" ? n : r === ".." && i && i !== ".." && i !== "." && i !== "**" ? (n.pop(), n) : (n.push(r), n);
    }, []), e.length === 0 ? [""] : e));
  }
  levelTwoFileOptimize(t) {
    Array.isArray(t) || (t = this.slashSplit(t));
    let e = !1;
    do {
      if (e = !1, !this.preserveMultipleSlashes) {
        for (let r = 1; r < t.length - 1; r++) {
          const i = t[r];
          r === 1 && i === "" && t[0] === "" || (i === "." || i === "") && (e = !0, t.splice(r, 1), r--);
        }
        t[0] === "." && t.length === 2 && (t[1] === "." || t[1] === "") && (e = !0, t.pop());
      }
      let n = 0;
      for (; (n = t.indexOf("..", n + 1)) !== -1; ) {
        const r = t[n - 1];
        r && r !== "." && r !== ".." && r !== "**" && (e = !0, t.splice(n - 1, 2), n -= 2);
      }
    } while (e);
    return t.length === 0 ? [""] : t;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(t) {
    let e = !1;
    do {
      e = !1;
      for (let n of t) {
        let r = -1;
        for (; (r = n.indexOf("**", r + 1)) !== -1; ) {
          let o = r;
          for (; n[o + 1] === "**"; )
            o++;
          o > r && n.splice(r + 1, o - r);
          let a = n[r + 1];
          const l = n[r + 2], h = n[r + 3];
          if (a !== ".." || !l || l === "." || l === ".." || !h || h === "." || h === "..")
            continue;
          e = !0, n.splice(r, 1);
          const c = n.slice(0);
          c[r] = "**", t.push(c), r--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let o = 1; o < n.length - 1; o++) {
            const a = n[o];
            o === 1 && a === "" && n[0] === "" || (a === "." || a === "") && (e = !0, n.splice(o, 1), o--);
          }
          n[0] === "." && n.length === 2 && (n[1] === "." || n[1] === "") && (e = !0, n.pop());
        }
        let i = 0;
        for (; (i = n.indexOf("..", i + 1)) !== -1; ) {
          const o = n[i - 1];
          if (o && o !== "." && o !== ".." && o !== "**") {
            e = !0;
            const l = i === 1 && n[i + 1] === "**" ? ["."] : [];
            n.splice(i - 1, 2, ...l), n.length === 0 && n.push(""), i -= 2;
          }
        }
      }
    } while (e);
    return t;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
  //
  // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
  // ^-- not valid because ** doens't follow symlinks
  secondPhasePreProcess(t) {
    for (let e = 0; e < t.length - 1; e++)
      for (let n = e + 1; n < t.length; n++) {
        const r = this.partsMatch(t[e], t[n], !this.preserveMultipleSlashes);
        if (r) {
          t[e] = [], t[n] = r;
          break;
        }
      }
    return t.filter((e) => e.length);
  }
  partsMatch(t, e, n = !1) {
    let r = 0, i = 0, o = [], a = "";
    for (; r < t.length && i < e.length; )
      if (t[r] === e[i])
        o.push(a === "b" ? e[i] : t[r]), r++, i++;
      else if (n && t[r] === "**" && e[i] === t[r + 1])
        o.push(t[r]), r++;
      else if (n && e[i] === "**" && t[r] === e[i + 1])
        o.push(e[i]), i++;
      else if (t[r] === "*" && e[i] && (this.options.dot || !e[i].startsWith(".")) && e[i] !== "**") {
        if (a === "b")
          return !1;
        a = "a", o.push(t[r]), r++, i++;
      } else if (e[i] === "*" && t[r] && (this.options.dot || !t[r].startsWith(".")) && t[r] !== "**") {
        if (a === "a")
          return !1;
        a = "b", o.push(e[i]), r++, i++;
      } else
        return !1;
    return t.length === e.length && o;
  }
  parseNegate() {
    if (this.nonegate)
      return;
    const t = this.pattern;
    let e = !1, n = 0;
    for (let r = 0; r < t.length && t.charAt(r) === "!"; r++)
      e = !e, n++;
    n && (this.pattern = t.slice(n)), this.negate = e;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(t, e, n = !1) {
    const r = this.options;
    if (this.isWindows) {
      const p = typeof t[0] == "string" && /^[a-z]:$/i.test(t[0]), S = !p && t[0] === "" && t[1] === "" && t[2] === "?" && /^[a-z]:$/i.test(t[3]), v = typeof e[0] == "string" && /^[a-z]:$/i.test(e[0]), P = !v && e[0] === "" && e[1] === "" && e[2] === "?" && typeof e[3] == "string" && /^[a-z]:$/i.test(e[3]), x = S ? 3 : p ? 0 : void 0, m = P ? 3 : v ? 0 : void 0;
      if (typeof x == "number" && typeof m == "number") {
        const [T, H] = [t[x], e[m]];
        T.toLowerCase() === H.toLowerCase() && (e[m] = T, m > x ? e = e.slice(m) : x > m && (t = t.slice(x)));
      }
    }
    const { optimizationLevel: i = 1 } = this.options;
    i >= 2 && (t = this.levelTwoFileOptimize(t)), this.debug("matchOne", this, { file: t, pattern: e }), this.debug("matchOne", t.length, e.length);
    for (var o = 0, a = 0, l = t.length, h = e.length; o < l && a < h; o++, a++) {
      this.debug("matchOne loop");
      var c = e[a], f = t[o];
      if (this.debug(e, c, f), c === !1)
        return !1;
      if (c === O) {
        this.debug("GLOBSTAR", [e, c, f]);
        var u = o, d = a + 1;
        if (d === h) {
          for (this.debug("** at the end"); o < l; o++)
            if (t[o] === "." || t[o] === ".." || !r.dot && t[o].charAt(0) === ".")
              return !1;
          return !0;
        }
        for (; u < l; ) {
          var g = t[u];
          if (this.debug(\`
globstar while\`, t, u, e, d, g), this.matchOne(t.slice(u), e.slice(d), n))
            return this.debug("globstar found match!", u, l, g), !0;
          if (g === "." || g === ".." || !r.dot && g.charAt(0) === ".") {
            this.debug("dot detected!", t, u, e, d);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), u++;
        }
        return !!(n && (this.debug(\`
>>> no match, partial?\`, t, u, e, d), u === l));
      }
      let p;
      if (typeof c == "string" ? (p = f === c, this.debug("string match", c, f, p)) : (p = c.test(f), this.debug("pattern match", c, f, p)), !p)
        return !1;
    }
    if (o === l && a === h)
      return !0;
    if (o === l)
      return n;
    if (a === h)
      return o === l - 1 && t[o] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return zt(this.pattern, this.options);
  }
  parse(t) {
    Z(t);
    const e = this.options;
    if (t === "**")
      return O;
    if (t === "")
      return "";
    let n, r = null;
    (n = t.match(Be)) ? r = e.dot ? qe : Ge : (n = t.match(Re)) ? r = (e.nocase ? e.dot ? ze : Le : e.dot ? ke : Ie)(n[1]) : (n = t.match(Ve)) ? r = (e.nocase ? e.dot ? Ze : Ye : e.dot ? Xe : Je)(n) : (n = t.match(He)) ? r = e.dot ? je : We : (n = t.match(_e)) && (r = Ue);
    const i = E.fromGlob(t, this.options).toMMPattern();
    return r && typeof i == "object" && Reflect.defineProperty(i, "test", { value: r }), i;
  }
  makeRe() {
    if (this.regexp || this.regexp === !1)
      return this.regexp;
    const t = this.set;
    if (!t.length)
      return this.regexp = !1, this.regexp;
    const e = this.options, n = e.noglobstar ? ts : e.dot ? es : ss, r = new Set(e.nocase ? ["i"] : []);
    let i = t.map((l) => {
      const h = l.map((c) => {
        if (c instanceof RegExp)
          for (const f of c.flags.split(""))
            r.add(f);
        return typeof c == "string" ? as(c) : c === O ? O : c._src;
      });
      return h.forEach((c, f) => {
        const u = h[f + 1], d = h[f - 1];
        c !== O || d === O || (d === void 0 ? u !== void 0 && u !== O ? h[f + 1] = "(?:\\\\/|" + n + "\\\\/)?" + u : h[f] = n : u === void 0 ? h[f - 1] = d + "(?:\\\\/|" + n + ")?" : u !== O && (h[f - 1] = d + "(?:\\\\/|\\\\/" + n + "\\\\/)" + u, h[f + 1] = O));
      }), h.filter((c) => c !== O).join("/");
    }).join("|");
    const [o, a] = t.length > 1 ? ["(?:", ")"] : ["", ""];
    i = "^" + o + i + a + "$", this.negate && (i = "^(?!" + i + ").+$");
    try {
      this.regexp = new RegExp(i, [...r].join(""));
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  slashSplit(t) {
    return this.preserveMultipleSlashes ? t.split("/") : this.isWindows && /^\\/\\/[^\\/]+/.test(t) ? ["", ...t.split(/\\/+/)] : t.split(/\\/+/);
  }
  match(t, e = this.partial) {
    if (this.debug("match", t, this.pattern), this.comment)
      return !1;
    if (this.empty)
      return t === "";
    if (t === "/" && e)
      return !0;
    const n = this.options;
    this.isWindows && (t = t.split("\\\\").join("/"));
    const r = this.slashSplit(t);
    this.debug(this.pattern, "split", r);
    const i = this.set;
    this.debug(this.pattern, "set", i);
    let o = r[r.length - 1];
    if (!o)
      for (let a = r.length - 2; !o && a >= 0; a--)
        o = r[a];
    for (let a = 0; a < i.length; a++) {
      const l = i[a];
      let h = r;
      if (n.matchBase && l.length === 1 && (h = [o]), this.matchOne(h, l, e))
        return n.flipNegate ? !0 : !this.negate;
    }
    return n.flipNegate ? !1 : this.negate;
  }
  static defaults(t) {
    return y.defaults(t).Minimatch;
  }
}
y.AST = E;
y.Minimatch = X;
y.escape = Te;
y.unescape = k;
function cs() {
  if (!("storage" in navigator) || !("getDirectory" in navigator.storage))
    throw new Qt();
}
async function L(s, t, e) {
  return typeof navigator < "u" && navigator.locks?.request ? navigator.locks.request(\`opfs:\${s.replace(/\\/+/g, "/")}\`, { mode: t }, e) : e();
}
function M(s) {
  return Array.isArray(s) ? s : (s.startsWith("~/") ? s.slice(2) : s).split("/").filter(Boolean);
}
function lt(s) {
  return typeof s == "string" ? s ?? "/" : \`/\${s.join("/")}\`;
}
function it(s) {
  const t = M(s);
  return t[t.length - 1] || "";
}
function et(s) {
  const t = M(s);
  return t.pop(), lt(t);
}
function G(s) {
  return !s || s === "/" ? "/" : s.startsWith("~/") ? \`/\${s.slice(2)}\` : s.startsWith("/") ? s : \`/\${s}\`;
}
function ls(s, t = !1) {
  return s = s.replace(/\\/$/, ""), t && !s.includes("*") ? \`\${s}/**\` : s;
}
function st(s, t) {
  return y(s, t, {
    dot: !0,
    matchBase: !0
  });
}
function Et(s) {
  const t = G(s), e = M(t), n = [];
  for (const r of e)
    if (!(r === "." || r === ""))
      if (r === "..") {
        if (n.length === 0)
          continue;
        n.pop();
      } else
        n.push(r);
  return lt(n);
}
async function hs(s, t = "SHA-1", e = 50 * 1024 * 1024) {
  if (s instanceof File && (s = await s.arrayBuffer()), s.byteLength > e)
    throw new Error(\`File size \${s.byteLength} bytes exceeds maximum allowed size \${e} bytes\`);
  const n = new Uint8Array(s), r = await crypto.subtle.digest(t, n);
  return Array.from(new Uint8Array(r)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
async function us(s) {
  const t = await s.arrayBuffer();
  return new Uint8Array(t);
}
async function fs(s, t, e = {}) {
  const n = it(t);
  return L(t, "exclusive", async () => {
    const r = e.recursive ?? !1, i = e.force ?? !1;
    try {
      await s.removeEntry(n, { recursive: r });
    } catch (o) {
      if (o.name === "NotFoundError") {
        if (!i)
          throw new F("file", t, o);
      } else throw o.name === "InvalidModificationError" ? new rt("ENOTEMPTY", t, o) : o.name === "TypeMismatchError" && !r ? new z("directory", t, o) : new rt("RM_FAILED", t, o);
    }
  });
}
function St(s, t, e, n) {
  if (!Number.isInteger(t) || !Number.isInteger(e))
    throw new N("argument", "Invalid offset or length");
  if (t < 0 || e < 0)
    throw new N("argument", "Negative offset or length not allowed");
  if (t + e > s)
    throw new N("overflow", "Operation would overflow buffer");
  if (n != null && (!Number.isInteger(n) || n < 0))
    throw new N("argument", "Invalid position");
}
function xt(s, t, e) {
  try {
    t.flush(), t.close();
  } catch (n) {
    console.warn(\`Warning: Failed to properly close file descriptor \${s} (\${e}):\`, n);
  }
}
function ds(s, t, e) {
  if (s >= e)
    return { isEOF: !0, actualLength: 0 };
  const n = Math.min(t, e - s);
  return n <= 0 ? { isEOF: !0, actualLength: 0 } : { isEOF: !1, actualLength: n };
}
async function ps(s, t) {
  try {
    return await s.createSyncAccessHandle();
  } catch (e) {
    throw A(e, { path: t, isDirectory: !1 });
  }
}
class gs {
  /** Root directory handle for the file system */
  root;
  /** Map of watched paths and options */
  watchers = /* @__PURE__ */ new Map();
  /** Promise to prevent concurrent mount operations */
  mountingPromise = null;
  /** BroadcastChannel instance for sending events */
  broadcastChannel = null;
  /** Configuration options */
  options = {
    root: "/",
    namespace: "",
    maxFileSize: 50 * 1024 * 1024,
    hashAlgorithm: "etag",
    broadcastChannel: "opfs-worker"
  };
  /** Map of open file descriptors to their metadata */
  openFiles = /* @__PURE__ */ new Map();
  /** Next available file descriptor number */
  nextFd = 1;
  /**
   * Get file info by descriptor with validation
   * @private
   */
  _getFileDescriptor(t) {
    const e = this.openFiles.get(t);
    if (!e)
      throw new N("descriptor", \`Invalid file descriptor: \${t}\`);
    return e;
  }
  /**
   * Notify about internal changes to the file system
   * 
   * This method is called by internal operations to notify clients about
   * changes, even when no specific paths are being watched.
   * 
   * @param path - The path that was changed
   * @param type - The type of change (create, change, delete)
   */
  async notifyChange(t) {
    if (!this.options.broadcastChannel)
      return;
    const e = t.path;
    if (![...this.watchers.values()].some((i) => st(e, i.pattern) && i.include.some((o) => o && st(e, o)) && !i.exclude.some((o) => o && st(e, o))))
      return;
    let r;
    if (this.options.hashAlgorithm)
      try {
        r = (await this.stat(e)).hash;
      } catch {
      }
    try {
      this.broadcastChannel || (this.broadcastChannel = new BroadcastChannel(this.options.broadcastChannel));
      const i = {
        namespace: this.options.namespace,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        ...t,
        ...r && { hash: r }
      };
      this.broadcastChannel.postMessage(i);
    } catch (i) {
      console.warn("Failed to send event via BroadcastChannel:", i);
    }
  }
  /**
   * Creates a new OPFSFileSystem instance
   * 
   * @param options - Optional configuration options
   * @param options.root - Root path for the file system (default: '/')
   * @param options.watchInterval - Polling interval in milliseconds for file watching
   * @param options.hashAlgorithm - Hash algorithm for file hashing
   * @param options.maxFileSize - Maximum file size for hashing in bytes (default: 50MB)
   * @throws {OPFSError} If OPFS is not supported in the current browser
   */
  constructor(t) {
    cs(), t && this.setOptions(t);
  }
  /**
   * Initialize the file system within a given directory
   * 
   * This method sets up the root directory for all subsequent operations.
   * If no root is specified, it will use the OPFS root directory.
   * 
   * @param root - The root path for the file system (default: '/')
   * @returns Promise that resolves to true if initialization was successful
   * @throws {OPFSError} If initialization fails
   * 
   * @example
   * \`\`\`typescript
   * const fs = new OPFSFileSystem();
   * 
   * // Use OPFS root (default)
   * await fs.mount();
   * 
   * // Use custom directory
   * await fs.mount('/my-app');
   * \`\`\`
   */
  async mount() {
    const t = this.options.root;
    return this.mountingPromise && await this.mountingPromise, this.mountingPromise = new Promise(async (e, n) => {
      try {
        const r = await navigator.storage.getDirectory();
        this.root = t === "/" ? r : await this.getDirectoryHandle(t, !0, r), e(!0);
      } catch (r) {
        n(new re(t, r));
      } finally {
        this.mountingPromise = null;
      }
    }), this.mountingPromise;
  }
  /**
   * Update configuration options
   * 
   * @param options - Configuration options to update
   * @param options.root - Root path for the file system
   * @param options.watchInterval - Polling interval in milliseconds for file watching
   * @param options.hashAlgorithm - Hash algorithm for file hashing
   * @param options.maxFileSize - Maximum file size for hashing in bytes
   * @param options.broadcastChannel - Custom name for the broadcast channel
   */
  async setOptions(t) {
    t.hashAlgorithm !== void 0 && (this.options.hashAlgorithm = t.hashAlgorithm), t.maxFileSize !== void 0 && (this.options.maxFileSize = t.maxFileSize), t.broadcastChannel !== void 0 && (this.broadcastChannel && this.options.broadcastChannel !== t.broadcastChannel && (this.broadcastChannel.close(), this.broadcastChannel = null), this.options.broadcastChannel = t.broadcastChannel), t.namespace && (this.options.namespace = t.namespace), t.root !== void 0 && (this.options.root = G(t.root), this.options.namespace || (this.options.namespace = \`opfs-worker:\${this.options.root}\`), await this.mount());
  }
  /**
   * Get a directory handle from a path
   * 
   * Navigates through the directory structure to find or create a directory
   * at the specified path.
   * 
   * @param path - The path to the directory (string or array of segments)
   * @param create - Whether to create the directory if it doesn't exist (default: false)
   * @param from - The directory to start from (default: root directory)
   * @returns Promise that resolves to the directory handle
   * @throws {OPFSError} If the directory cannot be accessed or created
   * 
   * @example
   * \`\`\`typescript
   * const docsDir = await fs.getDirectoryHandle('/users/john/documents', true);
   * const docsDir2 = await fs.getDirectoryHandle(['users', 'john', 'documents'], true);
   * \`\`\`
   */
  async getDirectoryHandle(t, e = !1, n = this.root) {
    const r = Array.isArray(t) ? t : M(t);
    let i = n;
    for (const o of r)
      i = await i.getDirectoryHandle(o, { create: e });
    return i;
  }
  /**
   * Get a file handle from a path
   * 
   * Navigates to the parent directory and retrieves or creates a file handle
   * for the specified file path.
   * 
   * @param path - The path to the file (string or array of segments)
   * @param create - Whether to create the file if it doesn't exist (default: false)
   * @param _from - The directory to start from (default: root directory)
   * @returns Promise that resolves to the file handle
   * @throws {PathError} If the path is empty
   * @throws {OPFSError} If the file cannot be accessed or created
   * 
   * @example
   * \`\`\`typescript
   * const fileHandle = await fs.getFileHandle('/config/settings.json', true);
   * const fileHandle2 = await fs.getFileHandle(['config', 'settings.json'], true);
   * \`\`\`
   */
  async getFileHandle(t, e = !1, n = this.root) {
    const r = M(t);
    if (r.length === 0)
      throw new Kt("Path must not be empty", Array.isArray(t) ? t.join("/") : t);
    const i = r.pop();
    return (await this.getDirectoryHandle(r, e, n)).getFileHandle(i, { create: e });
  }
  /**
   * Get a complete index of all files and directories in the file system
   * 
   * This method recursively traverses the entire file system and returns
   * a Map containing FileStat objects for every file and directory.
   * 
   * @returns Promise that resolves to a Map of paths to FileStat objects
   * @throws {OPFSError} If the file system is not mounted
   * 
   * @example
   * \`\`\`typescript
   * const index = await fs.index();
   * const fileStats = index.get('/data/config.json');
   * if (fileStats) {
   *   console.log(\`File size: \${fileStats.size} bytes\`);
   *   if (fileStats.hash) console.log(\`Hash: \${fileStats.hash}\`);
   * }
   * \`\`\`
   */
  async index() {
    const t = /* @__PURE__ */ new Map(), e = async (n) => {
      const r = await this.readDir(n);
      for (const i of r) {
        const o = \`\${n === "/" ? "" : n}/\${i.name}\`;
        try {
          const a = await this.stat(o);
          t.set(o, a), a.isDirectory && await e(o);
        } catch (a) {
          console.warn(\`Skipping broken entry: \${o}\`, a);
        }
      }
    };
    return t.set("/", {
      kind: "directory",
      size: 0,
      mtime: (/* @__PURE__ */ new Date(0)).toISOString(),
      ctime: (/* @__PURE__ */ new Date(0)).toISOString(),
      isFile: !1,
      isDirectory: !0
    }), await e("/"), t;
  }
  /**
   * Read a file from the file system
   * 
   * Reads the contents of a file and returns it as binary data.
   * 
   * @param path - The path to the file to read
   * @returns Promise that resolves to the file contents as Uint8Array
   * @throws {FileNotFoundError} If the file does not exist
   * @throws {OPFSError} If reading the file fails
   * 
   * @example
   * \`\`\`typescript
   * // Read as binary data
   * const content = await fs.readFile('/config/settings.json');
   * 
   * // Read binary file
   * const binaryData = await fs.readFile('/images/logo.png');
   * \`\`\`
   */
  async readFile(t) {
    await this.mount();
    try {
      return await L(t, "shared", async () => {
        const e = await this.open(t);
        try {
          const { size: n } = await this.fstat(e), r = new Uint8Array(n);
          return n > 0 && await this.read(e, r, 0, n, 0), B(r, [r.buffer]);
        } finally {
          await this.close(e);
        }
      });
    } catch (e) {
      throw new F("file", t, e);
    }
  }
  /**
   * Write data to a file
   * 
   * Creates or overwrites a file with the specified binary data. If the file already
   * exists, it will be truncated before writing.
   * 
   * @param path - The path to the file to write
   * @param data - The binary data to write to the file (Uint8Array or ArrayBuffer)
   * @returns Promise that resolves when the write operation is complete
   * @throws {OPFSError} If writing the file fails
   * 
   * @example
   * \`\`\`typescript
   * // Write binary data
   * const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
   * await fs.writeFile('/data/binary.dat', binaryData);
   * 
   * // Write from ArrayBuffer
   * const arrayBuffer = new ArrayBuffer(10);
   * await fs.writeFile('/data/buffer.dat', arrayBuffer);
   * \`\`\`
   */
  async writeFile(t, e) {
    await this.mount();
    const n = e instanceof Uint8Array ? e : new Uint8Array(e);
    await L(t, "exclusive", async () => {
      const r = await this.exists(t), i = await this.open(t, { create: !0, truncate: !0 });
      try {
        await this.write(i, n, 0, n.length, null, !1), await this.fsync(i);
      } finally {
        await this.close(i);
      }
      await this.notifyChange({ path: t, type: r ? D.Changed : D.Added, isDirectory: !1 });
    });
  }
  /**
   * Append data to a file
   * 
   * Adds binary data to the end of an existing file. If the file doesn't exist,
   * it will be created.
   * 
   * @param path - The path to the file to append to
   * @param data - The binary data to append to the file (Uint8Array or ArrayBuffer)
   * @returns Promise that resolves when the append operation is complete
   * @throws {OPFSError} If appending to the file fails
   * 
   * @example
   * \`\`\`typescript
   * // Append binary data
   * const additionalData = new Uint8Array([6, 7, 8]);
   * await fs.appendFile('/data/binary.dat', additionalData);
   * 
   * // Append from ArrayBuffer
   * const arrayBuffer = new ArrayBuffer(5);
   * await fs.appendFile('/data/buffer.dat', arrayBuffer);
   * \`\`\`
   */
  async appendFile(t, e) {
    await this.mount();
    const n = e instanceof Uint8Array ? e : new Uint8Array(e);
    await L(t, "exclusive", async () => {
      const r = await this.open(t, { create: !0 });
      try {
        const { size: i } = await this.fstat(r);
        await this.write(r, n, 0, n.length, i, !1), await this.fsync(r);
      } finally {
        await this.close(r);
      }
      await this.notifyChange({ path: t, type: D.Changed, isDirectory: !1 });
    });
  }
  /**
   * Create a directory
   * 
   * Creates a new directory at the specified path. If the recursive option
   * is enabled, parent directories will be created as needed.
   * 
   * @param path - The path where the directory should be created
   * @param options - Options for directory creation
   * @param options.recursive - Whether to create parent directories if they don't exist (default: false)
   * @returns Promise that resolves when the directory is created
   * @throws {OPFSError} If the directory cannot be created
   * 
   * @example
   * \`\`\`typescript
   * // Create a single directory
   * await fs.mkdir('/users/john');
   * 
   * // Create nested directories
   * await fs.mkdir('/users/john/documents/projects', { recursive: true });
   * \`\`\`
   */
  async mkdir(t, e) {
    await this.mount();
    const n = e?.recursive ?? !1, r = M(t);
    let i = this.root;
    for (let o = 0; o < r.length; o++) {
      const a = r[o];
      try {
        i = await i.getDirectoryHandle(a, { create: n || o === r.length - 1 });
      } catch (l) {
        throw l.name === "NotFoundError" ? new F("directory", lt(r.slice(0, o + 1)), l) : l.name === "TypeMismatchError" ? new z("file", a, l) : new Q("create directory", a, l);
      }
    }
    await this.notifyChange({ path: t, type: D.Added, isDirectory: !0 });
  }
  /**
   * Get file or directory statistics
   * 
   * Returns detailed information about a file or directory, including
   * size, modification time, and optionally a hash of the file content.
   * 
   * @param path - The path to the file or directory
   * @returns Promise that resolves to FileStat object
   * @throws {OPFSError} If the path does not exist or cannot be accessed
   * 
   * @example
   * \`\`\`typescript
   * const stats = await fs.stat('/data/config.json');
   * console.log(\`File size: \${stats.size} bytes\`);
   * console.log(\`Last modified: \${stats.mtime}\`);
   * 
   * // If hashing is enabled, hash will be included
   * if (stats.hash) {
   *   console.log(\`Hash: \${stats.hash}\`);
   * }
   * \`\`\`
   */
  async stat(t) {
    if (await this.mount(), t === "/")
      return {
        kind: "directory",
        size: 0,
        mtime: (/* @__PURE__ */ new Date(0)).toISOString(),
        ctime: (/* @__PURE__ */ new Date(0)).toISOString(),
        isFile: !1,
        isDirectory: !0
      };
    const e = it(t);
    let n;
    try {
      n = await this.getDirectoryHandle(et(t), !1);
      const r = this.options.hashAlgorithm, o = await (await n.getFileHandle(e, { create: !1 })).getFile(), a = {
        kind: "file",
        size: o.size,
        mtime: new Date(o.lastModified).toISOString(),
        ctime: new Date(o.lastModified).toISOString(),
        isFile: !0,
        isDirectory: !1
      };
      if (r === "etag")
        a.hash = \`\${o.lastModified.toString(36)}-\${o.size.toString(36)}\`;
      else if (typeof r == "string")
        try {
          const l = await hs(o, r, this.options.maxFileSize);
          a.hash = l;
        } catch (l) {
          console.warn(\`Failed to calculate hash for \${t}:\`, l);
        }
      return a;
    } catch (r) {
      if (r.name === "NotFoundError")
        throw new F("file", t, r);
      if (r.name !== "TypeMismatchError")
        throw new Q("stat", t, r);
    }
    try {
      return await n.getDirectoryHandle(e, { create: !1 }), {
        kind: "directory",
        size: 0,
        mtime: (/* @__PURE__ */ new Date(0)).toISOString(),
        ctime: (/* @__PURE__ */ new Date(0)).toISOString(),
        isFile: !1,
        isDirectory: !0
      };
    } catch (r) {
      throw new Q("stat", t, r);
    }
  }
  /**
   * Read a directory's contents
   * 
   * Lists all files and subdirectories within the specified directory.
   * 
   * @param path - The path to the directory to read
   * @returns Promise that resolves to an array of detailed file/directory information
   * @throws {OPFSError} If the directory does not exist or cannot be accessed
   * 
   * @example
   * \`\`\`typescript
   * // Get detailed information about files and directories
   * const detailed = await fs.readDir('/users/john/documents');
   * detailed.forEach(item => {
   *   console.log(\`\${item.name} - \${item.isFile ? 'file' : 'directory'}\`);
   * });
   * \`\`\`
   */
  async readDir(t) {
    await this.mount();
    const e = await this.getDirectoryHandle(t, !1), n = [];
    for await (const [r, i] of e.entries()) {
      const o = i.kind === "file";
      n.push({
        name: r,
        kind: i.kind,
        isFile: o,
        isDirectory: !o
      });
    }
    return n;
  }
  /**
   * Check if a file or directory exists
   * 
   * Verifies if a file or directory exists at the specified path.
   * 
   * @param path - The path to check
   * @returns Promise that resolves to true if the file or directory exists, false otherwise  
   * 
   * @example
   * \`\`\`typescript
   * const exists = await fs.exists('/config/settings.json');
   * console.log(\`File exists: \${exists}\`);
   * \`\`\`
   */
  async exists(t) {
    if (await this.mount(), t === "/")
      return !0;
    const e = it(t);
    let n = null;
    try {
      n = await this.getDirectoryHandle(et(t), !1);
    } catch (r) {
      if (n = null, r.name !== "NotFoundError" && r.name !== "TypeMismatchError")
        throw r;
    }
    if (!n || !e)
      return !1;
    try {
      return await n.getFileHandle(e, { create: !1 }), !0;
    } catch (r) {
      if (r.name !== "NotFoundError" && r.name !== "TypeMismatchError")
        throw r;
      try {
        return await n.getDirectoryHandle(e, { create: !1 }), !0;
      } catch (i) {
        if (i.name !== "NotFoundError" && i.name !== "TypeMismatchError")
          throw i;
        return !1;
      }
    }
  }
  /**
   * Clear all contents of a directory without removing the directory itself
   * 
   * Removes all files and subdirectories within the specified directory,
   * but keeps the directory itself.
   * 
   * @param path - The path to the directory to clear (default: '/')
   * @returns Promise that resolves when all contents are removed
   * @throws {OPFSError} If the operation fails
   * 
   * @example
   * \`\`\`typescript
   * // Clear root directory contents
   * await fs.clear('/');
   * 
   * // Clear specific directory contents
   * await fs.clear('/data');
   * \`\`\`
   */
  async clear(t = "/") {
    await this.mount();
    try {
      const e = await this.readDir(t);
      for (const n of e) {
        const r = \`\${t === "/" ? "" : t}/\${n.name}\`;
        await this.remove(r, { recursive: !0 });
      }
      await this.notifyChange({ path: t, type: D.Changed, isDirectory: !0 });
    } catch (e) {
      throw e instanceof w ? e : A(e, { path: t, isDirectory: !0 });
    }
  }
  /**
   * Remove files and directories
   * 
   * Removes files and directories. Similar to Node.js fs.rm().
   * 
   * @param path - The path to remove
   * @param options - Options for removal
   * @param options.recursive - Whether to remove directories and their contents recursively (default: false)
   * @param options.force - Whether to ignore errors if the path doesn't exist (default: false)
   * @returns Promise that resolves when the removal is complete
   * @throws {OPFSError} If the removal fails
   * 
   * @example
   * \`\`\`typescript
   * // Remove a file
   * await fs.rm('/path/to/file.txt');
   * 
   * // Remove a directory and all its contents
   * await fs.rm('/path/to/directory', { recursive: true });
   * 
   * // Remove with force (ignore if doesn't exist)
   * await fs.rm('/maybe/exists', { force: true });
   * \`\`\`
   */
  async remove(t, e) {
    if (await this.mount(), t === "/")
      throw new rt("EROOT", t);
    const { recursive: n = !1, force: r = !1 } = e || {}, i = await this.getDirectoryHandle(et(t), !1), o = await this.stat(t);
    await fs(i, t, { recursive: n, force: r }), await this.notifyChange({ path: t, type: D.Removed, isDirectory: o.isDirectory });
  }
  /**
   * Resolve a path to an absolute path
   * 
   * Resolves relative paths and normalizes path segments (like '..' and '.').
   * Similar to Node.js fs.realpath() but without symlink resolution since OPFS doesn't support symlinks.
   * 
   * @param path - The path to resolve
   * @returns Promise that resolves to the absolute normalized path
   * @throws {FileNotFoundError} If the path does not exist
   * @throws {OPFSError} If path resolution fails
   * 
   * @example
   * \`\`\`typescript
   * // Resolve relative path
   * const absolute = await fs.realpath('./config/../data/file.txt');
   * console.log(absolute); // '/data/file.txt'
   * \`\`\`
   */
  async realpath(t) {
    await this.mount();
    try {
      const e = Et(t);
      if (!await this.exists(e))
        throw new F("file", e);
      return e;
    } catch (e) {
      throw e instanceof w ? e : A(e, { path: t });
    }
  }
  /**
   * Rename a file or directory
   * 
   * Changes the name of a file or directory. If the target path already exists,
   * it will be replaced only if overwrite option is enabled.
   * 
   * @param oldPath - The current path of the file or directory
   * @param newPath - The new path for the file or directory
   * @param options - Options for renaming
   * @param options.overwrite - Whether to overwrite existing files (default: false)
   * @returns Promise that resolves when the rename operation is complete
   * @throws {OPFSError} If the rename operation fails
   * 
   * @example
   * \`\`\`typescript
   * // Basic rename (fails if target exists)
   * await fs.rename('/old/path/file.txt', '/new/path/renamed.txt');
   * 
   * // Rename with overwrite
   * await fs.rename('/old/path/file.txt', '/new/path/renamed.txt', { overwrite: true });
   * \`\`\`
   */
  async rename(t, e, n) {
    await this.mount();
    try {
      const r = n?.overwrite ?? !1, i = await this.stat(t);
      if (await this.exists(e) && !r)
        throw new K(e);
      await this.copy(t, e, { recursive: !0, overwrite: r }), await this.remove(t, { recursive: !0 }), await this.notifyChange({ path: t, type: D.Removed, isDirectory: i.isDirectory }), await this.notifyChange({ path: e, type: D.Added, isDirectory: i.isDirectory });
    } catch (r) {
      throw r instanceof w ? r : A(r, { path: t });
    }
  }
  /**
   * Copy files and directories
   * 
   * Copies files and directories. Similar to Node.js fs.cp().
   * 
   * @param source - The source path to copy from
   * @param destination - The destination path to copy to
   * @param options - Options for copying
   * @param options.recursive - Whether to copy directories recursively (default: false)
   * @param options.overwrite - Whether to overwrite existing files (default: true)
   * @returns Promise that resolves when the copy operation is complete
   * @throws {OPFSError} If the copy operation fails
   * 
   * @example
   * \`\`\`typescript
   * // Copy a file
   * await fs.copy('/source/file.txt', '/dest/file.txt');
   * 
   * // Copy a directory and all its contents
   * await fs.copy('/source/dir', '/dest/dir', { recursive: true });
   * 
   * // Copy without overwriting existing files
   * await fs.copy('/source', '/dest', { recursive: true, overwrite: false });
   * \`\`\`
   */
  async copy(t, e, n) {
    await this.mount();
    try {
      const r = n?.recursive ?? !1, i = n?.overwrite ?? !0;
      if (!await this.exists(t))
        throw new F("source", t);
      if (await this.exists(e) && !i)
        throw new K(e);
      if ((await this.stat(t)).isFile) {
        const h = await this.readFile(t);
        await this.writeFile(e, h);
      } else {
        if (!r)
          throw new z("directory", t);
        await this.mkdir(e, { recursive: !0 });
        const h = await this.readDir(t);
        for (const c of h) {
          const f = \`\${t}/\${c.name}\`, u = \`\${e}/\${c.name}\`;
          await this.copy(f, u, { recursive: !0, overwrite: i });
        }
      }
    } catch (r) {
      throw r instanceof w ? r : A(r, { path: t });
    }
  }
  /**
   * Start watching a file or directory for changes
   * 
   * @param path - The path to watch (minimatch syntax allowed)
   * @param options - Watch options
   * @param options.recursive - Whether to watch recursively (default: true)
   * @param options.exclude - Glob pattern(s) to exclude (minimatch).
   * @returns Promise that resolves when watching starts
   * 
   * @example
   * \`\`\`typescript
   * // Watch entire directory tree recursively (default)
   * await fs.watch('/data');
   * 
   * // Watch only immediate children (shallow)
   * await fs.watch('/data', { recursive: false });
   * 
   * // Watch a single file
   * await fs.watch('/config.json', { recursive: false });
   * 
   * // Watch all json files but not in dist directory
   * await fs.watch('/**\\/*.json', { recursive: false, exclude: ['dist/**'] });
   *
   * \`\`\`
   */
  async watch(t, e) {
    if (!this.options.broadcastChannel)
      throw new Ct("This instance is not configured to send events. Please specify options.broadcastChannel to enable watching.");
    const n = {
      pattern: ls(t, e?.recursive ?? !0),
      include: Array.isArray(e?.include) ? e.include : [e?.include ?? "**"],
      exclude: Array.isArray(e?.exclude) ? e.exclude : [e?.exclude ?? ""]
    };
    this.watchers.set(t, n);
  }
  /**
   * Stop watching a previously watched path
   */
  unwatch(t) {
    this.watchers.delete(t);
  }
  /**
   * Open a file and return a file descriptor
   * 
   * @param path - The path to the file to open
   * @param options - Options for opening the file
   * @param options.create - Whether to create the file if it doesn't exist (default: false)
   * @param options.exclusive - If true and create is true, fails if file already exists (default: false)
   *                            Note: This is best-effort in OPFS, not fully atomic due to browser limitations
   * @param options.truncate - Whether to truncate the file to zero length (default: false)
   * @returns Promise that resolves to a file descriptor number
   * @throws {OPFSError} If opening the file fails
   * 
   * @example
   * \`\`\`typescript
   * // Open existing file for reading
   * const fd = await fs.open('/data/config.json');
   * 
   * // Create new file for writing
   * const fd = await fs.open('/data/new.txt', { create: true });
   * 
   * // Create file exclusively (fails if exists)
   * const fd = await fs.open('/data/unique.txt', { create: true, exclusive: true });
   * 
   * // Open and truncate file
   * const fd = await fs.open('/data/log.txt', { create: true, truncate: true });
   * \`\`\`
   */
  async open(t, e) {
    await this.mount();
    const { create: n = !1, exclusive: r = !1, truncate: i = !1 } = e || {}, o = G(Et(t));
    try {
      return n && r ? await L(o, "exclusive", async () => {
        if (await this.exists(o))
          throw new K(o);
        return this._openFile(o, n, i);
      }) : await this._openFile(o, n, i);
    } catch (a) {
      throw a instanceof w ? a : A(a, { path: o, isDirectory: !1 });
    }
  }
  /**
   * Internal method to open a file (without locking)
   * @private
   */
  async _openFile(t, e, n) {
    const r = await this.getFileHandle(t, e);
    try {
      await r.getFile();
    } catch (a) {
      throw A(a, { path: t, isDirectory: !0 });
    }
    const i = await ps(r, t);
    n && (i.truncate(0), i.flush());
    const o = this.nextFd++;
    return this.openFiles.set(o, {
      path: t,
      fileHandle: r,
      syncHandle: i,
      position: 0
    }), o;
  }
  /**
   * Close a file descriptor
   * 
   * @param fd - The file descriptor to close
   * @returns Promise that resolves when the file descriptor is closed
   * @throws {OPFSError} If the file descriptor is invalid or closing fails
   * 
   * @example
   * \`\`\`typescript
   * const fd = await fs.open('/data/file.txt');
   * // ... use the file descriptor ...
   * await fs.close(fd);
   * \`\`\`
   */
  async close(t) {
    const e = this._getFileDescriptor(t);
    xt(t, e.syncHandle, e.path), this.openFiles.delete(t);
  }
  /**
   * Read data from a file descriptor
   * 
   * @param fd - The file descriptor to read from
   * @param buffer - The buffer to read data into
   * @param offset - The offset in the buffer to start writing at
   * @param length - The number of bytes to read
   * @param position - The position in the file to read from (null for current position)
   * @returns Promise that resolves to the number of bytes read and the modified buffer
   * @throws {OPFSError} If the file descriptor is invalid or reading fails
   * 
   * @note This method uses Comlink.transfer() to efficiently pass the buffer as a Transferable Object,
   *       ensuring zero-copy performance across Web Worker boundaries.
   * 
   * @example
   * \`\`\`typescript
   * const fd = await fs.open('/data/file.txt');
   * const buffer = new Uint8Array(1024);
   * const { bytesRead, buffer: modifiedBuffer } = await fs.read(fd, buffer, 0, 1024, null);
   * console.log(\`Read \${bytesRead} bytes\`);
   * // Use modifiedBuffer which contains the actual data
   * await fs.close(fd);
   * \`\`\`
   */
  async read(t, e, n, r, i) {
    const o = this._getFileDescriptor(t);
    St(e.length, n, r, i);
    try {
      const a = i ?? o.position, l = o.syncHandle.getSize(), { isEOF: h, actualLength: c } = ds(a, r, l);
      if (h)
        return B({ bytesRead: 0, buffer: e }, [e.buffer]);
      const f = e.subarray(n, n + c), u = o.syncHandle.read(f, { at: a });
      return i == null && (o.position = a + u), B({ bytesRead: u, buffer: e }, [e.buffer]);
    } catch (a) {
      throw j("read", t, o.path, a);
    }
  }
  /**
   * Write data to a file descriptor
   * 
   * @param fd - The file descriptor to write to
   * @param buffer - The buffer containing data to write
   * @param offset - The offset in the buffer to start reading from (default: 0)
   * @param length - The number of bytes to write (default: entire buffer)
   * @param position - The position in the file to write to (null/undefined for current position)
   * @param emitEvent - Whether to emit a change event (default: true)
   * @returns Promise that resolves to the number of bytes written
   * @throws {OPFSError} If the file descriptor is invalid or writing fails
   *
   * @example
   * \`\`\`typescript
   * const fd = await fs.open('/data/file.txt', { create: true });
   * const data = new TextEncoder().encode('Hello, World!');
   * const bytesWritten = await fs.write(fd, data, 0, data.length, null);
   * console.log(\`Wrote \${bytesWritten} bytes\`);
   * await fs.close(fd);
   * \`\`\`
   */
  async write(t, e, n = 0, r, i, o = !0) {
    const a = this._getFileDescriptor(t), l = r ?? e.length - n;
    St(e.length, n, l, i);
    try {
      const h = i ?? a.position, c = e.subarray(n, n + l), f = a.syncHandle.write(c, { at: h });
      return (i == null || i === a.position) && (a.position = h + f), o && await this.notifyChange({ path: a.path, type: D.Changed, isDirectory: !1 }), f;
    } catch (h) {
      throw j("write", t, a.path, h);
    }
  }
  /**
   * Get file status information by file descriptor
   * 
   * @param fd - The file descriptor
   * @returns Promise that resolves to FileStat object
   * @throws {OPFSError} If the file descriptor is invalid
   * 
   * @example
   * \`\`\`typescript
   * const fd = await fs.open('/data/file.txt');
   * const stats = await fs.fstat(fd);
   * console.log(\`File size: \${stats.size} bytes\`);
   * console.log(\`Last modified: \${stats.mtime}\`);
   * 
   * // If hashing is enabled, hash will be included
   * if (stats.hash) {
   *   console.log(\`Hash: \${stats.hash}\`);
   * }
   * \`\`\`
   */
  async fstat(t) {
    const e = this._getFileDescriptor(t);
    return this.stat(e.path);
  }
  /**
   * Truncate file to specified size
   * 
   * @param fd - The file descriptor
   * @param size - The new size of the file (default: 0)
   * @returns Promise that resolves when truncation is complete
   * @throws {OPFSError} If the file descriptor is invalid or truncation fails
   * 
   * @example
   * \`\`\`typescript
   * const fd = await fs.open('/data/file.txt', { create: true });
   * await fs.truncate(fd, 100); // Truncate to 100 bytes
   * \`\`\`
   */
  async ftruncate(t, e = 0) {
    const n = this._getFileDescriptor(t);
    if (e < 0 || !Number.isInteger(e))
      throw new N("argument", "Invalid size");
    try {
      n.syncHandle.truncate(e), n.syncHandle.flush(), n.position > e && (n.position = e), await this.notifyChange({ path: n.path, type: D.Changed, isDirectory: !1 });
    } catch (r) {
      throw j("truncate", t, n.path, r);
    }
  }
  /**
   * Synchronize file data to storage (fsync equivalent)
   * 
   * @param fd - The file descriptor
   * @returns Promise that resolves when synchronization is complete
   * @throws {OPFSError} If the file descriptor is invalid or sync fails
   * 
   * @example
   * \`\`\`typescript
   * const fd = await fs.open('/data/file.txt', { create: true });
   * await fs.write(fd, data);
   * await fs.fsync(fd); // Ensure data is written to storage
   * \`\`\`
   */
  async fsync(t) {
    const e = this._getFileDescriptor(t);
    try {
      e.syncHandle.flush();
    } catch (n) {
      throw j("sync", t, e.path, n);
    }
  }
  /**
   * Dispose of resources and clean up the file system instance
   * 
   * This method should be called when the file system instance is no longer needed
   * to properly clean up resources like the broadcast channel and watch timers.
   */
  dispose() {
    this.broadcastChannel && (this.broadcastChannel.close(), this.broadcastChannel = null), this.watchers.clear();
    for (const [t, e] of this.openFiles)
      xt(t, e.syncHandle, e.path);
    this.openFiles.clear(), this.nextFd = 1;
  }
  /**
   * Synchronize the file system with external data
   * 
   * Syncs the file system with an array of entries containing paths and data.
   * This is useful for importing data from external sources or syncing with remote data.
   * 
   * @param entries - Array of [path, data] tuples to sync
   * @param options - Options for synchronization
   * @param options.cleanBefore - Whether to clear the file system before syncing (default: false)
   * @returns Promise that resolves when synchronization is complete
   * @throws {OPFSError} If the synchronization fails
   * 
   * @example
   * \`\`\`typescript
   * // Sync with external data
   * const entries: [string, string | Uint8Array | Blob][] = [
   *   ['/config.json', JSON.stringify({ theme: 'dark' })],
   *   ['/data/binary.dat', new Uint8Array([1, 2, 3, 4])],
   *   ['/upload.txt', new Blob(['file content'], { type: 'text/plain' })]
   * ];
   * 
   * // Sync without clearing existing files
   * await fs.sync(entries);
   * 
   * // Clean file system and then sync
   * await fs.sync(entries, { cleanBefore: true });
   * \`\`\`
   */
  async createIndex(t) {
    await this.mount();
    try {
      for (const [e, n] of t) {
        const r = G(e);
        let i;
        n instanceof Blob ? i = await us(n) : typeof n == "string" ? i = new TextEncoder().encode(n) : i = n, await this.writeFile(r, i);
      }
    } catch (e) {
      throw e instanceof w ? e : A(e);
    }
  }
}
typeof globalThis < "u" && globalThis.constructor.name === "DedicatedWorkerGlobalScope" && ot(new gs());
`,tb="u">typeof self&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",tw],{type:"text/javascript;charset=utf-8"});function tv(t){let e;try{if(!(e=tb&&(self.URL||self.webkitURL).createObjectURL(tb)))throw"";let s=new Worker(e,{type:"module",name:t?.name});return s.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),s}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(tw),{type:"module",name:t?.name})}}function tx(t){return t instanceof URL?t.pathname:t}class tE{#e;promises=this;constructor(t){this.#e=(0,r.wrap)(new tv),t&&(t.broadcastChannel&&t.broadcastChannel instanceof BroadcastChannel&&(t.broadcastChannel=t.broadcastChannel.name),this.setOptions(t))}watch(t,e){let s=tx(t);return this.#e.watch(s,e),()=>this.unwatch(s)}unwatch(t){let e=tx(t);this.#e.unwatch(e)}async setOptions(t){return this.#e.setOptions(t)}async index(){return this.#e.index()}async readFile(t,e){let s,r=tx(t);"string"==typeof e?s=e:e&&"object"==typeof e&&(s=e.encoding);let i=await this.#e.readFile(r);return s||(s=l(r)?"binary":"utf-8"),"binary"===s?i:p(i,s)}async writeFile(t,e,s){let r,i=tx(t);"string"==typeof s?r=s:s&&"object"==typeof s&&(r=s.encoding),r||(r="string"!=typeof e||l(i)?"binary":"utf-8");let n="string"==typeof e?c(e,r):e instanceof Uint8Array?e:new Uint8Array(e);return this.#e.writeFile(i,n)}async appendFile(t,e,s){let r=tx(t);s||(s="string"!=typeof e||l(r)?"binary":"utf-8");let i="string"==typeof e?c(e,s):e instanceof Uint8Array?e:new Uint8Array(e);return this.#e.appendFile(r,i)}async mkdir(t,e){let s,r=tx(t);return s="number"==typeof e?{recursive:!1}:e,this.#e.mkdir(r,s)}async stat(t){let e=tx(t);return this.#e.stat(e)}async readDir(t){let e=tx(t);return this.#e.readDir(e)}async exists(t){let e=tx(t);return this.#e.exists(e)}async clear(t){let e=t?tx(t):void 0;return this.#e.clear(e)}async remove(t,e){let s=tx(t);return this.#e.remove(s,e)}async unlink(t){return this.remove(t)}async rm(t,e){return this.remove(t,e)}async rmdir(t){return this.remove(t)}async readdir(t,e){return this.readDir(t)}async lstat(t){return this.stat(t)}async chmod(t,e){return Promise.resolve()}async realpath(t){let e=tx(t);return this.#e.realpath(e)}async rename(t,e,s){let r=tx(t),i=tx(e);return this.#e.rename(r,i,s)}async copy(t,e,s){let r=tx(t),i=tx(e);return this.#e.copy(r,i,s)}async open(t,e){let s=tx(t);return this.#e.open(s,e)}async close(t){return this.#e.close(t)}async read(t,e,s,r,i){let{bytesRead:n,buffer:o}=await this.#e.read(t,new Uint8Array(r),0,r,i);return n>0&&e.set(o.subarray(0,n),s),{bytesRead:n,buffer:e}}async write(t,e,s,r,i,n){return this.#e.write(t,e,s,r,i,n)}async fstat(t){return this.#e.fstat(t)}async ftruncate(t,e){return this.#e.ftruncate(t,e)}async fsync(t){return this.#e.fsync(t)}dispose(){this.#e.dispose()}async createIndex(t){let e=t.map(([t,e])=>[tx(t),e]);return this.#e.createIndex(e)}async readText(t,e="utf-8"){let s=tx(t);return p(await this.#e.readFile(s),e)}async writeText(t,e,s="utf-8"){let r=tx(t),i=c(e,s);return this.#e.writeFile(r,i)}async appendText(t,e,s="utf-8"){let r=tx(t),i=c(e,s);return this.#e.appendFile(r,i)}}let tS=null;class tO{chunks=[];filePath;closed=!1;constructor(t){this.filePath=t}write(t){if(this.closed)throw new DOMException("The stream is closed","InvalidStateError");"object"!=typeof t||!("type"in t)||t instanceof Blob||t instanceof ArrayBuffer?this.chunks.push(t):"write"===t.type?this.chunks.push(t.data):"truncate"===t.type&&(this.chunks=[])}async close(){if(this.closed)return;if(!tS)throw Error("[OPFS] Worker not initialized");let t=new Blob(this.chunks),e=new Uint8Array(await t.arrayBuffer());await tS.writeFile(this.filePath,e),this.closed=!0,this.chunks=[]}abort(){this.closed=!0,this.chunks=[]}seek(t){throw Error("[OPFS] seek() not implemented in polyfill")}truncate(t){if(0===t)this.chunks=[];else throw Error("[OPFS] truncate() with non-zero size not implemented in polyfill")}}async function tP(){try{console.log("[OPFS] Creating opfs-worker..."),tS=await new tE(void 0),console.log("[OPFS] ✓ opfs-worker created successfully");let t=Object.getPrototypeOf(navigator.storage),e=navigator.storage.getDirectory.bind(navigator.storage),s=async function(){let t=await e.call(this);return function t(e,s){return new Proxy(e,{get(e,r){if("getFileHandle"===r)return async(t,r)=>{let i=await e.getFileHandle(t,r),n=`${s}/${t}`.replace(/\/+/g,"/");return new Proxy(i,{get(t,e){if("createWritable"===e)return async()=>new tO(n);let s=t[e];return"function"==typeof s?s.bind(t):s}})};if("getDirectoryHandle"===r)return async(r,i)=>{let n=await e.getDirectoryHandle(r,i);return t(n,`${s}/${r}`.replace(/\/+/g,"/"))};let i=e[r];return"function"==typeof i?i.bind(e):i}})}(t,"/")};try{navigator.storage.getDirectory=s,console.log("[OPFS] ✓ Patched navigator.storage.getDirectory (instance)")}catch(t){console.log("[OPFS] Could not patch instance:",t)}try{t.getDirectory=s,console.log("[OPFS] ✓ Patched StorageManager.prototype.getDirectory (prototype)")}catch(t){console.log("[OPFS] Could not patch prototype:",t)}console.log("[OPFS] ✓ Polyfill installed successfully!")}catch(t){console.error("[OPFS] ✗ Failed to initialize polyfill:",t),console.error("[OPFS] Error details:",t instanceof Error?t.stack:t)}}let tA=null;async function tF(){if(tA)return tA;if("u">typeof FileSystemFileHandle&&"createWritable"in FileSystemFileHandle.prototype){tA=Promise.resolve();return}if(console.log("[OPFS] createWritable not natively supported"),!navigator.storage?.getDirectory){console.warn("[OPFS] Not supported - navigator.storage.getDirectory missing"),tA=Promise.resolve();return}return console.log("[OPFS] Starting polyfill initialization..."),console.log("[OPFS] Browser:",navigator.userAgent),tA=tP()}t.s(["OPFSPolyfillWrapper",0,()=>((0,s.useEffect)(()=>{tF().catch(t=>{console.error("[OPFS] Failed to initialize polyfill:",t)})},[]),null)],899230)},394876,t=>{t.n(t.i(899230))}]);

//# debugId=0d0bf44b-7d26-b278-d683-545966e46b0c
