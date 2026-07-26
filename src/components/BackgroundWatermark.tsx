import rccgLogoBg from "@/assets/rccg-logo-bg.jpg";

const BackgroundWatermark = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <img
        src={rccgLogoBg}
        alt="Watermark"
        className="w-full h-full opacity-[0.05] dark:opacity-[0.07] grayscale object-cover mix-blend-overlay"
      />
    </div>
  );
};

export default BackgroundWatermark;
