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
import { Lock, LogOut, Save } from "lucide-react";

interface Article {
  filename: string;
  slug: string;
  index: number;
  title: string;
  rawContent: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
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
        }
      } catch (err) {
        console.error("Failed to restore selected article:", err);
        localStorage.removeItem("admin_selected_article");
      }
    }
  }, [isAuthenticated]);

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
  };

  const handleCreateNew = () => {
    setCurrentArticle(null);
    setCurrentCategory("");
    setIsCreatingNew(true);
    setEditorKey((prev) => prev + 1);

    // Clear localStorage when creating new
    localStorage.removeItem("admin_selected_article");
  };

  const handleSave = () => {
    fetchCategories();
  };

  const handleSaveArticle = async () => {
    if (
      !editorState.category ||
      !editorState.slug.trim() ||
      !editorState.index.trim()
    ) {
      return;
    }

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
    } catch (err) {
      console.error("Failed to save article:", err);
    }
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {(currentArticle || isCreatingNew) && (
                <Button
                  onClick={handleSaveArticle}
                  variant="outline"
                  disabled={editorState.loading || !editorState.isValid}
                >
                  <Save className="h-4 w-4" />
                  {editorState.loading
                    ? "Saving..."
                    : currentArticle?.filename
                    ? "Update Article"
                    : "Create Article"}
                </Button>
              )}
              <ContentLibrary
                onLoadArticle={handleLoadArticle}
                onCreateNew={handleCreateNew}
              />
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content with top padding to account for navigation + fixed header */}
      <div className="px-4 md:p-8 py-12">
        <div className="max-w-6xl mx-auto">
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
              onStateChange={setEditorState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
