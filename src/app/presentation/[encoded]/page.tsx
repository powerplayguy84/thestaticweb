import { getArticle } from "@/lib/markdown";
import { notFound } from "next/navigation";
import PresentationClient from "./PresentationClient";

interface PresentationPageProps {
  params: Promise<{
    encoded: string;
  }>;
}

export default async function PresentationPage({
  params,
}: PresentationPageProps) {
  const { encoded } = await params;

  // Decode the path (e.g., "/guides/tailwind-setup")
  const sourcePath = decodeURIComponent(encoded);

  // Extract category and slug from path
  const pathParts = sourcePath.split("/").filter(Boolean);
  if (pathParts.length !== 2) {
    notFound();
  }

  const [category, slug] = pathParts;

  // Fetch the article from filesystem
  const article = await getArticle(category, slug);

  if (!article) {
    notFound();
  }

  return (
    <PresentationClient
      htmlContent={article.content}
      title={article.title}
      description={article.description}
      image={article.image}
    />
  );
}
