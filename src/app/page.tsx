import {
  getFeaturedArticles,
  getHomepageHero,
  getCategoriesWithInfo,
  getAllArticles,
} from "@/lib/markdown";
import { CategoryFeedSection } from "@/components/category-feed-section";
import { FeaturedScrollArea } from "@/components/featured-scroll-area";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Motion } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
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
  const [featuredArticles, hero, categoriesInfo, allArticles] = await Promise.all([
    getFeaturedArticles(),
    getHomepageHero(),
    getCategoriesWithInfo(),
    getAllArticles(),
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-background ambient-mesh">
      <div className="flex flex-col gap-10 sm:gap-14 max-w-3xl lg:max-w-4xl mx-auto pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <section className="pt-8 sm:pt-14">
          <Motion animation="fade-in-up" delay={0} duration="long" className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-foreground leading-[1.08]">
                {hero.title}
              </h1>

              {hero.subtitle && (
                <p className="text-xl sm:text-2xl font-medium text-foreground/85 tracking-tight">
                  {hero.subtitle}
                </p>
              )}

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {hero.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-1 flex items-center gap-3">
              {hero.cta ? (
                <Button
                  asChild
                  className="rounded-full px-5 py-2.5 h-auto text-sm font-semibold gap-2 shadow-xs bg-foreground text-background hover:bg-foreground/90"
                >
                  <Link href={hero.cta.link}>
                    {hero.cta.text}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="rounded-full px-5 py-2.5 h-auto text-sm font-semibold gap-2 shadow-xs bg-foreground text-background hover:bg-foreground/90"
                >
                  <a href="#explore-section">
                    Explore
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>

            {hero.image && (
              <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-sm border border-border/60 mt-4">
                <Image
                  src={hero.image}
                  alt={`${hero.title} hero image`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
            )}
          </Motion>
        </section>

        {/* Markdown Content Section */}
        {hero.content && (
          <section>
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none border-t border-border/40 pt-6"
              dangerouslySetInnerHTML={{ __html: hero.content }}
            />
          </section>
        )}

        {/* Featured Horizontal Scroll Area */}
        {featuredArticles.length > 0 && (
          <FeaturedScrollArea articles={featuredArticles} />
        )}

        {/* Articles Feed Section with Category Pills */}
        {allArticles.length > 0 && (
          <div id="articles-section">
            <CategoryFeedSection
              initialArticles={allArticles}
              categories={categoriesInfo}
              allArticles={allArticles}
            />
          </div>
        )}
      </div>
    </main>
  );
}

