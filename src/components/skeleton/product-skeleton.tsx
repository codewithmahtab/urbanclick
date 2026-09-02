export function ProductSkeleton() {
  return (
    <main className="min-h-screen bg-background relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="mx-auto w-full max-w-md flex flex-col gap-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted animate-pulse" />
          </div>

          <div className="flex flex-col">
            {/* Brand / Store Name */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <span className="text-muted-foreground"></span>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>

            {/* Title */}
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded mt-2" />

            {/* Reviews */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            </div>

            {/* Description */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>

            {/* Price */}
            <div className="mt-6 h-8 w-1/4 bg-muted animate-pulse rounded" />

            {/* Stock */}
            <div className="mt-5 h-4 w-1/3 bg-muted animate-pulse rounded" />

            {/* Form / Buttons */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="h-12 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <div className="mt-16 h-40 animate-pulse bg-muted rounded-xl" />
      </div>
    </main>
  );
}
