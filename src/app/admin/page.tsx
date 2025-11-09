"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { ContentLibrary } from "@/components/admin/ContentLibrary";
import { Lock, LogOut, Save, Check, AlertCircle } from "lucide-react";

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

type SaveStatus = "saved" | "saving" | "unsaved" | "idle";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isProduction, setIsProduction] = useState(false);

  // Editor state
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [currentCategory, setCurrentCategory] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Editor form state (lifted from ArticleEditor)
  const [editorState, setEditorState] = useState({
    category: "",
    index: "",
    slug: "",
    content: "",
    loading: false,
    error: "",
    success: "",
    isValid: false,
  });

  // Save state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Snapshot of the editor state at last load/save. Used to detect real "dirty" changes
  const [editorSnapshot, setEditorSnapshot] = useState<string | null>(null);

  const router = useRouter();

  // Check if running in production (not localhost)
  useEffect(() => {
    const hostname = window.location.hostname;
    const isProd = hostname !== "localhost" && hostname !== "127.0.0.1";
    setIsProduction(isProd);

    if (isProd) {
      alert(
        "⚠️ Admin Panel - Development Only\n\n" +
          "This admin panel only works in local development environment.\n\n" +
          "File system operations (saving/editing articles) are not supported on Vercel's serverless platform.\n\n" +
          "To edit content:\n" +
          "1. Clone the repository locally\n" +
          "2. Run 'npm run dev'\n" +
          "3. Access /admin on localhost\n" +
          "4. Make changes and commit to Git\n" +
          "5. Push to trigger automatic deployment"
      );
    }
  }, []);

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchCategories();
    }
  }, []);

  // Restore selected article from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const savedArticleData = localStorage.getItem("admin_selected_article");
    if (savedArticleData) {
      try {
        const { category, article } = JSON.parse(savedArticleData);
        if (category && article) {
          // Restore the article state
          setCurrentArticle(article);
          setCurrentCategory(category);
          setIsCreatingNew(false);
          setEditorKey((prev) => prev + 1);
          // Set snapshot so the editor isn't marked as "unsaved" immediately
          setEditorSnapshot(
            JSON.stringify({
              category,
              index: String(article.index).padStart(2, "0"),
              slug: article.slug,
              content: article.rawContent,
            })
          );
        }
      } catch (err) {
        console.error("Failed to restore selected article:", err);
        localStorage.removeItem("admin_selected_article");
      }
    }
  }, [isAuthenticated]);

  // Helper to produce the default content for a new article (keeps in sync with JSX below)
  const buildNewArticleTemplate = () =>
    `---\ntitle: "New Article"\ndescription: "Article description"\ndate: "${
      new Date().toISOString().split("T")[0]
    }"\nfeatured: false\ntags: []\n---\n\n# New Article\n\nYour content here...\n`;

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
        setPassword("");
        fetchCategories();
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_selected_article"); // Clear selected article on logout
    setIsAuthenticated(false);
    setPassword("");
    router.push("/");
  };

  const handleLoadArticle = (category: string, article: Article) => {
    setCurrentArticle(article);
    setCurrentCategory(category);
    setIsCreatingNew(false);
    setEditorKey((prev) => prev + 1);

    // Save to localStorage for persistence
    localStorage.setItem(
      "admin_selected_article",
      JSON.stringify({ category, article })
    );
    // Capture snapshot of the loaded article so we don't immediately mark as dirty
    setEditorSnapshot(
      JSON.stringify({
        category,
        index: String(article.index).padStart(2, "0"),
        slug: article.slug,
        content: article.rawContent,
      })
    );
  };

  const handleCreateNew = (preselectedCategory?: string) => {
    setCurrentArticle(null);
    setCurrentCategory(preselectedCategory || "");
    setIsCreatingNew(true);
    setEditorKey((prev) => prev + 1);

    // Clear localStorage when creating new
    localStorage.removeItem("admin_selected_article");
    // Set a snapshot equal to the initial new-article template so the editor isn't "dirty" on open
    setEditorSnapshot(
      JSON.stringify({
        category: preselectedCategory || "",
        index: "01",
        slug: "",
        content: buildNewArticleTemplate(),
      })
    );
  };

  // Get next available index for a category
  const getNextIndex = async (categorySlug: string): Promise<number> => {
    try {
      const response = await fetch(
        `/api/admin/articles?category=${encodeURIComponent(categorySlug)}`
      );
      const data = await response.json();

      if (response.ok && data.articles && data.articles.length > 0) {
        // Find the highest index and add 1
        const maxIndex = Math.max(
          ...data.articles.map((a: Article) => a.index)
        );
        return maxIndex + 1;
      }
      return 1; // First article in category
    } catch (err) {
      console.error("Failed to get next index:", err);
      return 1;
    }
  };

  const handleSave = () => {
    fetchCategories();
  };

  const handleSaveArticle = async (isAutoSave = false) => {
    if (
      !editorState.category ||
      !editorState.slug.trim() ||
      !editorState.index.trim()
    ) {
      return;
    }

    setSaveStatus("saving");

    try {
      const isEdit =
        currentArticle?.filename !== undefined &&
        currentArticle?.filename !== "";

      // Check if category has changed (moving article to different category)
      const isCategoryChange =
        isEdit && currentCategory !== editorState.category;

      if (isCategoryChange) {
        // Move operation: delete from old category, create in new category
        // First, delete from old category
        const deleteResponse = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete",
            category: currentCategory,
            oldFilename: currentArticle?.filename,
          }),
        });

        if (!deleteResponse.ok) {
          const deleteData = await deleteResponse.json();
          throw new Error(
            deleteData.error || "Failed to delete from old category"
          );
        }

        // Then, create in new category
        const createResponse = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            category: editorState.category,
            index: parseInt(editorState.index, 10),
            slug: editorState.slug.trim(),
            content: editorState.content,
          }),
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
          throw new Error(
            createData.error || "Failed to create in new category"
          );
        }

        // Update current category after successful move
        setCurrentCategory(editorState.category);

        // Update the article object with new info
        const newFilename = `${String(parseInt(editorState.index, 10)).padStart(
          2,
          "0"
        )}-${editorState.slug.trim()}.md`;
        setCurrentArticle({
          ...currentArticle!,
          filename: newFilename,
          slug: editorState.slug.trim(),
          index: parseInt(editorState.index, 10),
        });

        // Update localStorage
        localStorage.setItem(
          "admin_selected_article",
          JSON.stringify({
            category: editorState.category,
            article: {
              ...currentArticle!,
              filename: newFilename,
              slug: editorState.slug.trim(),
              index: parseInt(editorState.index, 10),
            },
          })
        );
      } else {
        // Normal update or create
        const response = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: isEdit ? "update" : "create",
            category: editorState.category,
            index: parseInt(editorState.index, 10),
            slug: editorState.slug.trim(),
            content: editorState.content,
            oldFilename: currentArticle?.filename || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save article");
        }

        // Update localStorage after successful save if editing
        if (isEdit) {
          const newFilename = `${String(
            parseInt(editorState.index, 10)
          ).padStart(2, "0")}-${editorState.slug.trim()}.md`;
          setCurrentArticle({
            ...currentArticle!,
            filename: newFilename,
            slug: editorState.slug.trim(),
            index: parseInt(editorState.index, 10),
          });

          localStorage.setItem(
            "admin_selected_article",
            JSON.stringify({
              category: editorState.category,
              article: {
                ...currentArticle!,
                filename: newFilename,
                slug: editorState.slug.trim(),
                index: parseInt(editorState.index, 10),
              },
            })
          );
        }
      }

      fetchCategories();
      setSaveStatus("saved");
      setLastSaved(new Date());
      // Update snapshot to the current editor values so subsequent state is considered clean
      setEditorSnapshot(
        JSON.stringify({
          category: editorState.category,
          index: String(parseInt(editorState.index, 10)).padStart(2, "0"),
          slug: editorState.slug.trim(),
          content: editorState.content,
        })
      );
      setRefreshTrigger((prev) => prev + 1); // Trigger content library refresh

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Failed to save article:", err);
      setSaveStatus("unsaved");
    }
  };

  // Track unsaved changes by comparing the current editor state to the saved snapshot
  useEffect(() => {
    // Don't track if not editing an article
    if (!currentArticle && !isCreatingNew) {
      return;
    }

    if (saveStatus === "saving") return;

    // If we don't have a snapshot yet, treat as clean (idle)
    if (!editorSnapshot) {
      setSaveStatus("idle");
      return;
    }

    const current = JSON.stringify({
      category: editorState.category,
      index: editorState.index,
      slug: editorState.slug,
      content: editorState.content,
    });

    setSaveStatus(current !== editorSnapshot ? "unsaved" : "idle");
  }, [
    editorState.category,
    editorState.index,
    editorState.slug,
    editorState.content,
    editorSnapshot,
    currentArticle,
    isCreatingNew,
    saveStatus,
  ]);

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return "";

    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return "just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Enter the admin password to access the content management panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProduction && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                ⚠️ <strong>Development Only:</strong> This admin panel does not
                work in production. File operations are disabled on Vercel.
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-sm text-muted-foreground text-center">
              Password is set in <code>content/settings.md</code>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Production Warning Banner */}
      {isProduction && (
        <div className="bg-destructive text-destructive-foreground px-4 py-3 text-center text-sm font-medium">
          ⚠️ Admin panel is for local development only. Changes cannot be saved
          in production. Edit files locally and push to Git.
        </div>
      )}

      {/* Fixed bottom Header */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {(currentArticle || isCreatingNew) && (
                <Button
                  onClick={() => handleSaveArticle(false)}
                  variant="outline"
                  size="sm"
                  disabled={saveStatus === "saving" || !editorState.isValid}
                >
                  {saveStatus === "saving" && (
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                  {saveStatus === "saved" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  {saveStatus === "unsaved" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {saveStatus === "idle" && <Save className="h-4 w-4" />}
                  <span className="hidden sm:inline">
                    {saveStatus === "saving" && "Saving..."}
                    {saveStatus === "saved" && `Saved ${getLastSavedText()}`}
                    {saveStatus === "unsaved" && "Save Changes"}
                    {saveStatus === "idle" && "Save"}
                  </span>
                </Button>
              )}
              <ContentLibrary
                onLoadArticle={handleLoadArticle}
                onCreateNew={handleCreateNew}
                refreshTrigger={refreshTrigger}
              />
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content with top padding to account for navigation + fixed header */}
      <div className="max-w-full mx-auto pb-12 sm:pb-16 px-6 py-12">
        <div>
          {/* Article Editor */}
          <div>
            <ArticleEditor
              key={editorKey}
              categories={categories}
              initialContent={
                currentArticle?.rawContent ||
                (isCreatingNew
                  ? `---
title: "New Article"
description: "Article description"
date: "${new Date().toISOString().split("T")[0]}"
featured: false
tags: []
---

# New Article

Your content here...
`
                  : "")
              }
              initialCategory={currentCategory}
              initialIndex={
                currentArticle
                  ? String(currentArticle.index).padStart(2, "0")
                  : "01"
              }
              initialSlug={currentArticle?.slug || ""}
              initialFilename={currentArticle?.filename || ""}
              onSave={handleSave}
              showEmptyState={!currentArticle && !isCreatingNew}
              isCreatingNew={isCreatingNew}
              getNextIndex={getNextIndex}
              onStateChange={setEditorState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
