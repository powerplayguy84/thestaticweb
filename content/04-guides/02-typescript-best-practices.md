---
title: "TypeScript Best Practices in Next.js"
description: "Write type-safe Next.js applications"
date: "25-10-2025"
featured: false
tags: ["typescript", "nextjs", "best-practices"]
---

<!--
  ⚠️ EXAMPLE CONTENT
  This is a sample article for demonstration purposes.
  Replace with your own content or delete this file.
-->

# TypeScript Best Practices in Next.js

TypeScript ensures your code is type-safe and catches errors before runtime.

## Enable Strict Mode

In `tsconfig.json`, enable strict mode:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Type Your Props

Always type component props:

```typescript
interface CardProps {
  title: string;
  description: string;
  featured?: boolean;
}

export default function Card({ title, description, featured }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {featured && <span>Featured</span>}
    </div>
  );
}
```

## Type Function Returns

Be explicit about function return types:

```typescript
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}
```

## Use Generics

Generics make reusable, type-safe functions:

```typescript
function getValue<T>(obj: T, key: keyof T): T[key] {
  return obj[key];
}
```

## Server Component Types

For Server Components, import types from `next`:

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page",
};
```

Type safety makes refactoring and maintenance easier!
