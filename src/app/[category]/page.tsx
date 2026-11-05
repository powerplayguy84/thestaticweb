import {
  getArticlesByCategory,
  getCategories,
  getSiteSettings,
  getCategoriesWithInfo,
} from "@/lib/markdown";
import { formatCategoryName } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import FloatingBackButton from "@/components/FloatingBackButton";
import { Motion } from "@/components/ui/motion";
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

  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find((cat) => cat.slug === category);

  const displayCategory = categoryInfo?.title || formatCategoryName(category);
  const description =
    categoryInfo?.description || `Browse all ${displayCategory} articles`;

  return {
    title: `${displayCategory} - ${siteTitle}`,
    description,
    openGraph: {
      title: `${displayCategory} - ${siteTitle}`,
      description,
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: encodedCategory } = await params;
  const category = decodeURIComponent(encodedCategory);
  const articles = await getArticlesByCategory(category);

  if (articles.length === 0) {
    notFound();
  }

  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find((cat) => cat.slug === category);

  const displayCategory = categoryInfo?.title || formatCategoryName(category);
  const description = categoryInfo?.description;

  return (
    <main id="main-content" className="min-h-screen bg-background ambient-mesh">
      <div className="relative flex flex-col gap-6 max-w-3xl lg:max-w-4xl mx-auto pb-16 px-4 sm:px-6 pt-6 sm:pt-10">
        <FloatingBackButton fallbackHref="/" />
        <Motion animation="fade-in-up" delay={0} duration="long">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground">
              {displayCategory}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </Motion>

        <Motion animation="fade-in-up" delay={100} duration="long">
          {articles.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground border border-dashed border-border/70 rounded-2xl">
              No items found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={`${article.category}-${article.slug}`} className="flex">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </Motion>
      </div>
    </main>
  );
}
