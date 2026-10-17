import { getFeaturedArticles, getHomepageHero } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Motion } from "@/components/ui/motion";
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
  const [featuredArticles, hero] = await Promise.all([
    getFeaturedArticles(),
    getHomepageHero(),
  ]);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="flex flex-col gap-12 sm:gap-16 max-w-6xl mx-auto pb-12 sm:pb-16 px-6">
        {/* Hero Section */}
        <section className="pt-16">
          <Motion animation="fade-in-up" delay={0} duration="long" className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="text-2xl sm:text-3xl font-semibold text-muted-foreground">
                  {hero.subtitle}
                </p>
              )}
              <p className="text-xl text-muted-foreground max-w-2xl">
                {hero.description}
              </p>
            </div>
            {hero.image && (
              <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden shadow-sm border border-border/50">
                <Image
                  src={hero.image}
                  alt={`${hero.title} hero image`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 768px, 1024px"
                />
              </div>
            )}
            {/* CTA Button */}
            {hero.cta && (
              <div className="pt-4">
                <Link
                  href={hero.cta.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
                >
                  {hero.cta.text}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
                </Link>
              </div>
            )}
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

        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <section>
            <Motion animation="fade-in-up" delay={100} duration="long">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 mt-0">
                Featured
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {featuredArticles.map((article) => (
                  <ArticleCard
                    key={`${article.category}-${article.slug}`}
                    article={article}
                  />
                ))}
              </div>
            </Motion>
          </section>
        )}
      </div>
    </main>
  );
}
