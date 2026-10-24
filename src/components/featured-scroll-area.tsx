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
    <section className="space-y-4 pt-2">
      <Motion animation="fade-in-up" delay={50} duration="long">
        <div className="flex items-baseline justify-between pb-3 border-b border-border/40">
          <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
            Featured
          </h2>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-5 pb-4 pt-3">
            {articles.map((article) => {
              const articleUrl = `/${encodeURIComponent(article.category)}/${article.slug}`;
              const hasImage = Boolean(
                article.image && article.image.trim() !== "",
              );

              return (
                <Link
                  key={`${article.category}-${article.slug}`}
                  href={articleUrl}
                  className="group block shrink-0 w-72 sm:w-80 p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl transition-transform active:scale-[0.98]"
                >
                  <Card
                    size="sm"
                    className="h-full overflow-hidden border border-border/70 bg-card hover:border-foreground/30 hover:shadow-lg transition-all duration-300 gap-0 py-0 rounded-2xl"
                  >
                    {/* Media Aspect Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 border-b border-border/50">
                      {hasImage ? (
                        <Image
                          src={article.image!}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 288px, 320px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/60 to-muted text-muted-foreground">
                          <HugeiconsIcon
                            icon={BookOpen01Icon}
                            className="size-8 opacity-40"
                          />
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium uppercase tracking-wider bg-background/85 backdrop-blur-md text-foreground border border-border/60 shadow-xs">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5 space-y-2.5 whitespace-normal">
                      <CardHeader className="p-0 gap-1.5">
                        <CardTitle className="text-base sm:text-lg font-sans font-semibold line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        {article.description && (
                          <CardDescription className="line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {article.description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardFooter className="p-0 pt-3 text-[11px] text-muted-foreground font-mono flex items-center justify-between mt-auto border-t border-border/40">
                        <span>
                          {article.date ? formatDate(article.date) : "Recent"}
                        </span>
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
