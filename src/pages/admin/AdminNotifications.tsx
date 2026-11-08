import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Bell, 
  UserPlus, 
  MessageSquareHeart, 
  Clock, 
  Loader2,
  ArrowRight,
  Send,
  Smartphone,
  Radio,
  CheckCircle2,
  AlertCircle,
  History,
  Sparkles,
  BookOpen,
  Volume2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { broadcastPushNotification } from '@/lib/pushBroadcast';
import { getTodayVerse, broadcastDailyVerseToAllSubscribers, BibleVerseItem } from '@/lib/dailyVerse';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
import { getExistingSubscription } from '@/lib/pushManager';
import { toast } from 'sonner';

type ActivityItem = {
  id: string;
  type: 'First Timer' | 'Testimony' | 'Workforce';
  name: string;
  summary: string;
  created_at: string;
  link: string;
};

type PushHistoryItem = {
  id: string;
  title: string;
  body: string;
  url: string;
  sent_at: string;
  target_count: number;
  success_count: number;
  failure_count: number;
};

const PUSH_SCHEMA_SQL = `-- 1. Create table for client push subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert into push_subscriptions"
    ON public.push_subscriptions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update push_subscriptions"
    ON public.push_subscriptions FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public select push_subscriptions"
    ON public.push_subscriptions FOR SELECT TO public USING (true);

CREATE POLICY "Allow public delete push_subscriptions"
    ON public.push_subscriptions FOR DELETE TO public USING (true);

-- 2. Create table for Push Notifications Broadcast Log
CREATE TABLE IF NOT EXISTS public.push_notifications_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    url TEXT DEFAULT '/events',
    icon TEXT DEFAULT '/pwa-192x192.png',
    badge TEXT DEFAULT '/badge-72x72.png',
    tag TEXT DEFAULT 'impact-announcement',
    sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    target_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0
);

ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on push_notifications_log"
    ON public.push_notifications_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on push_notifications_log"
    ON public.push_notifications_log FOR INSERT TO authenticated WITH CHECK (true);`;

export default function AdminNotifications() {
  const { user } = useAuth();
  const { isSubscribed, permission, subscribe, sendLocalTestNotification } = usePushNotifications(user?.id);

  const [activeTab, setActiveTab] = useState<'broadcast' | 'activity'>('broadcast');

  // Push Broadcast form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetUrl, setTargetUrl] = useState('/events');
  const [categoryTag, setCategoryTag] = useState('impact-announcement');
  const [todayVerse, setTodayVerse] = useState<BibleVerseItem | null>(null);
  const [broadcastingVerse, setBroadcastingVerse] = useState(false);
  const [sending, setSending] = useState(false);

  // Stats & History
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [refreshingCount, setRefreshingCount] = useState(false);
  const [history, setHistory] = useState<PushHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [tableMissingWarning, setTableMissingWarning] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Activity Log state
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    fetchSubscriberCount();
    fetchPushHistory();
    fetchActivity();
    getTodayVerse().then(setTodayVerse);

    // Setup real-time subscriptions for activity log
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
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'workforce_applications' },
        (payload) => {
          const newActivity: ActivityItem = {
            id: `wf-${payload.new.id}`,
            type: 'Workforce',
            name: payload.new.full_name || 'New Application',
            summary: `Applied to join a unit`,
            created_at: payload.new.created_at,
            link: '/admin/workforce'
          };
          setActivities(prev => [newActivity, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'push_subscriptions' },
        () => {
          fetchSubscriberCount(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchSubscriberCount = async (showToast = false) => {
    if (showToast) setRefreshingCount(true);
    try {
      const { count, error } = await supabase
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('push_subscriptions')) {
          setTableMissingWarning(true);
        }
        if (showToast) {
          toast.error('Could not refresh subscriber count: ' + error.message);
        }
        return;
      }

      setTableMissingWarning(false);
      setSubscriberCount(count || 0);
      if (showToast) {
        toast.success(`Active subscribers refreshed: ${count || 0} device(s) registered`);
      }
    } catch (err) {
      console.warn('Could not fetch subscriber count:', err);
      if (showToast) {
        toast.error('Network error checking subscriber count.');
      }
    } finally {
      if (showToast) {
        setTimeout(() => setRefreshingCount(false), 500);
      }
    }
  };

  const fetchPushHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('push_notifications_log')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setHistory(data);
      }
    } catch (err) {
      console.warn('Could not fetch push history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchActivity = async () => {
    try {
      setLoadingActivity(true);
      
      const [firstTimersRes, testimoniesRes, workforceRes] = await Promise.all([
        supabase
          .from('first_timers')
          .select('id, full_name, campus, created_at')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('testimonies')
          .select('id, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('workforce_applications')
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

      const workforce: ActivityItem[] = (workforceRes.data || []).map(item => ({
        id: `wf-${item.id}`,
        type: 'Workforce',
        name: item.full_name || 'New Application',
        summary: 'Applied to join a unit',
        created_at: item.created_at,
        link: '/admin/workforce'
      }));

      const combined = [...firstTimers, ...testimonies, ...workforce].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(combined.slice(0, 50));
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  
  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(PUSH_SCHEMA_SQL);
      setCopiedSql(true);
      toast.success('SQL migration script copied to clipboard!');
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleBroadcastTodayVerse = async () => {
    if (!todayVerse) return;
    const confirmSend = window.confirm(
      `Broadcast today's scripture (${todayVerse.reference}) to all registered devices now?`
    );
    if (!confirmSend) return;

    setBroadcastingVerse(true);
    const result = await broadcastDailyVerseToAllSubscribers(todayVerse);
    setBroadcastingVerse(false);

    if (result.success) {
      toast.success("Today's scripture broadcast delivered!", {
        description: `Sent to ${result.success_count ?? 0} active device(s).`,
      });
      fetchPushHistory();
    } else {
      toast.error('Failed to broadcast daily verse: ' + (result.error || 'Unknown error'));
    }
  };

  const handleLoadVerseIntoComposer = () => {
    if (!todayVerse) return;
    setTitle(`📖 Scripture for Today: ${todayVerse.reference}`);
    setBody(`"${todayVerse.text}" — Tap to read today's devotional word and prayer.`);
    setTargetUrl('/daily-verse');
    setCategoryTag('impact-daily-verse');
    toast.info("Loaded today's verse into broadcast composer.");
  };

  const handleSendTestToSelf = async () => {
    if (!isSubscribed) {
      toast.info('Subscribing this device first...');
      const success = await subscribe();
      if (!success) return;
    }

    const currentSub = await getExistingSubscription();
    if (!currentSub) {
      sendLocalTestNotification();
      return;
    }

    const testTitle = title.trim() || 'Test: Sunday Service Reminder';
    const testBody = body.trim() || 'Join us this Sunday at RCCG Impact House for an empowering service!';

    setSending(true);
    const result = await broadcastPushNotification({
      title: testTitle,
      body: testBody,
      url: targetUrl || '/events',
      tag: 'test-notification',
      test_endpoint: currentSub.endpoint,
    });
    setSending(false);

    if (result.success) {
      toast.success('Test notification sent to your device!');
    } else {
      // Fallback to local service worker notification if edge function isn't reachable yet
      sendLocalTestNotification();
      toast.info('Local preview triggered (Edge Function status: ' + (result.error || 'fallback') + ')');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('Please enter both a title and message.');
      return;
    }

    if (subscriberCount === 0) {
      const confirmSend = window.confirm(
        'There are currently 0 registered subscriber devices. Would you like to proceed anyway?'
      );
      if (!confirmSend) return;
    }

    setSending(true);
    const result = await broadcastPushNotification({
      title: title.trim(),
      body: body.trim(),
      url: targetUrl.trim() || '/events',
      tag: categoryTag,
    });
    setSending(false);

    if (result.success) {
      toast.success(`Broadcast dispatched!`, {
        description: `Delivered to ${result.success_count ?? 0} active device(s).`,
      });
      setTitle('');
      setBody('');
      fetchSubscriberCount();
      fetchPushHistory();
    } else {
      toast.error('Broadcast failed', {
        description: result.error,
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            Notifications &amp; <span className="text-rose-gradient">Broadcasts</span>
          </h1>
          <p className="text-foreground/50 text-sm">
            Send real-time PWA push notifications to members and monitor system submissions.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-foreground/5 p-1 rounded-2xl border border-foreground/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'broadcast'
                ? 'bg-rose-gold text-midnight shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Radio size={14} />
            Push Broadcast
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'activity'
                ? 'bg-rose-gold text-midnight shadow-md'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Bell size={14} />
            Activity Log
            {activities.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Migration Notice Banner if push_subscriptions table is missing in Supabase */}
      {tableMissingWarning && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm text-amber-300">Supabase Push Schema Not Initialized</p>
              <p className="text-amber-200/80 max-w-2xl">
                The <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300">push_subscriptions</code> table is needed in Supabase to broadcast server alerts to all registered devices.
                Client PWA notifications and daily verses are actively working with local caching!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto flex-shrink-0">
            <button
              onClick={handleCopySql}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold text-xs border border-amber-400/30 transition-all"
            >
              {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}
            </button>
            <a
              href="https://supabase.com/dashboard/project/pdxvybpwtxbbhnyfhjej/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-gold text-midnight font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Open SQL Editor <ExternalLink size={13} />
            </a>
            <button
              onClick={() => fetchSubscriberCount(true)}
              disabled={refreshingCount}
              title="Re-check database"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 border border-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshingCount ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: PUSH BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Active Subscribers */}
            <div className="glassmorphic rounded-2xl p-5 border border-foreground/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-foreground/50">Active Devices</span>
                <Smartphone size={18} className="text-rose-gold" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-foreground">
                  {subscriberCount !== null ? subscriberCount : '—'}
                </span>
                <span className="text-xs text-foreground/40 font-medium">registered PWA endpoints</span>
              </div>
              <button
                onClick={() => fetchSubscriberCount(true)}
                disabled={refreshingCount}
                className="mt-3 text-[11px] font-bold text-rose-gold hover:underline flex items-center gap-1 disabled:opacity-50 transition-all cursor-pointer"
              >
                <RefreshCw size={11} className={refreshingCount ? 'animate-spin text-rose-gold' : ''} />
                {refreshingCount ? 'Refreshing...' : 'Refresh count'}
              </button>
            </div>

            {/* Current Device Status */}
            <div className="glassmorphic rounded-2xl p-5 border border-foreground/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-foreground/50">This Browser</span>
                <Radio size={18} className={isSubscribed ? 'text-emerald-400' : 'text-foreground/40'} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold ${isSubscribed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isSubscribed ? 'Subscribed & Ready' : permission === 'denied' ? 'Permission Denied' : 'Not Subscribed'}
                </span>
              </div>
              <p className="text-[11px] text-foreground/50 mt-1">
                {isSubscribed ? 'You receive live broadcast previews' : 'Subscribe this device to test notifications'}
              </p>
              {!isSubscribed && (
                <button
                  onClick={() => subscribe()}
                  className="mt-3 text-[11px] font-bold text-rose-gold hover:underline"
                >
                  Enable notifications on this browser &rarr;
                </button>
              )}
            </div>

            {/* Platform Delivery */}
            <div className="glassmorphic rounded-2xl p-5 border border-foreground/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-foreground/50">PWA Delivery</span>
                <Sparkles size={18} className="text-purple-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">Web Push Standards</span>
              </div>
              <p className="text-[11px] text-foreground/50 mt-1">
                Supported natively on Android, Windows, macOS Chrome/Edge, and iOS 16.4+ Home Screen PWA.
              </p>
            </div>
          </div>

          {/* Main Broadcast Composer & Device Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 glassmorphic rounded-3xl p-6 md:p-8 border border-foreground/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Compose Broadcast</h3>
                  <p className="text-xs text-foreground/50">Draft an alert to reach all subscribed devices immediately.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendTestToSelf}
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-bold text-foreground/70 transition-all border border-foreground/10"
                >
                  <Smartphone size={13} />
                  Test on My Device
                </button>
              </div>

              
              {/* Daily Bible Verse Quick Broadcast Card */}
              {todayVerse && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-gold/15 via-purple-600/10 to-transparent border border-rose-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1">
                        <BookOpen size={12} /> Today's Scripture: {todayVerse.reference}
                      </span>
                      <span className="text-[10px] text-foreground/40 font-semibold">({todayVerse.theme})</span>
                    </div>
                    <p className="text-xs text-foreground/80 italic font-serif line-clamp-1">
                      "{todayVerse.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleLoadVerseIntoComposer}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-[11px] font-bold text-foreground/70 transition-colors"
                    >
                      Customize
                    </button>
                    <button
                      type="button"
                      onClick={handleBroadcastTodayVerse}
                      disabled={broadcastingVerse}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-gold text-midnight text-[11px] font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(226,176,145,0.3)] disabled:opacity-50"
                    >
                      {broadcastingVerse ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      Broadcast Today's Word
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                    Notification Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunday Service Is Streaming Live! 🕊️"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-foreground/10 text-sm text-foreground focus:outline-none focus:border-rose-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                    Message Body *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Join Pastor today for an uplifting message on walking in divine purpose. Tap to join now."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-foreground/10 text-sm text-foreground focus:outline-none focus:border-rose-gold transition-colors resize-none"
                  />
                  <span className="text-[10px] text-foreground/40 block mt-1">
                    Keep messages concise (under 120 characters) for best readability on mobile lock screens.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                      Target Link / Route
                    </label>
                    <input
                      type="text"
                      placeholder="/events or /sermons"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-foreground/10 text-xs text-foreground focus:outline-none focus:border-rose-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                      Category Tag
                    </label>
                    <select
                      value={categoryTag}
                      onChange={(e) => setCategoryTag(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-foreground/10 text-xs text-foreground focus:outline-none focus:border-rose-gold transition-colors"
                    >
                      <option value="impact-daily-verse">Daily Scripture / Devotional</option>
                      <option value="impact-sermon">Sermon Release / Message</option>
                      <option value="impact-announcement">General Announcement</option>
                      <option value="impact-service">Sunday Service / Live</option>
                      <option value="impact-event">Upcoming Event</option>
                      <option value="impact-urgent">Urgent Notice</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={sending || !title.trim() || !body.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-rose-gold text-midnight font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(226,176,145,0.3)] disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Broadcasting to Devices...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Broadcast Notification
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Mockup Preview Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glassmorphic rounded-3xl p-6 border border-foreground/10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-gold flex items-center gap-1.5 mb-3">
                  <Sparkles size={12} /> Mobile Lockscreen Simulation
                </span>

                {/* Simulated Smartphone Lockscreen Card */}
                <div className="rounded-2xl bg-gradient-to-b from-[#1a1524] to-[#0c0912] p-4 border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-white/50 mb-3 px-1">
                    <span className="font-bold">RCCG IMPACT HOUSE</span>
                    <span>now</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-gold/20 border border-rose-gold/40 flex items-center justify-center p-1.5 flex-shrink-0">
                      <img src="/pwa-192x192.png" alt="App Icon" className="w-full h-full object-contain rounded-lg" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {title.trim() || 'Sunday Service is Live!'}
                      </h4>
                      <p className="text-[11px] text-white/70 line-clamp-3 mt-0.5 leading-snug">
                        {body.trim() || 'Join our live broadcast this morning as we fellowship together in worship and the Word.'}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-gold bg-rose-gold/10 px-2 py-0.5 rounded-full border border-rose-gold/20">
                          Tap to view {targetUrl || '/events'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5 text-[11px] text-foreground/50 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground/70">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Web Standard Delivery
                  </div>
                  <p>
                    Notifications wake the device screen even if the browser or PWA is currently closed.
                  </p>
                </div>
              </div>

              {/* Broadcast History */}
              <div className="glassmorphic rounded-3xl p-6 border border-foreground/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base flex items-center gap-2">
                    <History size={16} className="text-rose-gold" /> Recent Broadcasts
                  </h4>
                  <button
                    onClick={fetchPushHistory}
                    className="text-[11px] text-foreground/40 hover:text-foreground"
                  >
                    Refresh
                  </button>
                </div>

                {loadingHistory ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={18} className="animate-spin text-foreground/40" />
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5 hover:bg-foreground/[0.04] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-xs text-foreground truncate">{item.title}</h5>
                          <span className="text-[10px] text-foreground/40 flex-shrink-0">
                            {formatDistanceToNow(new Date(item.sent_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60 line-clamp-1 mt-0.5">{item.body}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-foreground/40">
                          <span>Delivered: <strong className="text-emerald-400">{item.success_count}</strong></span>
                          {item.failure_count > 0 && (
                            <span>Failed: <strong className="text-rose-400">{item.failure_count}</strong></span>
                          )}
                          <Link to={item.url} className="text-rose-gold hover:underline inline-flex items-center gap-0.5 ml-auto">
                            Link <ExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-foreground/40 text-center py-6">
                    No broadcast history recorded yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <div className="glassmorphic rounded-[2rem] overflow-hidden p-6 md:p-10">
          {loadingActivity ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/20">Loading Activity...</p>
            </div>
          ) : activities.length > 0 ? (
            <div className="relative border-l border-foreground/10 ml-4 md:ml-6 space-y-10 py-6">
              {activities.map((activity) => (
                <div key={activity.id} className="relative pl-8 md:pl-12 group">
                  <div className={`absolute -left-[18px] top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-background shadow-lg transition-transform group-hover:scale-110
                    ${activity.type === 'First Timer' ? 'bg-primary/20 text-primary border-background' : 
                      activity.type === 'Testimony' ? 'bg-yellow-500/20 text-yellow-500 border-background' : 
                      'bg-rose-500/20 text-rose-500 border-background'}`}
                  >
                    {activity.type === 'First Timer' ? (
                      <UserPlus size={16} />
                    ) : activity.type === 'Testimony' ? (
                      <MessageSquareHeart size={16} />
                    ) : (
                      <Bell size={16} />
                    )}
                  </div>

                  <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-5 hover:bg-foreground/[0.04] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full
                            ${activity.type === 'First Timer' ? 'bg-primary/10 text-primary' : 
                              activity.type === 'Testimony' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-rose-500/10 text-rose-500'}`}
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
      )}
    </div>
  );
}
