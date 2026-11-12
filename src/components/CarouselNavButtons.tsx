"use client";

import { useCallback, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

/**
 * Shared Swiper navigation state hook for tracking prev/next availability.
 */
export function useSwiperNav() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncNavState = useCallback((instance: SwiperType) => {
    setCanPrev(!instance.isBeginning && !instance.isLocked);
    setCanNext(!instance.isEnd && !instance.isLocked);
  }, []);

  const onSwiper = useCallback(
    (instance: SwiperType) => {
      setSwiper(instance);
      syncNavState(instance);
    },
    [syncNavState]
  );

  return {
    swiper,
    canPrev,
    canNext,
    onSwiper,
    syncNavState,
  };
}

interface CarouselNavButtonsProps {
  swiper: SwiperType | null;
  canPrev: boolean;
  canNext: boolean;
}

/**
 * Prev/next navigation arrows positioned underneath the carousel on wider screens (`md+`).
 */
export function CarouselNavButtons({
  swiper,
  canPrev,
  canNext,
}: CarouselNavButtonsProps) {
  if (!canPrev && !canNext) return null;

  const btnBaseClass =
    "inline-flex items-center justify-center h-10 w-10 rounded-full bg-card hover:bg-card/95 text-card-foreground border border-border/80 shadow-md backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-35 disabled:pointer-events-none";

  return (
    <div className="hidden md:flex items-center justify-center gap-3 mt-4 pb-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Previous slide"
        disabled={!canPrev}
        onClick={() => swiper?.slidePrev()}
        className={btnBaseClass}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 text-primary" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Next slide"
        disabled={!canNext}
        onClick={() => swiper?.slideNext()}
        className={btnBaseClass}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-primary" />
      </Button>
    </div>
  );
}
