function changeStyleToCover() {
  const firstPageNode = document.querySelector("#knowledge-editor");

  const style = {
    width: firstPageNode.style.width,
    height: firstPageNode.style.height,
    overflow: firstPageNode.style.overflow
    // padding: firstPageNode.style.padding

  };
  firstPageNode.style.width = "800px";
  firstPageNode.style.height = "750px";
  // firstPageNode.style.padding = "40px";
  firstPageNode.style.overflow = "hidden";

  return function () {
    firstPageNode.style.width = style.width;
    firstPageNode.style.height = style.height;
    firstPageNode.style.overflow = style.overflow;
    // firstPageNode.style.padding = style.padding;
  };
}

export default function getCoverPic(fileType = "toJpeg") {
  return new Promise((resolve, reject) => {
    const firstPageNode = document.querySelector("#knowledge-editor");
    const componentEditorRightNode = document.querySelector("#componentEditorRight");
    const attachmentElements = document.querySelectorAll(".node-attachment");
    componentEditorRightNode.scrollTop = 0;
    attachmentElements.forEach((attachmentElement) => {
      // 选择具有 'icon-k-close' 类名的元素
      const closeIconElement = attachmentElement.querySelector(".icon-k-close");
      closeIconElement?.click?.();
    });
    const timer = setTimeout(() => {
      const restoreStyle = changeStyleToCover();
      import("html-to-image")
        .then((htmlToImage) => {
          return htmlToImage[fileType](firstPageNode, {
            quality: 0.5,
            backgroundColor: "white",
            cacheBust: true,
            fetchRequestInit: { method: "GET" },
            imagePlaceholder: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAKAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9QNc+Ofgez1DSfCslxY2fia6eKMRPcLNLdu+PLjMRjKKzsU2I3L5Aw+7Nd49x47tnaMePrOxEZ2i2uNQsDNb4/gctbs25eh3MxyDkk818PfsXTPN4x+NWuuzNrej+Ctb1Gw1AnN1Y3WdvnxS/ejl2sw3qQ2GIzya9C+F+pXGp/DTw7cXFxNcXFxpltJLLI5Z5HMSksxPJJJySetTw5nUs5dX2lOMVCTS3bsn1bf5JLyPk8qzKpWjKcu7Stptb7/wP/9k=",
            filter(domNode) {
              // 如果该图片是损坏的，截图就会报错，但是没办法直接判断
              if (domNode.tagName === "IMG") {
                return domNode.naturalWidth !== 0;// 为0就是破损的图片或者src为空的图片
              }
              return true;
            }
          });
        })
        .then(function (dataUrl) {
          restoreStyle();
          resolve(dataUrl);
        })
        .catch(function (error) {
          reject(error);
        });
      clearTimeout(timer);
    }, 1000);
  });
}
