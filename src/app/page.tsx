import { getFeaturedArticles } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const featuredArticles = await getFeaturedArticles();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            The Static Web
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            A collection of articles, tutorials, and guides for modern web
            development. Built with Next.js and Markdown.
          </p>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="px-6 py-12 sm:py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
          Featured Articles
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {featuredArticles.map((article) => (
            <ArticleCard
              key={`${article.category}-${article.slug}`}
              article={article}
            />
          ))}
        </div>
        {featuredArticles.length === 0 && (
          <p className="text-slate-600">No featured articles yet.</p>
        )}
      </section>
    </main>
  );
}
