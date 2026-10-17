import {
  getArticle,
  getArticlesByCategory,
  getAdjacentArticles,
  getCategories,
  getSiteSettings,
} from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import { formatCategoryName } from "@/lib/utils";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  cleanSchema,
} from "@/lib/schema";
import ArticleNavigation from "@/components/ArticleNavigation";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleImage from "@/components/ArticleImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArticleActions } from "@/components/ArticleActions";
import SearchHighlighter from "@/components/SearchHighlighter";
import SearchNavigationFab from "@/components/SearchNavigationFab";
import TableOfContents from "@/components/TableOfContents";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import CodeCopyInitializer from "@/components/CodeCopyInitializer";
import { MermaidInitializer } from "@/components/MermaidInitializer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

  // Generate structured data for SEO
  const articleSchema = cleanSchema(
    generateArticleSchema({
      title: article.title,
      description: article.description,
      content: article.content,
      date: article.date,
      image: article.image,
      category,
      slug,
      siteUrl,
      organizationName,
      logoUrl,
    }),
  );

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { label: displayCategory, path: `/${encodeURIComponent(category)}` },
    { label: article.title, path: `/${category}/${slug}` },
  ];
  const breadcrumbSchema = cleanSchema(
    generateBreadcrumbSchema(breadcrumbItems, siteUrl),
  );

  // Add IDs to headings for TOC anchors
  const idCounter: Record<string, number> = {};
  const contentWithHeadingIds = article.content.replace(
    /<(h[2-3])([^>]*)>([^<]*)<\/\1>/g,
    (match, tag, attrs, text) => {
      const cleanText = text.trim();

      // Skip if no text or ID already exists
      if (!cleanText || attrs.includes("id=")) {
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
    },
  );

  return (
    <>
      <SearchHighlighter />
      <SearchNavigationFab />
      <ReadingProgressBar />
      <TableOfContents content={article.content} />
      <CodeCopyInitializer />
      <MermaidInitializer />
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content" className="min-h-screen bg-background lg:pl-56">
        <article className="px-6 pt-6 pb-12 sm:pt-8 sm:pb-16 max-w-3xl mx-auto print:px-0 print:py-0 mb-12">
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
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1.5 flex-1">
                <h1 className="text-3xl sm:text-4xl font-serif leading-tight text-foreground print:text-3xl">
                  {article.title}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>
                    Posted on{" "}
                    {article.date ? formatDate(article.date) : "Recent"}
                  </span>
                  <span>•</span>
                  <Link
                    href={`/${encodeURIComponent(category)}`}
                    className="capitalize hover:text-foreground transition-colors"
                  >
                    {category}
                  </Link>
                </p>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 print:hidden">
                    {article.tags.map((tag) => (
                      <Link key={tag} href={`/tag/${tag}`}>
                        <Badge
                          variant="secondary"
                          className="rounded-lg px-2 py-0.5 text-[11px] font-medium font-mono text-muted-foreground bg-muted/60 hover:bg-muted"
                        >
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="print:hidden shrink-0 pt-1">
                <ArticleActions
                  htmlContent={contentWithHeadingIds}
                  description={article.description}
                  title={article.title}
                  image={article.image}
                />
              </div>
            </div>
            {article.description && (
              <p className="text-base text-muted-foreground print:hidden">
                {article.description}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {article.image && article.image.trim() !== "" && (
            <ArticleImage src={article.image} alt={article.title} />
          )}

          {/* Content */}
          <div className="overflow-x-hidden">
            <div
              className="prose print:prose-sm content-with-wrapped-code"
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
