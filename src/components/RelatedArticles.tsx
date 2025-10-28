import Link from "next/link";
import { ArticleMetadata } from "@/lib/markdown";

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
    <aside className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        More in {category}
      </h3>
      <ul className="space-y-3">
        {related.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/${category}/${article.slug}`}
              className="text-slate-700 hover:text-slate-900 hover:underline transition-colors"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
