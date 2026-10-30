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
      className={`py-3 sm:py-3.5 bg-transparent print:hidden transition-colors w-full border-none shadow-none ${
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
