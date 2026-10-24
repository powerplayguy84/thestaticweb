import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background ambient-mesh flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-7xl sm:text-8xl font-sans font-bold tracking-tighter text-foreground mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-8">This page could not be found.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors shadow-sm"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
