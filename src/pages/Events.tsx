import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Clock, ArrowRight, Loader2, X, Play, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogv)(\?.*)?$/i.test(url);
}

function EventLightbox({ event, onClose }: { event: Event; onClose: () => void }) {
  // Close on Escape key
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-midnight/90 backdrop-blur-md animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0e0b14] border border-white/10 rounded-[2.5rem] shadow-2xl animate-slide-up flex flex-col">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close event details"
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          <X size={18} />
        </button>

        {/* Media */}
        <div className="w-full aspect-video bg-black rounded-t-[2.5rem] overflow-hidden relative flex-shrink-0">
          {hasMedia ? (
            mediaIsVideo ? (
              <video
                src={event.image_url}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <ImageIcon size={64} className="text-primary/20" />
            </div>
          )}

          {/* Date badge overlay */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl text-midnight shadow-xl">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
              {format(new Date(event.event_date), 'MMM yyyy')}
            </p>
            <p className="text-3xl font-serif font-bold leading-none">
              {format(new Date(event.event_date), 'dd')}
            </p>
          </div>

          {/* Video play badge */}
          {mediaIsVideo && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur rounded-xl px-3 py-1.5 text-white/70 text-xs font-bold uppercase tracking-wider">
              <Play size={12} className="fill-current" /> Video
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-8 md:p-10 space-y-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight">{event.title}</h2>
            {event.description && (
              <p className="text-foreground/60 leading-relaxed text-base">
                {event.description}
              </p>
            )}
            {!event.description && (
              <p className="text-foreground/40 leading-relaxed text-base italic">
                Join us for this special gathering at RCCG Impact House. Everyone is welcome to attend and experience God.
              </p>
            )}
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5">
              <Calendar size={16} className="text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground/80">
                {format(new Date(event.event_date), 'EEEE, MMMM do, yyyy')}
              </span>
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
            Got it, Thanks! <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-rose-gold/5 -z-10" />
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-up">
              Upcoming <span className="text-rose-gradient">Events</span>
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed animate-fade-up [animation-delay:100ms]">
              Join us for worship, fellowship, and ministry. Be part of what God is doing at Impact House.
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-bold uppercase tracking-widest text-foreground/20">Gathering Events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group bg-foreground/[0.02] border border-foreground/5 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500 animate-fade-up"
                >
                  {/* Clickable media area */}
                  <button
                    className="w-full aspect-[4/3] overflow-hidden relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setSelectedEvent(event)}
                    aria-label={`View details for ${event.title}`}
                  >
                    {event.image_url ? (
                      isVideo(event.image_url) ? (
                        <>
                          <video
                            src={event.image_url}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            muted
                            loop
                            playsInline
                          />
                          {/* Play overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                              <Play size={28} className="text-white fill-white ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                              <ArrowRight size={22} className="text-white" />
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Calendar size={48} className="text-primary/20" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-midnight font-bold shadow-lg">
                      <p className="text-xs uppercase tracking-widest text-primary">{format(new Date(event.event_date), 'MMM')}</p>
                      <p className="text-2xl font-serif">{format(new Date(event.event_date), 'dd')}</p>
                    </div>
                  </button>

                  <div className="p-8">
                    <h3 className="font-serif text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-foreground/50 text-sm mb-8 line-clamp-2 leading-relaxed">
                      {event.description || 'Join us for this special gathering at RCCG Impact House. Everyone is welcome to attend and experience God.'}
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-foreground/40 font-medium">
                        <Clock size={16} className="text-primary" />
                        {event.event_time || 'Check back soon'}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/40 font-medium">
                        <MapPin size={16} className="text-primary" />
                        {event.location || 'RCCG Impact House'}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="w-full py-4 bg-foreground/5 border border-foreground/5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-foreground/[0.02] rounded-[3rem] border-2 border-dashed border-foreground/5">
              <Calendar size={64} className="mx-auto mb-6 text-foreground/10" />
              <h2 className="font-serif text-3xl font-bold mb-2">No Scheduled Events</h2>
              <p className="text-foreground/40">Check back later for upcoming ministry gatherings.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Event Lightbox */}
      {selectedEvent && (
        <EventLightbox event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
