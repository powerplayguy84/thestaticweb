import { getAllArticlesWithContent } from "@/lib/markdown";
import { initSearchIndex } from "@/components/Search";

export async function SearchIndexInitializer() {
  const articles = await getAllArticlesWithContent();

  const searchData = articles.map((article) => {
    // Remove mermaid diagrams (they appear as <div class="mermaid">...</div>)
    let content = article.content.replace(/<div[^>]*class="[^"]*mermaid[^"]*"[^>]*>[\s\S]*?<\/div>/gi, " ");
    
    // Strip remaining HTML tags from content for better search
    content = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      title: article.title,
      description: article.description,
      category: article.category,
      slug: article.slug,
      tags: article.tags,
      content,
    };
  });

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
