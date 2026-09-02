export function NavButtonsSkeleton() {
  return (
    <>
      <div className="flex items-center justify-center w-28 h-12">
        <div className="w-20 h-5 bg-muted rounded-full animate-pulse" />
      </div>
      <p className="h-6 w-px bg-border mx-2" />
      <div className="flex items-center justify-center w-36 h-12">
        <div className="w-24 h-5 bg-muted rounded-full animate-pulse" />
      </div>
    </>
  );
}
