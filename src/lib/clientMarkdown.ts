/**
 * Client-side markdown rendering utilities
 * Uses unified ecosystem for faithful markdown rendering
 */

// Cache for processed markdown
const renderCache = new Map<string, string>();

/**
 * Extract frontmatter from markdown
 */
export function extractFrontmatter(markdown: string): Record<string, any> {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const frontmatter: Record<string, any> = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterText.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse boolean values
    if (value === "true" || value === "false") {
      frontmatter[key] = value === "true";
    }
    // Parse arrays (basic)
    else if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key] = JSON.parse(value);
    }
    // Parse objects (basic)
    else if (value.startsWith("{") && value.endsWith("}")) {
      frontmatter[key] = JSON.parse(value);
    } else {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Convert markdown string to HTML using remark pipeline
 * Strips frontmatter and renders the content
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Check cache first
  const cacheKey = markdown;
  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey)!;
  }

  try {
    // Extract content without frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const contentWithoutFrontmatter = markdown.replace(frontmatterRegex, "");

    // Send to API for server-side rendering (since remark needs to be run server-side)
    const response = await fetch("/api/admin/markdown-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: contentWithoutFrontmatter }),
    });

    if (!response.ok) {
      throw new Error("Failed to render markdown");
    }

    const data = await response.json();
    const html = data.html;

    // Cache the result
    renderCache.set(cacheKey, html);

    return html;
  } catch (err) {
    console.error("Markdown rendering error:", err);
    // Fallback to basic rendering
    return fallbackMarkdownToHtml(markdown);
  }
}

/**
 * Fallback markdown to HTML converter (client-side only)
 * Handles basic markdown patterns when API is unavailable
 */
function fallbackMarkdownToHtml(markdown: string): string {
  // Extract content without frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const content = markdown.replace(frontmatterRegex, "");

  let html = content
    // Code blocks (before inline code)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || "plaintext";
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();
      return `<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-2"><code class="language-${language} text-sm">${escapedCode}</code></pre>`;
    })
    // Headings
    .replace(
      /^### (.*?)$/gm,
      "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>"
    )
    .replace(/^## (.*?)$/gm, "<h2 class='text-2xl font-bold mt-6 mb-3'>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1 class='text-3xl font-bold mt-8 mb-4'>$1</h1>")
    // Unordered lists
    .replace(/^\* (.*?)$/gm, "<li class='ml-4'>$1</li>")
    .replace(/^\- (.*?)$/gm, "<li class='ml-4'>$1</li>")
    // Wrap consecutive list items
    .replace(
      /(<li[^>]*>.*<\/li>\n)+/g,
      (match) => `<ul class='list-disc my-2'>${match}</ul>`
    )
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold'>$1</strong>")
    .replace(/__(.*?)__/g, "<strong class='font-bold'>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
    .replace(/_(.*?)_/g, "<em class='italic'>$1</em>")
    // Inline code
    .replace(
      /`([^`]+)`/g,
      "<code class='bg-muted px-1.5 py-0.5 rounded font-mono text-sm'>$1</code>"
    )
    // Links
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      "<a href='$2' class='text-primary hover:underline'>$1</a>"
    )
    // Blockquotes
    .replace(
      /^> (.*?)$/gm,
      "<blockquote class='border-l-4 border-primary/30 pl-4 italic my-2 text-muted-foreground'>$1</blockquote>"
    )
    // Horizontal rules
    .replace(/^---$/gm, "<hr class='my-4 border-border' />")
    // Line breaks
    .replace(/\n\n+/g, "</p><p class='mb-3 mt-3'>")
    .replace(/\n/g, "<br/>");

  return `<div class="prose prose-sm max-w-none"><p class='mb-3'>${html}</p></div>`;
}

/**
 * Clear the render cache
 */
export function clearRenderCache(): void {
  renderCache.clear();
}
