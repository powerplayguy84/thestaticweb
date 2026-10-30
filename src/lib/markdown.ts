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
import { parseDateTimestamp } from "@/lib/date";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Custom rehype plugin to convert mermaid code blocks to divs before syntax highlighting
function rehypeMermaidToDiv() {
  return (tree: any) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "pre" && node.children && node.children.length > 0) {
        const codeNode = node.children[0] as Element;
        if (
          codeNode.tagName === "code" &&
          codeNode.properties &&
          Array.isArray(codeNode.properties.className) &&
          codeNode.properties.className.includes("language-mermaid")
        ) {
          // Replace the <pre><code> structure with a simple <div class="mermaid">
          const mermaidDiv: Element = {
            type: "element",
            tagName: "div",
            properties: { className: ["mermaid"] },
            children: codeNode.children,
          };

          // Replace the pre node with the div in the parent
          if (parent && typeof index === "number") {
            parent.children[index] = mermaidDiv;
          }
        }
      }
    });
  };
}

export interface SwiperCardData {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  image?: string;
  htmlContent: string;
  isImageOnly?: boolean;
}

export interface ArticleSection {
  id: string;
  major: number;
  title?: string;
  htmlContent?: string;
  subCards: SwiperCardData[];
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
  sections?: ArticleSection[];
}

export type ArticleMetadata = Omit<Article, "content" | "sections">;

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
 * Parse markdown file and return metadata and HTML content
 */
export async function parseMarkdownFile(filePath: string): Promise<{
  metadata: {
    title: string;
    description: string;
    date: string;
    featured: boolean;
    tags?: string[];
    image?: string;
    subtitle?: string;
    badge?: string;
    [key: string]: any;
  };
  content: string;
}> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // Parse markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMermaidToDiv)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  let htmlContent = processedContent.toString();

  // Wrap code blocks with our custom wrapper for copying functionality
  htmlContent = htmlContent.replace(
    /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    (match, codeAttrs, codeContent) => {
      // Don't wrap mermaid diagrams
      if (codeAttrs.includes("language-mermaid")) {
        return match;
      }
      return `<div class="code-block-wrapper relative group/code">${match}</div>`;
    }
  );

  return {
    metadata: {
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString().split("T")[0],
      featured: data.featured || false,
      tags: data.tags || [],
      image: data.image && data.image.trim() ? data.image : undefined,
      subtitle: data.subtitle || undefined,
      badge: data.badge || undefined,
      ...data,
    },
    content: htmlContent,
  };
}

/**
 * Helper to parse numbered file naming:
 * e.g. "01-intro.md", "02-about.md", "0.3.1-feature1.md", "03.1-feature1.md"
 */
function parseNumberedFilename(filename: string): {
  filename: string;
  name: string;
  major: number;
  minor: number[];
  isSub: boolean;
} | null {
  const match = filename.match(/^([0-9.]+)-(.*)\.md$/);
  if (!match) return null;

  const rawNum = match[1];
  const name = match[2];

  let normalized = rawNum;
  // If written as 0.3.1, normalize to 3.1
  if (/^0\.\d+/.test(normalized)) {
    normalized = normalized.replace(/^0\./, "");
  }

  const parts = normalized
    .split(".")
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n));

  if (parts.length === 0) return null;

  const major = parts[0];
  const minor = parts.slice(1);
  const isSub = minor.length > 0;

  return {
    filename,
    name,
    major,
    minor,
    isSub,
  };
}

/**
 * Parses a multi-file article directory
 */
async function parseArticleDirectory(
  dirPath: string,
  category: string,
  slug: string,
  index: number
): Promise<Article> {
  const allEntries = fs.readdirSync(dirPath);
  const mdFiles = allEntries.filter((f) => f.endsWith(".md"));

  const parsedItems = mdFiles
    .map(parseNumberedFilename)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Sort items: by major asc, non-sub before sub, then sub by minor
  parsedItems.sort((a, b) => {
    if (a.major !== b.major) return a.major - b.major;
    if (!a.isSub && b.isSub) return -1;
    if (a.isSub && !b.isSub) return 1;
    for (let i = 0; i < Math.max(a.minor.length, b.minor.length); i++) {
      const aVal = a.minor[i] ?? 0;
      const bVal = b.minor[i] ?? 0;
      if (aVal !== bVal) return aVal - bVal;
    }
    return 0;
  });

  // Group by major section
  const sectionMap = new Map<number, ArticleSection>();
  const sections: ArticleSection[] = [];

  // Determine primary article metadata from the lowest numbered non-sub file, or index.md, or first file
  let primaryMetadata: any = null;

  // Process all files
  for (const item of parsedItems) {
    const filePath = path.join(dirPath, item.filename);
    const { metadata, content } = await parseMarkdownFile(filePath);

    if (!item.isSub) {
      if (!primaryMetadata) {
        primaryMetadata = metadata;
      }
      let section = sectionMap.get(item.major);
      if (!section) {
        section = {
          id: `section-${item.major}-${item.name}`,
          major: item.major,
          title: metadata.title,
          htmlContent: content,
          subCards: [],
        };
        sectionMap.set(item.major, section);
        sections.push(section);
      } else {
        section.title = metadata.title;
        section.htmlContent = content;
      }
    } else {
      // Sub-file for horizontal Swiper
      let section = sectionMap.get(item.major);
      if (!section) {
        section = {
          id: `section-${item.major}`,
          major: item.major,
          title: undefined,
          htmlContent: undefined,
          subCards: [],
        };
        sectionMap.set(item.major, section);
        sections.push(section);
      }

      // Check if image is in frontmatter or in markdown content
      let cardImage = metadata.image;
      let bodyWithoutImg = content;

      if (!cardImage && content) {
        const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          cardImage = imgMatch[1];
          bodyWithoutImg = content.replace(/<p>\s*<img[^>]+>\s*<\/p>/i, "").trim();
        }
      }

      // Check if this card has NO text content (no subtitle, description, or body text)
      const hasTextBody = bodyWithoutImg.replace(/<[^>]*>/g, "").trim().length > 0;
      const hasDescription = Boolean(metadata.description && metadata.description.trim());
      const hasSubtitle = Boolean(metadata.subtitle && metadata.subtitle.trim());
      const hasTitle = Boolean(metadata.title && metadata.title.trim() && metadata.title !== "Untitled");

      const isImageOnly = Boolean(cardImage && !hasTextBody && !hasDescription && !hasSubtitle && !hasTitle);

      section.subCards.push({
        id: `${item.major}-${item.name}`,
        title: metadata.title && metadata.title !== "Untitled" ? metadata.title : undefined,
        subtitle: metadata.subtitle,
        description: metadata.description,
        badge: metadata.badge || (metadata.tags && metadata.tags[0]),
        image: cardImage,
        htmlContent: isImageOnly ? "" : bodyWithoutImg,
        isImageOnly,
      });
    }
  }

  // Fallback metadata if not found from non-sub file
  if (!primaryMetadata) {
    const indexPath = path.join(dirPath, "index.md");
    if (fs.existsSync(indexPath)) {
      const parsedIndex = await parseMarkdownFile(indexPath);
      primaryMetadata = parsedIndex.metadata;
    } else if (parsedItems.length > 0) {
      const firstPath = path.join(dirPath, parsedItems[0].filename);
      const parsedFirst = await parseMarkdownFile(firstPath);
      primaryMetadata = parsedFirst.metadata;
    } else {
      primaryMetadata = {
        title: slug.replace(/-/g, " "),
        description: "",
        date: new Date().toISOString().split("T")[0],
        featured: false,
        tags: [],
      };
    }
  }

  // Combine full content for text search, TOC, and fallback reading
  const contentParts: string[] = [];
  for (const sec of sections) {
    if (sec.htmlContent) {
      contentParts.push(sec.htmlContent);
    }
    for (const card of sec.subCards) {
      if (card.htmlContent) {
        contentParts.push(`<h3>${card.title}</h3>\n${card.htmlContent}`);
      }
    }
  }
  const combinedContent = contentParts.join("\n\n");

  return {
    slug,
    category,
    index,
    title: primaryMetadata.title || "Untitled",
    description: primaryMetadata.description || "",
    date: primaryMetadata.date || new Date().toISOString().split("T")[0],
    featured: primaryMetadata.featured || false,
    tags: primaryMetadata.tags || [],
    image: primaryMetadata.image,
    content: combinedContent,
    sections,
  };
}

/**
 * Get all articles in a category, sorted by index
 * Supports both nested article directories (01-article-name/) and direct markdown files (01-article-name.md)
 */
export async function getArticlesByCategory(
  category: string
): Promise<ArticleMetadata[]> {
  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find((cat) => cat.slug === category);

  if (!categoryInfo) {
    return [];
  }

  const categoryPath = path.join(CONTENT_DIR, categoryInfo.name);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(categoryPath, { withFileTypes: true });

  const articles: ArticleMetadata[] = [];

  for (const entry of entries) {
    if (entry.name === "index.md") continue;

    if (entry.isDirectory()) {
      // Nested article directory: e.g. "01-core-philosophy"
      const folderName = entry.name;
      const slug = folderName.replace(/^\d+-/, "");
      const indexMatch = folderName.match(/^(\d+)-/);
      const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

      const fullArticle = await parseArticleDirectory(
        path.join(categoryPath, folderName),
        category,
        slug,
        index
      );

      const { content, sections, ...metadata } = fullArticle;
      articles.push(metadata);
    } else if (entry.name.endsWith(".md")) {
      // Single markdown file: e.g. "01-core-philosophy.md"
      const filename = entry.name;
      const filePath = path.join(categoryPath, filename);
      const slug = filename.replace(/^\d+-/, "").replace(/\.md$/, "");
      const indexMatch = filename.match(/^(\d+)-/);
      const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

      const { metadata } = await parseMarkdownFile(filePath);

      articles.push({
        slug,
        category,
        index,
        ...metadata,
      });
    }
  }

  return articles.sort((a, b) => a.index - b.index);
}

/**
 * Get a specific article by category and slug
 */
export async function getArticle(
  category: string,
  slug: string
): Promise<Article | null> {
  // Normalize both category and slug in case either is URI-encoded
  const cleanCategory = decodeURIComponent(category).trim();
  const cleanSlug = decodeURIComponent(slug).trim();

  const categoriesInfo = await getCategoriesWithInfo();
  const categoryInfo = categoriesInfo.find(
    (cat) => cat.slug === cleanCategory || cat.slug === category
  );

  if (!categoryInfo) {
    return null;
  }

  const categoryPath = path.join(CONTENT_DIR, categoryInfo.name);

  if (!fs.existsSync(categoryPath)) {
    return null;
  }

  const entries = fs.readdirSync(categoryPath, { withFileTypes: true });

  // 1. Check for nested article directory matching slug
  const targetDir = entries.find(
    (e) =>
      e.isDirectory() &&
      (e.name.replace(/^\d+-/, "") === cleanSlug ||
        e.name.replace(/^\d+-/, "") === slug)
  );

  if (targetDir) {
    const indexMatch = targetDir.name.match(/^(\d+)-/);
    const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;
    return await parseArticleDirectory(
      path.join(categoryPath, targetDir.name),
      cleanCategory,
      cleanSlug,
      index
    );
  }

  // 2. Fall back to standalone .md file
  const targetFile = entries.find(
    (e) =>
      !e.isDirectory() &&
      e.name.endsWith(".md") &&
      e.name !== "index.md" &&
      (e.name.replace(/^\d+-/, "").replace(/\.md$/, "") === cleanSlug ||
        e.name.replace(/^\d+-/, "").replace(/\.md$/, "") === slug)
  );

  if (targetFile) {
    const filePath = path.join(categoryPath, targetFile.name);
    const indexMatch = targetFile.name.match(/^(\d+)-/);
    const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;

    const { metadata, content } = await parseMarkdownFile(filePath);

    return {
      slug: cleanSlug,
      category: cleanCategory,
      index,
      ...metadata,
      content,
    };
  }

  return null;
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
    .sort(
      (a, b) => parseDateTimestamp(b.date) - parseDateTimestamp(a.date)
    );
}

/**
 * Get all articles with full content (for search indexing)
 */
export async function getAllArticlesWithContent(): Promise<Article[]> {
  const categories = await getCategories();
  const articles: Article[] = [];

  for (const cat of categories) {
    const metas = await getArticlesByCategory(cat);
    for (const meta of metas) {
      const art = await getArticle(cat, meta.slug);
      if (art) {
        articles.push(art);
      }
    }
  }

  return articles.sort(
    (a, b) => parseDateTimestamp(b.date) - parseDateTimestamp(a.date)
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
  iconUrl?: string;
  theme?: string;
} {
  const settingsFilePath = path.join(CONTENT_DIR, "settings.md");

  if (!fs.existsSync(settingsFilePath)) {
    return {
      siteUrl: "https://yourdomain.com",
      siteTitle: "Invent Peace",
      siteDescription: "Invent Peace Web Portal",
      author: "Invent Peace",
      organizationName: "Invent Peace",
    };
  }

  const fileContent = fs.readFileSync(settingsFilePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    siteUrl: data.siteUrl || "https://yourdomain.com",
    siteTitle: data.siteTitle || "Invent Peace",
    siteDescription: data.siteDescription || "Invent Peace Web Portal",
    author: data.author || "Invent Peace",
    organizationName: data.organizationName || "Invent Peace",
    logoUrl: data.logoUrl || undefined,
    iconUrl: data.iconUrl || undefined,
    theme: data.theme || undefined,
  };
}

/**
 * Get homepage hero configuration from homepage.md
 */
export async function getHomepageHero(): Promise<{
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cta?: {
    text: string;
    link: string;
  };
  logo?: string;
  navbar?: {
    title?: string;
    logo?: string;
  };
  content?: string;
}> {
  const homepagePath = path.join(CONTENT_DIR, "homepage.md");

  if (!fs.existsSync(homepagePath)) {
    return {
      title: "Invent Peace",
      subtitle: "Welcome to our website",
      description: "A modern static website powered by Markdown",
    };
  }

  const fileContent = fs.readFileSync(homepagePath, "utf-8");
  const { data, content } = matter(fileContent);

  let htmlContent = "";
  if (content && content.trim()) {
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(content);

    htmlContent = processedContent.toString();
  }

  return {
    title: data.title || "Invent Peace",
    subtitle: data.subtitle || undefined,
    description: data.description || undefined,
    image: data.image || undefined,
    logo: data.logo || undefined,
    cta: data.cta || undefined,
    navbar: data.navbar
      ? {
          title: data.navbar.title || undefined,
          logo: data.navbar.logo || undefined,
        }
      : undefined,
    content: htmlContent || undefined,
  };
}
