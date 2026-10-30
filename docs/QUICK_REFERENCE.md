# Quick Reference Card

**Keep this open while working!** Common commands and file locations.

---

## 📁 Important Files

| File                                     | Purpose          | Action                            |
| ---------------------------------------- | ---------------- | --------------------------------- |
| `content/homepage.md`                    | Homepage content | Edit site title, description, CTA |
| `content/_templates/article-template.md` | Article template | Copy to create new articles       |
| `content/[category]/`                    | Your content     | Create folders for categories     |
| `package.json`                           | Project metadata | Update name, author, description  |
| `src/app/globals.css`                    | Theme/colors     | Customize CSS variables           |
| `next.config.ts`                         | Build settings   | Configure for deployment          |

---

## 🎯 Common Tasks

### Start Development Server

```bash
npm run dev
```

→ http://localhost:3000

### Create New Article

```bash
cp content/_templates/article-template.md content/blog/02-new-article.md
code content/blog/02-new-article.md
```

### Create New Category

```bash
mkdir content/my-category
# Category appears in nav automatically!
```

### Build for Production

```bash
npm run build
```

### Test Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

---

## 📝 Article Front Matter

**Minimum required:**

```yaml
---
title: "Article Title"
description: "SEO description (120-160 chars)"
date: "28-10-2025"
featured: false
tags: ["tag1", "tag2", "tag3"]
image: "https://example.com/image.jpg"
---
```

**Date format:** DD-MM-YYYY (always!)

---

## 🤖 AI Quick Prompts

### Generate Single Article

```
Use content/_templates/article-template.md to create an article about [TOPIC].
Make it 800 words with code examples. Category: tutorials
```

### Generate Multiple Articles

```
Create 3 articles using content/_templates/article-template.md:
1. [TOPIC 1] - 600 words
2. [TOPIC 2] - 800 words
3. [TOPIC 3] - 700 words
Category: guides, Tags: ["web", "tutorial"]
```

### Optimize Existing Article

```
Improve this article's SEO:
- Better title (max 60 chars)
- Meta description (120-160 chars)
- 5 relevant tags
- Suggest hero image
```

---

## 🎨 Customization Shortcuts

### Change Primary Color

**File:** `src/app/globals.css`

```css
--primary: 222.2 47.4% 11.2%; /* Change this */
```

### Update Site Title

**File:** `content/homepage.md`

```yaml
title: "Your Site Name"
navbar:
  title: "Your Brand"
```

### Add Logo

**File:** `content/homepage.md`

```yaml
navbar:
  logo: "https://your-domain.com/logo.png"
```

---

## 🚀 Deployment Quick Guide

### Vercel (Recommended)

```bash
vercel
# Follow prompts
```

### Static Export

**File:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

Then:

```bash
npm run build
# Deploy 'out/' directory
```

---

## 📊 File Naming Convention

### Articles

```
content/
├── blog/
│   ├── 01-first-post.md      ✅ Good
│   ├── 02-second-post.md     ✅ Good
│   └── My Article.md         ❌ Bad (no number, spaces)
```

**Format:** `[number]-[slug-with-dashes].md`

### Categories

```
content/
├── blog/              ✅ Good (lowercase, single word)
├── how-to-guides/     ✅ Good (dashes ok)
└── My Category/       ❌ Bad (spaces, caps)
```

**Format:** `lowercase-with-dashes`

---

## 🔍 Troubleshooting Quick Fixes

### Articles not showing?

- Check front matter is complete
- Verify date format is DD-MM-YYYY
- Ensure file is in a category folder
- Run `npm run dev` to see errors

### Images not loading?

- Use full HTTPS URLs
- Check image URLs are valid
- For local images, use `/public/` directory

### Navigation broken?

- Category folders must be directly in `content/`
- Folder names become nav items
- Restart dev server after creating categories

### Build failing?

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## 📚 Documentation Index

| Guide                                                          | Purpose              |
| -------------------------------------------------------------- | -------------------- |
| [START_HERE.md](./START_HERE.md)                               | 5-min quick start    |
| [CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md) | Top 5 customizations |
| [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md)             | AI content guide     |
| [STARTER_CHECKLIST.md](./STARTER_CHECKLIST.md)                 | Complete setup list  |
| [DEPLOYMENT.md](./DEPLOYMENT.md)                               | Deploy anywhere      |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)                     | Fix common issues    |
| [USER_GUIDE.md](./USER_GUIDE.md)                               | Full documentation   |

---

## 💡 Pro Tips

1. **Keep `npm run dev` running** - See changes instantly
2. **Use numbered files** - Controls article order
3. **Set 2-3 articles as featured** - They show on homepage
4. **Optimize images first** - Use WebP, compress before uploading
5. **Test on mobile** - Design is mobile-first
6. **Commit often** - Use git to track changes
7. **Use AI liberally** - Template is AI-optimized

---

## 🆘 Getting Help

**Quick answer needed?**
→ [FAQ.md](./FAQ.md)

**Something broken?**
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Deep dive needed?**
→ [USER_GUIDE.md](./USER_GUIDE.md)

**Report bug:**
→ GitHub Issues

---

**Print this and keep it handy!** 📌
