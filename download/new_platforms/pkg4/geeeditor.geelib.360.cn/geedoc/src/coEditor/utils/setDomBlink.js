// 给dom加一下高亮闪烁的效果
// dom：支持 dom 和dom数组
export function setDomBlink(dom) {
  let domArr;
  if (Array.isArray(dom)) {
    domArr = dom;
  } else {
    domArr = [dom];
  }

  domArr.forEach((c) => {
    c.classList.add("blink-text");
  });
  const timerAni = setTimeout(() => {
    domArr.forEach((c) => {
      c.classList.remove("blink-text");
    });
    clearTimeout(timerAni); // 清除定时器
  }, 2400);
}
