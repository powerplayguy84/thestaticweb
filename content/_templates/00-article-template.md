---
title: "Article Title (Max 60 Characters)"
description: "A clear description between 120 and 160 characters for search results and previews."
date: "02-11-2026" # Format: DD-MM-YYYY
featured: false # Set to true to highlight on the homepage
tags: ["example", "guide", "performance"] # 2-4 lowercase tags
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80"
---

> An optional brief callout or executive summary.

Explain the problem directly in the opening paragraph. State what the reader will learn or build without staged run-ups. Note: do not add a `# Title` header at the top of the body, as the portal renders the title automatically from front matter.

## Core Concepts

Break complex ideas into direct explanations. Pair explanations with concrete snippets.

### Code Example

```typescript
interface CacheOptions {
  ttlSeconds: number;
  staleWhileRevalidate: boolean;
}

export function createEdgeCache(options: CacheOptions) {
  return {
    headers: {
      "Cache-Control": `public, s-maxage=${options.ttlSeconds}`,
    },
  };
}
```

## Architecture and Flow Diagrams

Use Mermaid code fences for flowcharts, sequences, or architecture maps:

```mermaid
flowchart LR
    A[Markdown Source] --> B[Static Compiler]
    B --> C[Edge Assets]
    C --> D[Browser]
```

## Creating Interactive Swiper Carousels

The Static Web converts sub-folders with decimal numbers into interactive swipeable card carousels.

To add a carousel, create a folder for the article instead of a single file:

```text
content/04-guides/03-sample-article/
├── 01-intro.md
├── 02-overview.md
├── 03-features.md            # Section 3 text
├── 0.3.1-card-one.md         # Carousel card 1 under section 3
├── 0.3.2-card-two.md         # Carousel card 2 under section 3
├── 0.3.3-gallery.md          # Optional image-only card
└── 04-summary.md
```

### Carousel Card Example (`0.3.1-card-one.md`)

```markdown
---
title: "Edge Delivery"
subtitle: "Network Layer"
description: "Static pages served worldwide in under 100 milliseconds."
badge: "Speed"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
---

Body content displayed inside the modal dialog when readers click this card.

- Pre-rendered HTML
- Zero database queries at runtime
- Brotli compressed assets
```

### Image-Only Lightbox Card Example (`0.3.3-gallery.md`)

```markdown
---
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
---
```

When an entry contains only an image in front matter, the carousel renders it as a full-bleed visual card with click-to-zoom lightbox behavior.

## Summary

Recap the primary findings or next steps in plain language without repetitive conclusion formulas.
