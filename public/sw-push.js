// Service Worker Push & Notification Handler for RCCG Impact House PWA

self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('[SW Push] Push event received with no payload');
    return;
  }

  let payload = {};
  try {
    payload = event.data.json();
  } catch (err) {
    payload = {
      title: 'RCCG Impact House',
      body: event.data.text() || 'New update available!',
    };
  }

  const title = payload.title || 'RCCG Impact House';
  const options = {
    body: payload.body || 'New announcement or event added.',
    icon: payload.icon || '/pwa-192x192.png',
    badge: payload.badge || '/badge-72x72.png',
    image: payload.image || undefined,
    data: {
      url: payload.url || payload.link || '/events',
      timestamp: Date.now(),
      id: payload.id || undefined,
      type: payload.type || 'general',
    },
    vibrate: [100, 50, 100, 50, 150],
    tag: payload.tag || 'impact-house-update',
    renotify: true,
    actions: payload.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      // Also broadcast to any active open client windows
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PUSH_NOTIFICATION_RECEIVED',
            payload: {
              title,
              ...options,
            },
          });
        });
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open
      for (const client of windowClients) {
        if ('focus' in client) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('[SW Push] Notification closed:', event.notification.tag);
});
