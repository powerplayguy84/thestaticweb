"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface FloatingBackButtonProps {
  fallbackHref?: string;
  className?: string;
}

export default function FloatingBackButton({
  fallbackHref = "/",
  className = "",
}: FloatingBackButtonProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const breadcrumbEl = document.querySelector("[aria-label='Breadcrumb']");
      if (breadcrumbEl) {
        const rect = breadcrumbEl.getBoundingClientRect();
        // Visible when breadcrumbs have scrolled past the top of the viewport
        setIsVisible(rect.bottom < 0);
      } else {
        // Fallback for pages without breadcrumbs (e.g. category/tag): visible after header title scrolls past (approx 100px)
        const headingEl = document.querySelector("h1");
        if (headingEl) {
          const rect = headingEl.getBoundingClientRect();
          setIsVisible(rect.bottom < 0);
        } else {
          setIsVisible(window.scrollY > 100);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    }
  };

  return (
    <div
      className={`fixed top-4 z-40 transition-all duration-300 print:hidden left-4 sm:left-6 lg:left-auto lg:top-5 lg:-ml-14 xl:-ml-16 ${className} ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleBack}
        className="h-10 w-10 rounded-full shadow-md bg-background/90 hover:bg-background text-foreground border border-border/80 backdrop-blur-md active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Go back"
        title="Go back"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 text-foreground" />
      </Button>
    </div>
  );
}
