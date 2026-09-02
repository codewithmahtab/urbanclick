export function ProductGridSkeleton() {
  return (
    <div className="flex w-full max-w-372 mx-auto relative">
      {/* Sidebar Filter Skeleton */}
      <aside className="hidden md:block border-r w-66 min-w-66 py-4 pr-4 min-h-screen">
        <div className="h-8 bg-muted animate-pulse rounded w-24 mb-8 mt-1" />
        <div className="flex flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-5 bg-muted animate-pulse rounded w-1/3 mb-4" />
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="w-full mb-10">
        <header className="border-b py-4 px-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-muted animate-pulse rounded w-48" />
            <div className="h-4 bg-muted animate-pulse rounded w-32" />
          </div>
          <div className="h-10 bg-muted animate-pulse rounded w-40 hidden md:block" />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full aspect-square bg-muted animate-pulse rounded-md" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4 mt-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-5 bg-muted animate-pulse rounded w-1/4 mt-1" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
