import { useState } from 'react';
import { 
  Settings, 
  Mail, 
  Lock, 
  Sun, 
  Moon, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function AdminSettings() {
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      toast({ title: "Email Update Sent", description: "Please check your new email for a confirmation link." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Success", description: "Password has been reset successfully." });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <div>
        <h1 className="font-serif text-3xl font-bold">Account <span className="text-rose-gradient">Settings</span></h1>
        <p className="text-foreground/40 text-sm mt-1">Manage your administrative profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Navigation / Overview */}
        <div className="space-y-4">
          <div className="glassmorphic-card p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-rose-gradient p-1 mb-4 shadow-xl">
              <div className="w-full h-full rounded-[1.8rem] bg-background flex items-center justify-center">
                <span className="text-2xl font-serif font-bold text-rose-gold">{profile?.full_name?.charAt(0) || 'A'}</span>
              </div>
            </div>
            <h3 className="font-bold text-lg">{profile?.full_name || 'Admin User'}</h3>
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-6">{profile?.role || 'Admin'}</p>
            <button 
              onClick={() => signOut()}
              className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          <div className="glassmorphic-card p-4 space-y-1">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest transition-all">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} /> Security
              </div>
              <ChevronRight size={14} />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl text-foreground/40 hover:bg-foreground/5 font-bold text-xs uppercase tracking-widest transition-all">
              <div className="flex items-center gap-3">
                <Sun size={16} /> Appearance
              </div>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Email Settings */}
          <section className="glassmorphic-card p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Email Address</h3>
                <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Your primary contact method</p>
              </div>
            </div>

            <form onSubmit={handleUpdateEmail} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email-input" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Current Email</label>
                <div className="relative">
                  <input 
                    id="email-input"
                    type="email" 
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                  <CheckCircle2 size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-primary" />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3.5 bg-foreground/5 border border-foreground/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'Update Email'}
              </button>
            </form>
          </section>

          {/* Security Settings */}
          <section className="glassmorphic-card p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Password & Security</h3>
                <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Secure your account</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </section>

          {/* Appearance Settings */}
          <section className="glassmorphic-card p-8 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Sun size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">Theme & Appearance</h3>
                  <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Customize your workspace</p>
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
