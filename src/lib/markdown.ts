import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import type { Element } from "hast";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Custom rehype plugin to convert mermaid code blocks to divs before syntax highlighting
function rehypeMermaidToDiv() {
  return (tree: any) => {
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "code" &&
        node.properties &&
        Array.isArray(node.properties.className) &&
        node.properties.className.includes("language-mermaid")
      ) {
        // Get the parent <pre> node and replace it with a div
        node.tagName = "div";
        node.properties.className = ["mermaid"];
      }
    });
  };
}

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

export interface CategoryInfo {
  slug: string;
  name: string;
  index: number;
  title?: string;
  description?: string;
}

/**
 * Get category metadata from index.md if it exists
 */
async function getCategoryMetadata(
  categoryFolderName: string
): Promise<{ title?: string; description?: string }> {
  const indexPath = path.join(CONTENT_DIR, categoryFolderName, "index.md");

  if (!fs.existsSync(indexPath)) {
    return {};
  }

  try {
    const fileContent = fs.readFileSync(indexPath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: data.title,
      description: data.description,
    };
  } catch {
    return {};
  }
}

/**
 * Get all categories with their metadata (excluding hidden ones)
 */
export async function getCategoriesWithInfo(): Promise<CategoryInfo[]> {
  const items = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  // Read hidden categories from settings
  const settingsFilePath = path.join(CONTENT_DIR, "settings.md");
  let hiddenCategories: string[] = [];

  if (fs.existsSync(settingsFilePath)) {
    const fileContent = fs.readFileSync(settingsFilePath, "utf-8");
    const { data } = matter(fileContent);
    hiddenCategories = data.hiddenCategories || [];
  }

  const categoriesPromises = items
    .filter((item) => item.isDirectory())
    .map(async (item) => {
      const folderName = item.name;
      // Extract index from folder name (e.g., "01-guides" -> index: 1, slug: "guides")
      const indexMatch = folderName.match(/^(\d+)-/);
      const index = indexMatch ? parseInt(indexMatch[1], 10) : 999;
      const slug = folderName.replace(/^\d+-/, "");

      // Get metadata from index.md if it exists
      const metadata = await getCategoryMetadata(folderName);

      return {
        slug,
        name: folderName,
        index,
        title: metadata.title,
        description: metadata.description,
      };
    });

  const categories = await Promise.all(categoriesPromises);

  const filtered = categories.filter(
    (cat) =>
      !hiddenCategories.includes(cat.slug) &&
      !hiddenCategories.includes(cat.name)
  );

  // Sort by index first, then by slug alphabetically
  return filtered.sort((a, b) => {
    if (a.index !== b.index) {
      return a.index - b.index;
    }
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Get all categories (excluding hidden ones) - returns slugs only
 */
export async function getCategories(): Promise<string[]> {
  const categoriesInfo = await getCategoriesWithInfo();
  return categoriesInfo.map((cat) => cat.slug);
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

  const processedContent = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown (tables, task lists, strikethrough)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to rehype (HTML)
    .use(rehypeRaw) // Parse raw HTML in markdown
    .use(rehypeMermaidToDiv) // Convert mermaid blocks to divs BEFORE syntax highlighting
    .use(rehypeHighlight) // Syntax highlighting for code blocks
    .use(rehypeStringify) // Convert to HTML string
    .process(content);

  let htmlContent = processedContent.toString();

  // Wrap tables in scrollable containers
  htmlContent = htmlContent.replace(
    /<table([^>]*)>/g,
    '<div class="table-wrapper"><table$1>'
  );
  htmlContent = htmlContent.replace(
    /<\/table>/g,
    '</table></div>'
  );

  // Wrap code blocks with copy button container
  htmlContent = htmlContent.replace(
    /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    (match, codeAttrs, codeContent) => {
      // Extract the actual code text and escape it for JSON
      const plainText = codeContent
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      const escapedCode = plainText
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      return `<div class="code-block-wrapper" data-code="${escapedCode}"><pre><code${codeAttrs}>${codeContent}</code></pre><button class="copy-code-btn" aria-label="Copy code" title="Copy code"><svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg><svg class="check-icon hidden" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></button></div>`;
    }
  );

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
  // Find the actual folder name for this category slug
  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find((cat) => cat.slug === category);

  if (!categoryInfo) {
    return [];
  }

  const categoryPath = path.join(CONTENT_DIR, categoryInfo.name);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".md") && file !== "index.md");

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
  // Find the actual folder name for this category slug
  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find((cat) => cat.slug === category);

  if (!categoryInfo) {
    return null;
  }

  const categoryPath = path.join(CONTENT_DIR, categoryInfo.name);

  if (!fs.existsSync(categoryPath)) {
    return null;
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".md") && file !== "index.md");
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
  const categories = await getCategories();
  const allArticles = await Promise.all(
    categories.map((cat) => getArticlesByCategory(cat))
  );
  return allArticles
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all articles with full content (for search indexing)
 */
export async function getAllArticlesWithContent(): Promise<Article[]> {
  const categoriesInfo = await getCategoriesWithInfo();
  const allArticles: Article[] = [];

  for (const categoryInfo of categoriesInfo) {
    const categoryPath = path.join(CONTENT_DIR, categoryInfo.name);
    if (!fs.existsSync(categoryPath)) continue;

    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".md") && file !== "index.md");

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");
      const indexMatch = file.match(/^(\d+)-/);
      const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

      const { metadata, content } = await parseMarkdownFile(filePath);

      allArticles.push({
        slug,
        category: categoryInfo.slug,
        index,
        ...metadata,
        content,
      });
    }
  }

  return allArticles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
 * Get site settings from settings.md
 */
export function getSiteSettings(): {
  siteUrl: string;
  siteTitle: string;
  siteDescription: string;
  author: string;
  organizationName: string;
  logoUrl?: string;
  hiddenCategories?: string[];
} {
  const settingsFilePath = path.join(CONTENT_DIR, "settings.md");

  if (!fs.existsSync(settingsFilePath)) {
    return {
      siteUrl: "https://yourdomain.com",
      siteTitle: "The Static Web",
      siteDescription:
        "A collection of articles, tutorials, and guides for modern web development.",
      author: "The Static Web",
      organizationName: "The Static Web",
      hiddenCategories: [],
    };
  }

  const fileContent = fs.readFileSync(settingsFilePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    siteUrl: data.siteUrl || "https://yourdomain.com",
    siteTitle: data.siteTitle || "The Static Web",
    siteDescription:
      data.siteDescription ||
      "A collection of articles, tutorials, and guides for modern web development.",
    author: data.author || "The Static Web",
    organizationName: data.organizationName || "The Static Web",
    logoUrl: data.logoUrl || undefined,
    hiddenCategories: data.hiddenCategories || [],
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
  navbar?: {
    title?: string;
    logo?: string;
  };
  cta?: {
    text: string;
    link: string;
  };
  content?: string;
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
  const { data, content } = matter(fileContent);

  // Process markdown content to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMermaidToDiv) // Convert mermaid blocks to divs BEFORE syntax highlighting
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const htmlContent = processedContent.toString();

  return {
    title: data.title || "The Static Web",
    description:
      data.description ||
      "A collection of articles, tutorials, and guides for modern web development. Built with Next.js and Markdown.",
    subtitle: data.subtitle || undefined,
    image: data.image || undefined,
    logo: data.logo || undefined,
    navbar: data.navbar || undefined,
    cta: data.cta || undefined,
    content: htmlContent,
  };
}
