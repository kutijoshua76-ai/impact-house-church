import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Lock, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Supabase sends the recovery token in the URL hash.
  // Listening for PASSWORD_RECOVERY fires once the session is established.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // If no recovery event fires within 5 seconds, the link is invalid/expired
    const timeout = setTimeout(() => {
      setSessionReady((prev) => {
        if (!prev) setInvalidLink(true);
        return prev;
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Too Short", description: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match. Please try again." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password Updated!", description: "Your password has been reset. Redirecting to sign in…" });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Reset Failed", description: err.message || "Could not update password. The link may have expired." });
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!sessionReady && !invalidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/20 animate-pulse">
            Verifying reset link…
          </p>
        </div>
      </div>
    );
  }

  // ── Invalid / expired link ─────────────────────────────────────────────────
  if (invalidLink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <BackgroundWatermark />
        <div className="fixed top-1/4 -left-32 w-96 h-96 bg-rose-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-full max-w-md text-center animate-fade-up relative z-10">
          <div className="glassmorphic rounded-[2.5rem] p-10 border-white/5 shadow-2xl space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-red-500/10 mb-2">
              <ShieldCheck className="text-red-400" size={32} />
            </div>
            <h2 className="font-serif text-2xl font-bold">Link Expired or Invalid</h2>
            <p className="text-sm text-foreground/50 leading-relaxed">
              This password reset link is no longer valid. Reset links expire after a short period for security reasons.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-rose-gradient text-midnight font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-rose-gold/20"
            >
              <span className="uppercase text-xs tracking-widest">Request a New Link</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main reset form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <BackgroundWatermark />

      {/* Ambient glow blobs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-rose-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-rose-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-rose-gold/10 mb-6 group hover:scale-110 transition-transform duration-500">
            <Lock className="text-rose-gold" size={32} />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight mb-2">
            Set New <span className="text-rose-gradient">Password</span>
          </h1>
          <p className="text-foreground/50 text-sm font-medium tracking-wide">
            Choose a strong password for your admin account
          </p>
        </div>

        {/* Card */}
        <div className="glassmorphic rounded-[2.5rem] p-10 border-white/5 shadow-2xl relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

          <form onSubmit={handleReset} className="space-y-6 relative z-10">
            {/* New Password */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 ml-4 group-focus-within:text-rose-gold transition-colors">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors"
                  size={18}
                />
                <input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 ml-4 group-focus-within:text-rose-gold transition-colors">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors"
                  size={18}
                />
                <input
                  id="reset-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Repeat your new password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {/* Strength hint */}
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-red-400 ml-4 animate-fade-up">Passwords don't match</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-[11px] text-emerald-400 ml-4 animate-fade-up">✓ Passwords match</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="reset-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-rose-gradient text-midnight font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-rose-gold/20 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase text-xs tracking-widest">Update Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="mt-8 text-center text-[11px] text-foreground/25 leading-relaxed">
            After updating, you'll be redirected to sign in with your new password.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 animate-fade-up">
          <Sparkles className="text-rose-gold" size={14} />
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-foreground/20">
            RCCG Impact House · Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
