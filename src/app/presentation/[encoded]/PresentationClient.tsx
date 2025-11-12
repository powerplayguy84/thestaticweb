"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { PresentationMode } from "@/components/PresentationMode";

interface PresentationClientProps {
  htmlContent: string;
  title?: string;
  description?: string;
  image?: string;
}

export default function PresentationClient({
  htmlContent,
  title,
  description,
  image,
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
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border transition-colors"
        aria-label="Close presentation"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Presentation Mode Component */}
      <PresentationMode
        htmlContent={htmlContent}
        title={title}
        description={description}
        image={image}
      />
    </div>
  );
}
