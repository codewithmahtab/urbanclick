export default function Loading() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
      <div className="h-11 w-11 animate-spin rounded-full border-5 border-white/20 border-t-white" />
    </div>
  );
}
