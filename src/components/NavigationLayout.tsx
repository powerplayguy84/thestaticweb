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
      className={`py-4 sticky top-0 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 z-50 print:hidden transition-colors w-full ${
        isArticlePage ? "lg:pl-56" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between w-full mx-auto ${
          isArticlePage ? "max-w-3xl px-6" : "max-w-2xl px-4 md:px-6"
        }`}
      >
        {children}
      </div>
    </nav>
  );
}
