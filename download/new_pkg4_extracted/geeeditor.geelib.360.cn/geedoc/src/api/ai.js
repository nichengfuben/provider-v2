import { fetchEventSource } from "@microsoft/fetch-event-source";

const baseUrl = "https://agent.360.cn";
const vipBaseUrl = "https://vip.agent.360.com";
const token = "QoP5DZl0TJ18MfEwWJ1oONQhxiwbM05H";

function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

class RetryError extends Error { }
class NoReTryError extends Error { }
function streamApi(url, { body, onmessageFunc, oncloseFunc, onerrorFunc, signal }) {
  return fetchEventSource(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    signal,
    openWhenHidden: true, // 默认为false。但是这里隐藏时也继续连接
    body: JSON.stringify(body),
    onopen: async (response) => {
      // 如果返回的不是流，则是报错信息
      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("text/event-stream")) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let result = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          result += decoder.decode(value, { stream: true });
        }
        const message = JSON.parse(result).message;
        throw new NoReTryError(message);
      } else if (response.ok) {
        // everything's good
      } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new NoReTryError(response);
      } else {
        throw new RetryError();
      }
    },
    onmessage(msg) {
      const data = msg.data ? safeJsonParse(msg.data) : null;
      if (data) {
        onmessageFunc(data);
      } else if (msg.retry) {
        throw new RetryError(msg.retry);
      }
    },
    onclose() {
      oncloseFunc();
    },
    onerror(err) {
      if (!navigator.onLine) {
        err.message = "网络好像断开了，请检查后重试";
      }
      onerrorFunc(err);
      if (err instanceof NoReTryError) {
        throw new NoReTryError(err); // rethrow to stop the operation
      } else {
        // do nothing to automatically retry. You can also
        // return a specific retry interval here.
        const time = Number(err.message);
        if (time) {
          return time;
        } else {
          throw new NoReTryError(err);
        }
      }
    }
  });
}

// 发送流式对话消息
export function chatMessageStreamApi(params) {
  const { isVip, ...rest } = params;
  const url = isVip ? vipBaseUrl : baseUrl;

  return streamApi(`${url}/api/v2/openapi/chat`, rest);
}

// 发送流式对话消息
export function completionMessageStreamApi(params, appType) {
  // 统一屏蔽
  return Promise.resolve();
  // const apiKey = useAiMap.appMap[appType].apiKey;
  // return streamApi(`${useAiMap.baseUrl.jizhi}/completion-messages`, params, apiKey);
}

// // 停止流式对话
// export function stopChatStreamApi({ task_id, user }, appType) {
//   // 防止因特殊事件不存在task_id导致报错
//   const apiKey = useAiMap.appMap[appType].apiKey;
//   if (task_id) {
//     return http.post(`${useAiMap.baseUrl.jizhi}/chat-messages/${task_id}/stop`, { user }, { needErrno: true, headers: { Authorization: `Bearer ${apiKey}` } });
//   }
// }

// // 运行工作流
// export function workFlowRunStreamApi(params, appType) {
//   const apiKey = useAiMap.appMap[appType].apiKey;
//   return streamApi(`${useAiMap.baseUrl.jizhi}/workflows/run`, params, apiKey);
// }

// 消息反馈
export function messageFeedbacks(params, appType) {
  // 统一屏蔽点赞
  return Promise.resolve();
  // const apiKey = useAiMap.appMap[appType].apiKey;
  // const { message_id, ...rest } = params;
  // return http.post(`${useAiMap.baseUrl.jizhi}/messages/${message_id}/feedbacks`, rest, { needErrno: true, headers: { Authorization: `Bearer ${apiKey}` } });
}

// // 上传文件
// export function filesUpload(params, appType) {
//   const apiKey = useAiMap.appMap[appType].apiKey;
//   return http.post(`${useAiMap.baseUrl.jizhi}/files/upload`, params, { needErrno: true, headers: { Authorization: `Bearer ${apiKey}` } });
// }

// ai统一事件埋点
// 文档链接： https://geelib.qihoo.net/geelib/knowledge/doc?spaceId=2475docId=175977#anchor=134487130

export function aiEventTrackApi({ prompt, evaluate, total_tokens, message_id, created_at, create_user }, appType) {
  // 统一屏蔽ai打点
  return Promise.resolve();
  // const app = useAiMap.appMap[appType];
  // const param = {
  //   app: app.appName,
  //   channel: "geelib",
  //   prompt,
  //   create_user,
  //   message_id,
  //   token: total_tokens || "0",
  //   start_time: created_at ? dayjs.unix(created_at).format("YYYY-MM-DD HH:mm:ss") : "",
  //   response_time: created_at ? dayjs.unix(created_at).format("YYYY-MM-DD HH:mm:ss") : "",
  //   end_time: created_at ? dayjs().format("YYYY-MM-DD HH:mm:ss") : "",
  //   evaluate: evaluate
  // };
  // return http.post(`${useAiMap.baseUrl.eventTrack}/ai/data/v1/data`, param, { needErrno: true, headers: { Authorization: `${app.eventTrackKey}` } });
}
