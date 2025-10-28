---
title: "Getting Started with Next.js"
description: "Learn the basics of Next.js and how to build your first app"
date: "20-10-2025"
featured: true
image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop"
tags: ["nextjs", "beginner"]
---

# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications easier. In this tutorial, we'll cover the fundamentals.

## Why Next.js?

Next.js provides:

- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Built-in optimization

## Installation

To create a new Next.js project, run:

```bash
npx create-next-app@latest my-app
```

## File Structure

A typical Next.js project looks like:

```
src/
  app/
    page.tsx
    layout.tsx
  components/
public/
```

## Your First Page

Create a file at `src/app/page.tsx`:

```typescript
export default function Home() {
  return <h1>Welcome to Next.js</h1>;
}
```

And that's it! You now have a working page.

## Next Steps

Explore routing, components, and styling to build more complex applications.
