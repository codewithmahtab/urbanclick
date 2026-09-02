export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/70 pt-60">
      <div className="h-11 w-11 animate-spin rounded-full border-5 border-white/20 border-t-white" />
    </div>
  );
}
