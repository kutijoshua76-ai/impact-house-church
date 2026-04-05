import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { churchPhotos } from "@/assets/church-photos";
import { Link } from "react-router-dom";
import { Users, BookOpen, Heart, Clock } from "lucide-react";
import rccgLogo from "@/assets/rccg-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img 
          src={rccgLogo} 
          alt="" 
          className="w-[120%] max-w-none opacity-[0.07] dark:opacity-[0.1] grayscale rotate-[10deg]"
        />
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
              Raise <span className="text-rose-gradient">Impact</span><br />
              Change <span className="text-rose-gold/80 italic font-medium">Lives</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/75 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              A vibrant community where purpose is discovered, potential is unleashed, and the love of Christ is made tangible.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-10 py-4 bg-rose-gold text-midnight font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(226,176,145,0.3)]"
              >
                Our Story
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-10 py-4 glassmorphic text-foreground font-bold rounded-full hover:bg-foreground/10 active:scale-95 transition-all duration-300"
              >
                Join Us
              </Link>
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
              { day: "Sunday", event: "First Service", time: "7:30 AM – 8:30 AM" },
              { day: "Sunday", event: "Sunday School", time: "8:30 AM – 9:30 AM" },
              { day: "Sunday", event: "Second Service", time: "9:30 AM – 11:30 AM" },
              { day: "Wednesday", event: "Bible Study", time: "5:00 PM – 6:30 PM" },
              { day: "Thursday", event: "Prayer Meeting", time: "5:00 PM – 7:00 PM" },
            ].map((s, i) => (
              <ScrollReveal key={`${s.day}-${s.event}`} delay={i * 100}>
                <div className="group glassmorphic rounded-[2rem] p-10 hover:scale-[1.02] transition-all duration-500 hover:border-rose-gold/30">
                  <Clock size={32} className="text-rose-gold/40 mx-auto mb-6 group-hover:text-rose-gold group-hover:scale-110 transition-all duration-500" />
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-rose-gold/60 mb-2">{s.day}</p>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{s.event}</h3>
                  <div className="w-10 h-px bg-foreground/10 mx-auto mb-4" />
                  <p className="text-foreground/65 text-sm uppercase tracking-widest font-medium">{s.time}</p>
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
