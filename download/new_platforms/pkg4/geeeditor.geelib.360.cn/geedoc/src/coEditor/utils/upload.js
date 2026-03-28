import { ElMessage } from "element-plus";
import Image from "../extensions/image";
import attachment from "../extensions/attachment";
import { getImageWidthHeight } from "./file";
import { generateUniqueId } from "./uniqueId.js";
import PubSub from "pubsub-js";
import { Slice, Fragment } from "@tiptap/pm/model";
import { useEditorStore } from "@/store/index.js";

const acceptedMimes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/svg+xml"]
};

const fileTaskArr = [];
export const handleFileEvent = ({ file, editor }, isLastFile = true) => {
  if (!file) return false;
  const fileInfo = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    id: generateUniqueId()
  };
  fileTaskArr.push({ file, fileInfo });
  if (isLastFile) {
    insertInitFileAndImgNode(fileTaskArr, editor);
    uploadFileAndImg(fileTaskArr, editor);
    fileTaskArr.length = 0;
  }
};

function insertInitFileAndImgNode(fileTaskArr, editor) {
  const { view } = editor;
  const nodeArr = [];
  fileTaskArr.forEach(({ file, fileInfo }) => {
    const isImage = acceptedMimes.image.includes(file?.type);
    const node = view.props.state.schema
      .nodes[isImage ? Image.name : attachment.name]
      .create({ ...fileInfo });
    nodeArr.push(node);
  });
  const nodeSlice = new Slice(Fragment.from(nodeArr), 0, 0);
  view.dispatch(view.state.tr.replaceSelection(nodeSlice));
}

function uploadFileAndImg(fileTaskArr, editor) {
  fileTaskArr.forEach(async ({ file, fileInfo }) => {
    const isImage = acceptedMimes.image.includes(file?.type);
    isImage ? uploadImage(file, fileInfo, editor) : uploadAttachment(file, fileInfo);
  });
}

async function uploadImage(file, fileInfo, editor) {
  const id = fileInfo.id;
  PubSub.publish("emitToRoot", { event: "imageUpload", value: { id, file } });
  // try {
  //   const url = await uploadFile(file);
  //   const size = await getImageWidthHeight(url);
  //   PubSub.publish("imageMessage", JSON.stringify({
  //     id,
  //     mes: {
  //       src: url,
  //       width: editor.isActive("table") ? "100%" : size.width,
  //       height: editor.isActive("table") ? "auto" : size.height
  //     }
  //   }));
  // } catch (e) {
  //   PubSub.publish("imageMessage", JSON.stringify({ id, mes: { error: e } }));
  //   ElMessage.error("上传图片失败！");
  //   throw e;
  // }
}

function uploadAttachment(file, fileInfo) {
  const id = fileInfo.id;
  if (file.size / 1024 / 1024 > 500) {
    PubSub.publish("attachmentMessage", JSON.stringify({ id, mes: { error: "上传文件大小不能超过 500M" } }));
    ElMessage.error("上传文件大小不能超过 500M");
  }

  const uploadForm = new FormData();
  uploadForm.append("file[0]", file);

  const editorStore = useEditorStore();
  const uploadFileFunc = editorStore.extensionConfig.attachment.uploadFileFunc;

  uploadFileFunc(uploadForm, {
    onUploadProgress: (progressEvent) => {
      // 此处的进度是发送给后端的进度，前端把所有内容发送给后端就会100%，但是后端处理完接口成功还有一段时间，因此改为最大99%
      const process = (progressEvent.loaded / progressEvent.total * 100).toFixed(1);
      PubSub.publish("attachmentMessage", JSON.stringify({ id, mes: { uploadProcess: process > 99 ? 99 : process } }));
    }
  }).then((res) => {
    const result = res[0];
    if (result) {
      PubSub.publish("attachmentMessage", JSON.stringify({ id, mes: { url: result.downloadUrl } }));
    } else {
      PubSub.publish("attachmentMessage", JSON.stringify({ id, mes: { error: "文件上传失败" } }));
    }
  }).catch((error) => {
    PubSub.publish("attachmentMessage", JSON.stringify({ id, mes: { error: "文件上传失败：" + (error && error.message) || "未知错误" } }));
  }).finally(() => {
    PubSub.publish("attachmentMessage", JSON.stringify({ id, mes: { uploadProcess: "" } }));
  });
}

function uploadFile(file) {
  const editorStore = useEditorStore();
  const uploadFileFunc = editorStore.extensionConfig.attachment.uploadFileFunc;

  const uploadForm = new FormData();
  uploadForm.append("file[0]", file);

  return uploadFileFunc(uploadForm).then((res) => {
    const result = res[0];
    return result.downloadUrl;
  });
}
