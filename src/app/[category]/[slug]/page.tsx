import {
  getArticle,
  getArticlesByCategory,
  getAdjacentArticles,
  getCategories,
  getSiteSettings,
} from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { formatCategoryName } from "@/lib/utils";
import ArticleNavigation from "@/components/ArticleNavigation";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleImage from "@/components/ArticleImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import PrintButton from "@/components/PrintButton";
import SearchHighlighter from "@/components/SearchHighlighter";
import SearchNavigationFab from "@/components/SearchNavigationFab";
import TableOfContents from "@/components/TableOfContents";
import CodeCopyInitializer from "@/components/CodeCopyInitializer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category: encodedCategory, slug } = await params;
  const category = decodeURIComponent(encodedCategory);
  const article = await getArticle(category, slug);

  if (!article) {
    return {};
  }

  const { siteUrl, siteTitle } = getSiteSettings();
  const articleUrl = `${siteUrl}/${category}/${slug}`;

  return {
    title: `${article.title} - ${siteTitle}`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: ["The Static Web"],
      images: article.image ? [{ url: article.image }] : [],
      url: articleUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : [],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const params = [];

  for (const category of categories) {
    const articles = await getArticlesByCategory(category);
    for (const article of articles) {
      params.push({
        category: encodeURIComponent(category),
        slug: article.slug,
      });
    }
  }

  return params;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: encodedCategory, slug } = await params;
  const category = decodeURIComponent(encodedCategory);
  const article = await getArticle(category, slug);

  if (!article) {
    notFound();
  }

  const displayCategory = formatCategoryName(category);
  const { previous, next } = await getAdjacentArticles(category, article.index);
  const relatedArticles = await getArticlesByCategory(category);

  const { siteUrl, organizationName, logoUrl } = getSiteSettings();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image || undefined,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: organizationName,
    },
    publisher: {
      "@type": "Organization",
      name: organizationName,
      logo: logoUrl
        ? {
            "@type": "ImageObject",
            url: `${siteUrl}${logoUrl}`,
          }
        : undefined,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${category}/${slug}`,
    },
  };

  // Add IDs to headings for TOC anchors
  const idCounter: Record<string, number> = {};
  const contentWithHeadingIds = article.content.replace(
    /<(h[2-3])([^>]*)>([^<]*)<\/\1>/g,
    (match, tag, attrs, text) => {
      const cleanText = text.trim();
      
      // Skip if no text or ID already exists
      if (!cleanText || attrs.includes('id=')) {
        return match;
      }
      
      let id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      // Make IDs unique by appending a counter if we've seen this ID before
      if (id) {
        if (idCounter[id] !== undefined) {
          idCounter[id]++;
          id = `${id}-${idCounter[id]}`;
        } else {
          idCounter[id] = 0;
        }
        return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
      }
      
      return match;
    }
  );

  return (
    <>
      <SearchHighlighter />
      <SearchNavigationFab />
      <TableOfContents content={article.content} />
      <CodeCopyInitializer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="min-h-screen bg-background">
        <article className="px-6 py-12 sm:py-16 max-w-3xl mx-auto print:px-0 print:py-0">
          <div className="print:hidden">
            <Breadcrumbs
              items={[
                {
                  label: displayCategory,
                  href: `/${encodeURIComponent(category)}`,
                },
                { label: article.title },
              ]}
            />
          </div>

          {/* Header */}
          <div className="mb-8 print:mb-4">
            <div className="flex items-center justify-between gap-2 mb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded">
                  {displayCategory}
                </span>
                <time
                  className="text-sm text-muted-foreground"
                  dateTime={article.date}
                >
                  {formatDate(article.date)}
                </time>
              </div>
              <PrintButton />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 print:text-3xl">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground print:hidden">
              {article.description}
            </p>
          </div>

          {/* Featured Image */}
          {article.image && article.image.trim() !== "" && (
            <ArticleImage src={article.image} alt={article.title} />
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border print:hidden">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded hover:bg-muted/80 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="overflow-x-hidden">
            <div
              className="prose print:prose-sm"
              dangerouslySetInnerHTML={{ __html: contentWithHeadingIds }}
            />
          </div>

          {/* Navigation */}
          <div className="print:hidden">
            <ArticleNavigation
              previous={previous}
              next={next}
              category={category}
            />
          </div>

          {/* Related Articles */}
          <div className="print:hidden">
            <RelatedArticles
              articles={relatedArticles}
              category={category}
              currentSlug={slug}
            />
          </div>
        </article>
      </main>
    </>
  );
}
