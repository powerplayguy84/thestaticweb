import { MetadataRoute } from "next";
import { getCategories, getAllArticles, getSiteSettings } from "@/lib/markdown";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = getSiteSettings();
  const baseUrl = siteUrl;

  // Get all articles
  const articles = await getAllArticles();
  const categories = await getCategories();

  const articleUrls = articles.map((article) => {
    const lastModified = article.date ? new Date(article.date) : new Date();
    return {
      url: `${baseUrl}/${article.category}/${article.slug}`,
      lastModified: isNaN(lastModified.getTime()) ? new Date() : lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
