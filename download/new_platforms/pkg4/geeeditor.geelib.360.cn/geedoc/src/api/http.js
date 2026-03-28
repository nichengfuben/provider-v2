import axios from "axios";
import { ElMessage } from "element-plus";

const http = {
  get: (url, params, config = {}) => {
    return axios.get(url, { params }, config).then(response => checkResponse(response, config));
  },
  post: (url, params, config = {}) => {
    return axios.post(url, params, config).then(response => checkResponse(response, config));
  },
  put(url, params, config) {
    return axios.put(url, params, (config = {})).then(response => checkResponse(response, config));
  },
  delete: (url, config = {}) => {
    return axios.delete(url, config).then(response => checkResponse(response, config));
  },
  patch(url, params = {}, config = {}) {
    return axios.patch(url, params, config).then(response => checkResponse(response, config));
  }
};

// 数据正常返回
export const NETWORK_SUCCESS_CODE = 2000;

function checkResponse(response, config) {
  return new Promise((resolve, reject) => {
    const status = response.status;
    if (status === 200) { // 请求成功
      const errno = response.data.errno;

      const allResponse = !!config?.allResponse;
      const needErrno = !!config?.needErrno;
      if (allResponse) { // 如果config有allResponse且为真值，则直接直接返回 response，以便业务代码自行编写对应的处理
        resolve(response);
      } else if (needErrno) { // 如果config有needErrno且为真值，则直接直接返回 response.data，以便业务代码中通过 errno 自行编写对应的处理
        resolve(response.data);
      } else if (errno === NETWORK_SUCCESS_CODE) { // 数据正常返回
        resolve(response.data.data);
      } else {
        ElMessage.error(response.data.errmsg);
        reject(response.errmsg);
      }
    } else {
      ElMessage.error("未知错误，请重试");
      reject(response.errmsg);
    }
  });
}

export default http;
