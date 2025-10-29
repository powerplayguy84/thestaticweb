import Link from "next/link";
import { ArticleMetadata } from "@/lib/markdown";
import { formatCategoryName } from "@/lib/utils";

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
  category: string;
  currentSlug: string;
}

export default function RelatedArticles({
  articles,
  category,
  currentSlug,
}: RelatedArticlesProps) {
  const related = articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        More in {formatCategoryName(category)}
      </h3>
      <ul className="space-y-3">
        {related.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/${encodeURIComponent(category)}/${article.slug}`}
              className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
