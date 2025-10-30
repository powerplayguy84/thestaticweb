# 👋 Welcome to The Static Web!

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

---

# 🖼️ Visual Guide

![Site Navigation Example](https://raw.githubusercontent.com/powerplayguy84/thestaticweb/main/public/example-navigation.png)
_Navigation bar with categories, search, and theme toggle._

![Content Structure Diagram](https://raw.githubusercontent.com/powerplayguy84/thestaticweb/main/public/content-structure-diagram.png)
_How your markdown files and folders map to site navigation and URLs._

---

**Thanks for using this template!** You're 3 steps away from having your own website.

---

## ⚡ Quick Start (5 minutes)

### Step 1: Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 - your site is live! 🎉

### Step 2: Customize Your Site

**Edit this file:** `content/homepage.md`

Change these fields:

- `title` - Your site name
- `subtitle` - Your tagline
- `description` - What your site is about
- `navbar.title` - Navigation brand name

**Save and refresh** - you'll see your changes immediately!

### Step 3: Create Your First Article

```bash
# Copy the template
cp content/_templates/article-template.md content/blog/01-my-first-post.md

# Edit it
code content/blog/01-my-first-post.md
```

Fill in the front matter at the top, write your content, save, and refresh!

---

## 🤖 Using AI to Create Content?

**You're in the right place!** This template is optimized for AI tools.

### Quick Setup for GitHub Copilot:

```bash
# Copy the Copilot instructions for content creation
cp .github/copilot-instructions-content.md .github/copilot-instructions.md
```

Now Copilot knows your content structure automatically! 🎉

→ See **[AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md)** for:

- Complete GitHub Copilot workflows
- ChatGPT prompts
- Content generation templates
- Batch creation strategies

---

## 📚 What's Next?

### For Complete Customization:

→ **[CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md)** - 5 essential changes

### For Organized Setup:

→ **[STARTER_CHECKLIST.md](./STARTER_CHECKLIST.md)** - Complete setup checklist

### For Full Documentation:

→ **[USER_GUIDE.md](./USER_GUIDE.md)** - Everything you need to know

---

## 🆘 Common Questions

**Q: Where do I put my articles?**  
A: In `content/[category]/` directories. Create categories by making folders.

**Q: How do I change colors/theme?**  
A: Edit `src/app/globals.css` (CSS variables) or see [CUSTOMIZATION.md](./CUSTOMIZATION.md)

**Q: How do I deploy this?**  
A: See [DEPLOYMENT.md](./DEPLOYMENT.md) - Works with Vercel, Netlify, GitHub Pages, etc.

**Q: Can I use this commercially?**  
A: Yes! MIT License - use it for anything.

**Q: Do I need to know React?**  
A: No! Just write markdown files. The site handles the rest.

---

## 🎯 The Basics

### File Structure

```
content/
├── homepage.md              # Your homepage content
├── _templates/              # Templates for new articles
│   └── article-template.md
├── blog/                    # Your category (create your own!)
│   └── 01-article.md
└── guides/                  # Another category
    └── 01-guide.md
```

### Article Format

```markdown
---
title: "My Article"
description: "Brief description for SEO"
date: "28-10-2025"
featured: true
tags: ["tag1", "tag2"]
---

# My Article Title

Your content here...
```

### Categories

Create a folder in `content/` → Automatic category in navigation!

---

## 🚀 Ready to Deploy?

When you're ready to go live:

**Vercel (Easiest):**

```bash
npm i -g vercel
vercel
```

**Or:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for other platforms

---

## 💡 Tips

1. **Start simple** - Use example articles as reference, then replace them
2. **Test locally** - Always run `npm run dev` to preview changes
3. **Use the template** - `content/_templates/article-template.md` ensures consistency
4. **Leverage AI** - This template works great with Copilot, ChatGPT, etc.
5. **Ask for help** - Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) if stuck

---

## ✅ Your Next Action

**Choose one:**

- [ ] 🎨 **Customize now** → [CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md)
- [ ] ✍️ **Create content** → [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md)
- [ ] 📋 **Follow checklist** → [STARTER_CHECKLIST.md](./STARTER_CHECKLIST.md)
- [ ] 📖 **Read full docs** → [USER_GUIDE.md](./USER_GUIDE.md)

---

**Have fun building! 🎉**

_This is a starter template - make it your own, delete this file when you're ready, and ship something awesome!_
