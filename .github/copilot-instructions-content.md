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

### ⚠️ CRITICAL: File Numbering Rules

**BEFORE creating ANY new article:**

1. **Check existing files** in the target category folder
2. **Find the highest number** currently in use
3. **Add 1 to that number** for your new file
4. **NEVER duplicate numbers** - each file must have a unique number

**Example workflow:**

```
Existing files in content/tutorials/:
- 01-getting-started.md
- 02-routing-basics.md
- 03-api-routes.md

Next file should be: 04-[new-topic].md (NOT 01, 02, or 03!)
```

**If the category folder doesn't exist:**

- Start with `01-[slug].md`
- Create the folder first: `content/[category]/`

---

## Article Template

**ALWAYS use this EXACT structure** when creating new articles:

```markdown
---
title: "Article Title Here"
description: "SEO-friendly description (120-160 characters)"
date: "DD-MM-YYYY"
featured: true
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

**Required fields (NEVER omit any):**

- `title` - Article title (60 chars max for SEO)
- `description` - Meta description (120-160 chars, compelling)
- `date` - Format: DD-MM-YYYY (example: 30-10-2025)
- `featured` - Boolean (true or false, NO quotes)
- `tags` - Array of 3-7 tags (lowercase, relevant, in brackets)
- `image` - Hero image URL (use Unsplash or hosted images)

### ⚠️ CRITICAL: Front Matter Format

**COMMON MISTAKES TO AVOID:**

❌ **WRONG:**

```yaml
---
title: Article Title (missing quotes)
featured: "true" (quoted boolean)
tags: tag1, tag2 (missing brackets)
date: 2025-10-30 (wrong date format)
---
```

✅ **CORRECT:**

```yaml
---
title: "Article Title Here"
description: "Clear and compelling description"
date: "30-10-2025"
featured: true
tags: ["tag1", "tag2", "tag3"]
image: "https://images.unsplash.com/photo-1234567890"
---
```

**Front Matter Validation Checklist:**

- [ ] Title has quotes: `"title"`
- [ ] Description has quotes: `"description"`
- [ ] Date format is DD-MM-YYYY with quotes: `"30-10-2025"`
- [ ] Featured is boolean without quotes: `true` or `false`
- [ ] Tags are in array with brackets: `["tag1", "tag2"]`
- [ ] Image URL has quotes: `"https://..."`
- [ ] Three dashes (---) before and after
- [ ] No extra spaces or indentation

**Date format is critical:** Always DD-MM-YYYY (30-10-2025, not 2025-10-30)

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

- `01-guides` - In-depth how-to articles
- `02-tutorials` - Step-by-step learning content
- `03-sample` - Example content

### ⚠️ CRITICAL: Category Folder Naming

**Categories use numbered prefixes for ordering** (similar to articles):

- Format: `[number]-[category-slug]/`
- Example: `01-guides/`, `02-tutorials/`, `03-blog/`
- The number controls display order in navigation
- The slug (after the dash) becomes the URL path

### Category Index File (Optional but Recommended)

Each category can have an `index.md` file to customize its display:

```markdown
---
title: "Guides"
description: "Comprehensive guides for web development"
---
```

### ⚠️ CRITICAL: Creating New Categories

**BEFORE writing content for a new category:**

1. **Check existing category folders** in `content/`
2. **Find the highest number** currently used (e.g., if `01-guides`, `02-tutorials` exist)
3. **Use the next sequential number** for your new category
4. **CREATE the numbered folder**: `content/[number]-[category-slug]/`
5. **OPTIONALLY create** `index.md` with title and description
6. **Then create article files** inside the category folder

**Workflow for new category:**

```bash
# Existing categories: 01-guides, 02-tutorials, 03-sample

# Step 1: Create the numbered category folder (next number is 04)
content/04-blog/

# Step 2: Create optional index.md for category metadata
content/04-blog/index.md

# Step 3: Create the first article
content/04-blog/01-first-post.md
```

**Example:**

```
User requests: "Create an article about web design in a new 'design' category"

Step 1: Check existing - 01-guides, 02-tutorials, 03-sample exist
Step 2: Next number is 04
Step 3: CREATE folder: content/04-design/
Step 4: CREATE index (optional): content/04-design/index.md
Step 5: CREATE article: content/04-design/01-web-design-basics.md
```

**Category index.md template:**

```markdown
---
title: "Design"
description: "Web design principles and best practices"
---
```

### Category Tone

- **Guides:** Professional, detailed, comprehensive
- **Tutorials:** Beginner-friendly, step-by-step, encouraging
- **Blog:** Conversational, personal, engaging

### Category Ordering

Categories are displayed in navigation based on their numeric prefix:

- `01-guides` appears first
- `02-tutorials` appears second
- `03-sample` appears third
- etc.

To reorder categories, rename their folders with new numbers.

---

## When I Ask You to Create Content

### ⚠️ MANDATORY FIRST STEPS

**BEFORE creating ANY content, you MUST:**

1. **List existing files** in the target category using file search
2. **Identify the highest number** currently used
3. **Check if category folder exists** - create if needed
4. **Plan the numbering** for new articles (next sequential number)
5. **Show me the plan** before generating content

### Single Article Request

**Example prompt from me:**

> "Create a tutorial about React hooks"

**Your response should:**

1. **First, say:** "Let me check existing files in content/tutorials/..."
2. **List current files** and their numbers
3. **Propose next number:** "I'll create 04-react-hooks.md (following 01, 02, 03)"
4. Ask clarifying questions:
   - Target audience? (beginner/intermediate/advanced)
   - Specific hooks to cover?
   - Length preference?
   - Should it be featured?
5. Generate complete article with proper front matter
6. Provide full content ready to save

### Multiple Articles Request

**Example prompt from me:**

> "Create 5 articles about Next.js"

**Your response should:**

1. **First, check existing files** in the target category
2. **Identify next available numbers** (e.g., if 01-03 exist, use 04-08)
3. Suggest topics and ordering with correct numbers
4. Generate all 5 articles with sequential numbering (NO duplicates!)
5. Vary the `featured` flag (first 2 true, rest false)
6. Use consistent tags across related articles
7. **Show file structure** before content:
   ```
   content/tutorials/04-nextjs-intro.md
   content/tutorials/05-nextjs-routing.md
   content/tutorials/06-nextjs-data.md
   content/tutorials/07-nextjs-api.md
   content/tutorials/08-nextjs-deploy.md
   ```

### Series Creation

**Example prompt from me:**

> "Create a 3-part series on TypeScript"

**Your response should:**

1. **Check existing files** in target category
2. **Plan sequential numbers** (e.g., 04-05-06, NOT 01-01-01)
3. Plan the series arc (Part 1: Basics → Part 2: Intermediate → Part 3: Advanced)
4. Reference previous parts when relevant
5. Use consistent tags: `["typescript", "series"]`
6. Number sequentially: 04-basics, 05-intermediate, 06-advanced

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

- [ ] **CHECKED existing files** for numbering (NO duplicates!)
- [ ] **VERIFIED category folder exists** (create if needed)
- [ ] **PLANNED sequential numbering** (next available number)
- [ ] Front matter is complete and properly formatted
- [ ] Date is in DD-MM-YYYY format with quotes
- [ ] Featured is boolean WITHOUT quotes (true or false)
- [ ] Tags are in array brackets with quotes: `["tag1", "tag2"]`
- [ ] Title is under 60 characters
- [ ] Description is 120-160 characters
- [ ] Code examples have language identifiers
- [ ] Headings are properly nested (no skipped levels)
- [ ] Images have descriptive URLs or placeholders
- [ ] Content matches the requested category tone
- [ ] Article provides real value (not filler)
- [ ] **SHOWED user the file structure/numbering plan** before generating

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
❌ **DUPLICATE file numbers** (e.g., two files named 01-\*.md)  
❌ **Create files without checking existing numbering**  
❌ **Quote boolean values** (use `true` not `"true"`)  
❌ **Forget to create category folders**  
❌ **Skip the array brackets for tags**  
❌ **Add "index" or file numbers to CTA links** (e.g., `/guides/01-setup` or `/guides/setup/index`)

---

## Do This Instead

✅ Complete all front matter  
✅ Use DD-MM-YYYY dates with quotes: `"30-10-2025"`  
✅ Write compelling descriptions  
✅ Specify code languages  
✅ Nest headings properly  
✅ Use full image URLs  
✅ Use markdown features  
✅ Provide real, valuable content  
✅ **CHECK existing files FIRST**  
✅ **Use next sequential number** (if last is 03, use 04)  
✅ **Use boolean without quotes:** `featured: true`  
✅ **Create category folder if needed**  
✅ **Use array syntax for tags:** `["tag1", "tag2"]`  
✅ **Use clean CTA links:** `/category/slug` (no numbers, no index)

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

1. **ALWAYS check existing files FIRST** - Never duplicate numbers
2. **ALWAYS create category folders** - Before creating content
3. **Front matter format is critical** - Boolean without quotes, tags in brackets
4. **Date format matters** - DD-MM-YYYY with quotes: `"30-10-2025"`
5. **Sequential numbering** - If 01-05 exist, next is 06
6. **Quality over quantity** - Better one great article than five mediocre ones
7. **Show your plan** - List existing files and proposed numbering before generating
8. **Test the format** - Verify front matter matches the template exactly

---

## Special File: homepage.md

### Location

`content/homepage.md` (NOT in a category folder)

### Structure

```yaml
---
title: "Site Title"
subtitle: "Site Subtitle"
description: "SEO description"
image: "https://images.unsplash.com/photo-..."
navbar:
  title: "Nav Title"
  logo: ""
cta:
  text: "Button Text"
  link: "/category/article-slug"
---
```

### ⚠️ CRITICAL: CTA Link Format

**CTA links should point to article slugs WITHOUT "index"**

❌ **WRONG:**

```yaml
cta:
  link: "/guides/01-tailwind-setup"  # NO file number!
  link: "/tutorials/index"           # NO index!
  link: "/guides/tailwind-setup/index" # NO index!
```

✅ **CORRECT:**

```yaml
cta:
  link: "/guides/tailwind-setup"     # Just category + slug
  link: "/tutorials/getting-started" # Clean URL
  link: "/blog/welcome"              # No file numbers
```

**Link Format Rules:**

- Format: `/[category]/[slug]` (NO file numbers, NO index)
- Use the article's slug (from filename), not the number
- Never append `/index` to any link
- Example: File `01-tailwind-setup.md` → Link `/guides/tailwind-setup`

---

## Pre-Generation Checklist

**BEFORE generating ANY content, ask yourself:**

1. ✅ Did I search for existing files in this category?
2. ✅ Did I identify the highest number used?
3. ✅ Did I plan the next sequential number(s)?
4. ✅ Does the category folder exist? (Create if not)
5. ✅ Did I show the user my numbering plan?
6. ✅ Is my front matter format exactly correct?
7. ✅ Are all required fields present?
8. ✅ Is the date in DD-MM-YYYY format?
9. ✅ If editing homepage.md, did I use correct CTA link format? (NO index!)

**If you answered NO to any question, STOP and fix it first!**

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
