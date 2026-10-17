"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";
import { ArticleMetadata } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Motion } from "@/components/ui/motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface FeaturedScrollAreaProps {
  articles: ArticleMetadata[];
}

export function FeaturedScrollArea({ articles }: FeaturedScrollAreaProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 pt-4">
      <Motion animation="fade-in-up" delay={50} duration="long">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-foreground">
            Featured
          </h2>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 pb-4 pt-1">
            {articles.map((article) => {
              const articleUrl = `/${encodeURIComponent(article.category)}/${article.slug}`;
              const hasImage = Boolean(
                article.image && article.image.trim() !== "",
              );

              return (
                <Link
                  key={`${article.category}-${article.slug}`}
                  href={articleUrl}
                  className="group block shrink-0 w-64 md:w-72 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl transition-transform active:scale-[0.98]"
                >
                  <Card
                    size="sm"
                    className="h-full overflow-hidden border border-border/60 hover:border-foreground/20 hover:shadow-md transition-all gap-0 py-0"
                  >
                    {/* Media Aspect Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/50">
                      {hasImage ? (
                        <Image
                          src={article.image!}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 256px, 288px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/80 to-muted text-muted-foreground">
                          <HugeiconsIcon
                            icon={BookOpen01Icon}
                            className="size-8 opacity-40"
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col p-4 space-y-2 whitespace-normal">
                      <CardHeader className="p-0 gap-1.5">
                        <CardTitle className="text-lg line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        {article.description && (
                          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                            {article.description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardFooter className="p-0 pt-2 text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-auto">
                        <span>
                          {article.date ? formatDate(article.date) : "Recent"}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{article.category}</span>
                      </CardFooter>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Motion>
    </section>
  );
}
