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

  // Fully decode the path even if double-encoded (e.g., "%2Fabout%2520us%2Fcore-philosophy")
  let sourcePath = decodeURIComponent(encoded);
  while (sourcePath.includes("%")) {
    try {
      const next = decodeURIComponent(sourcePath);
      if (next === sourcePath) break;
      sourcePath = next;
    } catch {
      break;
    }
  }

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
      sections={article.sections}
    />
  );
}
