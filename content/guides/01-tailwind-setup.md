---
title: "Setting Up Tailwind CSS v4"
description: "Configure Tailwind CSS v4 in your Next.js project"
date: "2025-10-18"
featured: true
tags: ["tailwind", "css", "setup"]
image: "https://www.prioritybicycles.com/cdn/shop/files/600_hero_May2024_1of1.jpg?v=1716221309"
---

# Setting Up Tailwind CSS v4

Tailwind CSS v4 brings significant improvements and a simplified setup process.

## Installation

First, install Tailwind CSS:

```bash
npm install -D @tailwindcss/postcss
```

## Configuration

Update your `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Global Styles

In `src/app/globals.css`, import Tailwind:

```css
@import "tailwindcss";
```

## Using Tailwind Classes

Now you can use Tailwind utility classes:

```tsx
<div className="flex items-center justify-between p-4 bg-slate-100">
  <h1 className="text-2xl font-bold">Hello Tailwind</h1>
</div>
```

## Key Features

- **Responsive design**: Use `sm:`, `md:`, `lg:` prefixes
- **Dark mode**: Add `dark:` prefix
- **Custom colors**: Extend the theme in `tailwind.config.ts`

## Best Practices

- Keep custom styles minimal
- Use the default color palette
- Prefer utility classes over custom CSS

Tailwind makes styling fast and consistent!
