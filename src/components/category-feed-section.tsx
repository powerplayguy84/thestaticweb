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
  initialArticles,
  categories,
  allArticles,
}: CategoryFeedSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.slug || "",
  );

  const displayedArticles = useMemo(() => {
    if (!selectedCategory) {
      return initialArticles;
    }
    return allArticles.filter(
      (article) =>
        article.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [selectedCategory, initialArticles, allArticles]);

  return (
    <section className="space-y-4 pt-4">
      <Motion animation="fade-in-up" delay={100} duration="long">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Explore
          </h2>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
            {/* Category pills */}
            {categories.map((category) => {
              const isSelected = selectedCategory === category.slug;

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors border cursor-pointer shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "bg-card text-foreground border-border hover:bg-muted active:bg-muted",
                  )}
                >
                  {category.title || formatCategoryName(category.slug)}
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
