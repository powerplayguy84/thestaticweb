"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { ArticleMetadata } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";


interface ArticleListFeedProps {
  articles: ArticleMetadata[];
}

export function ArticleListFeed({ articles }: ArticleListFeedProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!articles || articles.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground border border-dashed border-border/70 rounded-2xl">
        No items found in this category.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col divide-y divide-border/40">
        {articles.map((article) => {
          const articleUrl = `/${encodeURIComponent(article.category)}/${article.slug}`;
          const hasImage = Boolean(article.image && article.image.trim() !== "");

          return (
            <div key={`${article.category}-${article.slug}`} className="py-6 sm:py-7">
              <div
                onClick={() => router.push(articleUrl)}
                className="group cursor-pointer p-4 sm:p-5 -mx-4 sm:-mx-5 rounded-2xl transition-all duration-200 hover:bg-muted/30 border border-transparent hover:border-border/60"
              >
                <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-5 md:gap-8">
                  {/* Content Column */}
                  <div className="space-y-3 flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-muted/80 text-foreground font-medium uppercase text-[10px] tracking-wider border border-border/50">
                        {article.category}
                      </span>
                      <span>•</span>
                      <time dateTime={article.date}>
                        {article.date ? formatDate(article.date) : "Recent"}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-sans font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>

                    {/* Description */}
                    {article.description && (
                      <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.description}
                      </p>
                    )}

                    {/* Tags & Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {article.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-md px-2 py-0.5 text-[11px] font-mono font-medium text-muted-foreground bg-muted/50 hover:bg-muted border border-border/40"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/tag/${tag}`);
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-xs font-semibold text-foreground/80 group-hover:text-primary transition-colors gap-1 ml-auto">
                        <span>Read</span>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="size-3.5 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Column */}
                  {hasImage && (
                    <div className="w-full md:w-52 lg:w-60 shrink-0">
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-muted/50 border border-border/60 shadow-xs">
                        <Image
                          src={article.image!}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 240px"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Res Image Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="sm:max-w-4xl p-2 bg-black/95 border-none rounded-3xl overflow-hidden">
          {selectedImage && (
            <div className="relative w-full h-[75vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
