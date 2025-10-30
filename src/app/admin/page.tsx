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

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchCategories();
    }
  }, []);

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
    setIsAuthenticated(false);
    setPassword("");
    router.push("/");
  };

  const handleLoadArticle = (category: string, article: Article) => {
    setCurrentArticle(article);
    setCurrentCategory(category);
    setIsCreatingNew(false);
    setEditorKey((prev) => prev + 1);
  };

  const handleCreateNew = () => {
    setCurrentArticle(null);
    setCurrentCategory("");
    setIsCreatingNew(true);
    setEditorKey((prev) => prev + 1);
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
      {/* Fixed bottom Header */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveArticle}
                variant="outline"
                disabled={
                  editorState.loading ||
                  !editorState.isValid ||
                  (!currentArticle && !isCreatingNew)
                }
              >
                <Save className="h-4 w-4" />
                {editorState.loading
                  ? "Saving..."
                  : currentArticle?.filename
                  ? "Update Article"
                  : "Create Article"}
              </Button>
              <ContentLibrary
                onLoadArticle={handleLoadArticle}
                onCreateNew={handleCreateNew}
              />
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
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
