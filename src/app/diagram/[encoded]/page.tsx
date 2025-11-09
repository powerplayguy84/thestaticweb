"use client";

import { useRouter, useParams } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DiagramPage() {
  const router = useRouter();
  const params = useParams();
  const [svgContent, setSvgContent] = useState<string>("");

  // Retrieve SVG from sessionStorage only on client side
  useEffect(() => {
    if (params.encoded) {
      const content = sessionStorage.getItem(params.encoded as string) || "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSvgContent(content);
    }
  }, [params.encoded]);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background flex items-center justify-center overflow-auto">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border transition-colors"
        aria-label="Close diagram"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Diagram - User can zoom & pan like a normal image */}
      {svgContent && (
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}
