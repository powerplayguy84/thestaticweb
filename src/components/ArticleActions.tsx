"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Presentation, X } from "lucide-react";
import PrintButton from "@/components/PrintButton";
import { PresentationMode } from "@/components/PresentationMode";

interface ArticleActionsProps {
  htmlContent: string;
}

export function ArticleActions({ htmlContent }: ArticleActionsProps): React.ReactNode {
  const [isPresentationOpen, setIsPresentationOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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
              className="absolute top-4 right-4"
              onClick={() => setIsPresentationOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close Presentation Mode</span>
            </Button>
            <div className="w-full max-w-6xl h-full">
              <PresentationMode htmlContent={htmlContent} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
