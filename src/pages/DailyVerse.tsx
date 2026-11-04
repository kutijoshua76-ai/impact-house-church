import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundWatermark from '@/components/BackgroundWatermark';
import { SEO } from '@/components/SEO';
import {
  BibleVerseItem,
  getTodayVerse,
  CURATED_VERSES,
  checkAndTriggerDailyVerseNotification,
  isDailyVerseNotificationEnabled,
  setDailyVerseNotificationEnabled
} from '@/lib/dailyVerse';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Bell,
  BellRing,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Calendar,
  Send,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function DailyVerse() {
  const { user } = useAuth();
  const { isSubscribed, permission, subscribe } = usePushNotifications(user?.id);

  const [currentVerse, setCurrentVerse] = useState<BibleVerseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verseIndex, setVerseIndex] = useState(0);
  const [dailyNotifEnabled, setDailyNotifEnabled] = useState(isDailyVerseNotificationEnabled());
  const [triggeringNotif, setTriggeringNotif] = useState(false);

  useEffect(() => {
    async function loadVerse() {
      setLoading(true);
      const verse = await getTodayVerse();
      setCurrentVerse(verse);
      const idx = CURATED_VERSES.findIndex((v) => v.reference === verse.reference);
      setVerseIndex(idx >= 0 ? idx : 0);
      setLoading(false);
    }
    loadVerse();
  }, []);

  // Stop speech if navigating away
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported on this browser.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    if (!currentVerse) return;

    window.speechSynthesis.cancel();
    const textToSpeak = `${currentVerse.reference}. ${currentVerse.text}. Devotional reflection: ${currentVerse.reflection}. Prayer: ${currentVerse.prayer}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!currentVerse) return;
    const shareText = `"${currentVerse.text}" — ${currentVerse.reference} (${currentVerse.translation})\n\nWord for Today: ${currentVerse.reflection}\n\nVia RCCG Impact House PWA`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success('Scripture copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (!currentVerse) return;
    const shareData = {
      title: `Daily Scripture: ${currentVerse.reference}`,
      text: `"${currentVerse.text}" — ${currentVerse.reference}\n\nRead today's word from RCCG Impact House:`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Share cancelled or dismissed
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePreviousVerse = () => {
    const nextIdx = (verseIndex - 1 + CURATED_VERSES.length) % CURATED_VERSES.length;
    setVerseIndex(nextIdx);
    setCurrentVerse(CURATED_VERSES[nextIdx]);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleNextVerse = () => {
    const nextIdx = (verseIndex + 1) % CURATED_VERSES.length;
    setVerseIndex(nextIdx);
    setCurrentVerse(CURATED_VERSES[nextIdx]);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleRandomVerse = () => {
    const randomIdx = Math.floor(Math.random() * CURATED_VERSES.length);
    setVerseIndex(randomIdx);
    setCurrentVerse(CURATED_VERSES[randomIdx]);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleToggleDailyAlerts = async () => {
    if (!isSubscribed) {
      const ok = await subscribe();
      if (ok) {
        setDailyNotifEnabled(true);
        setDailyVerseNotificationEnabled(true);
      }
    } else {
      const nextVal = !dailyNotifEnabled;
      setDailyNotifEnabled(nextVal);
      setDailyVerseNotificationEnabled(nextVal);
      toast.info(nextVal ? 'Daily Verse notifications enabled' : 'Daily Verse notifications paused');
    }
  };

  const handleSendTestNotification = async () => {
    setTriggeringNotif(true);
    const success = await checkAndTriggerDailyVerseNotification(true);
    setTriggeringNotif(false);
    if (success) {
      toast.success("Today's Bible Verse notification sent to your device!");
    } else {
      toast.error('Could not send notification. Please verify notification permissions.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between">
      <SEO
        title="Daily Bible Verse & Devotional | RCCG Impact House"
        description="Daily scripture meditation, devotional word, and morning prayer from RCCG Impact House. Receive daily verse push notifications directly to your phone."
        canonicalUrl="/daily-verse"
      />
      <BackgroundWatermark />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Top Header Badge */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-gold/15 border border-rose-gold/30 text-rose-gold text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(226,176,145,0.2)]">
            <Sparkles size={14} /> Daily Scripture Meditation
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Word for <span className="text-rose-gradient">Today</span>
          </h1>
          <p className="text-foreground/50 text-xs sm:text-sm mt-2 flex items-center justify-center gap-2">
            <Calendar size={14} className="text-rose-gold" />
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>

        {loading || !currentVerse ? (
          <div className="glassmorphic rounded-3xl p-16 flex flex-col items-center justify-center gap-4 text-foreground/50">
            <Loader2 size={36} className="animate-spin text-rose-gold" />
            <p className="text-xs uppercase font-bold tracking-widest">Opening Scripture...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Main Scripture Card */}
            <div className="glassmorphic rounded-3xl p-6 sm:p-10 border border-foreground/10 relative overflow-hidden shadow-2xl">
              {/* Soft ambient background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Tags & Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-foreground/10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-rose-gold/20 text-rose-gold font-bold text-xs tracking-wider border border-rose-gold/30">
                    {currentVerse.theme}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-foreground/5 text-foreground/60 text-xs font-semibold">
                    {currentVerse.translation}
                  </span>
                </div>

                {/* Media & Share Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    title={speaking ? 'Stop Audio' : 'Listen to Scripture'}
                    className={`p-2.5 rounded-xl border transition-all ${
                      speaking
                        ? 'bg-rose-gold text-midnight border-rose-gold animate-pulse'
                        : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground border-foreground/10'
                    }`}
                  >
                    {speaking ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>

                  <button
                    onClick={handleCopy}
                    title="Copy Scripture"
                    className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground border border-foreground/10 transition-all"
                  >
                    {copied ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
                  </button>

                  <button
                    onClick={handleShare}
                    title="Share with friends"
                    className="p-2.5 rounded-xl bg-rose-gold text-midnight hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(226,176,145,0.3)] font-bold text-xs flex items-center gap-1.5"
                  >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {/* The Sacred Scripture Text */}
              <div className="py-2">
                <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground font-medium leading-relaxed sm:leading-loose tracking-wide">
                  "{currentVerse.text}"
                </blockquote>
                <div className="mt-4 text-right">
                  <cite className="font-serif text-base sm:text-lg font-bold text-rose-gold not-italic">
                    — {currentVerse.reference}
                  </cite>
                </div>
              </div>

              {/* Devotional Reflection */}
              <div className="mt-8 pt-6 border-t border-foreground/10 space-y-4">
                <div className="flex items-center gap-2 text-rose-gold text-xs font-bold uppercase tracking-wider">
                  <BookOpen size={16} /> Devotional Reflection
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  {currentVerse.reflection}
                </p>
              </div>

              {/* Morning Prayer */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-rose-gold/10 via-purple-600/10 to-transparent border border-rose-gold/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-gold font-bold text-xs uppercase tracking-wider">
                  <Heart size={14} className="fill-rose-gold" /> Prayer of the Day
                </div>
                <p className="text-foreground/90 italic font-serif text-sm sm:text-base leading-relaxed">
                  "{currentVerse.prayer}"
                </p>
              </div>

              {/* Navigation controls (prev / next / shuffle) */}
              <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center justify-between gap-2">
                <button
                  onClick={handlePreviousVerse}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <button
                  onClick={handleRandomVerse}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground/60 hover:text-rose-gold hover:bg-rose-gold/10 transition-colors"
                >
                  <Shuffle size={14} /> Random Scripture
                </button>

                <button
                  onClick={handleNextVerse}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Daily Verse Notification Opt-in Card */}
            <div className="glassmorphic rounded-3xl p-6 sm:p-8 border border-rose-gold/30 bg-gradient-to-br from-[#120d1c] to-[#0a0710] shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 text-rose-gold text-xs font-bold uppercase tracking-widest">
                    <BellRing size={15} /> Receive Morning Scriptures
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    Start Every Morning in the Word
                  </h3>
                  <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed">
                    Get an uplifting scripture notification delivered straight to your phone or desktop lock screen every morning to strengthen your day.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-shrink-0">
                  <button
                    onClick={handleToggleDailyAlerts}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-gold text-midnight text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(226,176,145,0.3)]"
                  >
                    <Bell size={15} />
                    {!isSubscribed
                      ? 'Enable Daily Alerts'
                      : dailyNotifEnabled
                      ? 'Daily Alerts Active'
                      : 'Turn On Daily Alerts'}
                  </button>

                  {isSubscribed && (
                    <button
                      onClick={handleSendTestNotification}
                      disabled={triggeringNotif}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-foreground/80 transition-all disabled:opacity-50"
                    >
                      {triggeringNotif ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      Test Alert
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

