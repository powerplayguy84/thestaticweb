import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { ArticleMetadata } from "@/lib/markdown";

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
    <div className="flex gap-4 mt-12 pt-8 border-t border-border" data-no-search-highlight>
      {previous ? (
        <Link
          href={`/${encodeURIComponent(category)}/${previous.slug}`}
          className="flex-1 p-4 rounded-xl border border-border/60 hover:border-foreground/20 hover:bg-muted/40 active:scale-[0.99] transition-all group min-w-0"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
            Previous
          </div>
          <h4 className="font-semibold text-sm sm:text-base text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {previous.title}
          </h4>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/${encodeURIComponent(category)}/${next.slug}`}
          className="flex-1 p-4 rounded-xl border border-border/60 hover:border-foreground/20 hover:bg-muted/40 active:scale-[0.99] transition-all group text-right min-w-0"
        >
          <div className="flex items-center justify-end gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
          </div>
          <h4 className="font-semibold text-sm sm:text-base text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {next.title}
          </h4>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
