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
import {
  FolderPlus,
  FolderEdit,
  Trash2,
  FileEdit,
  FilePlus,
  Library,
} from "lucide-react";

interface Article {
  filename: string;
  slug: string;
  index: number;
  title: string;
  rawContent: string;
}

interface ContentLibraryProps {
  onLoadArticle: (category: string, article: Article) => void;
  onCreateNew: () => void;
}

export function ContentLibrary({
  onLoadArticle,
  onCreateNew,
}: ContentLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Category management state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categoryAction, setCategoryAction] = useState<
    "create" | "rename" | "delete"
  >("create");
  const [targetCategory, setTargetCategory] = useState("");
  const [renameTo, setRenameTo] = useState("");

  // Article delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

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
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCategory) {
      fetchArticles(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryAction = async () => {
    setLoading(true);
    setError("");

    try {
      let body = {};

      if (categoryAction === "create") {
        body = { action: "create", categoryName: newCategoryName.trim() };
      } else if (categoryAction === "rename") {
        body = {
          action: "rename",
          oldName: targetCategory,
          newName: renameTo.trim(),
        };
      } else if (categoryAction === "delete") {
        body = { action: "delete", categoryName: targetCategory };
      }

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to perform action");
      }

      setShowCategoryDialog(false);
      setNewCategoryName("");
      setTargetCategory("");
      setRenameTo("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to perform action");
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
            <Library className="h-4 w-4" />
            Content Library
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Content Library</SheetTitle>
            <SheetDescription>Manage categories and articles</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Category Management Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Categories</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCategoryAction("create");
                    setShowCategoryDialog(true);
                  }}
                >
                  <FolderPlus className="h-4 w-4" />
                  New Category
                </Button>
              </div>

              <div className="grid gap-2 max-h-48 overflow-y-auto p-1">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className="font-medium">{category}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetCategory(category);
                          setRenameTo(category);
                          setCategoryAction("rename");
                          setShowCategoryDialog(true);
                        }}
                      >
                        <FolderEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetCategory(category);
                          setCategoryAction("delete");
                          setShowCategoryDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles Section */}
            {selectedCategory && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">
                    Articles in {selectedCategory} ({articles.length})
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onCreateNew();
                      setIsOpen(false);
                    }}
                  >
                    <FilePlus className="h-4 w-4" />
                    New Article
                  </Button>
                </div>

                <div className="grid gap-2 max-h-96 overflow-y-auto p-1">
                  {articles.map((article) => (
                    <div
                      key={article.filename}
                      className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          onLoadArticle(selectedCategory, article);
                          setIsOpen(false);
                        }}
                      >
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {article.filename}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            onLoadArticle(selectedCategory, article);
                            setIsOpen(false);
                          }}
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

                  {articles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No articles in this category yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
        </SheetContent>
      </Sheet>

      {/* Category Action Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoryAction === "create" && "Create Category"}
              {categoryAction === "rename" && "Rename Category"}
              {categoryAction === "delete" && "Delete Category"}
            </DialogTitle>
            <DialogDescription>
              {categoryAction === "create" &&
                "Enter a name for the new category"}
              {categoryAction === "rename" &&
                `Rename "${targetCategory}" to a new name`}
              {categoryAction === "delete" &&
                `Are you sure you want to delete "${targetCategory}"? This category must be empty.`}
            </DialogDescription>
          </DialogHeader>

          {categoryAction === "create" && (
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="category-name"
                disabled={loading}
              />
            </div>
          )}

          {categoryAction === "rename" && (
            <div className="space-y-2">
              <Label htmlFor="rename-to">New Name</Label>
              <Input
                id="rename-to"
                value={renameTo}
                onChange={(e) => setRenameTo(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="text-sm text-destructive">{error}</div>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCategoryDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={categoryAction === "delete" ? "destructive" : "default"}
              onClick={handleCategoryAction}
              disabled={loading}
            >
              {categoryAction === "create" && "Create"}
              {categoryAction === "rename" && "Rename"}
              {categoryAction === "delete" && "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Article Dialog */}
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
