"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileEdit, Trash2, FilePlus } from "lucide-react";

interface Article {
  filename: string;
  slug: string;
  index: number;
  title: string;
  rawContent: string;
}

interface ArticleManagerProps {
  categories: string[];
}

export function ArticleManager({ categories }: ArticleManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [editorIndex, setEditorIndex] = useState("");
  const [editorSlug, setEditorSlug] = useState("");

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const fetchArticles = async (category: string) => {
    if (!category) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/articles?category=${encodeURIComponent(category)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch articles");
      }

      setArticles(data.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchArticles(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCreateArticle = () => {
    setEditMode("create");
    setEditorContent(
      `---
title: "New Article"
description: "Article description"
date: "${new Date().toISOString().split("T")[0]}"
featured: false
tags: []
---

# New Article

Your content here...
`
    );
    setEditorIndex(String(articles.length + 1).padStart(2, "0"));
    setEditorSlug("new-article");
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditMode("edit");
    setEditorContent(article.rawContent);
    setEditorIndex(String(article.index).padStart(2, "0"));
    setEditorSlug(article.slug);
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleSaveArticle = async () => {
    if (!selectedCategory || !editorSlug.trim() || !editorIndex.trim()) {
      setError("Category, index, and slug are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editMode === "create" ? "create" : "update",
          category: selectedCategory,
          index: parseInt(editorIndex, 10),
          slug: editorSlug.trim(),
          content: editorContent,
          oldFilename: editingArticle?.filename,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save article");
      }

      setShowEditor(false);
      fetchArticles(selectedCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedCategory || !articleToDelete) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          category: selectedCategory,
          oldFilename: articleToDelete.filename,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete article");
      }

      setShowDeleteDialog(false);
      setArticleToDelete(null);
      fetchArticles(selectedCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <FileEdit className="h-4 w-4" />
            Manage Articles
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Manage Articles</SheetTitle>
            <SheetDescription>
              Create, edit, or delete articles in your categories
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category-select">Select Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <>
                <Button onClick={handleCreateArticle} className="w-full">
                  <FilePlus className="h-4 w-4" />
                  Create New Article
                </Button>

                {/* Articles List */}
                <div className="space-y-2">
                  <Label>Articles ({articles.length})</Label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {articles.map((article) => (
                      <div
                        key={article.filename}
                        className="flex items-start justify-between p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {article.filename}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditArticle(article)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setArticleToDelete(article);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
        </SheetContent>
      </Sheet>

      {/* Article Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editMode === "create" ? "Create Article" : "Edit Article"}
            </DialogTitle>
            <DialogDescription>
              Edit the markdown content below
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="article-index">Index</Label>
                <Input
                  id="article-index"
                  value={editorIndex}
                  onChange={(e) => setEditorIndex(e.target.value)}
                  placeholder="01"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-slug">Slug</Label>
                <Input
                  id="article-slug"
                  value={editorSlug}
                  onChange={(e) => setEditorSlug(e.target.value)}
                  placeholder="article-slug"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-content">Markdown Content</Label>
              <Textarea
                id="article-content"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="font-mono min-h-96"
                disabled={loading}
              />
            </div>
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditor(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveArticle} disabled={loading}>
              Save Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{articleToDelete?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteArticle}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
