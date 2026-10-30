import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticle,
  getArticlesByCategory,
  getAdjacentArticles,
  getSiteSettings,
  getCategories,
} from "@/lib/markdown";
import { formatCategoryName } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleNavigation from "@/components/ArticleNavigation";
import { Badge } from "@/components/ui/badge";
import ArticleImage from "@/components/ArticleImage";
import TableOfContents from "@/components/TableOfContents";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { ArticleActions } from "@/components/ArticleActions";
import { MermaidInitializer } from "@/components/MermaidInitializer";
import CodeCopyInitializer from "@/components/CodeCopyInitializer";
import SearchNavigationFab from "@/components/SearchNavigationFab";
import SearchHighlighter from "@/components/SearchHighlighter";
import { ArticleSwiperSection } from "@/components/ArticleSwiperSection";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  cleanSchema,
} from "@/lib/schema";

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

  const { siteTitle } = getSiteSettings();

  return {
    title: `${article.title} | ${siteTitle}`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
      images: article.image ? [{ url: article.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

// Generate static params for all articles across all categories
export async function generateStaticParams() {
  const categories = await getCategories();
  const params: { category: string; slug: string }[] = [];

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

  // Helper to add IDs to headings for TOC anchors
  const idCounter: Record<string, number> = {};
  const addHeadingIds = (html: string) => {
    return html.replace(
      /<(h[2-3])([^>]*)>([^<]*)<\/\1>/g,
      (match, tag, attrs, text) => {
        const cleanText = text.trim();
        if (!cleanText || attrs.includes("id=")) {
          return match;
        }

        let id = cleanText
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

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
  };

  const contentWithHeadingIds = addHeadingIds(article.content);

  // Check if article uses structured multi-file sections
  const hasSections = article.sections && article.sections.length > 0;

  return (
    <>
      <SearchHighlighter />
      <SearchNavigationFab />
      <ReadingProgressBar />
      <TableOfContents content={contentWithHeadingIds} />
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
      <main id="main-content" className="min-h-screen bg-background ambient-mesh lg:pl-56">
        <article className="px-5 sm:px-6 pt-6 pb-12 sm:pt-10 sm:pb-16 max-w-3xl mx-auto print:px-0 print:py-0 mb-12">
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
            <div className="space-y-3 mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground print:text-3xl leading-[1.12]">
                {article.title}
              </h1>
              <p className="text-xs text-muted-foreground font-mono flex flex-wrap items-center gap-2">
                <span>
                  {article.date ? formatDate(article.date) : "Recent"}
                </span>
                <span>•</span>
                <Link
                  href={`/${encodeURIComponent(category)}`}
                  className="capitalize hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  {category}
                </Link>
              </p>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 print:hidden">
                  {article.tags.map((tag) => (
                    <Link key={tag} href={`/tag/${tag}`}>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium text-muted-foreground bg-muted/60 hover:bg-muted border border-border/50 transition-colors"
                      >
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
              {/* Action buttons (Print, Presentation) positioned underneath tags */}
              <div className="print:hidden pt-2 flex items-center gap-2">
                <ArticleActions
                  htmlContent={contentWithHeadingIds}
                  description={article.description}
                  title={article.title}
                  image={article.image}
                />
              </div>
            </div>
            {article.description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed print:hidden pt-1">
                {article.description}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {article.image && article.image.trim() !== "" && (
            <ArticleImage src={article.image} alt={article.title} />
          )}

          {/* Content Rendering */}
          <div className="overflow-x-hidden">
            {hasSections ? (
              <div className="space-y-8">
                {article.sections!.map((section) => {
                  const sectionHtml = section.htmlContent
                    ? addHeadingIds(section.htmlContent).replace(/^\s*<h1[^>]*>.*?<\/h1>/i, "")
                    : "";

                  return (
                    <div key={section.id} className="section-block">
                      {sectionHtml && (
                        <div
                          className="prose print:prose-sm content-with-wrapped-code max-w-none"
                          dangerouslySetInnerHTML={{ __html: sectionHtml }}
                        />
                      )}
                      {section.subCards && section.subCards.length > 0 && (
                        <ArticleSwiperSection
                          items={section.subCards}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="prose print:prose-sm content-with-wrapped-code max-w-none"
                dangerouslySetInnerHTML={{
                  __html: contentWithHeadingIds.replace(/^\s*<h1[^>]*>.*?<\/h1>/i, ""),
                }}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="print:hidden mt-12">
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
