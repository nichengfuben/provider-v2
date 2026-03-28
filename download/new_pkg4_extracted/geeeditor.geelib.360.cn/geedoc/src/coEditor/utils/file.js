export const normalizeFileSize = (size) => {
  if (size < 1024) {
    return size + " Byte";
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  }
  return (size / 1024 / 1024).toFixed(2) + " MB";
};

export const normalizeFileType = (fileType) => {
  if (!fileType) return "file";

  if (fileType === "application/pdf") return "pdf";

  if (fileType.startsWith("image")) {
    return "image";
  }

  if (fileType.startsWith("audio")) {
    return "audio";
  }

  if (fileType.startsWith("video")) {
    return "video";
  }

  return "file";
};

export const readImageAsBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        resolve({
          alt: file.name,
          src: reader.result
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });
};

export const getImageWidthHeight = (url) => {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: "auto", height: "auto" });
    };
    img.src = url;
  });
};
