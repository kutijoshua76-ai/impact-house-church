import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Bell,
  Heart,
  Calendar
} from 'lucide-react';
import {
  BibleVerseItem,
  getTodayVerse,
  isDailyVerseNotificationEnabled,
  checkAndTriggerDailyVerseNotification
} from '@/lib/dailyVerse';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function DailyVerseCard() {
  const { user } = useAuth();
  const { isSubscribed, subscribe } = usePushNotifications(user?.id);
  const [verse, setVerse] = useState<BibleVerseItem | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    getTodayVerse().then(setVerse);
  }, []);

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    if (!verse) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${verse.reference}. ${verse.text}`);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleQuickSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubscribed) {
      const ok = await subscribe();
      if (ok) {
        checkAndTriggerDailyVerseNotification(true).catch(() => {});
      }
    } else {
      toast.success("You're already receiving daily verse push notifications!");
    }
  };

  if (!verse) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl glassmorphic border border-rose-gold/25 p-6 sm:p-10 shadow-2xl bg-gradient-to-br from-[#120c1c]/90 via-[#0a0710]/95 to-midnight/90 group">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-rose-gold/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-gold/15 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-gold/15 border border-rose-gold/30 text-rose-gold text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(226,176,145,0.2)]">
            <Sparkles size={12} /> Today's Scripture Meditation
          </div>
          <div className="text-xs text-foreground/50 flex items-center gap-1.5 pt-1">
            <Calendar size={12} className="text-rose-gold" />
            {format(new Date(), 'EEEE, MMMM do, yyyy')} &bull;{' '}
            <span className="text-rose-gold font-semibold">{verse.theme}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            title={speaking ? 'Stop' : 'Listen'}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              speaking
                ? 'bg-rose-gold text-midnight border-rose-gold animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-white border-white/10'
            }`}
          >
            {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">{speaking ? 'Listening' : 'Listen'}</span>
          </button>

          {!isSubscribed && (
            <button
              onClick={handleQuickSubscribe}
              title="Get daily scripture notifications on your device"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-rose-gold border border-rose-gold/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Bell size={14} />
              <span className="hidden sm:inline">Get Morning Alerts</span>
            </button>
          )}
        </div>
      </div>

      {/* Verse content */}
      <div className="relative z-10 py-6">
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground font-medium leading-relaxed tracking-wide">
          "{verse.text}"
        </blockquote>
        <div className="mt-3 flex items-center justify-between">
          <cite className="font-serif text-base sm:text-lg font-bold text-rose-gold not-italic">
            — {verse.reference} ({verse.translation})
          </cite>

          <Link
            to="/daily-verse"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-gold hover:text-white hover:underline transition-colors"
          >
            Read Reflection &amp; Prayer <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

