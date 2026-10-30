"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [activeDialogItem, setActiveDialogItem] = useState<SwiperCardItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  if (!items || items.length === 0) return null;

  // Handle click for card item
  const handleItemClick = (item: SwiperCardItem) => {
    if (item.isImageOnly && item.image) {
      setLightboxImage(item.image);
    } else {
      setActiveDialogItem(item);
    }
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
              <div
                onClick={() => handleItemClick(items[0])}
                className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-border/70 shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 bg-muted/40 cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(items[0]);
                  }
                }}
              >
                <Image
                  src={items[0].image}
                  alt="Gallery image"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div
                onClick={() => handleItemClick(items[0])}
                className="h-full flex flex-col justify-between rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(items[0]);
                  }
                }}
              >
                <div>
                  {items[0].image && (
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-muted/40">
                      <Image
                        src={items[0].image}
                        alt={items[0].title || "Feature image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <h4 className="text-lg font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
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
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0 flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label="Read more"
                    className="rounded-full shadow-xs transition-all pointer-events-none group-hover:scale-105"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Button>
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
                    <div
                      onClick={() => handleItemClick(item)}
                      className="relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-border/70 shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 bg-muted/40 cursor-pointer group"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleItemClick(item);
                        }
                      }}
                    >
                      <Image
                        src={item.image}
                        alt="Gallery image"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </SwiperSlide>
                );
              }

              // Case 2: Full Card with Title / Metadata / Body
              return (
                <SwiperSlide key={item.id} className="h-auto">
                  <div
                    onClick={() => handleItemClick(item)}
                    className="h-full flex flex-col justify-between rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleItemClick(item);
                      }
                    }}
                  >
                    <div>
                      {/* Card Image if provided */}
                      {item.image && (
                        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-muted/40">
                          <Image
                            src={item.image}
                            alt={item.title || "Feature image"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* Card Header & Frontmatter info */}
                      <div className="p-5">
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
                          <h4 className="text-lg font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
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
                    </div>

                    <div className="px-5 pb-5 pt-0 flex justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="Read more"
                        className="rounded-full shadow-xs transition-all pointer-events-none group-hover:scale-105"
                      >
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </Button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {/* Pure Blackout Lightbox for Image-Only items */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox preview"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200 cursor-zoom-out"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10 active:scale-95"
          >
            <X className="size-5" />
          </button>

          {/* Centered Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] aspect-16/10 sm:aspect-16/9 overflow-hidden rounded-xl shadow-2xl cursor-default"
          >
            <Image
              src={lightboxImage}
              alt="Lightbox view"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* Details Dialog for Full Cards with Content */}
      <Dialog
        open={!!activeDialogItem}
        onOpenChange={(open) => {
          if (!open) setActiveDialogItem(null);
        }}
      >
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl border border-border/80 shadow-2xl">
          {activeDialogItem?.image && (
            <div className="relative w-full h-48 sm:h-56 bg-muted/40 shrink-0 border-b border-border/50">
              <Image
                src={activeDialogItem.image}
                alt={activeDialogItem.title || "Detail view"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 overflow-y-auto space-y-4">
            <DialogHeader className="space-y-1.5 text-left">
              {activeDialogItem?.badge && (
                <div>
                  <Badge
                    variant="secondary"
                    className="rounded-full text-[11px] font-mono px-2.5 py-0.5 bg-muted/70 text-muted-foreground"
                  >
                    {activeDialogItem.badge}
                  </Badge>
                </div>
              )}
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {activeDialogItem?.title || "Details"}
              </DialogTitle>
              {activeDialogItem?.subtitle && (
                <p className="text-xs font-mono font-medium text-primary">
                  {activeDialogItem.subtitle}
                </p>
              )}
              {activeDialogItem?.description && (
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
                  {activeDialogItem.description}
                </DialogDescription>
              )}
            </DialogHeader>

            {activeDialogItem?.htmlContent && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none border-t border-border/50 pt-4 text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeDialogItem.htmlContent }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
