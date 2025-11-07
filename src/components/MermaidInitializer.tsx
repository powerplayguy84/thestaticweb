"use client";

import { useEffect } from "react";

// Helper function to convert CSS color variables to HEX
const toHex = (color: string) => {
  if (color.startsWith("#")) return color; // Already hex

  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  // This handles rgb(r, g, b) and rgba(r, g, b, a)
  const rgbValues = computedColor.match(/(\d+(\.\d+)?)/g);

  if (rgbValues && rgbValues.length >= 3) {
    return ("#" +
      parseInt(rgbValues[0]).toString(16).padStart(2, "0") +
      parseInt(rgbValues[1]).toString(16).padStart(2, "0") +
      parseInt(rgbValues[2]).toString(16).padStart(2, "0")
    );
  }

  return "#000000"; // Fallback for invalid color
};

export function MermaidInitializer() {
  useEffect(() => {
    const initMermaid = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import("mermaid")).default;
        
        const isDark = document.documentElement.classList.contains("dark");
        
        // Get computed colors from CSS variables and convert to HEX
        const primaryColor = toHex("hsl(var(--primary))");
        
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-geist-sans)",
          themeVariables: {
            primaryColor: primaryColor,
            primaryBorderColor: primaryColor,
            lineColor: isDark ? "#94a3b8" : "#64748b",
            secondBkgColor: isDark ? "#334155" : "#f3f4f6",
            tertiaryColor: isDark ? "#1e293b" : "#fafafa",
            tertiaryTextColor: isDark ? "#e2e8f0" : "#1f2937",
            fontSize: "14px",
            fontFamily: "var(--font-geist-sans)",
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "linear",
            padding: 15,
          },
          sequence: {
            useMaxWidth: true,
            mirrorActors: false,
            messageAlign: "center",
          },
          class: {
            useMaxWidth: true,
            htmlLabels: true,
          },
          gitGraph: {
            useMaxWidth: true,
            mainBranchOrder: 2,
          },
          state: {
            useMaxWidth: true,
          },
        });

        // Find all mermaid elements and render them
        const mermaidElements = document.querySelectorAll<HTMLElement>(".mermaid:not([data-processed])");
        
        for (const element of Array.from(mermaidElements)) {
          try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const code = element.textContent || "";
            
            // Store original code before rendering
            if (!element.hasAttribute("data-mermaid-code")) {
              element.setAttribute("data-mermaid-code", code);
            }
            
            const { svg } = await mermaid.render(id, code);
            element.innerHTML = svg;
            element.setAttribute("data-processed", "true");
          } catch (error) {
            console.error("Failed to render mermaid diagram:", error);
            element.innerHTML = `<pre>Error rendering diagram</pre>`;
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
          const mermaidElements = document.querySelectorAll<HTMLElement>(".mermaid[data-processed]");
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
            if (node.classList.contains("mermaid") || node.querySelector(".mermaid")) {
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

  return null;
}
