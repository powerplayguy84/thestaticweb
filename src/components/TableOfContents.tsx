"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  const activeRef = useRef<HTMLAnchorElement>(null);

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
    // Set first heading as active initially
    if (extractedHeadings.length > 0) {
      setActiveId(extractedHeadings[0].id);
    }
  }, [content]);

  // Track active heading on scroll with debouncing
  useEffect(() => {
    if (!isMounted || headings.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        let current = "";
        let closestDistance = Infinity;

        headings.forEach((heading) => {
          const element = document.getElementById(heading.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Find the heading closest to top of viewport
            if (rect.top >= -100 && rect.top < closestDistance) {
              closestDistance = rect.top;
              current = heading.id;
            }
          }
        });

        if (current) {
          setActiveId(current);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headings, isMounted]);

  // Scroll active item into view in TOC
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeId]);

  const tocContent = (
    <nav className="space-y-1">
      {headings.map((heading, index) => (
        <Link
          key={heading.id}
          ref={activeId === heading.id ? activeRef : null}
          href={`#${heading.id}`}
          className={`flex items-start gap-2 text-sm transition-all duration-200 rounded-md px-3 py-2 ${
            activeId === heading.id
              ? "text-primary font-semibold bg-primary/10"
              : heading.level === 2
                ? "text-foreground font-medium hover:bg-muted/50 hover:text-primary"
                : "text-muted-foreground pl-6 hover:bg-muted/30 hover:text-foreground"
          }`}
          onClick={() => setOpen(false)}
        >
          <span className="flex-1 line-clamp-2">{heading.text}</span>
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
      <aside className="hidden lg:block fixed left-0 top-24 w-56 max-h-[calc(100vh-6rem)] overflow-y-auto px-4 py-6 border-r border-border">
        <h2 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest">
          On this page
        </h2>
        <div className="space-y-0.5">
          {tocContent}
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="lg:hidden print:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="fixed bottom-6 left-6 z-40 gap-2"
              aria-label="Open table of contents"
            >
              <Menu className="w-4 h-4" />
              <span>Contents</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 overflow-y-auto">
            <SheetTitle className="mb-4">On this page</SheetTitle>
            <div className="space-y-0.5">
              {tocContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
