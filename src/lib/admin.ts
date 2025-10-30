import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface AdminSettings {
  adminPassword: string;
}

/**
 * Get admin password from settings.md
 */
export function getAdminSettings(): AdminSettings {
  const settingsFilePath = path.join(CONTENT_DIR, "settings.md");

  if (!fs.existsSync(settingsFilePath)) {
    return { adminPassword: "admin123" }; // Default password
  }

  const fileContent = fs.readFileSync(settingsFilePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    adminPassword: data.adminPassword || "admin123",
  };
}

/**
 * Get all categories including hidden ones
 */
export function getAllCategories(): Array<{
  folderName: string;
  slug: string;
  index: number;
}> {
  const items = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  return items
    .filter((item) => item.isDirectory())
    .map((item) => {
      const folderName = item.name;
      const indexMatch = folderName.match(/^(\d+)-/);
      const index = indexMatch ? parseInt(indexMatch[1], 10) : 999;
      const slug = folderName.replace(/^\d+-/, "");

      return {
        folderName,
        slug,
        index,
      };
    })
    .sort((a, b) => {
      if (a.index !== b.index) {
        return a.index - b.index;
      }
      return a.slug.localeCompare(b.slug);
    });
}

/**
 * Create a new category
 */
export function createCategory(categoryName: string): void {
  const categoryPath = path.join(CONTENT_DIR, categoryName);

  if (fs.existsSync(categoryPath)) {
    throw new Error(`Category "${categoryName}" already exists`);
  }

  fs.mkdirSync(categoryPath, { recursive: true });
}

/**
 * Delete a category (only if empty)
 */
export function deleteCategory(categoryName: string): void {
  const categoryPath = path.join(CONTENT_DIR, categoryName);

  if (!fs.existsSync(categoryPath)) {
    throw new Error(`Category "${categoryName}" does not exist`);
  }

  const files = fs.readdirSync(categoryPath);
  if (files.length > 0) {
    throw new Error(
      `Category "${categoryName}" is not empty. Delete all articles first.`
    );
  }

  fs.rmdirSync(categoryPath);
}

/**
 * Rename a category
 */
export function renameCategory(oldName: string, newName: string): void {
  const oldPath = path.join(CONTENT_DIR, oldName);
  const newPath = path.join(CONTENT_DIR, newName);

  if (!fs.existsSync(oldPath)) {
    throw new Error(`Category "${oldName}" does not exist`);
  }

  if (fs.existsSync(newPath)) {
    throw new Error(`Category "${newName}" already exists`);
  }

  fs.renameSync(oldPath, newPath);
}

/**
 * Get all articles in a category with their raw content
 */
export function getArticlesRaw(categorySlug: string): Array<{
  filename: string;
  slug: string;
  index: number;
  title: string;
  rawContent: string;
}> {
  // Find the actual folder name for this category slug
  const categories = getAllCategories();
  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    return [];
  }

  const categoryPath = path.join(CONTENT_DIR, category.folderName);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".md") && file !== "index.md");

  return files
    .map((filename) => {
      const filePath = path.join(categoryPath, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      const match = filename.match(/^(\d+)-(.+)\.md$/);
      const index = match ? parseInt(match[1], 10) : 0;
      const slug = match ? match[2] : filename.replace(".md", "");

      return {
        filename,
        slug,
        index,
        title: data.title || "Untitled",
        rawContent: fileContent,
      };
    })
    .sort((a, b) => a.index - b.index);
}

/**
 * Create a new article
 */
export function createArticle(
  categorySlug: string,
  index: number,
  slug: string,
  content: string
): void {
  // Find the actual folder name for this category slug
  const categories = getAllCategories();
  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    throw new Error(`Category "${categorySlug}" does not exist`);
  }

  const categoryPath = path.join(CONTENT_DIR, category.folderName);

  if (!fs.existsSync(categoryPath)) {
    throw new Error(`Category "${categorySlug}" does not exist`);
  }

  const filename = `${String(index).padStart(2, "0")}-${slug}.md`;
  const filePath = path.join(categoryPath, filename);

  if (fs.existsSync(filePath)) {
    throw new Error(`Article "${filename}" already exists`);
  }

  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * Update an existing article
 */
export function updateArticle(
  categorySlug: string,
  oldFilename: string,
  newIndex: number,
  newSlug: string,
  content: string
): void {
  // Find the actual folder name for this category slug
  const categories = getAllCategories();
  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    throw new Error(`Category "${categorySlug}" does not exist`);
  }

  const categoryPath = path.join(CONTENT_DIR, category.folderName);
  const oldFilePath = path.join(categoryPath, oldFilename);

  if (!fs.existsSync(oldFilePath)) {
    throw new Error(`Article "${oldFilename}" does not exist`);
  }

  const newFilename = `${String(newIndex).padStart(2, "0")}-${newSlug}.md`;
  const newFilePath = path.join(categoryPath, newFilename);

  // Write new content
  fs.writeFileSync(newFilePath, content, "utf-8");

  // If filename changed, delete old file
  if (oldFilename !== newFilename) {
    fs.unlinkSync(oldFilePath);
  }
}

/**
 * Delete an article
 */
export function deleteArticle(categorySlug: string, filename: string): void {
  // Find the actual folder name for this category slug
  const categories = getAllCategories();
  const category = categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    throw new Error(`Category "${categorySlug}" does not exist`);
  }

  const categoryPath = path.join(CONTENT_DIR, category.folderName);
  const filePath = path.join(categoryPath, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Article "${filename}" does not exist`);
  }

  fs.unlinkSync(filePath);
}
