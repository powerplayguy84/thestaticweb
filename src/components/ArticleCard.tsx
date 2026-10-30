"use client";

import Image from "next/image";
import { ArticleMetadata } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  article: ArticleMetadata;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const hasValidImage =
    article.image && article.image.trim() !== "" && !imageError;

  const navigateToArticle = () => {
    router.push(`/${encodeURIComponent(article.category)}/${article.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToArticle();
    }
  };

  return (
    <div
      onClick={navigateToArticle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Read article: ${article.title}`}
      className="group cursor-pointer w-full rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs hover:border-foreground/30 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        {/* Cover Image */}
        {hasValidImage && (
          <div className="relative w-full aspect-16/9 sm:aspect-16/10 bg-muted/40 overflow-hidden border-b border-border/50">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
              src={article.image!}
              alt={article.title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Content Details */}
        <div className="p-5 sm:p-6 space-y-2">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-xs font-mono text-muted-foreground">
            {article.date ? formatDate(article.date) : "Recent"}
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Read more"
          className="rounded-full shadow-xs transition-all pointer-events-none group-hover:scale-105"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
          />
        </Button>
      </div>
    </div>
  );
}
