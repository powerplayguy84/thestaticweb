# How to Write Articles for The Static Web

This guide covers everything you need to know about writing great articles using Markdown.

## Table of Contents

- [Markdown Basics](#markdown-basics)
- [Front Matter Configuration](#front-matter-configuration)
- [Writing Tips](#writing-tips)
- [Images and Media](#images-and-media)
- [Code Blocks](#code-blocks)
- [Advanced Formatting](#advanced-formatting)

## Markdown Basics

Markdown is a simple way to format text using plain characters. Here's a quick reference:

### Headings

```markdown
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

**Best Practice**: Use only one H1 (`#`) per article—it should be your article title.

### Text Formatting

```markdown
**Bold text**
_Italic text_
**_Bold and italic_**
~~Strikethrough~~
`Inline code`
```

**Example Output:**

- **Bold text**
- _Italic text_
- **_Bold and italic_**
- ~~Strikethrough~~
- `Inline code`

### Lists

**Unordered Lists:**

```markdown
- First item
- Second item
- Third item
  - Nested item
  - Another nested item
```

**Ordered Lists:**

```markdown
1. First step
2. Second step
3. Third step
   1. Sub-step
   2. Another sub-step
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover text")
[Internal link](/tutorials/another-article)
```

### Blockquotes

```markdown
> This is a quote.
> It can span multiple lines.
>
> — Author Name
```

**Renders as:**

> This is a quote.
> It can span multiple lines.
>
> — Author Name

### Horizontal Rules

```markdown
---
```

or

```markdown
---
```

## Front Matter Configuration

Every article **must** start with YAML front matter:

```yaml
---
title: "Your Article Title"
description: "A compelling description that appears in previews"
date: "2025-10-28"
featured: false
tags: ["nextjs", "javascript"]
---
```

### Field Reference

| Field         | Type    | Required | Description                                     |
| ------------- | ------- | -------- | ----------------------------------------------- |
| `title`       | string  | ✅ Yes   | Article title (appears as H1 and in cards)      |
| `description` | string  | ✅ Yes   | Brief summary (SEO and preview cards)           |
| `date`        | string  | ✅ Yes   | Publication date (format: `YYYY-MM-DD`)         |
| `featured`    | boolean | ❌ No    | Show on homepage (default: `false`)             |
| `tags`        | array   | ❌ No    | List of tags (e.g., `["tutorial", "beginner"]`) |

### Front Matter Examples

**Simple Tutorial:**

```yaml
---
title: "Getting Started with TypeScript"
description: "Learn TypeScript basics in 10 minutes"
date: "2025-10-28"
featured: true
tags: ["typescript", "tutorial", "beginner"]
---
```

**Guide Without Tags:**

```yaml
---
title: "Deployment Best Practices"
description: "How to deploy your Next.js app to production"
date: "2025-10-27"
featured: false
---
```

**Featured Article:**

```yaml
---
title: "Building a Full-Stack App with Next.js"
description: "Complete guide to building modern web applications"
date: "2025-10-28"
featured: true
tags: ["nextjs", "react", "fullstack", "advanced"]
---
```

## Writing Tips

### 1. Start with a Strong Introduction

Begin with a brief paragraph that explains:

- What the article is about
- Who it's for
- What the reader will learn

**Example:**

```markdown
# Building Your First API

This tutorial teaches you how to create RESTful APIs using Next.js.
Perfect for beginners with basic JavaScript knowledge. By the end,
you'll have a working API that handles CRUD operations.
```

### 2. Use Descriptive Headings

Break your content into sections with clear headings:

```markdown
## Prerequisites

## Step 1: Setup

## Step 2: Implementation

## Troubleshooting

## Next Steps
```

### 3. Write in Second Person

Talk directly to the reader using "you":

✅ Good: "You will create a new component..."
❌ Avoid: "We will create..." or "One creates..."

### 4. Keep Paragraphs Short

- Aim for 2-4 sentences per paragraph
- Use line breaks for readability
- Break up long sections with headings

### 5. Use Examples Liberally

Show, don't just tell:

````markdown
## Bad Example ❌

To create a variable, use the const keyword.

## Good Example ✅

To create a variable, use the `const` keyword:

\```javascript
const userName = "Alice";
const userAge = 28;
\```
````

## Images and Media

### Adding Images

**Local Images** (stored in `public/images/`):

```markdown
![Alt text](/images/screenshot.png)
```

**External Images:**

```markdown
![Alt text](https://example.com/image.jpg)
```

**Images with Captions:**

```markdown
![Dashboard screenshot](/images/dashboard.png)
_Figure 1: The main dashboard interface_
```

### Image Best Practices

1. **Always include alt text** for accessibility
2. **Use descriptive filenames**: `user-dashboard.png` not `img123.png`
3. **Optimize image sizes**: Use WebP or compressed JPEGs
4. **Keep images under 500KB** when possible

### Video Embeds

You can embed YouTube videos using HTML:

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0"
  allowfullscreen
>
</iframe>
```

## Code Blocks

### Inline Code

Use single backticks for inline code:

```markdown
The `useState` hook is used for state management.
```

### Code Blocks with Syntax Highlighting

Use triple backticks with a language identifier:

````markdown
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```
````

### Supported Languages

- `javascript` / `js`
- `typescript` / `ts`
- `jsx` / `tsx`
- `python`
- `bash` / `shell`
- `css`
- `html`
- `json`
- `markdown` / `md`

### Code Block Best Practices

**✅ Good - With Language:**

````markdown
```typescript
interface User {
  name: string;
  age: number;
}
```
````

**❌ Avoid - No Language:**

````markdown
```
interface User {
  name: string;
  age: number;
}
```
````

**✅ Good - With Comments:**

````markdown
```javascript
// Create a new user object
const user = {
  name: "Alice",
  age: 28,
};

// Log to console
console.log(user);
```
````

## Advanced Formatting

### Tables

```markdown
| Feature  | Supported | Notes                 |
| -------- | --------- | --------------------- |
| Markdown | ✅ Yes    | Full support          |
| HTML     | ✅ Yes    | Limited tags          |
| JSX      | ❌ No     | Requires custom setup |
```

**Alignment:**

```markdown
| Left | Center | Right |
| :--- | :----: | ----: |
| A    |   B    |     C |
```

### Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

**Renders as:**

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Footnotes

```markdown
Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.
```

### Definition Lists

```markdown
Term 1
: Definition 1

Term 2
: Definition 2a
: Definition 2b
```

### Embedded HTML

You can use HTML for advanced formatting:

```html
<div style="padding: 1rem; background: #f0f0f0; border-radius: 8px;">
  <strong>Note:</strong> This is an important callout!
</div>
```

## Writing Workflow

### 1. Plan Your Article

- Outline main sections
- Identify key concepts
- Gather code examples

### 2. Write Front Matter

```yaml
---
title: "Your Title Here"
description: "Your description"
date: "2025-10-28"
featured: false
tags: ["tag1", "tag2"]
---
```

### 3. Write Content

- Start with introduction
- Build sections progressively
- Include examples and screenshots

### 4. Preview Locally

```bash
npm run dev
# Visit http://localhost:3000/category/your-article
```

### 5. Review and Edit

- Check all links work
- Verify images load
- Test code examples
- Proofread for typos

### 6. Publish

```bash
git add .
git commit -m "Add article: Your Title"
git push
```

## Markdown Cheat Sheet

| Element         | Syntax                  |
| --------------- | ----------------------- |
| Heading         | `# H1` `## H2` `### H3` |
| Bold            | `**bold**`              |
| Italic          | `*italic*`              |
| Link            | `[text](url)`           |
| Image           | `![alt](url)`           |
| Code            | `` `code` ``            |
| Code Block      | ` ```lang `             |
| List            | `- item`                |
| Ordered List    | `1. item`               |
| Quote           | `> quote`               |
| Horizontal Rule | `---`                   |

## Common Mistakes to Avoid

### ❌ Missing Front Matter

```markdown
# My Article

Content here...
```

**Fix:** Always start with front matter.

### ❌ Wrong Date Format

```yaml
date: "10/28/2025"  # Wrong
date: "Oct 28, 2025"  # Wrong
```

**Fix:** Use `YYYY-MM-DD` format:

```yaml
date: "2025-10-28" # Correct
```

### ❌ No Alt Text on Images

```markdown
![](/images/screenshot.png)
```

**Fix:** Always add descriptive alt text:

```markdown
![Dashboard showing user analytics](/images/screenshot.png)
```

### ❌ Unclosed Code Blocks

````markdown
```javascript
const x = 5;
```
````

**Fix:** Always close with triple backticks:

````markdown
```javascript
const x = 5;
```
````

## Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)

## Next Steps

- Read [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for content organization
- Check [CUSTOMIZATION.md](./CUSTOMIZATION.md) for styling options
- Explore [QUICK_START.md](./QUICK_START.md) for quick reference

Happy writing! ✨
