import {
  getArticle,
  getArticlesByCategory,
  getAdjacentArticles,
  getCategories,
} from "@/lib/markdown";
import { formatDate } from "@/lib/date";
import ArticleNavigation from "@/components/ArticleNavigation";
import RelatedArticles from "@/components/RelatedArticles";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} - The Static Web`,
    description: article.description,
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  const params = [];

  for (const category of categories) {
    const articles = await getArticlesByCategory(category);
    for (const article of articles) {
      params.push({
        category,
        slug: article.slug,
      });
    }
  }

  return params;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);

  if (!article) {
    notFound();
  }

  const { previous, next } = await getAdjacentArticles(category, article.index);
  const relatedArticles = await getArticlesByCategory(category);

  return (
    <main className="min-h-screen bg-background">
      <article className="px-6 py-12 sm:py-16 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded capitalize">
              {category}
            </span>
            <time className="text-sm text-muted-foreground">
              {formatDate(article.date)}
            </time>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground">{article.description}</p>
        </div>

        {/* Featured Image */}
        {article.image && article.image.trim() !== "" && (
          <div className="w-full h-64 sm:h-96 bg-muted overflow-hidden rounded-lg relative mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-slate max-w-none mb-8
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-7 prose-p:mb-4
            prose-a:text-primary prose-a:hover:text-primary/80
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
            prose-li:text-muted-foreground prose-li:mb-2
            prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-primary prose-pre:text-primary-foreground prose-pre:overflow-x-auto
            prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Navigation */}
        <ArticleNavigation
          previous={previous}
          next={next}
          category={category}
        />

        {/* Related Articles */}
        <RelatedArticles
          articles={relatedArticles}
          category={category}
          currentSlug={slug}
        />
      </article>
    </main>
  );
}
