import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Mail, Phone, MessageCircle, Facebook, Instagram, Youtube, MapPin } from "lucide-react";
import rccgLogo from "@/assets/rccg-logo.png";

const socialLinks = [
  { icon: MessageCircle, label: "WhatsApp Group", href: "https://chat.whatsapp.com/", color: "bg-green-600" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/18JkK3mSsk/", color: "bg-blue-700" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/rccg_imh?igsh=dzF4YXE3MTh0Y3Iy", color: "bg-pink-600" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@rccgimpacthouse?si=hvdckZIWnKjwiEgt", color: "bg-red-600" },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img 
          src={rccgLogo} 
          alt="" 
          className="w-[120%] max-w-none opacity-[0.07] dark:opacity-[0.1] grayscale"
        />
      </div>

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
                  { icon: Phone, title: "Call Us", val: "+234 801 234 5678", href: "tel:+2348012345678" },
                  { icon: Mail, title: "Email Us", val: "info@rccgimpacthouse.org", href: "mailto:info@rccgimpacthouse.org" },
                  { icon: MapPin, title: "Visit Us", val: "Lagos, Nigeria", href: null },
                ].map((item) => (
                  <div key={item.title} className="group glassmorphic p-8 rounded-3xl hover:border-rose-gold/30 transition-all duration-500">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-rose-gold group-hover:border-rose-gold transition-all duration-500">
                        <item.icon size={24} className="text-rose-gold group-hover:text-midnight transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-rose-gold/60 mb-1">{item.title}</p>
                        {item.href ? (
                          <a href={item.href} className="text-xl font-bold text-foreground block hover:text-rose-gold transition-colors">{item.val}</a>
                        ) : (
                          <p className="text-xl font-bold text-foreground">{item.val}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="pt-8">
                <a
                  href="https://chat.whatsapp.com/"
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
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  const subject = encodeURIComponent("Message from " + (data.get("name") || "Visitor"));
                  const body = encodeURIComponent(data.get("message") as string || "");
                  window.location.href = `mailto:info@rccgimpacthouse.org?subject=${subject}&body=${body}`;
                }}
              >
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/65 block ml-4">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-8 py-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-foreground focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all text-sm font-medium placeholder:text-foreground/20"
                    placeholder="Discoverer Name"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/65 block ml-4">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-8 py-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-foreground focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all text-sm font-medium placeholder:text-foreground/20"
                    placeholder="you@vision.com"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/65 block ml-4">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full px-8 py-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-foreground focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all text-sm font-medium placeholder:text-foreground/20 resize-none"
                    placeholder="How can we help you discover purpose?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-10 py-5 bg-rose-gold text-midnight font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_10px_30px_rgba(226,176,145,0.2)]"
                >
                  Broadcast Message
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
                  className="glassmorphic p-8 rounded-[2rem] flex flex-col items-center gap-6 group hover:translate-y-[-8px] transition-all duration-500 hover:border-rose-gold/40"
                >
                  <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <link.icon size={32} className="text-rose-gold/80" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/65 group-hover:text-rose-gold transition-colors">{link.label}</span>
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
