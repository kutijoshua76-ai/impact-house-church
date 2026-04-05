import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import churchPhotos from "@/assets/church-photos";
import rccgLogo from "@/assets/rccg-logo.png";
import { useState, useEffect } from "react";
import { X, Maximize2 } from "lucide-react";

const GalleryImage = ({ src, index, onClick }: { src: string; index: number; onClick: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ScrollReveal delay={index * 30}>
      <div
        className="relative group cursor-pointer overflow-hidden rounded-2xl break-inside-avoid shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-rose-gold/30 bg-midnight/20"
        onClick={onClick}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-midnight/40 backdrop-blur-sm animate-pulse">
            <div className="w-8 h-8 border-2 border-rose-gold/30 border-t-rose-gold rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={`Church photo ${index + 1}`}
          className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-gold/20 flex items-center justify-center backdrop-blur-md border border-rose-gold/30">
              <Maximize2 size={14} className="text-rose-gold" />
            </div>
            <span className="text-rose-gold text-[10px] font-bold uppercase tracking-[0.2em]">View Full Size</span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = Object.values(churchPhotos);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img
          src={rccgLogo}
          alt=""
          className="w-[120%] max-w-none opacity-[0.05] dark:opacity-[0.08] grayscale rotate-[-10deg] pointer-events-none"
        />
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm z-[-1]" />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8">
              Visual Journey
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Captured <span className="text-rose-gradient">Moments</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed">
              Witness the vibrant life, worship, and community at RCCG Impact House through our lens.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <GalleryImage key={index} src={photo} index={index} onClick={() => setSelectedImage(photo)} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-midnight/98 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 transition-all duration-500 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-rose-gold/60 hover:text-rose-gold transition-all p-3 glassmorphic rounded-full hover:scale-110 z-[110]"
            aria-label="Close photo gallery"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          
          <div className="relative max-w-7xl max-h-full flex items-center justify-center group" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] rounded-lg shadow-[0_0_50px_rgba(183,148,110,0.2)] animate-in zoom-in-95 duration-300 object-contain selection:bg-transparent"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
