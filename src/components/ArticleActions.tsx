"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Presentation01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
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
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOpenPresentation = () => {
    setIsLoading(true);
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
        disabled={isLoading}
        className="inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 text-foreground rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Open Presentation Mode"
      >
        {isLoading ? (
          <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
        ) : (
          <HugeiconsIcon icon={Presentation01Icon} className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
