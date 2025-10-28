# The Static Web

A **static markdown-based blog** built with Next.js 16, TypeScript, and Tailwind CSS v4. Write articles in markdown with YAML front matter, and the site automatically generates pages with categories, featured articles, navigation, and more.

## ✨ Features

- 📝 **Markdown Content**: Write articles in markdown with YAML front matter
- 🏷️ **Categories**: Organize articles by category with automatic navigation
- ⭐ **Featured Articles**: Mark articles as featured to display on homepage
- 🔗 **Smart Navigation**: Previous/next links and related articles sidebars
- 🎨 **Beautiful UI**: Built with Tailwind CSS v4 for a clean, minimalist design
- ⚡ **Static Generation**: Pre-rendered HTML for fast loading
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🔍 **Type-Safe**: Full TypeScript support with strict mode
- 🚀 **SEO-Friendly**: Proper metadata and structured content

## 🚀 Quick Start

**New to The Static Web?** Check out the [USER_GUIDE.md](./USER_GUIDE.md) for a complete introduction!

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📚 Documentation

We have comprehensive guides to help you get started and master The Static Web:

### Essential Guides

- **[USER_GUIDE.md](./USER_GUIDE.md)** - 📍 START HERE! Complete documentation index
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Step-by-step setup and first article
- **[HOW_TO_WRITE.md](./HOW_TO_WRITE.md)** - Master Markdown and writing great content
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for common tasks

### Advanced Guides

- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customize design, add features, and more
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel, Netlify, or self-host
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions to common issues
- **[FAQ.md](./FAQ.md)** - Frequently asked questions

### Reference

- **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** - Detailed content organization guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture overview
- **[FILE_REFERENCE.md](./FILE_REFERENCE.md)** - Complete file reference

**💡 Tip:** Not sure where to start? Check the [USER_GUIDE.md](./USER_GUIDE.md) for learning paths!

## 📝 Adding Content

Articles live in `content/[category]/[index]-[slug].md`:

```markdown
---
title: "My First Article"
description: "An awesome article"
date: "2025-10-28"
featured: true
tags: ["nextjs", "javascript"]
---

# My First Article

Article content here...
```

**File Structure Example:**

```
content/
├── tutorials/
│   ├── 01-getting-started.md
│   └── 02-routing-basics.md
└── guides/
    ├── 01-setup.md
    └── 02-advanced.md
```

→ See **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** for detailed documentation.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with Navigation
│   ├── page.tsx                      # Homepage
│   ├── [category]/page.tsx           # Category listing
│   ├── [category]/[slug]/page.tsx    # Article detail
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── ArticleCard.tsx
│   ├── ArticleNavigation.tsx
│   └── RelatedArticles.tsx
└── lib/
    └── markdown.ts                   # Content utilities
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4
- **Markdown**: `remark` + `remark-html`
- **Icons**: lucide-react
- **Front Matter**: gray-matter

## 📂 How It Works

1. **Content Discovery**: Reads markdown files from `content/` directory
2. **Front Matter Parsing**: Extracts metadata (title, date, featured, etc.)
3. **HTML Rendering**: Converts markdown to HTML with `remark`
4. **Static Generation**: Pre-renders all pages at build time with `generateStaticParams()`
5. **Navigation**: Automatically builds category menu and article navigation

## 🎯 Homepage

- Hero section with site title
- Grid of featured articles
- Categories in navigation menu

## 📄 Article Features

- **Metadata**: Title, description, date, category, tags
- **Content**: Full HTML-rendered markdown with proper styling
- **Navigation**: Previous/next buttons to adjacent articles
- **Related**: Sidebar with 3 related articles from the same category

## 🔗 Routes

| Route              | Page                                 |
| ------------------ | ------------------------------------ |
| `/`                | Homepage with featured articles      |
| `/:category`       | Category listing (sorted by index)   |
| `/:category/:slug` | Individual article with full content |
| `/404`             | Not found page                       |

## 🎨 Customization

### Add a New Category

```bash
mkdir content/my-category
```

The category automatically appears in the navigation menu.

### Add an Article

```bash
touch content/tutorials/05-my-article.md
```

Edit with front matter and markdown content.

### Modify Styles

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styling: Use Tailwind classes directly

## 📦 Build & Deploy

### Local Build

```bash
npm run build
```

Output is in `.next/` for production server or `out/` for static export.

### Deploy to Vercel (Recommended)

```bash
vercel
```

### Deploy as Static Site

```bash
npm run build
# Copy `out/` directory to your hosting provider
```

## 📚 Documentation

See **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** for:

- Detailed file structure
- Front matter reference
- Utility function documentation
- Deployment instructions
- Troubleshooting guide

## 📋 Example Content Files

Sample articles are included:

- `content/tutorials/01-getting-started.md`
- `content/tutorials/02-routing-basics.md`
- `content/guides/01-tailwind-setup.md`
- `content/guides/02-typescript-best-practices.md`

## 🔧 Development

### Available Commands

```bash
npm run dev      # Start dev server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

### TypeScript

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Full type safety across utilities and components

### Code Quality

- ESLint configured with Next.js rules
- TypeScript strict mode
- Tailwind CSS best practices

## 📝 License

MIT - Feel free to use this template for your own projects!

---

**Happy blogging! 🎉**
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
