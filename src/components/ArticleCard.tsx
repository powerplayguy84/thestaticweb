"use client";

import Link from "next/link";
import Image from "next/image";
import { ArticleMetadata } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { ArrowRight } from "lucide-react";
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
  const router = useRouter();
  const hasValidImage =
    article.image && article.image.trim() !== "" && !imageError;

  const handleCardClick = () => {
    router.push(`/${article.category}/${article.slug}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer transition-all hover:shadow-md overflow-hidden w-full"
    >
      {/* Image */}
      {hasValidImage && (
        <div className="w-full h-48 bg-muted overflow-hidden relative">
          <Image
            src={article.image!}
            alt={article.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={!article.image!.startsWith("http")}
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg">{article.title}</CardTitle>
        <CardDescription>{article.description}</CardDescription>
        <CardAction>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <time className="text-muted-foreground">
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
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:bg-muted/80 transition-colors"
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
