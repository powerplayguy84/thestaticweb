"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons/core-free-icons";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 text-foreground rounded-full active:scale-95 transition-all print:hidden"
      aria-label="Print article"
    >
      <HugeiconsIcon icon={PrinterIcon} className="w-4 h-4" />
    </button>
  );
}
