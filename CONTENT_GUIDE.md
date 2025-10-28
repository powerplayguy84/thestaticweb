# The Static Web - Documentation

A Next.js-based static markdown blog with categories, featured articles, and navigation. Built with TypeScript, Tailwind CSS v4, and `remark` for markdown parsing.

## 📁 Project Structure

```
thestaticweb/
├── content/                          # Markdown content organized by category
│   ├── tutorials/
│   │   ├── 01-getting-started.md
│   │   └── 02-routing-basics.md
│   └── guides/
│       ├── 01-tailwind-setup.md
│       └── 02-typescript-best-practices.md
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with Navigation
│   │   ├── page.tsx                  # Homepage with featured articles
│   │   ├── [category]/
│   │   │   ├── page.tsx              # Category listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Individual article page
│   │   ├── globals.css               # Global Tailwind styles
│   │   └── not-found.tsx             # 404 page
│   ├── components/
│   │   ├── Navigation.tsx            # Top navigation with categories
│   │   ├── ArticleCard.tsx           # Reusable article card
│   │   ├── ArticleNavigation.tsx     # Previous/next article links
│   │   └── RelatedArticles.tsx       # Related articles sidebar
│   └── lib/
│       └── markdown.ts               # Markdown parsing & content utilities
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📝 How to Add Content

### 1. Create a New Article

Articles are stored in `content/[category]/[index]-[slug].md`

**Example**: `content/tutorials/03-api-routes.md`

### 2. Front Matter Format

Every markdown file must include YAML front matter:

```yaml
---
title: "Your Article Title"
description: "A short description for SEO and previews"
date: "2025-10-28"
featured: true # Shows on homepage (optional, defaults to false)
tags: ["nextjs", "javascript"] # Optional tags for categorization
---
# Your article content here...
```

### 3. File Naming Convention

- **Index number** (2 digits): `01`, `02`, `03`, etc. — determines article order
- **Slug**: kebab-case, matches the URL path
- **Extension**: Always `.md`

**Examples**:

- `01-getting-started.md` → `/tutorials/getting-started`
- `05-advanced-patterns.md` → `/guides/advanced-patterns`

### 4. Create a New Category

Simply create a new directory in `content/`:

```bash
mkdir content/my-category
```

The category name is automatically added to the navigation menu.

## 🎯 Features

### Homepage (`/`)

- Hero section with site title and description
- Grid of featured articles (6 max)
- Navigation menu with all categories

### Category Page (`/[category]`)

- List of all articles in the category
- Sorted by index number (ascending)
- Each article shows title, description, date, and tags

### Article Page (`/[category]/[slug]`)

- Full article with rendered HTML
- Article metadata (date, category, tags)
- Previous/next navigation buttons
- "More in [category]" sidebar with related articles

### Components

#### `Navigation.tsx`

- Top navigation bar with site branding
- Dynamic category menu from file system
- Server component for optimal performance

#### `ArticleCard.tsx`

- Reusable card for article previews
- Shows title, description, date, and tags
- Link to full article

#### `ArticleNavigation.tsx`

- Previous/next article buttons
- Only shows available links
- Displays article titles for context

#### `RelatedArticles.tsx`

- Sidebar with up to 3 related articles in the same category
- Hidden if fewer than 2 other articles exist

## 🛠️ Utilities

### `lib/markdown.ts`

Key functions:

- **`getCategories()`** - Returns sorted list of all categories
- **`getArticlesByCategory(category)`** - Gets all articles in a category, sorted by index
- **`getArticle(category, slug)`** - Fetches a specific article with parsed HTML
- **`getFeaturedArticles()`** - Gets featured articles (sorted by date, limited to 6)
- **`getAdjacentArticles(category, index)`** - Gets previous and next articles
- **`getAllArticles()`** - Gets all articles across all categories

## 🎨 Styling

- **Framework**: Tailwind CSS v4
- **Typography**: Uses Tailwind's prose utilities for article content
- **Design**: Clean, minimalist interface with semantic colors
- **Responsive**: Mobile-first design with `sm:`, `md:`, `lg:` breakpoints

## 🔧 Configuration

### TypeScript

- Strict mode enabled for type safety
- Path alias `@/*` maps to `src/*`

### Next.js

- App Router (not Pages Router)
- Static site generation with `generateStaticParams()`
- Automatic ISR (Incremental Static Regeneration) for dynamic routes

### Tailwind CSS v4

- PostCSS plugin configured in `postcss.config.mjs`
- Global styles in `src/app/globals.css`
- Custom fonts (Geist Sans and Mono) via Google Fonts

## 📦 Dependencies

- **next** (16.0.0) - React framework
- **react** (19.2.0) - UI library
- **typescript** (5) - Type safety
- **@tailwindcss/postcss** (4) - Styling
- **gray-matter** (4.0.3) - YAML front matter parsing
- **remark** (15) - Markdown processor
- **remark-html** (16) - Convert Markdown to HTML
- **lucide-react** (0.468) - Icon library

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Static Export

```bash
npm run build
# Output in `out/` directory
```

The site fully pre-renders during build, resulting in static HTML files.

## 📝 Example Article

```markdown
---
title: "Getting Started with Next.js 16"
description: "Learn the basics and new features in Next.js 16"
date: "2025-10-28"
featured: true
tags: ["nextjs", "javascript", "beginner"]
---

# Getting Started with Next.js 16

Next.js 16 introduces...

## Key Features

1. Feature one
2. Feature two

## Installation

\`\`\`bash
npx create-next-app@latest
\`\`\`

See the [docs](https://nextjs.org) for more info.
```

## 🔄 Workflow

1. **Add content**: Create `.md` file in `content/[category]/`
2. **Local testing**: Run `npm run dev`
3. **Verify**: Visit homepage and article pages
4. **Build**: Run `npm run build` to generate static files
5. **Deploy**: Push to Git or upload static output

## 🐛 Troubleshooting

**Article not appearing?**

- Check file is in correct directory
- Verify front matter YAML is valid
- Ensure filename follows convention: `XX-slug.md`

**Navigation not updating?**

- Categories are read at build time
- Rebuild with `npm run build` or restart dev server

**Styles not working?**

- Run `npm install` to ensure Tailwind is installed
- Check `postcss.config.mjs` for correct plugin

## 📄 License

MIT
