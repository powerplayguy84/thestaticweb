# The Static Web

> **A production-ready starter template for markdown-based websites.** Deploy in minutes, customize with AI assistance, and publish beautiful static content.

## 👋 First Time Here?

**→ Start with [START_HERE.md](./START_HERE.md)** for a 5-minute quick start guide!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/powerplayguy84/thestaticweb)

## 🎯 What is This?

**The Static Web** is a complete starter template for building fast, beautiful, markdown-based websites. Perfect for blogs, documentation sites, knowledge bases, or any content-focused website.

### Why Use This Template?

- 🚀 **Deploy in 5 Minutes**: Clone, customize, deploy—no complex setup
- 🤖 **AI-Friendly**: Optimized for AI tools like GitHub Copilot to generate content
- 📝 **Markdown-First**: Write content in simple markdown files
- ⚡ **Lightning Fast**: Static generation for instant page loads
- 🎨 **Customizable**: Clean, minimal design that's easy to theme
- 🔧 **Modern Stack**: Next.js 16, TypeScript, Tailwind CSS v4

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

### For New Users

**👉 Start here:** [CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md) - The 5 things to customize immediately!

### For AI-Assisted Content Creation

**🤖 Using AI tools?** See [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md) for guides on using Copilot, ChatGPT, or other AI to generate content.

### Installation & Setup

```bash
# 1. Clone or download this template
git clone https://github.com/powerplayguy84/thestaticweb.git my-website
cd my-website

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site!

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

### 🎯 Essential for New Users

- **[STARTER_CHECKLIST.md](./STARTER_CHECKLIST.md)** - 📋 Complete setup checklist
- **[CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md)** - ⚡ Top 5 things to customize first
- **[AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md)** - 🤖 Use AI to generate content
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Step-by-step setup guide

### 📖 Complete Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete documentation index
- **[HOW_TO_WRITE.md](./HOW_TO_WRITE.md)** - Master Markdown and writing content
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Deep customization guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel, Netlify, or self-host
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions to common issues

### 🔍 Reference

- **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** - Content organization reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[FILE_REFERENCE.md](./FILE_REFERENCE.md)** - Complete file reference

## 📝 Adding Content

### Quick Method

Use our content templates for consistency:

```bash
# Copy the article template
cp content/_templates/article-template.md content/tutorials/03-my-new-article.md
```

Edit the front matter and content. See [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md) for AI-assisted workflows.

### Manual Method

Articles live in `content/[category]/[index]-[slug].md`:

```markdown
---
title: "My First Article"
description: "An awesome article"
date: "2025-10-28"
featured: true
tags: ["nextjs", "javascript"]
image: "https://example.com/image.jpg"
---

# My First Article

Article content here...
```

**File Structure Example:**

```
content/
├── _templates/              # ← Templates for new content
│   └── article-template.md
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

**⚠️ Note:** Sample articles are included for demonstration. **Replace these with your own content!**

Current examples:

- `content/tutorials/01-getting-started.md` (EXAMPLE - Replace me!)
- `content/tutorials/02-routing-basics.md` (EXAMPLE - Replace me!)
- `content/guides/01-tailwind-setup.md` (EXAMPLE - Replace me!)
- `content/guides/02-typescript-best-practices.md` (EXAMPLE - Replace me!)

**To customize:** See [CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md)

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
