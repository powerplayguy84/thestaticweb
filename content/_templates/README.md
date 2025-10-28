# Content Templates

This directory contains templates for creating new content.

## Available Templates

### article-template.md

A comprehensive template for creating new articles. Includes:

- Complete front matter structure with all fields
- Content sections and formatting examples
- Code block examples
- Image and link examples
- SEO and accessibility guidelines

## Using Templates

### Method 1: Copy Template Manually

```bash
# Copy template to new article
cp content/_templates/article-template.md content/tutorials/03-my-article.md

# Edit the new file
code content/tutorials/03-my-article.md
```

### Method 2: Use with AI Tools

See [AI_CONTENT_CREATION.md](../../AI_CONTENT_CREATION.md) for detailed guides on using:

- GitHub Copilot
- ChatGPT
- Claude
- Other AI assistants

Example AI prompt:

```
Use the template at content/_templates/article-template.md to create
a new article about [TOPIC]. Make it [WORD_COUNT] words and include
code examples.
```

## Template Structure

```
content/_templates/
├── README.md                # This file
└── article-template.md      # Main article template
```

## Creating Custom Templates

You can create additional templates for specific content types:

```bash
# Tutorial template
cp article-template.md tutorial-template.md

# Guide template
cp article-template.md guide-template.md

# Blog post template
cp article-template.md blog-template.md
```

Customize each template for your specific use case.

## Front Matter Reference

Required fields:

```yaml
title: "Article Title"
description: "SEO description"
date: "DD-MM-YYYY"
featured: true/false
tags: ["tag1", "tag2"]
image: "https://example.com/image.jpg"
```

Optional fields:

```yaml
author: "Author Name"
category: "Override default category"
updated: "DD-MM-YYYY"
readTime: 5
```

## Best Practices

1. **Always start with the template** - Ensures consistency
2. **Fill in ALL front matter fields** - Required for site functionality
3. **Use descriptive filenames** - Format: `[number]-[slug].md`
4. **Test locally** - Run `npm run dev` before committing
5. **Optimize images** - Use WebP, compress, host on CDN

## Need Help?

- **Writing content:** [HOW_TO_WRITE.md](../../HOW_TO_WRITE.md)
- **AI assistance:** [AI_CONTENT_CREATION.md](../../AI_CONTENT_CREATION.md)
- **Content organization:** [CONTENT_GUIDE.md](../../CONTENT_GUIDE.md)
