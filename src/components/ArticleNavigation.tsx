import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
          className="flex-1 p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted transition-all group min-w-0"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-muted-foreground">
            {previous.title}
          </h4>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/${encodeURIComponent(category)}/${next.slug}`}
          className="flex-1 p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted transition-all group text-right min-w-0"
        >
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-muted-foreground">
            {next.title}
          </h4>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
