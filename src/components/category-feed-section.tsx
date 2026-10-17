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
        {/* Wavy Border */}
        <div
          className="pb-6 pt-2 flex items-center text-primary"
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

        <div className="flex items-center justify-between pb-5">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-foreground">
            More...
          </h2>
        </div>

        <div className="flex flex-col gap-3 mb-7">
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
