import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  getPushPermissionState,
  isSubscribedToPush,
  subscribeToPush,
  unsubscribeFromPush,
  listenForForegroundPush,
  syncPendingPushSubscription,
  PushPermissionState,
} from '@/lib/pushManager';
import {
  isDailyVerseNotificationEnabled,
  setDailyVerseNotificationEnabled,
  checkAndTriggerDailyVerseNotification,
} from '@/lib/dailyVerse';
import { toast } from 'sonner';

export function usePushNotifications(userId?: string | null) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<PushPermissionState>('default');
  const [loading, setLoading] = useState(true);
  const [dailyVerseEnabled, setDailyVerseEnabledState] = useState(isDailyVerseNotificationEnabled());

  // Initialize status on mount
  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      const supported = isPushSupported();
      if (!mounted) return;
      setIsSupported(supported);

      if (!supported) {
        setPermission('unsupported');
        setLoading(false);
        return;
      }

      setPermission(getPushPermissionState());
      const subscribed = await isSubscribedToPush();
      if (mounted) {
        setIsSubscribed(subscribed);
        setDailyVerseEnabledState(isDailyVerseNotificationEnabled());
        setLoading(false);

        // If user is already subscribed and granted, sync to Supabase and perform daily verse check
        if (subscribed && Notification.permission === 'granted') {
          syncPendingPushSubscription(userId).catch(() => {});
          checkAndTriggerDailyVerseNotification(false).catch(() => {});
        }
      }
    }

    checkStatus();

    // Auto-sync pending push subscriptions whenever network recovers
    const handleOnline = () => {
      syncPendingPushSubscription(userId).catch(() => {});
    };
    window.addEventListener('online', handleOnline);

    // Setup foreground push listener: pops an in-app toast notification
    const unsubscribeForeground = listenForForegroundPush((payload) => {
      toast(payload.title, {
        description: payload.body || 'New announcement available.',
        action: payload.url
          ? {
              label: 'View',
              onClick: () => {
                window.location.href = payload.url!;
              },
            }
          : undefined,
        duration: 8000,
      });
    });

    return () => {
      mounted = false;
      window.removeEventListener('online', handleOnline);
      unsubscribeForeground();
    };
  }, [userId]);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);
    const result = await subscribeToPush(userId);
    setLoading(false);

    if (result.success) {
      setIsSubscribed(true);
      setPermission('granted');
      setDailyVerseNotificationEnabled(true);
      setDailyVerseEnabledState(true);
      toast.success('Push notifications enabled!', {
        description: 'You will receive daily Bible verses, sermon updates, and church alerts.',
      });

      // Deliver today's verse preview
      setTimeout(() => {
        checkAndTriggerDailyVerseNotification(false).catch(() => {});
      }, 1000);

      return true;
    } else {
      toast.error('Could not enable notifications', {
        description: result.error,
      });
      return false;
    }
  }, [userId]);

  const handleUnsubscribe = useCallback(async () => {
    setLoading(true);
    const result = await unsubscribeFromPush();
    setLoading(false);

    if (result.success) {
      setIsSubscribed(false);
      toast.info('Notifications disabled', {
        description: 'You will no longer receive push alerts on this device.',
      });
      return true;
    } else {
      toast.error('Failed to unsubscribe', {
        description: result.error,
      });
      return false;
    }
  }, []);

  const toggleDailyVersePreference = useCallback((enabled: boolean) => {
    setDailyVerseNotificationEnabled(enabled);
    setDailyVerseEnabledState(enabled);
    if (enabled) {
      toast.success('Daily Bible Verse alerts enabled');
      if (Notification.permission === 'granted') {
        checkAndTriggerDailyVerseNotification(false).catch(() => {});
      }
    } else {
      toast.info('Daily Bible Verse alerts paused');
    }
  }, []);

  const sendLocalTestNotification = useCallback(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      toast.error('Please allow notifications first.');
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification('RCCG Impact House', {
          body: 'Test notification from Impact House PWA! Real-time alerts are functional.',
          icon: '/pwa-192x192.png',
          badge: '/badge-72x72.png',
          data: { url: '/events' },
          vibrate: [100, 50, 100],
        });
      });
    }
  }, []);

  const sendDailyVerseTestNotification = useCallback(async () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      toast.error('Please enable notifications first.');
      return;
    }

    const success = await checkAndTriggerDailyVerseNotification(true);
    if (success) {
      toast.success("Today's Bible Verse notification dispatched!");
    } else {
      toast.error('Could not dispatch daily verse notification.');
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    dailyVerseEnabled,
    toggleDailyVersePreference,
    subscribe: handleSubscribe,
    unsubscribe: handleUnsubscribe,
    sendLocalTestNotification,
    sendDailyVerseTestNotification,
  };
}
