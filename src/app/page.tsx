import {
  getFeaturedArticles,
  getHomepageHero,
  getCategoriesWithInfo,
  getAllArticles,
} from "@/lib/markdown";
import { CategoryFeedSection } from "@/components/category-feed-section";
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
    <main id="main-content" className="min-h-screen bg-background">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 px-4 md:px-6">
        {/* Hero Section */}
        <section className="pt-10">
          <Motion animation="fade-in-up" delay={0} duration="long" className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="text-lg sm:text-xl font-medium text-foreground/80">
                  {hero.subtitle}
                </p>
              )}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {hero.description}
              </p>
            </div>

            {hero.image && (
              <div className="relative w-full aspect-[16/9] sm:aspect-[1.91/1] rounded-2xl overflow-hidden shadow-xs border border-border/60">
                <Image
                  src={hero.image}
                  alt={`${hero.title} hero image`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, 680px"
                />
              </div>
            )}

            {/* CTA Button */}
            {hero.cta && (
              <div className="pt-1 flex justify-end">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-5 py-2.5 h-auto text-sm font-semibold shadow-xs gap-2"
                >
                  <Link href={hero.cta.link}>
                    {hero.cta.text}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Wavy Border */}
            <div
              className="pt-2 pb-1 flex items-center text-primary"
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
        </section>

        {/* Markdown Content Section */}
        {hero.content && (
          <section>
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: hero.content }}
            />
          </section>
        )}

        {/* Articles Feed Section with Category Pills */}
        {(featuredArticles.length > 0 || allArticles.length > 0) && (
          <CategoryFeedSection
            initialArticles={featuredArticles}
            categories={categoriesInfo}
            allArticles={allArticles}
          />
        )}
      </div>
    </main>
  );
}
