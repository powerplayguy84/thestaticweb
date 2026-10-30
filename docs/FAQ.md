# Frequently Asked Questions (FAQ)

Common questions about The Static Web and their answers.

## General Questions

### What is The Static Web?

The Static Web is a markdown-based blog platform built with Next.js 16, TypeScript, and Tailwind CSS. You write articles in simple markdown files, and the platform automatically generates a beautiful, fast website with categories, navigation, and featured articles.

### Is it really free?

Yes! The codebase is free and open source. Hosting on platforms like Vercel or Netlify also has generous free tiers that are perfect for personal blogs.

### Do I need to know how to code?

Basic knowledge is helpful, but you don't need to be a developer! If you can:

- Write markdown (it's like writing an email with simple formatting)
- Run a few terminal commands
- Edit text files

...then you can use The Static Web! Check out [GETTING_STARTED.md](./GETTING_STARTED.md) for a beginner-friendly guide.

### Can I use this for a production website?

Absolutely! The Static Web is built on Next.js, a production-ready framework used by companies like Netflix, Twitch, and Nike. It's fast, secure, and scalable.

## Content & Writing

### How do I add a new article?

1. Create a markdown file in `content/category/XX-slug.md`
2. Add front matter with title, description, and date
3. Write your content in markdown
4. Restart dev server if needed

See [HOW_TO_WRITE.md](./HOW_TO_WRITE.md) for details.

### What's the file naming convention?

Files should be named: `XX-article-slug.md`

- `XX` = Two-digit number (01, 02, 03...) for sorting
- `article-slug` = URL-friendly slug (lowercase, hyphens)
- `.md` = Markdown extension

Examples:

- `01-getting-started.md` → `/tutorials/getting-started`
- `15-advanced-tips.md` → `/guides/advanced-tips`

### Can I use HTML in markdown?

Yes! Markdown supports inline HTML for advanced formatting:

```markdown
<div style="background: #f0f0f0; padding: 1rem;">
  Custom HTML content
</div>
```

### How do I add images?

**Option 1: Local images**

1. Put image in `public/images/`
2. Reference in markdown:

```markdown
![Alt text](/images/my-image.jpg)
```

**Option 2: External URLs**

```markdown
![Alt text](https://example.com/image.jpg)
```

See [IMAGE_SUPPORT.md](./IMAGE_SUPPORT.md) for more details.

### Can I schedule posts for future publication?

Not built-in, but you can:

1. Set a future date in front matter
2. Create a filter to hide future-dated posts
3. Use deployment platforms' scheduled deployments

Or simply wait to push/deploy until the publish date!

### How do I make an article featured?

Add `featured: true` to the front matter:

```yaml
---
title: "My Featured Article"
description: "This will appear on the homepage"
date: "2025-10-28"
featured: true
---
```

### Can I have multiple authors?

Not built-in, but you can easily add an `author` field:

```yaml
---
title: "Article Title"
description: "Description"
date: "2025-10-28"
author: "Jane Doe"
---
```

Then update components to display it.

### What markdown features are supported?

All standard markdown:

- Headings (H1-H6)
- Bold, italic, strikethrough
- Lists (ordered and unordered)
- Links and images
- Code blocks with syntax highlighting
- Tables
- Blockquotes
- Horizontal rules
- HTML (inline)

See [HOW_TO_WRITE.md](./HOW_TO_WRITE.md) for examples.

## Categories & Organization

### How do I create a new category?

Just create a new folder in `content/`:

```bash
mkdir content/my-category
```

Add an article to it, and it automatically appears in navigation!

### Can I rename a category?

Yes, but URLs will change:

```bash
# Rename the folder
mv content/old-name content/new-name
```

Old URLs (`/old-name/article`) will break. Set up redirects if needed.

### How are articles sorted?

By the number prefix in the filename:

- `01-first.md` appears first
- `02-second.md` appears second
- `10-tenth.md` appears tenth

### Can I hide a category?

Not built-in, but you can create a folder starting with underscore:

```bash
mkdir content/_drafts
```

Then update the `getAllCategories()` function to filter out categories starting with `_`.

### What's the difference between categories and tags?

- **Categories**: Folder structure (`content/tutorials/`, `content/guides/`)
- **Tags**: Metadata in front matter (`tags: ["nextjs", "react"]`)

Categories are more prominent (in navigation), while tags are for additional organization.

## Technical Questions

### What technologies does this use?

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Content**: Markdown with YAML front matter
- **Parsing**: Remark (markdown processor)
- **Components**: shadcn/ui
- **Deployment**: Vercel, Netlify, or any Node.js host

### What's the minimum Node version?

Node.js 18 or higher. Check with:

```bash
node --version
```

Install from [nodejs.org](https://nodejs.org) if needed.

### Is it SEO-friendly?

Yes! The Static Web generates:

- Proper meta tags
- Semantic HTML
- Fast loading times
- Static pages (great for SEO)
- Sitemap (can be added)

### Does it support dark mode?

Not out of the box, but Tailwind CSS makes it easy to add. See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for theming.

### Can I add a search feature?

Yes! You can add:

1. **Client-side search**: Filter articles with JavaScript
2. **Algolia**: Popular search service
3. **Fuse.js**: Lightweight fuzzy search library

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for implementation.

### Can I add comments?

Yes! Integrate services like:

- **Disqus**: Popular comment system
- **Giscus**: GitHub Discussions-based
- **Utterances**: GitHub Issues-based
- **Commento**: Privacy-focused

### Does it have analytics?

Not built-in, but easy to add:

- Google Analytics
- Plausible (privacy-friendly)
- Fathom
- Vercel Analytics (built-in if using Vercel)

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for setup.

### Can I use a CMS?

Yes! You can integrate headless CMS options:

- **Forestry.io**: Markdown-based CMS
- **Tina CMS**: Git-backed CMS
- **Sanity**: Headless CMS
- **Contentful**: Content management platform

## Customization

### How do I change the site title?

Edit `content/homepage.md`:

```yaml
navbar:
  title: "Your Site Name"
```

### Can I change colors?

Yes! Edit `src/app/globals.css` to customize the color scheme. See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for details.

### Can I use custom fonts?

Yes! Add fonts in `src/app/layout.tsx`:

```typescript
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for complete instructions.

### How do I add a logo?

Update `content/homepage.md`:

```yaml
navbar:
  logo: "/logo.svg"
```

Put your logo file in `public/logo.svg`.

### Can I customize the homepage?

Yes! Edit:

- `content/homepage.md` for configuration
- `src/app/page.tsx` for layout/components

### Can I add custom pages?

Absolutely! Create new pages in `src/app/`:

```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About content</div>;
}
```

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for examples.

## Deployment & Hosting

### Where can I host this?

Popular options:

- **Vercel** (recommended) - Free tier, automatic deployments
- **Netlify** - Free tier, easy setup
- **GitHub Pages** - Free for public repos
- **Your own server** - Using Docker or PM2

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guides.

### How much does hosting cost?

**Free options:**

- Vercel: Free tier includes 100GB bandwidth
- Netlify: Free tier includes 100GB bandwidth
- GitHub Pages: Free for public repositories

**Paid hosting:**

- Typically $5-20/month for small to medium blogs
- Scales with traffic

### Do I need a database?

Nope! Everything is file-based. Your markdown files ARE the database.

### How do I use a custom domain?

1. Buy a domain (Namecheap, Google Domains, etc.)
2. Add it to your hosting platform (Vercel/Netlify)
3. Update DNS records
4. Wait for propagation (5 min - 24 hours)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### How do automatic deployments work?

On Vercel/Netlify:

1. Push to GitHub
2. Platform detects changes
3. Automatically builds and deploys
4. Live in ~2 minutes!

No manual work needed after initial setup.

### Can I preview changes before deploying?

Yes! Vercel and Netlify create preview URLs for pull requests automatically.

Or test locally:

```bash
npm run build
npm start
```

## Performance

### How fast is it?

Very fast! Static generation means:

- Pages pre-rendered at build time
- No server processing on each request
- Global CDN distribution
- Typical load times: < 1 second

### What about scalability?

Static sites scale extremely well:

- No database bottlenecks
- CDN handles millions of requests
- No server crashes
- Costs don't increase with traffic

### How do I optimize images?

Use Next.js Image component:

```typescript
import Image from "next/image";

<Image src="/images/photo.jpg" width={800} height={600} alt="Description" />;
```

Automatic optimization, lazy loading, and WebP conversion!

## Troubleshooting

### My article isn't showing up

Checklist:

1. ✅ File in correct location (`content/category/XX-slug.md`)
2. ✅ Valid front matter with required fields
3. ✅ Correct date format (`YYYY-MM-DD`)
4. ✅ Restart dev server

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

### Build fails on deployment

Common fixes:

1. Test build locally: `npm run build`
2. Fix TypeScript errors
3. Check environment variables
4. Verify Node version (18+)

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

### Changes not showing in browser

Try:

1. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. Clear `.next` cache: `rm -rf .next`
3. Restart dev server

### Images aren't loading

Check:

1. File path: `/images/photo.jpg` (starts with `/`)
2. File exists in `public/images/`
3. File extension matches
4. Restart dev server

## Migration & Backup

### Can I export my content?

Yes! Your content is just markdown files. You can:

- Copy the `content/` folder anywhere
- Version control with Git
- Import into other platforms

### How do I backup my site?

Use Git:

```bash
git add .
git commit -m "Backup"
git push
```

Your entire site is backed up on GitHub!

### Can I migrate from WordPress?

Yes! You'll need to:

1. Export WordPress content
2. Convert posts to markdown
3. Add front matter
4. Move files to `content/` folders

Tools like `wordpress-export-to-markdown` can help automate this.

### Can I migrate to another platform?

Absolutely! Since content is markdown, you can easily move to:

- Jekyll
- Hugo
- Gatsby
- Astro
- Any markdown-based platform

## Contributing

### Can I contribute to the project?

Yes! Contributions are welcome:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

### How do I report a bug?

1. Check if it's already reported in GitHub Issues
2. Create a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (Node version, OS, etc.)

### Where's the license?

Check the `LICENSE` file in the repository. Typically MIT or similar permissive license.

## Getting Help

### I'm stuck! Where can I get help?

1. 📖 Read the documentation:

   - [GETTING_STARTED.md](./GETTING_STARTED.md)
   - [HOW_TO_WRITE.md](./HOW_TO_WRITE.md)
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

2. 🔍 Search GitHub Issues

3. 💬 Create a new GitHub Issue

4. 📚 Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

### Is there a community?

Check the GitHub repository for:

- Discussions tab
- Issues and pull requests
- Community links

### Can I hire someone to help?

You can find developers who know Next.js on:

- Upwork
- Fiverr
- GitHub Jobs
- Local tech meetups

## Still Have Questions?

If your question isn't answered here:

1. Check other documentation files (see [README.md](./README.md))
2. Search GitHub Issues
3. Create a new issue with your question

We're here to help! 🚀
