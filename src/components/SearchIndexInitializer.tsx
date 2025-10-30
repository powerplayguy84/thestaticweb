import { getAllArticlesWithContent } from "@/lib/markdown";
import { initSearchIndex } from "@/components/Search";

export async function SearchIndexInitializer() {
  const articles = await getAllArticlesWithContent();

  const searchData = articles.map((article) => ({
    title: article.title,
    description: article.description,
    category: article.category,
    slug: article.slug,
    tags: article.tags,
    // Strip HTML tags from content for better search
    content: article.content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  }));

  // Initialize the search index on the client
  if (typeof window !== "undefined") {
    initSearchIndex(searchData);
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__SEARCH_INDEX__ = ${JSON.stringify(searchData)};`,
      }}
    />
  );
}
