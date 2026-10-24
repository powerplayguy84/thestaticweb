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
      className={`cursor-pointer transition-all hover:shadow-md focus:ring-2 focus:ring-ring focus:outline-none overflow-hidden w-full ${
        hasValidImage ? "pt-0" : ""
      }`}
    >
      {/* Image */}
      {hasValidImage && (
        <div className="w-full h-48 bg-muted overflow-hidden relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <Image
            src={article.image!}
            alt={article.title}
            fill
            className={`object-cover hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg font-sans font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.description}
        </CardDescription>
        <CardAction>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
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
        <CardFooter className="flex-col items-start gap-2">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:bg-muted/80 transition-colors focus:ring-2 focus:ring-ring focus:outline-none"
                aria-label={`View all articles tagged with ${tag}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
