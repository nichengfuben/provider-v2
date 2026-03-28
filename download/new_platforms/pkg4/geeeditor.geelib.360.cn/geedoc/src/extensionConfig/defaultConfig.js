import {
  uploadFromUrlApi,
  uploadFileApi,
  sendMsgApi,
  searchUserAndGroupApi,
  getSpaceMembersApi,
  getDocRemarkListApi,
  addDocRemarkApi,
  replyDocRemarkApi,
  changeDocRemarkStatusApi,
  deleteDocRemarkReplyApi,
  deleteDocRemarkApi,
  getYunPanUserAccessTokenApi,
  getMyArticleApi,
  getTemplateAllListApi,
  getTemplateDetailApi,
  getTemplateTypeListApi,
  getTemplateListApi,
  getKnowledgeNodeInfo,
  checkShareApi
} from "@/api/knowledge";

import { getCookie } from "@/utils/utils.js";
import { encode } from "js-base64";

// todo
// src\coEditor\extensions\aiBlockPopup\AIPopup.vue:
//   75: import { aiChatStreamApi } from "@/api/ai.js";

const isHttps = window.location.protocol.includes("https");
const protocol = isHttps ? "wss" : "ws";

export default {
  // 文档标题
  title: {
    show: true
  },
  // 大纲
  toc: {
    show: true
  },
  // 快捷键说明文档
  shortcutsPannel: {
    show: true
  },
  // 顶部菜单栏
  menubar: {
    fullScreen: false // 全屏，默认关闭
  },
  AI: {
    show: true
  },
  // 模板
  template: {
    show: true,
    useAi: true,
    isRecordCount: false, // 不记录模板使用次数，如模板管理的模板编辑
    /* 模板列表
     * @param { Number } search 搜索关键字,不传默认按最近排序
     * @param { Number } commonCount 普通模版数量
     * @param { Number } aiCount ai模版数量
     * @returns
     * [
          "common": [
              {
                  "id": 79,
                  "templateName": "日报与周报",
                  "templateType": 1,
                  "title": "产品需求评审 PRD",
                  "icon": "📋",
                  "subText": "",
                  "userInput": [], //只有ai模版返回该字段
                  "command": "", //只有ai模版返回该字段
                  "updateName": "李佳峰",
                  "updateUid": 6438,
                  "updateTime": "2024-07-22 12:10:53",
                  "useCount": 1
              }
          ],
          "ai": [
              {
                  "id": 80,
                  "templateName": "文档工具",
                  "templateType": 5,
                  "title": "产品需求评审 PRD",
                  "icon": "📋",
                  "subText": "",
                  "userInput": [],
                  "command": "",
                  "updateName": "李佳峰",
                  "updateUid": 6438,
                  "updateTime": "2024-07-22 12:10:53",
                  "useCount": 1
              }
          ]
      ]
     */
    getTemplateRecentOrSearchListFunc: ({ search, commonCount, aiCount }) =>
      getTemplateAllListApi({ search, commonCount, aiCount }),
    /* 模板详情
     * @param { Number } templateId 模板id
     * @returns
     * {
          "id": 61,
          "templateName": "技术研发",
          "templateType": 4,
          "title": "天气模版",
          "createName": "王柯",
          "createUid": 17005,
          "updateName": "莫晶晶",
          "updateUid": 6699,
          "content": "11",
          "contentHtml", "222",
          "s3Key": "test"
        }
     */
    getTemplateDetailFunc: ({ templateId, docId }) => getTemplateDetailApi({ templateId, docId }),
    /* 模板的所有分类
     * @returns
     * [
        "common": [
            {
                "typeId": 1,
                "typeName": "日报与周报",
                "count": 42
            },
            {
                "typeId": 2,
                "typeName": "会议与项目",
                "count": 16
            },
            {
                "typeId": 3,
                "typeName": "产品与技术",
                "count": 16
            },
            {
                "typeId": 4,
                "typeName": "测试与OKR",
                "count": 4
            }
        ],
        "ai": [
            {
                "typeId": 5,
                "typeName": "文档工具",
                "count": 42
            },
            {
                "typeId": 6,
                "typeName": "分析工具",
                "count": 16
            },
            {
                "typeId": 7,
                "typeName": "管理工具",
                "count": 16
            },
            {
                "typeId": 8,
                "typeName": "开发工具",
                "count": 4
            }
        ]
      ]
     */
    getTemplateTypeListFunc: getTemplateTypeListApi,
    /* 获取模板文档信息
     * @param { String } category  类别(common-普通模板，ai-全局模板) 不传默认普通模板
     * @param { Number } page  页数
     * @param { Number } type  模板类型
     * @param { Number } pageSize  每页大小
     *  @returns
     *{
        "total": 78,
        "list": [
            {
                "id": 79,
                "templateName": "日报与周报",
                "templateType": 1,
                "title": "产品需求评审 PRD",
                "icon": "📋",
                "subText": "",
                "userInput": [], //只有ai模版返回该字段
                "command": "", //只有ai模版返回该字段
                "updateName": "李佳峰",
                "updateUid": 6438,
                "updateTime": "2024-07-22 12:10:53",
                "useCount": 1
            }
        ]
      }
     */
    getTemplateListApiFunc: ({ category, page, pageSize, type }) => getTemplateListApi({ category, page, pageSize, type })
  },
  // iframe 网页组件
  iframe: {
    disableResizeTool: false, // 禁止更改大小
    disableOpen: false // 禁止打开网页
  },
  // 图片组件
  image: {
    disableResizeTool: false, // 禁止更改大小
    customViewFun: undefined, // 自定义图片预览的方法，默认使用内置的图片预览
    singleClickViewPic: false, // 默认是双击图片开启预览，因为存在左右对齐，拖拽等需要点击图片，移动端预览不存在这些问题因此使用单击预览
    /* 检查是否需要转存图片。与uploadFromUrlFunc配合使用
     * @param { String } url 原本图片的src
     * @returns Boolean
     */
    needUpdateSrc: ({ url }) => {
      return url.startsWith("http") && !url.includes("beijing.xstore.qihu.com");
    },
    /* 与needUpdateSrc配合使用，用于转存图片。用户从其他地方粘贴图片到我们文档时，转存到我们服务器上，防止第三方图片地址过期。
     * @param { String } url 原本图片的src
     * @returns {Object} {"downloadUrl":"https:\/\/beijing.xstore.qihu.com\/geelib-base-test\/image_64bf8f809b622.png" }
     */
    uploadFromUrlFunc: ({ url }) => {
      const getImgName = (imgSrc) => {
        // 通过url获取文件名称
        const urlParts = imgSrc.split("/");
        const filename = urlParts[urlParts.length - 1].split("?")[0];
        return filename;
      };

      return uploadFromUrlApi({
        url: url,
        fileName: getImgName(url)
      });
    }
  },
  // 附件组件
  attachment: {
    disableDownload: false, // 禁止下载
    /* 文件上传的方法
     * @param { FormData } file 文件
     * @returns { Object } [{"downloadUrl":"https:\/\/beijing.xstore.qihu.com\/geelib-base-test\/image_64bf8f809b622.png" }]
     */
    uploadFileFunc: uploadFileApi, // 文件上传的方法
    disableOpen: false, // 禁止打开网页预览
    getPreviewFileUrlFun: function (fileSrc) { // 在线预览工具部署地址，移动端需要外网能访问
      // 对fileSrc在线文件地址先解码的原因是，如果url有汉字，需要先进行解码回带汉字的，再base64，再进行url编码
      return "/geedocView/onlinePreview?url=" + encodeURIComponent(encode(decodeURIComponent(fileSrc)));
    }

  },
  // 表格组件
  table: {
    disableStickyScroll: false // 禁止粘滞滚动条
  },
  // @组件
  mention: {
    show: true,
    // 提示文案
    placeholder: "请输入名称或邮箱",
    /**
     * @ 后下拉列表里的可选用户列表
     * @param { String } query 检索文字
     * @param { String } extraParams 注册时传入的额外参数
     * @returns [{ id, label, mail, type }]
     */
    getMentionOptionsFunc: ({ query }, extraParams) => {
      if (query.length === 0) {
        // 如果传参有spaceId，则默认显示空间成员，否则默认直接提示。
        const spaceId = extraParams.spaceId;
        if (!spaceId) {
          return [{ isEmpty: true }];
        }

        const params = {
          spaceId: spaceId
        };
        if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

        return getSpaceMembersApi(params).then((res) => {
          if (res?.length) {
            return res.map(el => ({
              id: el.memberId,
              label: el.memberName,
              mail: el.memberMail,
              type: el.type // ugroup 用户组   user 用户
            }));
          } else {
            return [{ isEmpty: true }];
          }
        });
      } else {
        // 检索可检索全集团的人
        return searchUserAndGroupApi({
          keyWord: query
        }).then((res) => {
          return res.map(el => ({
            id: el.memberId,
            label: el.name,
            mail: el.mail,
            type: el.type
          }));
        });
      }
    },
    // 勾选发消息checkbox的文案
    sendMsgLabel: "同时发送通知",
    /**
     * 用于勾选“发送通知”时，确认@用户后，给IM发消息
     * @param {Object} user 选中项
     * @param {String} docId 文档id
     */
    sendMsgFunc: ({ user, docId }) => {
      const params = {
        channel: "tuitui",
        type: 1,
        docId: docId
      };
      if (user.type === "ugroup") {
        params.groupIds = [user.id];
      } else {
        params.userIds = [user.id];
      }

      return sendMsgApi(params);
    }
  },
  // 云盘组件
  insertYun: {
    show: true,
    /**
     * 云盘的身份认证
     * @returns { Object } { auth_key, client_id, access_token }
     */
    getYunPanUserAccessTokenFunc: getYunPanUserAccessTokenApi,
    disableJumpAndCheck: false // 禁止跳转到云盘并预览附件
  },
  // 流程图组件
  flowChart: {
    show: true,
    fullScreenView: true // 预览流程图时使用全屏模式
  },
  // wiki组件
  knowledgeDoc: {
    show: true,
    /**
     * 可选择的下拉列表的显示项。分页的
     * @param { Number } page 第几页
     * @param { Number } pageSize 每页多少条
     * @param { String } search 检索文字
     * @returns { Object }
     * {
        "count": 123,
        "list": [
            {
                "id": 161231,
                "contentType": "editor",
                "title": "空文档空文档空文档空文档空文档空文档空文档",
                "updateTime": "2024-06-05 15:26:32",
                "createName": "胡开屏",
                "createName": "胡开屏",
                "spaceName": "汇源美味果粒橙112311"
            }
          ]
        }
     */
    getOptionsFunc: getMyArticleApi,
    // 点击文档时，可以跳转到该文档。这是跳转到该文档的方法
    jumpToDoc: (query, customAnchorId) => {
      let openUrl = window.origin + (query.indexOf("docId") > -1 ? `/geelib/knowledge/doc?${query}` : `/geelib/knowledgeShare?${query}`);
      if (customAnchorId) {
        // 锚点有customAnchorId，文档引用没有
        openUrl += `#customAnchorId=${customAnchorId}`;
      }

      window.open(openUrl, "_blank");
    },
    /**
     * 高级检索。当开启时，点击“高级检索”，会emit showAdvancedSearch 事件
     */
    showAdvancedSearch: false,
    customAnchorId: undefined, // 非必要。自定义锚点，只有在iframe模式时使用，因为iframe存在跨域问题获取不到父级url，这里存储customAnchorId
    // 粘贴url时转换成wiki
    // 例如 文档链接：https://geelib.qihoo.net/geelib/knowledge/doc?spaceId=1117&docId=183647
    //      分享链接：https://geelib.qihoo.net/geelib/knowledgeShare?shorturl=8f15841930807555e498fd9c3b
    urlToWikiConfig: {
      disable: false,
      regexConfig: [{
        regex: /^(https?:\/\/[^\s/$.?#].[^\s]*)\/knowledgeShare([^/?#]*)(\?[^#]*)?(#.*)?$/, // 匹配链接的正则表达式
        queryName: "shorturl", // 获取文档信息的url参数
        /**
         * 通过shorturl获取文档信息
         * @param { String } shortUrl 分享生成的代表文档id的字符串
         * @returns { Object }
         * {
              "errno": 2000,
              "errmsg": "Success",
              "data": {
                  "contentType": "editor",
                  "title": "啊飞洒发生发生啊-copy"
              }
          }
        */
        api: checkShareApi,
        apiParamsName: "shortUrl"

      }, {
        regex: /^(https?:\/\/[^\s/$.?#].[^\s]*)\/knowledge\/doc([^/?#]*)(\?[^#]*)?(#.*)?$/, // 匹配链接的正则表达式
        queryName: "docId", // 获取文档信息的url参数
        /**
         * 通过docId获取文档信息
         * @param { Number } docId 文档id
         * @returns { Object }
         * {
              "errno": 2000,
              "errmsg": "Success",
              "data": {
                  "contentType": "editor",
                  "title": "啊飞洒发生发生啊-copy"
              }
          }
        */
        api: getKnowledgeNodeInfo,
        apiParamsName: "docId"
      }]

    }
  },
  // 批注组件
  remark: {
    show: true,
    authIsRead: false, // 批注需要根据不同权限，限制操作
    /**
     * 获取某文档的批注列表
     * @param { Number } docId 文档id
     * @param { String } extraParams 注册时传入的额外参数
     * @returns { Object }
     * {
        "total": 86,
        "list": [
            {
                "id": 1251,
                "refId": "remark-398759989",
                "refContent": "14",
                "refStatus": 0,
                "createTime": "2024-06-07 14:43:42",
                "list": [
                    {
                        "createTime": "2024-06-07 14:43:45",
                        "isEdit": 1,
                        "imageUrls": [],
                        "createMail": "hukaiping@360.cn",
                        "id": 663,
                        "content": "34245435345",
                        "createName": "胡开屏"
                    },
                    {
                        "createTime": "2024-06-07 14:44:06",
                        "isEdit": 0,
                        "imageUrls": [
                            "https://beijing.xstore.qihu.com/geelib-base-test/profile-2user_6662ac32eed21.svg"
                        ],
                        "createMail": "hukaiping@360.cn",
                        "id": 665,
                        "content": "534535",
                        "createName": "胡开屏"
                    }
                ]
            }
        ]
      }
     */
    getDocRemarkListFunc: ({ docId }, extraParams) => {
      const params = { docId: docId, page: 1, pageSize: 100000 };

      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return getDocRemarkListApi(params);
    },
    /**
     * 添加批注
     * @param { Number } docId 文档id
     * @param { Number } refId 标识在文档中对应位置
     * @param { String } refContent 批注内容
     */
    addDocRemarkFunc: (params, extraParams) => {
      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return addDocRemarkApi(params);
    },

    /**
     * 删除批注
     * @param { Number } docId 文档id
     * @param { Number } rid 批注id
     */
    deleteDocRemarkFunc: (params, extraParams) => {
      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return deleteDocRemarkApi(params);
    },
    /**
     * 设置批注为已解决状态
     * @param { Number } docId 文档id
     * @param { Number } rid 批注id
     */
    setDocRemarkCheckFunc: (params, extraParams) => {
      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return changeDocRemarkStatusApi({
        ...params,
        refStatus: 1
      });
    },
    /**
     * 回复批注
     * @param { Number } rid 批注id
     * @param { String } content 回复内容
     * @param { Array } toUsers 回复内容中@的人，需要推送IM消息
     * @param { Array } imageUrls 回复内容中，图片url
     */
    replyDocRemarkFunc: (params, extraParams) => {
      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return replyDocRemarkApi(params);
    },
    /**
     * 删除批注回复
     * @param { Number } docId 文档id
     * @param { Number } rrid 批注回复id
     */
    deleteDocRemarkReplyFunc: (params, extraParams) => {
      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return deleteDocRemarkReplyApi(params);
    },
    /**
     * 重新编辑批注回复
     * @param { Number } rrid 批注回复id
     * @param { String } content 回复内容
     * @param { Array } toUsers 回复内容中@的人，需要推送IM消息
     * @param { Array } imageUrls 回复内容中，图片url
     */
    reEditDocRemarkReplyFunc: (params, extraParams) => {
      if (extraParams.shortUrl) params.shortUrl = extraParams.shortUrl;

      return replyDocRemarkApi(params);
    },
    mentionUserKey: "mail" // mail  id。 批注中，@人时的传参时使用的key。
  },
  // 编辑器debug
  debug: {
    show: true
  },
  // 协同
  collaboration: {
    // 协同后端服务的地址
    backendUrl: `${protocol}://${window.location.host}/synergy/doc`,
    // backendUrl: "ws://10.16.25.135:8084/synergy/doc",
    // backendUrl: "ws://127.0.0.1:1111",
    // 协同时的身份认证信息。不需要身份认证的话，写null
    token: () => getCookie("mailMd5")
  },
  // 动态
  dynamic: {
    show: true,
    noSupport: false // 该模块显示暂不支持
  },
  // 演示模式
  presentationMode: {
    show: true
  }
};
