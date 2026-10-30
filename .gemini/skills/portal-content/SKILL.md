---
name: portal-content
description: Creates, formats, and validates new articles, categories, and front matter for The Static Web portal. Use whenever the user asks to write, generate, or add an article, guide, tutorial, blog post, or category to the portal.
---

# Portal Content Creator Skill

This skill guides agents in authoring and publishing articles and categories for **The Static Web** portal.

---

## 1. Directory & File Naming Conventions

All articles are stored in `content/[category]/[number]-[slug].md`.

* **Category folder:** Must have a two-digit prefix if ordered (e.g., `01-about-us`, `02-case-studies`, `03-guides`), or match the kebab-case category name.
* **Article file:** `[number]-[slug].md` (e.g., `01-getting-started.md`, `04-performance-optimization.md`).
* **Slug:** Lowercase kebab-case, letters, numbers, and hyphens only (no spaces, no underscores).

### ⚠️ Sequential Numbering Rule
Before creating ANY article:
1. List existing files in `content/<category>/`.
2. Identify the highest prefix number used (e.g. `03-some-topic.md` -> highest is 3).
3. Increment by 1 for the new article (`04-new-topic.md`).
4. **Never duplicate numbers** within the same category.
5. If the category is brand new, create `content/<category>/` and start with `01-<slug>.md`.

---

## 2. Front Matter Schema

Every article must start with YAML front matter enclosed in `---`:

```yaml
---
title: "Clear, Punchy Title"
description: "SEO-friendly description between 120 and 160 characters."
date: "DD-MM-YYYY" # Must be DD-MM-YYYY format (e.g. 30-10-2026)
featured: false # Set to true to highlight on the portal homepage
tags: ["tag1", "tag2", "tag3"]
image: "https://images.unsplash.com/..." # Hero thumbnail URL or /public image path
---
```

### Critical Rules
- **Date format:** Always use `DD-MM-YYYY` format (e.g. `30-10-2026`), never `YYYY-MM-DD`.
- **No Duplicate H1 Title:** Do NOT begin markdown body with `# Article Title` if it duplicates the front matter `title`. The portal UI automatically renders the title from front matter. Begin immediately with an introductory hook or lead paragraph.
- **Description:** Provide a crisp, search-engine-ready summary (120–160 chars).
- **Tags:** 2 to 4 concise lowercase tags for cross-linking.

---

## 3. Article Body Structure

Write content using modern, clean markdown conventions:

```markdown
> Optional: Standout callout or executive summary hook.

Brief context setting up why this topic matters and what the reader will gain.

## Key Concept or First Step

Explanations with practical examples and clean formatting.

### Code / Implementation (if applicable)

\`\`\`typescript
// Code snippet with syntax highlighting
function example(): void {
  console.log("Clean code");
}
\`\`\`

## Mermaid Diagrams (when explaining architecture or flows)

\`\`\`mermaid
flowchart TD
  A[Request] --> B[Middleware]
  B --> C[Static Page]
\`\`\`

## Summary & Next Steps

Actionable conclusion recapping core takeaways.
```

---

## 4. Homepage & Category Link Integrity

When linking to categories or articles in `content/homepage.md`:
* **Never include the numeric prefix in category URLs:**
  * Folder: `content/02-case-studies/`
  * Link route: `/case-studies` (NOT `/02-case-studies` or `/case-studies/index`)
* **Article URLs:**
  * File: `content/02-case-studies/01-fintech-migration.md`
  * Link route: `/case-studies/fintech-migration`

---

## 5. Pre-Publish Validation Checklist

Before finishing, verify:
- [ ] Category folder verified or created.
- [ ] Number prefix is strictly +1 of the highest existing file in that folder.
- [ ] Front matter has all required fields: `title`, `description`, `date` (`DD-MM-YYYY`), `featured`, `tags`, `image`.
- [ ] Markdown body does not duplicate the `# Title` heading.
- [ ] Code blocks specify language identifiers (`ts`, `tsx`, `bash`, `json`, `mermaid`).
- [ ] All internal links follow clean slug paths without numeric prefixes.
