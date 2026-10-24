# Design System: The Minimalist Studio Monograph

> Design specification and UI guidelines for **The Static Web**.  
> Blends a high-impact personal portfolio & showcase with a distraction-free, beautifully typeset article and writing reader.

---

## 1. Design Philosophy

- **Clean, Modern & Exciting**: Minimalist layout architecture with editorial clarity and modern visual punch.
- **Content-First Typography**: High readability with tight-tracked sans headings, generous line heights for body copy, and subtle metadata accents.
- **Micro-Interactivity**: Tactile card scaling, glowing hover highlights, smooth transitions, and seamless dark/light mode switching.
- **Zero Decorative Fluff**: Every visual element serves navigation, context, or comprehension. No fake borders, unearned gradients, or redundant headers.

---

## 2. Typography System

The site uses **Geist** for crisp geometric clarity paired with **Geist Mono** for developer metadata.

| Role | Font Family | Weight / Tracking | Use Cases |
| :--- | :--- | :--- | :--- |
| **Display / Hero** | `var(--font-geist-sans)` | `font-bold tracking-tight` (`text-4xl` to `text-6xl`) | Main landing page headline, 404 display |
| **Section Headings** | `var(--font-geist-sans)` | `font-bold tracking-tight` (`text-2xl` to `text-3xl`) | "Featured Highlights", "Articles & READMEs" |
| **Article Titles** | `var(--font-geist-sans)` | `font-bold tracking-tight` (`text-3xl` to `text-5xl`) | Article reader header |
| **Subheadings (h2–h4)**| `var(--font-geist-sans)` | `font-semibold tracking-tight` | In-article markdown headings |
| **Body Copy** | `var(--font-geist-sans)` | `font-normal text-base leading-relaxed` | Article prose, descriptions |
| **Metadata** | `var(--font-geist-mono)` | `font-mono text-xs tracking-wider uppercase` | Dates, category counters, tags |

---

## 3. Color & Theme Tokens

The theme utilizes **OKLCH** color spaces for perceptually uniform lightness across light and dark modes.

### Surface Roles

| Token | Light Mode (Default) | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(1 0 0)` (Pure white) | `oklch(0.145 0 0)` (Deep obsidian) | Page backplane |
| `--foreground` | `oklch(0.145 0 0)` (Rich dark) | `oklch(0.985 0 0)` (Crisp white) | Primary typography |
| `--card` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Card containers |
| `--border` | `oklch(0.922 0 0)` | `oklch(0.312 0.021 252.42)` | Hairline dividers & borders |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.656 0.016 252.419)` | Secondary captions & dates |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | Key CTA buttons & accents |

### Ambient Atmosphere

- `.ambient-mesh`: Subtle radial gradients in blue (`rgba(59, 130, 246, ...)`) and emerald (`rgba(16, 185, 129, ...)`) positioned off-screen to provide depth without visual noise.
- `::selection`: High-contrast inversion (`bg-foreground text-background`) for an intentional reading feel.
- `caret-color`: Explicitly mapped to `var(--color-foreground)`.

---

## 4. Spacing & Layout Architecture

- **Page Max-Width**: `max-w-3xl lg:max-w-4xl` (gives cards and grids breathing room on desktop displays).
- **Article Reading Line Length**: `max-w-3xl` (optimal reading measure of ~65–75 characters per line).
- **Navigation Height**: Compact `py-3.5` with `backdrop-blur-xl` and `border-b border-border/40`.
- **Card Aspect Ratio**: `16:10` for featured previews with subtle corner badges.

---

## 5. Key UI Components

### 1. Navigation Bar
- **Monogram Logo**: Modern `TS` monogram badge next to bold `TSW` tracking-tight title.
- **Hairline Border**: Soft `border-border/40` separating the navigation smoothly from page content.
- **Unified Actions**: Compact search modal trigger (`⌘K`) and light/dark theme toggle.

### 2. Homepage Hero
- **Uncluttered Typography**: Bold modern heading and crisp subtitle without intrusive badges.
- **Value Proposition**: Clear, punchy description highlighting portfolio and publishing capability.
- **Primary CTA**: Direct `Explore` button smoothly navigating to the content collection.

### 3. Featured Section
- **Curated Cards**: 16:10 aspect ratio image containers with hover scale (`group-hover:scale-[1.03]`).
- **Metadata**: Clean publication date and category badge.

### 4. Categorized Feed & Collection
- **"All" Default**: Universal filter pill allowing visitors to view everything in chronological order.
- **Category Counts**: Numerical badge on each filter pill showing available item counts.
- **Editorial Card Layout**: Responsive split view with metadata, title, description, and thumbnail preview.

### 5. Article Reader Experience
- **Deduplicated H1s**: Markdown H1 headers that duplicate the article title are cleaned automatically.
- **Modern Markdown Headings**: Sans typography with tight letter spacing replacing outdated serifs.
- **Dynamic Table of Contents**:
  - Desktop: Clean sticky sidebar navigation on viewports `>= 1024px`.
  - Mobile / Tablet: Floating "Contents" pill button opening a full drawer sheet.
- **Developer Enhancements**: Syntax-highlighted code blocks with one-click copy and Mermaid diagram support.

---

## 6. Verification & Quality Assurance

- **Impeccable Mechanical Detector**: Checked against craft-floor rules (`0` violations).
- **Color Contrast**: All text elements adhere to WCAG AA (>= 4.5:1 ratio).
- **Responsive Adaptability**: Thoroughly verified across mobile, tablet, and wide desktop viewports.
