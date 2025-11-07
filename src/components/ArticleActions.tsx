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
}

export function ArticleActions({ htmlContent, description, title }: ArticleActionsProps): React.ReactNode {
  const [isPresentationOpen, setIsPresentationOpen] = React.useState(false);
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

  return (
    <>
      <div className="flex items-center gap-2">
        <PrintButton />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPresentationOpen(true)}
        >
          <Presentation className="h-4 w-4" />
          <span className="sr-only">Open Presentation Mode</span>
        </Button>
      </div>
      {isMounted &&
        isPresentationOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50"
              onClick={() => setIsPresentationOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close Presentation Mode</span>
            </Button>
            <div className="w-full max-w-6xl h-full">
              <PresentationMode htmlContent={htmlContent} description={description} title={title} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
