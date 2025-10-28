import { getAllArticles } from "@/lib/markdown";
import { initSearchIndex } from "@/components/Search";

export async function SearchIndexInitializer() {
  const articles = await getAllArticles();

  const searchData = articles.map((article) => ({
    title: article.title,
    description: article.description,
    category: article.category,
    slug: article.slug,
    tags: article.tags,
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
