"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function SearchNavigationFab() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!highlight) {
      setIsVisible(false);
      return;
    }

    // Wait a bit for the SearchHighlighter to finish highlighting
    const timer = setTimeout(() => {
      const marks = document.querySelectorAll("[data-search-highlight]");
      setTotalCount(marks.length);
      setIsVisible(marks.length > 0);

      if (marks.length > 0) {
        setCurrentIndex(1); // Start at first result
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [highlight]);

  const scrollToHighlight = (index: number) => {
    const marks = document.querySelectorAll("[data-search-highlight]");
    if (marks.length === 0 || index < 1 || index > marks.length) return;

    const targetMark = marks[index - 1] as HTMLElement;

    // Remove previous active state
    marks.forEach((mark) => {
      mark.classList.remove("ring-2", "ring-blue-500", "dark:ring-blue-400");
    });

    // Add active state to current
    targetMark.classList.add("ring-2", "ring-blue-500", "dark:ring-blue-400");

    // Scroll to target
    targetMark.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 1 ? currentIndex - 1 : totalCount;
    setCurrentIndex(newIndex);
    scrollToHighlight(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < totalCount ? currentIndex + 1 : 1;
    setCurrentIndex(newIndex);
    scrollToHighlight(newIndex);
  };

  const handleClose = () => {
    // Remove all highlights and close FAB
    const marks = document.querySelectorAll("[data-search-highlight]");
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(
          document.createTextNode(mark.textContent || ""),
          mark
        );
      }
    });
    setIsVisible(false);

    // Remove highlight param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("highlight");
    window.history.replaceState({}, "", url.toString());
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || (e.shiftKey && e.key === "Enter")) {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, currentIndex, totalCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-background border border-border shadow-lg p-2 print:hidden">
      <div className="flex items-center gap-2 px-3">
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex} / {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handlePrevious}
          aria-label="Previous result"
        >
          <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleNext}
          aria-label="Next result"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleClose}
          aria-label="Close search highlights"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
