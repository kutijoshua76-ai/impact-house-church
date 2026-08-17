import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundWatermark from "@/components/BackgroundWatermark";
import ScrollReveal from "@/components/ScrollReveal";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  HelpCircle, Search, MessageSquare, Send, CheckCircle2,
  Clock, Share2, Users, Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { notifyAdmins } from "@/lib/notifications";
import { SEO } from "@/components/SEO";


const campuses = [
  // Church Campuses
  { name: "Main Campus", location: "Ado-Ekiti" },
  { name: "Youth Impact Center", location: "Akure" },
  { name: "Excellence Campus", location: "Ibadan" },
  { name: "Purpose Center", location: "Lagos" },
  { name: "Grace Arena", location: "Port Harcourt" },
  
  // Ekiti Schools (Specifically requested)
  { name: "Ekiti State University (EKSU)", location: "Ado-Ekiti" },
  { name: "Federal University Oye-Ekiti (FUOYE)", location: "Oye-Ekiti" },
  { name: "Bamidele Olumilua University of Education, Science and Technology (BOUESTI)", location: "Ikere-Ekiti" },
  { name: "Afe Babalola University (ABUAD)", location: "Ado-Ekiti" },
  
  // Other Nigerian Universities
  { name: "University of Ibadan (UI)", location: "Ibadan" },
  { name: "University of Lagos (UNILAG)", location: "Lagos" },
  { name: "Obafemi Awolowo University (OAU)", location: "Ile-Ife" },
  { name: "Covenant University", location: "Ota" },
  { name: "Babcock University", location: "Ilishan-Remo" },
  { name: "Federal University of Technology Akure (FUTA)", location: "Akure" },
  { name: "Ladoke Akintola University of Technology (LAUTECH)", location: "Ogbomoso" },
  { name: "University of Benin (UNIBEN)", location: "Benin City" },
  { name: "University of Ilorin (UNILORIN)", location: "Ilorin" },
  { name: "Kwara State University (KWASU)", location: "Malete" },
  { name: "Lagos State University (LASU)", location: "Ojo" },
  { name: "Bowen University", location: "Iwo" },
  { name: "Landmark University", location: "Omu-Aran" },
  { name: "Osun State University (UNIOSUN)", location: "Osogbo" },
  { name: "Redeemer's University", location: "Ede" },
  { name: "Ajayi Crowther University", location: "Oyo" },
  { name: "Lead City University", location: "Ibadan" },
  { name: "Mountain Top University", location: "Makogi-Oba" },
  { name: "Caleb University", location: "Imota" },
  { name: "Adeleke University", location: "Ede" },
  { name: "University of Nigeria, Nsukka (UNN)", location: "Nsukka" },
  { name: "Ahmadu Bello University (ABU)", location: "Zaria" },
  { name: "University of Maiduguri (UNIMAID)", location: "Maiduguri" },
  { name: "Bayero University Kano (BUK)", location: "Kano" },
  { name: "University of Port Harcourt (UNIPORT)", location: "Port Harcourt" },
  { name: "University of Jos (UNIJOS)", location: "Jos" },
  { name: "University of Abuja (UNIABUJA)", location: "Abuja" },
  { name: "Nnamdi Azikiwe University (UNIZIK)", location: "Awka" },
  { name: "Federal University of Technology Minna (FUTMINNA)", location: "Minna" },
  { name: "Federal University of Technology Owerri (FUTO)", location: "Owerri" },
  { name: "Rivers State University (RSU)", location: "Port Harcourt" },
  { name: "Akwa Ibom State University (AKSU)", location: "Ikot Akpaden" },
  { name: "Delta State University (DELSU)", location: "Abraka" },
  { name: "Ambrose Alli University (AAU)", location: "Ekpoma" },
  { name: "Edo State University Uzairue", location: "Iyamho" },
  { name: "Joseph Ayo Babalola University (JABU)", location: "Ikeji-Arakeji" },
  { name: "Pan-Atlantic University", location: "Lagos" },
  { name: "Baze University", location: "Abuja" },
  { name: "Nile University of Nigeria", location: "Abuja" },
  { name: "Skyline University Nigeria", location: "Kano" }
];


const sources = [
  "Social Media", "Family Member", "Friend", "Colleague", "Other"
];

const FirstTimer = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campusSearch, setCampusSearch] = useState("");
  const [showCampusList, setShowCampusList] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    address: {
      street: "",
      state: "",
      country: ""
    },
    birthday: "",
    source: "",
    callTime: "",
    campus: "",
    prayerRequest: ""
  });

  const filteredCampuses = campuses.filter(c => 
    c.name.toLowerCase().includes(campusSearch.toLowerCase()) || 
    c.location.toLowerCase().includes(campusSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Terminal Logging
    console.log("%c[FORM_SUBMISSION]", "color: #e2b091; font-weight: bold", {
      form: "First Timer Registration",
      timestamp: new Date().toISOString(),
      data: formData
    });

    try {
      const { error } = await supabase
        .from('first_timers')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          street_address: formData.address.street,
          state: formData.address.state,
          country: formData.address.country,
          birthday: formData.birthday,
          campus: formData.campus,
          invited_by: formData.source,
          preferred_call_time: formData.callTime,
          prayer_request: formData.prayerRequest
        }]);

      if (error) throw error;

      // Trigger admin email notification via Resend
      notifyAdmins('first_timer', formData);

      toast({
        title: "Welcome to the Family!",
        description: "Your information has been received. We'll be in touch soon!",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        address: { street: "", state: "", country: "" },
        birthday: "",
        source: "",
        callTime: "",
        campus: "",
        prayerRequest: ""
      });
      setCampusSearch("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO 
        title="I'm New - First Timers" 
        canonicalUrl="/first-timers"
        description="Welcome to RCCG Impact House! Plan a visit and get connected to our vibrant community."
      />
      <BackgroundWatermark />

      <Navbar />

      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-midnight/60 backdrop-blur-sm z-[-1]" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8">
              New Visitor
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Welcome <span className="text-rose-gradient">Home</span>
            </h1>
            <p className="text-xl text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed">
              We are so glad you joined us! Please take a moment to fill out this form so we can get to know you better and keep in touch.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal delay={200}>
            <div className="glassmorphic rounded-[3rem] p-8 md:p-16 border-rose-gold/10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Information */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-rose-gold" size={20} />
                    <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">Personal Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 group/field">
                      <label htmlFor="fullName" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Full Name</label>
                      <input 
                        required
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3 group/field">
                      <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Email Address</label>
                      <input 
                        required
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 group/field">
                      <label htmlFor="phone" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Phone Number</label>
                      <input 
                        required
                        id="phone"
                        type="tel"
                        placeholder="+234..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all duration-300 outline-none hover:bg-white/10"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3 group/field">
                      <label htmlFor="gender" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Gender</label>
                      <select 
                        required
                        id="gender"
                        title="Select Gender"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 appearance-none transition-all duration-300 outline-none hover:bg-white/10"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="" className="bg-midnight">Select Gender</option>
                        <option value="male" className="bg-midnight">Male</option>
                        <option value="female" className="bg-midnight">Female</option>
                        <option value="other" className="bg-midnight">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="text-rose-gold" size={20} />
                    <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">Your Address</h2>
                  </div>
                  
                  <div className="space-y-3 group/field">
                    <label htmlFor="street" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Street Address</label>
                    <input 
                      required
                      id="street"
                      type="text"
                      placeholder="Enter your street address"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all duration-300 outline-none hover:bg-white/10"
                      value={formData.address.street}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 group/field">
                      <label htmlFor="state" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">State/Province/Region</label>
                      <input 
                        required
                        id="state"
                        type="text"
                        placeholder="State"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all duration-300 outline-none hover:bg-white/10"
                        value={formData.address.state}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-3 group/field">
                      <label htmlFor="country" className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50 ml-4 group-focus-within/field:text-rose-gold transition-colors duration-300">Country</label>
                      <input 
                        required
                        id="country"
                        type="text"
                        placeholder="Country"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all duration-300 outline-none hover:bg-white/10"
                        value={formData.address.country}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, country: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>

                {/* Other Info */}
                <div className="grid md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-6 group/field">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-rose-gold group-focus-within/field:scale-110 transition-transform duration-300" size={20} />
                      <label htmlFor="birthday" className="text-[10px] uppercase font-bold tracking-[0.3em] text-foreground/90 group-focus-within/field:text-rose-gold transition-colors duration-300">Birthday</label>
                    </div>
                    <input 
                      required
                      id="birthday"
                      type="date"
                      title="Birthday"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-rose-gold/50 transition-all duration-300 text-sm outline-none hover:bg-white/10"
                      value={formData.birthday}
                      onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Clock className="text-rose-gold" size={20} />
                      <label htmlFor="callTime" className="text-[10px] uppercase font-bold tracking-[0.3em] text-foreground/90">Preferred Call Time</label>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { id: "morning", label: "Morning", range: "8AM - 12PM" },
                        { id: "afternoon", label: "Afternoon", range: "12PM - 4PM" },
                        { id: "evening", label: "Evening", range: "4PM - 8PM" }
                      ].map((time) => (
                        <button
                          key={time.id}
                          type="button"
                          onClick={() => setFormData({...formData, callTime: time.id})}
                          className={cn(
                            "flex-1 min-w-[140px] px-6 py-4 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 border outline-none",
                            formData.callTime === time.id
                              ? "bg-rose-gold text-midnight border-rose-gold shadow-lg scale-105"
                              : "bg-white/5 border-white/10 text-foreground/60 hover:border-rose-gold/30 hover:bg-rose-gold/5"
                          )}
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">{time.label}</span>
                          <span className={cn(
                            "text-[8px] uppercase tracking-tighter opacity-60",
                            formData.callTime === time.id ? "text-midnight" : "text-rose-gold"
                          )}>{time.range}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* How did you hear about us */}
                <div className="space-y-8 pt-8">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="text-rose-gold" size={20} />
                    <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">How did you hear about us?</h2>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {sources.map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => setFormData({...formData, source})}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border outline-none",
                          formData.source === source 
                            ? "bg-rose-gold text-midnight border-rose-gold shadow-lg" 
                            : "bg-white/5 border-white/10 text-foreground/60 hover:border-rose-gold/30 hover:bg-rose-gold/5"
                        )}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Searchable Campus */}
                <div className="space-y-8 pt-8 relative">
                  <div className="flex items-center gap-3">
                    <Search className="text-rose-gold" size={20} />
                    <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90">Campus Attended</h2>
                  </div>
                  <div className="relative group/search">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within/search:text-rose-gold transition-colors duration-300">
                      <Search size={18} />
                    </div>
                    <input 
                      type="text"
                      id="campusSearch"
                      required
                      placeholder="Search for your campus location..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-5 focus:outline-none focus:border-rose-gold/50 focus:ring-4 focus:ring-rose-gold/5 transition-all shadow-inner outline-none text-sm"
                      value={campusSearch}
                      onChange={(e) => {
                        setCampusSearch(e.target.value);
                        setFormData({...formData, campus: e.target.value});
                        setShowCampusList(true);
                      }}
                      onFocus={() => setShowCampusList(true)}
                    />
                    {campusSearch && (
                      <button 
                        type="button"
                        onClick={() => {
                          setCampusSearch("");
                          setFormData({...formData, campus: ""});
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-rose-gold transition-colors"
                      >
                        <Heart size={14} className="rotate-45" /> {/* Using heart as a cross for now or just X */}
                      </button>
                    )}
                    {showCampusList && campusSearch && (
                      <div className="absolute top-full left-0 right-0 mt-4 bg-midnight/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden z-50 shadow-2xl animate-fade-in list-none">
                        {filteredCampuses.length > 0 ? (
                          filteredCampuses.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, campus: c.name});
                                setCampusSearch(c.name);
                                setShowCampusList(false);
                              }}
                              className="w-full px-8 py-5 text-left border-b border-white/5 hover:bg-rose-gold/10 transition-colors flex flex-col outline-none"
                            >
                              <span className="font-bold text-foreground">{c.name}</span>
                              <span className="text-[10px] uppercase tracking-widest text-rose-gold/60">{c.location}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-8 py-5 text-foreground/40 text-sm">No campus found matching your search.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8 pt-8 group/field">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-rose-gold group-focus-within/field:scale-110 transition-transform duration-300" size={20} />
                    <label htmlFor="prayerRequest" className="font-serif text-xl font-bold uppercase tracking-widest text-foreground/90 group-focus-within/field:text-rose-gold transition-colors duration-300">Prayer Request</label>
                  </div>
                  <textarea 
                    id="prayerRequest"
                    rows={4}
                    placeholder="How can we pray with you today?"
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 focus:outline-none focus:border-rose-gold/50 transition-all duration-300 resize-none font-medium outline-none hover:bg-white/10"
                    value={formData.prayerRequest}
                    onChange={(e) => setFormData({...formData, prayerRequest: e.target.value})}
                  />
                </div>

                {/* Submit button */}
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
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500" />
                        </>
                      )}
                    </div>
                  </button>
                  <p className="mt-8 text-[10px] uppercase font-bold tracking-[0.3em] text-foreground/30 flex items-center justify-center gap-3">
                    <Heart size={12} className="text-rose-gold/40" />
                    Raising a generation of Impact 
                  </p>
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

export default FirstTimer;
