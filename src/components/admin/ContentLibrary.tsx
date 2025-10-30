"use client";

import { useState, useEffect, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TreeView } from "@/components/tree-view";
import {
  FolderPlus,
  FolderEdit,
  Trash2,
  FileEdit,
  FilePlus,
  Library,
  Folder,
  FileText,
} from "lucide-react";

interface Article {
  filename: string;
  slug: string;
  index: number;
  title: string;
  rawContent: string;
}

interface CategoryInfo {
  folderName: string;
  slug: string;
  index: number;
}

interface TreeDataItem {
  id: string;
  name: string;
  icon?: any;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
}

interface ContentLibraryProps {
  onLoadArticle: (category: string, article: Article) => void;
  onCreateNew: (preselectedCategory?: string) => void;
  refreshTrigger?: number;
}

export function ContentLibrary({
  onLoadArticle,
  onCreateNew,
  refreshTrigger,
}: ContentLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<
    Record<string, Article[]>
  >({});
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
  const [articleToDelete, setArticleToDelete] = useState<{
    article: Article;
    category: string;
  } | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchArticlesForCategory = async (category: string) => {
    try {
      const response = await fetch(
        `/api/admin/articles?category=${encodeURIComponent(category)}`
      );
      const data = await response.json();

      if (response.ok) {
        setCategoryArticles((prev) => ({
          ...prev,
          [category]: data.articles || [],
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch articles for ${category}:`, err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, refreshTrigger]);

  useEffect(() => {
    // Fetch articles for all categories when they change
    categories.forEach((category) => {
      if (!categoryArticles[category.slug]) {
        fetchArticlesForCategory(category.slug);
      }
    });
  }, [categories]);

  // Build tree data structure
  const treeData = useMemo<TreeDataItem[]>(() => {
    return categories.map((category) => {
      const articles = categoryArticles[category.slug] || [];
      const displayName =
        category.slug.charAt(0).toUpperCase() + category.slug.slice(1);

      return {
        id: `category-${category.slug}`,
        name: displayName,
        icon: Folder,
        actions: (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <div
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onCreateNew(category.slug);
                setIsOpen(false);
              }}
              title="New Article"
            >
              <FilePlus className="h-4 w-4" />
            </div>
            <div
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setTargetCategory(category.slug);
                setRenameTo(category.slug);
                setCategoryAction("rename");
                setShowCategoryDialog(true);
              }}
              title="Rename Category"
            >
              <FolderEdit className="h-4 w-4" />
            </div>
            <div
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setTargetCategory(category.slug);
                setCategoryAction("delete");
                setShowCategoryDialog(true);
              }}
              title="Delete Category"
            >
              <Trash2 className="h-4 w-4" />
            </div>
          </div>
        ),
        children: articles.map((article: Article) => ({
          id: `article-${category.slug}-${article.filename}`,
          name: article.title,
          icon: FileText,
          actions: (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <div
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadArticle(category.slug, article);
                  setIsOpen(false);
                }}
              >
                <FileEdit className="h-4 w-4" />
              </div>
              <div
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setArticleToDelete({ article, category: category.slug });
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </div>
            </div>
          ),
          onClick: () => {
            onLoadArticle(category.slug, article);
            setIsOpen(false);
          },
        })),
      };
    });
  }, [categories, categoryArticles]);

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
    if (!articleToDelete) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          category: articleToDelete.category,
          oldFilename: articleToDelete.article.filename,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete article");
      }

      setShowDeleteDialog(false);
      setArticleToDelete(null);
      fetchArticlesForCategory(articleToDelete.category);
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
            <SheetDescription>
              Browse categories and articles in a tree view
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-2">
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
            <hr className="m-0" />
            {/* Tree View */}
            <div>
              {treeData.length > 0 ? (
                <TreeView
                  data={treeData}
                  expandAll={false}
                  defaultNodeIcon={Folder}
                  defaultLeafIcon={FileText}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No categories yet. Create one to get started.
                </div>
              )}
            </div>

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
              Are you sure you want to delete &quot;
              {articleToDelete?.article.title}&quot;? This action cannot be
              undone.
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
