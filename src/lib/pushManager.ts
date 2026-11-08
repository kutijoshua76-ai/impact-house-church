import { supabase } from './supabase';
import { urlBase64ToUint8Array, isPushSupported } from './pwa';

export { isPushSupported };

// Default public VAPID key (safe for client-side bundle; public keys are meant to be public)
const DEFAULT_VAPID_PUBLIC_KEY =
  'BKLNXeDdATHKhe1ZPaqlONQqB1fwrsksz7sJIrQfKdmKA1AwNQZ2acmokKFU671KHI5Kq25oN-kMrePC9TspOWI';

export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;

export type PushPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export interface CachedPushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  user_id?: string | null;
  user_agent?: string;
  saved_at: string;
}

/**
 * Checks the current push notification permission status.
 */
export function getPushPermissionState(): PushPermissionState {
  if (!isPushSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Gets the current active PushSubscription if already subscribed on this browser.
 */
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (err) {
    console.error('[PushManager] Error fetching existing subscription:', err);
    return null;
  }
}

/**
 * Determines whether this device is currently subscribed to push notifications.
 */
export async function isSubscribedToPush(): Promise<boolean> {
  const sub = await getExistingSubscription();
  if (sub) return true;
  // Fallback to local storage state
  return localStorage.getItem('impact_push_subscribed') === 'true';
}

/**
 * Helper to convert an ArrayBuffer to a standard Base64 string safely.
 */
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Subscribes the current device to Web Push notifications and registers the token.
 * Resilient design: local subscription and daily verse alerts succeed immediately,
 * while Supabase database sync runs smoothly and auto-retries in the background if the table is still being created.
 */
export async function subscribeToPush(userId?: string | null): Promise<{
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}> {
  if (!isPushSupported()) {
    return {
      success: false,
      error: 'Push notifications are not supported on this browser or device.',
    };
  }

  if (!VAPID_PUBLIC_KEY) {
    return {
      success: false,
      error: 'VAPID public key is not configured in the application.',
    };
  }

  try {
    // 1. Request user notification permission if not yet granted
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        error:
          permission === 'denied'
            ? 'Notification permission was denied. Please enable notifications in your browser site settings.'
            : 'Notification permission was dismissed.',
      };
    }

    // 2. Wait for Service Worker registration
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      return {
        success: false,
        error: 'Service Worker registration is not active.',
      };
    }

    // 3. Subscribe or retrieve existing browser subscription
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }

    // 4. Extract cryptographic keys
    const p256dhKey = subscription.getKey('p256dh');
    const authKey = subscription.getKey('auth');

    if (!p256dhKey || !authKey) {
      return {
        success: false,
        error: 'Unable to extract encryption keys from push subscription.',
      };
    }

    const p256dh = arrayBufferToBase64(p256dhKey);
    const auth = arrayBufferToBase64(authKey);

    // 5. Cache subscription locally so device is marked as active immediately
    const cacheData: CachedPushSubscription = {
      endpoint: subscription.endpoint,
      p256dh,
      auth,
      user_id: userId || null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      saved_at: new Date().toISOString(),
    };

    localStorage.setItem('impact_push_subscribed', 'true');
    localStorage.setItem('impact_push_sub_cache', JSON.stringify(cacheData));

    // 6. Sync to Supabase in the background; if the remote table is missing or offline,
    // queue it for background sync without blocking the user's notification activation.
    try {
      const { error: dbError } = await supabase.from('push_subscriptions').upsert(
        {
          endpoint: subscription.endpoint,
          p256dh,
          auth,
          user_id: userId || null,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );

      if (dbError) {
        console.warn(
          '[PushManager] Supabase push_subscriptions sync deferred (remote table or network pending):',
          dbError.message
        );
        localStorage.setItem('impact_push_sub_pending', 'true');
      } else {
        localStorage.removeItem('impact_push_sub_pending');
      }
    } catch (syncErr) {
      console.warn('[PushManager] Supabase sync deferred for background retry:', syncErr);
      localStorage.setItem('impact_push_sub_pending', 'true');
    }

    return { success: true, subscription };
  } catch (err: unknown) {
    console.error('[PushManager] Subscription failed:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to subscribe to push notifications.',
    };
  }
}

/**
 * Silently syncs any pending local push subscription to Supabase.
 * Triggered on app initialization and when browser regains network connectivity.
 */
export async function syncPendingPushSubscription(userId?: string | null): Promise<void> {
  if (!isPushSupported()) return;

  const cachedStr = localStorage.getItem('impact_push_sub_cache');
  if (!cachedStr) return;

  try {
    const data: CachedPushSubscription = JSON.parse(cachedStr);
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        user_id: userId || data.user_id || null,
        user_agent: data.user_agent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    );

    if (!error) {
      localStorage.removeItem('impact_push_sub_pending');
      console.log('[PushManager] Successfully synced push subscription to Supabase.');
    }
  } catch {
    // Keep pending for next automatic sync
  }
}

/**
 * Unsubscribes the current device from Web Push notifications.
 */
export async function unsubscribeFromPush(): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await getExistingSubscription();
    if (subscription) {
      // Remove from browser PushManager
      await subscription.unsubscribe();

      // Gracefully attempt removal from Supabase if table exists
      try {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
      } catch (err) {
        console.warn('[PushManager] Supabase unsubscribe sync deferred:', err);
      }
    }

    localStorage.removeItem('impact_push_subscribed');
    localStorage.removeItem('impact_push_sub_cache');
    localStorage.removeItem('impact_push_sub_pending');
    return { success: true };
  } catch (err: unknown) {
    console.error('[PushManager] Unsubscribe failed:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to unsubscribe.',
    };
  }
}

/**
 * Listens for push notifications delivered while the application is active in the foreground.
 */
export function listenForForegroundPush(
  callback: (payload: { title: string; body?: string; url?: string; image?: string }) => void
): () => void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type === 'PUSH_NOTIFICATION_RECEIVED') {
      callback(event.data.payload);
    }
  };

  navigator.serviceWorker.addEventListener('message', handler);

  return () => {
    navigator.serviceWorker.removeEventListener('message', handler);
  };
}
