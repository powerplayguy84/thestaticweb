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
    <main id="main-content" className="min-h-screen bg-background ambient-mesh pb-20">
      {/* 100% Full-Width Hero Section (Not a Card) */}
      <section className="relative isolate w-full border-b border-border/40 overflow-hidden">
        {hero.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={hero.image}
              alt={`${hero.title} hero background`}
              fill
              priority
              className="object-cover scale-[1.01]"
              sizes="100vw"
            />
            {/* Elegant balanced darkening overlay for high contrast text without washing out the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28 md:py-36">
          <Motion animation="fade-in-up" delay={0} duration="long">
            <div className="space-y-5 max-w-3xl">
              <h1
                className={cn(
                  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight leading-[1.06]",
                  hero.image ? "text-white drop-shadow-sm" : "text-foreground"
                )}
              >
                {hero.title}
              </h1>

              {hero.subtitle && (
                <p
                  className={cn(
                    "text-xl sm:text-2xl md:text-3xl font-medium tracking-tight",
                    hero.image ? "text-white/95" : "text-foreground/90"
                  )}
                >
                  {hero.subtitle}
                </p>
              )}

              <p
                className={cn(
                  "text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl",
                  hero.image ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {hero.description}
              </p>

              {/* Primary CTA */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                {hero.cta ? (
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "rounded-full px-7 py-3 h-auto text-sm sm:text-base font-semibold gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer",
                      hero.image
                        ? "bg-white text-zinc-950 hover:bg-white/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    )}
                  >
                    <Link href={hero.cta.link}>
                      {hero.cta.text}
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "rounded-full px-7 py-3 h-auto text-sm sm:text-base font-semibold gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer",
                      hero.image
                        ? "bg-white text-zinc-950 hover:bg-white/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    )}
                  >
                    <a href="#categories-section">
                      Explore Work
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Motion>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex flex-col gap-12 sm:gap-16 max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        {/* Markdown Content Section if present */}
        {hero.content && (
          <section>
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
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
