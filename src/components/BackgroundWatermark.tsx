import rccgLogo from "@/assets/rccg-logo.png";

const BackgroundWatermark = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <img
        src={rccgLogo}
        alt="Watermark"
        className="w-full h-full opacity-[0.04] dark:opacity-[0.06] grayscale object-cover mix-blend-overlay"
      />
    </div>
  );
};

export default BackgroundWatermark;
