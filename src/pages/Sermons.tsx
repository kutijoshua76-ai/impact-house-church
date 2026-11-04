import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Search,
  Home,
  Library,
  Radio,
  ArrowLeft,
  PlayCircle,
  MoreHorizontal,
  X,
  Play,
  Volume2,
  Calendar,
  User,
  Clock,
  BookOpen,
  Sparkles
} from 'lucide-react';
import rccgLogo from '@/assets/rccg-logo.png';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';
import { supabase } from '@/lib/supabase';
import { Sermon } from './admin/AdminSermons';

const CATEGORIES = [
  'All',
  'Good News',
  'Faith',
  'Grace',
  'Word',
  'Purpose',
  'Salvation',
  'Healing',
  'Prayer'
];

const DEFAULT_SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
    title: 'Special Miracle Service: Walking in Divine Authority',
    speaker: 'Pastor Fervour',
    category: 'Faith',
    series: 'Dominion Over Darkness',
    scripture: 'Luke 10:19',
    duration: '45 Mins',
    sermon_date: '2026-07-12',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop',
    notes: 'Understanding the believers legal authority in Christ to overcome every obstacle.',
  },
  {
    id: 'sermon-2',
    title: 'Mid-Year Thanksgiving: The Power of Praise',
    speaker: 'Pastor Fervour',
    category: 'Good News',
    series: 'Heart of Gratitude',
    scripture: 'Psalm 103:1-5',
    duration: '52 Mins',
    sermon_date: '2026-07-05',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    notes: 'Praise is not an emotional reaction; it is a spiritual weapon that disarms the enemy.',
  },
  {
    id: 'sermon-3',
    title: 'Hermeneutics: Understanding the Scriptures',
    speaker: 'Bible Experience',
    category: 'Word',
    series: 'Sound Doctrine',
    scripture: '2 Timothy 2:15',
    duration: '1 Hr 5 Mins',
    sermon_date: '2026-06-28',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=800&auto=format&fit=crop',
    notes: 'Guidelines to interpreting scripture in context, guided by the Holy Spirit.',
  },
  {
    id: 'sermon-4',
    title: 'The Pursuit of Divine Purpose',
    speaker: 'Apostle Emmanuel',
    category: 'Purpose',
    series: 'Kingdom Blueprint',
    scripture: 'Jeremiah 1:5',
    duration: '1 Hr',
    sermon_date: '2026-05-29',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1519817914152-2a640f1a5c6d?q=80&w=800&auto=format&fit=crop',
    notes: 'You were created with an intentional calling. How to discern and run your race.',
  },
  {
    id: 'sermon-5',
    title: 'The Unstoppable Move of God',
    speaker: 'Pastor Fervour',
    category: 'Faith',
    series: 'Fresh Fire',
    scripture: 'Acts 2:1-4',
    duration: '50 Mins',
    sermon_date: '2026-05-15',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop',
    notes: 'When the Spirit of God begins to move, no natural resistance can hold back His kingdom.',
  },
];

export default function Sermons() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sermons, setSermons] = useState<Sermon[]>(DEFAULT_SERMONS);
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);

  // Controlled Coming Soon state for the public sermon page
  const isComingSoon = true;

  useEffect(() => {
    async function loadSermons() {
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('sermon_date', { ascending: false });

        if (!error && data && data.length > 0) {
          setSermons(data);
        } else {
          const stored = localStorage.getItem('impact_admin_sermons');
          if (stored) {
            setSermons(JSON.parse(stored));
          }
        }
      } catch (err) {
        const stored = localStorage.getItem('impact_admin_sermons');
        if (stored) {
          setSermons(JSON.parse(stored));
        }
      }
    }
    loadSermons();
  }, []);

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sermon.series && sermon.series.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' || sermon.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden relative font-sans">
      <SEO
        title="Sermons & Messages | RCCG Impact House"
        canonicalUrl="/sermons"
        description="Listen to sermons, podcast teachings, and live streams from RCCG Impact House pastors and ministers."
      />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#181818] flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <img src={rccgLogo} alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold tracking-wide">SERMONS</h1>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            <NavLink
              to="/sermons"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-sm',
                  isActive ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
                )
              }
            >
              <Home size={18} />
              <span>All Sermons</span>
            </NavLink>
            <NavLink
              to="/daily-verse"
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/5 text-sm"
            >
              <Sparkles size={18} className="text-rose-gold" />
              <span>Daily Scripture</span>
            </NavLink>
            <NavLink
              to="/events"
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/5 text-sm"
            >
              <Radio size={18} />
              <span>Church Events</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-xs"
          >
            <ArrowLeft size={15} />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        {/* Top Header */}
        <header className="px-4 md:px-8 py-5 flex items-center justify-between gap-4 border-b border-white/5">
          {/* Mobile Back Button */}
          <Link
            to="/"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white"
          >
            <ArrowLeft size={18} />
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Search sermons by title, topic, or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/daily-verse"
              className="px-3.5 py-1.5 rounded-full bg-rose-gold/20 text-rose-gold text-xs font-bold border border-rose-gold/30 hover:bg-rose-gold/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">Daily Word</span>
            </Link>
          </div>
        </header>

        {/* Categories (Horizontal Scroll) */}
        <div className="px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto hide-scrollbar border-b border-white/5">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border',
                activeCategory === category
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/70 border-white/10 hover:border-white/30 hover:text-white'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sermons Grid */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif mb-1">Impact Teachings</h2>
            <p className="text-white/50 text-xs font-medium">Equipping the generation in truth and power</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                onClick={() => setActiveSermon(sermon)}
                className="group cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-white/5">
                    <img
                      src={sermon.thumbnail_url || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop'}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Duration Overlay */}
                    {sermon.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white/90">
                        {sermon.duration}
                      </div>
                    )}
                    {/* Category */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-rose-gold">
                      {sermon.category}
                    </div>
                    {/* Play Button Overlay (Hover) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle size={44} className="text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-bold text-white text-sm leading-tight mb-1 group-hover:text-rose-gold transition-colors line-clamp-2">
                    {sermon.title}
                  </h3>
                  {sermon.series && (
                    <p className="text-[11px] text-rose-gold/80 font-medium line-clamp-1">
                      Series: {sermon.series}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 mt-2 border-t border-white/5">
                  <span className="truncate pr-2 font-medium">{sermon.speaker}</span>
                  {sermon.sermon_date && (
                    <span className="shrink-0">{sermon.sermon_date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSermons.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/40 text-sm">No sermons matching your filter.</p>
            </div>
          )}
        </div>
      </main>

      {/* SERMON DETAIL / PLAYER MODAL */}
      {activeSermon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-slide-up space-y-5">
            <button
              onClick={() => setActiveSermon(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Thumbnail / Video */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
              <img
                src={activeSermon.thumbnail_url || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop'}
                alt={activeSermon.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                {activeSermon.video_url ? (
                  <a
                    href={activeSermon.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-rose-gold text-midnight font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    <Play size={16} /> Watch Full Message
                  </a>
                ) : (
                  <div className="px-4 py-2 rounded-full bg-black/70 text-white text-xs">
                    Media streaming available soon
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-gold/20 text-rose-gold text-[10px] font-bold uppercase tracking-wider">
                  {activeSermon.category}
                </span>
                {activeSermon.duration && (
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Clock size={12} /> {activeSermon.duration}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold font-serif text-white">{activeSermon.title}</h2>
              <p className="text-xs text-rose-gold font-semibold mt-1">
                Minister: {activeSermon.speaker}
              </p>
              {activeSermon.scripture && (
                <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                  <BookOpen size={13} /> Scripture Reference: {activeSermon.scripture}
                </p>
              )}
            </div>

            {activeSermon.notes && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/70 leading-relaxed">
                <p className="font-semibold text-white/90 mb-1">Sermon Notes:</p>
                {activeSermon.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMING SOON OVERLAY */}
      {isComingSoon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="text-center p-8 max-w-md animate-fade-in glassmorphic rounded-3xl border border-white/10 shadow-2xl">
            <div className="w-20 h-20 mx-auto bg-rose-gold/20 rounded-full flex items-center justify-center mb-6 text-rose-gold border border-rose-gold/30">
              <Radio size={38} className="animate-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-gold block mb-2">
              Ministry Audio &amp; Video
            </span>
            <h2 className="text-3xl font-serif font-black text-white mb-3 tracking-tight">
              COMING SOON
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              We are currently preparing an amazing library of sermons and teachings. Check back later or enable push notifications to be alerted the moment it launches!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-gold text-midnight text-xs font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(226,176,145,0.3)]"
              >
                <ArrowLeft size={16} />
                Return to Website
              </Link>
              <Link
                to="/daily-verse"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all"
              >
                <Sparkles size={14} className="text-rose-gold" />
                Read Today's Word
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
