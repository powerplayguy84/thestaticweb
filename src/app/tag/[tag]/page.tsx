import { getArticlesByTag, getAllTags } from "@/lib/markdown";
import { ArticleListFeed } from "@/components/article-list-feed";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Motion } from "@/components/ui/motion";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} - The Static Web`,
    description: `Articles tagged with ${tag}`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const articles = await getArticlesByTag(tag);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <main id="main-content" className="min-h-screen bg-background ambient-mesh">
      <div className="flex flex-col gap-8 max-w-3xl lg:max-w-4xl mx-auto pb-16 px-4 sm:px-6 pt-6 sm:pt-10">
        <Breadcrumbs items={[{ label: `#${tag}` }]} />

        <Motion
          animation="fade-in-up"
          delay={0}
          duration="long"
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border/40 pb-5">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <span className="text-muted-foreground/50 font-normal">#</span>
                <span>{tag}</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
                All content tagged with #{tag}
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              {articles.length} {articles.length === 1 ? "item" : "items"}
            </span>
          </div>
        </Motion>

        <Motion animation="fade-in-up" delay={100} duration="long">
          <ArticleListFeed articles={articles} />
        </Motion>
      </div>
    </main>
  );
}
