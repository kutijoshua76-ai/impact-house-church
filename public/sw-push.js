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
  const origin = self.location.origin;
  const iconUrl = payload.icon ? (payload.icon.startsWith('http') ? payload.icon : `${origin}${payload.icon}`) : `${origin}/pwa-192x192.png`;
  const badgeUrl = payload.badge ? (payload.badge.startsWith('http') ? payload.badge : `${origin}${payload.badge}`) : `${origin}/badge-72x72.png`;
  const imageUrl = payload.image ? (payload.image.startsWith('http') ? payload.image : `${origin}${payload.image}`) : undefined;

  const options = {
    body: payload.body || 'New announcement or event added.',
    icon: iconUrl,
    badge: badgeUrl,
    image: imageUrl,
    data: {
      url: payload.url || payload.link || '/events',
      timestamp: Date.now(),
      id: payload.id || undefined,
      type: payload.type || 'general',
    },
    vibrate: [250, 100, 250, 100, 250],
    tag: payload.tag || `impact-${Date.now()}`,
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
      .catch((err) => {
        console.warn('[SW Push] Primary showNotification failed, using fallback:', err);
        return self.registration.showNotification(title, {
          body: payload.body || 'New update available!',
          icon: `${origin}/pwa-192x192.png`,
          data: { url: payload.url || '/events' },
          tag: `impact-${Date.now()}`,
        });
      })
      .then(() => {
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
