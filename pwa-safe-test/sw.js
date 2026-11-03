
const CACHE_NAME = 'kadamjay-pwa-safe-v1';

const FILES = [
  './worker-pwa-test.html',
  './manifest-test.webmanifest',
  './pwa-icon-192.png',
  './pwa-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin ||
      !url.pathname.startsWith(
        new URL('./', self.location.href).pathname
      )) return;

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request)
    )
  );
});
