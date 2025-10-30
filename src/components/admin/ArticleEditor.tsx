"use client";

import { useState, useEffect } from "react";
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
import { FileText, FileSearch } from "lucide-react";

interface ArticleEditorProps {
  categories: string[];
  initialContent?: string;
  initialCategory?: string;
  initialIndex?: string;
  initialSlug?: string;
  initialFilename?: string;
  onSave?: () => void;
  showEmptyState?: boolean;
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
  onStateChange,
}: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [index, setIndex] = useState(initialIndex);
  const [slug, setSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="index">Index</Label>
          <Input
            id="index"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            placeholder="01"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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

      {/* Markdown Editor */}
      <div className="space-y-2">
        <Label htmlFor="content">Markdown Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="font-mono min-h-[500px] resize-y"
          disabled={loading}
        />
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
