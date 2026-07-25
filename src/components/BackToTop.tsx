import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-[100] p-4 rounded-full glassmorphic transition-all duration-500 scale-90 translate-y-20 opacity-0 pointer-events-none group hover:scale-110 active:scale-95 border-rose-gold/20 hover:border-rose-gold/50",
        isVisible && "translate-y-0 opacity-100 pointer-events-auto scale-100 shadow-[0_10px_30px_rgba(226,176,145,0.2)]"
      )}
      aria-label="Back to top"
    >
      <ChevronUp
        size={24}
        className="text-rose-gold group-hover:text-rose-gold-light transition-colors duration-300"
      />
      
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-rose-gold/0 group-hover:bg-rose-gold/5 blur-xl transition-all duration-500 -z-10" />
    </button>
  );
};

export default BackToTop;
