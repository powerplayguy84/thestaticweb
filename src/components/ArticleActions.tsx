"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Presentation, X } from "lucide-react";
import PrintButton from "@/components/PrintButton";
import { PresentationMode } from "@/components/PresentationMode";

interface ArticleActionsProps {
  htmlContent: string;
  description?: string;
  title?: string;
  image?: string;
}

export function ArticleActions({
  htmlContent,
  description,
  title,
  image,
}: ArticleActionsProps): React.ReactNode {
  const [isPresentationOpen, setIsPresentationOpen] = React.useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.has("slide");
    }
    return false;
  });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isPresentationOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isPresentationOpen]);

  const handleClosePresentationMode = () => {
    setIsPresentationOpen(false);
    // Clear the slide parameter from URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("slide");
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <PrintButton />
        <button
          onClick={() => setIsPresentationOpen(true)}
          className="inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
          aria-label="Open Presentation Mode"
        >
          <Presentation className="w-4 h-4" />
        </button>
      </div>
      {isMounted &&
        isPresentationOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-50"
              onClick={handleClosePresentationMode}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close Presentation Mode</span>
            </Button>
            <div className="w-full max-w-6xl h-full">
              <PresentationMode
                htmlContent={htmlContent}
                description={description}
                title={title}
                image={image}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
