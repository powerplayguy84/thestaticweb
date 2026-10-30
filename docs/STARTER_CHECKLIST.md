# 🚀 New Site Checklist

Use this checklist when setting up **The Static Web** for a new project.

---

## ✅ Initial Setup (Required)

### 1. Clone & Install

- [ ] Clone or download repository
- [ ] Run `npm install`
- [ ] Run `npm run dev` to verify it works
- [ ] Visit http://localhost:3000

### 2. Customize Site Identity

- [ ] Update `content/homepage.md` with your site info
  - [ ] Change site title
  - [ ] Update subtitle
  - [ ] Write your description
  - [ ] Update CTA button text and link
  - [ ] Replace hero image URL
- [ ] Update `package.json` metadata
  - [ ] Change `name` field
  - [ ] Update `description`
  - [ ] Add your `author` name
  - [ ] Update `repository` URL

### 3. Content Strategy

- [ ] Decide on your categories (blog, tutorials, guides, etc.)
- [ ] Plan your first 3-5 articles
- [ ] Choose whether to keep or delete example content

**Choose one:**

- [ ] **Option A:** Delete example content and start fresh
  ```bash
  rm -rf content/tutorials content/guides
  mkdir content/blog  # or your category name
  ```
- [ ] **Option B:** Modify example content with your own

### 4. Create First Article

- [ ] Copy template: `cp content/_templates/article-template.md content/[category]/01-[slug].md`
- [ ] Fill in front matter (title, description, date, tags)
- [ ] Write content
- [ ] Add hero image
- [ ] Test locally (`npm run dev`)

---

## 🎨 Branding (Optional)

### Visual Identity

- [ ] Customize colors in `src/app/globals.css` (see variables)
- [ ] Add logo image (update `content/homepage.md` navbar.logo)
- [ ] Choose font pairing (default: Geist Sans + Geist Mono)

### Favicon & Metadata

- [ ] Replace favicon in `public/` directory
- [ ] Update metadata in `src/app/layout.tsx`

---

## 📝 Content Creation

### Prepare for AI Assistance

- [ ] Read [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md)
- [ ] Set up GitHub Copilot or preferred AI tool
- [ ] **AI-Assisted Writing:** Use the built-in skill at `.gemini/skills/portal-content/` or reference `.github/copilot-instructions.md`
- [ ] Review `content/_templates/article-template.md`

### Create Initial Content

- [ ] Write/generate 3-5 starter articles
- [ ] Mark 2-3 as `featured: true` for homepage
- [ ] Add relevant tags to each article
- [ ] Include hero images for all featured articles

### Content Organization

- [ ] Create categories based on your niche
- [ ] Number articles for ordering (01-, 02-, etc.)
- [ ] Use consistent slug naming (lowercase-with-dashes)

---

## 🔧 Configuration

### Deployment Type

**Choose your deployment strategy:**

- [ ] **Vercel/Netlify (Server)**

  - Keep default `next.config.ts`
  - No changes needed

- [ ] **Static Export (GitHub Pages, S3)**
  - Add to `next.config.ts`:
    ```typescript
    output: 'export',
    images: { unoptimized: true }
    ```

### Environment Variables (if needed)

- [ ] Create `.env.local` file
- [ ] Add necessary variables
- [ ] Update `.env.example` with variable names (don't include values!)

---

## 🚀 Pre-Launch

### Testing

- [ ] Test all article links
- [ ] Verify images load properly
- [ ] Check navigation menu shows all categories
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Run `npm run build` successfully
- [ ] Test production build (`npm start`)

### SEO & Accessibility

- [ ] Verify all articles have descriptions
- [ ] Check all images have alt text
- [ ] Ensure meta tags are set in `layout.tsx`
- [ ] Test with Lighthouse (aim for 90+ scores)

### Content Review

- [ ] Proofread all articles
- [ ] Verify front matter is complete
- [ ] Check that featured articles are high quality
- [ ] Ensure dates are in DD-MM-YYYY format

---

## 🌐 Deployment

### Platform Setup

**Choose your platform:**

#### Vercel (Recommended)

- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run `vercel` in project directory
- [ ] Follow prompts to deploy
- [ ] Set up custom domain (optional)

#### Netlify

- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `.next`
- [ ] Deploy

#### GitHub Pages (Static)

- [ ] Configure for static export (see above)
- [ ] Run `npm run build`
- [ ] Deploy `out/` directory

### Post-Deployment

- [ ] Verify site is live
- [ ] Test all routes
- [ ] Check that images load
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (optional)

---

## 📊 Ongoing Maintenance

### Weekly

- [ ] Publish 1-2 new articles
- [ ] Review analytics
- [ ] Respond to feedback

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Review and update older content
- [ ] Check for broken links
- [ ] Monitor site performance

---

## 🎯 Quick Reference

### Key Files to Customize

```
content/homepage.md          # Site title, hero, CTA
package.json                 # Project metadata
content/[category]/          # Your articles
src/app/globals.css          # Colors, theme
next.config.ts               # Deployment config
```

### Common Commands

```bash
npm run dev                  # Start dev server
npm run build                # Production build
npm run lint                 # Check code quality
npm start                    # Start production server
```

### Documentation

- [CUSTOMIZATION_QUICK_START.md](./CUSTOMIZATION_QUICK_START.md) - Essential customizations
- [AI_CONTENT_CREATION.md](./AI_CONTENT_CREATION.md) - AI content generation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guides
- [USER_GUIDE.md](./USER_GUIDE.md) - Complete documentation

---

## ✨ You're Ready!

Once you've completed this checklist:

1. ✅ Your site is customized
2. ✅ Content is ready
3. ✅ Site is deployed
4. ✅ You're ready to publish!

**Next:** Start creating content and promoting your site! 🎉

---

### Need Help?

- **Quick answers:** [FAQ.md](./FAQ.md)
- **Issues:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **GitHub:** Open an issue in the repository

**Happy publishing!** 🚀
