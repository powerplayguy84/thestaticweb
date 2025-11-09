"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Maximize } from "lucide-react";

export function MermaidInitializer() {
  const router = useRouter();

  useEffect(() => {
    const initMermaid = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import("mermaid")).default;

        const isDark = document.documentElement.classList.contains("dark");

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-geist-sans)",
        });

        // Find all mermaid elements and render them
        const mermaidElements = document.querySelectorAll<HTMLElement>(
          ".mermaid:not([data-processed])"
        );

        for (const element of Array.from(mermaidElements)) {
          try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const code = element.textContent || "";

            // Store original code before rendering
            if (!element.hasAttribute("data-mermaid-code")) {
              element.setAttribute("data-mermaid-code", code);
            }

            const { svg } = await mermaid.render(id, code);

            // Create a wrapper for the diagram with fullscreen button
            const wrapper = document.createElement("div");
            wrapper.className = "mermaid-wrapper relative group";
            wrapper.innerHTML = svg;

            // Create fullscreen button
            const button = document.createElement("button");
            button.className =
              "absolute top-2 right-2 p-2 rounded-md bg-none  text-muted-foreground hover:text-foreground border border-border z-10 flex items-center justify-center";
            button.setAttribute("aria-label", "View diagram fullscreen");
            button.style.cursor = "pointer";
            button.style.outline = "none";

            // Create Lucide Maximize icon
            const icon = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            icon.setAttribute("class", "w-4 h-4");
            icon.setAttribute("fill", "none");
            icon.setAttribute("stroke", "currentColor");
            icon.setAttribute("viewBox", "0 0 24 24");
            icon.setAttribute("stroke-width", "2");
            icon.setAttribute("stroke-linecap", "round");
            icon.setAttribute("stroke-linejoin", "round");

            const path = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            path.setAttribute(
              "d",
              "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
            );

            icon.appendChild(path);
            button.appendChild(icon);

            button.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              // Generate unique ID for this diagram
              const diagramId = `diagram-${Math.random()
                .toString(36)
                .substr(2, 9)}`;
              // Store the SVG with the ID as key
              sessionStorage.setItem(diagramId, svg);
              // Navigate with the ID in URL so it persists on reload
              router.push(`/diagram/${diagramId}`);
            });

            wrapper.appendChild(button);
            element.parentNode?.replaceChild(wrapper, element);
            element.setAttribute("data-processed", "true");
          } catch (error) {
            console.error("Failed to render mermaid diagram:", error);
            const errorDiv = document.createElement("div");
            errorDiv.innerHTML = `<pre>Error rendering diagram</pre>`;
            element.parentNode?.replaceChild(errorDiv, element);
          }
        }
      } catch (error) {
        console.error("Failed to load mermaid:", error);
      }
    };

    initMermaid();

    // Watch for theme changes
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          // Re-render mermaid diagrams when theme changes
          const mermaidElements = document.querySelectorAll<HTMLElement>(
            ".mermaid[data-processed]"
          );
          mermaidElements.forEach((el) => {
            // Restore original code from stored attribute
            const originalCode = el.getAttribute("data-mermaid-code");
            if (originalCode) {
              el.textContent = originalCode;
            }
            el.removeAttribute("data-processed");
          });
          initMermaid();
        }
      });
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for new mermaid elements being added to the DOM (for client-side navigation)
    const contentObserver = new MutationObserver((mutations) => {
      let hasNewMermaid = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the added node is a mermaid element or contains mermaid elements
            if (
              node.classList.contains("mermaid") ||
              node.querySelector(".mermaid")
            ) {
              hasNewMermaid = true;
            }
          }
        });
      });

      if (hasNewMermaid) {
        // Small delay to ensure DOM is fully updated
        setTimeout(() => initMermaid(), 100);
      }
    });

    // Observe the entire document body for changes
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      themeObserver.disconnect();
      contentObserver.disconnect();
    };
  }, [router]);

  return null;
}
