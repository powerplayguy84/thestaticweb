import { getArticlesByTag, getAllTags } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} - The Static Web`,
    description: `Articles tagged with ${tag}`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const articles = await getArticlesByTag(tag);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 pt-16 pb-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
            #{tag}
          </h1>
          <p className="text-lg text-muted-foreground">
            {articles.length} {articles.length === 1 ? "article" : "articles"}{" "}
            tagged with <span className="font-semibold">{tag}</span>
          </p>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard
              key={`${article.category}-${article.slug}`}
              article={article}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
