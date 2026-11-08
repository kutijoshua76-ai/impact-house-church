/**
 * PWA & Push Notification Service for RCCG Impact House
 */

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as unknown as { standalone?: boolean }).standalone)
  );
}

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New content is available; please refresh.');
          }
        });
      }
    });

    // Register periodic background sync for daily Bible verse if supported (Chromium PWA)
    if ('periodicSync' in registration) {
      try {
        const periodicSync = (registration as unknown as {
          periodicSync: {
            getTags: () => Promise<string[]>;
            register: (tag: string, options: { minInterval: number }) => Promise<void>;
          };
        }).periodicSync;
        const tags = await periodicSync.getTags();
        if (!tags.includes('daily-bible-verse')) {
          await periodicSync.register('daily-bible-verse', {
            minInterval: 12 * 60 * 60 * 1000, // Check every 12 hours
          });
        }
      } catch {
        // Periodic sync requires PWA installation or browser permission
      }
    }

    console.log('[PWA] Service Worker registered with scope:', registration.scope);
    return registration;
  } catch (err) {
    console.error('[PWA] Service Worker registration failed:', err);
    return null;
  }
}
