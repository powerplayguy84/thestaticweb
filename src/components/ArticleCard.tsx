"use client";

import Link from "next/link";
import Image from "next/image";
import { ArticleMetadata } from "@/lib/markdown";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
  article: ArticleMetadata;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasValidImage =
    article.image && article.image.trim() !== "" && !imageError;

  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className="block rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Image */}
      {hasValidImage && (
        <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
          <Image
            src={article.image!}
            alt={article.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={!article.image!.startsWith("http")}
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4">{article.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <time className="text-slate-500">{article.date}</time>
              {article.tags && article.tags.length > 0 && (
                <div className="flex gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}
