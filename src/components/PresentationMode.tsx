"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
}

interface PresentationModeProps {
  htmlContent: string;
}

export function PresentationMode({ htmlContent }: PresentationModeProps): React.ReactNode {
  const [slides, setSlides] = React.useState<Slide[]>([]);

  React.useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const newSlides: Slide[] = [];

    // Add title slide first if h1 exists
    const h1 = doc.querySelector("h1");
    if (h1) {
      // Get the first paragraph as description
      let description = "";
      let nextElement = h1.nextElementSibling;
      if (nextElement && nextElement.tagName === "P") {
        description = nextElement.textContent || "";
      }

      newSlides.push({
        id: "slide-title",
        title: h1.textContent || "",
        content: "",
        description: description,
      });
    }

    // Collect content before the first heading
    let introContent = "";
    let firstHeading = doc.querySelector("h1, h2, h3, h4, h5, h6");
    if (firstHeading) {
      let element = firstHeading.previousElementSibling;
      const contentElements: Element[] = [];
      while (element) {
        contentElements.unshift(element);
        element = element.previousElementSibling;
      }
      contentElements.forEach((el) => {
        introContent += el.outerHTML;
      });
    }

    // Add intro slide if there's content before first heading
    if (introContent.trim()) {
      newSlides.push({
        id: "slide-intro",
        title: "Introduction",
        content: introContent,
      });
    }

    // Add content slides for h2, h3, h4, h5, h6
    const headings = doc.querySelectorAll("h2, h3, h4, h5, h6");
    headings.forEach((heading, index) => {
      let content = "";
      let nextElement = heading.nextElementSibling;
      while (nextElement && !["H1", "H2", "H3", "H4", "H5", "H6"].includes(nextElement.tagName)) {
        content += nextElement.outerHTML;
        nextElement = nextElement.nextElementSibling;
      }
      newSlides.push({
        id: `slide-${index}`,
        title: heading.textContent || "",
        content: content,
      });
    });

    setSlides(newSlides);
  }, [htmlContent]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Carousel className="w-full h-full flex items-center justify-center">
        <CarouselContent className="h-full w-full flex items-center">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full flex items-center justify-center basis-full">
              <Card className="w-full aspect-video">
                <CardContent className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="w-full flex flex-col items-center">
                    <h2 className={`font-bold mb-4 w-full text-center ${!slide.content.trim() ? "text-5xl" : "text-2xl"}`}>{slide.title}</h2>
                    {slide.description && (
                      <p className="text-lg text-muted-foreground w-full text-center mb-6">{slide.description}</p>
                    )}
                  </div>
                  <div
                    className="prose prose-sm w-full"
                    dangerouslySetInnerHTML={{ __html: slide.content }}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
