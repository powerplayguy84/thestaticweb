"use client";

import { useRouter, useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
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
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-muted/80 backdrop-blur-sm hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 shadow-md active:scale-95 transition-all"
        aria-label="Close diagram"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
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
