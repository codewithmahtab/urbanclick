export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Left side: Image */}
          <div className="mx-auto w-full max-w-md flex flex-col gap-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/80 animate-pulse" />
          </div>

          {/* Right side: Details */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <span className="text-muted-foreground"></span>
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>

            <div className="h-10 w-3/4 bg-muted rounded animate-pulse mt-2" />
            <div className="h-10 w-1/2 bg-muted rounded animate-pulse mt-2" />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-8 w-12 bg-muted rounded animate-pulse" />
              <span className="text-muted-foreground"></span>
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            </div>

            <div className="mt-8 space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
            </div>

            <div className="h-10 w-32 bg-muted rounded animate-pulse mt-8" />

            <div className="h-5 w-48 bg-muted rounded animate-pulse mt-6" />

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="h-12 w-full sm:w-32 bg-muted rounded-md animate-pulse" />
              <div className="h-12 w-full sm:max-w-xs bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-16 border-t pt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Customer reviews
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-12 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border p-5 sm:p-6">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-3" />
            <div className="h-4 w-40 bg-muted rounded animate-pulse mt-5" />
          </div>
        </section>
      </div>
    </main>
  );
}
