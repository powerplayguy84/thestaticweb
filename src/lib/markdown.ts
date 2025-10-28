import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Article {
  slug: string;
  category: string;
  index: number;
  title: string;
  description: string;
  date: string;
  featured: boolean;
  tags?: string[];
  image?: string;
  content: string;
}

export type ArticleMetadata = Omit<Article, "content">;

/**
 * Get all categories
 */
export function getCategories(): string[] {
  const items = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  return items
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort();
}

/**
 * Parse markdown file and extract metadata + content
 */
async function parseMarkdownFile(filePath: string): Promise<{
  metadata: Omit<ArticleMetadata, "slug" | "category" | "index">;
  content: string;
}> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const htmlContent = processedContent.toString();

  return {
    metadata: {
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString().split("T")[0],
      featured: data.featured || false,
      tags: data.tags || [],
      image: data.image || undefined,
    },
    content: htmlContent,
  };
}

/**
 * Get all articles in a category, sorted by index
 */
export async function getArticlesByCategory(
  category: string
): Promise<ArticleMetadata[]> {
  const categoryPath = path.join(CONTENT_DIR, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".md"));

  const articles: ArticleMetadata[] = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(categoryPath, file);
      const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");
      const indexMatch = file.match(/^(\d+)-/);
      const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

      const { metadata } = await parseMarkdownFile(filePath);

      return {
        slug,
        category,
        index,
        ...metadata,
      };
    })
  );

  return articles.sort((a, b) => a.index - b.index);
}

/**
 * Get a specific article by category and slug
 */
export async function getArticle(
  category: string,
  slug: string
): Promise<Article | null> {
  const categoryPath = path.join(CONTENT_DIR, category);

  if (!fs.existsSync(categoryPath)) {
    return null;
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".md"));
  const targetFile = files.find(
    (file) => file.replace(/^\d+-/, "").replace(/\.md$/, "") === slug
  );

  if (!targetFile) {
    return null;
  }

  const filePath = path.join(categoryPath, targetFile);
  const indexMatch = targetFile.match(/^(\d+)-/);
  const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

  const { metadata, content } = await parseMarkdownFile(filePath);

  return {
    slug,
    category,
    index,
    ...metadata,
    content,
  };
}

/**
 * Get all articles (across all categories)
 */
export async function getAllArticles(): Promise<ArticleMetadata[]> {
  const categories = getCategories();
  const allArticles = await Promise.all(
    categories.map((cat) => getArticlesByCategory(cat))
  );
  return allArticles
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(): Promise<ArticleMetadata[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((article) => article.featured).slice(0, 6);
}

/**
 * Get articles by tag
 */
export async function getArticlesByTag(
  tag: string
): Promise<ArticleMetadata[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(
    (article) => article.tags && article.tags.includes(tag)
  );
}

/**
 * Get all unique tags across all articles
 */
export async function getAllTags(): Promise<string[]> {
  const allArticles = await getAllArticles();
  const tagsSet = new Set<string>();

  allArticles.forEach((article) => {
    if (article.tags) {
      article.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get previous and next articles in the same category
 */
export async function getAdjacentArticles(
  category: string,
  currentIndex: number
): Promise<{ previous: ArticleMetadata | null; next: ArticleMetadata | null }> {
  const articles = await getArticlesByCategory(category);

  const currentIdx = articles.findIndex(
    (article) => article.index === currentIndex
  );

  return {
    previous: currentIdx > 0 ? articles[currentIdx - 1] : null,
    next: currentIdx < articles.length - 1 ? articles[currentIdx + 1] : null,
  };
}

/**
 * Get homepage hero content
 */
export async function getHomepageHero(): Promise<{
  title: string;
  description: string;
  subtitle?: string;
  image?: string;
  logo?: string;
  cta?: {
    text: string;
    link: string;
  };
}> {
  const homepageFilePath = path.join(CONTENT_DIR, "homepage.md");

  if (!fs.existsSync(homepageFilePath)) {
    return {
      title: "The Static Web",
      description:
        "A collection of articles, tutorials, and guides for modern web development. Built with Next.js and Markdown.",
    };
  }

  const fileContent = fs.readFileSync(homepageFilePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: data.title || "The Static Web",
    description:
      data.description ||
      "A collection of articles, tutorials, and guides for modern web development. Built with Next.js and Markdown.",
    subtitle: data.subtitle || undefined,
    image: data.image || undefined,
    logo: data.logo || undefined,
    cta: data.cta || undefined,
  };
}
