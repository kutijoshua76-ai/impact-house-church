import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import zonalPastor from "@/assets/province-pastor.jpg";
import pastorWife from "@/assets/pastor-wife.jpg";
import generalOverseer from "@/assets/general-overseer.jpg";
import rccgLogo from "@/assets/rccg-logo.png";

const leaders = [
  {
    name: "Pastor E.A. Adeboye",
    role: "General Overseer, RCCG Worldwide",
    image: generalOverseer,
    bio: "The revered General Overseer of the Redeemed Christian Church of God, Pastor E.A. Adeboye has led the church with wisdom and grace for decades, overseeing its growth into a global ministry impacting millions of lives across the world. He is a man of God who has dedicated his life to the service of God and the nuturing of His people.",
  },
  {
    name: "Pastor (Mrs.) Folu Adeboye",
    role: "Mother-in-Israel, RCCG",
    image: pastorWife,
    bio: "A pillar of strength and grace, she has faithfully served alongside the General Overseer, nurturing the women's ministry and inspiring generations of women to walk in faith and purpose.",
  },
];

const otherMinisters = [
  { name: "Pastor Kehinde Adeyele (Kaytom)", role: "Assistant Zonal Pastor" },
  { name: "Pastor Dami Olajide", role: "Youth Pastor" },
  { name: "Pastor Mrs. Doyin Olatunji", role: "Women's Fellowship Coordinator" },
];

const Leaders = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img
          src={rccgLogo}
          alt=""
          className="w-[120%] max-w-none opacity-[0.07] dark:opacity-[0.1] grayscale rotate-[15deg]"
        />
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-midnight overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-gold/5 blur-[120px] rounded-full" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8 animate-fade-up">
              Meet Our Leaders
            </span>
            <h1
              className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9] animate-fade-up delay-100"
            >
              Our Spiritual <span className="text-rose-gradient">Shepherds</span>
            </h1>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up delay-200">
              Shepherds after God's own heart — guiding, nurturing, and empowering the body of Christ.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Zonal Pastor — headline feature */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="grid md:grid-cols-5 gap-20 items-center">
              <div className="md:col-span-2 relative">
                <div className="absolute -inset-4 glassmorphic rounded-3xl -rotate-2 scale-95 opacity-50" />
                <img
                  src={zonalPastor}
                  alt="Zonal Pastor"
                  className="relative rounded-2xl shadow-2xl w-full aspect-[3/4] object-cover"
                />
              </div>
              <div className="md:col-span-3 space-y-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-4 block">Zonal Pastor</span>
                  <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                    Pastor Enoch <span className="text-rose-gold italic">Olatunji</span>
                  </h2>
                  <p className="text-xl text-rose-gold/80 font-medium mb-10 tracking-wide">Zonal Pastor, RCCG Impact Zonal Parish</p>

                  <div className="space-y-6 text-foreground/70 leading-relaxed font-medium text-lg">
                    <p>
                      Pastor Enoch Olatunji is a man of deep faith, unwavering vision, and compassionate leadership. Called into ministry at a young age, he has dedicated his life to the service of God and the nurturing of His people.
                    </p>
                    <p>
                      Under his leadership, the zone has witnessed tremendous growth. His passion for youth development and community transformation has been the driving force behind many of the church's most impactful programmes.
                    </p>
                    <p>
                      He is happily married to Pastor (Mrs.) D.O. Olatunji, and together they lead the zonal parish with grace, unity, and an infectious love for God and His people.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* General Overseer & other key leaders */}
      <section className="py-31 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6 block">Foundation Pillars</span>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
                Pillars of <span className="text-rose-gradient">Our Faith</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12">
            {leaders.map((leader, i) => (
              <ScrollReveal key={leader.name} delay={i * 120}>
                <div className="group glassmorphic rounded-[2.5rem] overflow-hidden hover:translate-y-[-8px] transition-all duration-500 hover:border-rose-gold/30">
                  <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-10 space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-foreground">{leader.name}</h3>
                    <p className="text-rose-gold/60 text-sm font-bold uppercase tracking-widest">{leader.role}</p>
                    <p className="text-foreground/65 text-sm leading-relaxed font-medium">{leader.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Other ministers */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-gold/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4 leading-tight">
                Stewards of <span className="text-rose-gold">Service</span>
              </h2>
              <p className="text-foreground/30 text-sm uppercase tracking-[0.2em] font-medium">Faithful servants working tirelessly in God's vineyard.</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 md:max-w-4xl mx-auto gap-8">
            {otherMinisters.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 80}>
                <div className="glassmorphic rounded-2xl p-8 hover:bg-foreground/5 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center mb-6 group-hover:bg-rose-gold group-hover:border-rose-gold transition-all duration-500">
                    <span className="font-serif font-bold text-rose-gold text-lg group-hover:text-midnight transition-colors">
                      {m.name.split(" ").pop()?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2">{m.name}</h3>
                    <p className="text-foreground/65 text-xs uppercase tracking-widest font-medium">{m.role}</p>
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

export default Leaders;
