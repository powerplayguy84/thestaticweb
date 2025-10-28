# GitHub Copilot Instructions

This directory contains custom instructions for GitHub Copilot to help with content creation.

## What's Here

### copilot-instructions-content.md

**Purpose:** Teaches GitHub Copilot how to create content for this site following our exact structure and conventions.

**Contains:**

- Content structure and naming conventions
- Front matter requirements
- Article template patterns
- Writing style guidelines
- Category-specific tones
- SEO optimization rules
- Quality checklist

### COPILOT_EXAMPLE.md

**See real examples** of content generated with vs. without custom instructions. This shows the dramatic difference in quality and completeness.

## How to Use

### Option 1: For This Workspace Only

Copy the content instructions to your main Copilot instructions:

```bash
# If you don't have copilot-instructions.md yet:
cp .github/copilot-instructions-content.md .github/copilot-instructions.md

# If you already have copilot-instructions.md:
# Append the content from copilot-instructions-content.md to your existing file
```

### Option 2: Keep Separate

Keep `copilot-instructions-content.md` as a reference and paste relevant sections into Copilot Chat when needed.

## What This Does

Once set up, Copilot will:

✅ **Automatically use the correct front matter format**  
✅ **Follow the DD-MM-YYYY date format**  
✅ **Use proper file naming conventions**  
✅ **Match category-specific writing tones**  
✅ **Include all required fields**  
✅ **Generate SEO-optimized content**  
✅ **Follow the article template structure**

## Example Usage

**Before (without instructions):**

```
You: "Create an article about React hooks"
Copilot: [generates generic content, wrong format]
```

**After (with instructions):**

```
You: "Create an article about React hooks"
Copilot: [generates complete article with proper front matter,
         correct date format, appropriate tags, SEO description,
         and content following the template structure]
```

## Benefits

1. **Consistency** - All content follows the same structure
2. **Speed** - No need to explain format every time
3. **Quality** - Built-in best practices
4. **Less editing** - Content is ready to use immediately

## Customization

Feel free to modify `copilot-instructions-content.md` to match your:

- Writing style preferences
- Category structures
- Tag conventions
- Content length preferences

## Learn More

- **[AI_CONTENT_CREATION.md](../AI_CONTENT_CREATION.md)** - Complete AI workflows guide
- **[content/\_templates/article-template.md](../content/_templates/article-template.md)** - Article template

---

**Note:** Copilot instructions are workspace-specific. Each new project using this template can have its own customized instructions.
