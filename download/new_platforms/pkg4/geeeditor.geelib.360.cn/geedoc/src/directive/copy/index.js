import copyToClipboard from "./copyToClipboard.js";

const copy = {
  mounted (el, { value }) {
    el.$value = value;
    el.handler = () => {
      el.style.position = "relative";

      copyToClipboard(el.$value);
    };
    // 绑定点击事件
    el.addEventListener("click", el.handler);
  },
  beforeUpdate (el, {
    value
  }) {
    el.$value = value;
  },
  unmounted (el) {
    el.removeEventListener("click", el.handler);
  }
};

export default copy;
