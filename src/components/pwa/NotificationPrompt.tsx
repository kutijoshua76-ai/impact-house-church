import { useState, useEffect } from 'react';
import { Bell, BellRing, X, Sparkles } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/components/auth/AuthProvider';

export default function NotificationPrompt() {
  const { user } = useAuth();
  const { isSupported, isSubscribed, permission, loading, subscribe } = usePushNotifications(user?.id);
  const [showBanner, setShowBanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only proceed if supported and permission not decided yet
    if (loading || !isSupported || isSubscribed || permission !== 'default') {
      return;
    }

    // Check if dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem('impact_notification_prompt_dismissed');
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (days < 7) {
        return;
      }
    }

    // Delay display slightly so it doesn't collide with initial landing view or install prompt
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [loading, isSupported, isSubscribed, permission]);

  const handleEnable = async () => {
    setIsSubmitting(true);
    const success = await subscribe();
    setIsSubmitting(false);
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('impact_notification_prompt_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 animate-slide-up">
      <div className="relative overflow-hidden rounded-3xl bg-[#0e0b14]/95 backdrop-blur-xl border border-rose-gold/30 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
        {/* Ambient background glow */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-gold/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification prompt"
          className="absolute top-4 right-4 p-1.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold/25 to-purple-600/20 border border-rose-gold/40 flex items-center justify-center flex-shrink-0 text-rose-gold shadow-lg">
            <BellRing size={22} className="animate-bounce" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1">
                <Sparkles size={11} /> Real-time Updates
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-foreground leading-tight">
              Stay Connected
            </h4>
            <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
              Get notified for live Sunday streams, upcoming events, and instant word announcements directly on your device.
            </p>

            <div className="flex items-center gap-2.5 mt-4">
              <button
                onClick={handleEnable}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-gold text-midnight text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(226,176,145,0.3)] disabled:opacity-50"
              >
                <Bell size={14} />
                {isSubmitting ? 'Enabling...' : 'Enable Alerts'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-xl text-xs text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

