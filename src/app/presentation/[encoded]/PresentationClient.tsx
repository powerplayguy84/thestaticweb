"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { PresentationMode } from "@/components/PresentationMode";
import { ArticleSection } from "@/lib/markdown";

interface PresentationClientProps {
  htmlContent: string;
  title?: string;
  description?: string;
  image?: string;
  sections?: ArticleSection[];
}

export default function PresentationClient({
  htmlContent,
  title,
  description,
  image,
  sections,
}: PresentationClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background p-6">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-muted/80 backdrop-blur-sm hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 shadow-md active:scale-95 transition-all"
        aria-label="Close presentation"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
      </button>

      {/* Presentation Mode Component */}
      <PresentationMode
        htmlContent={htmlContent}
        title={title}
        description={description}
        image={image}
        sections={sections}
      />
    </div>
  );
}
