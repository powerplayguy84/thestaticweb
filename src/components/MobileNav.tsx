"use client";

import Link from "next/link";
import { Menu, Home } from "lucide-react";
import { useState } from "react";
import { formatCategoryName } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import Search from "@/components/Search";
import type { CategoryInfo } from "@/lib/markdown";

interface MobileNavProps {
  categoriesInfo: CategoryInfo[];
}

export default function MobileNav({ categoriesInfo }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      <Search />
      <ThemeToggle />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav
            className="flex flex-col gap-2 mt-6"
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-lg hover:bg-muted min-h-[48px]"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            {categoriesInfo.map((category) => (
              <Link
                key={category.slug}
                href={`/${encodeURIComponent(category.slug)}`}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-lg hover:bg-muted min-h-[48px]"
              >
                {category.title || formatCategoryName(category.slug)}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
