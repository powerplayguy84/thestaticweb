"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchHighlighter() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  useEffect(() => {
    if (!highlight) return;

    // Wait for the content to be rendered
    setTimeout(() => {
      const contentDiv = document.querySelector(".prose");
      if (!contentDiv) return;

      // Find all text nodes in the content
      const findAndHighlight = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          const lowerText = text.toLowerCase();
          const lowerHighlight = highlight.toLowerCase();
          const index = lowerText.indexOf(lowerHighlight);

          if (index !== -1) {
            const parent = node.parentElement;
            if (!parent) return;

            // Don't highlight if already in a mark element
            if (parent.tagName === "MARK") return;

            // Create new nodes with highlighted text
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
            if (beforeText)
              fragment.appendChild(document.createTextNode(beforeText));
            fragment.appendChild(mark);
            if (afterText)
              fragment.appendChild(document.createTextNode(afterText));

            parent.replaceChild(fragment, node);

            // Scroll to the first highlighted element
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
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).tagName !== "SCRIPT" &&
          (node as Element).tagName !== "STYLE"
        ) {
          // Recursively process child nodes
          Array.from(node.childNodes).forEach(findAndHighlight);
        }
      };

      findAndHighlight(contentDiv);

      // Cleanup function to remove highlights when component unmounts
      return () => {
        const marks = contentDiv.querySelectorAll("[data-search-highlight]");
        marks.forEach((mark) => {
          const parent = mark.parentNode;
          if (parent) {
            parent.replaceChild(
              document.createTextNode(mark.textContent || ""),
              mark
            );
          }
        });
      };
    }, 100);
  }, [highlight]);

  return null;
}
