"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { ArticleMetadata } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";

import "swiper/css";

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
  category: string;
  currentSlug: string;
}

export default function RelatedArticles({
  articles,
  category,
  currentSlug,
}: RelatedArticlesProps) {
  const related = articles.filter((article) => article.slug !== currentSlug);

  if (related.length === 0) {
    return null;
  }

  return (
    <aside
      className="mt-12 pt-8 border-t border-border/40 w-full overflow-hidden"
      data-no-search-highlight
    >
      <h3 className="text-base font-sans font-semibold tracking-tight text-foreground mb-4">
        More in this category
      </h3>

      <div className="relative w-full overflow-hidden pt-1">
        <Swiper
          modules={[A11y, Keyboard]}
          spaceBetween={16}
          slidesPerView={1.15}
          keyboard={{ enabled: true }}
          breakpoints={{
            480: {
              slidesPerView: related.length > 1 ? 1.3 : 1,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: related.length > 1 ? 1.6 : 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: related.length > 2 ? 2.2 : related.length,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: related.length > 2 ? 2.5 : related.length,
              spaceBetween: 24,
            },
          }}
          className="pb-2 cursor-grab active:cursor-grabbing w-full"
        >
          {related.map((article) => (
            <SwiperSlide key={article.slug} className="h-auto">
              <div className="h-full">
                <ArticleCard article={article} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </aside>
  );
}
