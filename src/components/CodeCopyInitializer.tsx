"use client";

import { useEffect } from "react";
import { initCodeCopyButtons } from "@/lib/codeCopy";

export default function CodeCopyInitializer() {
  useEffect(() => {
    initCodeCopyButtons();
  }, []);

  return null;
}
