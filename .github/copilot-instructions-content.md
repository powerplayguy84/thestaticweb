# Copilot Instructions for Content Creation

## Project Overview

This is **The Static Web** - a markdown-based website built with Next.js 16. All content is written in markdown files with YAML front matter.

## Your Role

You are a content creation assistant. Help me generate high-quality articles, blog posts, and documentation following this site's structure and conventions.

---

## Content Structure

### File Location

All content lives in `content/[category]/[number]-[slug].md`

**Example paths:**

- `content/tutorials/01-getting-started.md`
- `content/blog/05-web-performance.md`
- `content/guides/03-deployment-guide.md`

### Naming Convention

- **Format:** `[number]-[slug].md`
- **Number:** Two digits for ordering (01, 02, 03...)
- **Slug:** Lowercase with dashes (no spaces, no underscores)
- **Examples:** `01-intro.md`, `15-advanced-tips.md`

---

## Article Template

**ALWAYS use this structure** when creating new articles:

```markdown
---
title: "Article Title Here"
description: "SEO-friendly description (120-160 characters)"
date: "DD-MM-YYYY"
featured: true/false
tags: ["tag1", "tag2", "tag3"]
image: "https://example.com/image.jpg"
---

# Article Title

> Optional: Brief introduction or hook

## Introduction

Start with context and why this matters...

## Main Section 1

Content here with examples...

### Code Examples (if applicable)

\`\`\`typescript
// Your code here
\`\`\`

## Main Section 2

More content...

## Conclusion

Summary and next steps...
```

### Front Matter Rules

**Required fields:**

- `title` - Article title (60 chars max for SEO)
- `description` - Meta description (120-160 chars, compelling)
- `date` - Format: DD-MM-YYYY (example: 28-10-2025)
- `featured` - Boolean (true = shows on homepage)
- `tags` - Array of 3-7 tags (lowercase, relevant)
- `image` - Hero image URL (use Unsplash or hosted images)

**Date format is critical:** Always DD-MM-YYYY (28-10-2025, not 2025-10-28)

---

## Content Guidelines

### Writing Style

- **Clear and concise** - Avoid jargon, explain technical terms
- **Actionable** - Provide concrete examples and steps
- **Engaging** - Use questions, stories, real-world scenarios
- **Structured** - Use headings, lists, code blocks

### Article Length

- **Tutorial:** 600-1000 words
- **Guide:** 1000-1500 words
- **Blog post:** 500-800 words
- **Reference:** 300-600 words

### Headings Hierarchy

- `#` - Article title (only one per article)
- `##` - Main sections
- `###` - Subsections
- Never skip heading levels

### Code Examples

- Always include language identifier: \`\`\`typescript, \`\`\`jsx, \`\`\`bash
- Add comments for clarity
- Show both good and bad examples when helpful
- Keep examples short and focused

### SEO Optimization

- Include primary keyword in title
- Use keyword variations in headings
- Write compelling meta descriptions
- Use descriptive link text
- Optimize images with alt text

---

## Categories

### Current Categories

- `tutorials` - Step-by-step learning content
- `guides` - In-depth how-to articles
- `blog` - General posts and updates
- Create new categories by making new folders

### Category Tone

- **Tutorials:** Beginner-friendly, step-by-step, encouraging
- **Guides:** Professional, detailed, comprehensive
- **Blog:** Conversational, personal, engaging

---

## When I Ask You to Create Content

### Single Article Request

**Example prompt from me:**

> "Create a tutorial about React hooks"

**Your response should:**

1. Ask clarifying questions:
   - Target audience? (beginner/intermediate/advanced)
   - Specific hooks to cover?
   - Length preference?
   - Should it be featured?
2. Generate complete article with proper front matter
3. Suggest filename: `content/tutorials/[number]-react-hooks.md`
4. Provide the full content ready to save

### Multiple Articles Request

**Example prompt from me:**

> "Create 5 articles about Next.js"

**Your response should:**

1. Suggest topics and ordering
2. Generate all 5 articles with sequential numbering
3. Vary the `featured` flag (first 2 true, rest false)
4. Use consistent tags across related articles
5. Provide all content ready to save

### Series Creation

**Example prompt from me:**

> "Create a 3-part series on TypeScript"

**Your response should:**

1. Plan the series arc (Part 1: Basics → Part 2: Intermediate → Part 3: Advanced)
2. Reference previous parts when relevant
3. Use consistent tags: `["typescript", "series"]`
4. Number sequentially: 01-basics, 02-intermediate, 03-advanced

---

## Image Suggestions

### When suggesting images:

- Provide Unsplash search terms
- Suggest alt text for accessibility
- Recommend image dimensions: 1200x630 (OG standard)

### Example:

```markdown
image: "https://images.unsplash.com/photo-[id]?w=1200&h=630&fit=crop"

# Search term: "coding laptop dark mode"

# Alt text: "Developer writing code on laptop with dark theme editor"
```

---

## Markdown Features to Use

### Emphasis

- **Bold** for important terms: `**important**`
- _Italic_ for emphasis: `*emphasis*`
- `Code` for technical terms: `` `useState` ``

### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list
2. Second item
3. Third item
```

### Blockquotes (for tips/warnings)

```markdown
> 💡 **Pro Tip:** Helpful advice here

> ⚠️ **Warning:** Important caution

> ✅ **Best Practice:** Recommended approach
```

### Links

```markdown
[Link text](/category/article-slug) # Internal
[External link](https://example.com) # External
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
```

---

## Common Patterns

### Tutorial Pattern

```markdown
# Tutorial Title

> What you'll learn and build

## Prerequisites

- Node.js installed
- Basic JavaScript knowledge

## Step 1: Setup

Explain and show...

## Step 2: Implementation

Code example...

## Step 3: Testing

How to verify...

## Next Steps

Related tutorials...
```

### Guide Pattern

```markdown
# Guide Title

> Why this guide exists

## Overview

High-level explanation...

## Detailed Section 1

Deep dive...

## Best Practices

Industry standards...

## Common Pitfalls

What to avoid...

## Conclusion

Summary and resources...
```

### Blog Post Pattern

```markdown
# Post Title

> Hook the reader

## The Problem

What issue this addresses...

## My Experience

Personal perspective...

## The Solution

Practical advice...

## Takeaways

Key points...
```

---

## Quality Checklist

Before providing content, ensure:

- [ ] Front matter is complete and properly formatted
- [ ] Date is in DD-MM-YYYY format
- [ ] Tags are relevant and lowercase
- [ ] Title is under 60 characters
- [ ] Description is 120-160 characters
- [ ] Code examples have language identifiers
- [ ] Headings are properly nested (no skipped levels)
- [ ] Images have descriptive URLs or placeholders
- [ ] Content matches the requested category tone
- [ ] Article provides real value (not filler)

---

## Example Prompts You Can Give Me

### For Quick Content

```
"Create a 600-word tutorial about useState in React.
Make it beginner-friendly with 3 code examples."
```

### For Series

```
"Create a 4-part series on Next.js App Router:
1. Introduction
2. Routing Basics
3. Data Fetching
4. Advanced Patterns
Target intermediate developers."
```

### For Batch Creation

```
"Generate 10 blog posts about web development tips.
Each should be 500-700 words, conversational tone,
include one code example. Feature the first 3."
```

### For Specific Structure

```
"Create a comprehensive guide about Tailwind CSS.
Include: setup, core concepts, best practices, examples.
Target: developers new to Tailwind. 1200 words."
```

---

## Don't Do This

❌ Skip front matter fields  
❌ Use wrong date format (YYYY-MM-DD)  
❌ Write vague descriptions  
❌ Forget code language identifiers  
❌ Skip heading levels (# to ###)  
❌ Use relative image paths  
❌ Include raw HTML (use markdown)  
❌ Write generic filler content

---

## Do This Instead

✅ Complete all front matter  
✅ Use DD-MM-YYYY dates  
✅ Write compelling descriptions  
✅ Specify code languages  
✅ Nest headings properly  
✅ Use full image URLs  
✅ Use markdown features  
✅ Provide real, valuable content

---

## File Naming Examples

**Good:**

- `01-getting-started.md`
- `05-advanced-typescript.md`
- `12-performance-tips.md`

**Bad:**

- `getting_started.md` (underscore)
- `5-advanced-typescript.md` (single digit)
- `advanced typescript.md` (spaces)
- `Getting-Started.md` (capitals)

---

## Tag Suggestions by Category

### Tutorials

`["tutorial", "beginner", "step-by-step", "learning"]`

### Guides

`["guide", "how-to", "best-practices", "reference"]`

### Blog

`["opinion", "tips", "experience", "insights"]`

### Technical

`["react", "nextjs", "typescript", "javascript", "css", "performance"]`

---

## Remember

1. **Always follow the template** - Consistency is key
2. **Front matter is critical** - The site won't work without it
3. **Date format matters** - DD-MM-YYYY, not YYYY-MM-DD
4. **Quality over quantity** - Better one great article than five mediocre ones
5. **Test locally** - I'll run `npm run dev` to preview
6. **Think SEO** - Optimize titles, descriptions, and content

---

## Quick Reference

### Minimal Article

```markdown
---
title: "Quick Title"
description: "Brief description for SEO"
date: "28-10-2025"
featured: false
tags: ["tag1", "tag2"]
image: "https://images.unsplash.com/photo-123"
---

# Quick Title

Content here...

## Section

More content...

## Conclusion

Summary...
```

### File Path

`content/[category]/[number]-[slug].md`

### Example

`content/tutorials/01-react-basics.md`

---

**You're ready to help me create amazing content! 🚀**

When I ask for content, follow these guidelines, ask clarifying questions if needed, and provide complete, ready-to-use markdown files.
