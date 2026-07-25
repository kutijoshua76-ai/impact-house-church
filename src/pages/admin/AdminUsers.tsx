import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Lock,
  X,
  Loader2,
  ChevronDown,
  Crown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

type Role = 'user' | 'admin' | 'super_admin';

interface ManagedUser {
  id: string;
  full_name: string | null;
  email: string;
  role: Role;
  last_sign_in: string | null;
}

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  super_admin: { label: 'Super Admin', icon: Crown,       color: 'text-yellow-400',    bg: 'bg-yellow-400/10' },
  admin:       { label: 'Admin',       icon: ShieldCheck,  color: 'text-rose-400',      bg: 'bg-rose-400/10'   },
  user:        { label: 'User',        icon: User,         color: 'text-foreground/40', bg: 'bg-foreground/5'  },
};

const EDGE_FN = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`;

async function callEdge(action: string, payload: object = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(EDGE_FN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

export default function AdminUsers() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New user form
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'admin' as Role });
  const [creating, setCreating] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { users } = await callEdge('list_users');
      setUsers(users);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to load users', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await callEdge('create_user', form);
      toast({ title: 'User Created', description: `${form.email} can now sign in.` });
      setShowModal(false);
      setForm({ full_name: '', email: '', password: '', role: 'admin' });
      await loadUsers();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Create Failed', description: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId: string, role: Role) => {
    setUpdatingId(userId);
    try {
      await callEdge('update_role', { userId, role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      toast({ title: 'Role Updated', description: 'Access level changed successfully.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`Remove ${email} from the system? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      await callEdge('delete_user', { userId });
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: 'User Removed', description: `${email} has been deleted.` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Super Admin</p>
          <h2 className="font-serif text-3xl font-bold">
            User <span className="text-rose-gradient">Management</span>
          </h2>
          <p className="text-sm text-foreground/40 mt-1">Create and manage dashboard access for your team.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-rose-gradient text-midnight font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-rose-gold/20"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="glassmorphic-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={28} />
            <p className="text-sm text-foreground/40 font-medium">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="mx-auto mb-4 text-foreground/20" size={48} />
            <p className="text-foreground/40 font-medium">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
              <tr className="border-b border-foreground/5">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">User</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Role</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Last Sign In</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === profile?.id;
                const roleCfg = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.user;
                const RoleIcon = roleCfg.icon;
                return (
                  <tr key={u.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors group">
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center font-bold text-sm">
                          {(u.full_name || u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {u.full_name || '—'}
                            {isSelf && <span className="ml-2 text-[9px] bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">You</span>}
                          </p>
                          <p className="text-xs text-foreground/40">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role selector */}
                    <td className="px-6 py-4">
                      {isSelf ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${roleCfg.bg} ${roleCfg.color}`}>
                          <RoleIcon size={12} />
                          {roleCfg.label}
                        </span>
                      ) : (
                        <div className="relative inline-block">
                          <select
                            value={u.role}
                            aria-label="Change user role"
                            disabled={updatingId === u.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                            className={`appearance-none cursor-pointer pr-7 pl-3 py-1.5 rounded-xl text-xs font-bold border-0 outline-none focus:ring-2 focus:ring-rose-gold/20 transition-all ${roleCfg.bg} ${roleCfg.color}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                          {updatingId === u.id
                            ? <Loader2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin" />
                            : <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${roleCfg.color}`} />
                          }
                        </div>
                      )}
                    </td>

                    {/* Last sign in */}
                    <td className="px-6 py-4 text-xs text-foreground/40">
                      {u.last_sign_in
                        ? formatDistanceToNow(new Date(u.last_sign_in), { addSuffix: true })
                        : 'Never'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => handleDelete(u.id, u.email)}
                          disabled={deletingId === u.id}
                          title="Remove user"
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-foreground/20 hover:bg-red-500/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 ml-auto"
                        >
                          {deletingId === u.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                          }
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glassmorphic w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center mb-4">
                <Shield className="text-rose-gold" size={22} />
              </div>
              <h3 className="font-serif text-2xl font-bold">Create New User</h3>
              <p className="text-sm text-foreground/40 mt-1">They can log in immediately with these credentials.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 group-focus-within:text-rose-gold transition-colors ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deacon John"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-gold/40 focus:ring-4 focus:ring-rose-gold/5 transition-all hover:bg-white/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 group-focus-within:text-rose-gold transition-colors ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="user@impacthouse.org"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-gold/40 focus:ring-4 focus:ring-rose-gold/5 transition-all hover:bg-white/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 group-focus-within:text-rose-gold transition-colors ml-1">
                  Temporary Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-rose-gold transition-colors" size={16} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-gold/40 focus:ring-4 focus:ring-rose-gold/5 transition-all hover:bg-white/10"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">
                  Access Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['admin', 'user'] as Role[]).map((r) => {
                    const cfg = ROLE_CONFIG[r];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: r }))}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                          form.role === r
                            ? `${cfg.bg} ${cfg.color} border-current`
                            : 'bg-white/5 border-white/10 text-foreground/40 hover:bg-white/10'
                        }`}
                      >
                        <Icon size={14} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 bg-rose-gradient text-midnight font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100 text-xs uppercase tracking-widest mt-2"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Create User</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
