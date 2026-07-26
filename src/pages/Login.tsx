import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const from = (location.state as any)?.from?.pathname || "/admin";

  // Redirect immediately once auth resolves and user is confirmed
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [authLoading, user, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Navigation is handled by the useEffect above once onAuthStateChange fires
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ variant: "destructive", title: "Email Required", description: "Please enter your email to reset password." });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "A password reset link has been sent. If you don't see it, check your spam folder.",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset Link Failed",
        description: error.message || "Unable to send reset link. Please verify your email or contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Full-screen loader while session is being verified (e.g. after page refresh)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/20 animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

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
            <ShieldCheck className="text-rose-gold" size={32} />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight mb-2">
            Admin <span className="text-rose-gradient">Portal</span>
          </h1>
          <p className="text-foreground/50 text-sm font-medium tracking-wide">
            Sign in to access your ministry dashboard
          </p>
        </div>

        {/* Card */}
        <div className="glassmorphic rounded-[2.5rem] p-10 border-white/5 shadow-2xl relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

          <form onSubmit={isResetMode ? handleResetPassword : handleSignIn} className="space-y-6 relative z-10">
            {/* Email */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 ml-4 group-focus-within:text-rose-gold transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors"
                  size={18}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@impacthouse.org"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            {!isResetMode && (
              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-4 pr-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 group-focus-within:text-rose-gold transition-colors">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setIsResetMode(true)}
                    className="text-[10px] font-bold text-rose-gold hover:text-white transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors"
                    size={18}
                  />
                  <input
                    id="login-password"
                    type="password"
                    required={!isResetMode}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-rose-gradient text-midnight font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-rose-gold/20 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase text-xs tracking-widest">{isResetMode ? 'Send Reset Link' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {isResetMode && (
            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => setIsResetMode(false)}
                className="text-xs font-medium text-foreground/50 hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Hint */}
          <p className="mt-8 text-center text-[11px] text-foreground/25 leading-relaxed">
            Access is restricted to authorized personnel only.
            <br />
            Contact your administrator if you need an account.
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

export default Login;
