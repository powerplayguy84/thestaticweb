# Troubleshooting Guide

Common issues and solutions for The Static Web.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Issues](#development-issues)
- [Content Issues](#content-issues)
- [Build Errors](#build-errors)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### npm install fails

**Error:**

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, use legacy peer deps
npm install --legacy-peer-deps
```

### Wrong Node version

**Error:**

```
error: The engine "node" is incompatible with this module
```

**Solution:**

```bash
# Check your Node version
node --version

# Need Node 18 or higher. Install from nodejs.org or use nvm:
nvm install 18
nvm use 18
```

### Permission denied errors

**Error:**

```
Error: EACCES: permission denied
```

**Solutions:**

```bash
# Don't use sudo! Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to ~/.zshrc or ~/.bash_profile:
export PATH=~/.npm-global/bin:$PATH

# Reload shell
source ~/.zshrc
```

## Development Issues

### Port 3000 already in use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

```bash
# Option 1: Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
PORT=3001 npm run dev
```

### Changes not showing up

**Problem:** Made changes but not seeing them in browser.

**Solutions:**

1. **Hard refresh browser:**

   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

2. **Clear Next.js cache:**

```bash
rm -rf .next
npm run dev
```

3. **Check file is saved** (seems obvious but happens!)

4. **Restart dev server:**

```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Hot reload not working

**Problem:** Changes require manual refresh.

**Solutions:**

```bash
# 1. Check if too many files are open
ulimit -n  # Should be 10240+

# Increase if needed (add to ~/.zshrc):
ulimit -n 10240

# 2. Clear .next and restart
rm -rf .next
npm run dev

# 3. Disable browser extensions that might interfere
```

### TypeScript errors in editor

**Problem:** VS Code showing TypeScript errors.

**Solutions:**

1. **Restart TypeScript server** in VS Code:

   - `Cmd+Shift+P` → "TypeScript: Restart TS Server"

2. **Check tsconfig.json** is valid

3. **Install types:**

```bash
npm install --save-dev @types/node @types/react
```

4. **Update VS Code TypeScript version:**
   - `Cmd+Shift+P` → "TypeScript: Select TypeScript Version"
   - Choose "Use Workspace Version"

## Content Issues

### Article not appearing

**Problem:** Created article but it doesn't show on site.

**Checklist:**

1. ✅ File in correct location: `content/category/XX-slug.md`
2. ✅ Valid front matter with required fields
3. ✅ Correct date format: `YYYY-MM-DD`
4. ✅ No syntax errors in front matter
5. ✅ Restart dev server

**Example of valid file:**

```markdown
---
title: "My Article"
description: "Description here"
date: "2025-10-28"
---

# Content here
```

### Front matter parsing error

**Error:**

```
Error: Invalid front matter
```

**Common issues:**

```yaml
# ❌ WRONG - Missing quotes on string with special chars
title: My Article: A Guide

# ✅ CORRECT
title: "My Article: A Guide"

# ❌ WRONG - Wrong date format
date: 10/28/2025

# ✅ CORRECT
date: "2025-10-28"

# ❌ WRONG - Tags not an array
tags: nextjs, react

# ✅ CORRECT
tags: ["nextjs", "react"]
```

### Images not loading

**Problem:** Images show broken icon.

**Solutions:**

1. **Check file path:**

```markdown
# ✅ Correct - File in public/images/

![Alt](/images/photo.jpg)

# ❌ Wrong - Missing leading slash

![Alt](images/photo.jpg)

# ❌ Wrong - Incorrect path

![Alt](/public/images/photo.jpg)
```

2. **Verify file exists:**

```bash
ls public/images/
```

3. **Check file extension matches:**

```markdown
# File is photo.jpg, not photo.png

![Alt](/images/photo.jpg) # ✅ Correct
![Alt](/images/photo.png) # ❌ Wrong
```

### Article shows wrong date

**Problem:** Date displays incorrectly.

**Solution:**

Use `YYYY-MM-DD` format only:

```yaml
# ✅ CORRECT
date: "2025-10-28"

# ❌ WRONG
date: "28-10-2025"
date: "Oct 28, 2025"
date: "10/28/2025"
```

### Category not showing in navigation

**Problem:** Created new category folder but not appearing.

**Solutions:**

1. **Restart dev server** (required for new categories)

```bash
# Stop (Ctrl+C) and restart
npm run dev
```

2. **Check folder has articles:**

   - Navigation only shows categories with at least one article

3. **Check folder name:**
   - Use lowercase, no spaces
   - Example: `content/tutorials/` not `content/Tutorials/`

## Build Errors

### Build fails with TypeScript errors

**Error:**

```
Type error: Property 'X' does not exist on type 'Y'
```

**Solutions:**

1. **Fix type errors** (can't be ignored in production)

2. **Check all imports exist**

3. **Verify types are correct:**

```typescript
// Add proper typing
interface Article {
  title: string;
  description: string;
  // ...
}
```

### Build fails with module not found

**Error:**

```
Module not found: Can't resolve '@/components/...'
```

**Solutions:**

1. **Check file exists at that path**

2. **Verify tsconfig.json paths:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. **Use correct import alias:**

```typescript
// ✅ Correct
import { Header } from "@/components/Header";

// ❌ Wrong
import { Header } from "components/Header";
```

### Out of memory error

**Error:**

```
FATAL ERROR: JavaScript heap out of memory
```

**Solution:**

```bash
# Increase Node memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

Or add to `package.json`:

```json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 next build"
  }
}
```

### Static export fails

**Error:**

```
Error: Page "/article" is missing "generateStaticParams()"
```

**Solution:**

If using `output: 'export'`, add to dynamic pages:

```typescript
// In [slug]/page.tsx
export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
```

## Deployment Issues

### Vercel build fails

**Problem:** Builds locally but fails on Vercel.

**Checklist:**

1. ✅ Check build logs for specific error
2. ✅ Ensure Node version matches:

```json
// package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

3. ✅ All dependencies in `package.json`
4. ✅ No missing environment variables
5. ✅ Build command is correct: `npm run build`

### Environment variables not working

**Problem:** Env vars undefined in production.

**Solutions:**

1. **Prefix public vars with NEXT*PUBLIC*:**

```env
# ✅ Available in browser
NEXT_PUBLIC_API_URL=https://api.example.com

# ❌ Not available in browser (server only)
API_KEY=secret123
```

2. **Add to deployment platform:**

   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

3. **Redeploy after adding variables**

### 404 on deployed site

**Problem:** Pages work locally but 404 in production.

**Solutions:**

1. **Check file names match URLs:**

   - `content/guides/01-setup.md` → `/guides/setup`

2. **Verify build includes all pages:**

```bash
npm run build
# Check .next/server/app for generated pages
```

3. **Check platform routing config**

### Slow build times

**Problem:** Builds take too long.

**Solutions:**

1. **Use build cache:**

```javascript
// next.config.ts
export default {
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
};
```

2. **Reduce dependencies:**

```bash
npm uninstall unused-package
```

3. **Enable SWC minification** (default in Next.js 13+)

## Performance Issues

### Slow page loads

**Checklist:**

1. ✅ **Optimize images:**

```bash
# Install sharp for automatic optimization
npm install sharp
```

2. ✅ **Use Next.js Image component:**

```typescript
import Image from "next/image";

<Image src="/images/photo.jpg" width={800} height={600} alt="Description" />;
```

3. ✅ **Check bundle size:**

```bash
npm run build
# Look for large chunks in output
```

4. ✅ **Lazy load components:**

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/Heavy"));
```

### High memory usage

**Problem:** Dev server using too much memory.

**Solutions:**

1. **Restart dev server regularly**

2. **Clear .next cache:**

```bash
rm -rf .next
npm run dev
```

3. **Reduce concurrent pages:**
   - Don't have too many browser tabs open
   - Use production build for testing

### Lighthouse score low

**Problem:** Poor performance scores.

**Solutions:**

1. **Enable compression** (automatic on Vercel/Netlify)

2. **Minimize JavaScript:**

   - Remove unused dependencies
   - Use `next/dynamic` for heavy components

3. **Optimize fonts:**

   - Use `next/font` for automatic optimization
   - Subset fonts to reduce size

4. **Add caching headers** (automatic on most platforms)

## Getting Help

### Before asking for help:

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Search existing GitHub issues
4. ✅ Try building locally to isolate issue

### Where to get help:

- 📖 **Documentation**: Check [README.md](./README.md) and other guides
- 💬 **GitHub Issues**: Search existing issues or create new one
- 🔍 **Google/Stack Overflow**: Search the error message
- 📚 **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

### How to report an issue:

Include:

1. **Error message** (full text)
2. **Steps to reproduce**
3. **Environment info:**

```bash
node --version
npm --version
npx next info
```

4. **Relevant code snippets**
5. **What you've tried**

## Quick Fixes

### "It's not working" starter pack:

```bash
# 1. Restart dev server
# Stop with Ctrl+C, then:
npm run dev

# 2. Clear cache
rm -rf .next
npm run dev

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Check for updates
npm outdated
npm update

# 5. Verify Node version
node --version  # Should be 18+
```

### ESLint errors:

```bash
# Fix automatically
npm run lint -- --fix

# Check specific file
npx eslint src/app/page.tsx

# Disable for one line (use sparingly)
// eslint-disable-next-line
```

### TypeScript errors:

```bash
# Check all type errors
npx tsc --noEmit

# Check specific file
npx tsc src/app/page.tsx --noEmit
```

## Prevention Tips

1. **Use version control:**

   - Commit working code frequently
   - Create feature branches

2. **Test locally before deploying:**

```bash
npm run build
npm start
```

3. **Keep dependencies updated:**

```bash
npm outdated
npm update
```

4. **Follow naming conventions:**

   - Use provided file structure
   - Follow front matter format exactly

5. **Read error messages:**
   - They usually tell you exactly what's wrong!

## Still Stuck?

If you've tried everything and still have issues:

1. Create a minimal reproduction of the problem
2. Open a GitHub issue with details
3. Join the community discussions
4. Consider consulting [Next.js documentation](https://nextjs.org/docs)

Good luck! 🍀
