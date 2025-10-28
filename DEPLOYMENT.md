# Deployment Guide

Learn how to deploy your Static Web blog to various hosting platforms.

## Table of Contents

- [Deployment Options](#deployment-options)
- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [GitHub Pages](#github-pages)
- [Self-Hosting](#self-hosting)
- [Environment Variables](#environment-variables)
- [Custom Domains](#custom-domains)

## Deployment Options

The Static Web is a Next.js application that can be deployed to any platform that supports Node.js. Here are the most popular options:

| Platform         | Difficulty  | Cost                | Best For                   |
| ---------------- | ----------- | ------------------- | -------------------------- |
| **Vercel**       | ⭐ Easy     | Free tier available | Next.js apps (recommended) |
| **Netlify**      | ⭐ Easy     | Free tier available | Static sites               |
| **GitHub Pages** | ⭐⭐ Medium | Free                | Open source projects       |
| **Self-hosted**  | ⭐⭐⭐ Hard | Variable            | Full control               |

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps. It's made by the creators of Next.js!

### Why Vercel?

- ✅ Zero configuration for Next.js
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Generous free tier

### Step-by-Step Deployment

#### 1. Push to GitHub

First, make sure your code is on GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js - click **"Deploy"**
5. Wait 1-2 minutes... Done! 🎉

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

#### 3. Automatic Deployments

Every time you push to GitHub, Vercel automatically deploys:

```bash
# Make changes
git add .
git commit -m "Add new article"
git push

# Vercel automatically deploys your changes!
```

### Vercel Configuration

Create `vercel.json` for custom settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "CUSTOM_VAR": "value"
  }
}
```

## Netlify

Netlify is another excellent option for deploying static sites.

### Step-by-Step Deployment

#### 1. Push to GitHub

Same as Vercel - make sure your code is on GitHub.

#### 2. Install Next.js Plugin

Add to your `package.json`:

```json
{
  "dependencies": {
    "@netlify/plugin-nextjs": "^5.0.0"
  }
}
```

#### 3. Create netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

#### 4. Deploy

**Via Netlify Dashboard:**

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Netlify auto-configures settings
5. Click **"Deploy site"**

**Via Netlify CLI:**

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Features

- **Form handling**: Easy contact forms
- **Functions**: Serverless functions support
- **Split testing**: A/B testing built-in
- **Analytics**: Built-in analytics (paid)

## GitHub Pages

GitHub Pages is free but requires more setup for Next.js.

### Important Limitations

⚠️ **GitHub Pages only supports static exports**. You'll need to:

1. Use `output: 'export'` in `next.config.ts`
2. Lose server-side features (API routes, ISR, etc.)

### Setup

#### 1. Update next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/your-repo-name", // Only if using project pages
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
```

#### 2. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 3. Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **"GitHub Actions"**
3. Push to main branch
4. Site will be live at `https://yourusername.github.io/repo-name/`

## Self-Hosting

Deploy to your own server with PM2 or Docker.

### Option A: PM2 (Process Manager)

#### 1. Build the Application

```bash
npm run build
```

#### 2. Install PM2

```bash
npm install -g pm2
```

#### 3. Create ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: "thestaticweb",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

#### 4. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option B: Docker

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### 3. Build and Run

```bash
docker-compose up -d
```

### Nginx Reverse Proxy

Configure Nginx to proxy to your app:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Setting Up Environment Variables

Create `.env.local` for local development:

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API Keys (never commit these!)
API_SECRET_KEY=your_secret_key
```

### Platform-Specific Setup

**Vercel:**

1. Go to Project Settings → Environment Variables
2. Add variables (production, preview, development)
3. Redeploy for changes to take effect

**Netlify:**

1. Site Settings → Environment Variables
2. Add key-value pairs
3. Trigger new deploy

**GitHub Actions:**

Add to repository secrets:

1. Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

### Best Practices

- ✅ Prefix public variables with `NEXT_PUBLIC_`
- ✅ Never commit `.env.local` to git
- ✅ Use different values for different environments
- ❌ Don't expose API keys to the client

## Custom Domains

### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `myblog.com`)
3. Update DNS records:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel's IP
4. Wait for DNS propagation (5 min - 24 hours)
5. SSL automatically configured! 🎉

### Netlify Custom Domain

1. Site Settings → Domain management
2. Add custom domain
3. Update DNS:
   - Add CNAME to `yoursite.netlify.app`
   - Or use Netlify DNS
4. SSL auto-configured

### Cloudflare (Recommended)

Use Cloudflare for better performance:

1. Add site to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records pointing to your host
4. Enable proxy (orange cloud)
5. Configure SSL (Full or Flexible)

**Benefits:**

- Global CDN
- DDoS protection
- Free SSL
- Faster DNS
- Analytics

## CI/CD Workflows

### Automated Testing Before Deploy

Add to `.github/workflows/test.yml`:

```yaml
name: Test

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### Preview Deployments

Both Vercel and Netlify create preview URLs for pull requests automatically!

**Workflow:**

1. Create feature branch
2. Push changes
3. Open pull request
4. Preview URL automatically generated
5. Test on preview URL
6. Merge to deploy to production

## Performance Optimization

### Before Deploying

1. **Optimize images**: Use WebP format, compress files
2. **Minimize JavaScript**: Remove unused dependencies
3. **Enable caching**: Configure headers properly
4. **Use CDN**: Let platform handle this (Vercel/Netlify)

### After Deploying

Monitor with:

- **Vercel Analytics**: Built-in performance monitoring
- **Google PageSpeed Insights**: Test page speed
- **Lighthouse**: Audit performance, SEO, accessibility

## Troubleshooting Deployment

### Build Fails

```bash
# Test locally first
npm run build

# Common issues:
# 1. TypeScript errors → Fix type issues
# 2. Missing dependencies → Check package.json
# 3. Environment variables → Add to platform
```

### Page Not Loading

- Check build logs for errors
- Verify environment variables are set
- Test production build locally: `npm start`
- Check DNS propagation: `dig yourdomain.com`

### Slow Performance

- Enable caching headers
- Optimize images (use Next/Image)
- Enable CDN (automatic on Vercel/Netlify)
- Minimize JavaScript bundles

## Deployment Checklist

Before deploying to production:

- [ ] Test build locally (`npm run build`)
- [ ] Check for TypeScript errors (`npm run lint`)
- [ ] Test production server (`npm start`)
- [ ] Verify all links work
- [ ] Test on mobile devices
- [ ] Check image loading
- [ ] Set up analytics
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Create backup strategy
- [ ] Monitor performance

## Next Steps

- Read [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
- Check [CUSTOMIZATION.md](./CUSTOMIZATION.md) for branding
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues

Happy deploying! 🚀
