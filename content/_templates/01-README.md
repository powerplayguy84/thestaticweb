# Content Templates

This directory contains templates and reference files for creating content across The Static Web.

## Available Templates

### 1. `00-article-template.md`
Standard template for single-file articles and multi-section guides. Includes:
- Complete YAML front matter (`title`, `description`, `date: DD-MM-YYYY`, `featured`, `tags`, `image`)
- Heading hierarchy without redundant H1 tags
- Code block examples with language specifiers
- Mermaid diagram examples
- Multi-card swipeable carousel examples (`0.X.Y-card.md`)

### 2. `category-index-template.md`
Template for category folder `index.md` files:
- Custom display title and description
- Folder numbering ordering guidelines (`01-why`, `02-features`, etc.)

---

## Interactive Carousel & Multi-Card Swiper Structure

The Static Web compiles sub-folders with decimal-numbered files into interactive card carousels.

```text
content/04-guides/03-sample-guide/
├── 01-overview.md
├── 02-architecture.md
├── 03-features.md            # Main section 3 header
├── 0.3.1-card-one.md         # Carousel slide 1
├── 0.3.2-card-two.md         # Carousel slide 2
├── 0.3.3-card-three.md       # Carousel slide 3 (or image-only slide)
└── 04-conclusion.md
```

### Standard Carousel Card (`0.3.1-card-one.md`)
```markdown
---
title: "Fast Asset Delivery"
subtitle: "Performance"
description: "Pre-compiled static files served directly from edge nodes."
badge: "Pillar 1"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
---

Detailed content displayed in the pop-up modal when the card is clicked.

- Automatic code splitting
- Edge caching by default
- Sub-100ms response targets
```

### Image-Only Lightbox Slide (`0.3.3-card-three.md`)
```markdown
---
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
---
```
When clicked, image-only cards open immediately in an edge-to-edge lightbox.

---

## Writing Standards (`/humanizer`)

All prose should read naturally and plainly:
1. Avoid staged run-ups like "Let's dive in" or "Here is what you need to know".
2. Avoid artificial contrasts ("not X, but Y").
3. Avoid overused marketing jargon (tapestry, delve, vibrant, pivotal).
4. Keep punctuation clean: avoid excessive em dashes (—).
5. State facts and instructions directly.

---

## Using Templates

### Copying a Template

```bash
# Standard article
cp content/_templates/00-article-template.md content/04-guides/03-caching-strategy.md

# Category index
cp content/_templates/category-index-template.md content/05-tutorials/index.md
```

### Prompting AI Agents
```text
Use content/_templates/00-article-template.md and /humanizer to create a new guide in content/04-guides/.
```
