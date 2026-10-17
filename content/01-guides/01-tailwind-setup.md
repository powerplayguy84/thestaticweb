---
title: "Setting Up Tailwind CSS v4"
description: "Master the simplified setup and powerful features of Tailwind CSS v4 in Next.js"
date: "25-11-2025"
featured: true
tags: ["tailwind", "css", "setup", "styling"]
image: "https://made-byshape.transforms.svdcdn.com/production/uploads/images/tailwind-thumb.jpg?w=400&q=80&fm=webp&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1609771799&s=f4f2d93d9e2c9cf40b964258bf5cd4b1"
---

<!--
  ⚠️ EXAMPLE CONTENT
  This is a sample article for demonstration purposes.
  Replace with your own content or delete this file.
-->

| Feature       | Supported | Notes                    |
| ------------- | --------- | ------------------------ |
| Tables        | ✅        | Via remark-gfm           |
| Images        | ✅        | Inline & frontmatter     |
| Code blocks   | ✅        | With syntax highlighting |
| Task lists    | ✅        | `- [ ]` and `- [x]`      |
| Strikethrough | ✅        | `~~text~~`               |

# Setting Up Tailwind CSS v4

Tailwind CSS v4 represents a major evolution in utility-first CSS, bringing significant improvements, a simplified setup process, and enhanced performance. This guide walks you through everything you need to get started.

## Why Tailwind CSS v4?

Tailwind v4 introduces:

- **Simplified configuration** - Less boilerplate, more intuitive setup
- **Better performance** - Optimized CSS generation and smaller bundle sizes
- **Enhanced utilities** - New features and improved defaults
- **Improved developer experience** - Faster builds and better tooling

## Installation

Getting started is straightforward. Install Tailwind CSS as a development dependency:

```bash
npm install -D @tailwindcss/postcss
```

This is all you need for a basic setup—no heavy dependencies required!

## Configuration

### PostCSS Setup

Update your `postcss.config.mjs` to register the Tailwind plugin:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcis": {},
  },
};
```

The `@tailwindcss/postcss` plugin handles all the heavy lifting, processing your CSS and generating utility classes on demand.

## Global Styles

### Importing Tailwind

In your root CSS file (`src/app/globals.css`), import Tailwind:

```css
@import "tailwindcss";
```

This single import gives you access to all Tailwind utilities, components, and utilities throughout your entire application.

## Using Tailwind Classes

### Basic Example

Here's a practical component using Tailwind utilities:

```tsx
<div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg shadow">
  <h1 className="text-2xl font-bold text-slate-900">Hello Tailwind</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
    Click me
  </button>
</div>
```

### Responsive Design

Tailwind makes responsive design elegant with mobile-first prefixes:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3 p-4 md:p-6 lg:p-8">
  <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
    Responsive Heading
  </h2>
</div>
```

## Key Features

### Responsive Design

- **Mobile-first approach**: Start with base styles, add `sm:`, `md:`, `lg:`, `xl:` prefixes for larger screens
- **Breakpoints**: Easily target different screen sizes without media queries

### Dark Mode

- Add `dark:` prefix to any utility for dark mode support
- Example: `bg-white dark:bg-slate-900`

### Custom Theming

Extend the default theme in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: "#FF6B6B",
      },
    },
  },
};
```

### Hover & Interactive States

- `hover:` - hover effects
- `focus:` - focus states
- `active:` - active states
- `disabled:` - disabled states

## Best Practices

### ✅ Do's

- **Keep it minimal** - Use the default color palette when possible
- **Use semantic utilities** - `flex`, `grid`, `gap` over custom CSS
- **Leverage composability** - Combine utilities for complex layouts
- **Follow mobile-first** - Design for small screens first

### ❌ Don'ts

- **Avoid custom CSS** - Use `@apply` sparingly, prefer utility composition
- **Don't hardcode colors** - Use theme colors and extend when needed
- **Avoid `!important`** - Specificity issues signal poor patterns

## Performance Tips

1. **Purge unused styles** - Tailwind automatically detects used classes
2. **Use CSS variables** - For dynamic theming without rebuilding
3. **Minimize custom plugins** - Keep your setup lean and fast
4. **Bundle optimization** - Let Tailwind's purging handle it

## Next Steps

- Explore the [official Tailwind documentation](https://tailwindcss.com)
- Learn about [Tailwind plugins](https://tailwindcss.com/docs/plugins)
- Discover [shadcn components](https://ui.shadcn.com/) for pre-built UI elements

---

Tailwind CSS v4 makes building beautiful, responsive interfaces fast and enjoyable. Start small, embrace the utility-first approach, and watch your development speed soar!
