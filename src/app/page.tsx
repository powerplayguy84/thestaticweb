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
        {/* Hero Section (Card) */}
        <section className="pt-6 sm:pt-10">
          <Motion animation="fade-in-up" delay={0} duration="long">
            <div
              className={cn(
                "relative isolate w-full rounded-3xl overflow-hidden border border-border/70 shadow-lg flex flex-col justify-end",
                hero.image
                  ? "min-h-[380px] sm:min-h-[440px] md:min-h-[480px] p-6 sm:p-10 md:p-12 text-white"
                  : "p-8 sm:p-12 bg-card text-foreground"
              )}
            >
              {hero.image && (
                <>
                  <Image
                    src={hero.image}
                    alt={`${hero.title} hero background`}
                    fill
                    priority
                    className="object-cover -z-20 scale-[1.02] transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 960px, 1200px"
                  />
                  {/* Darkening & gradient overlay for optimal text legibility and rich atmosphere */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/92 via-black/60 to-black/35" />
                  <div className="absolute inset-0 -z-10 backdrop-blur-[0.5px]" />
                </>
              )}

              <div className="space-y-4 max-w-2xl relative z-10">
                <h1
                  className={cn(
                    "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight leading-[1.08]",
                    hero.image ? "text-white drop-shadow-xs" : "text-foreground"
                  )}
                >
                  {hero.title}
                </h1>

                {hero.subtitle && (
                  <p
                    className={cn(
                      "text-lg sm:text-xl md:text-2xl font-medium tracking-tight",
                      hero.image ? "text-white/90" : "text-foreground/85"
                    )}
                  >
                    {hero.subtitle}
                  </p>
                )}

                <p
                  className={cn(
                    "text-sm sm:text-base md:text-lg leading-relaxed",
                    hero.image ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  {hero.description}
                </p>

                {/* Primary CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {hero.cta ? (
                    <Button
                      asChild
                      className={cn(
                        "rounded-full px-6 py-2.5 h-auto text-sm font-semibold gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer",
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
                      className={cn(
                        "rounded-full px-6 py-2.5 h-auto text-sm font-semibold gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer",
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
