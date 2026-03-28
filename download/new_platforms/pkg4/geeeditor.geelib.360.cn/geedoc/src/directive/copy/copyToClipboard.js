import { ElMessage } from "element-plus";

function copyToClipboard (text) {
  if (!text) {
    // 值为空的时候，给出提示
    ElMessage.warning({
      message: "您好，复制的值不能为空。",
      type: "warning"
    });
    return;
  }

  // 动态创建 textarea 标签
  const textarea = document.createElement("textarea");
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = "readonly";
  textarea.style.position = "absolute";
  textarea.style.top = "0px";
  textarea.style.left = "-9999px";
  // 将要 copy 的值赋给 textarea 标签的 value 属性;
  textarea.value = text;
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea);
  // 选中值并复制
  textarea.select();
  const result = document.execCommand("Copy");
  if (result) {
    ElMessage.success("复制成功");
  }

  document.body.removeChild(textarea);
  return result;
}

export default copyToClipboard;
