"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import panzoom from "panzoom";

export function MermaidInitializer() {
  const [fullscreenDiagram, setFullscreenDiagram] = useState<string | null>(
    null
  );
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const panzoomInstanceRef = useRef<ReturnType<typeof panzoom> | null>(null);

  // Initialize panzoom when diagram is opened
  useEffect(() => {
    if (fullscreenDiagram && diagramContainerRef.current) {
      // Clean up previous instance
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose();
      }

      // Wait for SVG to render in DOM
      setTimeout(() => {
        const svgElement = diagramContainerRef.current?.querySelector("svg");
        if (svgElement && diagramContainerRef.current) {
          // Set SVG to have proper dimensions
          svgElement.style.width = "100%";
          svgElement.style.height = "100%";
          svgElement.style.display = "block";

          panzoomInstanceRef.current = panzoom(svgElement, {
            maxZoom: 10,
            minZoom: 0.5,
            smoothScroll: false,
            zoomDoubleClickSpeed: 1.5,
          });
        }
      }, 0);
    }

    return () => {
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose();
        panzoomInstanceRef.current = null;
      }
    };
  }, [fullscreenDiagram]);

  // Close modal handler
  const handleCloseModal = () => {
    setFullscreenDiagram(null);
  };

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
              "absolute top-2 right-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center";
            button.setAttribute("aria-label", "View diagram fullscreen");
            button.innerHTML =
              '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6v4m12 0h4v-4m0 12h-4v4m-12-4H6v4"></path></svg>';
            button.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              setFullscreenDiagram(svg);
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
  }, []);

  return (
    <>
      {/* Fullscreen Modal for Mermaid Diagrams */}
      {fullscreenDiagram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full h-full max-h-screen bg-white dark:bg-slate-950 rounded-lg shadow-xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="sticky top-4 right-4 z-10 float-right p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Diagram Container - With panzoom for zoom, pan, pinch */}
            <div
              ref={diagramContainerRef}
              className="w-full h-full flex items-center justify-center p-8 select-none bg-gray-50 dark:bg-slate-900"
              style={{ overflow: "hidden" }}
              dangerouslySetInnerHTML={{ __html: fullscreenDiagram }}
            />
          </div>
        </div>
      )}
    </>
  );
}
