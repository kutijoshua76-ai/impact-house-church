import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Bell, 
  UserPlus, 
  MessageSquareHeart, 
  Clock, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

type ActivityItem = {
  id: string;
  type: 'First Timer' | 'Testimony';
  name: string;
  summary: string;
  created_at: string;
  link: string;
};

export default function AdminNotifications() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();

    // Setup real-time subscriptions
    const subscription = supabase
      .channel('admin-notifications-page')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'first_timers' },
        (payload) => {
          const newActivity: ActivityItem = {
            id: `ft-${payload.new.id}`,
            type: 'First Timer',
            name: payload.new.full_name,
            summary: `Registered at ${payload.new.campus || 'Impact House'}`,
            created_at: payload.new.created_at,
            link: '/admin/first-timers'
          };
          setActivities(prev => [newActivity, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'testimonies' },
        (payload) => {
          const newActivity: ActivityItem = {
            id: `test-${payload.new.id}`,
            type: 'Testimony',
            name: payload.new.full_name,
            summary: 'Submitted a new testimony for review',
            created_at: payload.new.created_at,
            link: '/admin/testimonies'
          };
          setActivities(prev => [newActivity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      
      const [firstTimersRes, testimoniesRes] = await Promise.all([
        supabase
          .from('first_timers')
          .select('id, full_name, campus, created_at')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('testimonies')
          .select('id, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(30)
      ]);

      const firstTimers: ActivityItem[] = (firstTimersRes.data || []).map(item => ({
        id: `ft-${item.id}`,
        type: 'First Timer',
        name: item.full_name,
        summary: `Registered at ${item.campus || 'Impact House'}`,
        created_at: item.created_at,
        link: '/admin/first-timers'
      }));

      const testimonies: ActivityItem[] = (testimoniesRes.data || []).map(item => ({
        id: `test-${item.id}`,
        type: 'Testimony',
        name: item.full_name,
        summary: 'Submitted a new testimony for review',
        created_at: item.created_at,
        link: '/admin/testimonies'
      }));

      const combined = [...firstTimers, ...testimonies].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(combined.slice(0, 50));
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold">Activity <span className="text-rose-gradient">Log</span></h1>
        <p className="text-foreground/40 text-sm">Track all incoming registrations and submissions</p>
      </div>

      <div className="glassmorphic rounded-[2rem] overflow-hidden p-6 md:p-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Loading Activity...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="relative border-l border-foreground/10 ml-4 md:ml-6 space-y-10 py-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-8 md:pl-12 group">
                {/* Timeline dot */}
                <div className={`absolute -left-[18px] top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-background shadow-lg transition-transform group-hover:scale-110
                  ${activity.type === 'First Timer' ? 'bg-primary/20 text-primary border-background' : 'bg-yellow-500/20 text-yellow-500 border-background'}`}
                >
                  {activity.type === 'First Timer' ? (
                    <UserPlus size={16} />
                  ) : (
                    <MessageSquareHeart size={16} />
                  )}
                </div>

                {/* Content Card */}
                <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 hover:bg-foreground/[0.04] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full
                          ${activity.type === 'First Timer' ? 'bg-primary/10 text-primary' : 'bg-yellow-500/10 text-yellow-500'}`}
                        >
                          {activity.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/40">
                          <Clock size={12} />
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-foreground text-lg mb-1">{activity.name}</h3>
                      <p className="text-sm text-foreground/60">{activity.summary}</p>
                    </div>

                    <Link 
                      to={activity.link}
                      className="inline-flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-primary transition-colors mt-2 md:mt-0"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-foreground/20" />
            </div>
            <h3 className="font-serif text-xl font-bold">No Activity Yet</h3>
            <p className="text-foreground/40 text-sm max-w-sm">
              Incoming registrations and testimonies will appear here in chronological order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
