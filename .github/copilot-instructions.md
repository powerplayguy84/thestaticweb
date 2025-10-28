# Copilot Instructions for thestaticweb

## Project Overview

**thestaticweb** is a Next.js 16 web application with a minimalist setup. It uses TypeScript, Tailwind CSS v4, and ESLint 9 for code quality.

### Tech Stack

- **Framework**: Next.js 16.0.0 with App Router
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **Linting**: ESLint 9 with Next.js core-web-vitals and TypeScript config
- **React**: React 19.2.0

## Architecture & Key Patterns

### App Router Structure

- All routes and pages live in `src/app/` (not `pages/`)
- Root layout at `src/app/layout.tsx` exports React Server Components by default
- Metadata is defined using the `Metadata` type from `next`
- Use file-based routing: `page.tsx` for routes, `layout.tsx` for layouts

### Import Aliases

- Path alias `@/*` maps to `src//*` (defined in `tsconfig.json`)
- **Always use** `@/` prefix for internal imports, never relative paths in components

**Example**: Import from `@/components/Header` not `../../../components/Header`

### Styling & Component Approach

- **Tailwind CSS v4** is the only styling method (via `@tailwindcss/postcss`)
- Global styles in `src/app/globals.css` (imported in root layout)
- Custom fonts (Geist and Geist Mono) are pre-configured with CSS variables
- **Use only shadcn components** for UI - import from `@/components/ui/*` without any modifications or extra classNames
- **Use shadcn icons** (lucide-react) for all icons - import from `lucide-react`
- **Mobile-first UX**: Design for mobile screens first, then scale up for larger viewports using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.)
- **Minimal Design Philosophy**: Keep UI simple and clean; avoid decorative elements. This approach enables future theming flexibility by maintaining clean semantic markup and predictable styling
- **Theme-Ready**: Use shadcn's semantic colors only (`bg-primary`, `text-muted-foreground`, `border-input`, etc.); never hardcode color values or use custom color tokens

### Type Safety

- **Strict mode enabled** in `tsconfig.json` (`"strict": true`)
- All React components must have explicit return types or use `React.ReactNode`
- Server Components are the default; mark client components with `"use client"` directive

## Development Workflows

### Running the Application

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build
npm start          # Start production server
npm run lint       # Run ESLint on all files
```

### Adding New Pages

1. Create `src/app/[route]/page.tsx`
2. Export `default` function as a Server Component (or add `"use client"` if needed)
3. Use `@/` imports for any utilities or components
4. Apply Tailwind classes for styling

### Code Quality

- **ESLint config** extends `eslint-config-next/core-web-vitals` and TypeScript rules
- Ignored paths: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Run `npm run lint` before committing

## Critical Integration Points

### Next.js Configuration

- `next.config.ts` is the entry point for Next.js customization
- Currently has no custom config; add experimental features or redirects here

### PostCSS Pipeline

- Configured in `postcss.config.mjs` with `@tailwindcss/postcss` plugin
- No custom PostCSS plugins in use; keep it minimal for Tailwind v4

### Font Optimization

- Fonts (`Geist`, `Geist_Mono`) are auto-imported from `next/font/google`
- CSS variables stored in `--font-geist-sans` and `--font-geist-mono`
- Applied via className variables in root layout

## Developer Conventions

1. **File Naming**: Use PascalCase for components (`Header.tsx`), kebab-case for utilities
2. **Component Pattern**: Server Components by default; use `"use client"` only for interactivity
3. **No CSS Modules**: All styling is Tailwind; avoid `.module.css` files
4. **Imports**: Always use `@/` alias; ESLint enforces this via Next.js config
5. **Type Exports**: Re-export types from `next` (e.g., `Metadata`) as needed
6. **shadcn Components**: Use unmodified shadcn components; never add custom classNames or override styles
7. **Icons**: Always use lucide-react icons (shadcn icons package) - e.g., `import { ChevronDown } from "lucide-react"`
8. **Responsive Design**: Start with mobile base styles, then add `sm:`, `md:`, `lg:` prefixes for larger screens

## Quick Checklist for New Work

- [ ] Use TypeScript with explicit types
- [ ] Follow `@/` import alias convention
- [ ] Apply styling only via Tailwind utility classes
- [ ] Mark interactive components with `"use client"`
- [ ] Run `npm run lint` to validate code
- [ ] Test locally with `npm run dev`
