import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, LogOut, Loader2, ArrowUpRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../auth/AuthProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Real-time listener for first_timers
    const subscription = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'first_timers' },
        (payload) => {
          setUnreadCount(prev => prev + 1);
          const newNotif = { type: 'Registration', name: payload.new.full_name, time: new Date() };
          setNotifications(prev => [newNotif, ...prev].slice(0, 5));
          toast({
            title: "New Registration",
            description: `${payload.new.full_name} has registered as a first timer.`,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'testimonies' },
        (payload) => {
          setUnreadCount(prev => prev + 1);
          const newNotif = { type: 'Testimony', name: 'New submission', time: new Date() };
          setNotifications(prev => [newNotif, ...prev].slice(0, 5));
          toast({
            title: "New Testimony",
            description: "A new testimony has been submitted for review.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const [events, firstTimers] = await Promise.all([
        supabase.from('events').select('id, title').ilike('title', `%${query}%`).limit(3),
        supabase.from('first_timers').select('id, full_name').ilike('full_name', `%${query}%`).limit(3),
      ]);

      const results = [
        ...(events.data || []).map(e => ({ ...e, type: 'Event', label: e.title, link: '/admin/events' })),
        ...(firstTimers.data || []).map(f => ({ ...f, type: 'First Timer', label: f.full_name, link: '/admin/first-timers' })),
      ];
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetNotifications = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden text-foreground">
      <Sidebar 
        hasNotifications={unreadCount > 0} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      <main className="flex-1 ml-0 md:ml-64 p-3 sm:p-4 md:p-8 relative overflow-y-auto max-h-screen min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-6 md:mb-12 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button 
              className="md:hidden p-2 -ml-1 rounded-xl hover:bg-foreground/5 text-foreground/70 shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-foreground/40 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] truncate">Impact House Admin</h2>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 lg:gap-6 shrink-0">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all w-48 lg:w-64"
              />
              
              {/* Search Results Dropdown */}
              {(searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 mt-2 w-80 glassmorphic-card p-4 shadow-2xl z-50 animate-slide-up">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-3 px-2">Search Results</p>
                  <div className="space-y-1">
                    {isSearching ? (
                      <div className="flex items-center gap-2 px-2 py-3 text-xs text-foreground/40 italic"><Loader2 className="animate-spin w-3 h-3" /> Searching...</div>
                    ) : searchResults.map((res, i) => (
                      <a key={i} href={res.link} className="flex items-center justify-between p-3 rounded-xl hover:bg-foreground/5 transition-colors group/res">
                        <div>
                          <p className="text-xs font-bold text-foreground group-hover/res:text-primary transition-colors">{res.label}</p>
                          <p className="text-[10px] text-foreground/30">{res.type}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-foreground/20 group-hover/res:text-primary transition-transform group-hover/res:-translate-y-0.5 group-hover/res:translate-x-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>
            
            <div className="relative">
              <button 
                onClick={resetNotifications}
                title="Notifications" 
                className="relative w-12 h-12 glassmorphic rounded-2xl flex items-center justify-center hover:bg-foreground/10 transition-colors"
              >
                <Bell size={20} className="text-foreground/70" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse ring-4 ring-primary/20" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] glassmorphic-card p-5 sm:p-6 shadow-2xl z-50 animate-slide-up border border-primary/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-lg font-bold">Activity Log</h3>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Live</span>
                  </div>
                  <div className="space-y-6">
                    {notifications.length > 0 ? notifications.map((n, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.type === 'Registration' ? 'bg-primary' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-foreground mb-0.5">{n.name}</p>
                          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">{n.type} • Just now</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Bell className="mx-auto text-foreground/10 mb-3" size={32} />
                        <p className="text-xs text-foreground/30 italic">No recent activity detected.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <Link 
                      to="/admin/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
                    >
                      View All Activity
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-foreground/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold truncate max-w-[150px]">{profile?.full_name || 'Super Admin'}</p>
                <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold capitalize">{profile?.role || 'Admin'}</p>
              </div>
              <button 
                onClick={handleSignOut}
                title="Sign Out"
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-yellow-500/20 border border-foreground/10 flex items-center justify-center hover:scale-105 transition-transform shrink-0"
              >
                <LogOut size={18} className="text-primary md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
