# Thumbnail Image Support

## Overview

The blog system now supports thumbnail images for articles. Featured articles display beautifully on the homepage (`/`) and category pages with optimized image rendering.

## How to Add Images to Articles

### 1. Add Image URL to Front Matter

In your markdown file's front matter, add an `image` field with a URL to your thumbnail:

```yaml
---
title: "My Article Title"
description: "Article description"
date: "2025-10-20"
featured: true
image: "https://images.unsplash.com/photo-...?w=800&h=400&fit=crop"
tags: ["tag1", "tag2"]
---
```

### 2. Image Requirements

- **Field Name**: `image`
- **Type**: Optional string (articles without images still display normally)
- **URL**: Must be a valid HTTPS URL
- **Recommended Size**: 800x400 pixels or similar 2:1 aspect ratio
- **Format**: JPEG, PNG, WebP, or other web-friendly formats

### 3. Where Images Display

- **Homepage (`/`)**: Featured article cards show thumbnail above title
- **Category Pages** (`/[category]`): All articles in that category show thumbnails
- **Individual Article Pages** (`/[category]/[slug]`): Thumbnail displays at top of article (optional, can be added)

## Implementation Details

### Updated Files

1. **`src/lib/markdown.ts`**

   - Added `image?: string` field to `Article` interface
   - `ArticleMetadata` type automatically includes the image field

2. **`src/components/ArticleCard.tsx`**
   - Added Next.js `Image` component for optimized image rendering
   - Conditional rendering: only shows image if `article.image` is provided
   - Responsive sizing with `sizes` prop for different screen widths
   - Smooth hover effect with `scale-105` transform on image

### Image Optimization

- Uses Next.js `Image` component for automatic optimization
- Lazy loading by default
- Responsive image sizing based on device viewport
- WebP format served where supported
- Proper aspect ratio maintained with `object-cover`

## Sample Articles with Images

The following sample articles now include thumbnail images:

- `content/tutorials/01-getting-started.md` - Next.js thumbnail
- `content/tutorials/02-routing-basics.md` - Routing thumbnail
- `content/guides/01-tailwind-setup.md` - Tailwind thumbnail (already included)

## Styling

The image container:

- **Height**: 192px (12rem) on all screen sizes
- **Background**: Light gray (`bg-slate-100`) while loading
- **Hover Effect**: Slight zoom (scale-105) on hover with smooth transition
- **Responsive**: Full width of card on mobile, scales with grid on larger screens

## Example Front Matter

```yaml
---
title: "Getting Started with Next.js"
description: "Learn the basics of Next.js and how to build your first app"
date: "2025-10-20"
featured: true
image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop"
tags: ["nextjs", "beginner"]
---
```

## Image Sources

Recommended free image sources:

- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)
- [Placeholder.com](https://placeholder.com) (for testing)

## Verification

✅ Build: `npm run build` - All 10 routes compile successfully
✅ Linting: `npm run lint` - 0 errors, 0 warnings
✅ TypeScript: Strict mode enabled, no type errors
✅ Featured articles display thumbnails on homepage
✅ Category pages display article thumbnails in grid
✅ Responsive image sizing on all devices
