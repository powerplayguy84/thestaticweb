"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  description: string;
  category: string;
  slug: string;
  tags?: string[];
  content?: string;
  excerpt?: string;
  matchType?: "title" | "description" | "content" | "tag" | "category";
  matchTypes?: ("title" | "description" | "content" | "tag" | "category")[];
  occurrences?: number;
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure we're mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Extract excerpt around search term
  const getExcerpt = (
    text: string,
    query: string,
    maxLength: number = 150
  ): string => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return "";

    const start = Math.max(0, index - Math.floor(maxLength / 2));
    const end = Math.min(text.length, start + maxLength);

    let excerpt = text.substring(start, end);

    if (start > 0) excerpt = "..." + excerpt;
    if (end < text.length) excerpt = excerpt + "...";

    return excerpt;
  };

  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900 text-foreground font-medium"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Count occurrences of search term in text
  const countOccurrences = (text: string, query: string): number => {
    if (!text || !query) return 0;
    const regex = new RegExp(query, "gi");
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      const lowerQuery = searchQuery.toLowerCase();

      // Client-side search through the index
      const filteredResults = searchIndex
        .map((article) => {
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
          const contentMatch = article.content
            ?.toLowerCase()
            .includes(lowerQuery);

          if (
            !titleMatch &&
            !descMatch &&
            !tagMatch &&
            !categoryMatch &&
            !contentMatch
          ) {
            return null;
          }

          // Determine match types and create excerpt
          let matchType:
            | "title"
            | "description"
            | "content"
            | "tag"
            | "category" = "content";
          let matchTypes: (
            | "title"
            | "description"
            | "content"
            | "tag"
            | "category"
          )[] = [];
          let excerpt = "";
          let occurrences = 0;

          if (titleMatch) {
            matchType = "title";
            matchTypes.push("title");
            occurrences += countOccurrences(article.title, lowerQuery);
          }
          if (descMatch) {
            if (matchType === "content") matchType = "description";
            matchTypes.push("description");
            occurrences += countOccurrences(article.description, lowerQuery);
          }
          if (tagMatch) {
            if (matchType === "content") matchType = "tag";
            matchTypes.push("tag");
            occurrences += article.tags?.filter((tag) =>
              tag.toLowerCase().includes(lowerQuery)
            ).length ?? 0;
          }
          if (categoryMatch) {
            if (matchType === "content") matchType = "category";
            matchTypes.push("category");
            occurrences += countOccurrences(article.category, lowerQuery);
          }
          if (contentMatch && article.content) {
            matchType = contentMatch ? "content" : matchType;
            if (!matchTypes.includes("content")) {
              matchTypes.push("content");
            }
            excerpt = getExcerpt(article.content, lowerQuery);
            occurrences += countOccurrences(article.content, lowerQuery);
          }

          return {
            ...article,
            matchType,
            matchTypes,
            excerpt,
            occurrences,
          } as SearchResult;
        })
        .filter((result): result is SearchResult => result !== null)
        .slice(0, 10);

      setResults(filteredResults);
    },
    [getExcerpt]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  const handleResultClick = (category: string, slug: string) => {
    setIsOpen(false);
    const searchQuery = query;
    setQuery("");
    router.push(
      `/${encodeURIComponent(category)}/${slug}?highlight=${encodeURIComponent(
        searchQuery
      )}`
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all rounded-full border border-border bg-card hover:bg-muted min-h-[36px]"
        aria-label="Search (⌘K)"
      >
        <HugeiconsIcon icon={Search01Icon} className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-muted rounded-full border border-border">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  // Don't render the modal until we're mounted on the client
  if (!mounted) {
    return null;
  }

  const searchModal = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999]"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[10000] px-4 animate-scale-in">
        <div className="bg-background border border-border rounded-2xl shadow-xl overflow-hidden ring-1 ring-foreground/10">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <HugeiconsIcon icon={Search01Icon} className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                aria-label="Clear search"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
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
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize text-muted-foreground">
                            {result.matchTypes?.includes("category")
                              ? highlightText(result.category, query)
                              : result.category}
                          </span>
                          {result.matchTypes && result.matchTypes.length > 0 && (
                            <span className="text-xs text-muted-foreground italic">
                              matched in {result.matchTypes.join(" , ")}
                            </span>
                          )}
                          {result.occurrences !== undefined &&
                            result.occurrences > 0 && (
                              <span className="text-xs text-muted-foreground italic underline">
                                {result.occurrences}{" "}
                                {result.occurrences === 1
                                  ? "match"
                                  : "matches"}
                              </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-foreground truncate tracking-tight">
                          {highlightText(result.title, query)}
                        </h3>

                        {/* Show excerpt if found in content, otherwise show description */}
                        {result.matchType === "content" && result.excerpt ? (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {highlightText(result.excerpt, query)}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {result.matchType === "description"
                              ? highlightText(result.description, query)
                              : result.description}
                          </p>
                        )}

                        {result.tags && result.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {result.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-muted-foreground"
                              >
                                #
                                {result.matchType === "tag" &&
                                tag.toLowerCase().includes(query.toLowerCase())
                                  ? highlightText(tag, query)
                                  : tag}
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
                <p>Start typing to search...</p>
                <p className="mt-2 text-xs">Press ESC to close</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-200 rounded-full border border-border/70 bg-card/80 backdrop-blur-md hover:bg-muted/70 hover:border-foreground/20 min-h-[36px] shadow-2xs"
        aria-label="Search (⌘K)"
      >
        <HugeiconsIcon icon={Search01Icon} className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono bg-muted/80 rounded-full border border-border/60 text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Render modal via portal if open */}
      {isOpen && createPortal(searchModal, document.body)}
    </>
  );
}
