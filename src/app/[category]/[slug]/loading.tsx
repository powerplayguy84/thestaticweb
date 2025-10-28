export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-background">
      <article className="px-6 py-12 max-w-4xl mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 bg-muted rounded w-64 mb-8 animate-pulse"></div>

        {/* Article Header Skeleton */}
        <div className="space-y-6 mb-12 animate-pulse">
          <div className="h-12 bg-muted rounded-lg w-3/4"></div>
          <div className="h-6 bg-muted rounded-lg w-full"></div>
          <div className="flex items-center gap-4">
            <div className="h-5 bg-muted rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded-full w-16"></div>
              <div className="h-6 bg-muted rounded-full w-16"></div>
            </div>
          </div>
          <div className="h-96 bg-muted rounded-lg w-full"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
