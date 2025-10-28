export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 py-12 max-w-6xl mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 bg-muted rounded w-48 mb-8 animate-pulse"></div>

        {/* Header Skeleton */}
        <div className="space-y-4 mb-12 animate-pulse">
          <div className="h-10 bg-muted rounded-lg w-64"></div>
          <div className="h-6 bg-muted rounded-lg w-96"></div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-border rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-muted"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
