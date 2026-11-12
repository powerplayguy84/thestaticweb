import { NextRequest, NextResponse } from "next/server";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";

/**
 * POST /api/admin/markdown-preview
 * Converts markdown to HTML for live preview in the admin editor
 */
export async function POST(request: NextRequest) {
  try {
    const { markdown } = await request.json();

    if (!markdown || typeof markdown !== "string") {
      return NextResponse.json(
        { error: "Invalid markdown content" },
        { status: 400 }
      );
    }

    // Process markdown through remark pipeline
    const file = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
      .use(rehypeRaw) // Parse raw HTML in markdown
      .use(rehypeHighlight, { prefix: "hljs-" }) // Syntax highlighting
      .use(rehypeStringify) // Convert AST to string
      .process(markdown);

    let html = String(file);
    html = html.replace(
      /<table(?:\s[^>]*)?>[\s\S]*?<\/table>/gi,
      (match) => `<div class="table-wrapper">${match}</div>`
    );

    return NextResponse.json({ html });
  } catch (err) {
    console.error("Markdown rendering error:", err);
    return NextResponse.json(
      { error: "Failed to render markdown" },
      { status: 500 }
    );
  }
}
