"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

// Import Swiper core styles
import "swiper/css";

export interface SwiperCardItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  image?: string;
  htmlContent: string;
  isImageOnly?: boolean;
}

interface ArticleSwiperSectionProps {
  items: SwiperCardItem[];
  sectionTitle?: string;
}

export function ArticleSwiperSection({
  items,
  sectionTitle,
}: ArticleSwiperSectionProps) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  if (!items || items.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Check if all cards in this group are pure image-only cards
  const isImageOnlyCarousel = items.every((item) => item.isImageOnly);

  return (
    <div className="my-8 not-prose w-full overflow-hidden">
      {sectionTitle && (
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {sectionTitle}
          </h3>
        </div>
      )}

      <div className="relative w-full">
        {items.length === 1 ? (
          <div className="w-full">
            {items[0].isImageOnly && items[0].image ? (
              <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-border/70 shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 bg-muted/40">
                <Image
                  src={items[0].image}
                  alt="Gallery image"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-full flex flex-col rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs overflow-hidden">
                {items[0].image && (
                  <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-muted/40">
                    <Image
                      src={items[0].image}
                      alt={items[0].title || "Feature image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  {items[0].badge && (
                    <Badge
                      variant="secondary"
                      className="rounded-full text-[11px] font-mono px-2.5 py-0.5 bg-muted/70 text-muted-foreground mb-2"
                    >
                      {items[0].badge}
                    </Badge>
                  )}
                  {items[0].title && (
                    <h4 className="text-lg font-bold tracking-tight text-foreground leading-snug">
                      {items[0].title}
                    </h4>
                  )}
                  {items[0].subtitle && (
                    <p className="text-xs font-mono font-medium text-primary mt-1">
                      {items[0].subtitle}
                    </p>
                  )}
                  {items[0].description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2.5">
                      {items[0].description}
                    </p>
                  )}
                  {items[0].htmlContent && items[0].htmlContent.trim().length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() => toggleExpand(items[0].id)}
                        className="flex items-center justify-between w-full text-xs font-medium text-foreground/80 hover:text-foreground py-1 transition-colors group/btn cursor-pointer"
                      >
                        <span>{expandedCards[items[0].id] ? "Show less" : "More"}</span>
                        <ChevronDown
                          className={`size-4 text-muted-foreground transition-transform duration-200 ${
                            expandedCards[items[0].id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedCards[items[0].id] && (
                        <div className="mt-3 text-sm text-foreground/90 max-h-64 overflow-y-auto pr-1 space-y-2 border-t border-border/30 pt-2 animate-in fade-in-50 duration-200 prose prose-sm dark:prose-invert max-w-none">
                          <div
                            dangerouslySetInnerHTML={{ __html: items[0].htmlContent }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Swiper
            modules={[A11y, Keyboard]}
            spaceBetween={16}
            slidesPerView={1.15}
            keyboard={{ enabled: true }}
            breakpoints={{
              480: {
                slidesPerView: 1.3,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: isImageOnlyCarousel ? 1.8 : 1.6,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: items.length > 2 ? (isImageOnlyCarousel ? 2.5 : 2.2) : items.length,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: items.length > 2 ? (isImageOnlyCarousel ? 3 : 2.5) : items.length,
                spaceBetween: 24,
              },
            }}
            className="pb-2 cursor-grab active:cursor-grabbing w-full"
          >
            {items.map((item) => {
              // Case 1: Pure Image Card (no text underneath)
              if (item.isImageOnly && item.image) {
                return (
                  <SwiperSlide key={item.id} className="h-auto">
                    <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-border/70 shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 bg-muted/40">
                      <Image
                        src={item.image}
                        alt="Gallery image"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </SwiperSlide>
                );
              }

              // Case 2: Full Card with Title / Metadata / Body
              const isExpanded = !!expandedCards[item.id];
              const hasBody = item.htmlContent && item.htmlContent.trim().length > 0;

              return (
                <SwiperSlide key={item.id} className="h-auto">
                  <div className="h-full flex flex-col rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 overflow-hidden">
                    {/* Card Image if provided */}
                    {item.image && (
                      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-muted/40">
                        <Image
                          src={item.image}
                          alt={item.title || "Feature image"}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Card Header & Frontmatter info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {item.badge ? (
                            <Badge
                              variant="secondary"
                              className="rounded-full text-[11px] font-mono px-2.5 py-0.5 bg-muted/70 text-muted-foreground"
                            >
                              {item.badge}
                            </Badge>
                          ) : (
                            <span />
                          )}
                        </div>

                        {item.title && (
                          <h4 className="text-lg font-bold tracking-tight text-foreground leading-snug">
                            {item.title}
                          </h4>
                        )}

                        {item.subtitle && (
                          <p className="text-xs font-mono font-medium text-primary mt-1">
                            {item.subtitle}
                          </p>
                        )}

                        {item.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Collapsible / Expandable Body */}
                      {hasBody && (
                        <div className="mt-4 pt-3 border-t border-border/50">
                          <button
                            type="button"
                            onClick={() => toggleExpand(item.id)}
                            className="flex items-center justify-between w-full text-xs font-medium text-foreground/80 hover:text-foreground py-1 transition-colors group/btn cursor-pointer"
                          >
                            <span>{isExpanded ? "Show less" : "More"}</span>
                            <ChevronDown
                              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="mt-3 text-sm text-foreground/90 max-h-64 overflow-y-auto pr-1 space-y-2 border-t border-border/30 pt-2 animate-in fade-in-50 duration-200 prose prose-sm dark:prose-invert max-w-none">
                              <div
                                dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}
