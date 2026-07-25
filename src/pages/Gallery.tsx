import BackgroundWatermark from "@/components/BackgroundWatermark";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import DomeGallery from "@/components/DomeGallery";
import churchPhotos from "@/assets/church-photos";

// Build a typed image list from all church photos
const photos = Object.entries(churchPhotos).map(([key, src]) => ({
  src: src as string,
  alt: key
    .replace(/([A-Z])/g, " $1")
    .replace(/\d+/g, "")
    .trim(),
}));

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <BackgroundWatermark />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm z-[-1]" />
        <div className="max-w-5xl mx-auto px-6 py-10 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full glassmorphic text-[10px] font-bold uppercase tracking-[0.3em] text-rose-gold mb-8">
              Visual Journey
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
              Captured <span className="text-rose-gradient">Moments</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/75 max-w-2xl mx-auto font-medium leading-relaxed">
              Spin the sphere to explore — drag to rotate, click any photo to
              enlarge.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Dome Gallery */}
      <section className="relative z-10 h-[90vh]">
        <DomeGallery
          images={photos}
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}  
          segments={34}
          dragDampening={2}
          grayscale={false}
          overlayBlurColor="var(--color-midnight, #0d0d0d)"
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
          openedImageWidth="480px"
          openedImageHeight="480px"
        />
      </section>

      {/* Google Drive CTA */}
      <section className="relative z-10 py-20 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-foreground/50 text-sm uppercase tracking-widest font-bold mb-4">
            Can't find your photo?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
            View the <span className="text-rose-gradient">Full Album</span>
          </h2>
          <p className="text-foreground/60 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            We've kept the gallery light for a smooth experience. Access the complete collection of every captured moment on Google Drive.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1_6Eb84VdxcdJlN77jz2lA-4shXpxGtBx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-rose-gold text-midnight font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_24px_rgba(226,176,145,0.35)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open Full Gallery on Drive
          </a>
          <p className="text-foreground/30 text-xs mt-6 tracking-widest uppercase">
            Free to browse · No sign-in required
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
