import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format category name for display
 * Decodes URL encodings, converts dashes/underscores/spaces to spaces and capitalizes each word
 * Example: "business-strategy" -> "Business Strategy"
 * Example: "about%20us" -> "About Us"
 */
export function formatCategoryName(category: string): string {
  let decoded = category;
  try {
    decoded = decodeURIComponent(category);
  } catch {
    // Keep original if malformed URI
  }

  return decoded
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}



