import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { 
  MessageSquare, Calendar, User, 
  Mail, Send, Quote, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";


const Testimony = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    story: "",
    date: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Terminal Logging
    console.log("%c[FORM_SUBMISSION]", "color: #e2b091; font-weight: bold", {
      form: "Testimony Submission",
      timestamp: new Date().toISOString(),
      data: formData
    });

    try {
      const { error } = await supabase
        .from('testimonies')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          title: formData.title,
          content: formData.story,
          event_date: formData.date
        }]);

      if (error) throw error;

      toast({
        title: "Testimony Shared!",
        description: "Thank you for sharing God's goodness. It will be reviewed and published soon.",
      });

      setFormData({
        fullName: "",
        email: "",
        title: "",
        story: "",
        date: ""
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An error occurred while sharing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8 animate-fade-up">
              Share Your Victory
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Victories & <span className="text-rose-gradient">Wonders</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed">
              Tell the world what God has done. Your testimony could be the spark that ignites someone else's faith.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="pb-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal delay={200}>
            <div className="glassmorphic rounded-[3rem] p-8 md:p-16 border-white/5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-rose-gold/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
              
              <form onSubmit={handleSubmit} className="space-y-16 relative z-10">
                {/* Section 1: Identity */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <User size={20} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold uppercase tracking-widest text-foreground/90">Your Identity</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 group/field">
                      <label htmlFor="fullName" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within/field:text-rose-gold transition-colors" size={18} />
                        <input 
                          required
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3 group/field">
                      <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within/field:text-rose-gold transition-colors" size={18} />
                        <input 
                          required
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: The Victory */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Sparkles size={20} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold uppercase tracking-widest text-foreground/90">The Victory</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 group/field">
                      <label htmlFor="title" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Testimony Title</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within/field:text-rose-gold transition-colors" size={18} />
                        <input 
                          required
                          id="title"
                          type="text"
                          placeholder="e.g., God Answered My Prayers"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3 group/field">
                      <label htmlFor="date" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Date of Wonder</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within/field:text-rose-gold transition-colors" size={18} />
                        <input 
                          required
                          id="date"
                          type="date"
                          title="Date of Wonder"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: The Story */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Quote size={20} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold uppercase tracking-widest text-foreground/90">Your Story</h2>
                  </div>
                  
                  <div className="space-y-3 group/field">
                    <label htmlFor="story" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Tell Us Everything</label>
                    <textarea 
                      required
                      id="story"
                      rows={8}
                      placeholder="Share the details of God's goodness in your life..."
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-10 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10 resize-none font-medium leading-relaxed"
                      value={formData.story}
                      onChange={(e) => setFormData({...formData, story: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <button
                    disabled={isSubmitting}
                    className={cn(
                      "group relative px-20 py-6 bg-rose-gradient text-midnight font-bold rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 outline-none",
                      isSubmitting ? "cursor-wait" : ""
                    )}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                          <span>Publishing Victory...</span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-widest uppercase text-sm">Share Victory</span>
                          <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimony;
