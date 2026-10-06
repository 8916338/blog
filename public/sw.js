/**
 * Service Worker - 离线缓存
 */

const CACHE_NAME = 'weibo-template-v1';
const urlsToCache = [
    './index.html',
    './public/css/main.css',
    './public/js/utils.js',
    './public/js/data.js',
    './public/js/markdown.js',
    './public/js/router.js',
    './public/js/components.js',
    './public/js/app.js'
];

// 安装时缓存资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 缓存命中则返回缓存
                if (response) return response;

                // 否则发起网络请求
                return fetch(event.request).then(response => {
                    // 只缓存成功的 GET 请求
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }).catch(() => {
                    // 离线且缓存未命中时返回离线页面
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
