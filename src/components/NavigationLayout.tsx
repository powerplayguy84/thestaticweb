"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export function NavigationLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // An article page is /[category]/[slug]
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const isArticlePage =
    segments.length === 2 &&
    segments[0] !== "tag" &&
    segments[0] !== "admin" &&
    segments[0] !== "diagram" &&
    segments[0] !== "presentation";

  return (
    <nav
      className={`py-3 sm:py-3.5 sticky top-0 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 border-b border-border/50 z-50 print:hidden transition-colors w-full shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] ${
        isArticlePage ? "lg:pl-56" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between w-full mx-auto ${
          isArticlePage ? "max-w-3xl px-6" : "max-w-3xl lg:max-w-4xl px-4 sm:px-6"
        }`}
      >
        {children}
      </div>
    </nav>
  );
}
