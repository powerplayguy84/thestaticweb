# SEO Structured Data Implementation

## Overview

This guide explains the structured data (JSON-LD) implementation added to enhance SEO for your articles and site.

## What is Structured Data?

Structured data is a standardized way to provide information about your content to search engines. It uses JSON-LD format to describe:

- Article content and metadata
- Breadcrumb navigation
- Organization information

Search engines use this data to better understand your content and may display rich snippets in search results.

## Implementation Details

### 1. **New Schema Utility Module** (`src/lib/schema.ts`)

This module provides functions to generate structured data schemas:

#### Functions

- **`generateArticleSchema()`**: Creates Article schema with:

  - Headline, description, and article body
  - Publication and modification dates
  - Author and publisher information
  - Featured image
  - Word count and reading time
  - Main entity reference

- **`generateBreadcrumbSchema()`**: Creates BreadcrumbList schema for:

  - Improved navigation visibility in search results
  - Hierarchical site structure representation

- **`generateOrganizationSchema()`**: Creates Organization schema with:

  - Site name and URL
  - Logo information
  - Essential org metadata

- **`cleanSchema()`**: Removes undefined values for clean JSON-LD output

### 2. **Article Page Enhancement** (`src/app/[category]/[slug]/page.tsx`)

The article page now includes:

```tsx
// Article Schema
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>

// Breadcrumb Schema
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
/>
```

This provides search engines with comprehensive article metadata.

### 3. **Root Layout Enhancement** (`src/app/layout.tsx`)

The root layout now includes Organization schema:

```tsx
// Organization Schema
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationSchema),
  }}
/>
```

This helps search engines understand your website's organization.

## SEO Benefits

### 1. **Rich Snippets**

- Articles may display with enhanced formatting in search results
- Better visibility and click-through rates

### 2. **Better Content Understanding**

- Search engines understand article structure and metadata
- Improved indexing and ranking potential

### 3. **Knowledge Graph Integration**

- Your organization may appear in Google Knowledge Graph
- Enhanced brand presence in search results

### 4. **Breadcrumb Navigation**

- Search results may show breadcrumb trail
- Improved user experience in search results

## Data Sources

The schemas use data from:

- `content/settings.md` - Organization information
- Article metadata (title, date, description, tags, etc.)
- Article content itself

## Validation

To verify your structured data is correct:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results

   - Paste your article URL
   - Verify Article and BreadcrumbList schemas appear

2. **Schema.org Validator**: https://validator.schema.org/

   - Check JSON-LD validity

3. **Google Search Console**:
   - Monitor rich results performance
   - Check for schema errors

## Example Output

### Article Schema Example

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://yourdomain.com/guides/tailwind-setup",
  "headline": "Tailwind CSS Setup Guide",
  "description": "Learn how to set up Tailwind CSS...",
  "articleBody": "...",
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-15",
  "image": { "@type": "ImageObject", "url": "..." },
  "author": { "@type": "Organization", "name": "Your Site Name" },
  "publisher": { "@type": "Organization", "name": "Your Site Name" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "..." }
}
```

## Customization

To customize the schemas:

1. Edit `src/lib/schema.ts` to modify schema generation
2. Update `content/settings.md` with your organization info
3. Ensure article frontmatter includes: `title`, `description`, `date`, `image` (optional)

## Performance Impact

- Minimal: Schemas are generated at build time
- No runtime performance cost
- Search engines benefit immediately

## Next Steps

1. Deploy your changes
2. Test with Google Rich Results Test
3. Monitor Google Search Console for rich results
4. Verify impressions and CTR improvements over time

---

For more information on structured data:

- [Google Structured Data Guide](https://developers.google.com/search/docs/appearance/structured-data)
- [Schema.org Article Type](https://schema.org/Article)
- [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList)
