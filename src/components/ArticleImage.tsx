"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ASPECT_RATIO_PRESETS, getClosestAspectRatio } from "@/components/article-feed-image";
import { cn } from "@/lib/utils";

const articleRatioCache = new Map<string, (typeof ASPECT_RATIO_PRESETS)[number]>();

interface ArticleImageProps {
  src: string;
  alt: string;
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [matchedRatio, setMatchedRatio] = useState<
    (typeof ASPECT_RATIO_PRESETS)[number] | null
  >(() => (src ? articleRatioCache.get(src) ?? null : null));

  useEffect(() => {
    if (!src || src.trim() === "") {
      setHasError(true);
      return;
    }

    if (articleRatioCache.has(src)) {
      setMatchedRatio(articleRatioCache.get(src)!);
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
      articleRatioCache.set(src, closest);
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

  if (hasError) {
    return null;
  }

  const ratio = matchedRatio ?? ASPECT_RATIO_PRESETS[0];

  return (
    <div
      style={{ aspectRatio: ratio.cssAspect }}
      className={cn(
        "relative w-full max-w-[1440px] mx-auto rounded-2xl overflow-hidden border border-border/70 bg-muted/20 shadow-xs mb-8 transition-all",
        ratio.maxHeightClass
      )}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted/40 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        sizes="(max-width: 768px) 100vw, 1440px"
        priority
        onLoad={() => setImageLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
