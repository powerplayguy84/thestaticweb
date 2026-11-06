"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const isDark = document.documentElement.classList.contains("dark");
    const current = savedTheme || (isDark ? "dark" : "light");
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.style.colorScheme = newTheme;
  };

  if (!mounted) {
    return <div className="size-9 rounded-full bg-muted/50 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="size-9 rounded-full border border-border/70 bg-card/80 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-foreground/20 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-2xs cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <HugeiconsIcon icon={Moon02Icon} className="size-4" />
      ) : (
        <HugeiconsIcon icon={Sun02Icon} className="size-4" />
      )}
    </button>
  );
}

