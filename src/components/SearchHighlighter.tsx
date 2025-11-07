"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchHighlighter() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  useEffect(() => {
    if (!highlight) return;

    const lowerHighlight = highlight.toLowerCase();

    // Function to perform the highlighting on a given node
    const findAndHighlight = (node: Node) => {
      // 1. If it's an element, check if it should be skipped
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (
          el.hasAttribute("data-no-search-highlight") ||
          el.tagName === "SCRIPT" ||
          el.tagName === "STYLE"
        ) {
          return; // Stop traversing this branch
        }
      }

      // 2. If it's a text node, perform the replacement
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const index = text.toLowerCase().indexOf(lowerHighlight);

        if (index !== -1) {
          const parent = node.parentElement;
          if (!parent || parent.tagName === "MARK") {
            return;
          }

          const beforeText = text.substring(0, index);
          const highlightedText = text.substring(
            index,
            index + highlight.length
          );
          const afterText = text.substring(index + highlight.length);

          const mark = document.createElement("mark");
          mark.className =
            "bg-yellow-200 dark:bg-yellow-900 text-foreground font-medium scroll-mt-20";
          mark.textContent = highlightedText;
          mark.setAttribute("data-search-highlight", "true");

          const fragment = document.createDocumentFragment();
          if (beforeText) {
            fragment.appendChild(document.createTextNode(beforeText));
          }
          fragment.appendChild(mark);
          if (afterText) {
            fragment.appendChild(document.createTextNode(afterText));
          }

          parent.replaceChild(fragment, node);

          // Scroll to the first highlighted element found
          if (
            !document.querySelector("[data-search-highlight][data-scrolled]")
          ) {
            mark.setAttribute("data-scrolled", "true");
            mark.classList.add(
              "ring-2",
              "ring-blue-500",
              "dark:ring-blue-400"
            );
            setTimeout(() => {
              mark.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
          }
        }
      }

      // 3. Recursively call on child nodes
      Array.from(node.childNodes).forEach(findAndHighlight);
    };

    // Delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        findAndHighlight(mainContent);
      }
    }, 100);

    // Cleanup function to remove highlights and timeout
    return () => {
      clearTimeout(timeoutId);
      const marks = document.querySelectorAll("[data-search-highlight]");
      marks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
          // Replace the mark with its text content
          parent.replaceChild(
            document.createTextNode(mark.textContent || ""),
            mark
          );
          // Normalize to merge adjacent text nodes
          parent.normalize();
        }
      });
    };
  }, [highlight]);

  return null;
}
