import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { churchPhotos } from "@/assets/church-photos";
import { Hammer, Users, Lightbulb, ArrowRight, Copy, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import BorderGlow from "@/components/ui/border-glow";

const ProjectFunding = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const projects = [
    {
      id: "csr",
      title: "Christian Social Responsibility (CSR)",
      description: "Building a dedicated space for community empowerment, food bank, and skills acquisition programs.",
      progress: 65,
      icon: Users,
      link: "/csr"
    },
    {
      id: "sanctuary",
      title: "Sanctuary Expansion",
      description: "Expanding our main worship arena to accommodate the growing number of young worshippers and families.",
      progress: 40,
      icon: Hammer,
      bankInfo: {
        accountNo: "0040098913",
        accountName: "RCCG IMPACT HOUSE",
        bankName: "PREMIUM TRUST BANK",
      }
    },
    {
      id: "media",
      title: "Media & Tech Upgrade",
      description: "Upgrading our broadcast equipment to reach more people globally through high-quality digital ministry.",
      progress: 85,
      icon: Lightbulb,
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleProject = (id: string) => {
    setActiveProject(activeProject === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-midnight/60 backdrop-blur-sm z-[-1]" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8">
              Kingdom Investment
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Sowing into <span className="text-rose-gradient">Legacy</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/75 max-w-3xl mx-auto font-medium leading-relaxed">
              Join us in building the infrastructure for the next generation. Your partnership funds the physical and spiritual growth of our community.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => {
              const isActive = activeProject === project.id;
              const CardContent = (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-rose-gold/10 flex items-center justify-center mb-8 group-hover:bg-rose-gold group-hover:scale-110 transition-all duration-500">
                    <project.icon className="text-rose-gold group-hover:text-midnight transition-colors duration-500" size={28} />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{project.title}</h3>
                  <p className="text-foreground/70 mb-8 leading-relaxed font-medium">
                    {project.description}
                  </p>

                  {/* Static Bank Details */}
                  {project.bankInfo && (
                    <div className="mb-8 space-y-4 animate-fade-in" onClick={(e) => e.preventDefault()}>
                      <div className="p-6 rounded-3xl bg-midnight/40 border border-white/5 space-y-4 shadow-inner">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60 font-bold mb-2">Project Account Number</p>
                          <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                            <code className="text-xl font-bold text-foreground tracking-wider">{project.bankInfo.accountNo}</code>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleCopy(project.bankInfo.accountNo, project.id);
                              }}
                              className="p-2 rounded-lg bg-rose-gold/10 text-rose-gold hover:bg-rose-gold hover:text-midnight transition-all duration-300"
                              title="Copy Account Number"
                            >
                              {copied === project.id ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60 font-bold mb-1">Account Name</p>
                            <p className="text-[11px] font-bold text-foreground/90 uppercase leading-tight">{project.bankInfo.accountName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60 font-bold mb-1">Bank Name</p>
                            <p className="text-[11px] font-bold text-foreground/90 uppercase leading-tight">{project.bankInfo.bankName}</p>
                          </div>
                        </div>
                      </div>
                      {copied === project.id && (
                        <p className="text-[10px] text-rose-gold font-bold uppercase tracking-[0.3em] animate-pulse text-center">
                          Copied to clipboard
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4 mt-auto">
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 italic">Active Phase</span>
                      </div>
                      {!project.bankInfo && !project.link && (
                        <span className="text-rose-gold/40 text-[10px] font-bold uppercase tracking-widest">Ongoing Project</span>
                      )}
                      {project.link && (
                        <span className="text-rose-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Details <ArrowRight size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </>
              );

              return (
                <ScrollReveal key={project.title} delay={i * 100}>
                  {project.link ? (
                    <Link to={project.link} className="block group h-full">
                      <BorderGlow
                        edgeSensitivity={20}
                        glowColor="12 45 72" // Rose gold HSL
                        backgroundColor="hsl(var(--midnight) / 0.4)"
                        borderRadius={40}
                        glowRadius={50}
                        glowIntensity={1.0}
                        colors={['#e2b091', '#ecc7b0', '#c28562']}
                        fillOpacity={0.06}
                        className="h-full border border-white/5 group-hover:border-transparent transition-all duration-300"
                      >
                        <div className="p-10 flex flex-col h-full relative z-10 text-left">
                          {CardContent}
                        </div>
                      </BorderGlow>
                    </Link>
                  ) : (
                    <button 
                      className="block group h-full w-full text-left"
                      onClick={() => toggleProject(project.id)}
                    >
                      <BorderGlow
                        edgeSensitivity={20}
                        glowColor="12 45 72" // Rose gold HSL
                        backgroundColor={isActive ? "hsl(var(--midnight) / 0.6)" : "hsl(var(--midnight) / 0.4)"}
                        borderRadius={40}
                        glowRadius={50}
                        glowIntensity={isActive ? 1.5 : 1.0}
                        animated={isActive}
                        colors={['#e2b091', '#ecc7b0', '#c28562']}
                        fillOpacity={0.06}
                        className={cn(
                          "h-full border transition-all duration-300",
                          isActive ? "border-rose-gold/40 shadow-[0_0_20px_rgba(226,176,145,0.15)]" : "border-white/5 group-hover:border-transparent"
                        )}
                      >
                        <div className="p-10 flex flex-col h-full relative z-10 text-left">
                          {CardContent}
                        </div>
                      </BorderGlow>
                    </button>
                  )}
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Vision & Report Form */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-gold/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Quick Donation Report Form */}
          <ScrollReveal>
            <div className="max-w-2xl mx-auto glassmorphic rounded-[2.5rem] p-10 border border-white/5 mb-24">
              <h3 className="font-serif text-2xl font-bold text-center mb-2">Report your <span className="text-rose-gradient">Investment</span></h3>
              <p className="text-xs text-center text-foreground/40 uppercase tracking-[0.2em] font-bold mb-8">Let us know you've supported a project</p>
              
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const amount = formData.get('amount');
                  const donor_name = formData.get('name');
                  const project = formData.get('project');
                  
                  // Terminal Logging
                  console.log("%c[FORM_SUBMISSION]", "color: #e2b091; font-weight: bold", {
                    form: "Donation Report (Project)",
                    timestamp: new Date().toISOString(),
                    data: { donor_name, amount, project, type: 'project' }
                  });

                  const { error } = await supabase.from('donations').insert([{
                    amount: Number(amount),
                    donor_name,
                    type: 'project',
                  }]);

                  if (error) {
                    alert('Error reporting donation: ' + error.message);
                  } else {
                    alert('Thank you for your investment! Your contribution has been recorded.');
                    (e.target as HTMLFormElement).reset();
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 ml-2">Full Name</label>
                    <input name="name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 ml-2">Amount (₦)</label>
                    <input name="amount" type="number" required placeholder="10000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-rose-gradient text-midnight font-bold rounded-2xl uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-rose-gold/20">
                  Submit Project Seed Report
                </button>
              </form>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <ScrollReveal>
                <div className="relative aspect-video rounded-3xl overflow-hidden glassmorphic p-1">
                  <img 
                    src={churchPhotos.action8} 
                    alt="Future Vision" 
                    className="w-full h-full object-cover rounded-[1.4rem]"
                  />
                </div>
              </ScrollReveal>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <ScrollReveal delay={200}>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-4 block">Our Vision</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                  Transparent <br />& Faith-Led <span className="text-rose-gold italic">Growth</span>
                </h2>
                <p className="text-lg text-foreground/75 leading-relaxed font-medium">
                  We believe that every donation is a trust given to us by God through His people. Our project funding is managed with the highest level of integrity, regular reporting, and a clear focus on community impact.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <div className="px-6 py-3 rounded-2xl glassmorphic border-rose-gold/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-gold" />
                    <span className="text-sm font-bold">Quarterly Reports</span>
                  </div>
                  <div className="px-6 py-3 rounded-2xl glassmorphic border-rose-gold/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-gold" />
                    <span className="text-sm font-bold">Project Updates</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectFunding;
