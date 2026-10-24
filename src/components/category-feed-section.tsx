"use client";

import { useMemo, useState } from "react";
import { ArticleMetadata, CategoryInfo } from "@/lib/markdown";
import { formatCategoryName, cn } from "@/lib/utils";
import { ArticleListFeed } from "@/components/article-list-feed";
import { Motion } from "@/components/ui/motion";

interface CategoryFeedSectionProps {
  initialArticles: ArticleMetadata[];
  categories: CategoryInfo[];
  allArticles: ArticleMetadata[];
}

export function CategoryFeedSection({
  categories,
  allArticles,
}: CategoryFeedSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allArticles.length,
    };
    categories.forEach((cat) => {
      counts[cat.slug] = allArticles.filter(
        (a) => a.category.toLowerCase() === cat.slug.toLowerCase(),
      ).length;
    });
    return counts;
  }, [categories, allArticles]);

  const displayedArticles = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") {
      return allArticles;
    }
    return allArticles.filter(
      (article) =>
        article.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [selectedCategory, allArticles]);

  return (
    <section id="explore-section" className="space-y-6 pt-4">
      <Motion animation="fade-in-up" delay={100} duration="long">
        <div className="flex items-baseline justify-between pb-3 border-b border-border/40">
          <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
            Explore
          </h2>
        </div>

        <div className="flex flex-col gap-3 my-5">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
            {/* "All" pill */}
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border cursor-pointer shrink-0 flex items-center gap-2",
                selectedCategory === "all"
                  ? "bg-foreground text-background border-foreground shadow-xs font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/60 hover:bg-muted/80",
              )}
            >
              <span>All</span>
              <span className={cn(
                "text-[11px] font-mono px-1.5 py-0.2 rounded-full",
                selectedCategory === "all" ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
              )}>
                {categoryCounts.all ?? allArticles.length}
              </span>
            </button>

            {/* Category pills */}
            {categories.map((category) => {
              const isSelected = selectedCategory === category.slug;
              const count = categoryCounts[category.slug] ?? 0;

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap capitalize transition-all border cursor-pointer shrink-0 flex items-center gap-2",
                    isSelected
                      ? "bg-foreground text-background border-foreground shadow-xs font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/60 hover:bg-muted/80",
                  )}
                >
                  <span>{category.title || formatCategoryName(category.slug)}</span>
                  <span className={cn(
                    "text-[11px] font-mono px-1.5 py-0.2 rounded-full",
                    isSelected ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <ArticleListFeed articles={displayedArticles} />
      </Motion>
    </section>
  );
}
