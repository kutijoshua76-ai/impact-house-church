import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";
import { churchPhotos } from "@/assets/church-photos";
import { Link } from "react-router-dom";
import { Users, BookOpen, Heart, Clock, Youtube, Instagram, Facebook, ChevronDown, Mail, Share2, MessageSquare, Briefcase } from "lucide-react";
import BorderGlow from "@/components/ui/border-glow";
import TrueFocus from "@/components/ui/TrueFocus";

const Index = () => {
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [livePlatforms, setLivePlatforms] = useState<Record<string, boolean>>({
    YouTube: false,
    Instagram: false,
    Facebook: false
  });

  // Handle effects for live status and quick links
  useEffect(() => {
    // 1. Live status check
    const checkStatus = async () => {
      // Mock logic: periodically check if someone is live
    };
    checkStatus();
    const statusInterval = setInterval(checkStatus, 30000);

    // 2. Click outside quick links
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.quick-links-container')) {
        setShowQuickLinks(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(statusInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />

      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-midnight">
          <img
            src={churchPhotos.hero}
            alt="RCCG Impact House worship"
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-midnight/60" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8 animate-fade-up">
              Welcome to the family
            </span>
            <h1
              className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]"
            >
              <TrueFocus
                sentence="Raise Impact"
                manualMode={false}
                blurAmount={4}
                borderColor="hsl(12 45% 72%)"
                glowColor="rgba(226, 176, 145, 0.55)"
                animationDuration={0.6}
                pauseBetweenAnimations={2}
              />
              <span className="block text-center mt-2">
                Change <span className="text-rose-gold/80 italic font-medium">Lives</span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/75 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              A vibrant community where purpose is discovered, potential is unleashed, and the love of Christ is made tangible.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => document.getElementById('watch-live')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-10 py-4 bg-rose-gold text-midnight font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(226,176,145,0.3)]"
              >
                Watch Live
              </button>
              
              <div className="relative quick-links-container">
                <button
                  onClick={() => setShowQuickLinks(!showQuickLinks)}
                  className={cn(
                    "inline-flex items-center justify-center gap-3 px-10 py-4 glassmorphic text-foreground font-bold rounded-full transition-all duration-300 w-full sm:w-auto border",
                    showQuickLinks ? "bg-rose-gold/20 border-rose-gold/50 shadow-[0_0_20px_rgba(226,176,145,0.2)]" : "border-white/10 hover:bg-rose-gold/10 hover:border-rose-gold/30"
                  )}
                >
                  Quick Links
                  <ChevronDown className={cn("transition-transform duration-300", showQuickLinks ? "rotate-180" : "")} size={18} />
                </button>
                
                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[280px] sm:w-80 glassmorphic rounded-[2.5rem] p-4 transition-all duration-500 z-50 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
                  showQuickLinks 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible translate-y-4"
                )}>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Become a First Timer", to: "/first-timer", icon: Users, desc: "Join our family" },
                      { label: "Join the Workforce", to: "/join-workforce", icon: Briefcase, desc: "Serve in a department" },
                      { label: "Victory Testimonies", to: "/testimony", icon: MessageSquare, desc: "Share God's goodness" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setShowQuickLinks(false)}
                        className="flex items-center gap-5 px-6 py-5 rounded-[1.5rem] hover:bg-rose-gold/10 transition-all duration-300 group/link border border-transparent hover:border-rose-gold/20 text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/link:bg-rose-gold/20 group-hover/link:scale-110 transition-all duration-300">
                          <item.icon size={18} className="text-rose-gold" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground group-hover/link:text-rose-gold transition-colors">{item.label}</span>
                          <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-medium">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats/Welcome section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-gold/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="absolute -inset-4 glassmorphic rounded-3xl -rotate-3 scale-95 opacity-50" />
                <img
                  src={churchPhotos.congregation1}
                  alt="Our congregation in worship"
                  className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </ScrollReveal>
            
            <div className="space-y-12">
              <ScrollReveal delay={200}>
                <div>
                  <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                    Beyond the <span className="text-rose-gold italic">Building</span>
                  </h2>
                  <p className="text-foreground/75 leading-relaxed text-lg font-medium">
                    RCCG Impact House isn't just a location; it's a movement of spirit-filled young believers dedicated to making a difference in their generation.
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-8">
                {[
                  { icon: Users, title: "Vibrant Community", desc: "A family of believers growing together in faith, love, and purpose." },
                  { icon: BookOpen, title: "Sound Teaching", desc: "Rooted in the word of God, equipping every member for Kingdom impact." },
                  { icon: Heart, title: "Youth Empowerment", desc: "Raising a generation of young leaders who are making a difference." },
                ].map((item, i) => (
                  <ScrollReveal key={item.title} delay={300 + (i * 100)}>
                    <div className="flex gap-6 items-start group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-rose-gold group-hover:border-rose-gold transition-all duration-300">
                        <item.icon size={22} className="text-rose-gold group-hover:text-midnight transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-foreground/65 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Us Live Section */}
      <section id="watch-live" className="py-32 relative overflow-hidden bg-midnight/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-gold/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">Live Now</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
              Experience the <span className="text-rose-gold italic">Encounter</span>
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto mb-16 text-lg">
              Can't make it to the physical venue? Join our spiritual community from anywhere in the world through our live streams.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                platform: "YouTube", 
                icon: Youtube, 
                color: "text-red-500", 
                link: "https://www.youtube.com/@rccgimpacthouse", 
                desc: "Full HD stream of our services with live chat and archives.",
                glowColor: "0 84 50",
                colors: ['#ef4444', '#f87171', '#b91c1c']
              },
              { 
                platform: "Instagram", 
                icon: Instagram, 
                color: "text-pink-500", 
                link: "https://www.instagram.com/rccg_imh?igsh=dzF4YXE3MTh0Y3Iy", 
                desc: "Live highlight streams and behind-the-scenes worship moments.",
                glowColor: "330 81 60",
                colors: ['#c084fc', '#ec4899', '#f43f5e']
              },
              { 
                platform: "Facebook", 
                icon: Facebook, 
                color: "text-blue-500", 
                link: "https://www.facebook.com/share/18JkK3mSsk/", 
                desc: "Join our Facebook community and share the live encounter.",
                glowColor: "220 90 60",
                colors: ['#3b82f6', '#60a5fa', '#1d4ed8']
              },
            ].map((p, i) => (
              <ScrollReveal key={p.platform} delay={i * 100}>
                <a 
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group h-full cursor-pointer rounded-[2.5rem]"
                >
                  <BorderGlow
                    edgeSensitivity={20}
                    glowColor={p.glowColor}
                    backgroundColor="hsl(var(--midnight) / 0.4)"
                    borderRadius={40}
                    glowRadius={50}
                    glowIntensity={1.2}
                    colors={p.colors}
                    fillOpacity={0.08}
                    className="h-full border border-white/5 group-hover:border-transparent transition-all duration-300"
                  >
                    <div className="p-10 flex flex-col justify-between h-full relative z-10 text-center">
                      {livePlatforms[p.platform] && (
                        <div className={cn("absolute top-6 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-current backdrop-blur-md animate-live-blink z-20", p.color)}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                          <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Live</span>
                        </div>
                      )}
                      <div className={cn("w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-8 transition-transform duration-500 group-hover:scale-110", p.color)}>
                        <p.icon size={32} />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{p.platform}</h3>
                      <p className="text-foreground/50 text-sm leading-relaxed mb-8">{p.desc}</p>
                      <span className={cn("inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest mt-auto mx-auto", p.color)}>
                        Join Stream <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-500" />
                      </span>
                    </div>
                  </BorderGlow>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact section - Wide/Premium */}
      <section className="py-32 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <ScrollReveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6 block">Our Impact</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-8 leading-tight">
                  Raised to <span className="text-rose-gradient">Shine</span>
                </h2>
                <p className="text-foreground/75 leading-relaxed text-lg font-medium mb-10">
                  Through dedicated mentorship, spiritual guidance, and community outreach, RCCG Impact House has become a beacon of hope for hundreds of young people seeking purpose and direction in life.
                </p>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 text-rose-gold font-bold text-sm tracking-widest uppercase"
                >
                  Discovery Story 
                  <span className="w-12 h-px bg-rose-gold/30 group-hover:w-20 group-hover:bg-rose-gold transition-all duration-500" />
                </Link>
              </ScrollReveal>
            </div>
            <div className="order-1 lg:order-2">
              <ScrollReveal delay={200}>
                <div className="aspect-video rounded-3xl overflow-hidden glassmorphic p-1">
                  <img
                    src={churchPhotos.impact1}
                    alt="Youth fellowship"
                    className="w-full h-full object-cover rounded-[1.4rem]"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <ScrollReveal delay={400}>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-10 py-5 glassmorphic text-rose-gold font-bold rounded-full hover:bg-rose-gold hover:text-midnight transition-all duration-500 shadow-[0_10px_30px_rgba(226,176,145,0.1)]"
              >
                Explore Full Gallery
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Service times - Grid/Premium */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-gold/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-foreground mb-16">
              Join the <span className="text-rose-gold">Gathering</span>
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { day: "Sunday", event: "First Service", time: "7:30 AM – 8:30 AM", bg: churchPhotos.worship1 },
              { day: "Sunday", event: "Sunday School", time: "8:30 AM – 9:30 AM", bg: churchPhotos.youth1 },
              { day: "Sunday", event: "Second Service", time: "9:30 AM – 11:30 AM", bg: churchPhotos.congregation2 },
              { day: "Wednesday", event: "Bible Study", time: "5:00 PM – 6:30 PM", bg: churchPhotos.impact2 },
              { day: "Thursday", event: "Prayer Meeting", time: "5:00 PM – 7:00 PM", bg: churchPhotos.worship2 },
            ].map((s, i) => (
              <ScrollReveal key={`${s.day}-${s.event}`} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-[2rem] hover:scale-[1.02] transition-all duration-500 h-full border border-white/5 hover:border-rose-gold/30">
                  <img 
                    src={s.bg}
                    alt={s.event}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-midnight/50 group-hover:bg-midnight/30 transition-colors duration-500 backdrop-blur-[1px] group-hover:backdrop-blur-0" />
                  
                  <div className="relative z-10 p-10 h-full flex flex-col items-center justify-center">
                    <Clock size={32} className="text-rose-gold/60 mx-auto mb-6 group-hover:text-rose-gold group-hover:scale-110 transition-all duration-500 drop-shadow-md" />
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-rose-gold mb-2 drop-shadow-md">{s.day}</p>
                    <h3 className="font-serif text-2xl font-bold text-white mb-4 drop-shadow-lg">{s.event}</h3>
                    <div className="w-10 h-px bg-rose-gold/30 mx-auto mb-4 group-hover:bg-rose-gold/60 transition-colors" />
                    <p className="text-white/90 text-sm uppercase tracking-widest font-medium drop-shadow-md">{s.time}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
