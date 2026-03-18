export default function Loader({ fullscreen = false }) {

  const containerClass = fullscreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-6"
    : "flex items-center justify-center";

  return (
    <div className={containerClass}>

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-[#691926] border-t-transparent rounded-full animate-spin"></div>

      {/* Optional text */}
      {fullscreen && (
        <p className="text-[#691926] text-lg font-medium tracking-wide">
          Loading...
        </p>
      )}

    </div>
  );
}