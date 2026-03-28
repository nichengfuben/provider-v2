<template>
  <div class="editor-container">
    <geelibEditor
      ref="geelibEditorRef"
      :doc="doc"
      :userInfo="userInfo"
      :readOnly="readOnly"
      :noCollaboration="true"
      :extensionConfig="extensionConfig"
      :isJsonOrHtml="true"
      @create="handleCreate"
      @titleChange="handleTitleChange"
      @contentChange="debounceHandleContentChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @aiLog="handleAILog"
      @noAIAuth="handleNoAIAuth"
      @imageUpload="handleUploadImage"
      @event="event"
    ></geelibEditor>
  </div>
</template>

<script setup>
import geelibEditor from "@/coEditor/index.vue";
import mobileConfig from "./extensionConfig/mobileConfig.js";
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
// import $ from "jquery";
import { useEditorStore } from "@/store/index.js";
import { debounce } from "lodash-es";

// window.$ = $;
// window.jQuery = $;

const geelibEditorRef = ref();
const editorStore = useEditorStore();

// 获取URL中的source参数
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 将source参数存储到pinia store中
editorStore.$patch({
  source: getUrlParameter("source") || ""
});

onMounted(() => {
  // 默认宽屏
  geelibEditorRef.value.setWiderMode(true);
});

const event = (msg) => {
  window.parent.postMessage({ type: "event", value: msg }, "*");
};

const readOnly = ref(getUrlParameter("readonly") === "1" || false);

const doc = reactive({
  id: 1, // 必要字段。文档id
  title: "", // 必要字段。文档标题
  isCopy: 0, // 非必要字段。如果是复制的文档则为1，需要同时有content，把content的内容写到编辑器文档里。这里做了一个文档内容的简化，避免文档越复制越大
  content: "", // , 非必要字段。文档内容。如果是协同，不需要content。从yjs获取。非协同的，此处则为文档内容，配合 props中的 noCollaboration 和 isJsonOrHtml 使用。
  // content: "eJytWglwlVWWvuf//7e/BEgi2AQ7WA2OYhNethcCQtdrbcUexumaVrtqaqqtR/JI0hMInTwm3VPFFGFJEDABAwFJZJc1gDowQfY/rC2i7AwCLiwhihCWIFvAOfec/z5eHmBXV49aL/c79/73v/fcc8/5zvndBFDZvvJeJyGGGMsnV17tJMwP2ld94v4N/fYC4Q1QaxAIGzRM/ew8jgR9UnPTMWxogYOTJ3we93sQdjhT//1i2Qd1TV/Xyz5bhblgppSYk+rvfa0n0288CMOkDlDYC+23vhqPAz3akp0fnosXZs0Xp3a4H7tSPXeWIfC12hrz4mkUn/zfthpPQvn5tuseKY7bN7vpy3ghksw7q7+fpyfMvl5bacMOMKkjKQZ3jcGPx+DuCjvNM7da74Jon1V+IM6G/fqEFVuP4os8ZtP6jU3xdvo1QCTAwosXPsEOcBz78OBeXGHb+i+murrRrxdMFloIt82YfkG+llp2hTUHzSv1tWfb4l3uJ+n3d9hhYeqmB6MwLsMB15bd2EDLuPyuuR4bmkknGacOzmFh6tZQdQHG8tnWqsnT8ZFEfe/ccbJhC2xc1HDImQzCZcx4p6kKd7X+y5MVNrFly+U1rC7G3Cmt4uLxb6bKt+rNl6rHYkM3x31a1+p13Ll+6WMXjbh5tvZunLSNpoMXbmFD8554a3pbnAgcn7eo2o1DHAEWSDVRy6nwf5kNW/bO0cWiGeuadTkZ908FJUiwBlhiaS81685/HSfMd9e2n3DbL48/us0rJ04kWxWic2DuxnFNWg6IeDbfznjm3EqJtJ6OtNIirQGR1vOR1tBI6zW8BDrZDCrRMiEyzCQQjw1dUb770zix+79b1s6IEzuqKk65hW4rHBHMDz0puM9WVpgXLgAF7QWhwvyCMDxtYVc49KdwoKgwfySUGUWh4WHVkVgQLH21pDA/P1Ty2qi8YDj0WkkR/Fn1OocXFoVeCY4IQVnc8KListyCYEk4tfQ/8iOvDZWUFJdEXqMV5kGZOy3Ll5ae6cvMSldyvbQkF8qGFoTDo0oH9Os3LFT4h8KR+al/Kg0Xl4RS/1hYMDo1t3hEv/xQqKhwWN9hwdJQ33CoNNwv8s43/FnDM4YND+b4Moan5cgVLKOZAcZ05ZYGY5J289ssBbmD4XAwt2BEaKTarSdqP+7ScN7T2c+kFhXnd+j9beF/hmBM3eyx2R3Er/55FD4klMza932BPZibGxoVRomlGk/c6FFFxcG835QU54ZKS5WKPKyiTF+6L9OflZnuW0DiLm7Vr4/GAyj7p79ZVbid3un9s3un51i6GtY/KzQ8IyQ3yBrqgYtjDXkeZkIpHU0oJcaEUh5lQik/akIpf82EUjqaUIplQv50f5o/w5fTX8n/v0woN8PvC+al3zehnhETejJiQimPNKE+sSaUEW1CfaJMqHbjD44O4o4m1CfWhPo8YEJ9Hm5CfSwV9U+TBpTpT2cT8mmq/+8zoYz7JpSXNywt6B9234QycHEmv4Q1hI6RNeZ/mEkN7GhSA2NMauCjTGrgj5rUwKgj6Eave8OfPiwtx5+bmZYVzB6eOmpkfmQBHYxrIGsuIyszIys7OzvTp+RsXK//zRp7yNtJdbm+/rn+PF9OnlwLq+45GPN2MjcHwZg3O+1umbPlnlucOnvwpAN016hgSTC/JDiqwFrSiw/ohvX84qMeGPKIB4Y86oFfP/CAcLxEiwLd++8ji8uKQnn5oReKc63xv2Wz+pVUEuoozZea5k9Nz0pNy8ga0N/XP9PSTr/Io/3yinN/UToqmBt6OW9QduZTCLGR5k9D56fm9OYWjwzj7XojTJfDHsorRJWrXlu4MFyEYm/zuikta2Y211Y2L1jksBRkN7jxO2d6Zgbeg/QMpTo65aTIfvump2X4MnxZ+J/17JCHbjDIGxwQWXKGteQcf2Z22s9yR6M1jAiMzC0oLkHhw6ZXE/3oroJqVz2a61ecm7753LS3eGMZ+E8J/ZOamqoGe6ypXsWzgjItPQPa627vliQofvrZEyaSoAszl66TTMZrskDhbozjFN6rsaA3CzThZnxVUyMswd2IQGfBJF0JQJu7urYRydHeK7enaEJxcLu7+u1j61B8YNy18XbRWH5rmx1Hd7Iwd8r5o3DnGJwsqXMUfgqn1ZjwBCK+RmtafLMa38Ocbc/pS3ckp7TZiTHiqiQJtSkGajCRFAqDhekXmflg+Hb6kbNeTAG0qbUndnpV5sBphHwbkz+LCX75edUauQg3VFfP3YyPuZPXt+xfgQ0700+npJcksitsZ+yNwYkKJzDurrA3wM+DSObWgMicrytszfFvMThXYWvOPyjsjWa47yHD1Xnq1yW1XjDLXII7eNZYealhIW6VnRLrUWqMxQq7E1bvrKvxigBphOg0CxROZGyP6e+usM64p8Iexr1ixvsUdjD2K+xkPDjS7z3ZtHAiLoiXgVmHyQLG0sYJe1T/T60X8mvkgqg/S2FgnBPBGieMVk4yc+3iakOmQPqM9w9/6ZEpbMXmM1ucmkxhp4zbflyKYF/N202y4T5VvXU5JpvgyAsND44uCuOCyy2ZAG7hobu55Y70PiazRkpXBZ4mv1nlrZ1h59bPJsjZ9S0LL5d7ZMLH9slpC+pUP7FjSTmtjfJsuTaDz/UlPsioWACCe3BLT1vNB8KC/uHdeSjH+8RpCeW7vUE8B4v23PgWO3SNL2hAzaUn8AEF2CPJc2WBwonWmmP6uyusM+6psIdxr5jxPoUdjP0KOxkPjvTD/jOnj+NSJwGsvrv8ELZ2gat16rl92Ophzjmy5Rs9hX5/To6SenqwQBoR4W80NcIStEUEeiIly0K4AqcmVXxlx7O0c+HDJbNTaqHD83DrcWmnXCBR2MY4VWFnQBVQOnPPIIWB8SsK235C+bzAPS/85Npiu+fy3t13tcflQMbUTb6HcN95x67vcumRwkAXha3CQBf6TZI6pVZXhbXo/q6YlUYXGhB3icbZ0v1G4ZflmUbhV2L6/wXfZyP3K3BiLg6okoHN8suREgJ81XJ+PQ5MNtgnW8bEJiQXymKFf6lxnSDQOv32Fq0Tvtk4f+zoZHxuUeOUu7qgE5OX2mSxwg5YsmbPBLe80bXH5pdjIwVarty86RJiBDQ3jj+KDR1mNCw7go0VmsYFC+u+HvlowiwH+nGbQfoVlvLp90W5xqjDEDL3/5+vG3fiPF5zzeLv7oCgX7SsbnD4u8WbsSMe3jUvrHbJ8lnTuNZVsmHtk37xAA048v7WeuwwYGnD9bdkw07lIxGg0o00QK4xCYXdFlZVJgdsm7K2HJ8MGB9Vf9juFCaHQBX7wMLcCWKoq7rpyA2nrBkd3daw2e6gX0NeQMbUrUl7j8KemH70d0/BnvfmXsWJbLbaN+9edMrd0aknj7tdcUfTyFNTAY9wnNztJ7faDsmBOgV4NIcA+35Zw1l2tPpTXD2rRhmCoZOzlp6RXCR57c/O1q6Xs8B7qzZ9gI1eMG7fB8uxYRjb6+bU4yQ8V2QSS+t0CLKeBjWbJ87E8bpx5eNbPziEeWHDBMdPp92YONteJo2KKQsJEdqIjsvtsbPkACs1yzxdYTfsOLZuEw50Gje+WdDoENF1M+1+HY078WShau2E+Q5pkctOLZmLjRe076oPznYog1Ssx2aQaSoxj5HrjLJbUuH379fcswuubvZW1UynjW6HVCGRiCqQ/i1yg2Ba+5aTdmmBzWsmnsBGEny74c4ObCS4mRWaTCAVc+xkslhhD+POCrus8YpS2rn/qQiGQxtOb8X5XXYyKGEVWanm6pFWw5g75b2LwoZU894puzfI/cCBQ+0fUWNqRYNs6B66ovKo2KWqkqWL/ZOmHG2HS9QNRFcL0+PoGB+PvvtdpRmScQhRxqYif/Axt8bsl3fYN7JDzaK5USzC0BuvHzxtEyLOZGZOv+htOuuHPvvhlE3eR2IHoEiBARuP/uUIdtjgzduXt8lH4cqKyk1yqMGONbqgjOGin4WV102AHUurltvkTXn/cuVSbFRr8N7tS29hy6tx9dsqpau6JWhsoybN4Yv4c1g6u+2qIVVdv/5yqyGnnHXteIuUGHXz65oNlV+cO1l3AeQttTB3Iu4yq/HSF/JBk8m9uviJJnVAxBEwfkxhnXFkvIdxSsz4ZxV2ME5T2Mk4J9IPq6YdOYQLscO8w29upz1VNM9ejA23xl8grODFzkwyR+KQ8oT4wlHVW5da2ftD62TseELjsGQyk4jcLa1++96Luog2rr4ghkDTzZbvdDRXF5ERGT7Z+DmOyD0wbSMWZ0jPQQOfUNhr0R+Fu2hcG7fSBnZfIOaCQZcSI5FpDag8uAuaQc7AAuvSwpnJUz7X5alO3N92GBseqF9w1pSSBDbXANuJ1DcLFE5kbI/p766wzrinwh7GvWLG+xR2MPYr7GQ8ONIPy1eVryTtkQj9VID1K/XEo2JwksJuxl0VNmBsa1U9TrFW01h10Vc23qjdf6AClUZx3qvCu9tkscLxNvIqks1FXT+fdJTsdJQT6gwVY1vbcaBup4ho2Vny/e8sUeGTVsvhkz+GydVWVdUd1eiU9i3Zr0mfvXv+1B2atOXtH2/djg2biz51iI6Jej95TGwVFPDQ7bgD1oZFJ/468gzKXES3ZKSgXIkIFok0he3MyDQZVJmbRTDUtTes1aSXmrF/wXJsOKBmR8V8uSiYcfHSHGwka+wU+HugXUWMwdBcs/Ie4MY0tnuTfZNySj0NvhjWLVGfwZ61eJfCneDw8UNXcRqPQV5IuSQOR1K/US6KCBxdByGawboN6uK8AidXV2wE6RoutrV+hI1OcODOO0uw4YQp5268K9fqWHTnnXfAKs+nWGXc6JId9z+Qm4HVgf++RC1Nd8hqdWHxSOsZQ1bDxkz/o4K2ouCwUBGUuVrGLzi3aey5D6ph18bG2bS+ys8rp8nVwLRNd34vBTPP7P9XSSn2rLj2vFylDFVCdLOOX9VfgOJYNwWNKMqDcc2+iT8Ro6+i74ZoPvQhGJ+j/BR3RR9/EdO3XwzS/IVXJNKXXbzlVJHBmch48S9xEhD/QEeIST19SMXn+WOo4EPFy0RfNlFOdBcDMX2txHkpDcYzpsuEXoE+QeJ7yRfjeuiDIz5H3xtRTqUTECs5nKIh0yc7ECGiRSCS6cC8oNmhCyS6e2q9wQfpmt/2nBaAoQ6q2OE0lI2CqNLJiND70H0C4acyF05LesP9UWQA8SLVp0AkUXkK+4l84/6oAIVXjCgYiBlcxkEjJvYIIo7KFyD+meIUiEFUPcCJ6ebhBqlUgSuiSgX+pbIDiBTyESB+RjUGlDOJEHFEl/E5Lg+DnWIFiAAVANAtU/6PJ08kGd9L2TZgtk3JNmCyTQkziPE65a0gXqe0D8Qb5KZAPEE5HaqS2DXunXI23DPlZHiWlIvhkigVw6VSJgZiBCViuATKwwDzMErDcK+UWqGSyOGC6EV5FE5EaZQ8XCLwwk5JE66dcib8S/4cX0CZEO6Rch3cE6UqIH5FiQoujPIUnJ/SEJyPmAiIJyldwH7KNVBnlGBgP+UXuA5KL/A9lF2gEVD6gBsgZ4rBlPMAEU/8H42TGD5i4vc4jug9iBeIucv1S8aOzxFfx/cRYcAAQVQc30NMHI2IiDjyOCKWIDKJOON4osIoJyKMCiYejH+JBuP7iGmA+EcirSDGAcUCXDjdd9wocVG8hUQ9UU5ME+VENNF4iGdKY5KhCcTzxCNRIUQjAWkksUjcATlqHEisEXdGNBExsUR8gEgiYqKBqBHmeuLXxMHkiUsKJt2HZGB4MkTAUE6MCzVJBAtNjfgVyolQgXiZGBTulHgQRhDy3yDm8f9jAqIHERpcAPEZvH9EZxATmUDTIBKBE1CMwWSWiAAgEaCwiI6GgjyI7hTcQTxDsRsfoOiMuqdYLF8gQ7H8piYjMa6QAjGqkoIqnjnFRxA/oeiIqqXgKG1IxkYcR6ERLxHFJhC/oFCI81IkRNukGAfiOYptuBGKXjKjkbELxDqNQhWqkCIVLpwCFaqO4hRORDEENI1CBo6jiIFyGTAQyniB25LhQqoHAwCI3v8Haysnmw==",
  isZip: 1, // 非必要字段。是否是压缩过。默认协同的文档都是压缩过的。配合 content 一起使用
  indexdbTime: null, // 非必要字段。禁用离线存储时用，一般不用。
  onlyOfficeUrl: ""
});

const userInfo = reactive({
  id: 7249,
  real_name: "胡开屏",
  mail: "hukaiping@360.cn",
  name: "hukaiping"
});

const extensionConfig = ref(mobileConfig);

const noAI = getUrlParameter("ai") === "0" || false;
const noRedo = getUrlParameter("redo") === "0" || false;
const noCodeblock = getUrlParameter("codeblock") === "0" || false;
const noTable = getUrlParameter("table") === "0" || false;
extensionConfig.value.AI.show = !noAI;
extensionConfig.value.redo.show = !noRedo;
extensionConfig.value.codeBlock.show = !noCodeblock;
extensionConfig.value.table.show = !noTable;

function handleTitleChange(val) {
  console.log(val);
}

function handleCreate() {
  handlePostMessage({ type: "editor-create" });
}

const debounceHandleContentChange = debounce(handleContentChange, 200);

function handleContentChange() {
  handlePostMessage({ type: "editor-update" });
}

function handleFocus() {
  handlePostMessage({ type: "editor-focus" });
}

function handleBlur() {
  handlePostMessage({ type: "editor-blur" });
}

function handleAILog(val) {
  handlePostMessage({ type: "editor-ai-log", value: val });
}

function handleNoAIAuth() {
  handlePostMessage({ type: "editor-ai-no-auth" });
}

function handleUploadImage(val) {
  handlePostMessage({ type: "editor-img-upload", value: val });
}

function handlePostMessage(obj) {
  // console.log("handlePostMessage", obj);
  window.parent.postMessage(obj, "*");
}

// 收到消息
function handleReceiveMessage(event) {
  if (event.source === window) return; // 避免处理自己发送的消息

  const payload = event.data;
  // console.log("handleReceiveMessage", payload);
  switch (payload.type) {
    case "insertMarkdown": {
      const content = payload.content;
      geelibEditorRef.value.editor.chain().insertMarkdown(content, true).scrollIntoView().focus().run();

      break;
    }

    case "insertContent": {
      const content = payload.content;
      geelibEditorRef.value.editor.chain().insertContent(content, true).scrollIntoView().focus().run();

      break;
    }

    case "setMarkdown": {
      const content = payload.content;
      geelibEditorRef.value.editor.chain().setMarkdown(content, true).scrollIntoView().focus().run();

      break;
    }

    case "setJson": {
      const content = payload.content;
      geelibEditorRef.value.editor.chain().setContent(content, true).scrollIntoView().focus().run();

      break;
    }

    case "getJson": {
      handlePostMessage({
        type: "editor-return-json",
        json: geelibEditorRef.value.editor.getJSON()
      });

      break;
    }

    case "getHtml": {
      handlePostMessage({
        type: "editor-return-html",
        html: geelibEditorRef.value.editor.getHTML()
      });

      break;
    }

    case "getDoc": {
      handlePostMessage({
        type: "editor-return-data",
        html: geelibEditorRef.value.editor.getHTML(),
        json: geelibEditorRef.value.editor.getJSON()
      });

      break;
    }

    case "setAIAuth": {
      const value = payload.value;
      extensionConfig.value.AI.hasAuth = value;
      extensionConfig.value.AI.show = value;

      break;
    }

    case "toggleMiniDocPopup": {
      const value = payload.value;

      editorStore.$patch({
        miniDocPopupConfig: {
          show: value
        }
      });

      break;
    }
    case "setMiniDocPopupContent": {
      const value = payload.value;

      if (!editorStore.miniDocPopupConfig?.show) return;

      editorStore.$patch({
        miniDocPopupConfig: {
          content: value
        }
      });

      break;
    }

    case "toggleMiniDocPopupToolbar": {
      const value = payload.value;

      if (!editorStore.miniDocPopupConfig?.show) return;

      editorStore.$patch({
        miniDocPopupConfig: {
          showToolbar: value
        }
      });

      break;
    }

    case "setImage": {
      const value = payload.value;
      extensionConfig.value.image.show = value;

      break;
    }

    case "setReadOnly": {
      const value = payload.value;
      readOnly.value = value;

      break;
    }
    case "focus": {
      geelibEditorRef.value.editor.chain().focus().run();

      break;
    }
    case "blur": {
      geelibEditorRef.value.editor.chain().blur().run();

      break;
    }
  }
}

window.addEventListener("message", handleReceiveMessage);
onBeforeUnmount(() => {
  window.removeEventListener("message", handleReceiveMessage);
});

// 开发用假数据
// setTimeout(() => {
//   handleReceiveMessage({
//     data: {
//       type: "setMarkdown",
//       content: "总结：<br><br>主题：本文研究了教师培训对教师生产力的影响，以及如何通过固定效应模型来控制选择偏差。<br><br>要点及解释：<br><br>1. **研究方法**：<br>   - 使用佛罗里达州的州级数据库，估计包含学生、教师和学校固定效应的模型。<br>   - 通过解决教师培训和学生分配的非随机性问题，提高研究的准确性。<br><br>2. **主要发现**：<br>   - 教师培训总体上对生产力影响不大。<br>   - 内容聚焦的专业发展与中学数学生产力正相关。<br>   - 教师经验在小学和中学阅读教学中效果更佳。<br>   - 无证据表明预科教育或教师的学术能力影响其生产力。<br><br>3. **对先前研究的质疑**：<br>   - 以前的研究可能因未充分控制各种选择偏差而产生不准确的结果。<br><br>4. **数据来源**：<br>   - 佛罗里达州教育部门K-20教育数据仓库的工作人员提供了数据支持。<br><br>5. **研究限制**：<br>   - 无法完全控制学生能力的变异。<br>   - 无法获得教师教育和培训与学生成就之间的数据。<br>   - 教师教育和培训的选择问题。<br><br>6. **研究意义**：<br>   - 为提高教师质量提供关键信息。<br>   - 对教育政策制定有重要影响。<br><br>7. **未来研究方向**：<br>   - 研究教师教育和培训如何影响不同学科和学段的生产力。<br>   - 研究教师特征如何影响教师的生产力。".replaceAll("<br>", "\n")
//     }
//   });
// }, 3000);

// const md = `# 《学校多部门协同周工作计划表22》

// | 部门/岗位       | 核心职责聚焦                | 周量化任务                                                                 | 协作对接方       | 验收标准                                                                 |
// |----------------|-----------------------------|--------------------------------------------------------------------------|------------------|--------------------------------------------------------------------------|
// | **德育处**     | 德育体系落地、师德建设      | 1. 完成2个班级德育主题班会教案审核<br>2. 组织1次青年教师师德师风线上培训（参与率≥90%）<br>3. 梳理上周德育问题台账，形成整改清单（完成率≥80%） | 政教处、各年级组 | 教案符合学段德育目标；培训签到记录完整；整改清单明确责任人和时限           |
// | **政教处**     | 学生行为规范、校园秩序管理  | 1. 开展3次校园常规巡查（迟到、着装、课间秩序），问题通报准确率100%<br>2. 处理学生违纪事件≤5起，办结率100%<br>3. 更新1期校园文明宣传展板 | 德育处、楼层领导 | 巡查记录可追溯；违纪处理档案完整；展板内容贴合本周德育主题               |
// | **共青团少先队** | 团员/队员发展、主题活动策划 | 1. 完成10名入团/入队积极分子材料审核<br>2. 策划"学雷锋"主题实践活动方案（含流程、预算）<br>3. 组织1次团/队干部线上例会 | 德育处、各班级   | 材料符合发展标准；活动方案具备可操作性；例会有签到和会议纪要               |
// | **楼层领导**   | 楼层日常管理、问题一线处置  | 1. 每日巡查楼层3次，记录安全/纪律问题≥2条/天<br>2. 跟进上周楼层问题整改，闭环率≥90%<br>3. 对接2个班级班主任，反馈楼层观察到的学生状态 | 政教处、班主任   | 巡查日志每日更新；整改问题有复查记录；班主任反馈沟通有效                   |

// ### 协同说明
// 1. 每日17:00前，各部门将当日工作进展同步至学校工作群，由德育处汇总公示
// 2. 每周五下午召开15分钟协同复盘会，重点协调跨部门未完成任务
// 3. 量化任务未达标部门，需提交书面说明及补改计划，由德育处跟踪督办`;

// setTimeout(() => {
//   handleReceiveMessage({
//     data: {
//       type: "setMarkdown",
//       // content: md.replaceAll("<br>", "\n")
//       content: md
//     }
//   });
// }, 3000);

// setTimeout(() => {
//   handleReceiveMessage({
//     data: {
//       type: "redo",
//       value: false
//     }
//   });
//   console.log(1);
// }, 3000);

// setTimeout(() => {
//   handleReceiveMessage({
//     data: {
//       type: "redo",
//       value: true
//     }
//   });
//   console.log(2);
// }, 6000);

// checkVip();
// function checkVip() {
//   if (typeof window !== "undefined") {
//     $.getScript("//s.ssl.qhimg.com/quc/quc7.js").then(function () {
//       const q = window.QHPass;
//       q.init({ src: "pcw_guibao" });
//       q.getUserInfo(function (u) {
//         const qid = u.qid;

//         const vipQids = [
//           "76396585", "3003826607", // 梁
//           "112418300", // 周
//           "3292508841", // 杨宇
//           "308945222", // 毛飞
//           "410490789", // 吴琼
//           "168403014", // 赵慧
//           "693532598", // 门雪飞
//           "903233880", // 张淑霞
//           "3044473208", // 张夏浪
//           "3257433725", // 荀玮祺
//           "2858311756", // 方志川
//           "2949037014", // 张伟

//           "41066919" // 胡开屏
//         ];
//         const isVip = qid && vipQids.includes(qid);

//         editorStore.$patch({ isVip: isVip });
//       });
//     });
//   }
// }
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}
</style>
