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
    <main id="main-content" className="min-h-screen bg-background">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-16 px-4 md:px-6 pt-8 sm:pt-12">
        <Breadcrumbs items={[{ label: displayCategory }]} />

        <Motion animation="fade-in-up" delay={0} duration="long" className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {displayCategory}
          </h1>
          {description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
          <div
            className="pt-5 pb-2 flex items-center text-primary"
            aria-hidden="true"
          >
            <svg
              width="96"
              height="12"
              viewBox="0 0 96 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M 4 6 Q 11 1, 18 6 T 32 6 T 46 6 T 60 6 T 74 6 T 88 6" />
            </svg>
          </div>
        </Motion>

        <Motion animation="fade-in-up" delay={100} duration="long">
          <ArticleListFeed articles={articles} />
        </Motion>
      </div>
    </main>
  );
}
