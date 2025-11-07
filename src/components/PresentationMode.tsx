"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

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
  const [showTOC, setShowTOC] = React.useState(false);

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

    // Collect all headings (h1-h6) in order
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

  const slide = slides[currentSlide];

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {slide && (
        <div className="w-full h-full overflow-y-auto px-4 sm:px-6 md:px-8">
          <div className="w-full sm:max-w-2xl md:max-w-4xl mx-auto h-full flex flex-col py-8">
            <div className="w-full flex flex-col flex-1 gap-4 justify-center">
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
                <div className="w-full min-h-0 p-4 sm:p-6 rounded-lg border border-border bg-card">
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

      {/* TOC Button - Bottom Left */}
      <Button
        onClick={() => setShowTOC(!showTOC)}
          variant="outline"
         className="fixed bottom-6 left-6 z-40 gap-2 shadow-lg"
        aria-label="Toggle Table of Contents"
      >
        <List className="w-4 h-4" />
      </Button>

      {/* Table of Contents Sidebar */}
      {showTOC && (
        <div className="absolute inset-0 z-30 bg-background/95 backdrop-blur-sm flex flex-col p-6 max-w-xs border-r border-border">
          <h3 className="font-bold mb-4 text-lg">Slides</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(index);
                  setShowTOC(false);
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
            ))}
          </div>
        </div>
      )}

      {/* Navigation FAB - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-40">
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
