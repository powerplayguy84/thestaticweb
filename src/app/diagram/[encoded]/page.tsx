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
    <div className="w-screen h-screen bg-white dark:bg-slate-950 flex items-center justify-center overflow-auto">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors"
        aria-label="Close diagram"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Diagram - User can zoom & pan like a normal image */}
      {svgContent && (
        <div
          className="w-auto h-auto"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}
