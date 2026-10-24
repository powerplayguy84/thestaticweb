import {
  getArticlesByCategory,
  getCategories,
  getSiteSettings,
  getCategoriesWithInfo,
} from "@/lib/markdown";
import { formatCategoryName } from "@/lib/utils";
import { ArticleListFeed } from "@/components/article-list-feed";
import Breadcrumbs from "@/components/Breadcrumbs";
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

  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find((cat) => cat.slug === category);

  const displayCategory = categoryInfo?.title || formatCategoryName(category);
  const description = categoryInfo?.description;

  return (
    <main id="main-content" className="min-h-screen bg-background ambient-mesh">
      <div className="flex flex-col gap-8 max-w-3xl lg:max-w-4xl mx-auto pb-16 px-4 sm:px-6 pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: displayCategory }]} />

        <Motion animation="fade-in-up" delay={0} duration="long" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border/40 pb-5">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground">
                {displayCategory}
              </h1>
              {description && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              {articles.length} {articles.length === 1 ? "item" : "items"}
            </span>
          </div>
        </Motion>

        <Motion animation="fade-in-up" delay={100} duration="long">
          <ArticleListFeed articles={articles} />
        </Motion>
      </div>
    </main>
  );
}
