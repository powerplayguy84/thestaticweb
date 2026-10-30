import {
  getHomepageHero,
  getCategoriesWithInfo,
  getArticlesByCategory,
  CategoryInfo,
  ArticleMetadata,
} from "@/lib/markdown";
import { CategoryCarouselSection } from "@/components/CategoryCarouselSection";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Motion } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHomepageHero();

  return {
    title: hero.title,
    description: hero.description,
    openGraph: {
      title: hero.title,
      description: hero.description,
      images: hero.image ? [{ url: hero.image }] : [],
    },
  };
}

export default async function Home() {
  const [hero, categoriesInfo] = await Promise.all([
    getHomepageHero(),
    getCategoriesWithInfo(),
  ]);

  // Fetch articles for each category
  const categoriesWithArticles: {
    category: CategoryInfo;
    articles: ArticleMetadata[];
  }[] = await Promise.all(
    categoriesInfo.map(async (category) => {
      const articles = await getArticlesByCategory(category.slug);
      return {
        category,
        articles,
      };
    })
  );

  return (
    <main id="main-content" className="min-h-screen bg-background ambient-mesh">
      <div className="flex flex-col gap-10 sm:gap-14 max-w-3xl lg:max-w-4xl mx-auto pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <section className="pt-6 sm:pt-12">
          <Motion animation="fade-in-up" delay={0} duration="long">
            <div
              className={cn(
                "w-full",
                hero.image
                  ? "grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 md:items-stretch"
                  : "max-w-3xl"
              )}
            >
              {/* Left Column: Hero Text & Actions */}
              <div
                className={cn(
                  "flex flex-col justify-center space-y-5",
                  hero.image ? "md:col-span-7" : "w-full"
                )}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight leading-[1.1] text-foreground">
                  {hero.title}
                </h1>

                {hero.subtitle && (
                  <p className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-foreground/85">
                    {hero.subtitle}
                  </p>
                )}

                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
                  {hero.description}
                </p>

                {/* Primary CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {hero.cta ? (
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full sm:w-auto rounded-full px-6 py-2.5 h-auto text-sm font-semibold justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Link href={hero.cta.link}>
                        {hero.cta.text}
                        <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full sm:w-auto rounded-full px-6 py-2.5 h-auto text-sm font-semibold justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <a href="#categories-section">
                        Explore Work
                        <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column: Hero Image (matches height of text column on desktop) */}
              {hero.image && (
                <div className="md:col-span-5 w-full flex">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-full min-h-[260px] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/70 shadow-md">
                    <Image
                      src={hero.image}
                      alt={`${hero.title} hero banner`}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 550px"
                    />
                  </div>
                </div>
              )}
            </div>
          </Motion>
        </section>

        {/* Markdown Content Section if present */}
        {hero.content && (
          <section>
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none border-t border-border/40 pt-6"
              dangerouslySetInnerHTML={{ __html: hero.content }}
            />
          </section>
        )}

        {/* Category-by-Category Carousel Sections */}
        <div id="categories-section" className="space-y-12 sm:space-y-16">
          {categoriesWithArticles.map(({ category, articles }, idx) => (
            <Motion
              key={category.slug}
              animation="fade-in-up"
              delay={idx * 100}
              duration="medium"
            >
              <CategoryCarouselSection
                category={category}
                articles={articles}
              />
            </Motion>
          ))}
        </div>
      </div>
    </main>
  );
}
