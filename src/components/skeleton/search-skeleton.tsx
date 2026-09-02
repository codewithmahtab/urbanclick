export function SearchSkeleton() {
  return (
    <div className="flex w-full max-w-372 mx-auto relative">
      {/* Sidebar Skeleton */}
      <aside className="border-r w-66 min-w-66 py-4 pr-4 min-h-screen">
        <h2 className="text-2xl font-medium">Filters</h2>
        <div className="space-y-6 mt-6">
          {/* Price Filter Skeleton */}
          <div className="space-y-3">
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            <div className="h-2 w-full bg-muted rounded animate-pulse mt-4" />
            <div className="flex gap-2">
               <div className="h-10 w-full bg-muted rounded animate-pulse" />
               <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Filter block skeletons (Category & Brand) */}
          {Array.from({ length: 2 }).map((_, i) => (
            <section key={i} className="mt-4 space-y-3">
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              <ul className="space-y-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <li key={j} className="flex items-center gap-3 py-1">
                    <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <section className="w-full mb-10">
        <header className="border-b py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-medium">Products</h1>
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </header>

        {/* Product Grid Skeleton */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-square w-full bg-muted rounded-xl animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse mt-2" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="h-5 w-1/3 bg-muted rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
