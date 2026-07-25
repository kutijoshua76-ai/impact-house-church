import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import csrHero from "@/assets/csr-hero.jpg";
import csrBio from "@/assets/csr-bio.jpg";
import csrVision from "@/assets/csr-vision.jpg";
import csrInitiativesCropped from "@/assets/csr-initiatives-cropped.jpg";

const googleDriveCsrLink = "https://drive.google.com/drive/folders/1Ntn40LxWkKHUwxKNoVLPIW6e2PCNMxHn?usp=drive_link";

const CSR = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero Section */}
        <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-midnight z-0">
            <img
              src={csrHero}
              alt="RCCG CSR Initiative"
              className="w-full h-full object-cover object-center scale-110 opacity-80"
            />
            {/* Gradient overlay for readability and cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/60 to-midnight/40" />
          </div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
            <ScrollReveal>
              <span className="inline-block px-5 py-2 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8 animate-fade-up shadow-xl shadow-black/20">
                Support Us
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl">
                Christian Social <br />
                <span className="text-rose-gold italic font-medium drop-shadow-lg">Responsibility</span>
              </h1>
              <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                Impacting lives and transforming communities globally through Christ's love and compassionate outreach.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4">
                <a
                  href={googleDriveCsrLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-black/20 transition hover:bg-white/15"
                >
                  Open CSR Google Drive Album
                </a>
              </div>
              <p className="mt-4 text-sm text-white/75 max-w-2xl mx-auto">
                If the link does not open, make sure your Google Drive folder is shared with “Anyone with the link” and that the URL points to a valid shared Drive folder.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Biography Section */}
        <section className="py-24 sm:py-32 relative overflow-hidden bg-foreground/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal>
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-8 border-background shadow-2xl glassmorphic">
                    <img
                      src={csrBio}
                      alt="RCCG CSR Impact"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="space-y-6 text-center lg:text-left">
                  <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-2 border border-rose-gold/20">
                    Who We Are
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground leading-tight">
                    Driven by <span className="text-rose-gold italic">Compassion</span>
                  </h2>
                  <p className="text-lg text-foreground/75 leading-relaxed font-medium">
                    The Christian Social Responsibility (CSR) arm of The Redeemed Christian Church of God (RCCG) is a faith-based initiative dedicated to community development, poverty alleviation, and humanitarian aid.
                  </p>
                  <p className="text-lg text-foreground/75 leading-relaxed font-medium">
                    Operating globally through the His Love Foundation, it focuses on showing Christ's love by supporting the vulnerable, empowering local communities, and partnering with governments to achieve the United Nations Sustainable Development Goals.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Vision & Mandate Section */}
        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-rose-gold/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal delay={100}>
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                  <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-2 border border-rose-gold/20">
                    Our Mandate
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground leading-tight">
                    Biblical <span className="text-rose-gold italic">Foundation</span>
                  </h2>
                  <p className="text-lg text-foreground/75 leading-relaxed font-medium">
                    RCCG IMPACT HOUSE CSR anchors its mandate in biblical teachings that instruct believers to care for the poor, the weak, and the marginalized.
                  </p>
                  
                  <div className="p-6 my-8 rounded-3xl glassmorphic border border-rose-gold/20 relative">
                    <div className="absolute -top-3 -left-2 text-6xl text-rose-gold/20 font-serif leading-none">"</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Vision Statement</h3>
                    <p className="text-lg text-foreground/80 italic">
                      Help for the helpless. Hope for the hopeless. Food for the hungry. Strength for the weak.
                    </p>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 mt-8">Global Objectives</h3>
                  <p className="text-lg text-foreground/75 leading-relaxed font-medium">
                    To implement tailored, sustainable initiatives in both urban and displaced communities.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="relative w-full max-w-md aspect-square">
                    {/* Fancy Shape Wrapper */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-gold/40 to-transparent rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-pulse-ring blur-md" />
                    <div className="relative w-full h-full overflow-hidden border-[6px] border-background shadow-2xl transition-all duration-700 hover:rounded-[50%] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] hover:scale-[1.02]">
                      <img
                        src={csrVision}
                        alt="RCCG CSR Vision"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Core Initiatives Section */}
        <section className="py-24 sm:py-32 relative overflow-hidden bg-foreground/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal>
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-full max-w-sm lg:max-w-md aspect-[4/5] rounded-t-[1000px] rounded-b-[40px] overflow-hidden border-[8px] border-rose-gold/10 shadow-2xl glassmorphic transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img
                      src={csrInitiativesCropped}
                      alt="RCCG Core Initiatives"
                      className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] pointer-events-none" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="space-y-6 text-left">
                  <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-2 border border-rose-gold/20">
                    Core Initiatives
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground leading-tight">
                    The Redeemed Christian <br/><span className="text-rose-gold italic">Church of God</span>
                  </h2>
                  
                  <div className="space-y-6 mt-8">
                    <div className="p-6 rounded-2xl glassmorphic border border-rose-gold/10 hover:border-rose-gold/30 transition-colors">
                      <h3 className="text-xl font-bold text-rose-gold mb-2">Social & Health</h3>
                      <p className="text-foreground/80 leading-relaxed font-medium">
                        Providing daily sustenance to the needy, sponsoring medical outreaches, renovating public health centers, and setting up Intensive Care Units (ICUs) in major hospitals.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl glassmorphic border border-rose-gold/10 hover:border-rose-gold/30 transition-colors">
                      <h3 className="text-xl font-bold text-rose-gold mb-2">Education</h3>
                      <p className="text-foreground/80 leading-relaxed font-medium">
                        Offering scholarships, rehabilitating schools, and providing basic learning materials.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl glassmorphic border border-rose-gold/10 hover:border-rose-gold/30 transition-colors">
                      <h3 className="text-xl font-bold text-rose-gold mb-2">Business & Empowerment</h3>
                      <p className="text-foreground/80 leading-relaxed font-medium">
                        Training unemployed youth, supporting micro-businesses, and organizing skill acquisition programs in partnership with state ministries.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl glassmorphic border border-rose-gold/10 hover:border-rose-gold/30 transition-colors">
                      <h3 className="text-xl font-bold text-rose-gold mb-2">Disaster Relief</h3>
                      <p className="text-foreground/80 leading-relaxed font-medium">
                        Distributing food, dignity kits, and emergency shelter materials to populations devastated by natural disasters across the globe.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CSR;
