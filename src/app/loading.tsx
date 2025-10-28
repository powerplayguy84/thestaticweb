export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 py-16 max-w-6xl mx-auto">
        {/* Hero Skeleton */}
        <div className="space-y-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-12 bg-muted rounded-lg w-3/4"></div>
            <div className="h-8 bg-muted rounded-lg w-2/3"></div>
            <div className="h-6 bg-muted rounded-lg w-full max-w-2xl"></div>
          </div>
          <div className="h-96 bg-muted rounded-lg w-full max-w-3xl"></div>
        </div>

        {/* Articles Skeleton */}
        <div className="mt-16">
          <div className="h-8 bg-muted rounded-lg w-32 mb-8 animate-pulse"></div>
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
      </div>
    </main>
  );
}
