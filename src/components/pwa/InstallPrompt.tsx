import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';
import { isStandalone } from '@/lib/pwa';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // If already running in standalone PWA mode, do not show
    if (isStandalone()) {
      return;
    }

    // Check if dismissed recently (within 5 days)
    const dismissedAt = localStorage.getItem('impact_pwa_prompt_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 5) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Delay slightly for smooth initial page presentation
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt on Android/Chrome/Edge
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('impact_pwa_prompt_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating PWA Install Banner */}
      <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl bg-[#0e0b14]/95 backdrop-blur-xl border border-rose-gold/30 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-gold/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleDismiss}
            aria-label="Dismiss app install prompt"
            className="absolute top-4 right-4 p-1.5 rounded-full text-foreground/50 hover:text-foreground hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold/30 to-purple-600/20 border border-rose-gold/40 flex items-center justify-center p-1.5 flex-shrink-0 shadow-lg">
              <img
                src="/pwa-192x192.png"
                alt="Impact House"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="flex-1 pr-6">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1">
                  <Sparkles size={11} /> Official Web App
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-foreground leading-tight">
                Install Impact House
              </h4>
              <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                Add to your home screen for instant updates, real-time event notifications, and fast offline access.
              </p>

              <div className="flex items-center gap-2.5 mt-4">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-gold text-midnight text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(226,176,145,0.3)]"
                >
                  <Download size={14} />
                  Install App
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

      {/* iOS Safari Guided Install Sheet */}
      {showIOSInstructions && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#0e0b14] border border-rose-gold/30 p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-foreground/50 hover:text-foreground"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-rose-gold/30 to-purple-600/20 border border-rose-gold/40 p-2 flex items-center justify-center">
                <img src="/pwa-192x192.png" alt="Impact House" className="w-full h-full object-contain rounded-xl" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Install on iPhone or iPad
              </h3>
              <p className="text-xs text-foreground/70 mt-1">
                Install in 2 simple taps without downloading from the App Store:
              </p>
            </div>

            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-gold/20 flex items-center justify-center text-rose-gold flex-shrink-0">
                  <Share size={15} />
                </div>
                <p className="text-foreground/90">
                  1. Tap the <strong className="text-rose-gold">Share</strong> icon at the bottom of Safari.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-gold/20 flex items-center justify-center text-rose-gold flex-shrink-0">
                  <PlusSquare size={15} />
                </div>
                <p className="text-foreground/90">
                  2. Scroll down and select <strong className="text-rose-gold">Add to Home Screen</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-5 py-3 rounded-xl bg-rose-gold text-midnight font-bold text-xs hover:scale-102 active:scale-98 transition-all"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
