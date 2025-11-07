"use client";

import * as React from "react";
import { ChevronUp, ChevronDown, List } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Slide {
  id: string;
  title: string;
  content: string;
  description?: string;
  image?: string;
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
  const carouselRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown") {
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
      });
    });

    setSlides(newSlides);
  }, [htmlContent, description, title, image]);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <Carousel ref={carouselRef} className="w-full h-full flex items-center justify-center" opts={{ startIndex: currentSlide }}>
        <CarouselContent className="h-full w-full flex items-center">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full basis-full px-4 sm:px-6 md:px-8">
              <div className="w-full sm:max-w-2xl md:max-w-4xl mx-auto h-full flex flex-col py-8">
                <div className="w-full flex flex-col flex-1 gap-4">
                  {/* Header Section */}
                  <div className={`flex-shrink-0 ${!slide.content.trim() ? "flex flex-col items-center justify-center" : ""}`}>
                    {slide.title && (
                      <div className="w-full flex flex-col items-center">
                        <h2 className={`font-bold w-full text-center mb-2 sm:mb-4 ${!slide.content.trim() ? "text-3xl sm:text-4xl md:text-5xl" : "text-lg sm:text-xl md:text-2xl"}`}>
                          {slide.title}
                        </h2>
                        {slide.description && (
                          <p className="text-sm sm:text-base md:text-lg text-muted-foreground w-full text-center mb-4 sm:mb-6">
                            {slide.description}
                          </p>
                        )}
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="max-w-full max-h-64 object-contain rounded-lg mt-2 sm:mt-4"
                          />
                        )}
                      </div>
                    )}
                    {!slide.title && slide.description && (
                      <div className="w-full flex flex-col items-center">
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground w-full text-center mb-4 sm:mb-6">
                          {slide.description}
                        </p>
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt="Slide image"
                            className="max-w-full max-h-64 object-contain rounded-lg mt-2 sm:mt-4"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content Section - Scrollable */}
                  {slide.content.trim() && (
                    <div className="w-full min-h-0 overflow-y-auto p-4 sm:p-6 rounded-lg border border-border bg-card">
                      <div
                        className="prose prose-sm sm:prose-base w-full"
                        dangerouslySetInnerHTML={{ __html: slide.content }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* TOC Button - Bottom Left */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="absolute bottom-4 left-4 z-40 inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
        aria-label="Toggle Table of Contents"
      >
        <List className="w-4 h-4" />
      </button>

      {/* Table of Contents Sidebar */}
      {showTOC && (
        <div className="absolute inset-0 z-30 bg-background/95 backdrop-blur-sm flex flex-col p-6 max-w-xs border-r border-border">
          <h3 className="font-bold mb-4 text-lg">Slides</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
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
                <div className="text-sm font-medium truncate">{slide.title || `Slide ${index + 1}`}</div>
                {slide.description && (
                  <div className="text-xs text-muted-foreground truncate">{slide.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-md transition-colors"
          aria-label="Previous slide"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-muted-foreground px-2">
          {currentSlide + 1} / {slides.length}
        </span>
        <button
          onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="inline-flex items-center justify-center p-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-md transition-colors"
          aria-label="Next slide"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
