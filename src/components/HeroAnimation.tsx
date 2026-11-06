"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";

// Dynamically import DotLottieReact with SSR disabled to prevent hydration / canvas / wasm issues
const DotLottiePlayer = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center" />
    ),
  }
);

interface HeroAnimationProps {
  src: string;
  darkSrc?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function HeroAnimation({
  src,
  darkSrc,
  className,
  loop = true,
  autoplay = true,
}: HeroAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive dark mode animation URL if not explicitly provided
  const effectiveDarkSrc =
    darkSrc ||
    (src.includes(".lottie")
      ? src.replace(/\.lottie$/, "-dark.lottie")
      : src.replace(/\.json$/, "-dark.json"));

  useEffect(() => {
    setMounted(true);

    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Listen to container resizing to dynamically trigger dotLottie.resize()
  useEffect(() => {
    if (!containerRef.current || !dotLottie) return;

    const resizeObserver = new ResizeObserver(() => {
      try {
        dotLottie.resize();
      } catch {
        // Safe fallback if instance is tearing down
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [dotLottie]);

  if (!mounted) {
    return (
      <div ref={containerRef} className={className}>
        <div className="w-full h-full flex items-center justify-center" />
      </div>
    );
  }

  const activeSrc = isDark && effectiveDarkSrc ? effectiveDarkSrc : src;

  return (
    <div ref={containerRef} className={className}>
      <DotLottiePlayer
        key={activeSrc}
        src={activeSrc}
        loop={loop}
        autoplay={autoplay}
        dotLottieRefCallback={setDotLottie}
        layout={{ fit: "contain", align: [0.5, 0.5] }}
        renderConfig={{ autoResize: true }}
        className="w-full h-full object-contain block mx-auto"
      />
    </div>
  );
}
