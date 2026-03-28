try {
    // IE浏览器检测（不支持）
    const ua = window.navigator.userAgent;
    const isIE = /MSIE|Trident/.test(ua);

    // 旧版Edge检测 (非Chromium版，不支持)
    const isOldEdge = /Edge\/\d./i.test(ua) && !/Edg/i.test(ua);

    // UC浏览器检测（不推荐）
    const isUC = /UCBrowser/.test(ua);

    // 检测Chrome版本（最低支持96+）
    const chromeMatch = ua.match(/Chrome\/(\d+)/);
    const chromeVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : 999;

    // 检测Firefox版本（最低支持80+）
    const firefoxMatch = ua.match(/Firefox\/(\d+)/);
    const firefoxVersion = firefoxMatch ? parseInt(firefoxMatch[1], 10) : 999;

    // 检测Safari版本（最低支持14+）
    // 排除安卓WebView，只检测真正的Safari浏览器
    const isRealSafari = /^((?!Chrome|Android).)*Safari/.test(ua);
    const safariMatch = isRealSafari
        ? ua.match(/Version\/(\d+).*Safari/)
        : null;
    const safariVersion = safariMatch ? parseInt(safariMatch[1], 10) : 999;

    // 检测QQ浏览器（最低支持13+）
    const qqBrowserMatch = ua.match(/QQBrowser\/(\d+)/);
    const qqBrowserVersion = qqBrowserMatch
        ? parseInt(qqBrowserMatch[1], 10)
        : 999;

    // 判断不兼容的浏览器条件
    console.log("id:", {
        isIE,
        isOldEdge,
        isUC,
        chromeVersion,
        firefoxVersion,
        safariVersion,
        qqBrowserMatch,
    });
    const compatible = !(
        isIE ||
        isOldEdge ||
        isUC ||
        chromeVersion < 96 ||
        firefoxVersion < 80 ||
        safariVersion < 14 ||
        (qqBrowserMatch && qqBrowserVersion < 13)
    );

    // 如果浏览器不兼容，跳转到兼容性提示页面
    // if (!compatible) {
    //     window.location.href = "/browser-compatibility.html";
    // }
} catch (e) {
    // 出错时的兜底，记录错误并跳转到兼容性页面
    console.error("浏览器检测失败:", e);
    // window.location.href = "/browser-compatibility.html";
}
