export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-64 animate-in fade-in">
      <div
        className="relative w-12 h-12"
        role="status"
        aria-live="polite"
        aria-label="Loading course content"
      >
        {/* Background track */}
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-800" />
        {/* Spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
