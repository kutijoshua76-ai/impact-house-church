const CACHE_NAME = 'impact-house-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/maskable-icon-512x512.png',
  '/badge-72x72.png',
  '/apple-touch-icon-180x180.png',
];

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for page navigations, Cache-first for images/fonts
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension/supabase API mutations
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle HTML navigation: Network-first falling back to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for static icons and assets
  if (
    url.pathname.startsWith('/pwa-') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: Stale-while-revalidate for JS/CSS chunks
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

/* ==========================================================================
   PUSH NOTIFICATIONS LISTENER
   ========================================================================== */
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = {
        title: 'RCCG Impact House',
        body: event.data.text() || 'New update from Impact House',
      };
    }
  } else {
    data = {
      title: 'RCCG Impact House',
      body: 'New event or gallery update posted!',
    };
  }

  const title = data.title || 'RCCG Impact House';
  const targetUrl = data.url || data.link || '/events';

  const options = {
    body: data.body || 'Tap to view latest updates and moments.',
    icon: data.icon || '/pwa-192x192.png',
    badge: data.badge || '/badge-72x72.png',
    image: data.image || undefined,
    data: {
      url: targetUrl,
      timestamp: Date.now(),
      type: data.type || 'announcement',
    },
    vibrate: [150, 60, 150, 60, 200],
    tag: data.tag || `impact-house-${Date.now()}`,
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'View Update' },
      { action: 'dismiss', title: 'Close' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      // Broadcast to any active open browser tabs
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PUSH_NOTIFICATION_RECEIVED',
            payload: { title, ...options },
          });
        });
      });
    })
  );
});

/* ==========================================================================
   NOTIFICATION CLICK ROUTING
   ========================================================================== */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const rawUrl = event.notification.data?.url || '/events';
  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `${self.location.origin}${rawUrl}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // If external link (e.g. Google Drive folder), open new window directly
      if (rawUrl.startsWith('http') && !rawUrl.includes(self.location.hostname)) {
        if (self.clients.openWindow) {
          return self.clients.openWindow(rawUrl);
        }
        return;
      }

      // Check if an existing Impact House tab is open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      // If no tab is open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
