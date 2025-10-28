# Architecture & Data Flow

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js Server                         │
│                                                         │
│  ┌─ Homepage (/)                                       │
│  ├─ Category (/[category])                             │
│  └─ Article (/[category]/[slug])                       │
│                                                         │
│  All pages are pre-rendered as static HTML ⚡          │
└────────────────┬────────────────────────────────────────┘
                 │ Reads at build time
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Content Directory                          │
│                                                         │
│  content/                                              │
│  ├── tutorials/                                        │
│  │   ├── 01-getting-started.md                        │
│  │   └── 02-routing-basics.md                         │
│  └── guides/                                           │
│      ├── 01-tailwind-setup.md                         │
│      └── 02-typescript-best-practices.md              │
└─────────────────────────────────────────────────────────┘
```

## Build-Time Data Flow

```
markdown files
    ↓
[gray-matter parser]  ← Extracts YAML front matter
    ↓
{metadata, content}
    ↓
[remark processor]    ← Converts MD to HTML
    ↓
{metadata, html}
    ↓
[generateStaticParams]  ← Creates routes
    ↓
static HTML files (.next/ or out/)
    ↓
deployed to Vercel/server
```

## File Reading Process

```
src/lib/markdown.ts (Content Utilities)
├── getCategories()
│   └── Scans content/ directories
│
├── getArticlesByCategory(category)
│   ├── Reads all .md files in category
│   ├── Parses front matter → metadata
│   └── Returns sorted by index
│
├── getArticle(category, slug)
│   ├── Finds specific .md file
│   ├── Parses YAML front matter
│   ├── Converts markdown → HTML
│   └── Returns full article
│
└── getFeaturedArticles()
    ├── Calls getArticlesByCategory() for all categories
    ├── Filters featured: true
    └── Returns sorted by date (newest first)
```

## Page Generation

### Homepage (/)

```
User visits /
    ↓
Next.js renders app/page.tsx
    ↓
[import getFeaturedArticles]
    ↓
[scan content/, parse YAML]
    ↓
featured articles array
    ↓
[render ArticleCard components]
    ↓
static HTML sent to browser
```

### Category Page (/tutorials)

```
User visits /[category]
    ↓
[generateStaticParams] runs at build time
    ↓
creates params for: /tutorials, /guides, etc.
    ↓
[getArticlesByCategory(category)]
    ↓
reads content/tutorials/*.md
    ↓
parses YAML → metadata
    ↓
sorts by index number
    ↓
renders ArticleCard for each
    ↓
static HTML cached
```

### Article Page (/tutorials/getting-started)

```
User visits /[category]/[slug]
    ↓
[generateStaticParams] at build time
    ↓
creates params for each article
    ↓
[getArticle(category, slug)]
    ↓
finds content/tutorials/01-getting-started.md
    ↓
parses YAML front matter
    ↓
converts markdown → HTML (remark)
    ↓
[getAdjacentArticles]
    ↓
gets previous & next in category
    ↓
[getArticlesByCategory] for sidebar
    ↓
renders full article with:
  ├── Title, description, date, tags
  ├── HTML content (styled with Tailwind prose)
  ├── Previous/Next navigation
  └── Related articles sidebar
    ↓
static HTML cached
```

## Component Hierarchy

```
RootLayout (layout.tsx)
├── Navigation (server component)
│   └── Category links (from getCategories)
└── Main Content
    ├── HomePage (page.tsx)
    │   └── ArticleCard × N (featured)
    │
    ├── CategoryPage ([category]/page.tsx)
    │   └── ArticleCard × N (all in category)
    │
    └── ArticlePage ([category]/[slug]/page.tsx)
        ├── Article header (title, date, tags)
        ├── Prose HTML (dangerouslySetInnerHTML)
        ├── ArticleNavigation (prev/next)
        └── RelatedArticles (sidebar)
```

## Type Flow

```
Article (full article with HTML)
├── slug: string
├── category: string
├── index: number
├── title: string
├── description: string
├── date: string
├── featured: boolean
├── tags?: string[]
└── content: string (HTML)

ArticleMetadata (article without content)
├── slug: string
├── category: string
├── index: number
├── title: string
├── description: string
├── date: string
├── featured: boolean
└── tags?: string[]
```

## Data Dependencies

```
Single Article
    ├── getArticle(category, slug)
    │   └── reads: content/[category]/[index]-[slug].md
    │
    ├── getAdjacentArticles(category, index)
    │   └── reads: all files in content/[category]/
    │
    └── getArticlesByCategory(category)
        └── reads: all files in content/[category]/

Featured Articles
    └── getFeaturedArticles()
        └── getArticlesByCategory() for each category
            └── filters: featured === true
            └── sorts: by date (newest first)

Category Listing
    └── getArticlesByCategory(category)
        └── sorts: by index number

Navigation Menu
    └── getCategories()
        └── scans: content/ directories
        └── sorts: alphabetically
```

## Caching Strategy

- **Build Time**: All pages pre-rendered as static HTML
- **Dev Mode**: Pages regenerated on file change (Hot Module Replacement)
- **Production**: Static HTML served directly (no server processing needed)
- **ISR**: Incremental Static Regeneration (if enabled)

## URL Structure

```
Markdown File                 → URL Path
─────────────────────────────────────────
content/tutorials/01-intro.md → /tutorials/intro
content/guides/02-setup.md    → /guides/setup
content/blog/05-article.md    → /blog/article
```

Routing rules:

1. Directory name = category
2. Filename format: `[index]-[slug].md`
3. Index used for sorting
4. Slug used for URL path
