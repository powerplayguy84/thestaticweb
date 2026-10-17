"use client";

import ThemeToggle from "@/components/ThemeToggle";
import Search from "@/components/Search";

export default function MobileNav() {
  return (
    <div className="md:hidden flex items-center gap-2">
      <Search />
      <ThemeToggle />
    </div>
  );
}
