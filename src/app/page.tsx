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
import { HeroAnimation } from "@/components/HeroAnimation";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHomepageHero();

  return {
    title: hero.title || "Invent Peace",
    description: hero.description,
    openGraph: {
      title: hero.title || "Invent Peace",
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
    }),
  );

  return (
    <main id="main-content" className="min-h-screen bg-background ambient-mesh">
      <div className="flex flex-col gap-10 sm:gap-14 max-w-3xl lg:max-w-4xl mx-auto pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <section className="pt-6 sm:pt-10 md:pt-14 pb-4">
          <Motion animation="fade-in-up" delay={0} duration="long">
            <div className="w-full text-center flex flex-col items-center">
              {/* Centered Hero Header & Content */}
              <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
                {hero.title && (
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight leading-[1.08] text-foreground">
                    {hero.title}
                  </h1>
                )}

                {hero.subtitle && (
                  <p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-foreground/90">
                    {hero.subtitle}
                  </p>
                )}

                {hero.description && (
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
                    {hero.description}
                  </p>
                )}
              </div>

              {/* Centered Hero Media (Animation or Image) */}
              {(hero.animation || hero.image) && (
                <div className="w-full max-w-xl my-6 sm:my-8 flex items-center justify-center">
                  {hero.animation ? (
                    <div className="relative w-full flex items-center justify-center">
                      {/* Soft Radial Mint/Emerald Glow Halo */}
                      <div
                        aria-hidden="true"
                        className="absolute w-[280px] sm:w-[360px] md:w-[440px] aspect-square rounded-full bg-[radial-gradient(circle,_rgba(0,191,99,0.26)_0%,_rgba(52,211,153,0.14)_42%,_transparent_72%)] dark:bg-[radial-gradient(circle,_rgba(0,191,99,0.38)_0%,_rgba(16,185,129,0.22)_45%,_transparent_72%)] blur-2xl pointer-events-none"
                      />
                      <HeroAnimation
                        src={hero.animation}
                        darkSrc={hero.animationDark}
                        className="relative z-10 w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] aspect-[6/5] flex items-center justify-center"
                      />
                    </div>
                  ) : hero.image ? (
                    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-border/70 shadow-xs">
                      <Image
                        src={hero.image}
                        alt={`${hero.title || "Invent Peace"} hero banner`}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 640px"
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {/* Primary CTA (under media) */}
              <div className="flex flex-row items-center justify-center gap-3 pt-1">
                {hero.cta ? (
                  <Button
                    asChild
                    variant="default"
                    className="rounded-full px-6 py-2.5 h-auto text-sm font-semibold justify-center gap-2 shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Link href={hero.cta.link}>
                      {hero.cta.text}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="w-4 h-4"
                      />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="default"
                    className="rounded-full px-6 py-2.5 h-auto text-sm font-semibold justify-center gap-2 shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <a href="#categories-section">
                      Explore Work
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="w-4 h-4"
                      />
                    </a>
                  </Button>
                )}
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
