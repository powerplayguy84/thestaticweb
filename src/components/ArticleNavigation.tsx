import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { ArticleMetadata } from "@/lib/markdown";
import { Card } from "@/components/ui/card";

interface ArticleNavigationProps {
  previous: ArticleMetadata | null;
  next: ArticleMetadata | null;
  category: string;
}

export default function ArticleNavigation({
  previous,
  next,
  category,
}: ArticleNavigationProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border" data-no-search-highlight>
      {previous ? (
        <Card
          size="sm"
          className="p-0 hover:ring-foreground/20 hover:border-foreground/30 hover:bg-muted/40 active:scale-[0.99] transition-all group cursor-pointer"
        >
          <Link
            href={`/${encodeURIComponent(category)}/${previous.slug}`}
            className="flex flex-row items-center gap-4 p-4 w-full h-full"
          >
            {previous.image && (
              <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50">
                <Image
                  src={previous.image}
                  alt={previous.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </div>
              <h4 className="font-semibold text-sm sm:text-base text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {previous.title}
              </h4>
            </div>
          </Link>
        </Card>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Card
          size="sm"
          className="p-0 hover:ring-foreground/20 hover:border-foreground/30 hover:bg-muted/40 active:scale-[0.99] transition-all group cursor-pointer"
        >
          <Link
            href={`/${encodeURIComponent(category)}/${next.slug}`}
            className="flex flex-row items-center justify-end gap-4 p-4 text-right w-full h-full"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-end gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
              <h4 className="font-semibold text-sm sm:text-base text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {next.title}
              </h4>
            </div>
            {next.image && (
              <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50">
                <Image
                  src={next.image}
                  alt={next.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </div>
            )}
          </Link>
        </Card>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
