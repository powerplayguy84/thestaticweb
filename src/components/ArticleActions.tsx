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
    // Generate unique ID for this presentation
    const presentationId = `presentation-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store the content with the ID as key
    const contentData = {
      htmlContent,
      title,
      description,
      image,
    };
    sessionStorage.setItem(presentationId, JSON.stringify(contentData));

    // Navigate to presentation page
    router.push(`/presentation/${presentationId}`);
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
