# Getting Started with The Static Web

Welcome to **The Static Web**! This guide will help you understand and start using this markdown-based blog platform.

## What is The Static Web?

The Static Web is a modern, fast, and simple blog platform where you write articles in Markdown files, and the site automatically generates beautiful web pages. No database needed—just write markdown files and deploy!

### Key Benefits

- ✍️ **Write in Markdown**: Simple, familiar syntax for writing content
- 🚀 **Lightning Fast**: Static HTML pages load instantly
- 📁 **File-Based**: Your content is just files—easy to version control
- 🎨 **Beautiful Design**: Clean, minimal UI built with Tailwind CSS
- 📱 **Mobile-First**: Looks great on all devices
- 🔍 **SEO Ready**: Optimized for search engines out of the box

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ installed ([Download here](https://nodejs.org/))
- Basic knowledge of Markdown syntax
- A code editor (VS Code recommended)
- Git for version control (optional but recommended)

## Installation

### 1. Clone or Download the Project

```bash
git clone https://github.com/yourusername/thestaticweb.git
cd thestaticweb
```

### 2. Install Dependencies

```bash
npm install
```

This installs Next.js, React, Tailwind CSS, and other necessary packages.

### 3. Start the Development Server

```bash
npm run dev
```

Your site is now running at `http://localhost:3000` 🎉

## Understanding the Structure

```
thestaticweb/
├── content/              ← Your articles go here
│   ├── tutorials/        ← Category: tutorials
│   ├── guides/           ← Category: guides
│   └── homepage.md       ← Homepage configuration
├── src/
│   ├── app/              ← Next.js pages and routing
│   ├── components/       ← Reusable UI components
│   └── lib/              ← Utilities (markdown parser, etc.)
└── public/               ← Static assets (images, etc.)
```

### The `content/` Folder

This is where **all your articles live**. Each subfolder represents a **category**:

- `content/tutorials/` → Articles in the "Tutorials" category
- `content/guides/` → Articles in the "Guides" category
- Add more categories by creating new folders!

## Your First Article

Let's create your first article to see how everything works.

### Step 1: Create a New Markdown File

Create a file at `content/tutorials/01-hello-world.md`:

```bash
touch content/tutorials/01-hello-world.md
```

### Step 2: Add Front Matter and Content

Open the file and add this content:

````markdown
---
title: "Hello World - My First Article"
description: "Learning how to create my first article on The Static Web"
date: "2025-10-28"
featured: true
tags: ["beginner", "tutorial"]
---

# Welcome to My First Article!

This is my **first article** on The Static Web. I can use all standard Markdown features:

## Lists

- Item one
- Item two
- Item three

## Code Blocks

\```javascript
console.log("Hello, Static Web!");
\```

## Images

![Example](https://via.placeholder.com/800x400)

## Links

Check out [the official docs](https://nextjs.org) for more information.
````

### Step 3: View Your Article

1. Make sure your dev server is running (`npm run dev`)
2. Visit `http://localhost:3000/tutorials/hello-world`
3. Your article should appear! 🎊

### Step 4: See It on the Homepage

Because you set `featured: true`, your article will also appear on the homepage at `http://localhost:3000`.

## Understanding Front Matter

The section at the top of each markdown file (between `---`) is called **front matter**. It provides metadata about your article:

```yaml
---
title: "Required - The article title"
description: "Required - Brief description (shown in previews and SEO)"
date: "Required - Format: YYYY-MM-DD"
featured: false # Optional - Set to true to show on homepage
tags: ["tag1", "tag2"] # Optional - Array of tags
---
```

### Required Fields

- **title**: The article's title (shown as the page heading)
- **description**: A brief description (used in article cards and meta tags)
- **date**: Publication date in `YYYY-MM-DD` format

### Optional Fields

- **featured**: Set to `true` to display the article on the homepage
- **tags**: An array of tags for categorization (e.g., `["nextjs", "javascript"]`)

## File Naming Convention

Files should follow this pattern: `XX-article-slug.md`

- **XX**: Two-digit number (01, 02, 03...) - determines the sort order
- **article-slug**: URL-friendly slug (lowercase, hyphens for spaces)
- **.md**: Markdown file extension

**Examples:**

| Filename                | URL                          | Order  |
| ----------------------- | ---------------------------- | ------ |
| `01-getting-started.md` | `/tutorials/getting-started` | First  |
| `02-advanced-topics.md` | `/tutorials/advanced-topics` | Second |
| `10-final-guide.md`     | `/tutorials/final-guide`     | Tenth  |

## Navigation

The site automatically generates:

1. **Top Navigation**: Shows all categories (based on folders in `content/`)
2. **Homepage**: Shows all featured articles
3. **Category Pages**: Lists all articles in a category
4. **Previous/Next Links**: Navigate between articles in the same category
5. **Related Articles**: Shows other articles in the same category

## Building for Production

When you're ready to deploy:

### 1. Build the Site

```bash
npm run build
```

This creates an optimized production build in `.next/`.

### 2. Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to see the production version.

### 3. Deploy to Vercel (Recommended)

The easiest way to deploy:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel automatically detects Next.js and deploys!

Your site will be live with automatic deployments on every push.

## Next Steps

Now that you understand the basics, check out these guides:

1. **[HOW_TO_WRITE.md](./HOW_TO_WRITE.md)** - Learn Markdown syntax and writing tips
2. **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** - Detailed content management guide
3. **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Customize the look and feel

## Common Questions

### How do I add a new category?

Just create a new folder in `content/`:

```bash
mkdir content/blog
```

Then add articles to it. The category will automatically appear in navigation!

### How do I add images?

Put images in `public/images/` and reference them:

```markdown
![My Image](/images/my-image.jpg)
```

Or use external URLs:

```markdown
![External](https://example.com/image.jpg)
```

### Can I use custom components?

Yes! This is a React/Next.js app. You can extend it with custom components in `src/components/`.

### How do I change the site title?

Edit `content/homepage.md` and update the `navbar.title` field.

## Need Help?

- 📖 Read the [full documentation](./README.md)
- 🐛 Found a bug? Open an issue on GitHub
- 💡 Have an idea? Contribute via pull request!

Happy writing! ✨
