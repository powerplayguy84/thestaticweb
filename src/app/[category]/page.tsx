import {
  getArticlesByCategory,
  getCategories,
  getSiteSettings,
} from "@/lib/markdown";
import { formatCategoryName } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  const { category: encodedCategory } = await params;
  const category = decodeURIComponent(encodedCategory);
  const { siteTitle } = getSiteSettings();
  const displayCategory = formatCategoryName(category);

  return {
    title: `${displayCategory} - ${siteTitle}`,
    description: `Browse all ${displayCategory} articles`,
    openGraph: {
      title: `${displayCategory} - ${siteTitle}`,
      description: `Browse all ${displayCategory} articles`,
    },
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: encodedCategory } = await params;
  const category = decodeURIComponent(encodedCategory);
  const articles = await getArticlesByCategory(category);

  if (articles.length === 0) {
    notFound();
  }

  const displayCategory = formatCategoryName(category);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="px-6 py-12 sm:py-16 max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: displayCategory }]} />

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
            {displayCategory}
          </h1>
          <p className="text-lg text-muted-foreground">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}
