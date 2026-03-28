import { useEditorStore } from "@/store/index.js";

// Hash操作封装
export const Hash = {
  getValue(key) {
    const reg = new RegExp("[\\#|&]" + key + "=([^&]*)");
    const regValue = window.location.hash.match(reg);
    if (regValue !== null && regValue.length > 0) {
      return decodeURI(regValue[1]);
    }
  },
  addValue(key, value) {
    let hashValue = window.location.hash;
    const reg = new RegExp("[\\#|&]" + key + "=([^&]*)");
    if (reg.test(hashValue)) {
      hashValue = hashValue.replace(reg, function (match) {
        const regArr = match.split("=");
        regArr[1] = value;
        return regArr.join("=");
      });
    } else {
      const prefix = hashValue.length > 1 ? "&" : "#";
      hashValue = `${hashValue.slice(1)}${prefix}${key}=${value}`;
    }
    window.location.hash = hashValue;
  },
  hasValue(key) {
    const reg = new RegExp("[\\#|&]" + key + "=([^&]*)?");
    const regValue = window.location.hash.match(reg);
    return regValue !== null && regValue.length > 0;
  },
  remove(key) {
    const reg = new RegExp("[\\#|&]" + key + "=([^&]*)");
    window.location.hash = window.location.hash.replace(reg, "");
  }
};

// 下载文件
export function downloadFileByUrl(href, name) {
  window.open(href);
}

// 下载文件
export function downloadFileByUrlWithATag(href, name) {
  const aEl = document.createElement("a");
  aEl.setAttribute("href", href);
  aEl.setAttribute("download", name);
  document.body.appendChild(aEl);
  aEl.style.display = "none";
  aEl.click();
  aEl.remove();
}

export function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return "";
}

/**
 * 动态加载js文件
 * @param url
 * @param callback
 */
export function loadJS(url, callback) {
  if (!window.__loadScript) window.__loadScript = {};

  if (window.__loadScript[url] === true) {
    typeof callback === "function" && callback(null);
    return;
  }
  const script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) {
    script.onreadystatechange = () => {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        window.__loadScript[url] = true;
        typeof callback === "function" && callback(null);
      }
    };
  } else {
    script.onload = () => {
      window.__loadScript[url] = true;
      typeof callback === "function" && callback(null);
    };
    script.onerror = (e) => {
      typeof callback === "function" && callback(e);
    };
  }
  script.src = url;

  document.body.appendChild(script);
}

export function getScreenSize() {
  // 超小屏幕 <768px
  // 小屏幕 768px ~ 991px
  // 中屏幕 992px - 1199px
  // 大屏：1200px以上
  const clientWidth = document.documentElement.clientWidth;

  let size = "lg";
  if (clientWidth >= 1920) size = "xl";
  else if (clientWidth >= 1200) size = "lg";
  else if (clientWidth >= 992) size = "md";
  else if (clientWidth >= 768) size = "sm";
  else size = "xs";

  return size;
}

export function generateUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); // use high-precision timer if available
  }
  const uuid = "xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export const eventTrack = (cId, c) => {
  const m = window.RADAR_MONITOR;
  if (!m) return;

  const params = {
    cId: cId,
    c: c
  };
  m.log(params, "click");
};

export const previewImg = (dom) => {
  if (dom && dom.naturalWidth !== 0) { // dom.naturalWidth=0为破损图片不预览
    Promise.all([import("viewerjs"), import("viewerjs/dist/viewer.css")])
      .then(([module]) => {
        const Viewer = module.default;
        let viewer = new Viewer(dom, {
          navbar: false,
          title: false,
          container: document.querySelector(".component-editor"),
          toolbar: {
            zoomIn: 1,
            zoomOut: 1,
            oneToOne: 1,
            reset: 1,
            play: {
              show: 1,
              size: "large"
            },
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4
          },
          hide() {
            viewer.destroy();// 用后即销毁，不然第二次点击该图片会出不来
          },
          shown() {
            // 演示模式下避免底部footer跑到屏幕外
            const editorStore = useEditorStore();
            const isPresentationMode = editorStore.isPresentationMode;
            if (isPresentationMode) {
              const footerDom = document.querySelector(".viewer-footer");
              footerDom.style.bottom = footerDom.clientHeight + "px";
            }
          }
        });
        viewer.show();
      });
  }
};
