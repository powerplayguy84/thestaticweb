"use client";

import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  description: string;
  category: string;
  slug: string;
  tags?: string[];
}

// This will be populated from the global window object
declare global {
  interface Window {
    __SEARCH_INDEX__?: SearchResult[];
  }
}

let searchIndex: SearchResult[] = [];

export function initSearchIndex(articles: SearchResult[]) {
  searchIndex = articles;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  // Initialize search index from window object
  useEffect(() => {
    if (typeof window !== "undefined" && window.__SEARCH_INDEX__) {
      searchIndex = window.__SEARCH_INDEX__;
    }
  }, []);

  // Handle ESC key to close search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    // Client-side search through the index
    const filteredResults = searchIndex
      .filter((article) => {
        const titleMatch = article.title.toLowerCase().includes(lowerQuery);
        const descMatch = article.description
          .toLowerCase()
          .includes(lowerQuery);
        const tagMatch = article.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        );
        const categoryMatch = article.category
          .toLowerCase()
          .includes(lowerQuery);

        return titleMatch || descMatch || tagMatch || categoryMatch;
      })
      .slice(0, 10);

    setResults(filteredResults);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  const handleResultClick = (category: string, slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/${category}/${slug}`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted min-h-[40px]"
        aria-label="Search articles (⌘K)"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-muted rounded border border-border">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <SearchIcon className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={`${result.category}-${result.slug}`}
                    onClick={() =>
                      handleResultClick(result.category, result.slug)
                    }
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors focus:bg-muted focus:outline-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground truncate">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {result.description}
                        </p>
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {result.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!query && (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                <p>Start typing to search articles...</p>
                <p className="mt-2 text-xs">Press ESC to close</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
