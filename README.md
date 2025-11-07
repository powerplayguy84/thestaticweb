# The Static Web

# 🟢 Essential Steps: First 5 Things To Do

1. **Clone & Install**

- `git clone https://github.com/powerplayguy84/thestaticweb.git my-website`
- `cd my-website && npm install && npm run dev`

2. **Customize Homepage**

- Edit `content/homepage.md` (title, subtitle, description, navbar)

3. **Create Your First Article**

- Copy `content/_templates/article-template.md` to your category folder
- Edit front matter and content

4. **Set Up Categories**

- Create folders in `content/` with numeric prefixes (e.g., `01-guides`)
- Add or reorder by renaming folders

5. **Deploy**

- Run `vercel` or see [DEPLOYMENT.md](./DEPLOYMENT.md) for options

6. **Explore Admin Panel**

- See [ADMIN.md](./ADMIN.md) for admin features and setup

---

# ❓ Common Issues & FAQ

**Q: npm install fails?**
A: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for solutions (clear cache, legacy peer deps, etc).

**Q: My changes don't show up?**
A: Make sure to save files and refresh your browser. For config changes, restart `npm run dev`.

**Q: How do I hide categories?**
A: Add the folder name (not the index) to `hiddenCategories` in `content/settings.md`.

**Q: How do I deploy?**
A: Use Vercel (`vercel` CLI) or see [DEPLOYMENT.md](./DEPLOYMENT.md) for Netlify, GitHub Pages, etc.

**Q: Can I use this commercially?**
A: Yes! MIT License - use it for anything.

**Q: Do I need to know React?**
A: No! Just write markdown files. The site handles the rest.

---

# 🤝 Contributing

We welcome issues and pull requests!

1. Fork the repo and create your branch
2. Make changes and commit with clear messages
3. Open a pull request describing your changes
4. For bugs or feature requests, open an issue in GitHub

See [CONTRIBUTING.md](./CONTRIBUTING.md) if available, or use the GitHub issue tracker.

---

> **A production-ready starter template for markdown-based websites.** Deploy in minutes, customize with AI assistance, and publish beautiful static content with built-in search, dark mode, and image optimization.

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
- 🎨 **Customizable**: Dark/light themes with visual editor, clean minimal design
- 🔍 **Built-in Search**: Client-side search with keyboard shortcuts
- 🖼️ **Image Support**: Automatic thumbnail optimization with Next.js Image
- 🔧 **Modern Stack**: Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui

## ✨ Features

- 📝 **Markdown Content**: Write articles in markdown with YAML front matter
- 🏷️ **Categories & Tags**: Organize articles by category with automatic navigation and tag-based filtering
- ⭐ **Featured Articles**: Mark articles as featured to display on homepage
- �️ **Thumbnail Images**: Add beautiful hero images to your articles with automatic optimization
- 🔍 **Built-in Search**: Client-side search with keyboard shortcuts (Cmd+K / Ctrl+K)
- 🎨 **Theme System**: Dark/light mode toggle with customizable color schemes via `content/theme.md`
- �🔗 **Smart Navigation**: Previous/next links, breadcrumbs, and related articles sidebars
- 📱 **Responsive Design**: Mobile-first UI with shadcn components
- ⚙️ **Site Settings**: Configure site metadata, URLs, and hidden categories in `content/settings.md`
- 🗺️ **Auto Sitemap**: Automatically generated sitemap.xml for SEO
- ⚡ **Static Generation**: Pre-rendered HTML for instant page loads
- 🔍 **Type-Safe**: Full TypeScript support with strict mode
- 🚀 **SEO-Friendly**: Proper metadata, structured data, and optimized images

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

### ⚡ New Features Highlights

- **🔍 Search**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the search modal
- **🎨 Theme Editor**: Visit `/theme` to customize colors for light/dark modes
- **🖼️ Images**: Add `image: "https://..."` to article front matter for thumbnails
- **🏷️ Tags**: Filter articles by tags via `/tag/[tag]` routes
- **⚙️ Settings**: Configure site-wide options in `content/settings.md`
- **🗺️ Sitemap**: Automatically generated at `/sitemap.xml` for SEO

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

### 🤖 AI-Assisted Development

This template includes **custom GitHub Copilot instructions** to help AI tools understand your content structure and coding patterns:

- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Main Copilot instructions for code
- **[.github/copilot-instructions-content.md](./.github/copilot-instructions-content.md)** - Content creation guidelines
- **[.github/COPILOT_EXAMPLE.md](./.github/COPILOT_EXAMPLE.md)** - See the difference AI instructions make!

These instructions teach Copilot about your project structure, naming conventions, and best practices so it can better assist with both code and content creation.

### 🔍 Reference

- **[CATEGORY_ORDERING.md](./CATEGORY_ORDERING.md)** - Category ordering and organization
- **[IMAGE_SUPPORT.md](./IMAGE_SUPPORT.md)** - How to add hero images to articles
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
│   ├── article-template.md
│   └── category-index-template.md
├── 01-guides/              # ← Categories use numbered prefixes for ordering
│   ├── index.md           # ← Optional: category title & description
│   ├── 01-setup.md
│   └── 02-advanced.md
├── 02-tutorials/
│   ├── index.md
│   ├── 01-getting-started.md
│   └── 02-routing-basics.md
└── 03-sample/
    ├── index.md
    └── 01-markdown-showcase.md
```

**Category Ordering:**

- Categories are ordered by their numeric prefix (e.g., `01-guides`, `02-tutorials`). The prefix determines display order in navigation and menus.
- To add or reorder categories, rename folders with the desired numeric prefix.
- The slug (after the dash) becomes the URL path.
- Optional `index.md` in each category for custom title and description.

**Hidden Categories:**

- To hide categories from navigation, add the category folder name (not the index) to the `hiddenCategories` list in `content/settings.md`.
- Example:
  ```yaml
  hiddenCategories:
    - "sample"
    - "_templates"
  ```
- Do not include the numeric index in `hiddenCategories`—just use the folder name.

→ See **[CATEGORY_ORDERING.md](./CATEGORY_ORDERING.md)** for category setup details.  
→ See **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** for detailed content documentation.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with Navigation
│   ├── page.tsx                      # Homepage
│   ├── sitemap.ts                    # Auto-generated sitemap
│   ├── [category]/page.tsx           # Category listing
│   ├── [category]/[slug]/page.tsx    # Article detail
│   ├── tag/[tag]/page.tsx            # Tag-filtered articles
│   ├── theme/page.tsx                # Theme customization
│   └── globals.css                   # Global styles + CSS variables
├── components/
│   ├── Navigation.tsx                # Main navigation
│   ├── MobileNav.tsx                 # Mobile navigation drawer
│   ├── Search.tsx                    # Search modal with shortcuts
│   ├── ThemeToggle.tsx               # Dark/light mode switch
│   ├── ArticleCard.tsx               # Article preview cards
│   ├── ArticleImage.tsx              # Optimized hero images
│   ├── ArticleNavigation.tsx         # Prev/next links
│   ├── Breadcrumbs.tsx               # Breadcrumb navigation
│   ├── RelatedArticles.tsx           # Sidebar suggestions
│   └── ui/                           # shadcn components
└── lib/
    ├── markdown.ts                   # Content utilities
    ├── date.ts                       # Date formatting
    └── utils.ts                      # Helper functions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Markdown**: `remark` + `remark-html` + `rehype` plugins
- **Icons**: lucide-react
- **Front Matter**: gray-matter
- **Syntax Highlighting**: highlight.js via rehype-highlight

## 📂 How It Works

1. **Content Discovery**: Reads markdown files from `content/` directory
2. **Front Matter Parsing**: Extracts metadata (title, date, featured, etc.)
3. **HTML Rendering**: Converts markdown to HTML with `remark`
4. **Static Generation**: Pre-renders all pages at build time with `generateStaticParams()`
5. **Navigation**: Automatically builds category menu and article navigation

## 🎯 Homepage

- Hero section with site title
- Grid of featured articles with thumbnails
- Categories in navigation menu
- Search button (Cmd+K / Ctrl+K to open)
- Dark/light mode toggle

## 📄 Article Features

- **Metadata**: Title, description, date, category, tags, thumbnail images
- **Content**: Full HTML-rendered markdown with syntax highlighting
- **Navigation**: Previous/next buttons to adjacent articles
- **Related**: Sidebar with 3 related articles from the same category
- **Breadcrumbs**: Clear navigation path on every article
- **Images**: Optional hero images with Next.js Image optimization

## 🔗 Routes

| Route              | Page                                 |
| ------------------ | ------------------------------------ |
| `/`                | Homepage with featured articles      |
| `/:category`       | Category listing (sorted by index)   |
| `/:category/:slug` | Individual article with full content |
| `/tag/:tag`        | Articles filtered by tag             |
| `/theme`           | Theme customization page             |
| `/404`             | Not found page                       |

## 🎨 Customization

### Global Site Settings

Edit `content/settings.md` to configure:

- Site URL and metadata
- Site title and description
- Author information
- Hidden categories (excluded from navigation)

### Theme Customization

Visit `/theme` or edit `content/theme.md` to customize:

- Light and dark mode colors
- Border radius
- All shadcn semantic color tokens

### Add a New Category

Categories use numbered prefixes for ordering:

```bash
# Check existing categories (e.g., 01-guides, 02-tutorials, 03-sample)
# Use next sequential number (04 in this example)
mkdir content/04-my-category

# Optional: Add category metadata
cat > content/04-my-category/index.md << 'EOF'
---
title: "My Category"
description: "Category description here"
---
EOF
```

The category automatically appears in the navigation menu in numeric order (unless hidden in settings).

**Category Ordering:** The numeric prefix (01, 02, 03, etc.) determines the display order in navigation. To reorder, rename folders with new numbers.

### Add an Article

```bash
touch content/tutorials/05-my-article.md
```

Edit with front matter and markdown content. Optionally include:

- `image`: URL to thumbnail/hero image
- `tags`: Array of tags for filtering
- `featured`: Boolean to display on homepage

**Example with all features:**

```markdown
---
title: "My Amazing Article"
description: "Learn something new"
date: "2025-10-29"
featured: true
tags: ["nextjs", "typescript"]
image: "https://images.unsplash.com/photo-..."
---

Your content here...
```

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

- `content/01-guides/01-tailwind-setup.md` (EXAMPLE - Replace me!)
- `content/01-guides/02-typescript-best-practices.md` (EXAMPLE - Replace me!)
- `content/02-tutorials/01-getting-started.md` (EXAMPLE - Replace me!)
- `content/02-tutorials/02-routing-basics.md` (EXAMPLE - Replace me!)

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

## Icon generation — testing & recommended sizes

This project includes a small icon generator (`scripts/generate-icons.js`) that can fetch a source image from a URL defined in `content/settings.md` (the `iconUrl` frontmatter field) and create all common PWA/app icons into the `public/` folder and the `src/app/favicon.ico` file.

Quick notes:

- The generator auto-installs `sharp` if it's missing.
- If `iconUrl` is empty or missing the generator will skip icon generation (safe for CI/builds).
- Output locations:
  - `public/icon-16x16.png`, `public/icon-32x32.png`, ..., `public/icon-512x512.png`
  - `public/icon-maskable-192x192.png`, `public/icon-maskable-512x512.png`
  - `public/apple-touch-icon.png`
  - `src/app/favicon.ico`

Recommended source image:

- Use a square PNG (transparent background) at 512×512px when possible. This yields the best quality across platforms.
- If you have an SVG, it's fine to point `iconUrl` at the served SVG (e.g., `http://localhost:3000/example-icon.svg`) — the generator will download it and rasterize at the target sizes.

Sizes generated by the script (all PNG unless noted):

- 16×16 — `icon-16x16.png` (favicon usage)
- 32×32 — `icon-32x32.png`
- 72×72 — `icon-72x72.png`
- 96×96 — `icon-96x96.png`
- 128×128 — `icon-128x128.png`
- 144×144 — `icon-144x144.png`
- 152×152 — `icon-152x152.png`
- 192×192 — `icon-192x192.png` (standard Android)
- 384×384 — `icon-384x384.png`
- 512×512 — `icon-512x512.png` (Play Store / PWA)
- 192×192 maskable — `icon-maskable-192x192.png` (safe zone)
- 512×512 maskable — `icon-maskable-512x512.png` (safe zone)
- Apple Touch — `apple-touch-icon.png` (180×180)

Testing locally

1. Use a remote URL (quickest):

   - Set `iconUrl` in `content/settings.md` to a publicly accessible PNG/SVG URL, e.g.:

     ```yaml
     iconUrl: "https://example.com/path/to/icon.png"
     ```

   - Run the generator manually or via the npm scripts:

     ```bash
     # Run generator only
     node scripts/generate-icons.js

     # Or start dev (generator runs automatically before next dev)
     npm run dev
     ```

2. Use the local example (served by the dev server):

   - Set `iconUrl` to the full local dev URL after starting the dev server, for example:

     ```yaml
     iconUrl: "http://localhost:3000/example-icon.svg"
     ```

   - Start the dev server in one terminal:

     ```bash
     npm run dev
     ```

   - Then in another terminal (once the dev server is serving `example-icon.svg`) run:

     ```bash
     node scripts/generate-icons.js
     ```

3. Use a local file path (optional):

   - The generator currently expects a URL. If you prefer using a filesystem path like `./public/example-icon.svg`, I can update the script to accept local paths — let me know and I'll implement that change.

Troubleshooting

- If icons are not generated, confirm `iconUrl` is set and reachable from your machine.
- The script logs progress and errors to the console. It will not fail the build if icon generation encounters an error — the build will continue.

Want me to automatically support local filesystem paths for `iconUrl` (e.g., `./public/example-icon.svg`)? I can add that so the generator runs before dev/build without needing a running dev server.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
