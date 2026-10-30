"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
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
    
    // Detect active heading on page load
    if (extractedHeadings.length > 0) {
      let firstVisibleId = "";
      for (const heading of extractedHeadings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 80 && rect.top < window.innerHeight) {
            firstVisibleId = heading.id;
            break;
          }
        }
      }

      if (!firstVisibleId) {
        for (let i = extractedHeadings.length - 1; i >= 0; i--) {
          const element = document.getElementById(extractedHeadings[i].id);
          if (element && element.getBoundingClientRect().top <= 80) {
            firstVisibleId = extractedHeadings[i].id;
            break;
          }
        }
      }

      setActiveId(firstVisibleId || extractedHeadings[0].id);
    }
  }, [content]);

  // Track active heading on scroll with debouncing
  useEffect(() => {
    if (!isMounted || headings.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        let firstVisibleId = "";
        for (const heading of headings) {
          const element = document.getElementById(heading.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Find the first heading that is visible below the header
            if (rect.top >= 80 && rect.top < window.innerHeight) {
              firstVisibleId = heading.id;
              break; // Found the first one, stop looking
            }
          }
        }

        // If no heading is in the main viewport, find the last one scrolled past
        if (!firstVisibleId) {
          for (let i = headings.length - 1; i >= 0; i--) {
            const element = document.getElementById(headings[i].id);
            if (element && element.getBoundingClientRect().top <= 80) {
              firstVisibleId = headings[i].id;
              break;
            }
          }
        }

        setActiveId(firstVisibleId || (headings.length > 0 ? headings[0].id : ""));
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
      activeRef.current.scrollIntoView({ block: "center" });
    }
  }, [activeId]);

  // Scroll active item into view when mobile sheet opens
  useEffect(() => {
    if (open && activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({block: "center" });
      }, 100);
    }
  }, [open]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, headingId: string) => {
    e.preventDefault();
    setOpen(false);
    
    const element = document.getElementById(headingId);
    if (element) {
      // Check if viewport is md or larger (768px+)
      const isMdOrLarger = window.matchMedia("(min-width: 768px)").matches;
      
      if (isMdOrLarger) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        element.scrollIntoView({ block: "start" });
      }
      
      // Update URL hash
      window.history.pushState(null, "", `#${headingId}`);
    }
  };

  const tocContent = (
    <nav className="space-y-1">
      {headings.map((heading) => (
        <Link
          key={heading.id}
          ref={activeId === heading.id ? activeRef : null}
          href={`#${heading.id}`}
          className={`flex items-start gap-2 text-sm transition-all duration-200 rounded-lg px-3 py-1.5 ${
            activeId === heading.id
              ? heading.level === 3
                ? "text-foreground font-medium bg-muted/80 shadow-xs border border-border/40"
                : "text-foreground font-semibold bg-muted/80 shadow-xs border border-border/40"
              : heading.level === 2
                ? "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                : "text-muted-foreground/80 hover:bg-muted/30 hover:text-foreground"
          } ${heading.level === 3 ? "pl-5 text-xs" : ""}`}
          onClick={(e) => handleLinkClick(e, heading.id)}
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
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-56 overflow-y-auto scrollbar-thin px-4 py-6 border-r border-border/60 bg-background/95 backdrop-blur-xl print:hidden z-30">
        <h2 className="text-[11px] font-mono font-medium mb-4 text-muted-foreground uppercase tracking-wider">
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
              className="fixed bottom-6 right-6 z-40 gap-2 shadow-xl rounded-full bg-background/95 hover:bg-background text-foreground border border-border/80 backdrop-blur-md active:scale-95 transition-all px-4 py-2.5 h-11"
              aria-label="Open table of contents"
            >
              <HugeiconsIcon icon={Menu01Icon} className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Contents</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 overflow-y-auto scrollbar-thin">
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
