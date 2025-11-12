"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, List, Share2, Printer } from "lucide-react";
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
  contentType?: "supershort" | "short" | "medium" | "long";
}

type ContentType = "supershort" | "short" | "medium" | "long";

/**
 * Derive content type based on longest line width AND total character count
 * Parse HTML to find the longest single line of text and total content size
 * Uses the NARROWER (more restrictive) of the two metrics
 * This ensures content never gets a wider container than needed
 * supershort: < 50 chars per line AND < 300 total chars
 * short: < 100 chars per line AND < 1000 total chars
 * medium: < 200 chars per line AND < 3000 total chars
 * long: >= 200 chars per line OR >= 3000 total chars
 */
function getContentType(htmlContent: string): ContentType {
  // Remove HTML tags to get plain text
  const temp = document.createElement("div");
  temp.innerHTML = htmlContent;
  const text = temp.textContent || temp.innerText || "";

  // Calculate metrics
  const totalChars = text.length;
  const lines = text.split("\n");
  const longestLine = Math.max(...lines.map((line) => line.trim().length), 0);

  // Determine type based on BOTH metrics (take the narrower classification)
  let lineWidthType: ContentType;
  if (longestLine < 50) lineWidthType = "supershort";
  else if (longestLine < 100) lineWidthType = "short";
  else if (longestLine < 200) lineWidthType = "medium";
  else lineWidthType = "long";

  let totalCharsType: ContentType;
  if (totalChars < 300) totalCharsType = "supershort";
  else if (totalChars < 1000) totalCharsType = "short";
  else if (totalChars < 3000) totalCharsType = "medium";
  else totalCharsType = "long";

  // Use the narrower (more restrictive) classification
  const typeOrder: Record<ContentType, number> = {
    supershort: 0,
    short: 1,
    medium: 2,
    long: 3,
  };
  return typeOrder[lineWidthType] < typeOrder[totalCharsType]
    ? lineWidthType
    : totalCharsType;
}

/**
 * Get container width classes based on content type
 * supershort: very narrow width (for minimal content)
 * short: narrower width
 * medium: default width
 * long: wider width
 */
function getContainerWidthClasses(contentType?: ContentType): string {
  switch (contentType) {
    case "supershort":
      return "sm:max-w-sm md:max-w-md";
    case "short":
      return "sm:max-w-xl md:max-w-2xl";
    case "long":
      return "sm:max-w-4xl md:max-w-6xl";
    case "medium":
    default:
      return "sm:max-w-2xl md:max-w-4xl";
  }
}

interface PresentationModeProps {
  htmlContent: string;
  description?: string;
  title?: string;
  image?: string;
}

export function PresentationMode({
  htmlContent,
  description,
  title,
  image,
}: PresentationModeProps): React.ReactNode {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [hasReadUrl, setHasReadUrl] = React.useState(false);
  const [failedImages, setFailedImages] = React.useState<Set<string>>(
    new Set()
  );

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
        const mermaidElements = document.querySelectorAll<HTMLElement>(
          ".mermaid:not([data-processed])"
        );

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
          const mermaidElements = document.querySelectorAll<HTMLElement>(
            ".mermaid[data-processed]"
          );
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
      image: image && image.trim() ? image : undefined,
      headingLevel: "H1",
      contentType: "short",
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
        contentType: getContentType(preContent),
      });
    }

    // Collect all headings (h1-h2) in order
    const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    allHeadings.forEach((heading, index) => {
      let content = "";
      let image = "";
      let nextElement = heading.nextElementSibling;

      // Collect all content until the next heading
      while (
        nextElement &&
        !["H1", "H2", "H3", "H4", "H5", "H6"].includes(nextElement.tagName)
      ) {
        // Extract first image if found
        let elementHTML = nextElement.outerHTML;
        if (nextElement.tagName === "IMG" && !image) {
          image = (nextElement as HTMLImageElement).src;
          elementHTML = ""; // Don't include standalone images in content
        } else if (nextElement.tagName === "P") {
          const img = nextElement.querySelector("img");
          if (img && !image) {
            image = img.src;
            // Remove image from paragraph content
            const clonedP = (nextElement as HTMLElement).cloneNode(
              true
            ) as HTMLElement;
            clonedP.querySelectorAll("img").forEach((i) => i.remove());
            elementHTML = clonedP.outerHTML;
          }
        }
        content += elementHTML;
        nextElement = nextElement.nextElementSibling;
      }

      // Add slide with heading as title and collected content
      newSlides.push({
        id: `slide-${index}`,
        title: heading.textContent || "",
        content: content.trim(),
        image: image && image.trim() ? image : undefined,
        headingLevel: heading.tagName,
        contentType: getContentType(content),
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

  // Check if slide contains Mermaid diagram
  const hasMermaidDiagram = React.useMemo(() => {
    if (!slide?.content) return false;
    const temp = document.createElement("div");
    temp.innerHTML = slide.content;
    return temp.querySelector(".mermaid") !== null;
  }, [slide?.content]);

  const containerWidthClasses = hasMermaidDiagram
    ? "w-full"
    : getContainerWidthClasses(slide?.contentType);

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      data-presentation-mode="true"
    >
      {slide && (
        <div
          className={`w-full h-full overflow-y-auto ${
            hasMermaidDiagram ? "" : "px-4 sm:px-6 md:px-8"
          }`}
        >
          <div
            className={`w-full ${containerWidthClasses} mx-auto h-full flex flex-col`}
          >
            <div className="w-full flex flex-col flex-1 justify-center">
              {/* Header Section */}
              <div
                className={`flex-shrink-0 prose prose-sm sm:prose-base max-w-none ${
                  !slide.content.trim()
                    ? "flex flex-col items-center justify-center text-center"
                    : ""
                }`}
              >
                {slide.title && (
                  <div className="w-full">
                    {React.createElement(
                      slide.headingLevel?.toLowerCase() || "h2",
                      {},
                      slide.title
                    )}
                    {slide.description && (
                      <p className="text-muted-foreground">
                        {slide.description}
                      </p>
                    )}
                    {slide.image && !failedImages.has(slide.image) && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="rounded-lg"
                        onError={() => {
                          // Mark image as failed to avoid repeatedly rendering a broken image
                          setFailedImages((prev) =>
                            new Set(prev).add(slide.image!)
                          );
                        }}
                      />
                    )}
                  </div>
                )}
                {!slide.title && slide.description && (
                  <div className="w-full">
                    <p className="text-muted-foreground">{slide.description}</p>
                    {slide.image && !failedImages.has(slide.image) && (
                      <img
                        src={slide.image}
                        alt="Slide image"
                        className="rounded-lg"
                        onError={() => {
                          setFailedImages((prev) =>
                            new Set(prev).add(slide.image!)
                          );
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Content Section */}
              {slide.content.trim() && (
                <div
                  className={`w-full min-h-0 pb-20 ${
                    hasMermaidDiagram ? "" : ""
                  }`}
                >
                  <div
                    className="prose prose-sm sm:prose-base max-w-none presentation-mode-content"
                    dangerouslySetInnerHTML={{ __html: slide.content }}
                  />
                  {/* Share and Print Buttons at End of Content */}
                  <div className="mt-8 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: slide?.title || "Presentation",
                              text: slide?.description || "",
                              url: window.location.href,
                            });
                          } catch (error) {
                            // Handle AbortError (user canceled) and other errors gracefully
                            if (
                              error instanceof Error &&
                              error.name === "AbortError"
                            ) {
                              // User canceled the share dialog - this is normal
                              return;
                            }
                            // For other errors, fall back to copying URL
                            navigator.clipboard.writeText(window.location.href);
                          }
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      className="gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Hide UI elements before printing
                        const tocButton = document.querySelector(
                          'button[aria-label="Toggle Table of Contents"]'
                        );
                        const navButtons = document.querySelector(
                          ".absolute.bottom-0.right-0"
                        );
                        const actionButtons = document.querySelector(
                          ".mt-8.flex.justify-end"
                        );

                        if (tocButton)
                          (tocButton as HTMLElement).style.display = "none";
                        if (navButtons)
                          (navButtons as HTMLElement).style.display = "none";
                        if (actionButtons)
                          (actionButtons as HTMLElement).style.display = "none";

                        window.print();

                        // Restore UI elements after printing
                        setTimeout(() => {
                          if (tocButton)
                            (tocButton as HTMLElement).style.display = "";
                          if (navButtons)
                            (navButtons as HTMLElement).style.display = "";
                          if (actionButtons)
                            (actionButtons as HTMLElement).style.display = "";
                        }, 100);
                      }}
                      className="gap-2"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
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
            <List />
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
                  <div className="text-sm font-medium truncate">
                    {s.title || `Slide ${index + 1}`}
                  </div>
                  {s.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {s.description}
                    </div>
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
            onClick={() =>
              setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))
            }
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
