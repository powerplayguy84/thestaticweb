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
export function getAllCategories(): string[] {
  const items = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  return items
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort();
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
export function getArticlesRaw(category: string): Array<{
  filename: string;
  slug: string;
  index: number;
  title: string;
  rawContent: string;
}> {
  const categoryPath = path.join(CONTENT_DIR, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".md"));

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
  category: string,
  index: number,
  slug: string,
  content: string
): void {
  const categoryPath = path.join(CONTENT_DIR, category);

  if (!fs.existsSync(categoryPath)) {
    throw new Error(`Category "${category}" does not exist`);
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
  category: string,
  oldFilename: string,
  newIndex: number,
  newSlug: string,
  content: string
): void {
  const categoryPath = path.join(CONTENT_DIR, category);
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
export function deleteArticle(category: string, filename: string): void {
  const categoryPath = path.join(CONTENT_DIR, category);
  const filePath = path.join(categoryPath, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Article "${filename}" does not exist`);
  }

  fs.unlinkSync(filePath);
}
