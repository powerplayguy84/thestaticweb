# Category Ordering Guide

This guide explains how to control the order of categories in navigation menus and how to customize category metadata.

## Overview

Categories can now be ordered using numeric prefixes in the folder name, similar to how articles work. Additionally, each category can have an optional `index.md` file to define custom titles and descriptions.

## Folder Naming Convention

Category folders should be named with a numeric prefix followed by a dash and the category slug:

```
content/
  01-guides/
  02-tutorials/
  03-sample/
## Category Ordering

Categories are ordered by their folder name prefix (e.g., `01-guides`, `02-tutorials`). The numeric prefix determines the order in navigation and menus. To reorder, rename folders with the desired number.

Example:
- **Category Slug**: The part after the dash becomes the URL slug (e.g., `/guides`, `/tutorials`)
```

### Examples

```

```

02-tutorials/ → /tutorials (displays second)
Optional: Add an `index.md` file in each category folder for custom title and description.
99-miscellaneous/ → /miscellaneous (displays last)

## Hidden Categories

To hide categories from navigation, add the category folder name (not the index) to the `hiddenCategories` list in `content/settings.md`.

Example:

```yaml
hiddenCategories:
  - "sample"
  - "_templates"
```

Do not include the numeric index in `hiddenCategories`—just use the folder name.
description: Comprehensive guides for web development best practices and setup

---

```

### Frontmatter Fields

- **`title`** (string, optional): Custom display name for the category

  - Used in navigation menus, page headers, and metadata
  - If not provided, the category slug will be formatted automatically (e.g., `getting-started` → `Getting Started`)

- **`description`** (string, optional): Brief description of the category
  - Displayed on the category page below the title
  - Used in meta tags for SEO

### When to Use index.md

Use `index.md` when you want to:

- Provide a custom title that differs from the folder name
- Add a description that appears on the category listing page
- Improve SEO with targeted metadata

## Complete Example

### Folder Structure

```

content/
01-guides/
index.md
01-tailwind-setup.md
02-typescript-best-practices.md
02-tutorials/
index.md
01-getting-started.md
02-routing-basics.md
03-sample/
index.md
01-markdown-showcase.md

````

### Category index.md Examples

**content/01-guides/index.md:**

```markdown
---
title: Guides
description: Comprehensive guides for web development best practices and setup
---
````

**content/02-tutorials/index.md:**

```markdown
---
title: Tutorials
description: Step-by-step tutorials to help you learn and build
---
```

**content/03-sample/index.md:**

```markdown
---
title: Sample Content
description: Example articles demonstrating markdown features and capabilities
---
```

## Migration from Existing Categories

If you have existing categories without numeric prefixes, follow these steps:

1. **Rename folders** to add numeric prefixes:

   ```bash
   mv content/guides content/01-guides
   mv content/tutorials content/02-tutorials
   ```

2. **Create index.md files** (optional but recommended):

   ```bash
   # Create index.md for each category
   touch content/01-guides/index.md
   touch content/02-tutorials/index.md
   ```

3. **Add metadata** to each index.md file using the template in `content/_templates/category-index-template.md`

## Important Notes

- **index.md is excluded** from article listings - it won't appear as an article
- **Folders without prefixes** get an index of `999` and appear last, sorted alphabetically
- **Hidden categories** can still be configured in `content/settings.md` using the `hiddenCategories` array
- **URLs remain clean** - the numeric prefix is only used for ordering, not in the URL path

## Template File

A template for creating category index.md files is available at:
`content/_templates/category-index-template.md`

## How Ordering Works

1. Categories are sorted primarily by their numeric index (lowest first)
2. If two categories have the same index, they're sorted alphabetically by slug
3. Categories without numeric prefixes default to index `999`

This ensures predictable, controllable ordering while maintaining clean URLs.
