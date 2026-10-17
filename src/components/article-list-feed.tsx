"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { ArticleMetadata } from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArticleFeedImage } from "@/components/article-feed-image";

interface ArticleListFeedProps {
  articles: ArticleMetadata[];
}

export function ArticleListFeed({ articles }: ArticleListFeedProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!articles || articles.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground border border-dashed border-border/70 rounded-3xl">
        No articles published yet.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        {articles.map((article, index) => {
          const articleUrl = `/${encodeURIComponent(article.category)}/${article.slug}`;

          return (
            <div key={`${article.category}-${article.slug}`}>
              {index > 0 && <Separator className="my-6 md:my-8" />}
              <div
                onClick={() => router.push(articleUrl)}
                className="group cursor-pointer space-y-4 py-2 hover:opacity-95 transition-opacity"
              >
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>
                      Posted on{" "}
                      {article.date ? formatDate(article.date) : "Recent"}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{article.category}</span>
                  </p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-lg px-2 py-0.5 text-[11px] font-medium font-mono text-muted-foreground bg-muted/60 hover:bg-muted"
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
                </div>

                {/* Description */}
                {article.description && (
                  <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                )}

                {/* Image Preview */}
                {article.image && article.image.trim() !== "" && (
                  <div
                    className="space-y-2 pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArticleFeedImage
                      src={article.image}
                      alt={article.title}
                      onClick={() => setSelectedImage(article.image!)}
                    />
                  </div>
                )}

                {/* Footer Action */}
                <div className="flex items-center justify-end pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4 h-8 gap-1.5 active:scale-95 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(articleUrl);
                    }}
                  >
                    Read
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-3.5 group-hover:translate-x-0.5 transition-transform"
                    />
                  </Button>
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
