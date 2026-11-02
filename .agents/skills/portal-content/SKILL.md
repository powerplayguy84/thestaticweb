---
name: portal-content
description: Creates, formats, humanizes, and validates new articles, carousel sections, categories, and front matter for The Static Web portal. Use whenever the user asks to write, generate, or add an article, guide, tutorial, blog post, or category to the portal.
---

# Portal Content Creator Skill

This skill guides authoring, humanizing, and publishing articles, carousels, and categories for **The Static Web** portal.

Always use template files in `content/_templates/` as the baseline:
- `content/_templates/00-article-template.md`: Default single-article and multi-section article template.
- `content/_templates/category-index-template.md`: Category index metadata template.
- `content/_templates/01-README.md`: Directory overview and usage instructions.

When drafting or editing prose, apply `/humanizer` rules: avoid AI tells (staged run-ups like "Let's dive in", not-X-but-Y formulas, forced triads, decorative bold labeling on every line, overused buzzwords, and dramatic one-line closers). Write direct, concrete, natural copy.

---

## 1. Directory & File Naming Conventions

Articles are stored in one of two formats:

### A. Single File Articles
`content/[category]/[number]-[slug].md` (e.g. `content/04-guides/02-deployment-guide.md`).

### B. Multi-Card Carousel Articles (Sub-folder Swiper)
When an article includes an interactive card carousel or multi-part walkthrough, use a dedicated sub-folder with decimal numbering:
```text
content/[category]/[number]-[article-slug]/
├── 01-intro.md               # First main section
├── 02-overview.md            # Second main section
├── 0.3.1-feature-card.md     # Card 1 in Section 3 carousel
├── 0.3.2-feature-card.md     # Card 2 in Section 3 carousel
├── 0.3.3-feature-card.md     # Card 3 in Section 3 carousel
├── 03-section-title.md       # (Optional) Section 3 header/intro
└── 04-summary.md             # Final section
```

* **Category folder:** Two-digit prefix for ordering (e.g., `01-why`, `02-features`, `03-get-started`, `04-guides`), matching clean kebab-case.
* **Slug:** Lowercase kebab-case, letters, numbers, and hyphens only.

### ⚠️ Sequential Numbering Rule
Before creating ANY article:
1. List existing files in `content/<category>/`.
2. Identify the highest prefix number used (e.g. `02-some-topic.md` -> highest is 2).
3. Increment by 1 for the new article (`03-new-topic.md` or `03-new-topic/`).
4. **Never duplicate numbers** within the same category.
5. If the category is brand new, create `content/<category>/` and start with `01-<slug>.md`.

---

## 2. Front Matter Schema

Every article must start with YAML front matter enclosed in `---`:

```yaml
---
title: "Clear, Punchy Title"
description: "SEO-friendly description between 120 and 160 characters."
date: "DD-MM-YYYY" # Must be DD-MM-YYYY format (e.g. 02-11-2026)
featured: false # Set to true to highlight on the portal homepage
tags: ["tag1", "tag2", "tag3"]
image: "https://images.unsplash.com/..." # Hero thumbnail URL or /public image path
---
```

### Critical Rules
- **Date format:** Always use `DD-MM-YYYY` format (e.g. `02-11-2026`), never `YYYY-MM-DD`.
- **No Duplicate H1 Title:** Do NOT begin markdown body with `# Article Title` if it duplicates the front matter `title`. The portal UI automatically renders the title from front matter.
- **Description:** Provide a crisp summary (120–160 chars).
- **Tags:** 2 to 4 concise lowercase tags for cross-linking.

---

## 3. Carousel Content Format (Interactive Swiper)

The portal compiler groups files matching `0.X.Y-*.md` (or `X.Y-*.md`) into touch-friendly swipeable cards under major section `X`.

### Standard Carousel Card (Content + Modal)
```yaml
---
title: "Zero Database Overhead"
subtitle: "Architecture"
description: "Eliminates SQL connections and migration locks entirely."
badge: "Pillar 1"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
---

Detailed card body displayed inside the expansion dialog when clicked.

- Task-focused layouts
- Fast validation
- Concrete metrics
```

### Image-Only Lightbox Carousel Card
If a card contains only an `image` in front matter with no title or body, the reader renders it as an edge-to-edge image card with instant full-screen lightbox zoom:
```yaml
---
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
---
```

---

## 4. Article Body Structure & Tone

Apply `/humanizer` standards across all markdown copy:
- **No staged run-ups:** Drop "Let's dive in", "Here is what you need to know", or "In today's fast-paced world".
- **No artificial contrasts:** Avoid "It is not just X, it is Y". State the fact directly.
- **No forced triads:** Only list three items when there are genuinely three items.
- **No em dash overload:** Use periods, commas, or colons instead of dashes as connectors.
- **No bold labels on every line:** Write natural prose instead of bolding every bullet item prefix.

```markdown
> Optional: Standout callout or executive summary hook.

Brief context explaining the problem and what the reader will accomplish.

## First Step or Core Concept

Clear explanation with code or diagram.

\`\`\`typescript
function configureCache(): void {
  console.log("Clean implementation");
}
\`\`\`

## Flow Diagram

\`\`\`mermaid
flowchart TD
  A[Markdown File] --> B[Static Compiler]
  B --> C[Edge CDN]
\`\`\`

## Practical Takeaways

Direct summary recapping key points.
```

---

## 5. Homepage & Category Link Integrity

When linking to categories or articles in `content/homepage.md`:
* **Never include the numeric prefix in category URLs:**
  * Folder: `content/02-features/`
  * Link route: `/features` (NOT `/02-features` or `/features/index`)
* **Article URLs:**
  * File: `content/02-features/01-core-capabilities.md`
  * Link route: `/features/core-capabilities`

---

## 6. Pre-Publish Validation Checklist

Before finishing:
- [ ] Checked `content/_templates/00-article-template.md` for reference schema.
- [ ] Category folder verified or created.
- [ ] Number prefix is strictly +1 of the highest existing file in that folder.
- [ ] Front matter has required fields: `title`, `description`, `date` (`DD-MM-YYYY`), `featured`, `tags`, `image`.
- [ ] Markdown body does not duplicate the `# Title` heading.
- [ ] Carousel items follow the `0.X.Y-slug.md` structure when creating swipeable decks.
- [ ] Copy reviewed with `/humanizer` (no fluff, no staged openers, direct natural voice).
- [ ] Code blocks specify language identifiers (`ts`, `tsx`, `bash`, `json`, `mermaid`).
- [ ] All internal links follow clean slug paths without numeric prefixes.
