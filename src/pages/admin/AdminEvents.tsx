import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Video,
  Loader2,
  X,
  Upload,
  Link as LinkIcon,
  Eye,
  Play,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  created_at: string;
}

type MediaInputMode = 'upload' | 'url';

const BUCKET = 'event-media';
const SUPABASE_URL = 'https://pdxvybpwtxbbhnyfhjej.supabase.co';

function getPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogv)(\?.*)?$/i.test(url);
}

function EventLightbox({ event, onClose }: { event: Event; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const hasMedia = !!event.image_url;
  const mediaIsVideo = hasMedia && isVideo(event.image_url);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-midnight/90 backdrop-blur-md animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0e0b14] border border-white/10 rounded-[2.5rem] shadow-2xl animate-slide-up flex flex-col">
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          <X size={18} />
        </button>

        <div className="w-full aspect-video bg-black rounded-t-[2.5rem] overflow-hidden relative flex-shrink-0">
          {hasMedia ? (
            mediaIsVideo ? (
              <video src={event.image_url} className="w-full h-full object-cover" controls autoPlay playsInline />
            ) : (
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <ImageIcon size={64} className="text-primary/20" />
            </div>
          )}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl text-midnight shadow-xl">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{format(new Date(event.event_date), 'MMM yyyy')}</p>
            <p className="text-3xl font-serif font-bold leading-none">{format(new Date(event.event_date), 'dd')}</p>
          </div>
          {mediaIsVideo && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur rounded-xl px-3 py-1.5 text-white/70 text-xs font-bold uppercase tracking-wider">
              <Play size={12} className="fill-current" /> Video
            </div>
          )}
        </div>

        <div className="p-8 md:p-10 space-y-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight">{event.title}</h2>
            <p className="text-foreground/60 leading-relaxed text-base">
              {event.description || 'Join us for this special gathering at RCCG Impact House. Everyone is welcome to attend and experience God.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5">
              <Calendar size={16} className="text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground/80">{format(new Date(event.event_date), 'EEEE, MMMM do, yyyy')}</span>
            </div>
            {event.event_time && (
              <div className="flex items-center gap-2.5 bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-2.5">
                <Clock size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground/80">{event.event_time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2.5 bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-2.5">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground/80">{event.location}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full py-4 bg-rose-gradient text-midnight font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
          >
            Close Preview <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [previewEvent, setPreviewEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    image_url: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Media upload state
  const [mediaMode, setMediaMode] = useState<MediaInputMode>('upload');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err: unknown) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const resetMediaState = () => {
    setMediaFile(null);
    setMediaPreview('');
    setUploadProgress(0);
    setIsDragging(false);
    setMediaMode('upload');
  };

  const handleOpenModal = (event?: Event) => {
    resetMediaState();
    if (event) {
      setEditingEvent(event);
      setForm({
        title: event.title,
        description: event.description || '',
        event_date: event.event_date,
        event_time: event.event_time || '',
        location: event.location || '',
        image_url: event.image_url || '',
      });
      if (event.image_url) {
        setMediaPreview(event.image_url);
        setMediaMode('url');
      }
    } else {
      setEditingEvent(null);
      setForm({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '' });
    }
    setShowModal(true);
  };

  const processFile = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Invalid file', description: 'Please upload an image (JPG, PNG, GIF, WebP) or video (MP4, MOV, WebM).' });
      return;
    }
    if (file.size > maxSize) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Maximum file size is 50 MB.' });
      return;
    }
    setMediaFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);
    // clear stored url until upload completes
    setForm(f => ({ ...f, image_url: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    setUploadProgress(10);

    const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

    if (error) throw error;
    setUploadProgress(100);
    return getPublicUrl(filename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalForm = { ...form };

      // If user picked a file, upload it first
      if (mediaMode === 'upload' && mediaFile) {
        setUploadProgress(5);
        const publicUrl = await uploadFileToStorage(mediaFile);
        finalForm = { ...finalForm, image_url: publicUrl };
        setForm(f => ({ ...f, image_url: publicUrl }));
      }

      if (editingEvent) {
        const { error } = await supabase.from('events').update(finalForm).eq('id', editingEvent.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Event updated successfully' });
      } else {
        const { error } = await supabase.from('events').insert([finalForm]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Event created successfully' });
      }

      setShowModal(false);
      resetMediaState();
      fetchEvents();
    } catch (err: unknown) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Event removed' });
      fetchEvents();
    } catch (err: unknown) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setForm(f => ({ ...f, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Upcoming <span className="text-rose-gradient">Events</span></h1>
          <p className="text-sm text-foreground/40 mt-1">Manage and schedule church gatherings</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-gradient text-midnight font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-sm text-foreground/20 font-bold uppercase tracking-widest">Loading Events...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="glassmorphic-card group overflow-hidden">
              {/* Clickable media zone */}
              <button
                className="w-full aspect-video bg-foreground/5 relative overflow-hidden rounded-xl mb-4 block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setPreviewEvent(event)}
                aria-label={`Preview ${event.title}`}
              >
                {event.image_url ? (
                  isVideo(event.image_url) ? (
                    <>
                      <video
                        src={event.image_url}
                        className="w-full h-full object-cover pointer-events-none"
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                          <Play size={24} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                          <Eye size={22} className="text-white" />
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-foreground/10" size={48} />
                  </div>
                )}
                {/* Edit / Delete buttons — stop propagation so they don't open lightbox */}
                <div
                  className="absolute top-4 right-4 flex gap-2"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleOpenModal(event)}
                    title="Edit event"
                    aria-label="Edit event"
                    className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/40 transition-colors shadow-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    title="Delete event"
                    aria-label="Delete event"
                    className="w-10 h-10 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 flex items-center justify-center hover:bg-red-500/40 text-red-100 transition-colors shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </button>

              <h3 className="font-serif text-xl font-bold mb-2 truncate">{event.title}</h3>
              <div className="space-y-2 text-sm text-foreground/50">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  {format(new Date(event.event_date), 'MMMM do, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  {event.event_time || 'TBD'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  {event.location || 'Main Hall'}
                </div>
              </div>

              {/* Quick preview link */}
              <button
                onClick={() => setPreviewEvent(event)}
                className="mt-4 w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-foreground/30 hover:text-primary border border-foreground/5 hover:border-primary/20 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Eye size={12} /> View Details
              </button>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-foreground/5 rounded-[2.5rem]">
              <p className="text-foreground/20 italic font-serif">No events scheduled. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* Event Preview Lightbox */}
      {previewEvent && (
        <EventLightbox event={previewEvent} onClose={() => setPreviewEvent(null)} />
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="glassmorphic-card max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowModal(false); resetMediaState(); }}
              title="Close modal"
              aria-label="Close modal"
              className="absolute top-6 right-6 text-foreground/40 hover:text-foreground z-10"
            >
              <X size={24} />
            </button>
            <h2 className="font-serif text-2xl font-bold mb-6">{editingEvent ? 'Edit' : 'Create'} Event</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="event-title" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Event Title</label>
                <input
                  id="event-title"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Enter event title"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="event-description" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Description</label>
                <textarea
                  id="event-description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all resize-none"
                  placeholder="Brief description of the event..."
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="event-date" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Date</label>
                  <input
                    id="event-date"
                    required
                    type="date"
                    value={form.event_date}
                    onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="event-time" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Time</label>
                  <input
                    id="event-time"
                    type="time"
                    value={form.event_time}
                    onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label htmlFor="event-location" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Location</label>
                <input
                  id="event-location"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="e.g. Main Hall"
                />
              </div>

              {/* Media Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Event Media</span>
                  <span className="text-[10px] text-foreground/20 ml-1">(image or video)</span>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2 p-1 bg-foreground/5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setMediaMode('upload'); setForm(f => ({ ...f, image_url: '' })); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      mediaMode === 'upload'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-foreground/40 hover:text-foreground/60'
                    }`}
                  >
                    <Upload size={14} /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMediaMode('url'); clearMedia(); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      mediaMode === 'url'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-foreground/40 hover:text-foreground/60'
                    }`}
                  >
                    <LinkIcon size={14} /> URL
                  </button>
                </div>

                {/* Upload zone */}
                {mediaMode === 'upload' && (
                  <div className="space-y-3">
                    {mediaPreview ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-foreground/5">
                        {mediaFile?.type.startsWith('video/') || isVideo(mediaPreview) ? (
                          <video src={mediaPreview} className="w-full h-full object-cover" controls />
                        ) : (
                          <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={clearMedia}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-red-600/80 transition-colors"
                          title="Remove media"
                          aria-label="Remove media"
                        >
                          <X size={14} />
                        </button>
                        {mediaFile && (
                          <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/70 bg-black/40 backdrop-blur rounded-lg px-3 py-1.5 truncate">
                            {mediaFile.name} · {(mediaFile.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-all ${
                          isDragging
                            ? 'border-primary bg-primary/10 scale-[1.01]'
                            : 'border-foreground/10 hover:border-primary/40 hover:bg-foreground/5'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <div className="flex gap-1">
                            <ImageIcon size={20} className="text-primary" />
                            <Video size={20} className="text-primary/60" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground/70">Drop your file here</p>
                          <p className="text-xs text-foreground/30 mt-1">or click to browse</p>
                          <p className="text-[10px] text-foreground/20 mt-2 uppercase tracking-wider">JPG · PNG · GIF · WebP · MP4 · MOV · WebM · Max 50MB</p>
                        </div>
                      </div>
                    )}

                    {/* Upload progress bar */}
                    {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="space-y-1">
                        <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-gradient rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-foreground/30 text-right">Uploading… {uploadProgress}%</p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      id="event-media-file"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}

                {/* URL input */}
                {mediaMode === 'url' && (
                  <div className="space-y-3">
                    <input
                      id="event-image-url"
                      value={form.image_url}
                      onChange={e => {
                        setForm(f => ({ ...f, image_url: e.target.value }));
                        setMediaPreview(e.target.value);
                      }}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.image_url && (
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-foreground/5">
                        {isVideo(form.image_url) ? (
                          <video src={form.image_url} className="w-full h-full object-cover" controls />
                        ) : (
                          <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-rose-gradient text-midnight font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-rose-gold/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%…` : 'Saving…'}
                  </>
                ) : (
                  editingEvent ? 'Save Changes' : 'Create Event'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
