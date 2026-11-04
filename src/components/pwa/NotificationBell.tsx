import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Check,
  Smartphone,
  Sparkles,
  Loader2,
  BookOpen,
  Calendar,
  Volume2
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
    sendLocalTestNotification,
    sendDailyVerseTestNotification,
  } = usePushNotifications(user?.id);

  const [isOpen, setIsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [testVerseLoading, setTestVerseLoading] = useState(false);
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

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    setActionLoading(true);
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
    setActionLoading(false);
  };

  const handleTestDailyVerse = async () => {
    setTestVerseLoading(true);
    await sendDailyVerseTestNotification();
    setTestVerseLoading(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Manage real-time notifications"
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

        {/* Status Dot */}
        {isSubscribed && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-gold shadow-[0_0_8px_rgba(226,176,145,0.8)] animate-pulse" />
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0e0b14]/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl z-50 animate-fade-in text-left">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-rose-gold/20 flex items-center justify-center text-rose-gold">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Church Push Alerts</h4>
              <p className="text-[10px] text-foreground/50">Daily scriptures, events &amp; sermons</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Status Indicator */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-foreground/70">Push Status:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  isSubscribed
                    ? 'text-emerald-400'
                    : permission === 'denied'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Check size={12} /> Active
                  </>
                ) : permission === 'denied' ? (
                  'Blocked in Browser'
                ) : (
                  'Not Subscribed'
                )}
              </span>
            </div>

            {permission === 'denied' ? (
              <p className="text-[11px] text-foreground/60 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                Notifications are blocked in your browser settings. To enable, click the lock or settings icon in your browser address bar.
              </p>
            ) : (
              <button
                onClick={handleToggle}
                disabled={actionLoading || loading}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isSubscribed
                    ? 'bg-white/10 text-foreground/80 hover:bg-rose-500/20 hover:text-rose-400'
                    : 'bg-rose-gold text-midnight hover:scale-102 active:scale-98 shadow-[0_0_15px_rgba(226,176,145,0.3)]'
                }`}
              >
                {actionLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isSubscribed ? (
                  <>
                    <BellOff size={14} /> Disable Notifications
                  </>
                ) : (
                  <>
                    <Bell size={14} /> Enable Notifications
                  </>
                )}
              </button>
            )}

            {/* Notification Preferences (When Subscribed) */}
            {isSubscribed && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-gold block">
                  Notification Channels
                </span>

                {/* Daily Bible Verse Toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-rose-gold" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Daily Bible Verse</div>
                      <div className="text-[10px] text-foreground/50">Morning scripture &amp; prayer</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyVerseEnabled}
                    onChange={(e) => toggleDailyVersePreference(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-gold accent-rose-gold cursor-pointer"
                  />
                </div>

                {/* Events & Sermons Indicator */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-foreground">Events &amp; Sermons</div>
                      <div className="text-[10px] text-foreground/50">Live streams &amp; updates</div>
                    </div>
                  </div>
                  <Check size={14} className="text-emerald-400" />
                </div>

                {/* Quick Actions */}
                <div className="pt-1 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleTestDailyVerse}
                    disabled={testVerseLoading}
                    className="py-1.5 px-2 rounded-xl text-[10px] font-bold text-foreground/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1 border border-white/5 truncate"
                  >
                    {testVerseLoading ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Volume2 size={11} className="text-rose-gold" />
                    )}
                    Test Daily Verse
                  </button>

                  <button
                    onClick={() => {
                      sendLocalTestNotification();
                      setIsOpen(false);
                    }}
                    className="py-1.5 px-2 rounded-xl text-[10px] font-bold text-foreground/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1 border border-white/5 truncate"
                  >
                    <Smartphone size={11} className="text-purple-400" />
                    Test Device Alert
                  </button>
                </div>

                {/* Direct link to Daily Verse page */}
                <div className="pt-1 text-center">
                  <Link
                    to="/daily-verse"
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-bold text-rose-gold hover:underline inline-flex items-center gap-1"
                  >
                    Open Today's Bible Reading &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
