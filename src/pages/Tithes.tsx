import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { churchPhotos } from "@/assets/church-photos";
import { Heart, Coins, Landmark, ArrowRight, ShieldCheck, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import BorderGlow from "@/components/ui/border-glow";

const Tithes = () => {
  const [activeDetails, setActiveDetails] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const bankInfo = {
    accountNo: "0040198679",
    accountName: "RCCG IMPACT HOUSE",
    bankName: "PREMIUM TRUST BANK",
  };

  const givingMethods = [
    {
      id: "transfer",
      icon: Landmark,
      title: "Bank Transfer",
      description: "Transfer directly from your bank app or at the branch. Secure and direct.",
      details: "Click to view church bank account details for direct transfers.",
      tag: "Direct",
      hasBankDetails: true
    },
    {
      id: "offering",
      icon: Coins,
      title: "Offering & Tithes",
      description: "Give your regular offering and tithes during our physical worship services.",
      details: "Available during all Sunday and weekday services. Also supports bank transfer.",
      tag: "In-Person",
      hasBankDetails: true
    },
    {
      id: "seed",
      icon: Heart,
      title: "Special Seed",
      description: "Sow a special seed for breakthroughs or as an act of faith.",
      details: "Can be done via any of our giving channels including bank transfer.",
      tag: "Voluntary",
      hasBankDetails: true
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleDetails = (id: string) => {
    setActiveDetails(activeDetails === id ? null : id);
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
              Kingdom Partnership
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Worship through <span className="text-rose-gradient">Giving</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/75 max-w-3xl mx-auto font-medium leading-relaxed">
              "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {givingMethods.map((method, i) => {
              const isActive = activeDetails === method.id;
              return (
                <ScrollReveal key={method.title} delay={i * 100}>
                  <div className="h-full" onClick={() => toggleDetails(method.id)}>
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
                        "h-full cursor-pointer border transition-all duration-500",
                        isActive ? "border-rose-gold/40 shadow-[0_0_20px_rgba(226,176,145,0.15)]" : "border-white/5 hover:border-rose-gold/20"
                      )}
                    >
                      <div className="p-10 flex flex-col h-full relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-rose-gold/10 flex items-center justify-center mb-8 group-hover:bg-rose-gold group-hover:scale-110 transition-all duration-500">
                          <method.icon className="text-rose-gold group-hover:text-midnight transition-colors duration-500" size={28} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-gold/60 mb-3">{method.tag}</span>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-serif text-2xl font-bold text-foreground">{method.title}</h3>
                        </div>
                        <p className="text-foreground/75 mb-8 leading-relaxed font-medium">
                          {method.description}
                        </p>

                        {/* Static Bank Details */}
                        {method.hasBankDetails && (
                          <div className="mb-8 space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 rounded-3xl bg-midnight/40 border border-white/5 space-y-4 shadow-inner">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60 font-bold mb-2">Account Number</p>
                                <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                                  <code className="text-xl font-bold text-foreground tracking-wider">{bankInfo.accountNo}</code>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(bankInfo.accountNo, method.id);
                                    }}
                                    className="p-2 rounded-lg bg-rose-gold/10 text-rose-gold hover:bg-rose-gold hover:text-midnight transition-all duration-300"
                                    title="Copy Account Number"
                                  >
                                    {copied === method.id ? <Check size={16} /> : <Copy size={16} />}
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60 font-bold mb-1">Account Name</p>
                                  <p className="text-[11px] font-bold text-foreground/90 uppercase leading-tight">{bankInfo.accountName}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold/60 font-bold mb-1">Bank Name</p>
                                  <p className="text-[11px] font-bold text-foreground/90 uppercase leading-tight">{bankInfo.bankName}</p>
                                </div>
                              </div>
                            </div>
                            {copied === method.id && (
                              <p className="text-[10px] text-rose-gold font-bold uppercase tracking-[0.3em] animate-pulse text-center">
                                Copied to clipboard
                              </p>
                            )}
                          </div>
                        )}

                        <div className="pt-6 border-t border-white/5 mt-auto">
                          <p className="text-xs text-foreground/40 italic font-medium leading-relaxed">
                            {method.details.replace("Click to view ", "")}
                          </p>
                        </div>
                      </div>
                    </BorderGlow>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Secure Message & Report Form */}
          <ScrollReveal delay={400}>
            <div className="mt-20 space-y-10">
              <div className="glassmorphic rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-8 border border-rose-gold/10">
                <div className="flex items-center gap-4 text-rose-gold">
                  <ShieldCheck size={40} className="flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl font-bold text-foreground">Secure & Transparent</h4>
                    <p className="text-sm text-foreground/60 font-medium tracking-wide">Every seed sown is accounted for and dedicated to building the Kingdom.</p>
                  </div>
                </div>
                <div className="h-px w-full md:w-px md:h-12 bg-white/10" />
                <a 
                  href="tel:08062475927"
                  className="px-10 py-4 bg-rose-gold text-midnight font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_5px_20px_rgba(226,176,145,0.2)]"
                >
                  Contact for more enquiries
                </a>
              </div>

              {/* Quick Donation Report Form */}
              <div className="max-w-2xl mx-auto glassmorphic rounded-[2.5rem] p-10 border border-white/5">
                <h3 className="font-serif text-2xl font-bold text-center mb-2">Report your <span className="text-rose-gradient">Giving</span></h3>
                <p className="text-xs text-center text-foreground/40 uppercase tracking-[0.2em] font-bold mb-8">Let us know you've sown a seed</p>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const amount = formData.get('amount');
                    const donor_name = formData.get('name');
                    
                    // Terminal Logging
                    console.log("%c[FORM_SUBMISSION]", "color: #e2b091; font-weight: bold", {
                      form: "Donation Report (Tithes)",
                      timestamp: new Date().toISOString(),
                      data: { donor_name, amount, type: 'tithe' }
                    });

                    const { error } = await supabase.from('donations').insert([{
                      amount: Number(amount),
                      donor_name,
                      type: 'tithe'
                    }]);

                    if (error) {
                      alert('Error reporting donation: ' + error.message);
                    } else {
                      alert('Thank you for your partnership! Your seed has been recorded.');
                      (e.target as HTMLFormElement).reset();
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 ml-2">Your Name</label>
                      <input name="name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 ml-2">Amount (₦)</label>
                      <input name="amount" type="number" required placeholder="5000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-rose-gradient text-midnight font-bold rounded-2xl uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-rose-gold/20">
                    Submit Giving Report
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Photo Section */}
      <section className="py-24 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="space-y-8">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                  Your Impact <br />in <span className="text-rose-gold italic">Action</span>
                </h2>
                <p className="text-lg text-foreground/75 leading-relaxed font-medium">
                  When you give to RCCG Impact House, you are directly supporting our mission to raise a generation of leaders, touch lives in our community, and spread the message of hope and transformation across the globe.
                </p>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-rose-gold" />
                    <span className="font-medium">Scaling mission outreach programs</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-rose-gold" />
                    <span className="font-medium">Maintaining our worship facilities</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-rose-gold" />
                    <span className="font-medium">Empowering the youth through scholarships</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 glassmorphic rounded-3xl rotate-2 opacity-40" />
                <img 
                  src={churchPhotos.action1} 
                  alt="Community Impact" 
                  className="relative rounded-2xl shadow-2xl w-full h-[450px] object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tithes;
