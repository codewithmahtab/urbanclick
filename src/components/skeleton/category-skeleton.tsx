export function CategorySkeleton() {
  return (
    <div className="py-4 px-4 w-full max-w-400 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card p-5 pt-4 rounded-none border border-border flex flex-col h-[350px] animate-pulse"
        >
          {/* Header area */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-muted rounded-md w-1/2" />
            <div className="size-5 bg-muted rounded-full" />
          </div>
          {/* Grid area */}
          <div className="grid grid-cols-2 gap-4 flex-grow">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex flex-col">
                <div className="aspect-square w-full rounded-md bg-muted mb-2" />
                <div className="h-3 bg-muted rounded-sm w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
