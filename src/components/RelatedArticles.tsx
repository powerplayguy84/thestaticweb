"use client";

import Link from "next/link";
import Image from "next/image";
import { ArticleMetadata } from "@/lib/markdown";
import { formatCategoryName } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
  category: string;
  currentSlug: string;
}

export default function RelatedArticles({
  articles,
  category,
  currentSlug,
}: RelatedArticlesProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const related = articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  const handleImageError = (slug: string) => {
    setImageErrors((prev) => new Set(prev).add(slug));
  };

  return (
    <aside
      className="mt-12 pt-8 border-t border-border/40"
      data-no-search-highlight
    >
      <h3 className="text-base font-semibold tracking-tight text-foreground mb-4">
        More in {formatCategoryName(category)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((article) => {
          const hasValidImage =
            article.image &&
            article.image.trim() !== "" &&
            !imageErrors.has(article.slug);

          return (
            <Link
              key={article.slug}
              href={`/${encodeURIComponent(category)}/${article.slug}`}
              className="group"
            >
              <Card className="overflow-hidden h-full rounded-xl border border-border/60 hover:border-foreground/20 hover:bg-muted/30 transition-all cursor-pointer p-0">
                {hasValidImage && (
                  <div className="w-full h-36 bg-muted overflow-hidden relative">
                    <Image
                      src={article.image!}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={() => handleImageError(article.slug)}
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <p className="font-semibold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  {article.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
