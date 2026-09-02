export function DashboardSkeleton() {
  return (
    <div className="space-y-8 w-full">
      <div>
        <div className="h-8 w-64 bg-muted animate-pulse rounded mb-3" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="h-5 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
