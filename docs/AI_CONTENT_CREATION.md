# AI-Assisted Content Creation Guide

**🤖 Use AI tools to generate content for your Static Web site**

This guide shows you how to use GitHub Copilot, ChatGPT, Claude, or other AI assistants to quickly create high-quality content for your markdown-based website.

---

## 🎯 Overview

AI tools are **perfect** for generating:

- Article ideas and outlines
- Full markdown content with proper front matter
- Multiple articles in a consistent style
- SEO-optimized descriptions and metadata
- Code examples and technical documentation

This template is **AI-optimized** with templates, clear structure, and consistent patterns that AI can easily follow.

---

## 🚀 Quick Start with AI

### 🎯 Pro Tip: Use Custom Instructions

**For AI Assistants & Skills:**
The project includes a built-in skill at `.gemini/skills/portal-content/SKILL.md` that teaches your AI agent (Antigravity, Cursor, Claude) your exact content structure, sequential number ordering, and front-matter validation automatically.

**For GitHub Copilot users:**
You can reference the rules directly or include them in `.github/copilot-instructions.md`.

**Result:** Copilot will automatically generate content following your template without you needing to explain it every time.

**Example - Before Instructions:**

```
You: "Create an article about React hooks"
Copilot: [generates content with wrong date format, missing fields]
```

**Example - After Instructions:**

```
You: "Create an article about React hooks"
Copilot: [generates complete article with:
  ✅ Proper front matter
  ✅ DD-MM-YYYY date format
  ✅ SEO description
  ✅ Relevant tags
  ✅ Structured content following template]
```

**→ See full before/after examples:** [.github/COPILOT_EXAMPLE.md](.github/COPILOT_EXAMPLE.md)

---

### Method 1: GitHub Copilot (VS Code)

**Best for:** Generating content while you code

#### Step 1: Open the Article Template

```bash
# Open VS Code in your project
code .

# Open the template
open content/_templates/article-template.md
```

#### Step 2: Use Copilot Chat

Press `Cmd+I` (Mac) or `Ctrl+I` (Windows) to open Copilot inline chat, then prompt:

```
Create a new article about [TOPIC] following this template.
Use the category "tutorials" and make it beginner-friendly.
Include code examples and make it around 800 words.
```

#### Step 3: Save to Content Directory

Copilot will generate the content. Save it as:

```
content/tutorials/03-[your-topic-slug].md
```

---

### Method 2: ChatGPT / Claude (Web Interface)

**Best for:** Generating multiple articles at once

#### Step 1: Copy the Template

From `content/_templates/article-template.md`, copy the structure.

#### Step 2: Prompt the AI

```
I'm creating content for a markdown-based website. Here's my article template:

[PASTE TEMPLATE HERE]

Please create 3 tutorial articles about:
1. Setting up environment variables in Next.js
2. Creating custom React hooks
3. Deploying to Vercel

Each should be 600-800 words with code examples.
Follow the template exactly, including front matter.
Use dates starting from today (Oct 28, 2025).
Number them 01, 02, 03 for the filename.
```

#### Step 3: Create Files

Copy each generated article into:

- `content/tutorials/01-environment-variables.md`
- `content/tutorials/02-custom-hooks.md`
- `content/tutorials/03-deploying-vercel.md`

---

### Method 3: Copilot for Multiple Files

**Best for:** Batch content generation in VS Code

#### Prompt in Copilot Chat Panel:

```
Create 5 new articles for my blog:

Categories:
- 3 in "tutorials" category (beginner level)
- 2 in "guides" category (advanced level)

Topics:
1. Introduction to TypeScript
2. Building REST APIs
3. State Management in React
4. Performance Optimization
5. Testing with Jest

Requirements:
- Use the template in content/_templates/article-template.md
- Each article should be 700-1000 words
- Include code examples
- Use proper front matter with title, description, date, tags
- Set featured: true for the first 2 articles
- Number them sequentially (01, 02, 03...)
- Use today's date (Oct 28, 2025)

Create each as a separate file in the correct category folder.
```

Copilot will create multiple files. Review and save each.

---

## 📝 Content Templates

### Article Template Location

```
content/_templates/article-template.md
```

This template includes:

- Complete front matter structure
- Content sections
- Placeholder text
- Example code blocks
- Image placeholders

### Using the Template

**With AI:**

```
Use content/_templates/article-template.md as the structure.
Create a new article about [TOPIC].
```

**Manually:**

```bash
cp content/_templates/article-template.md content/blog/04-my-article.md
```

---

## 🎨 AI Prompt Templates

### For Tutorial Articles

```
Create a tutorial article using content/_templates/article-template.md.

Topic: [YOUR TOPIC]
Audience: [Beginners/Intermediate/Advanced]
Length: [600-800 words]
Category: tutorials
Include: Step-by-step instructions and code examples
Tone: Friendly and educational
```

### For Guide Articles

```
Create a comprehensive guide using content/_templates/article-template.md.

Topic: [YOUR TOPIC]
Depth: In-depth technical explanation
Length: [1000-1500 words]
Category: guides
Include: Best practices, common pitfalls, and advanced tips
Tone: Professional and detailed
```

### For Blog Posts

```
Create a blog post using content/_templates/article-template.md.

Topic: [YOUR TOPIC]
Style: Conversational and engaging
Length: [500-700 words]
Category: blog
Include: Personal insights and practical examples
Tone: Casual and relatable
```

---

## 🏗️ Workflow Examples

### Workflow 1: Weekly Content Batch

**Goal:** Create 4 articles every week

```bash
# Monday: Generate topics
# Use AI: "Give me 4 trending web development topics for this week"

# Tuesday: Create outlines
# Use AI: "Create detailed outlines for these 4 topics"

# Wednesday: Generate content
# Use AI: "Using content/_templates/article-template.md, create full articles
# from these outlines. Make them 700-900 words each."

# Thursday: Review and edit
# Manually review each article

# Friday: Publish
git add content/
git commit -m "Add weekly articles"
git push
```

### Workflow 2: Series Creation

**Goal:** Create a 5-part tutorial series

```
Create a 5-part tutorial series on "Mastering Next.js App Router"

Use content/_templates/article-template.md for each part.

Part 1: Introduction and Setup (beginner)
Part 2: File-based Routing (beginner)
Part 3: Server Components (intermediate)
Part 4: Data Fetching Patterns (intermediate)
Part 5: Advanced Optimization (advanced)

Requirements:
- Each part should be 800-1000 words
- Include code examples
- Reference previous parts when relevant
- Use tags: ["nextjs", "tutorial", "app-router"]
- Number as 01-intro-setup.md through 05-optimization.md
- Put in content/tutorials/ directory
- Make first 2 featured: true
```

### Workflow 3: Documentation Migration

**Goal:** Convert existing docs to markdown articles

```
I have existing documentation I want to convert to articles.

Use content/_templates/article-template.md as the target format.

For each section of the docs:
1. Create proper front matter with relevant metadata
2. Convert content to markdown
3. Add code examples where helpful
4. Optimize for SEO with good descriptions
5. Add relevant tags

Original doc: [PASTE CONTENT]

Create these as separate articles in the content/guides/ directory.
```

---

## 🎯 Best Practices

### Do's ✅

- **Always reference the template:** Include "use content/\_templates/article-template.md" in prompts
- **Be specific:** Provide word count, tone, and technical level
- **Use numbered files:** Helps with ordering (01-, 02-, etc.)
- **Review before publishing:** AI is great but needs human review
- **Maintain consistency:** Use the same prompt structure for similar content
- **Test locally:** Run `npm run dev` to preview before committing

### Don'ts ❌

- **Don't skip front matter:** It's required for the site to work
- **Don't mix date formats:** Always use DD-MM-YYYY format
- **Don't forget tags:** They help with content discovery
- **Don't ignore SEO:** Ask AI to optimize descriptions
- **Don't use raw HTML:** Stick to markdown when possible
- **Don't skip image fields:** Even if placeholder, include the field

---

## 🧪 Testing Your AI-Generated Content

### 1. Validate Front Matter

```bash
# Check that all required fields exist:
# - title
# - description
# - date
# - tags
```

### 2. Preview Locally

```bash
npm run dev
# Visit http://localhost:3000
```

### 3. Check Links

Ensure internal links work:

```markdown
[Link to another article](/tutorials/getting-started)
```

### 4. Verify Images

Test that image URLs load properly.

---

## 📊 Example AI Conversations

### Example 1: Creating a Single Article

**You:**

```
Create an article about React Server Components using the template
at content/_templates/article-template.md.

Make it 800 words, intermediate level, with 3 code examples.
Category: guides
Tags: react, nextjs, server-components
Set featured to true
```

**AI Response:**
_[Generates complete markdown file with front matter and content]_

**You:**

```
Great! Save this as content/guides/05-react-server-components.md
```

### Example 2: Creating a Series

**You:**

```
Create a 3-part beginner series on TypeScript.

Part 1: Basic Types
Part 2: Interfaces and Types
Part 3: Generics Made Simple

Each should:
- Use content/_templates/article-template.md
- Be 600-800 words
- Include practical examples
- Be in content/tutorials/
- Use dates Oct 28-30, 2025
- Have tags: ["typescript", "beginner"]
```

**AI Response:**
_[Generates 3 complete articles]_

---

## 🔧 Troubleshooting AI Content

### Issue: AI forgets the template

**Solution:** Include the template in every prompt

```
Always use the structure from content/_templates/article-template.md
```

### Issue: Inconsistent front matter

**Solution:** Provide explicit field requirements

```
Front matter MUST include:
- title: string
- description: string (max 160 chars)
- date: string (DD-MM-YYYY)
- featured: boolean
- tags: array of strings
- image: string (URL)
```

### Issue: Wrong date format

**Solution:** Be explicit

```
Use date format: DD-MM-YYYY (example: 28-10-2025)
```

### Issue: Content doesn't match category

**Solution:** Specify category in prompt

```
This article is for the "tutorials" category, so make it
beginner-friendly with step-by-step instructions.
```

---

## 🚀 Advanced AI Workflows

### Auto-Generate SEO Metadata

```
For this article, generate:
1. SEO-optimized title (max 60 chars)
2. Meta description (max 160 chars)
3. 5-7 relevant tags
4. Suggested image alt text
5. Social media preview text
```

### Batch Image Suggestions

```
For each of these 5 articles, suggest:
1. A relevant Unsplash search term
2. Alt text for accessibility
3. Caption for the image
```

### Content Gap Analysis

```
I have these existing articles: [LIST]

Analyze and suggest:
1. Missing topics in this category
2. Articles that would complement existing content
3. Series opportunities
4. Content depth improvements
```

---

## 📚 Resources

- **Template:** `content/_templates/article-template.md`
- **Examples:** `content/tutorials/` and `content/guides/`
- **Content Guide:** [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)
- **Writing Guide:** [HOW_TO_WRITE.md](./HOW_TO_WRITE.md)

---

## 🎉 Ready to Generate Content!

Start with one article, get comfortable with the workflow, then scale up to batch creation. AI + this template = efficient content production! 🚀
