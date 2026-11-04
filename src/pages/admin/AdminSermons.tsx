import { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Search,
  Upload,
  Calendar,
  Clock,
  User,
  Trash2,
  Edit2,
  BellRing,
  ExternalLink,
  Play,
  Sparkles,
  Loader2,
  X,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { broadcastPushNotification } from '@/lib/pushBroadcast';
import { toast } from 'sonner';

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  category: string;
  series?: string | null;
  scripture?: string | null;
  duration?: string | null;
  sermon_date: string;
  video_url?: string | null;
  audio_url?: string | null;
  thumbnail_url?: string | null;
  notes?: string | null;
  created_at?: string;
}

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
];

const CATEGORIES = [
  'All',
  'Faith',
  'Good News',
  'Grace',
  'Word',
  'Purpose',
  'Salvation',
  'Healing',
  'Prayer'
];

export default function AdminSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [saving, setSaving] = useState(false);
  const [sendPushAlert, setSendPushAlert] = useState(true);

  // Form State
  const [form, setForm] = useState({
    title: '',
    speaker: 'Pastor Fervour',
    category: 'Good News',
    series: '',
    scripture: '',
    duration: '45 Mins',
    sermon_date: format(new Date(), 'yyyy-MM-dd'),
    video_url: '',
    audio_url: '',
    thumbnail_url: '',
    notes: '',
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to local storage or defaults
        const stored = localStorage.getItem('impact_admin_sermons');
        if (stored) {
          setSermons(JSON.parse(stored));
        } else {
          setSermons(DEFAULT_SERMONS);
          localStorage.setItem('impact_admin_sermons', JSON.stringify(DEFAULT_SERMONS));
        }
      } else {
        setSermons(data);
        localStorage.setItem('impact_admin_sermons', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Could not load sermons from database, using cached:', err);
      const stored = localStorage.getItem('impact_admin_sermons');
      setSermons(stored ? JSON.parse(stored) : DEFAULT_SERMONS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSermon(null);
    setForm({
      title: '',
      speaker: 'Pastor Fervour',
      category: 'Good News',
      series: '',
      scripture: '',
      duration: '45 Mins',
      sermon_date: format(new Date(), 'yyyy-MM-dd'),
      video_url: '',
      audio_url: '',
      thumbnail_url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop',
      notes: '',
    });
    setSendPushAlert(true);
    setShowModal(true);
  };

  const handleOpenEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setForm({
      title: sermon.title,
      speaker: sermon.speaker || 'Pastor Fervour',
      category: sermon.category || 'Good News',
      series: sermon.series || '',
      scripture: sermon.scripture || '',
      duration: sermon.duration || '45 Mins',
      sermon_date: sermon.sermon_date || format(new Date(), 'yyyy-MM-dd'),
      video_url: sermon.video_url || '',
      audio_url: sermon.audio_url || '',
      thumbnail_url: sermon.thumbnail_url || '',
      notes: sermon.notes || '',
    });
    setSendPushAlert(false); // Default to false on edit unless admin checks it
    setShowModal(true);
  };

  const handleSaveSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.speaker.trim()) {
      toast.error('Please enter sermon title and speaker.');
      return;
    }

    setSaving(true);
    const sermonPayload: Partial<Sermon> = {
      title: form.title.trim(),
      speaker: form.speaker.trim(),
      category: form.category,
      series: form.series.trim() || null,
      scripture: form.scripture.trim() || null,
      duration: form.duration.trim() || null,
      sermon_date: form.sermon_date,
      video_url: form.video_url.trim() || null,
      audio_url: form.audio_url.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop',
      notes: form.notes.trim() || null,
    };

    try {
      if (editingSermon) {
        // Update in Supabase
        const { error } = await supabase
          .from('sermons')
          .update(sermonPayload)
          .eq('id', editingSermon.id);

        if (error) {
          console.warn('Database update fallback to local:', error);
        }

        // Update local state
        const updated = sermons.map((s) =>
          s.id === editingSermon.id ? ({ ...s, ...sermonPayload } as Sermon) : s
        );
        setSermons(updated);
        localStorage.setItem('impact_admin_sermons', JSON.stringify(updated));

        toast.success('Sermon updated successfully');

        // Broadcast Push Alert if checked
        if (sendPushAlert) {
          broadcastPushNotification({
            title: `🎙️ Sermon Update: ${form.title}`,
            body: `Updated message "${form.title}" by ${form.speaker}. Tap to listen & watch.`,
            url: '/sermons',
            tag: `impact-sermon-${editingSermon.id}`,
          }).catch((err) => console.warn('Push dispatch error:', err));
        }
      } else {
        // Create in Supabase
        const newId = `sermon-${Date.now()}`;
        const newRecord: Sermon = {
          id: newId,
          created_at: new Date().toISOString(),
          ...sermonPayload,
        } as Sermon;

        const { error } = await supabase.from('sermons').insert([newRecord]);
        if (error) {
          console.warn('Database insert fallback to local:', error);
        }

        const updated = [newRecord, ...sermons];
        setSermons(updated);
        localStorage.setItem('impact_admin_sermons', JSON.stringify(updated));

        toast.success('Sermon published successfully');

        // Broadcast Push Alert to all subscribers
        if (sendPushAlert) {
          broadcastPushNotification({
            title: `🎙️ New Sermon: ${form.title}`,
            body: `Listen to "${form.title}" by ${form.speaker}. Tap to watch & be blessed.`,
            url: '/sermons',
            tag: 'impact-sermon',
          }).catch((err) => console.warn('Push dispatch error:', err));
        }
      }

      setShowModal(false);
    } catch (err: any) {
      toast.error('Failed to save sermon: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSermon = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete sermon "${title}"?`)) return;

    try {
      await supabase.from('sermons').delete().eq('id', id);
    } catch (err) {
      // Local fallback
    }

    const updated = sermons.filter((s) => s.id !== id);
    setSermons(updated);
    localStorage.setItem('impact_admin_sermons', JSON.stringify(updated));
    toast.success('Sermon deleted.');
  };

  const handleQuickBroadcastSermon = async (sermon: Sermon) => {
    const confirmSend = window.confirm(
      `Send push notification alert for sermon "${sermon.title}" to all subscribers now?`
    );
    if (!confirmSend) return;

    try {
      const res = await broadcastPushNotification({
        title: `🎙️ Message Release: ${sermon.title}`,
        body: `Now streaming: "${sermon.title}" by ${sermon.speaker}. Tap to listen & be empowered.`,
        url: '/sermons',
        tag: `impact-sermon-${sermon.id}`,
      });

      if (res.success) {
        toast.success(`Sermon broadcast sent to ${res.success_count ?? 0} active subscriber(s)!`);
      } else {
        toast.error('Could not send notification: ' + (res.error || 'Check edge function'));
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sermon.series && sermon.series.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || sermon.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Sermon <span className="text-rose-gradient">Management</span>
          </h1>
          <p className="text-foreground/50 text-sm">
            Publish sermons, series, video &amp; podcast teachings with instant push alerts to members.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-rose-gold text-midnight font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(226,176,145,0.3)] text-xs"
        >
          <Plus size={16} />
          Upload New Sermon
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic rounded-2xl p-4 border border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={17} />
          <input
            type="text"
            placeholder="Search by sermon title, speaker, series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-rose-gold transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-rose-gold text-midnight'
                  : 'bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sermons Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-rose-gold animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">Loading Sermons...</p>
        </div>
      ) : filteredSermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => (
            <div
              key={sermon.id}
              className="glassmorphic rounded-3xl overflow-hidden border border-foreground/10 flex flex-col justify-between group hover:border-rose-gold/30 transition-all shadow-lg"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video bg-black/40 overflow-hidden">
                <img
                  src={sermon.thumbnail_url || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop'}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-gold/90 text-midnight text-[10px] font-bold uppercase tracking-wider">
                    {sermon.category}
                  </span>
                  {sermon.duration && (
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-white/90 text-[10px] font-semibold flex items-center gap-1">
                      <Clock size={10} /> {sermon.duration}
                    </span>
                  )}
                </div>

                {/* Quick Actions (Broadcast, Edit, Delete) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickBroadcastSermon(sermon)}
                    title="Send push alert for this sermon to all devices"
                    className="w-8 h-8 rounded-xl bg-rose-gold/30 hover:bg-rose-gold text-white backdrop-blur border border-rose-gold/40 flex items-center justify-center transition-all shadow-md"
                  >
                    <BellRing size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(sermon)}
                    title="Edit sermon"
                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur border border-white/30 flex items-center justify-center transition-all shadow-md"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteSermon(sermon.id, sermon.title)}
                    title="Delete sermon"
                    className="w-8 h-8 rounded-xl bg-rose-500/30 hover:bg-rose-500 text-white backdrop-blur border border-rose-500/40 flex items-center justify-center transition-all shadow-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Play Indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold flex items-center gap-1 text-[11px] text-white/80">
                    <User size={12} className="text-rose-gold" /> {sermon.speaker}
                  </span>
                  {sermon.sermon_date && (
                    <span className="text-[10px] text-white/60">
                      {format(new Date(sermon.sermon_date), 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              {/* Sermon Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-rose-gold transition-colors">
                    {sermon.title}
                  </h3>
                  {sermon.series && (
                    <p className="text-[11px] text-rose-gold font-semibold mt-1">
                      Series: {sermon.series}
                    </p>
                  )}
                  {sermon.scripture && (
                    <p className="text-[11px] text-foreground/50 mt-0.5 flex items-center gap-1">
                      <BookOpen size={11} /> Scripture: {sermon.scripture}
                    </p>
                  )}
                  {sermon.notes && (
                    <p className="text-xs text-foreground/60 line-clamp-2 mt-2 leading-relaxed">
                      {sermon.notes}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="pt-3 border-t border-foreground/10 flex items-center justify-between text-xs">
                  {sermon.video_url ? (
                    <a
                      href={sermon.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-gold hover:underline inline-flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Play size={12} /> Watch Video <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-foreground/30 text-[10px]">No Video Link</span>
                  )}

                  <button
                    onClick={() => handleQuickBroadcastSermon(sermon)}
                    className="text-[10px] text-foreground/50 hover:text-rose-gold font-bold flex items-center gap-1"
                  >
                    <BellRing size={11} /> Broadcast Alert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-foreground/10 rounded-3xl p-8">
          <Video className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold">No Sermons Found</h3>
          <p className="text-xs text-foreground/50 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or upload a new sermon to inspire the church family.
          </p>
        </div>
      )}

      {/* CREATE / EDIT SERMON MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0e0b14] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-slide-up space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {editingSermon ? 'Edit Sermon' : 'Upload New Sermon'}
                </h3>
                <p className="text-xs text-foreground/50">
                  Fill in the sermon details and send alerts directly to member devices.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-foreground/50 hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSermon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Sermon Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Supernatural Grace"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Preacher / Speaker *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Pastor Fervour"
                    value={form.speaker}
                    onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  >
                    <option value="Good News">Good News</option>
                    <option value="Faith">Faith</option>
                    <option value="Grace">Grace</option>
                    <option value="Word">Word &amp; Doctrine</option>
                    <option value="Purpose">Purpose</option>
                    <option value="Salvation">Salvation</option>
                    <option value="Healing">Healing</option>
                    <option value="Prayer">Prayer &amp; Fasting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Series Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dominion 2026"
                    value={form.series}
                    onChange={(e) => setForm({ ...form, series: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Key Scripture
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Romans 8:28"
                    value={form.scripture}
                    onChange={(e) => setForm({ ...form, scripture: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="45 Mins"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Sermon Date
                  </label>
                  <input
                    type="date"
                    value={form.sermon_date}
                    onChange={(e) => setForm({ ...form, sermon_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Video URL (YouTube/MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={form.video_url}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Summary / Key Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of the message..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-white/10 text-foreground focus:outline-none focus:border-rose-gold text-xs resize-none"
                />
              </div>

              {/* Push Notification Checkbox */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <input
                  type="checkbox"
                  id="sermon-push-checkbox"
                  checked={sendPushAlert}
                  onChange={(e) => setSendPushAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-gold accent-rose-gold cursor-pointer"
                />
                <label htmlFor="sermon-push-checkbox" className="text-xs text-foreground/80 cursor-pointer flex-1">
                  <strong className="block text-foreground text-xs">
                    {editingSermon
                      ? 'Broadcast push notification about this sermon update'
                      : 'Broadcast push notification to subscribers on release'}
                  </strong>
                  Alert all installed PWA devices immediately so members can tune in and be blessed.
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-3 rounded-2xl border border-white/10 text-foreground/60 hover:text-foreground hover:bg-white/5 font-bold transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-6 rounded-2xl bg-rose-gold text-midnight font-bold text-xs hover:scale-102 active:scale-98 transition-all shadow-[0_0_20px_rgba(226,176,145,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving &amp; Broadcasting...
                    </>
                  ) : editingSermon ? (
                    'Save Changes'
                  ) : (
                    'Publish & Broadcast'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
