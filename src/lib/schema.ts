/**
 * Utility functions for generating JSON-LD structured data for SEO
 */

interface ArticleSchemaProps {
  title: string;
  description: string;
  content: string;
  date?: string;
  image?: string;
  category: string;
  slug: string;
  siteUrl: string;
  organizationName: string;
  logoUrl?: string;
  author?: string;
}

interface BreadcrumbItem {
  label: string;
  path: string;
}

/**
 * Generate Article schema for structured data
 * Helps search engines understand article content better
 */
export function generateArticleSchema({
  title,
  description,
  content,
  date,
  image,
  category,
  slug,
  siteUrl,
  organizationName,
  logoUrl,
  author = organizationName,
}: ArticleSchemaProps): Record<string, unknown> {
  const articleUrl = `${siteUrl}/${category}/${slug}`;

  // Calculate reading time (approximate: 200 words per minute)
  const wordCount = content.split(/\s+/).length;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleUrl,
    headline: title,
    description,
    articleBody: content,
    ...(date ? { datePublished: date, dateModified: date } : {}),
    inLanguage: "en-US",
    wordCount,
  };

  // Add image if available
  if (image) {
    schema.image = {
      "@type": "ImageObject",
      url: image.startsWith("http") ? image : `${siteUrl}${image}`,
    };
  }

  // Add author
  schema.author = {
    "@type": "Organization",
    name: author,
  };

  // Add publisher
  const publisherSchema: Record<string, unknown> = {
    "@type": "Organization",
    name: organizationName,
  };

  if (logoUrl) {
    publisherSchema.logo = {
      "@type": "ImageObject",
      url: logoUrl.startsWith("http") ? logoUrl : `${siteUrl}${logoUrl}`,
    };
  }

  schema.publisher = publisherSchema;

  // Add main entity
  schema.mainEntityOfPage = {
    "@type": "WebPage",
    "@id": articleUrl,
  };

  return schema;
}

/**
 * Generate Breadcrumb schema for structured data
 * Improves navigation visibility in search results
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string
): Record<string, unknown> {
  const breadcrumbList = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${siteUrl}${item.path}`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbList,
  };
}

/**
 * Generate Organization schema for structured data
 * Helps search engines understand your organization
 */
export function generateOrganizationSchema(
  name: string,
  url: string,
  logoUrl?: string
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };

  if (logoUrl) {
    schema.logo = logoUrl.startsWith("http") ? logoUrl : `${url}${logoUrl}`;
  }

  return schema;
}

/**
 * Remove undefined values from schema object
 * Ensures clean JSON-LD output
 */
export function cleanSchema(
  schema: Record<string, unknown>
): Record<string, unknown> {
  return JSON.parse(JSON.stringify(schema));
}
