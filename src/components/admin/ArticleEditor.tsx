"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  FileSearch,
  SplitSquareVertical,
  Maximize2,
} from "lucide-react";
import { formatCategoryName } from "@/lib/utils";
import { markdownToHtml, extractFrontmatter } from "@/lib/clientMarkdown";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface CategoryInfo {
  folderName: string;
  slug: string;
  index: number;
}

interface ArticleEditorProps {
  categories: CategoryInfo[];
  initialContent?: string;
  initialCategory?: string;
  initialIndex?: string;
  initialSlug?: string;
  initialFilename?: string;
  onSave?: () => void;
  showEmptyState?: boolean;
  isCreatingNew?: boolean;
  getNextIndex?: (category: string) => Promise<number>;
  onStateChange?: (state: {
    category: string;
    index: string;
    slug: string;
    content: string;
    loading: boolean;
    error: string;
    success: string;
    isValid: boolean;
  }) => void;
}

export function ArticleEditor({
  categories,
  initialContent = "",
  initialCategory = "",
  initialIndex = "01",
  initialSlug = "",
  initialFilename = "",
  onSave,
  showEmptyState = false,
  isCreatingNew = false,
  getNextIndex,
  onStateChange,
}: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [index, setIndex] = useState(initialIndex);
  const [slug, setSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [splitView, setSplitView] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const indexSetRef = useRef(false); // Track if index has been set
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced markdown rendering for preview
  const updatePreview = async (markdown: string) => {
    // Clear previous timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    setPreviewLoading(true);

    // Debounce the render by 300ms to avoid too many API calls
    renderTimeoutRef.current = setTimeout(async () => {
      try {
        const html = await markdownToHtml(markdown);
        setPreviewHtml(html);
      } catch (err) {
        console.error("Preview rendering error:", err);
        setPreviewHtml(
          "<p class='text-destructive'>Error rendering preview</p>"
        );
      } finally {
        setPreviewLoading(false);
      }
    }, 300);
  };

  // Update preview when content changes in split view
  useEffect(() => {
    if (splitView && content) {
      updatePreview(content);
    }
  }, [content, splitView]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to convert slug to title format
  const slugToTitle = (slug: string): string => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to update title in frontmatter
  const updateTitleInContent = (
    currentContent: string,
    newTitle: string
  ): string => {
    // Match frontmatter and update title
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = currentContent.match(frontmatterRegex);

    if (match) {
      const frontmatter = match[1];
      // Replace title line
      const updatedFrontmatter = frontmatter.replace(
        /title:\s*"[^"]*"/,
        `title: "${newTitle}"`
      );
      return currentContent.replace(
        frontmatterRegex,
        `---\n${updatedFrontmatter}\n---`
      );
    }

    return currentContent;
  };

  // Update title when slug changes
  const handleSlugChange = (newSlug: string) => {
    setSlug(newSlug);

    // Only update title if content has frontmatter
    if (content.startsWith("---")) {
      const newTitle = slugToTitle(newSlug);
      const updatedContent = updateTitleInContent(content, newTitle);
      setContent(updatedContent);
    }
  };

  // Auto-update index when creating new article and category changes
  useEffect(() => {
    // Only set index once when creating new article and category is selected
    if (isCreatingNew && category && getNextIndex && !indexSetRef.current) {
      indexSetRef.current = true; // Mark as set
      getNextIndex(category).then((nextIndex) => {
        setIndex(String(nextIndex).padStart(2, "0"));
      });
    }
  }, [category, isCreatingNew, getNextIndex]);

  // Reset indexSetRef when creating a new article
  useEffect(() => {
    if (!isCreatingNew) {
      indexSetRef.current = false;
    }
  }, [isCreatingNew]);

  // Show empty state if no content and showEmptyState is true
  if (showEmptyState && !initialContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
        <FileSearch className="h-16 w-16 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Article Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Open the Content Library to browse and select an article to edit, or
            click &quot;New Article&quot; to create a new one.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!category || !slug.trim() || !index.trim()) {
      setError("Category, index, and slug are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const isEdit = initialFilename !== "";
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "create",
          category,
          index: parseInt(index, 10),
          slug: slug.trim(),
          content,
          oldFilename: initialFilename || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save article");
      }

      setSuccess(
        isEdit
          ? "Article updated successfully!"
          : "Article created successfully!"
      );
      if (onSave) {
        onSave();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        category,
        index,
        slug,
        content,
        loading,
        error,
        success,
        isValid: !!(category && slug.trim() && index.trim()),
      });
    }
  }, [category, index, slug, content, loading, error, success, onStateChange]);

  return (
    <div className="space-y-6 pb-24">
      {/* Article Metadata */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {formatCategoryName(cat.slug)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="index">Index (auto-assigned)</Label>
          <Input
            id="index"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            placeholder="01"
            disabled={true}
            className="bg-muted cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="article-slug"
            disabled={loading}
          />
        </div>
      </div>

      {/* Preview filename */}
      {category && index && slug && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <code className="px-2 py-1 bg-muted rounded">
            content/{category}/{index.padStart(2, "0")}-{slug}.md
          </code>
        </div>
      )}

      {/* Markdown Editor / Split View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Markdown Content</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSplitView(!splitView)}
            className="gap-2"
          >
            {splitView ? (
              <>
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Full Editor</span>
              </>
            ) : (
              <>
                <SplitSquareVertical className="h-4 w-4" />
                <span className="hidden sm:inline">Split View</span>
              </>
            )}
          </Button>
        </div>

        {splitView ? (
          // Split View: Editor on left, Preview on right with resizable panels
          <ResizablePanelGroup
            direction="horizontal"
            className="border rounded-lg overflow-hidden bg-background h-[600px]"
          >
            {/* Editor Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex flex-col h-full">
                <div className="px-3 py-2 border-b bg-muted/30 text-sm font-medium">
                  Editor
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="font-mono resize-none rounded-none flex-1 border-0"
                  disabled={loading}
                />
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle />

            {/* Preview Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex flex-col h-full">
                <div className="px-3 py-2 border-l bg-muted/30 text-sm font-medium flex items-center justify-between">
                  Preview
                  {previewLoading && (
                    <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-6">
                  {/* Metadata Preview - Similar to article page header */}
                  {content && (
                    <div className="space-y-4 pb-4 border-b border-border">
                      {/* Category and Date */}
                      {(() => {
                        const fm = extractFrontmatter(content);
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded">
                                {category || "Select category"}
                              </span>
                              {fm.date && (
                                <time className="text-xs text-muted-foreground">
                                  {fm.date}
                                </time>
                              )}
                            </div>

                            {/* Title */}
                            {fm.title && (
                              <h1 className="text-2xl font-bold text-foreground">
                                {fm.title}
                              </h1>
                            )}

                            {/* Description */}
                            {fm.description && (
                              <p className="text-sm text-muted-foreground">
                                {fm.description}
                              </p>
                            )}

                            {/* Tags */}
                            {fm.tags &&
                              Array.isArray(fm.tags) &&
                              fm.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {fm.tags.map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                            {/* Featured Image */}
                            {fm.image && fm.image.trim() !== "" && (
                              <div className="mt-4 rounded-lg overflow-hidden border border-border">
                                <img
                                  src={fm.image}
                                  alt={fm.title || "Featured"}
                                  className="w-full h-auto object-cover max-h-64"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Content Preview */}
                  <div>
                    {previewHtml ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none content-with-wrapped-code"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic text-sm">
                        Preview will appear here as you type...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          // Full Editor View
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono min-h-[500px] resize-y"
            disabled={loading}
          />
        )}

        <div className="text-xs text-muted-foreground">
          Include frontmatter at the top with title, description, date, etc.
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {error && <div className="text-sm text-destructive">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
      </div>
    </div>
  );
}
