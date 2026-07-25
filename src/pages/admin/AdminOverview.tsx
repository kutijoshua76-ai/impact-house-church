import { useEffect, useState, useRef } from 'react';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  ArrowUpRight,
  MessageSquare,
  Loader2,
  Calendar,
  Book,
  HandHelping,
  Users as UsersIcon,
  Hand as HandIcon,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Sun,
  Moon,
  Video,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface BibleVerse {
  id: string;
  verse: string;
  reference: string;
  category: string;
}

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
}

interface BiblePassage {
  reference: string;
  content: string;
  translation_name: string;
}

export default function AdminOverview() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [counts, setCounts] = useState({ firstTimers: 0, testimonies: 0, donations: 0, projects: 0, contacts: 0 });
  const [events, setEvents] = useState<Event[]>([]);
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [prayerTerm, setPrayerTerm] = useState<{term: string, verse: string} | null>(null);
  const [showBible, setShowBible] = useState(false);

  // Scripture Reader state
  const [bibleSearch, setBibleSearch] = useState('John 3');
  const [biblePassage, setBiblePassage] = useState<BiblePassage | null>(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');
  const [currentBook, setCurrentBook] = useState('John');
  const [currentChapter, setCurrentChapter] = useState(3);
  const bibleBodyRef = useRef<HTMLDivElement>(null);

  const fetchPassage = async (reference: string) => {
    if (!reference.trim()) return;
    setBibleLoading(true);
    setBibleError('');
    try {
      const encoded = encodeURIComponent(reference.trim());
      const res = await fetch(`https://rest.api.bible/v1/bibles/de4e12af7f28f599-01/search?query=${encoded}`, {
        headers: { 'api-key': 'OQBUik62CbMGP6r6l08fe' }
      });
      if (!res.ok) throw new Error('Passage not found');
      const data = await res.json();
      
      const passages = data?.data?.passages;
      const verses = data?.data?.verses;

      if (passages && passages.length > 0) {
        const refStr = passages[0].reference;
        setBiblePassage({
          reference: refStr,
          content: passages[0].content,
          translation_name: 'KJV (api.bible)'
        });
        const match = refStr.match(/^(.+?)\s+(\d+)/);
        if (match) {
          setCurrentBook(match[1]);
          setCurrentChapter(parseInt(match[2], 10));
        }
      } else if (verses && verses.length > 0) {
        const refStr = verses[0].reference;
        setBiblePassage({
          reference: refStr,
          content: verses.map((v: any) => v.content || `<p>${v.text}</p>`).join(''),
          translation_name: 'KJV (api.bible)'
        });
        const match = refStr.match(/^(.+?)\s+(\d+)/);
        if (match) {
          setCurrentBook(match[1]);
          setCurrentChapter(parseInt(match[2], 10));
        }
      } else {
        throw new Error('No verses found for that reference');
      }

      setBibleError('');
      // scroll reader to top
      if (bibleBodyRef.current) bibleBodyRef.current.scrollTop = 0;
    } catch (err: any) {
      setBibleError(err.message || 'Could not fetch passage. Try a reference like "John 3" or "Psalm 23:1-6".');
      setBiblePassage(null);
    } finally {
      setBibleLoading(false);
    }
  };

  const handleBibleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPassage(bibleSearch);
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    const newChapter = direction === 'next' ? currentChapter + 1 : Math.max(1, currentChapter - 1);
    const ref = `${currentBook} ${newChapter}`;
    setBibleSearch(ref);
    fetchPassage(ref);
  };

  const handleOpenBible = () => {
    setShowBible(true);
    if (!biblePassage) fetchPassage('John 3');
  };

  const prayerTerms = [
    { term: "Strength", verse: "Isaiah 40:31 - But they that wait upon the Lord shall renew their strength." },
    { term: "Peace", verse: "Philippians 4:7 - And the peace of God, which transcends all understanding..." },
    { term: "Healing", verse: "1 Peter 2:24 - By His stripes we were healed." },
    { term: "Provision", verse: "Philippians 4:19 - My God shall supply all your needs according to His riches." },
    { term: "Guidance", verse: "Psalm 32:8 - I will instruct you and teach you in the way you should go." }
  ];

  useEffect(() => {
    fetchDashboardData();
    reshufflePrayer();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [firstTimersRes, testimoniesRes, eventsRes, donationsRes, versesRes, contactsRes] = await Promise.all([
        supabase.from('first_timers').select('*', { count: 'exact', head: true }),
        supabase.from('testimonies').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3),
        supabase.from('donations').select('*'),
        supabase.from('bible_verses').select('*').eq('category', 'daily'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true })
      ]);

      const totalTithe = (donationsRes.data || [])
        .filter(d => d.type === 'tithe')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
      
      const totalProject = (donationsRes.data || [])
        .filter(d => d.type === 'project')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      setCounts({
        firstTimers: firstTimersRes.count || 0,
        testimonies: testimoniesRes.count || 0,
        donations: totalTithe,
        projects: totalProject,
        contacts: contactsRes.count || 0
      });

      setEvents(eventsRes.data || []);

      if (versesRes.data && versesRes.data.length > 0) {
        setDailyVerse(versesRes.data[Math.floor(Math.random() * versesRes.data.length)]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reshufflePrayer = () => {
    const random = prayerTerms[Math.floor(Math.random() * prayerTerms.length)];
    setPrayerTerm(random);
    if (!loading) {
        toast({
            title: "Prayer Focus Updated",
            description: `Now focusing on ${random.term}`
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-foreground/20 animate-pulse">Syncing Sanctuary Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Welcome & Live Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em] mb-1">Good {new Date().getHours() < 12 ? 'Morning' : (new Date().getHours() < 18 ? 'Afternoon' : 'Evening')}, {profile?.full_name?.split(' ')[0] || 'Daniel'} 👋</h2>
              <h1 className="font-serif text-3xl font-bold">Welcome to <span className="text-rose-gradient">Impact House</span></h1>
            </div>
            <button 
              title="Toggle theme"
              aria-label="Toggle theme"
              className="p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              <Sun className="text-foreground/40" size={20} />
            </button>
          </div>

          <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110 opacity-80" 
              alt="Worship"
            />
            <div className="relative z-20 h-full p-10 flex flex-col justify-center max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-[10px] font-bold uppercase tracking-widest text-white mb-6 animate-pulse">
                <Video size={12} />
                Live Now
              </div>
              <h3 className="font-serif text-4xl font-bold text-white mb-4 leading-tight">Sunday Morning Service</h3>
              <p className="text-white/70 text-sm mb-8 leading-relaxed">Join us live in worship and the teaching of God's word. Experience the power of the Holy Spirit.</p>
              <button 
                onClick={() => window.open('/#watch-live', '_blank')}
                className="w-fit px-8 py-3.5 bg-white text-black font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl hover:bg-white/90"
              >
                Watch Live
              </button>
            </div>
            
            {/* Viewers stack */}
            <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-midnight bg-foreground/20" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">+1.2k Watching</span>
            </div>
          </div>
        </div>

        {/* Daily Verse Section */}
        <div className="glassmorphic-card h-full relative overflow-hidden group border border-primary/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-gold/10 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2" />
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl font-bold">Daily Verse</h3>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sun className="animate-spin-slow" size={20} />
            </div>
          </div>
          
          <div className="flex flex-col h-[calc(100%-120px)] justify-center">
            <blockquote className="text-lg font-serif italic text-foreground/80 leading-relaxed mb-6">
              "{dailyVerse?.verse || 'Trust in the Lord with all your heart and lean not on your own understanding.'}"
            </blockquote>
            <cite className="text-sm font-bold text-primary not-italic uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-px bg-primary/30" />
              {dailyVerse?.reference || 'Proverbs 3:5'}
            </cite>
          </div>
          
          <div className="mt-auto pt-8 border-t border-foreground/5 flex justify-between items-center">
            <button className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors flex items-center gap-2 group/btn">
              Share Word <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i === 1 ? 'bg-primary' : 'bg-foreground/10'}`} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Events Column */}
        <div className="glassmorphic-card space-y-8 bg-foreground/[0.01]">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold">Upcoming Events</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="flex gap-4 group cursor-pointer animate-slide-up">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-foreground/10 flex flex-col items-center justify-center shrink-0 group-hover:border-primary/30 transition-all group-hover:scale-105 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-primary">{format(new Date(event.event_date), 'MMM')}</span>
                  <span className="text-xl font-serif font-bold">{format(new Date(event.event_date), 'dd')}</span>
                </div>
                <div className="flex-1 border-b border-foreground/5 pb-4">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{event.title}</p>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-1">
                    {format(new Date(event.event_date), 'MMMM d')} • {event.event_time || 'TBD'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className="w-1 h-1 rounded-full bg-primary/40" />
                     <p className="text-[10px] text-foreground/30">{event.location || 'Main Hall'}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center py-10 text-foreground/20 italic text-sm">No upcoming events.</p>
            )}
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="glassmorphic-card">
          <h3 className="font-serif text-xl font-bold mb-8">Quick Access</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleOpenBible}
              className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-foreground/5 border border-foreground/5 hover:bg-primary/10 hover:border-primary/20 hover:scale-[1.05] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Book className="text-primary group-hover:scale-110 transition-transform" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 group-hover:text-primary">Bible</span>
            </button>
            
            <button 
                onClick={() => toast({ title: "Donations Summary", description: `Total contributions recorded: ₦${counts.donations.toLocaleString()}` })}
                className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-foreground/5 border border-foreground/5 hover:bg-yellow-500/10 hover:border-yellow-500/20 hover:scale-[1.05] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                <Zap className="text-yellow-500 group-hover:scale-110 transition-transform" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 group-hover:text-yellow-500">Give</span>
            </button>

            <button 
              onClick={() => window.location.href = '/admin/contacts'}
              className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-foreground/5 border border-foreground/5 hover:bg-primary/10 hover:border-primary/20 hover:scale-[1.05] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="text-primary group-hover:scale-110 transition-transform" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 group-hover:text-primary">Messages</span>
              {counts.contacts > 0 && <span className="text-[8px] font-bold text-primary mt-1">{counts.contacts} New</span>}
            </button>

            <button className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-foreground/5 border border-foreground/5 hover:bg-primary/10 hover:border-primary/20 hover:scale-[1.05] transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UsersIcon className="text-primary group-hover:scale-110 transition-transform" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 group-hover:text-primary">Groups</span>
            </button>

            <button 
              onClick={reshufflePrayer}
              className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-foreground/5 border border-foreground/5 hover:bg-yellow-500/10 hover:border-yellow-500/20 hover:scale-[1.05] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                <HandIcon className="text-yellow-500 group-hover:scale-110 transition-transform" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 group-hover:text-yellow-500">Prayer</span>
            </button>
          </div>
        </div>

        {/* Dynamic Prayer/Stat Column */}
        <div className="glassmorphic-card bg-rose-gold/5 flex flex-col border border-rose-gold/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
              <HandIcon size={20} />
            </div>
            <h3 className="font-serif text-xl font-bold">Prayer Focus</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
            <h4 className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary mb-6 relative">Topic: {prayerTerm?.term}</h4>
            <p className="text-lg font-serif italic text-foreground/70 leading-relaxed mb-8 relative">
              "{prayerTerm?.verse.split(' - ')[1]}"
            </p>
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest relative">— {prayerTerm?.verse.split(' - ')[0]}</p>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-8 border-t border-foreground/5">
             <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open('/give/tithes', '_blank')}>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Tithes</p>
                <p className="text-xl font-serif font-bold text-primary">₦{counts.donations.toLocaleString()}</p>
             </div>
             <div className="text-center border-l border-foreground/5 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open('/give/projects', '_blank')}>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Projects</p>
                <p className="text-xl font-serif font-bold text-yellow-500">₦{counts.projects.toLocaleString()}</p>
             </div>
          </div>
        </div>

      </div>

       {/* Scripture Reader Modal */}
      {showBible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="glassmorphic-card max-w-4xl w-full h-[90vh] p-0 shadow-2xl relative overflow-hidden animate-slide-up flex flex-col border border-primary/20">
            
            {/* Header */}
            <div className="p-6 border-b border-foreground/5 flex items-center justify-between bg-primary/5 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-primary text-white shadow-lg">
                  <BookMarked size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Scripture <span className="text-primary">Reader</span></h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">KJV · bible-api.com</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBible(false)} 
                title="Close Bible"
                aria-label="Close Bible"
                className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleBibleSearch} className="px-6 py-4 border-b border-foreground/5 bg-foreground/[0.02] shrink-0">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                  <input
                    type="text"
                    value={bibleSearch}
                    onChange={e => setBibleSearch(e.target.value)}
                    placeholder='Search any passage — e.g. "John 3", "Psalm 23", "Romans 8:28"'
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 text-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={bibleLoading}
                  className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                  {bibleLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  {bibleLoading ? 'Loading...' : 'Read'}
                </button>
              </div>
              <p className="text-[10px] text-foreground/30 mt-2 ml-1">Try: Genesis 1 · Matthew 5:1-12 · Proverbs 3:5-6 · Revelation 21</p>
            </form>

            {/* Passage Content */}
            <div ref={bibleBodyRef} className="flex-1 overflow-y-auto">
              {bibleLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-bold uppercase tracking-widest text-foreground/30 animate-pulse">Fetching Scripture...</p>
                </div>
              )}

              {bibleError && !bibleLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-12 text-center">
                  <BookOpen className="w-14 h-14 text-foreground/10" />
                  <p className="text-sm text-red-400 font-medium">{bibleError}</p>
                  <p className="text-[10px] text-foreground/30 uppercase tracking-widest">Try a different reference format</p>
                </div>
              )}

              {biblePassage && !bibleLoading && (
                <div className="max-w-2xl mx-auto px-6 md:px-12 py-10">
                  {/* Reference Title */}
                  <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground/80">
                      {biblePassage.reference}
                    </h3>
                    <div className="w-16 h-0.5 bg-primary/30 mx-auto mt-4 rounded-full" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 mt-3">
                      {biblePassage.translation_name}
                    </p>
                  </div>

                  {/* Verses */}
                  <div className="space-y-6 text-lg font-serif leading-[1.9] text-foreground/75 bible-reader-content text-left">
                    <style dangerouslySetInnerHTML={{ __html: `
                      .bible-reader-content p { margin-bottom: 1.5rem; }
                      .bible-reader-content .v { color: hsl(var(--primary)); font-weight: bold; font-size: 0.875rem; margin-right: 0.5rem; vertical-align: top; line-height: 2.2; }
                      .bible-reader-content .wj { color: #f87171; } /* Red letters for words of Jesus */
                      .bible-reader-content .add { font-style: italic; opacity: 0.8; }
                    `}} />
                    <div dangerouslySetInnerHTML={{ __html: biblePassage.content }} />
                  </div>

                  <div className="pt-16 pb-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/20">— End of Passage —</p>
                  </div>
                </div>
              )}

              {!biblePassage && !bibleLoading && !bibleError && (
                <div className="flex flex-col items-center justify-center h-full gap-6 p-12 text-center">
                  <BookOpen className="w-16 h-16 text-foreground/10" />
                  <p className="text-sm text-foreground/40">Search for any Bible book, chapter, or verse above</p>
                </div>
              )}
            </div>

            {/* Chapter Navigation Footer */}
            {biblePassage && !bibleLoading && (
              <div className="shrink-0 px-6 py-4 border-t border-foreground/5 bg-foreground/[0.02] flex items-center justify-between">
                <button
                  onClick={() => navigateChapter('prev')}
                  disabled={currentChapter <= 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Prev Chapter
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                  {currentBook} · Ch. {currentChapter}
                </span>
                <button
                  onClick={() => navigateChapter('next')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  Next Chapter <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
