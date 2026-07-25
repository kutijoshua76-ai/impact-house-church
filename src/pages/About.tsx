import BackgroundWatermark from "@/components/BackgroundWatermark";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { churchPhotos } from "@/assets/church-photos";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />
      
      <Navbar />

      {/* Hero banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-midnight" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-gold/5 blur-[120px] rounded-full" />
        
        <div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8 animate-fade-up">
              Our Story
            </span>
            <h1
              className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9] animate-fade-up delay-100"
            >
              Beyond the <span className="text-rose-gradient">Visible</span>
            </h1>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up delay-200">
              Founded on faith, growing in grace, and making an impact in the lives of many.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Foundation */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <ScrollReveal>
            <div className="relative">
              <div className="absolute -inset-4 glassmorphic rounded-3xl -rotate-2 scale-95 opacity-50" />
              <img
                src={churchPhotos.ministering}
                alt="Pastor ministering"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6 block">The Foundation</span>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-8 leading-tight">
                  Built on <span className="text-rose-gold italic font-medium">Solid Rock</span>
                </h2>
                <div className="space-y-6 text-foreground/70 leading-relaxed font-medium text-lg">
                  <p>
                    RCCG Impact House was established with a divine mandate to raise a generation of young people who are deeply rooted in God's word and committed to making a lasting impact in their communities and beyond.
                  </p>
                  <p>
                    What began as a small fellowship of passionate believers has grown into a vibrant church family, united by a shared vision of spiritual growth and community service.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Growth */}
      <section className="py-32 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center text-right">
          <ScrollReveal>
            <div className="md:order-2 relative">
              <div className="absolute -inset-4 glassmorphic rounded-3xl rotate-2 scale-95 opacity-50" />
              <img
                src={churchPhotos.congregation2}
                alt="Growing congregation"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="md:order-1 space-y-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6 block">Our Evolution</span>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-8 leading-tight">
                  Journey of <span className="text-rose-gold italic font-medium">Grace</span>
                </h2>
                <div className="space-y-6 text-foreground/70 leading-relaxed font-medium text-lg">
                  <p>
                    Over the years, RCCG Impact House has experienced remarkable growth — not just in numbers, but in the depth of spiritual maturity among its members.
                  </p>
                  <p>
                    Today, the church stands as a testament to God's faithfulness, with a growing congregation of committed believers who are passionate about worship and service.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Youth Impact */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <ScrollReveal>
            <div className="relative">
              <div className="absolute -inset-4 glassmorphic rounded-3xl -rotate-1 scale-95 opacity-50" />
              <img
                src={churchPhotos.youth1}
                alt="Youth fellowship"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6 block">Our Heartbeat</span>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-8 leading-tight">
                  Empowering the <span className="text-rose-gradient">Next Gen</span>
                </h2>
                <div className="space-y-6 text-foreground/70 leading-relaxed font-medium text-lg">
                  <p>
                    The heartbeat of RCCG Impact House is its youth ministry. Countless young men and women have found purpose, direction, and spiritual grounding through our dedicated programs.
                  </p>
                  <p>
                    From career mentorship to leadership development — the church has been instrumental in shaping young lives and preparing them to be agents of change.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
