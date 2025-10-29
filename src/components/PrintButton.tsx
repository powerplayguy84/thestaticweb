"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors print:hidden"
      aria-label="Print article"
    >
      <Printer className="w-4 h-4" />
      <span className="text-sm font-medium">Print</span>
    </button>
  );
}
