import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Check,
  Sparkles,
  Loader2,
  BookOpen,
  X,
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { user } = useAuth();
  const {
    isSupported,
    isSubscribed,
    permission,
    loading,
    dailyVerseEnabled,
    toggleDailyVersePreference,
    subscribe,
    unsubscribe,
  } = usePushNotifications(user?.id);

  const [isOpen, setIsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent background scrolling on mobile when modal is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    setActionLoading(true);
    if (isSubscribed) {
      await unsubscribe();
    } else {
      const success = await subscribe();
      if (success) {
        // Auto-close on mobile after successful activation
        setTimeout(() => setIsOpen(false), 1200);
      }
    }
    setActionLoading(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Manage notifications"
        aria-expanded={isOpen}
        className={`relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
          isSubscribed
            ? 'text-rose-gold bg-rose-gold/10 hover:bg-rose-gold/20'
            : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
        }`}
      >
        {isSubscribed ? (
          <BellRing size={19} className="transition-transform group-hover:scale-110" />
        ) : (
          <Bell size={19} className="transition-transform group-hover:scale-110" />
        )}

        {/* Pulsing indicator badge when subscribed */}
        {isSubscribed && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-gold shadow-[0_0_8px_rgba(226,176,145,0.8)] animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile Backdrop (iOS & Android) */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 sm:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Responsive Modal Card (Centered on mobile, absolute anchored on desktop) */}
          <div className="fixed left-4 right-4 top-24 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-3 sm:w-80 z-50 max-w-sm mx-auto rounded-3xl bg-[#0e0b14]/98 backdrop-blur-2xl border border-rose-gold/30 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.85)] animate-slide-up sm:animate-fade-in text-left">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-gold/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isSubscribed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-gold/20 text-rose-gold border border-rose-gold/30'
                  }`}
                >
                  {isSubscribed ? <Check size={18} /> : <Sparkles size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-tight">
                    {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
                  </h4>
                  <p className="text-[11px] text-foreground/50">
                    {isSubscribed ? 'Active on this device' : 'RCCG Impact House'}
                  </p>
                </div>
              </div>

              {/* Close Button for Mobile & Desktop */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close notification menu"
                className="p-1.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-white/10 active:scale-95 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-3.5">
              {permission === 'denied' ? (
                <div className="text-[11px] text-foreground/75 leading-relaxed bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20 space-y-1">
                  <p className="font-bold text-rose-300">Notifications are blocked</p>
                  <p className="text-foreground/70">
                    Permissions were blocked in your browser settings. To receive daily verses and alerts, tap the lock or site settings icon in your browser address bar and allow notifications.
                  </p>
                </div>
              ) : !isSubscribed ? (
                <>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    Get the Daily Bible Verse, prayer reflections, and real-time church alerts delivered directly to your screen every day.
                  </p>

                  <button
                    onClick={handleToggle}
                    disabled={actionLoading || loading}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-rose-gold text-midnight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(226,176,145,0.35)] disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Enabling...
                      </>
                    ) : (
                      <>
                        <Bell size={15} /> Enable Notifications
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Daily Verse Preference */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.04] border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <BookOpen size={16} className="text-rose-gold" />
                      <div>
                        <div className="text-xs font-semibold text-foreground">Daily Bible Verse</div>
                        <div className="text-[10px] text-foreground/50">Morning scripture &amp; prayer</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dailyVerseEnabled}
                        onChange={(e) => toggleDailyVersePreference(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-gold" />
                    </label>
                  </div>

                  {/* Read Today's Scripture link */}
                  <div className="pt-0.5">
                    <Link
                      to="/daily-verse"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-rose-gold bg-rose-gold/10 hover:bg-rose-gold/20 flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <BookOpen size={13} /> Open Today's Scripture Reading &rarr;
                    </Link>
                  </div>

                  {/* Turn off */}
                  <div className="pt-1 text-center">
                    <button
                      onClick={handleToggle}
                      disabled={actionLoading}
                      className="text-[11px] text-foreground/40 hover:text-rose-400 hover:underline transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      {actionLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <BellOff size={12} />
                      )}
                      Disable notifications on this device
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
