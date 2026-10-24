"use client";

import Link from "next/link";
import Image from "next/image";
import { ArticleMetadata } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface ArticleCardProps {
  article: ArticleMetadata;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const hasValidImage =
    article.image && article.image.trim() !== "" && !imageError;

  const handleCardClick = () => {
    router.push(`/${encodeURIComponent(article.category)}/${article.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/${encodeURIComponent(article.category)}/${article.slug}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Read article: ${article.title}`}
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-foreground/30 dark:hover:border-primary/40 focus:ring-2 focus:ring-ring focus:outline-none overflow-hidden w-full bg-card/85 backdrop-blur-md rounded-2xl border border-border/70 ${
        hasValidImage ? "pt-0" : ""
      }`}
    >
      {/* Image */}
      {hasValidImage && (
        <div className="w-full aspect-[16/10] bg-muted/40 overflow-hidden relative border-b border-border/50">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <Image
            src={article.image!}
            alt={article.title}
            fill
            className={`object-cover group-hover:scale-[1.04] transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-background/90 backdrop-blur-md text-foreground border border-border/70 shadow-xs">
              {article.category}
            </span>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg font-sans font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
          {article.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.description}
        </CardDescription>
        <CardAction>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
            aria-hidden="true"
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <time dateTime={article.date}>
            {formatDate(article.date)}
          </time>
        </div>
      </CardContent>

      {article.tags && article.tags.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 pt-0">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-mono font-medium bg-muted/60 text-muted-foreground px-2.5 py-0.5 rounded-full hover:bg-muted hover:text-foreground transition-colors border border-border/40 focus:ring-2 focus:ring-ring focus:outline-none"
                aria-label={`View all articles tagged with ${tag}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
