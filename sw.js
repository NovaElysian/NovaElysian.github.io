/* sw.js — 通用T显编辑器 Service Worker
 *
 * 设计目标（按优先级）：
 *   1) 回访秒开 —— GitHub Pages 对所有资源只给 Cache-Control: max-age=600，
 *      10 分钟后回访要全部重下。SW 接管后静态资源可长期复用。
 *   2) 真离线 —— 站点自称「完全本地离线」，就应当断网也能用。
 *   3) 绝不把用户锁死在旧版本 —— 因此 HTML 一律 network-first，
 *      只有 URL 带版本指纹(?v=)或本质不可变的资源才 cache-first。
 *
 * 策略表：
 *   导航请求(HTML)   → network-first(3s 超时) → cache → /404.html
 *   /js/ /css/       → cache-first（URL 带 ?v= 版本指纹，改版自动换 key）
 *   /data/fonts/     → cache-first（字形图集不可变；改图需 bump VERSION）
 *   /presets/        → cache-first（预设文本不可变；改文本需 bump VERSION）
 *   同源其他 GET     → stale-while-revalidate
 *   跨源 / 非 GET    → 直接放行
 */

const VERSION = 'v1.8.2';
const CACHE_STATIC = 'tnt-static-' + VERSION;
const CACHE_PAGE = 'tnt-page-' + VERSION;
const KEEP = [CACHE_STATIC, CACHE_PAGE];

/* 断网兜底页（仅在导航请求失败且无缓存时使用） */
const OFFLINE_URL = '404.html';

self.addEventListener('install', (e) => {
  // 不预缓存任何东西：资源此刻已在浏览器缓存里，addAll 会白白重下一遍。
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (KEEP.includes(k) ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

/** 只缓存「成功、同源、basic」的响应，避免把 404/500/跨源不透明响应存下来 */
function cacheable(res) {
  return res && res.status === 200 && res.type === 'basic';
}

async function put(cacheName, req, res) {
  if (!cacheable(res)) return res;
  const cache = await caches.open(cacheName);
  cache.put(req, res.clone());
  return res;
}

/** 带超时的网络优先：网络赢了用网络的，输了/超时了用缓存的 */
function networkFirst(req, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(async () => {
      if (settled) return;
      settled = true;
      const cached = await caches.match(req, { ignoreSearch: false });
      resolve(cached || Response.error());
    }, timeoutMs);

    fetch(req).then(async (res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(await put(CACHE_PAGE, req, res));
    }).catch(async () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve((await caches.match(req)) || Response.error());
    });
  });
}

function cacheFirst(req, cacheName) {
  return (async () => {
    const hit = await caches.match(req, { ignoreSearch: false });
    if (hit) return hit;
    const res = await fetch(req);
    return put(cacheName, req, res);
  })();
}

function staleWhileRevalidate(req, cacheName) {
  return (async () => {
    const hit = await caches.match(req, { ignoreSearch: false });
    const net = fetch(req).then((res) => put(cacheName, req, res)).catch(() => null);
    return hit || (await net) || Response.error();
  })();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // 跨源放行

  // SW 自身不拦截：规范上浏览器取 sw.js 本就不走 fetch 事件，
  // 这里显式放行以防某些实现的差异把 sw.js 缓存住导致无法更新。
  if (url.pathname.endsWith('/sw.js')) return;

  // 带 Range 的请求（音视频等）不参与缓存，避免返回不完整响应
  if (req.headers.has('range')) return;

  // 1) 页面导航：网络优先，保证内容更新总能生效
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const res = await networkFirst(req, 3000);
      if (res && res.status) return res;
      const off = await caches.match(OFFLINE_URL);
      return off || new Response('离线且无缓存', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
    return;
  }

  const p = url.pathname;

  // 2) 脚本 / 样式：带版本指纹，可放心 cache-first
  if (/\.(?:js|css)$/.test(p)) {
    e.respondWith(cacheFirst(req, CACHE_STATIC));
    return;
  }

  // 3) 字形图集 / 预设文本：内容不可变，cache-first
  if (p.includes('/data/fonts/') || p.includes('/presets/')) {
    e.respondWith(cacheFirst(req, CACHE_STATIC));
    return;
  }

  // 4) 其余同源静态资源（图片、manifest、data/*.js 等）：stale-while-revalidate
  e.respondWith(staleWhileRevalidate(req, CACHE_STATIC));
});
