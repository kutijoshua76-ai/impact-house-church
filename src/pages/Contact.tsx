import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Mail, Phone, MessageCircle, Facebook, Instagram, Youtube, MapPin, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import BorderGlow from "@/components/ui/border-glow";

const socialLinks = [
  { 
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-3.905 1.33 6.332 6.332 0 1 0 10.866 4.363V9.624a11.233 11.233 0 0 0 6.136 1.839V8a4.793 4.793 0 0 1-3.864-1.314z"/>
      </svg>
    ), 
    label: "TikTok", 
    href: "https://www.tiktok.com/@rccgimpacthouse?_r=1&_t=ZS-95hjzp2Trho", 
    color: "bg-black",
    glowColor: "180 80 50",
    colors: ['#00f2fe', '#4facfe', '#000000']
  },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/18JkK3mSsk/", color: "bg-blue-700", glowColor: "220 90 60", colors: ['#3b82f6', '#60a5fa', '#1d4ed8'] },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/rccg_imh?igsh=dzF4YXE3MTh0Y3Iy", color: "bg-pink-600", glowColor: "330 81 60", colors: ['#c084fc', '#ec4899', '#f43f5e'] },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@rccgimpacthouse?si=hvdckZIWnKjwiEgt", color: "bg-red-600", glowColor: "0 84 50", colors: ['#ef4444', '#f87171', '#b91c1c'] },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Terminal Logging
    console.log("%c[FORM_SUBMISSION]", "color: #e2b091; font-weight: bold", {
      form: "Contact Form",
      timestamp: new Date().toISOString(),
      data: formData
    });

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Message Broadcasted!",
        description: "Thank you for reaching out. We have received your message and will get back to you shortly.",
      });

      // Also trigger mailto as a fallback/secondary action if needed, 
      // but usually saving to DB is enough for a modern app.
      // We'll keep it simple and just save to DB for now as requested.

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const err = error as Error;
      console.error("[FORM_ERROR]", err);
      toast({
        variant: "destructive",
        title: "Broadcast Failed",
        description: err.message || "An error occurred while sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-midnight overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-gold/5 blur-[120px] rounded-full" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8 animate-fade-up">
              Reach Out
            </span>
            <h1
              className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9] animate-fade-up delay-100"
            >
              Get in <span className="text-rose-gradient">Touch</span>
            </h1>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up delay-200">
              We'd love to hear from you. Whether you're a member, a visitor, or someone seeking hope — you're welcome here.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24">
          {/* Direct contact */}
          <ScrollReveal>
            <div className="space-y-12">
              <div>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-8 leading-tight">
                  Connect <span className="text-rose-gold italic">Directly</span>
                </h2>
                <p className="text-foreground/70 text-lg font-medium leading-relaxed mb-12">
                  Our team is here to support you in any way possible. Feel free to reach out through any of these channels.
                </p>
              </div>
              
              <div className="grid gap-6">
                {[
                  { 
                    icon: Phone, 
                    title: "Call Us", 
                    links: [
                      { label: "07032578382", href: "tel:07032578382" },
                      { label: "08062475927", href: "tel:08062475927" }
                    ]
                  },
                  { 
                    icon: Mail, 
                    title: "Email Us", 
                    links: [{ label: "info@rccgimpacthouse.org", href: "mailto:info@rccgimpacthouse.org" }]
                  },
                  { 
                    icon: MapPin, 
                    title: "Visit Us", 
                    links: [{ label: "Ado-ekiti, Ekiti state, Nigeria.", href: "https://www.google.com/maps/search/Ado-ekiti,+Ekiti+state,+Nigeria" }]
                  },
                ].map((item) => (
                  <BorderGlow
                    key={item.title}
                    edgeSensitivity={20}
                    glowColor="12 45 72" // Rose gold HSL
                    backgroundColor="hsl(var(--midnight) / 0.4)"
                    borderRadius={24} // rounded-3xl is 24px
                    glowRadius={40}
                    glowIntensity={1.0}
                    colors={['#e2b091', '#ecc7b0', '#c28562']}
                    fillOpacity={0.06}
                    className="group border border-white/5 hover:border-transparent transition-all duration-300"
                  >
                    <div className="p-8 flex items-center gap-6 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-rose-gold group-hover:border-rose-gold transition-all duration-500">
                        <item.icon size={24} className="text-rose-gold group-hover:text-midnight transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-rose-gold/60 mb-1">{item.title}</p>
                        <div className="flex flex-col gap-1">
                          {item.links.map((link, idx) => (
                            <a 
                              key={idx}
                              href={link.href} 
                              className="text-xl font-bold text-foreground block hover:text-rose-gold transition-colors"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </BorderGlow>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="pt-8">
                <a
                  href="https://chat.whatsapp.com/F3GkUdjKLKX1lV0OmHmY8J?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 px-10 py-5 bg-green-600/10 border border-green-600/20 text-green-500 font-bold rounded-full hover:bg-green-600 hover:text-foreground transition-all duration-500 shadow-[0_0_30px_rgba(22,163,74,0.1)]"
                >
                  <MessageCircle size={24} />
                  Join WhatsApp Community
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Send a message */}
          <ScrollReveal delay={150}>
            <div className="glassmorphic p-12 rounded-[2.5rem] relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <h2 className="font-serif text-3xl font-bold text-foreground mb-10 leading-tight">
                Send a <span className="text-rose-gold group-hover:text-rose-gold-light">Message</span>
              </h2>
              <form
                className="space-y-8"
                onSubmit={handleSubmit}
              >
                <div className="space-y-4 group/field">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/65 block ml-4 group-focus-within/field:text-rose-gold transition-colors">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-8 py-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-foreground focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all text-sm font-medium placeholder:text-foreground/20"
                    placeholder="Discoverer Name"
                  />
                </div>
                <div className="space-y-4 group/field">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/65 block ml-4 group-focus-within/field:text-rose-gold transition-colors">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-8 py-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-foreground focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all text-sm font-medium placeholder:text-foreground/20"
                    placeholder="you@vision.com"
                  />
                </div>
                <div className="space-y-4 group/field">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/65 block ml-4 group-focus-within/field:text-rose-gold transition-colors">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-8 py-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-foreground focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all text-sm font-medium placeholder:text-foreground/20 resize-none"
                    placeholder="How can we help you discover purpose?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full px-10 py-5 bg-rose-gold text-midnight font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_10px_30px_rgba(226,176,145,0.2)] flex items-center justify-center gap-3",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <span>Broadcast Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* Social Media */}
      <section className="py-32 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6 block text-center">Digital Footprint</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-12 leading-tight">
              Connect <span className="text-rose-gradient">Anywhere</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {socialLinks.map((link, i) => (
              <ScrollReveal key={link.label} delay={i * 80}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group h-full rounded-[2rem]"
                >
                  <BorderGlow
                    edgeSensitivity={20}
                    glowColor={link.glowColor}
                    backgroundColor="hsl(var(--midnight) / 0.4)"
                    borderRadius={32} // rounded-[2rem] is 32px
                    glowRadius={40}
                    glowIntensity={1.0}
                    colors={link.colors}
                    fillOpacity={0.06}
                    className="h-full border border-white/5 group-hover:border-transparent transition-all duration-300"
                  >
                    <div className="p-8 flex flex-col items-center gap-6 relative z-10 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        {(() => {
                          const Icon = link.icon as React.ElementType;
                          return typeof Icon === 'function' && Icon.length > 0 ? (
                            <Icon className="w-8 h-8 text-rose-gold/80" />
                          ) : (
                            <Icon size={32} className="text-rose-gold/80" />
                          );
                        })()}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/65 group-hover:text-rose-gold transition-colors">{link.label}</span>
                    </div>
                  </BorderGlow>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
