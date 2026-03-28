const iframeClick = {
  mounted(iframEl, { value }) {
    let waitForfun = value;
    function bind(el, ename, fn, cap) {
      cap = cap || false;
      el.addEventListener(ename, fn, cap);
    }
    let isOverIFrame = false;
    bind(iframEl, "mouseenter", function () {
      waitForfun = value;
      window.focus();
      isOverIFrame = true;
    });
    bind(iframEl, "mouseleave", function () {
      // 不能使用mouseout会因冒泡产生bug
      waitForfun = null;
      isOverIFrame = false;
    });
    bind(
      window,
      "blur",
      function () {
        if (!isOverIFrame || waitForfun === null) return;
        waitForfun(); // 执行点击事件
        waitForfun = null;
      },
      true
    );
  },
  unmounted(iframEl, { value }) {
    iframEl.removeEventListener("mouseenter", value);
    iframEl.removeEventListener("mouseleave", value);
    window.removeEventListener("blur", value);
  }
};

export default iframeClick;
