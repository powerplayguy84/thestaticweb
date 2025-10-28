import { getFeaturedArticles, getHomepageHero } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      {/* Hero Section */}
      <section className="px-6 py-16 sm:py-24 max-w-6xl mx-auto">
        <div className="space-y-6">
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
            <div className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-video rounded-lg overflow-hidden">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {hero.cta.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="px-6 py-12 sm:py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
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
        {featuredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No featured articles yet.
            </p>
            <p className="text-muted-foreground text-sm">
              Check back soon for new content!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
