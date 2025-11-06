"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    
    // Extract headings from actual DOM instead of parsing HTML string
    const headingElements = document.querySelectorAll("article h2, article h3");
    const extractedHeadings: Heading[] = [];
    const idCounts: Record<string, number> = {};

    headingElements.forEach((el) => {
      const text = el.textContent || "";
      const level = parseInt(el.tagName[1]);
      let id = el.id || "";

      if (id && text.trim()) {
        // Track duplicate IDs and make them unique
        if (idCounts[id]) {
          idCounts[id]++;
          id = `${id}-${idCounts[id]}`;
        } else {
          idCounts[id] = 0;
        }
        
        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      let current = "";

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if heading is in viewport (with some offset for header)
          if (rect.top <= 100) {
            current = heading.id;
          }
        }
      });

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, isMounted]);

  const tocContent = (
    <nav className="space-y-2">
      {headings.map((heading) => (
        <Link
          key={heading.id}
          href={`#${heading.id}`}
          className={`block text-sm transition-colors hover:text-foreground ${
            heading.level === 2
              ? "text-foreground font-medium"
              : "text-muted-foreground pl-4"
          }`}
          onClick={() => setOpen(false)}
        >
          {heading.text}
        </Link>
      ))}
    </nav>
  );

  if (!isMounted || headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-24 w-48 max-h-[calc(100vh-6rem)] overflow-y-auto px-6 py-8">
        <h2 className="text-sm font-semibold mb-4 text-foreground">
          On this page
        </h2>
        {tocContent}
      </aside>

      {/* Mobile Sheet */}
      <div className="lg:hidden print:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="fixed bottom-6 left-6 z-40"
              aria-label="Open table of contents"
            >
              <Menu className="w-4 h-4 mr-2" />
              Contents
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetTitle>On this page</SheetTitle>
            {tocContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
