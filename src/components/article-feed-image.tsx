"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ASPECT_RATIO_PRESETS = [
  {
    name: "landscape",
    ratio: 1080 / 566, // ~1.9081
    cssAspect: "1080 / 566",
    maxHeightClass: "max-h-[380px]",
  },
  {
    name: "square",
    ratio: 1, // 1:1
    cssAspect: "1 / 1",
    maxHeightClass: "max-h-[460px]",
  },
  {
    name: "portrait",
    ratio: 4 / 5, // 0.8
    cssAspect: "4 / 5",
    maxHeightClass: "max-h-[520px]",
  },
  {
    name: "vertical",
    ratio: 9 / 16, // 0.5625
    cssAspect: "9 / 16",
    maxHeightClass: "max-h-[560px]",
  },
] as const;

export function getClosestAspectRatio(naturalWidth: number, naturalHeight: number) {
  if (!naturalWidth || !naturalHeight) {
    return ASPECT_RATIO_PRESETS[0]; // Default landscape
  }

  const actualRatio = naturalWidth / naturalHeight;

  let closest: (typeof ASPECT_RATIO_PRESETS)[number] = ASPECT_RATIO_PRESETS[0];
  let minDiff = Math.abs(actualRatio - closest.ratio);

  for (let i = 1; i < ASPECT_RATIO_PRESETS.length; i++) {
    const preset = ASPECT_RATIO_PRESETS[i];
    const diff = Math.abs(actualRatio - preset.ratio);
    if (diff < minDiff) {
      minDiff = diff;
      closest = preset;
    }
  }

  return closest;
}

const ratioCache = new Map<string, (typeof ASPECT_RATIO_PRESETS)[number]>();

interface ArticleFeedImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

export function ArticleFeedImage({
  src,
  alt,
  onClick,
  className,
}: ArticleFeedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [matchedRatio, setMatchedRatio] = useState<
    (typeof ASPECT_RATIO_PRESETS)[number] | null
  >(() => (src ? ratioCache.get(src) ?? null : null));

  useEffect(() => {
    if (!src || src.trim() === "") {
      setHasError(true);
      return;
    }

    if (ratioCache.has(src)) {
      setMatchedRatio(ratioCache.get(src)!);
      return;
    }

    let isMounted = true;
    const img = new window.Image();
    img.src = src;

    const onFinish = () => {
      if (!isMounted) return;
      const w = img.naturalWidth || 1080;
      const h = img.naturalHeight || 566;
      const closest = getClosestAspectRatio(w, h);
      ratioCache.set(src, closest);
      setMatchedRatio(closest);
    };

    if (img.complete && img.naturalWidth > 0) {
      onFinish();
    } else {
      img.onload = onFinish;
      img.onerror = () => {
        if (!isMounted) return;
        setHasError(true);
      };
    }

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (hasError || !src || src.trim() === "") {
    return null;
  }

  const ratio = matchedRatio ?? ASPECT_RATIO_PRESETS[0];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ aspectRatio: ratio.cssAspect }}
      className={cn(
        "relative w-full rounded-2xl overflow-hidden border border-border/60 bg-muted/20 transition-transform shadow-xs block text-left",
        ratio.maxHeightClass,
        onClick ? "cursor-pointer hover:scale-[1.005]" : "cursor-default",
        className
      )}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted/40 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 680px"
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => setHasError(true)}
      />
    </button>
  );
}
