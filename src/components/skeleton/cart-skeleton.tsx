export function CartSkeleton() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            </div>
            
            <div className="flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border border-border rounded-md">
                  <div className="w-24 h-24 bg-muted animate-pulse rounded-md flex-shrink-0" />
                  <div className="flex flex-col justify-between flex-grow py-1">
                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="sticky top-30">
              <div className="border border-border rounded-xl p-6 bg-card">
                <div className="h-6 bg-muted animate-pulse rounded w-1/2 mb-6" />
                <div className="flex flex-col gap-4 mb-6">
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-px bg-border w-full my-2" />
                  <div className="h-6 bg-muted animate-pulse rounded w-full" />
                </div>
                <div className="h-12 bg-muted animate-pulse rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
