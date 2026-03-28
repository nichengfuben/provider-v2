const CACHE_NAME = 'wxb-sw-cache-v1';
const CACHE_HEADER_NAME = 'x-sw-cache-time';
const CACHE_ACCESS_HEADER_NAME = 'x-sw-access-time';
const CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 1个月缓存
const LRU_LIMIT_RATIO = 0.8; // LRU清理阈值
const cacheWhiteList = [
  'https://wy-static.wenxiaobai.com/wenxiaobai-web/',
  'https://wy-static.wenxiaobai.com/bot-capability/',
];

const cacheBlackList = [
  'https://wy-static.wenxiaobai.com/wenxiaobai-web/web-image/payment/',
];

const LRU_CLEANUP_COUNT = 10; // LRU清理的条目数

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data === 'sw_cache_check') {
    performCacheCleanup();
  }
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function isImageRequest(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
}

// 判断是否为需要缓存的图片，目前只缓存chat中特定的图片
function isInWhiteUrlList(url) {
  const isWhiteUrlList = cacheWhiteList.some((whiteUrl) =>
    url.startsWith(whiteUrl)
  );

  const isInBlackUrlList = cacheBlackList.some((blackUrl) =>
    url.startsWith(blackUrl)
  );

  return !isInBlackUrlList && isWhiteUrlList;
}

function isExternalLink(url) {
  return url.startsWith('http') && !url.includes(location.origin);
}

self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // 只拦截图片并且在白名单中的请求
  if (!isImageRequest(requestUrl) || !isInWhiteUrlList(requestUrl)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const request = event.request;
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        // 检查缓存是否过期
        const cacheTime = cachedResponse.headers.get(CACHE_HEADER_NAME);
        if (cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          if (age < CACHE_MAX_AGE) {
            return updateAccessTime(cache, request, cachedResponse);
          }
        }
      }

      let responseToCache = null;

      try {
        // 为外部图片添加跨域处理
        const fetchOptions = isExternalLink(requestUrl)
          ? { mode: 'cors', credentials: 'omit' }
          : {};

        const response = await fetch(event.request, fetchOptions);

        if (response.ok) {
          // 克隆响应用于缓存
          responseToCache = response.clone();

          // 添加缓存时间戳
          const headers = new Headers(responseToCache.headers);
          headers.set(CACHE_HEADER_NAME, Date.now().toString());

          const cachedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers,
          });

          // 异步更新存储到缓存
          cache.put(event.request, cachedResponse);

          return response;
        } else {
          // 网络请求失败，如果有旧缓存就返回旧缓存
          if (cachedResponse) {
            console.error('网络失败，返回过期缓存:', requestUrl);
            return cachedResponse;
          }
          throw new Error(`Network response not ok: ${response.status}`);
        }
      } catch (e) {
        console.error('图片加载失败:', requestUrl, e);

        if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
          performCacheCleanup(true);
        }

        if (responseToCache) {
          return responseToCache;
        }

        if (cachedResponse) {
          return cachedResponse;
        }

        return new Response(JSON.stringify({ error: 'Image loading failed' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    })
  );
});
async function updateAccessTime(cache, request, response) {
  try {
    const headers = new Headers(response.headers);
    headers.set(CACHE_ACCESS_HEADER_NAME, Date.now().toString());

    const updatedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });

    // 异步更新存储到缓存
    cache.put(request, updatedResponse.clone());
    return updatedResponse;
  } catch (error) {
    console.error('更新访问时间失败:', error);
    return response;
  }
}

// LRU和过期缓存清理
async function performCacheCleanup(isLRU = false) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();

    // 按访问时间排序（最近最少使用的在前）
    const requestsWithTime = await Promise.all(
      requests.map(async (request) => {
        const response = await cache.match(request);
        const cacheTime = response.headers.get(CACHE_HEADER_NAME);
        const accessTime =
          response.headers.get(CACHE_ACCESS_HEADER_NAME) || cacheTime;

        return {
          request,
          expired: Date.now() - parseInt(cacheTime) > CACHE_MAX_AGE,
          time: parseInt(accessTime) || 0,
          url: request.url,
        };
      })
    );

    for (const item of requestsWithTime) {
      if (item.expired) {
        await cache.delete(item.request);
        console.log('[Service Worker]清理过期缓存:', item.url);
      }
    }
    let cacheStorageUseInfo = { usage: 0, quota: 1 };
    let startLRUCleanup = isLRU;

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      cacheStorageUseInfo = await navigator.storage.estimate();
    }

    if (
      !startLRUCleanup &&
      cacheStorageUseInfo.quota &&
      cacheStorageUseInfo.usage
    ) {
      const usageRatio = cacheStorageUseInfo.usage / cacheStorageUseInfo.quota;
      if (usageRatio > LRU_LIMIT_RATIO) {
        startLRUCleanup = true;
      }
    }
    if (startLRUCleanup) {
      // LRU清理
      requestsWithTime.sort((a, b) => a.time - b.time);
      const toDelete = requestsWithTime
        .filter((item) => !item.expired)
        .slice(0, LRU_CLEANUP_COUNT);
      for (const item of toDelete) {
        console.log('[Service Worker]清理LRU缓存:', item.url);
        await cache.delete(item.request);
      }
    }
  } catch (error) {
    console.error('[Service Worker]清理失败:', error);
  }
}
