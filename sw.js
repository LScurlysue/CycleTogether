// sw.js — PeakPhase Service Worker
const CACHE_NAME = 'peakphase-v10';
const ASSETS = [
  './',
  './index.html',
  './script.js',
  './style.css',
  './dailyInsights.js',
  './notifications.js',
  './firebase-config.js',
  './firebase-messaging-sw.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ---------- Install: pre-cache core assets ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

// ---------- Activate: purge old caches ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ---------- Fetch: cache-first for assets, network-first for navigation ----------
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request)
        .then((response) => {
          // Cache fresh responses for offline use
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
      )
  );
});

// ---------- Notification click: open / focus the app, then jump to its tab ----------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tab = (event.notification.data && event.notification.data.tab) || 'today';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus an existing window if one is open, and tell it which tab to show
        for (const client of clientList) {
          if ('focus' in client) {
            client.postMessage({ type: 'notification-click', tab });
            return client.focus();
          }
        }
        // Otherwise open a new tab — pass the target tab via the URL
        return self.clients.openWindow(`./?tab=${tab}`);
      })
  );
});

// ---------- Push (future server-side use) ----------
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { return; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'PeakPhase', {
      body: data.body || '',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: data.tag || 'peakphase',
      actions: data.actions || [],
    })
  );
});
