import { getArticlesByCategory, getCategories } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${
      category.charAt(0).toUpperCase() + category.slice(1)
    } - The Static Web`,
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const articles = await getArticlesByCategory(category);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 py-12 sm:py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 capitalize">
          {category}
        </h1>

        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}
