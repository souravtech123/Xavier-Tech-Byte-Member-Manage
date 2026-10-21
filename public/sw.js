const CACHE_NAME = 'xts-v1';

// Core pages/assets to pre-cache on install
const PRE_CACHE = [
  '/',
  '/login',
  '/admin-login',
];

// Install: pre-cache shell pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API / server actions, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache Next.js internal routes, API routes, or server actions
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    request.method !== 'GET'
  ) {
    return; // let browser handle normally
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache a fresh copy for navigations and static files
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline fallback — serve cached version if available
        return caches.match(request).then((cached) => cached || caches.match('/'));
      })
  );
});
