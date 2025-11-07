"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Slide {
  id: string;
  title: string;
  content: string;
  description?: string;
  image?: string;
  headingLevel?: string;
}

interface PresentationModeProps {
  htmlContent: string;
  description?: string;
  title?: string;
  image?: string;
}

export function PresentationMode({ htmlContent, description, title, image }: PresentationModeProps): React.ReactNode {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [hasReadUrl, setHasReadUrl] = React.useState(false);

  // Read slide from URL parameter once on mount
  React.useEffect(() => {
    if (typeof window === "undefined" || hasReadUrl) return;
    const params = new URLSearchParams(window.location.search);
    const slideParam = params.get("slide");
    if (slideParam) {
      const slideNum = parseInt(slideParam, 10);
      if (!isNaN(slideNum) && slideNum >= 0) {
        setCurrentSlide(slideNum);
      }
    }
    setHasReadUrl(true);
  }, [hasReadUrl]);

  // Update URL when slide changes (after URL has been read)
  React.useEffect(() => {
    if (typeof window === "undefined" || !hasReadUrl) return;
    const params = new URLSearchParams(window.location.search);
    params.set("slide", currentSlide.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [currentSlide, hasReadUrl]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  // Initialize Mermaid diagrams when slide changes or theme changes
  React.useEffect(() => {
    const initMermaid = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        
        const isDark = document.documentElement.classList.contains("dark");
        
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-geist-sans)",
        });

        // Find all mermaid elements in current slide that haven't been processed
        const mermaidElements = document.querySelectorAll<HTMLElement>(".mermaid:not([data-processed])");
        
        for (const element of Array.from(mermaidElements)) {
          try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const code = element.textContent || "";
            
            const { svg } = await mermaid.render(id, code);
            element.innerHTML = svg;
            element.setAttribute("data-processed", "true");
          } catch (error) {
            console.error("Failed to render mermaid diagram:", error);
            element.innerHTML = `<pre>Error rendering diagram</pre>`;
          }
        }
      } catch (error) {
        console.error("Failed to load mermaid:", error);
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(initMermaid, 100);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          // Re-render mermaid diagrams when theme changes
          const mermaidElements = document.querySelectorAll<HTMLElement>(".mermaid[data-processed]");
          mermaidElements.forEach((el) => el.removeAttribute("data-processed"));
          initMermaid();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentSlide]);

  React.useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const newSlides: Slide[] = [];

    // First slide: title and description from frontmatter only
    newSlides.push({
      id: "slide-frontmatter",
      title: title || "",
      content: "",
      description: description,
      image: image || undefined,
      headingLevel: "H1",
    });

    // Get the first heading
    const firstHeading = doc.querySelector("h1, h2, h3, h4, h5, h6");
    
    // Collect content before the first heading
    let preContent = "";
    if (firstHeading) {
      let element = firstHeading.previousElementSibling;
      const contentElements: Element[] = [];
      while (element) {
        contentElements.unshift(element);
        element = element.previousElementSibling;
      }
      contentElements.forEach((el) => {
        preContent += el.outerHTML;
      });
    }

    // Add pre-heading slide if content exists
    if (preContent.trim()) {
      newSlides.push({
        id: "slide-pre",
        title: "",
        content: preContent,
      });
    }

    // Collect all headings (h1-h2) in order
    const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    
    allHeadings.forEach((heading, index) => {
      let content = "";
      let image = "";
      let nextElement = heading.nextElementSibling;
      
      // Collect all content until the next heading
      while (nextElement && !["H1", "H2", "H3", "H4", "H5", "H6"].includes(nextElement.tagName)) {
        // Extract first image if found
        if (nextElement.tagName === "IMG" && !image) {
          image = (nextElement as HTMLImageElement).src;
        } else if (nextElement.tagName === "P") {
          const img = nextElement.querySelector("img");
          if (img && !image) {
            image = img.src;
          }
        }
        content += nextElement.outerHTML;
        nextElement = nextElement.nextElementSibling;
      }
      
      // Add slide with heading as title and collected content
      newSlides.push({
        id: `slide-${index}`,
        title: heading.textContent || "",
        content: content,
        image: image || undefined,
        headingLevel: heading.tagName,
      });
    });

    setSlides(newSlides);
  }, [htmlContent, description, title, image]);

  // Restore slide position from URL after slides are loaded
  React.useEffect(() => {
    if (slides.length === 0 || !hasReadUrl) return;
    const params = new URLSearchParams(window.location.search);
    const slideParam = params.get("slide");
    if (slideParam) {
      const slideNum = parseInt(slideParam, 10);
      if (!isNaN(slideNum) && slideNum >= 0 && slideNum < slides.length) {
        setCurrentSlide(slideNum);
      }
    }
  }, [slides, hasReadUrl]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {slide && (
        <div className="w-full h-full overflow-y-auto px-4 sm:px-6 md:px-8">
          <div className="w-full sm:max-w-2xl md:max-w-4xl mx-auto h-full flex flex-col py-8">
            <div className="w-full flex flex-col flex-1 justify-center">
              {/* Header Section */}
              <div className={`flex-shrink-0 prose prose-sm sm:prose-base max-w-none ${!slide.content.trim() ? "flex flex-col items-center justify-center text-center" : ""}`}>
                {slide.title && (
                  <div className="w-full">
                    {React.createElement(
                      slide.headingLevel?.toLowerCase() || 'h2',
                      {},
                      slide.title
                    )}
                    {slide.description && (
                      <p className="text-muted-foreground">
                        {slide.description}
                      </p>
                    )}
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                )}
                {!slide.title && slide.description && (
                  <div className="w-full">
                    <p className="text-muted-foreground">
                      {slide.description}
                    </p>
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt="Slide image"
                        className="rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Content Section */}
              {slide.content.trim() && (
                <div className="w-full min-h-0">
                  <div
                    className="prose prose-sm sm:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: slide.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOC Button and Sheet - Bottom Left */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="absolute bottom-0 left-0 z-40 shadow-lg"
            aria-label="Toggle Table of Contents"
          >
            <List/>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Slides</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto space-y-2 p-4">
            {slides.map((s, index) => (
              <SheetTrigger asChild key={s.id}>
                <button
                  onClick={() => {
                    setCurrentSlide(index);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    currentSlide === index
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="text-sm font-medium truncate">{s.title || `Slide ${index + 1}`}</div>
                  {s.description && (
                    <div className="text-xs text-muted-foreground truncate">{s.description}</div>
                  )}
                </button>
              </SheetTrigger>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Navigation FAB - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-40">
        <ButtonGroup className="shadow-lg">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center justify-center bg-background border px-4 text-xs font-medium text-muted-foreground">
            {currentSlide + 1} / {slides.length}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            aria-label="Next slide"
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
