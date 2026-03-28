import http from "@/api/http";

/**
 * 通过url上传文件
 * @param { String } file_path 上传文件的http路径
 * @param { String } file_name  上传文件的文件名，主要是为了得到文件的扩展名
 */
export function uploadFromUrlApi(params) {
  return http.post("/onlineedit/space/doc/attachment/uploadFromUrl", params);
}

/**
 * 文件上传
 * @param {file}  上传文件，支持多个
 */
export function uploadFileApi(params, config = {}) {
  config.headers = { "Content-Type": "multipart/form-data" };

  return http.post("/onlineedit/space/doc/attachment/upload", params, config);
}

// 知识中心-搜索用户及用户组
export function searchUserAndGroupApi(params) {
  return http.get("/onlineedit/space/user/searchUserAndGroup", params);
}

// 知识管理-获取我的文章列表
export function getMyArticleApi(params) {
  return http.get("/onlineedit/space/doc/getMyArticle", params);
}

// 知识中心-获取空间成员
export function getSpaceMembersApi(params) {
  return http.get("/onlineedit/space/member/getSpaceMembers", params);
}

/**
 * 给IM发送通知消息
 */
export function sendMsgApi(params) {
  return http.post("/onlineedit/space/msg/sendMsg", params);
}

/**
 * 新增模板文档
 * @param { Number } templateType 模板类型
 * @param { String } title  标题
 * @param { String } content  文档内容
 * @param { String } contentHtml  文档内容html格式
 * @param { String } s3Key  封面url
 */
export function createTemplateApi(params) {
  return http.post("/onlineedit/space/doc/template/create", params);
}

/**
 * 更新模板文档
 * @param { Number } templateType 模板类型
 * @param { Number } templateId 模板id
 * @param { String } title  标题
 * @param { String } content  文档内容
 * @param { String } contentHtml  文档内容html格式
 * @param { String } s3Key  封面url
 */
export function updateTemplateApi(params) {
  return http.post("/onlineedit/space/doc/template/update", params);
}

/**
 * 删除模板文档-请求参数(json形式)
 * @param { Number } templateId 模板id
 */
export function delTemplateApi(params) {
  return http.post("/onlineedit/space/doc/template/del", params);
}

/**
 * 获取模板文档信息
 * @param { Number } page  页数
 * @param { Number } type  模板类型
 * @param { Number } pageSize  每页大小
 */
export function getTemplateListApi(params) {
  return http.get("/onlineedit/space/doc/template/getTemplates", params);
}

/**
 * 通过id获取模板文档内容
 * @param { Number } templateId  模板id
 * @param { Number } docId  非必须，如果是使用该模版，将文档id传过来，方便后端进行模板的打点
 */
export function getTemplateDetailApi(params) {
  return http.get("/onlineedit/space/doc/template/getTemplateById", params);
}

// /**
//  * 获取模板分类信息
//  */
// export function getTemplateOptionsApi () {
//   return http.get("/space/Template/getTemplateOptions");
// }

/**
 * 获取模板列表数量信息
 */
export function getTemplateTypeListApi() {
  return http.get("/onlineedit/space/doc/template/getTemplateTypes");
}

/**
 * 全部模版（搜索）
 * @param { String } search  搜索关键字
 * @param { Number } commonCount  普通模版数量
 * @param { Number } aiCount  ai模版数量
 */
export function getTemplateAllListApi(params) {
  return http.get("/onlineedit/space/doc/template/all", params);
}

/**
 * 知识中心-获取批注列表
 * @param { Number } docId  文档id
 * @param { Number } page  第几页
 * @param { Number } pageSize  每页多少条
 */
export function getDocRemarkListApi(params) {
  return http.get("/onlineedit/space/doc/remark/getRemarkList", params);
}

/**
 * 知识中心-添加批注
 * @param { Number } docId  文档id
 * @param { Number } refId
 * @param { String } refContent  内容
 */
export function addDocRemarkApi(params) {
  return http.post("/onlineedit/space/doc/remark/addRemark", params);
}

/**
 * 知识中心-删除批注
 * @param { Number } docId  文档id
 * @param { Number } rid  批注id
 */
export function deleteDocRemarkApi(params) {
  return http.post("/onlineedit/space/doc/remark/delRemark", params);
}

/**
 * 知识中心-批注已解决、重新打开批注（已解决后恢复）
 * @param { Number } docId  文档id
 * @param { Number } rid  批注id
 * @param { Number } refStatus  解决状态
 */
export function changeDocRemarkStatusApi(params) {
  return http.post("/onlineedit/space/doc/remark/resolvedRemark", params);
}

/**
 * 知识中心-回复批注，重新编辑批注回复（没id参数就是创建，有id就是编辑）
 * @param { Number } rid  批注id
 * @param { String } content  内容
 * @param { Array } toUsers  @的人列表
 * @param { Array } imageUrls  图片路径list
 */
export function replyDocRemarkApi(params) {
  return http.post("/onlineedit/space/doc/remark/replyRemark", params);
}

/**
 * 知识中心-删除批注回复
 * @param { Number } docId  文档id
 * @param { Number } rrid  回复id
 */
export function deleteDocRemarkReplyApi(params) {
  return http.post("/onlineedit/space/doc/remark/delReplyRemark", params);
}

/**
 * 获取云盘身份验证token
 * @param { String } doc_id  文档id
 */
export function getYunPanUserAccessTokenApi(params) {
  return http.get("/space/OpenFangCloudMgr/getUserAccessToken", params);
}

/**
 * 获取文档更新列表
 * @param { Number } spaceId    空间id
 * @param { Number } docId      文档id
 * @param { Number } page       页码
 * @param { Number } pageSize   页面大小
 */
export function getDocDynamicListApi(params) {
  return http.get("/onlineedit/space/doc/getDocDynamicList", params, {
    needErrno: true
  });
}

/**
 * 附件（s3链接）下载
 * @param { String } url s3链接
 * @param { String } fileName 文件名称
 */
export function knowledgeDownloadFromUrlApi(params) {
  return http.post("/onlineedit/space/doc/attachment/downloadFromUrl", params, {
    responseType: "blob",
    allResponse: true
  });
}

/**
 * 获取文件基本信息，包含创建时间，状态等
 * @param { Number } spaceId 空间id
 * @param { Number } docId  文档id
 */
export function getKnowledgeNodeInfo({ spaceId, docId }) {
  return http.get("/onlineedit/space/doc/getNodeDetail", {
    spaceId,
    docId
  }, {
    needErrno: true
  });
}

// 知识分享-验证shorturl和密码
export function checkShareApi(params) {
  return http.get("/onlineedit/space/doc/share/checkShare", params, {
    needErrno: true
  });
}
