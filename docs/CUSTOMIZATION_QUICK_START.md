# Customization Quick Start

**⚡ The 5 Things to Customize Immediately**

This guide covers the essential customizations to make this template your own. Each change takes less than 5 minutes!

---

## 1. 🏠 Update Homepage Content

**File:** `content/homepage.md`

**What to change:**

- Site title and subtitle
- Description
- Hero image
- Navigation title
- Call-to-action text and link

**Example:**

```markdown
---
title: "Your Site Name"
subtitle: "Your tagline or mission"
description: "What your site is about in one sentence"
image: "https://your-domain.com/hero-image.jpg"
navbar:
  title: "Your Brand"
  logo: "" # Optional: URL to your logo
cta:
  text: "Explore Articles"
  link: "/tutorials" # Your main category
---
```

**💡 Tip:** Keep the title short (2-5 words) and subtitle engaging (5-10 words).

---

## 2. 📦 Update Package Metadata

**File:** `package.json`

**What to change:**

```json
{
  "name": "your-site-name",
  "version": "1.0.0",
  "description": "Your site description",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/your-repo"
  }
}
```

**Why:** This metadata appears in build tools and helps identify your project.

---

## 3. 📝 Replace Example Content

**Location:** `content/` directory

### Current Structure (Examples):

```
content/
├── homepage.md
├── tutorials/
│   ├── 01-getting-started.md      ← EXAMPLE
│   └── 02-routing-basics.md       ← EXAMPLE
└── guides/
    ├── 01-tailwind-setup.md       ← EXAMPLE
    └── 02-typescript-best-practices.md  ← EXAMPLE
```

### Your Actions:

**Option A: Delete and Start Fresh**

```bash
# Delete example categories
rm -rf content/tutorials
rm -rf content/guides

# Create your own categories
mkdir content/blog
mkdir content/resources
```

**Option B: Keep and Modify**

```bash
# Rename categories to match your needs
mv content/tutorials content/blog
mv content/guides content/how-to

# Edit the markdown files with your content
```

**💡 Tip:** Use the template at `content/_templates/article-template.md` for new articles!

---

## 4. 🎨 Customize Site Styling (Optional)

**File:** `src/app/globals.css`

### Quick Color Changes:

Find the CSS variables and update:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%; /* Change this for brand color */
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }
}
```

**💡 Tip:** For full theme customization, see [CUSTOMIZATION.md](./CUSTOMIZATION.md).

**Don't want to customize now?** The default theme is clean and professional—skip this step!

---

## 5. 🌐 Configure Deployment

**File:** `next.config.ts`

### For Static Export (GitHub Pages, S3, etc.):

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Add this line
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
```

### For Vercel/Netlify (Server):

Keep the default config:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default config works for server deployments
};

export default nextConfig;
```

**💡 Tip:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific instructions.

---

## ✅ Checklist

Use this checklist to track your customization:

- [ ] Updated `content/homepage.md` with your site info
- [ ] Updated `package.json` with your metadata
- [ ] Replaced or removed example content in `content/`
- [ ] (Optional) Customized colors in `src/app/globals.css`
- [ ] Configured deployment in `next.config.ts`

---

## 🎯 Next Steps

### Immediate:

1. **Create your first article** - See [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md) for AI assistance
2. **Test locally** - Run `npm run dev` and preview at http://localhost:3000
3. **Deploy** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to go live

### When You're Ready:

- [HOW_TO_WRITE.md](./HOW_TO_WRITE.md) - Master markdown content
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Advanced customization
- [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) - Content organization strategies

---

## 🆘 Need Help?

- **Quick answers:** [FAQ.md](./FAQ.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Full guide:** [USER_GUIDE.md](./USER_GUIDE.md)

---

**🎉 That's it! You're ready to make this template your own.**
