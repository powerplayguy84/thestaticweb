"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  const carouselRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const prevButton = carouselRef.current?.querySelector("[data-slot='carousel-previous']") as HTMLButtonElement;
        prevButton?.click();
      } else if (e.key === "ArrowRight") {
        const nextButton = carouselRef.current?.querySelector("[data-slot='carousel-next']") as HTMLButtonElement;
        nextButton?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <div className="w-full h-full flex items-center justify-center">
      <Carousel ref={carouselRef} className="w-full h-full flex items-center justify-center">
        <CarouselContent className="h-full w-full flex items-center">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full flex items-center justify-center basis-full px-4 sm:px-6 md:px-8">
              <div className="w-full sm:max-w-2xl md:max-w-4xl">
                <div className={`w-full h-full flex flex-col p-4 sm:p-6 gap-4 ${!slide.content.trim() ? "items-center justify-center" : "items-center justify-start overflow-y-auto"}`}>
                  {slide.title && (
                    <div className="w-full flex flex-col items-center flex-shrink-0">
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
                    <div className="w-full flex flex-col items-center flex-shrink-0">
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
                  {slide.content.trim() && (
                    <div
                      className="prose prose-sm sm:prose-base w-full overflow-y-auto flex-1"
                      dangerouslySetInnerHTML={{ __html: slide.content }}
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
