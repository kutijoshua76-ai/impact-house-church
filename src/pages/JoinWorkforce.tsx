import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  User, Mail, Phone, Send, CheckCircle2, Heart,
  ArrowLeft, ChevronRight, Briefcase, Music, Radio,
  Info, Wrench, Mic2, BookOpen, Globe, Package,
  Anchor, Guitar, Home, Sparkles, UserCheck,
  HandMetal, BookMarked, SmileIcon, Stethoscope,
  Shield, Users, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { notifyAdmins } from "@/lib/notifications";

// ─── Departments ───────────────────────────────────────────────────────────────
const departments = [
  {
    id: "ushering",
    name: "Ushering",
    icon: Users,
    color: "from-sky-500/20 to-sky-600/10",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-400",
    description: "Welcome worshippers and maintain order during services with warmth and professionalism.",
  },
  {
    id: "protocol",
    name: "Protocol",
    icon: Shield,
    color: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-400",
    description: "Coordinate VIP and guest management, ensuring excellent hospitality at all church events.",
  },
  {
    id: "media",
    name: "Media",
    icon: Radio,
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
    badge: "bg-violet-500/10 text-violet-400",
    description: "Drive our digital presence through photography, videography, and social media content.",
  },
  {
    id: "information-unit",
    name: "Information Unit",
    icon: Info,
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-400",
    description: "Manage church communications, bulletins, and keep the congregation informed and connected.",
  },
  {
    id: "technical-unit",
    name: "Technical Unit",
    icon: Wrench,
    color: "from-orange-500/20 to-orange-600/10",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    badge: "bg-orange-500/10 text-orange-400",
    description: "Handle sound systems, lighting, and technical infrastructure for all church operations.",
  },
  {
    id: "choir",
    name: "Choir",
    icon: Music,
    color: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-400",
    description: "Lead the congregation in worship through the ministry of song and choral excellence.",
  },
  {
    id: "maintenance-unit",
    name: "Maintenance Unit",
    icon: Wrench,
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400",
    description: "Keep God's house in excellent condition through facility care and maintenance.",
  },
  {
    id: "evangelism",
    name: "Evangelism",
    icon: Globe,
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    badge: "bg-green-500/10 text-green-400",
    description: "Share the gospel and reach the lost through outreach programs and community engagements.",
  },
  {
    id: "charging-unit",
    name: "Charging Unit",
    icon: Zap,
    color: "from-yellow-500/20 to-yellow-600/10",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-400",
    description: "Energize and spiritually charge members through targeted prayer and intercession drives.",
  },
  {
    id: "csr",
    name: "CSR",
    icon: Heart,
    color: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    badge: "bg-pink-500/10 text-pink-400",
    description: "Champion community service and social responsibility projects that bless our neighborhoods.",
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: Package,
    color: "from-teal-500/20 to-teal-600/10",
    border: "border-teal-500/30",
    iconColor: "text-teal-400",
    badge: "bg-teal-500/10 text-teal-400",
    description: "Coordinate equipment, resources, and supply chain for smooth church operations and events.",
  },
  {
    id: "anchor",
    name: "Anchor",
    icon: Anchor,
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400",
    description: "Serve as the authoritative voice on stage — host services, special events, and programs.",
  },
  {
    id: "instrumentalist",
    name: "Instrumentalist",
    icon: Guitar,
    color: "from-fuchsia-500/20 to-fuchsia-600/10",
    border: "border-fuchsia-500/30",
    iconColor: "text-fuchsia-400",
    badge: "bg-fuchsia-500/10 text-fuchsia-400",
    description: "Play musical instruments to enrich worship experiences and create an atmosphere of God's presence.",
  },
  {
    id: "house-fellowship-unit",
    name: "House Fellowship Unit",
    icon: Home,
    color: "from-lime-500/20 to-lime-600/10",
    border: "border-lime-500/30",
    iconColor: "text-lime-400",
    badge: "bg-lime-500/10 text-lime-400",
    description: "Lead and facilitate intimate small-group meetings that deepen community and Bible study.",
  },
  {
    id: "sparkles-unit",
    name: "Sparkles Unit",
    icon: Sparkles,
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-400",
    description: "Minister to children through creative, engaging programs that introduce them to God's love.",
  },
  {
    id: "follow-up-unit",
    name: "Follow Up Unit",
    icon: Users,
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
    description: "Reach out to first-timers and absentees, ensuring no one falls through the cracks of the family.",
  },
  {
    id: "drama-unit",
    name: "Drama Unit",
    icon: Mic2,
    color: "from-red-500/20 to-red-600/10",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    badge: "bg-red-500/10 text-red-400",
    description: "Use the power of drama and creative arts to communicate biblical truths in a compelling way.",
  },
  {
    id: "prayer-unit",
    name: "Prayer Unit",
    icon: HandMetal,
    color: "from-gold-500/20 to-amber-600/10",
    border: "border-amber-600/30",
    iconColor: "text-amber-300",
    badge: "bg-amber-500/10 text-amber-300",
    description: "Intercede for the church, nation, and world through dedicated prayer watches and altars.",
  },
  {
    id: "sunday-school-unit",
    name: "Sunday School Unit",
    icon: BookOpen,
    color: "from-sky-600/20 to-blue-600/10",
    border: "border-sky-600/30",
    iconColor: "text-sky-300",
    badge: "bg-sky-600/10 text-sky-300",
    description: "Teach and disciple members of all ages through structured, Bible-based education programs.",
  },
  {
    id: "greeters-unit",
    name: "Greeters Unit",
    icon: SmileIcon,
    color: "from-orange-400/20 to-orange-500/10",
    border: "border-orange-400/30",
    iconColor: "text-orange-300",
    badge: "bg-orange-400/10 text-orange-300",
    description: "Be the first smile people see — create a warm, welcoming atmosphere at every entrance.",
  },
  {
    id: "medical-unit",
    name: "Medical Unit",
    icon: Stethoscope,
    color: "from-red-400/20 to-rose-500/10",
    border: "border-red-400/30",
    iconColor: "text-red-300",
    badge: "bg-red-400/10 text-red-300",
    description: "Provide first aid, health screenings, and emergency care support during church programs.",
  },
];

const ageRanges = ["Under 18", "18–25", "26–35", "36–45", "46–60", "60+"];
const availabilityOptions = ["Weekends only", "Weekdays only", "Both weekends & weekdays", "Flexible / As needed"];

// ─── Component ─────────────────────────────────────────────────────────────────
const JoinWorkforce = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "form" | "success">("select");
  const [selectedDept, setSelectedDept] = useState<typeof departments[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    ageRange: "",
    reason: "",
    experience: "",
    availability: "",
  });

  const handleSelectDept = (dept: typeof departments[0]) => {
    setSelectedDept(dept);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("workforce_applications").insert([{
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        age_range: formData.ageRange,
        department: selectedDept.name,
        reason: formData.reason,
        experience: formData.experience,
        availability: formData.availability,
      }]);

      if (error) throw error;

      // Trigger admin email notification via Resend
      notifyAdmins('workforce', {
        ...formData,
        department: selectedDept.name,
      });

      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("select");
    setSelectedDept(null);
    setFormData({ fullName: "", email: "", phone: "", gender: "", ageRange: "", reason: "", experience: "", availability: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />

      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-midnight/60 backdrop-blur-sm z-[-1]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8">
              Kingdom Service
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Join the <span className="text-rose-gradient">Workforce</span>
            </h1>
            <p className="text-xl text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed">
              Discover your place in the body of Christ. Select a department that aligns with your gifts and passion — then register to serve.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Step Indicator ── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-center gap-4">
          {[
            { label: "Choose Dept.", step: "select" },
            { label: "Register", step: "form" },
            { label: "Done!", step: "success" },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-4">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
                step === s.step
                  ? "bg-rose-gold text-midnight shadow-lg shadow-rose-gold/20"
                  : (step === "form" && s.step === "select") || step === "success"
                  ? "bg-foreground/10 text-foreground/40 line-through"
                  : "bg-foreground/5 text-foreground/30"
              )}>
                <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[9px]">{i + 1}</span>
                {s.label}
              </div>
              {i < 2 && <ChevronRight size={14} className="text-foreground/20" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="pb-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6">

          {/* STEP 1 — Department Grid */}
          {step === "select" && (
            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => handleSelectDept(dept)}
                      className={cn(
                        "group relative glassmorphic rounded-[2rem] p-8 text-left border transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] overflow-hidden",
                        dept.border
                      )}
                    >
                      {/* Gradient glow */}
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", dept.color)} />

                      <div className="relative z-10">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                          dept.badge
                        )}>
                          <Icon size={26} className={dept.iconColor} />
                        </div>

                        <h3 className="font-serif text-lg font-bold mb-3 group-hover:text-foreground transition-colors">{dept.name}</h3>
                        <p className="text-xs text-foreground/50 leading-relaxed group-hover:text-foreground/70 transition-colors">{dept.description}</p>

                        <div className={cn(
                          "mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                          dept.iconColor
                        )}>
                          Join Unit <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>
          )}

          {/* STEP 2 — Registration Form */}
          {step === "form" && selectedDept && (
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                {/* Back button */}
                <button
                  onClick={() => setStep("select")}
                  className="mb-8 flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm font-medium"
                >
                  <ArrowLeft size={16} /> Back to departments
                </button>

                {/* Selected Dept Badge */}
                <div className={cn(
                  "inline-flex items-center gap-3 glassmorphic px-6 py-3 rounded-2xl border mb-10",
                  selectedDept.border
                )}>
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", selectedDept.badge)}>
                    <selectedDept.icon size={16} className={selectedDept.iconColor} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-foreground/40">Selected Department</p>
                    <p className="font-bold text-sm">{selectedDept.name}</p>
                  </div>
                </div>

                <div className="glassmorphic rounded-[3rem] p-8 md:p-16 border-rose-gold/10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Personal Info */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 mb-6">
                        <User className="text-rose-gold" size={20} />
                        <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">Personal Information</h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3 group/field">
                          <label htmlFor="fullName" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors">Full Name *</label>
                          <input
                            required id="fullName" type="text" placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all hover:bg-white/10"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3 group/field">
                          <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors">Email Address *</label>
                          <input
                            required id="email" type="email" placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all hover:bg-white/10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3 group/field">
                          <label htmlFor="phone" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors">Phone Number *</label>
                          <input
                            required id="phone" type="tel" placeholder="+234..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all hover:bg-white/10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3 group/field">
                          <label htmlFor="gender" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors">Gender</label>
                          <select
                            id="gender" title="Select Gender"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 appearance-none transition-all hover:bg-white/10"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          >
                            <option value="" className="bg-midnight">Select Gender</option>
                            <option value="male" className="bg-midnight">Male</option>
                            <option value="female" className="bg-midnight">Female</option>
                            <option value="prefer-not-to-say" className="bg-midnight">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Age Range */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-rose-gold" size={20} />
                        <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">Age Range</h2>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {ageRanges.map((range) => (
                          <button
                            key={range} type="button"
                            onClick={() => setFormData({ ...formData, ageRange: range })}
                            className={cn(
                              "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border outline-none",
                              formData.ageRange === range
                                ? "bg-rose-gold text-midnight border-rose-gold shadow-lg"
                                : "bg-white/5 border-white/10 text-foreground/60 hover:border-rose-gold/30 hover:bg-rose-gold/5"
                            )}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-rose-gold" size={20} />
                        <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">Availability</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {availabilityOptions.map((option) => (
                          <button
                            key={option} type="button"
                            onClick={() => setFormData({ ...formData, availability: option })}
                            className={cn(
                              "px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-left transition-all duration-300 border outline-none",
                              formData.availability === option
                                ? "bg-rose-gold text-midnight border-rose-gold shadow-lg"
                                : "bg-white/5 border-white/10 text-foreground/60 hover:border-rose-gold/30 hover:bg-rose-gold/5"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Why do you want to join */}
                    <div className="space-y-6 group/field">
                      <div className="flex items-center gap-3">
                        <Heart className="text-rose-gold group-focus-within/field:scale-110 transition-transform" size={20} />
                        <label htmlFor="reason" className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90 group-focus-within/field:text-rose-gold transition-colors">
                          Why do you want to join this unit? *
                        </label>
                      </div>
                      <textarea
                        required id="reason" rows={4}
                        placeholder={`Tell us why you feel called to join the ${selectedDept.name} unit...`}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 focus:outline-none focus:border-rose-gold/50 transition-all resize-none font-medium outline-none hover:bg-white/10"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      />
                    </div>

                    {/* Prior Experience */}
                    <div className="space-y-6 group/field">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-rose-gold" size={20} />
                        <label htmlFor="experience" className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">
                          Prior Experience{" "}
                          {selectedDept.name === "Media" ? (
                            <span className="text-rose-gold/80 font-normal normal-case text-sm">* (required for Media)</span>
                          ) : (
                            <span className="text-foreground/30 font-normal normal-case text-sm">(optional)</span>
                          )}
                        </label>
                      </div>
                      <textarea
                        id="experience" rows={3}
                        required={selectedDept.name === "Media"}
                        placeholder="Any relevant skills, training, or past experience in this area..."
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 focus:outline-none focus:border-rose-gold/50 transition-all resize-none font-medium outline-none hover:bg-white/10"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-12 text-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "group relative px-16 py-6 bg-rose-gradient text-midnight font-bold rounded-[2rem] overflow-hidden transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 outline-none",
                          isSubmitting ? "cursor-wait" : ""
                        )}
                      >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Application</span>
                              <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500" />
                            </>
                          )}
                        </div>
                      </button>
                      <p className="mt-8 text-[10px] uppercase font-bold tracking-[0.3em] text-foreground/30 flex items-center justify-center gap-3">
                        <Heart size={12} className="text-rose-gold/40" />
                        Serving with purpose · Raising a generation of Impact
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* STEP 3 — Success */}
          {step === "success" && selectedDept && (
            <ScrollReveal>
              <div className="max-w-2xl mx-auto text-center">
                <div className="glassmorphic rounded-[3rem] p-12 md:p-20 border-rose-gold/10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto mb-10 rounded-full bg-rose-gold/10 border-2 border-rose-gold/30 flex items-center justify-center animate-pulse">
                      <CheckCircle2 size={48} className="text-rose-gold" />
                    </div>

                    <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-6">
                      Application Received
                    </span>

                    <h2 className="font-serif text-4xl font-bold mb-6 leading-tight">
                      Welcome to the <span className="text-rose-gradient">{selectedDept.name}</span> Unit!
                    </h2>

                    <p className="text-foreground/60 text-lg leading-relaxed mb-10">
                      Your application has been submitted successfully. Our team will review it and reach out to you shortly to welcome you officially into the unit.
                    </p>

                    <div className={cn(
                      "inline-flex items-center gap-3 glassmorphic px-6 py-4 rounded-2xl border mb-12",
                      selectedDept.border
                    )}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedDept.badge)}>
                        <selectedDept.icon size={20} className={selectedDept.iconColor} />
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] uppercase font-bold tracking-widest text-foreground/40">Applied Unit</p>
                        <p className="font-bold">{selectedDept.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleReset}
                        className="px-10 py-4 bg-rose-gradient text-midnight font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl text-sm uppercase tracking-widest"
                      >
                        Apply for Another Dept.
                      </button>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="px-10 py-4 glassmorphic border border-foreground/10 font-bold rounded-2xl hover:bg-foreground/5 active:scale-95 transition-all text-sm uppercase tracking-widest text-foreground/70"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinWorkforce;
