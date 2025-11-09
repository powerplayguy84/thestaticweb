"use client";

import { useRouter, useParams } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { PresentationMode } from "@/components/PresentationMode";

export default function PresentationPage() {
  const router = useRouter();
  const params = useParams();
  const [contentData, setContentData] = useState<{
    htmlContent: string;
    title?: string;
    description?: string;
    image?: string;
  } | null>(null);

  // Retrieve content from sessionStorage only on client side
  useEffect(() => {
    if (params.encoded) {
      const stored = sessionStorage.getItem(params.encoded as string);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setContentData(data);
        } catch (error) {
          console.error("Failed to parse presentation data:", error);
        }
      }
    }
  }, [params.encoded]);

  const handleClose = () => {
    router.back();
  };

  if (!contentData) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading presentation...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border transition-colors"
        aria-label="Close presentation"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Presentation Mode Component */}
      <PresentationMode
        htmlContent={contentData.htmlContent}
        title={contentData.title}
        description={contentData.description}
        image={contentData.image}
      />
    </div>
  );
}
