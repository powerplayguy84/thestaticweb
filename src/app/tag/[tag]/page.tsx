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
    <main id="main-content" className="min-h-screen bg-background">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-16 px-4 md:px-6 pt-8 sm:pt-12">
        <Breadcrumbs items={[{ label: `#${tag}` }]} />

        <Motion
          animation="fade-in-up"
          delay={0}
          duration="long"
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
            #{tag}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Articles tagged with{" "}
            <span className="font-semibold text-foreground">#{tag}</span>
          </p>
          <div
            className="pt-5 pb-2 flex items-center text-primary"
            aria-hidden="true"
          >
            <svg
              width="96"
              height="12"
              viewBox="0 0 96 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M 4 6 Q 11 1, 18 6 T 32 6 T 46 6 T 60 6 T 74 6 T 88 6" />
            </svg>
          </div>
        </Motion>

        <Motion animation="fade-in-up" delay={100} duration="long">
          <ArticleListFeed articles={articles} />
        </Motion>
      </div>
    </main>
  );
}
