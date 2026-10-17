import { getFeaturedArticles, getHomepageHero } from "@/lib/markdown";
import { ArticleListFeed } from "@/components/article-list-feed";
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
      <div className="flex flex-col gap-10 max-w-2xl mx-auto pb-16 px-4 md:px-6">
        {/* Hero Section */}
        <section className="pt-10">
          <Motion animation="fade-in-up" delay={0} duration="long" className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
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
              <div className="pt-1">
                <Link
                  href={hero.cta.link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-xs"
                >
                  {hero.cta.text}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
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

        {/* Featured Articles Feed Section */}
        {featuredArticles.length > 0 && (
          <section className="pt-2">
            <Motion animation="fade-in-up" delay={100} duration="long">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Featured Articles
                </h2>
                <span className="text-xs text-muted-foreground">
                  {featuredArticles.length} {featuredArticles.length === 1 ? "article" : "articles"}
                </span>
              </div>
              <ArticleListFeed articles={featuredArticles} />
            </Motion>
          </section>
        )}
      </div>
    </main>
  );
}
