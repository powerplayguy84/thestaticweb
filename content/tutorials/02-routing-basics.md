---
title: "Routing Basics in Next.js"
description: "Master file-based routing in the App Router"
date: "22-10-2025"
featured: true
image: "https://images.unsplash.com/photo-1628626983867-60a28444af0a?w=800&h=400&fit=crop"
tags: ["nextjs", "routing"]
---

# Routing Basics in Next.js

Next.js uses a file-based routing system. Every file in the `app/` directory automatically becomes a route.

## File-Based Routing

| File                     | Route                      |
| ------------------------ | -------------------------- |
| `app/page.tsx`           | `/`                        |
| `app/about/page.tsx`     | `/about`                   |
| `app/blog/[id]/page.tsx` | `/blog/1`, `/blog/2`, etc. |

## Dynamic Routes

Create dynamic segments with square brackets:

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

## Layouts

Layouts wrap multiple pages and persist across navigation:

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Link Navigation

Use the `Link` component for client-side navigation:

```typescript
import Link from "next/link";

export default function Navigation() {
  return <Link href="/about">About</Link>;
}
```

That's routing in a nutshell!
