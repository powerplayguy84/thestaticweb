"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Presentation } from "lucide-react";
import PrintButton from "@/components/PrintButton";

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
  const router = useRouter();

  const handleOpenPresentation = () => {
    // Get current path and encode it for the URL
    const currentPath = window.location.pathname;
    const encodedPath = encodeURIComponent(currentPath);

    // Navigate to presentation page with encoded path
    router.push(`/presentation/${encodedPath}`);
  };
  return (
    <div className="flex items-center gap-2">
      <PrintButton />
      <button
        onClick={handleOpenPresentation}
        className="inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
        aria-label="Open Presentation Mode"
      >
        <Presentation className="w-4 h-4" />
      </button>
    </div>
  );
}
