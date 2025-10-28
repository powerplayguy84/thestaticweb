# File Reference

## Complete File Listing

### 📁 Content Files (Markdown Articles)

```
content/
├── tutorials/
│   ├── 01-getting-started.md
│   ├── 02-routing-basics.md
│   └── [add more here]
├── guides/
│   ├── 01-tailwind-setup.md
│   ├── 02-typescript-best-practices.md
│   └── [add more here]
└── [add new categories here]
```

### 📁 Source Code (src/)

```
src/
├── app/
│   ├── layout.tsx                      # Root layout (imports Navigation)
│   ├── page.tsx                        # Homepage (featured articles)
│   ├── globals.css                     # Global Tailwind styles
│   ├── not-found.tsx                   # 404 page
│   ├── [category]/
│   │   ├── page.tsx                    # Category listing
│   │   └── [slug]/
│   │       └── page.tsx                # Article detail
│   └── (implicit routing from Next.js)
│
├── components/
│   ├── Navigation.tsx                  # Top nav + category menu
│   ├── ArticleCard.tsx                 # Article preview card
│   ├── ArticleNavigation.tsx           # Prev/next buttons
│   └── RelatedArticles.tsx             # Related articles sidebar
│
└── lib/
    └── markdown.ts                     # Content utilities & parsing
```

### 📁 Config Files

```
Root/
├── next.config.ts                      # Next.js configuration
├── tsconfig.json                       # TypeScript config (strict: true)
├── postcss.config.mjs                  # PostCSS + Tailwind
├── tailwind.config.ts                  # Tailwind CSS config
├── eslint.config.mjs                   # ESLint rules
└── package.json                        # Dependencies & scripts
```

### 📁 Documentation

```
Root/
├── README.md                           # Main readme (overview & quick start)
├── QUICK_START.md                      # Quick reference (common tasks)
├── CONTENT_GUIDE.md                    # Detailed docs (content management)
├── ARCHITECTURE.md                     # System design & data flow
└── FILE_REFERENCE.md                   # This file
```

---

## Key Files Deep Dive

### `src/lib/markdown.ts` (Content Engine)

**Purpose**: Read, parse, and serve markdown articles with YAML front matter

**Key Exports**:

```typescript
getCategories()                                 → string[]
getArticlesByCategory(category)                 → ArticleMetadata[]
getArticle(category, slug)                      → Article | null
getAdjacentArticles(category, index)            → { previous?, next? }
getFeaturedArticles()                           → ArticleMetadata[]
getAllArticles()                                → ArticleMetadata[]
```

**How It Works**:

1. Scans `content/` directory structure
2. Parses YAML front matter with `gray-matter`
3. Converts markdown to HTML with `remark` + `remark-html`
4. Returns typed objects with metadata

---

### `src/app/page.tsx` (Homepage)

**Purpose**: Display featured articles and site intro

**Renders**:

- Hero section (title + description)
- Featured articles grid (2 columns on desktop, 1 on mobile)

**Data Sources**:

- `getFeaturedArticles()` from markdown utility

**Route**: `/`

---

### `src/app/[category]/page.tsx` (Category Page)

**Purpose**: List all articles in a category

**Renders**:

- Category title
- All articles as `ArticleCard` components (sorted by index)

**Data Sources**:

- `getArticlesByCategory(category)` from markdown utility
- `generateStaticParams()` pre-generates routes at build time

**Route**: `/:category` (e.g., `/tutorials`, `/guides`)

**Special Features**:

- `generateStaticParams()` - Pre-generates all category pages
- `generateMetadata()` - Sets page title for SEO

---

### `src/app/[category]/[slug]/page.tsx` (Article Page)

**Purpose**: Display full article with navigation and related content

**Renders**:

- Article header (title, date, category, tags)
- Full HTML content (with Tailwind prose styling)
- Previous/next article buttons
- Related articles sidebar

**Data Sources**:

- `getArticle(category, slug)` - Main article content
- `getAdjacentArticles()` - Previous/next links
- `getArticlesByCategory()` - Related articles

**Route**: `/:category/:slug` (e.g., `/tutorials/getting-started`)

**Special Features**:

- `generateStaticParams()` - Pre-generates all article pages
- `dangerouslySetInnerHTML` - Renders HTML from markdown
- Prose styling with Tailwind utility classes

---

### Component Architecture

#### `Navigation.tsx` (Server Component)

- Reads categories at render time
- Creates navigation links for each category
- Imported in root layout

#### `ArticleCard.tsx` (Server Component)

- Displays article preview
- Title, description, date, tags, link
- Used on homepage and category pages

#### `ArticleNavigation.tsx` (Server Component)

- Shows previous/next article buttons
- Only renders if articles exist
- Used on article detail page

#### `RelatedArticles.tsx` (Server Component)

- Shows 3 related articles from same category
- Links to related articles
- Used on article detail page

---

## Front Matter Schema

```yaml
---
title: string # Required: Article title
description: string # Required: SEO description (used in cards)
date: "YYYY-MM-DD" # Required: Publication date
featured: boolean # Optional: Show on homepage (default: false)
tags: string[] # Optional: Array of tag strings
---
```

**Example**:

```yaml
---
title: "Getting Started with Next.js"
description: "Learn the basics of Next.js and build your first app"
date: "2025-10-20"
featured: true
tags: ["nextjs", "javascript", "beginner"]
---
```

---

## Route Generation Examples

### Article File → URL

| File Path                         | Output               | Details                 |
| --------------------------------- | -------------------- | ----------------------- |
| `content/tutorials/01-intro.md`   | `/tutorials/intro`   | Index 01, sorted first  |
| `content/tutorials/02-routing.md` | `/tutorials/routing` | Index 02, sorted second |
| `content/guides/05-setup.md`      | `/guides/setup`      | Index 05, sorted fifth  |
| `content/blog/10-news.md`         | `/blog/news`         | Index 10, sorted tenth  |

### Static Routes

| Route           | Page      | Generator                                |
| --------------- | --------- | ---------------------------------------- |
| `/`             | Homepage  | Static (app/page.tsx)                    |
| `/404`          | Not found | Static (app/not-found.tsx)               |
| `/tutorials`    | Category  | Dynamic (app/[category]/page.tsx)        |
| `/guides/intro` | Article   | Dynamic (app/[category]/[slug]/page.tsx) |

---

## Type Definitions

### `Article` (Full article with content)

```typescript
{
  slug: string                  // "getting-started"
  category: string              // "tutorials"
  index: number                 // 1
  title: string                 // "Getting Started"
  description: string           // "Learn basics..."
  date: string                  // "2025-10-20"
  featured: boolean             // true
  tags?: string[]               // ["nextjs", "js"]
  content: string               // HTML rendered from markdown
}
```

### `ArticleMetadata` (Article without HTML content)

```typescript
{
  slug: string
  category: string
  index: number
  title: string
  description: string
  date: string
  featured: boolean
  tags?: string[]
}
```

---

## Dependency Graph

```
app/page.tsx
└── getFeaturedArticles()
    ├── getAllArticles()
    │   └── getArticlesByCategory() × all categories
    │       └── parseMarkdownFile()
    │           ├── gray-matter (YAML parsing)
    │           └── remark + remark-html (MD→HTML)
    └── filter featured: true
    └── sort by date

app/[category]/page.tsx
├── getCategories()
│   └── fs.readdirSync(content/)
└── getArticlesByCategory()
    └── [same as above]

app/[category]/[slug]/page.tsx
├── getArticle()
│   └── parseMarkdownFile()
├── getAdjacentArticles()
│   └── getArticlesByCategory()
└── getArticlesByCategory()
    └── for sidebar

Navigation.tsx
└── getCategories()
    └── fs.readdirSync(content/)
```

---

## Build Process

1. **generateStaticParams()** runs for:

   - All categories in `app/[category]/page.tsx`
   - All articles in `app/[category]/[slug]/page.tsx`

2. **For each route**, Next.js:

   - Calls the page component
   - Which calls utility functions from `markdown.ts`
   - Which read and parse markdown files
   - Result is cached as static HTML

3. **Output**:
   - `.next/` for production server
   - `out/` for static export
   - Pre-rendered HTML for all routes

---

## Import Paths (via `@/` alias)

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage Examples**:

```typescript
import { getFeaturedArticles } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
import Navigation from "@/components/Navigation";
```

---

## File Naming Conventions

| Type             | Pattern               | Example            |
| ---------------- | --------------------- | ------------------ |
| Components       | PascalCase            | `ArticleCard.tsx`  |
| Utilities        | camelCase             | `markdown.ts`      |
| Pages            | lowercase             | `page.tsx`         |
| Dynamic segments | `[bracket]`           | `[category]`       |
| Content          | kebab-case with index | `01-my-article.md` |

---

## Quick File Locations

**Need to...**

Add a component → `src/components/`
Add utilities → `src/lib/`
Add/edit pages → `src/app/`
Add article → `content/[category]/`
Edit styles → `src/app/globals.css`
Configure → `tsconfig.json`, `next.config.ts`, etc.

---

## File Sizes (Approximate)

```
markdown.ts               ~500 lines
Navigation.tsx           ~30 lines
ArticleCard.tsx          ~50 lines
ArticleNavigation.tsx    ~40 lines
RelatedArticles.tsx      ~40 lines
page.tsx (home)          ~40 lines
page.tsx (category)      ~40 lines
page.tsx (article)       ~110 lines
layout.tsx               ~35 lines
not-found.tsx            ~20 lines

Sample articles           ~200 lines total
```

---

## Next Steps

1. **Read**: `QUICK_START.md` for common tasks
2. **Learn**: `CONTENT_GUIDE.md` for detailed info
3. **Understand**: `ARCHITECTURE.md` for system design
4. **Create**: Add your own articles in `content/`
5. **Deploy**: Use Vercel or static hosting

**Happy building!** 🚀
