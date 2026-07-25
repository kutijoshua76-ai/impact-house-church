import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  HeartHandshake, 
  Settings, 
  LogOut,
  Bell,
  ShieldCheck,
  Calendar,
  Mail,
  Briefcase,
  Video,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import rccgLogo from '@/assets/rccg-logo.png';
import { useAuth } from '../auth/AuthProvider';

interface SidebarProps {
  hasNotifications?: boolean;
}

export default function Sidebar({ hasNotifications }: SidebarProps) {
  const { isSuperAdmin, signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview',     path: '/admin' },
    { icon: Video,           label: 'Sermons',      path: '/admin/sermons' },
    { icon: Calendar,        label: 'Events',       path: '/admin/events' },
    { icon: Users,           label: 'First Timers', path: '/admin/first-timers' },
    { icon: MessageSquare,   label: 'Testimonies',  path: '/admin/testimonies' },
    { icon: HeartHandshake,  label: 'Donations',    path: '/admin/donations' },
    { icon: Mail,            label: 'Contacts',     path: '/admin/contacts' },
    { icon: Briefcase,       label: 'Workforce',    path: '/admin/workforce' },
    { icon: Bell,            label: 'Notifications',path: '/admin/notifications' },
    // Only visible to super_admin
    ...(isSuperAdmin ? [{ icon: ShieldCheck, label: 'Manage Users', path: '/admin/users' }] : []),
  ];

  return (
    <aside className="w-64 h-screen glassmorphic border-r border-foreground/5 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-white/10">
          <img src={rccgLogo} alt="RCCG Logo" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-base leading-tight">RCCG Impact House</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
              isActive 
                ? "bg-rose-gold/10 text-rose-gold" 
                : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-wide">{item.label}</span>
            {item.label === 'Notifications' && hasNotifications && (
              <span className="ml-auto w-2 h-2 bg-rose-gold rounded-full animate-pulse" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-foreground/5 space-y-2">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
            isActive 
              ? "bg-rose-gold/10 text-rose-gold" 
              : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
          )}
        >
          <Settings size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-gold/70 hover:bg-rose-gold/10 hover:text-rose-gold transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
