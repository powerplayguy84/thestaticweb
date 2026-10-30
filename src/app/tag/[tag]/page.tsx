import { getArticlesByTag, getAllTags } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
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
      <div className="flex flex-col gap-6 max-w-3xl lg:max-w-4xl mx-auto pb-16 px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="space-y-3">
          <Breadcrumbs items={[{ label: `#${tag}` }]} />

          <Motion
            animation="fade-in-up"
            delay={0}
            duration="long"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <span className="text-muted-foreground/50 font-normal">#</span>
                <span>{tag}</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
                All content tagged with #{tag}
              </p>
            </div>
          </Motion>
        </div>

        <Motion animation="fade-in-up" delay={100} duration="long">
          {articles.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground border border-dashed border-border/70 rounded-2xl">
              No items found with this tag.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={`${article.category}-${article.slug}`} className="flex">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </Motion>
      </div>
    </main>
  );
}
