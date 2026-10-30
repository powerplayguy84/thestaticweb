# Customization Guide

Learn how to customize The Static Web to match your brand and preferences.

## Table of Contents

- [Homepage Configuration](#homepage-configuration)
- [Theme and Styling](#theme-and-styling)
- [Navigation](#navigation)
- [Components](#components)
- [Adding New Pages](#adding-new-pages)
- [Advanced Customization](#advanced-customization)

## Homepage Configuration

The homepage is configured via `content/homepage.md`:

```yaml
---
title: "Oh La La"
subtitle: "Explore Modern Web Development"
description: "A collection of articles, tutorials, and guides for modern web development. Built with Next.js and Markdown."
image: "https://translate.how/i/bicycle.webp"
navbar:
  title: "The Static Web"
  logo: ""
cta:
  text: "Start Reading"
  link: "/guides/tailwind-setup"
---
```

### Configuration Fields

| Field          | Description                | Example                       |
| -------------- | -------------------------- | ----------------------------- |
| `title`        | Main homepage heading      | `"Welcome to My Blog"`        |
| `subtitle`     | Subheading below title     | `"Thoughts on tech and life"` |
| `description`  | SEO meta description       | `"My personal blog about..."` |
| `image`        | Hero image URL             | `"/images/hero.jpg"`          |
| `navbar.title` | Site name in navigation    | `"My Blog"`                   |
| `navbar.logo`  | Logo URL (optional)        | `"/logo.svg"`                 |
| `cta.text`     | Call-to-action button text | `"Get Started"`               |
| `cta.link`     | CTA button link            | `"/tutorials"`                |

### Example Customizations

**Minimal Homepage:**

```yaml
---
title: "Tech Blog"
subtitle: "Learning in public"
description: "My journey learning web development"
navbar:
  title: "Tech Blog"
cta:
  text: "Read Articles"
  link: "/tutorials"
---
```

**Professional Portfolio:**

```yaml
---
title: "John Doe"
subtitle: "Software Engineer & Writer"
description: "Technical articles and tutorials about full-stack development"
image: "/images/profile.jpg"
navbar:
  title: "JD"
  logo: "/logo.svg"
cta:
  text: "View Work"
  link: "/portfolio"
---
```

## Theme and Styling

The Static Web uses Tailwind CSS v4 for styling. All theme configuration is in `content/theme.md`.

### Theme File Structure

Located at `content/theme.md`:

```yaml
---
theme:
  colors:
    primary: "#0070f3"
    secondary: "#ff4081"
  fonts:
    heading: "Inter"
    body: "System UI"
---
```

### Customizing Colors

Edit `src/app/globals.css` to change the color scheme:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* Add more color variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* Dark mode colors */
  }
}
```

### Using Custom Fonts

1. **Add Google Fonts** in `src/app/layout.tsx`:

```typescript
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

2. **Update Tailwind config** (if using `tailwind.config.ts`):

```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
};
```

### Custom Styling

Add custom styles in `src/app/globals.css`:

```css
/* Custom article styles */
.article-content h2 {
  @apply text-3xl font-bold mt-8 mb-4;
}

.article-content p {
  @apply mb-4 leading-relaxed;
}

.article-content code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm;
}
```

## Navigation

### Customizing the Navigation Bar

Edit `src/components/Navigation.tsx` to customize the navigation:

**Current structure:**

```typescript
export function Navigation() {
  const categories = getAllCategories();

  return (
    <nav>
      <Link href="/">Home</Link>
      {categories.map((cat) => (
        <Link key={cat} href={`/${cat}`}>
          {cat}
        </Link>
      ))}
    </nav>
  );
}
```

**Add custom links:**

```typescript
export function Navigation() {
  const categories = getAllCategories();

  return (
    <nav>
      <Link href="/">Home</Link>
      {categories.map((cat) => (
        <Link key={cat} href={`/${cat}`}>
          {cat}
        </Link>
      ))}
      {/* Custom links */}
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### Mobile Navigation

Mobile navigation is handled by `src/components/MobileNav.tsx`. Customize it similarly:

```typescript
export function MobileNav() {
  return (
    <Sheet>
      {/* Add custom mobile menu items */}
      <Link href="/about">About</Link>
      <Link href="/newsletter">Newsletter</Link>
    </Sheet>
  );
}
```

## Components

### Article Card

Located at `src/components/ArticleCard.tsx`. Customize how articles appear in listings:

```typescript
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      {/* Add image thumbnail */}
      {article.image && <img src={article.image} alt={article.title} />}

      <h3>{article.title}</h3>
      <p>{article.description}</p>

      {/* Add reading time */}
      <span>{article.readingTime} min read</span>

      {/* Add author */}
      {article.author && <span>By {article.author}</span>}
    </Card>
  );
}
```

### Related Articles Sidebar

Customize `src/components/RelatedArticles.tsx`:

```typescript
export function RelatedArticles({ articles }: { articles: Article[] }) {
  return (
    <aside>
      <h3>You Might Also Like</h3>
      {articles.slice(0, 5).map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
    </aside>
  );
}
```

## Adding New Pages

### Static Pages

Create new pages in `src/app/`:

**About Page** (`src/app/about/page.tsx`):

```typescript
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>
      <p className="text-lg mb-4">
        Hi! I'm a developer who loves building web applications...
      </p>
    </div>
  );
}
```

**Contact Page** (`src/app/contact/page.tsx`):

```typescript
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Get In Touch</h1>
      <form>{/* Contact form fields */}</form>
    </div>
  );
}
```

### Metadata for SEO

Add metadata to any page:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | My Blog",
  description: "Learn more about me and my blog",
};

export default function AboutPage() {
  return <div>About content...</div>;
}
```

## Advanced Customization

### Adding Search Functionality

Create `src/components/Search.tsx`:

```typescript
"use client";

import { useState } from "react";
import { getAllArticles } from "@/lib/markdown";

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (q: string) => {
    setQuery(q);
    const articles = getAllArticles();
    const filtered = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.description.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search articles..."
      />
      {results.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
```

### Adding Tags/Categories Page

Create `src/app/tags/[tag]/page.tsx`:

```typescript
import { getAllArticles } from "@/lib/markdown";
import { ArticleCard } from "@/components/ArticleCard";

export default function TagPage({ params }: { params: { tag: string } }) {
  const articles = getAllArticles().filter((a) => a.tags?.includes(params.tag));

  return (
    <div>
      <h1>Articles tagged with "{params.tag}"</h1>
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
```

### Analytics Integration

Add Google Analytics in `src/app/layout.tsx`:

```typescript
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Newsletter Signup

Create `src/components/Newsletter.tsx`:

```typescript
"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter service integration
    console.log("Subscribing:", email);
  };

  return (
    <form onSubmit={handleSubmit} className="my-8">
      <h3 className="text-xl font-bold mb-4">Subscribe to Newsletter</h3>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
```

## Environment Variables

Create `.env.local` for sensitive configuration:

```env
# Analytics
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX

# Newsletter
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_LIST_ID=your_list_id

# Social
NEXT_PUBLIC_TWITTER_HANDLE=@yourhandle
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
```

Access in components:

```typescript
const gaId = process.env.NEXT_PUBLIC_GA_ID;
```

## Deployment Configuration

### Vercel

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [{ "source": "/blog/:path*", "destination": "/:path*" }]
}
```

### Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Tips and Best Practices

1. **Keep customizations modular**: Create reusable components
2. **Use TypeScript**: Maintain type safety for props and data
3. **Test locally**: Always run `npm run dev` to preview changes
4. **Version control**: Commit changes frequently
5. **Performance**: Optimize images and lazy-load components
6. **Accessibility**: Ensure all customizations are accessible

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Next Steps

- Check [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
- Read [HOW_TO_WRITE.md](./HOW_TO_WRITE.md) for content creation
- Explore [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for content management

Happy customizing! 🎨
