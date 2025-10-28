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
    <div className="flex gap-4 mt-12 pt-8 border-t border-slate-200">
      {previous ? (
        <Link
          href={`/${category}/${previous.slug}`}
          className="flex-1 p-4 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group"
        >
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </div>
          <h4 className="font-semibold text-slate-900 group-hover:text-slate-700">
            {previous.title}
          </h4>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/${category}/${next.slug}`}
          className="flex-1 p-4 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group text-right"
        >
          <div className="flex items-center justify-end gap-2 text-sm text-slate-600 mb-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-slate-900 group-hover:text-slate-700">
            {next.title}
          </h4>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
