# Quick Reference

## Adding an Article (Most Common Task)

### Step 1: Create the file

```bash
touch content/category-name/XX-article-slug.md
```

Example:

```bash
touch content/tutorials/03-api-routes.md
```

### Step 2: Add front matter and content

```markdown
---
title: "API Routes in Next.js"
description: "Learn how to create API endpoints in Next.js"
date: "2025-10-28"
featured: false
tags: ["nextjs", "api"]
---

# API Routes in Next.js

Your content here...

## Section

More content...
```

### Step 3: Test locally

```bash
npm run dev
# Visit http://localhost:3000/tutorials/api-routes
```

### Step 4: Deploy

```bash
git add .
git commit -m "Add API routes article"
git push
# Vercel deploys automatically
```

---

## File Naming Rules

| Rule            | Example             | Result                             |
| --------------- | ------------------- | ---------------------------------- |
| Two-digit index | `01-`, `02-`, `10-` | Determines sort order              |
| kebab-case slug | `my-article`        | URL becomes `/category/my-article` |
| .md extension   | `.md`               | Must be markdown                   |

**Full example**: `03-advanced-typescript.md` → `/guides/advanced-typescript` (3rd in sort order)

---

## Front Matter Fields

```yaml
---
title: "Required: Article title"
description: "Required: Short description (used in cards and SEO)"
date: "Required: YYYY-MM-DD format"
featured: false # Optional: show on homepage (default: false)
tags: [] # Optional: array of tags
---
```

---

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint

# Create new category
mkdir content/category-name
```

---

## URL Patterns

Files → URLs:

```
content/tutorials/01-intro.md          → /tutorials/intro
content/guides/02-setup.md             → /guides/setup
content/beginner/10-hello-world.md     → /beginner/hello-world
```

---

## Navigation Structure

```
Homepage (/)
├── Menu with categories
│   ├── Tutorials
│   ├── Guides
│   └── Beginner
└── Featured articles grid

Category page (/tutorials)
├── All articles in category
└── Sorted by index number

Article page (/tutorials/intro)
├── Full content
├── Previous/Next buttons
└── Related articles sidebar
```

---

## Markdown Features Supported

```markdown
# Headings

**Bold** and _italic_

> Blockquotes

- Lists
- Items

1. Numbered
2. Lists

[Links](https://example.com)

![Images](https://example.com/image.jpg)

`Inline code`

\`\`\`javascript
// Code blocks with syntax highlighting
const hello = "world";
\`\`\`
```

---

## Troubleshooting

| Problem                   | Solution                                                     |
| ------------------------- | ------------------------------------------------------------ |
| Article not appearing     | Check: file in correct dir, YAML valid, index prefix present |
| Category not in menu      | Create dir: `mkdir content/category`                         |
| Styling looks wrong       | Rebuild: `npm run build` then `npm start`                    |
| Old content still showing | Clear cache: `rm -rf .next` then rebuild                     |

---

## File Structure Reference

```
content/              ← All articles here
├── tutorials/        ← Categories (auto-detected)
│   ├── 01-*.md
│   └── 02-*.md
└── guides/
    ├── 01-*.md
    └── 02-*.md

src/
├── app/              ← Pages and layouts
├── components/       ← Reusable UI components
├── lib/              ← markdown.ts (utilities)
└── app/globals.css   ← Global styles
```

---

## Key File Functions

- `src/lib/markdown.ts` - Reads and parses all markdown files
- `src/app/page.tsx` - Homepage with featured articles
- `src/app/[category]/page.tsx` - Category listing
- `src/app/[category]/[slug]/page.tsx` - Article detail
- `src/components/` - Reusable UI components

---

## Deploy to Vercel

```bash
# Login to Vercel
npm install -g vercel
vercel login

# Deploy
vercel
```

Every push to main automatically deploys!

---

**For detailed info, see CONTENT_GUIDE.md**
