import BackgroundWatermark from "@/components/BackgroundWatermark";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  User, Mail, Phone, Send, CheckCircle2, Heart,
  ArrowLeft, ChevronRight, Briefcase, Music, Radio,
  Info, Wrench, Mic2, BookOpen, Globe, Package,
  Anchor, Guitar, Home, Sparkles,
  HandMetal, SmileIcon, Stethoscope,
  Shield, Users, Zap, Search, ChevronDown, Check,
  SlidersHorizontal, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { notifyAdmins } from "@/lib/notifications";

// ─── Categories ────────────────────────────────────────────────────────────────
const categories = [
  "All",
  "Media & Music",
  "Hospitality & Service",
  "Discipleship & Community",
  "Prayer & Spiritual",
] as const;

type Category = typeof categories[number];

// ─── Departments ───────────────────────────────────────────────────────────────
export const departments = [
  {
    id: "ushering",
    name: "Ushering",
    category: "Hospitality & Service" as Category,
    icon: Users,
    color: "from-sky-500/20 to-sky-600/10",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
    description: "Welcome worshippers and maintain order during services with warmth, grace, and professionalism.",
  },
  {
    id: "protocol",
    name: "Protocol",
    category: "Hospitality & Service" as Category,
    icon: Shield,
    color: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/30",
    iconColor: "text-indigo-400",
    badge: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    description: "Coordinate VIP and guest management, ensuring royal hospitality at all church events.",
  },
  {
    id: "media",
    name: "Media",
    category: "Media & Music" as Category,
    icon: Radio,
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
    badge: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
    description: "Drive our digital presence through photography, livestreaming, video editing, and creative content.",
  },
  {
    id: "information-unit",
    name: "Information Unit",
    category: "Media & Music" as Category,
    icon: Info,
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    description: "Manage church communications, announcements, bulletins, and keep the congregation informed.",
  },
  {
    id: "technical-unit",
    name: "Technical Unit",
    category: "Media & Music" as Category,
    icon: Wrench,
    color: "from-orange-500/20 to-orange-600/10",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
    badge: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    description: "Handle sound reinforcement, acoustic mixing, lighting, and technical gear for powerful services.",
  },
  {
    id: "choir",
    name: "Choir",
    category: "Media & Music" as Category,
    icon: Music,
    color: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    description: "Lead the congregation in heartfelt praise and worship through vocal excellence and anointed music.",
  },
  {
    id: "maintenance-unit",
    name: "Maintenance Unit",
    category: "Hospitality & Service" as Category,
    icon: Wrench,
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    description: "Preserve the beauty and functional integrity of God's sanctuary through proactive facility care.",
  },
  {
    id: "evangelism",
    name: "Evangelism",
    category: "Discipleship & Community" as Category,
    icon: Globe,
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    badge: "bg-green-500/15 text-green-300 border border-green-500/30",
    description: "Take the gospel of salvation to homes, streets, campuses, and digital spaces to win souls for Christ.",
  },
  {
    id: "charging-unit",
    name: "Charging Unit",
    category: "Prayer & Spiritual" as Category,
    icon: Zap,
    color: "from-yellow-500/20 to-yellow-600/10",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    badge: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
    description: "Spiritual empowerment, intercession, and atmospheric preparation before and during all gatherings.",
  },
  {
    id: "csr",
    name: "CSR (Community Outreach)",
    category: "Discipleship & Community" as Category,
    icon: Heart,
    color: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    badge: "bg-pink-500/15 text-pink-300 border border-pink-500/30",
    description: "Demonstrate God's love through food drives, medical outreach, welfare support, and community welfare.",
  },
  {
    id: "logistics",
    name: "Logistics",
    category: "Hospitality & Service" as Category,
    icon: Package,
    color: "from-teal-500/20 to-teal-600/10",
    border: "border-teal-500/30",
    iconColor: "text-teal-400",
    badge: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
    description: "Coordinate church assets, setup configurations, transport, and equipment mobilization flawlessly.",
  },
  {
    id: "anchor",
    name: "Anchor",
    category: "Media & Music" as Category,
    icon: Anchor,
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    badge: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    description: "Provide stage coordination, emceeing, program announcements, and service transitions with warmth.",
  },
  {
    id: "instrumentalist",
    name: "Instrumentalist",
    category: "Media & Music" as Category,
    icon: Guitar,
    color: "from-fuchsia-500/20 to-fuchsia-600/10",
    border: "border-fuchsia-500/30",
    iconColor: "text-fuchsia-400",
    badge: "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30",
    description: "Play keyboard, drums, bass, lead guitar, horns, and strings to set an atmosphere of God's glory.",
  },
  {
    id: "house-fellowship-unit",
    name: "House Fellowship Unit",
    category: "Discipleship & Community" as Category,
    icon: Home,
    color: "from-lime-500/20 to-lime-600/10",
    border: "border-lime-500/30",
    iconColor: "text-lime-400",
    badge: "bg-lime-500/15 text-lime-300 border border-lime-500/30",
    description: "Foster intimate small-group centers in neighborhoods for mutual edification and fellowship.",
  },
  {
    id: "sparkles-unit",
    name: "Sparkles Unit (Children)",
    category: "Discipleship & Community" as Category,
    icon: Sparkles,
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    badge: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    description: "Nurture the next generation with fun, Bible stories, crafts, and spiritual foundations in Christ.",
  },
  {
    id: "follow-up-unit",
    name: "Follow Up Unit",
    category: "Discipleship & Community" as Category,
    icon: Users,
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    description: "Reach out to first-time guests, nurture converts, and connect every visitor into our church family.",
  },
  {
    id: "drama-unit",
    name: "Drama Unit",
    category: "Media & Music" as Category,
    icon: Mic2,
    color: "from-red-500/20 to-red-600/10",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    badge: "bg-red-500/15 text-red-300 border border-red-500/30",
    description: "Enact biblical truths and modern reflections through compelling drama, monologues, and stage arts.",
  },
  {
    id: "prayer-unit",
    name: "Prayer Unit",
    category: "Prayer & Spiritual" as Category,
    icon: HandMetal,
    color: "from-amber-500/20 to-yellow-600/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    description: "Stand in the gap as watchmen on the wall through regular intercessory meetings, fasts, and vigils.",
  },
  {
    id: "sunday-school-unit",
    name: "Sunday School Unit",
    category: "Discipleship & Community" as Category,
    icon: BookOpen,
    color: "from-sky-600/20 to-blue-600/10",
    border: "border-sky-600/30",
    iconColor: "text-sky-300",
    badge: "bg-sky-600/15 text-sky-300 border border-sky-600/30",
    description: "Teach sound biblical doctrine and facilitate interactive classroom discussions every Sunday.",
  },
  {
    id: "greeters-unit",
    name: "Greeters Unit",
    category: "Hospitality & Service" as Category,
    icon: SmileIcon,
    color: "from-orange-400/20 to-orange-500/10",
    border: "border-orange-400/30",
    iconColor: "text-orange-300",
    badge: "bg-orange-400/15 text-orange-300 border border-orange-400/30",
    description: "Be the warm, glowing face that welcomes every person entering God's presence at Impact House.",
  },
  {
    id: "medical-unit",
    name: "Medical Unit",
    category: "Discipleship & Community" as Category,
    icon: Stethoscope,
    color: "from-red-400/20 to-rose-500/10",
    border: "border-red-400/30",
    iconColor: "text-red-300",
    badge: "bg-red-400/15 text-red-300 border border-red-400/30",
    description: "Deliver prompt first aid, blood pressure checks, and emergency healthcare support during services.",
  },
];

const ageRanges = ["Under 18", "18–25", "26–35", "36–45", "46–60", "60+"];
const availabilityOptions = [
  "Weekends only",
  "Weekdays only",
  "Both weekends & weekdays",
  "Flexible / As needed"
];

// ─── Component ─────────────────────────────────────────────────────────────────
const JoinWorkforce = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "form" | "success">("select");
  const [selectedDept, setSelectedDept] = useState<typeof departments[0] | null>(departments[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
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

  // Filtered department list for instant mobile search & category switching
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === "All" || dept.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  const handleSelectDept = (dept: typeof departments[0]) => {
    setSelectedDept(dept);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) {
      toast({
        variant: "destructive",
        title: "Department Required",
        description: "Please select a department you wish to serve in.",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("workforce_applications").insert([{
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        age_range: formData.ageRange,
        department: selectedDept.name,
        reason: formData.reason.trim(),
        experience: formData.experience.trim(),
        availability: formData.availability,
        status: "pending",
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
    setSelectedDept(departments[0]);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      ageRange: "",
      reason: "",
      experience: "",
      availability: ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-rose-gold/20 selection:text-rose-gold">
      <BackgroundWatermark />

      <Navbar />

      {/* ── Hero Section (Mobile Optimized) ── */}
      <section className="relative pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-midnight/70 backdrop-blur-sm z-[-1]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <ScrollReveal>
            <span className="inline-block px-3.5 sm:px-4 py-1.5 rounded-full glassmorphic text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-rose-gold mb-5 sm:mb-6 border border-rose-gold/30">
              Kingdom Service · RCCG Impact House
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-[1.1] sm:leading-[0.95]">
              Join the <span className="text-rose-gradient">Workforce</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed px-2">
              Discover your place in God&apos;s house. Select your department of calling and passion below, then submit your application.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Step Indicator (Mobile Horizontal Scroll Safe) ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {[
            { label: "1. Choose Unit", step: "select" },
            { label: "2. Register", step: "form" },
            { label: "3. Confirmed", step: "success" },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (s.step === "select") setStep("select");
                  if (s.step === "form" && selectedDept) setStep("form");
                }}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  step === s.step
                    ? "bg-rose-gold text-midnight shadow-lg shadow-rose-gold/25 scale-105"
                    : (step === "form" && s.step === "select") || step === "success"
                    ? "bg-foreground/10 text-foreground/70 hover:bg-foreground/15 cursor-pointer"
                    : "bg-foreground/5 text-foreground/35 cursor-default"
                )}
              >
                <span>{s.label}</span>
              </button>
              {i < 2 && <ChevronRight size={14} className="text-foreground/20 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="pb-24 sm:pb-32 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* ══════════════════════════════════════════════════════════════════
              STEP 1: DEPARTMENT SELECTION GRID
             ══════════════════════════════════════════════════════════════════ */}
          {step === "select" && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Search & Category Filter Controls (Mobile Touch Friendly) */}
              <div className="glassmorphic rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-foreground/10 space-y-4">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by department name or role (e.g. Ushering, Choir, Media)..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-base text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-rose-gold/60 focus:ring-2 focus:ring-rose-gold/10 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 bg-foreground/10 rounded-lg text-foreground/60 hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-2 px-2">
                  <SlidersHorizontal size={14} className="text-foreground/40 shrink-0 hidden sm:block mr-1" />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 shrink-0",
                        activeCategory === cat
                          ? "bg-rose-gold text-midnight shadow-md shadow-rose-gold/20"
                          : "bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground border border-white/5"
                      )}
                    >
                      {cat} {cat === "All" ? `(${departments.length})` : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredDepartments.map((dept) => {
                  const Icon = dept.icon;
                  const isCurrentlyChosen = selectedDept?.id === dept.id;

                  return (
                    <div
                      key={dept.id}
                      onClick={() => handleSelectDept(dept)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectDept(dept);
                        }
                      }}
                      className={cn(
                        "group relative glassmorphic rounded-2xl sm:rounded-[2rem] p-5 sm:p-7 text-left border transition-all duration-300 hover:shadow-2xl active:scale-[0.98] cursor-pointer flex flex-col justify-between",
                        isCurrentlyChosen
                          ? "ring-2 ring-rose-gold border-rose-gold shadow-lg shadow-rose-gold/10 bg-rose-gold/[0.04]"
                          : cn(dept.border, "hover:border-rose-gold/40 hover:bg-white/[0.04]")
                      )}
                    >
                      {/* Ambient Gradient glow */}
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl sm:rounded-[2rem]", dept.color)} />

                      <div className="relative z-10">
                        {/* Header with Icon and Category Tag */}
                        <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
                          <div className={cn(
                            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0",
                            dept.badge
                          )}>
                            <Icon size={24} className={dept.iconColor} />
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/40 bg-foreground/5 px-2.5 py-1 rounded-full border border-foreground/5">
                              {dept.category}
                            </span>
                            {isCurrentlyChosen && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-rose-gold bg-rose-gold/15 px-2.5 py-0.5 rounded-full border border-rose-gold/30">
                                <Check size={11} /> Selected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Department Title & Description */}
                        <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-rose-gold transition-colors">
                          {dept.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed mb-6 group-hover:text-foreground/85 transition-colors line-clamp-3">
                          {dept.description}
                        </p>
                      </div>

                      {/* Mobile-Friendly Action Button */}
                      <div className="relative z-10 pt-3 border-t border-foreground/5 mt-auto">
                        <button
                          type="button"
                          className={cn(
                            "w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-200",
                            isCurrentlyChosen
                              ? "bg-rose-gold text-midnight shadow-md shadow-rose-gold/20"
                              : "bg-white/5 text-foreground/80 group-hover:bg-rose-gold group-hover:text-midnight group-hover:shadow-md"
                          )}
                        >
                          <span>{isCurrentlyChosen ? "Selected Unit" : "Choose this Unit"}</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredDepartments.length === 0 && (
                  <div className="col-span-full py-16 text-center glassmorphic rounded-2xl border border-foreground/10 p-8 space-y-3">
                    <p className="text-foreground/40 font-serif text-lg">No departments found matching &ldquo;{searchQuery}&rdquo;</p>
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                      className="px-5 py-2.5 bg-rose-gold/15 text-rose-gold font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-rose-gold/25 transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Floating Mobile Bar when a department is ready */}
              {selectedDept && (
                <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
                  <div className="glassmorphic rounded-2xl p-3 border border-rose-gold/40 shadow-2xl flex items-center justify-between gap-3 bg-midnight/95 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", selectedDept.badge)}>
                        <selectedDept.icon size={18} className={selectedDept.iconColor} />
                      </div>
                      <div className="truncate">
                        <p className="text-[9px] uppercase font-bold tracking-widest text-rose-gold">Selected Unit</p>
                        <p className="font-bold text-xs truncate text-foreground">{selectedDept.name}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="px-4 py-2.5 bg-rose-gradient text-midnight font-bold rounded-xl text-xs uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-lg shadow-rose-gold/25"
                    >
                      <span>Proceed</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STEP 2: REGISTRATION FORM (MOBILE RESPONSIVE ON IOS & ANDROID)
             ══════════════════════════════════════════════════════════════════ */}
          {step === "form" && selectedDept && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              {/* Back to Browse button */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
                >
                  <ArrowLeft size={16} /> Change Department
                </button>
                <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                  Step 2 of 3
                </span>
              </div>

              {/* ── HIGH VISIBILITY DEPARTMENT CARD AT TOP OF FORM ── */}
              <div className={cn(
                "glassmorphic rounded-2xl sm:rounded-3xl p-4 sm:p-6 border mb-6 sm:mb-8 transition-all relative overflow-hidden",
                selectedDept.border,
                "bg-gradient-to-r from-rose-gold/[0.07] via-transparent to-transparent"
              )}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md", selectedDept.badge)}>
                      <selectedDept.icon size={26} className={selectedDept.iconColor} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-rose-gold">
                          You Are Registering For:
                        </span>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-foreground/40 bg-foreground/10 px-2 py-0.5 rounded-full">
                          {selectedDept.category}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                        {selectedDept.name} Unit
                      </h2>
                      <p className="text-xs text-foreground/60 mt-1 max-w-xl leading-relaxed hidden sm:block">
                        {selectedDept.description}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown to switch department directly on mobile/desktop without losing data */}
                  <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-foreground/10">
                    <label htmlFor="dept-switch" className="block sm:hidden text-[10px] font-bold uppercase tracking-wider text-foreground/50 mb-1.5">
                      Switch to another unit:
                    </label>
                    <div className="relative">
                      <select
                        id="dept-switch"
                        aria-label="Switch chosen department"
                        value={selectedDept.id}
                        onChange={(e) => {
                          const found = departments.find((d) => d.id === e.target.value);
                          if (found) setSelectedDept(found);
                        }}
                        className="w-full sm:w-auto bg-[#140e20] text-foreground border border-rose-gold/40 rounded-xl px-4 py-2.5 text-xs font-bold appearance-none pr-9 focus:outline-none focus:border-rose-gold shadow-md cursor-pointer"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id} className="bg-[#140e20] text-white py-1">
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-gold pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Registration Form Card ── */}
              <div className="glassmorphic rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border-rose-gold/15 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                  {/* Personal Information */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-foreground/10 pb-3">
                      <User className="text-rose-gold" size={18} />
                      <h3 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-foreground/90">
                        1. Personal Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                          Full Name <span className="text-rose-gold">*</span>
                        </label>
                        <input
                          required
                          id="fullName"
                          type="text"
                          placeholder="e.g. Oluwaseun Adeleke"
                          className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-rose-gold/60 focus:ring-2 focus:ring-rose-gold/10 transition-all hover:bg-white/10"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                          Email Address <span className="text-rose-gold">*</span>
                        </label>
                        <input
                          required
                          id="email"
                          type="email"
                          inputMode="email"
                          autoCapitalize="none"
                          placeholder="e.g. seun@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-rose-gold/60 focus:ring-2 focus:ring-rose-gold/10 transition-all hover:bg-white/10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                          Phone Number (WhatsApp) <span className="text-rose-gold">*</span>
                        </label>
                        <input
                          required
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          placeholder="e.g. +234 801 234 5678"
                          className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-rose-gold/60 focus:ring-2 focus:ring-rose-gold/10 transition-all hover:bg-white/10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="gender" className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                          Gender
                        </label>
                        <div className="relative">
                          <select
                            id="gender"
                            className="w-full bg-[#140e20] border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 text-base text-foreground focus:outline-none focus:border-rose-gold/60 appearance-none transition-all cursor-pointer pr-10"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          >
                            <option value="" className="bg-[#140e20] text-foreground">Select Gender</option>
                            <option value="male" className="bg-[#140e20] text-foreground">Male</option>
                            <option value="female" className="bg-[#140e20] text-foreground">Female</option>
                            <option value="prefer-not-to-say" className="bg-[#140e20] text-foreground">Prefer not to say</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Age Range Section */}
                  <div className="space-y-3">
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                      Age Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
                      {ageRanges.map((range) => {
                        const isSelected = formData.ageRange === range;
                        return (
                          <button
                            key={range}
                            type="button"
                            onClick={() => setFormData({ ...formData, ageRange: range })}
                            className={cn(
                              "py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all duration-200 border outline-none min-h-[44px] flex items-center justify-center",
                              isSelected
                                ? "bg-rose-gold text-midnight border-rose-gold shadow-md font-extrabold scale-[1.02]"
                                : "bg-white/5 border-white/10 text-foreground/70 hover:border-rose-gold/30 hover:bg-white/10"
                            )}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability Section */}
                  <div className="space-y-3">
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                      Availability for Service & Rehearsals
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {availabilityOptions.map((option) => {
                        const isSelected = formData.availability === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, availability: option })}
                            className={cn(
                              "p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-left transition-all duration-200 border outline-none min-h-[48px] flex items-center justify-between",
                              isSelected
                                ? "bg-rose-gold text-midnight border-rose-gold shadow-md font-bold"
                                : "bg-white/5 border-white/10 text-foreground/75 hover:border-rose-gold/30 hover:bg-white/10"
                            )}
                          >
                            <span>{option}</span>
                            {isSelected && <Check size={16} className="shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calling / Motivation */}
                  <div className="space-y-2">
                    <label htmlFor="reason" className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                      Why do you feel called to serve in {selectedDept.name}? <span className="text-rose-gold">*</span>
                    </label>
                    <textarea
                      required
                      id="reason"
                      rows={4}
                      placeholder={`Briefly share your passion or burden for the ${selectedDept.name} unit...`}
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-rose-gold/60 focus:ring-2 focus:ring-rose-gold/10 transition-all resize-none hover:bg-white/10"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>

                  {/* Prior Experience */}
                  <div className="space-y-2">
                    <label htmlFor="experience" className="block text-[11px] uppercase font-bold tracking-wider text-foreground/60 ml-1">
                      Prior Experience / Relevant Skills{" "}
                      {selectedDept.name.toLowerCase().includes("media") ? (
                        <span className="text-rose-gold font-normal normal-case text-xs">(Required for Media)</span>
                      ) : (
                        <span className="text-foreground/40 font-normal normal-case text-xs">(Optional)</span>
                      )}
                    </label>
                    <textarea
                      id="experience"
                      rows={3}
                      required={selectedDept.name.toLowerCase().includes("media")}
                      placeholder="Any background, instruments played, technical tools, or past units served..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-rose-gold/60 focus:ring-2 focus:ring-rose-gold/10 transition-all resize-none hover:bg-white/10"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  {/* Summary Confirmation Banner & Submit Button */}
                  <div className="pt-4 space-y-4">
                    <div className="bg-rose-gold/10 border border-rose-gold/30 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-rose-gold shrink-0" />
                        <span className="text-foreground/80">
                          Applying for: <strong className="text-rose-gold font-bold">{selectedDept.name}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("select")}
                        className="text-[11px] font-bold text-rose-gold hover:underline shrink-0"
                      >
                        Change
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-4 sm:py-5 px-8 bg-rose-gradient text-midnight font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-rose-gold/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100",
                        isSubmitting ? "cursor-wait" : ""
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application for {selectedDept.name}</span>
                          <Send size={17} />
                        </>
                      )}
                    </button>

                    <p className="text-[10px] sm:text-xs text-center text-foreground/40 font-medium">
                      RCCG Impact House · Raising a Generation of Impact
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STEP 3: SUCCESS CONFIRMATION
             ══════════════════════════════════════════════════════════════════ */}
          {step === "success" && selectedDept && (
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <div className="glassmorphic rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 md:p-16 border-rose-gold/20 relative overflow-hidden shadow-2xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-rose-gold/15 border-2 border-rose-gold/40 flex items-center justify-center text-rose-gold animate-bounce">
                  <CheckCircle2 size={36} className="text-rose-gold" />
                </div>

                <span className="inline-block px-3.5 py-1 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.25em] text-rose-gold mb-4 border border-rose-gold/30">
                  Application Received
                </span>

                <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
                  Welcome to the <span className="text-rose-gradient">{selectedDept.name}</span> Unit!
                </h2>

                <p className="text-foreground/70 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                  God bless you for stepping forward to serve. Your registration has been received and our departmental leaders will reach out to you shortly.
                </p>

                {/* Dept Summary Pill */}
                <div className={cn(
                  "inline-flex items-center gap-3 glassmorphic px-5 py-3 rounded-2xl border mb-8",
                  selectedDept.border
                )}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selectedDept.badge)}>
                    <selectedDept.icon size={20} className={selectedDept.iconColor} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-foreground/40">Registered Unit</p>
                    <p className="font-bold text-sm text-foreground">{selectedDept.name}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3.5 bg-rose-gradient text-midnight font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg text-xs uppercase tracking-wider"
                  >
                    Apply for Another Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => { window.location.href = '/'; }}
                    className="w-full sm:w-auto px-6 py-3.5 glassmorphic border border-foreground/15 font-bold rounded-xl hover:bg-foreground/5 active:scale-95 transition-all text-xs uppercase tracking-wider text-foreground/80"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinWorkforce;
