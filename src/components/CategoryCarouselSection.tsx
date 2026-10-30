"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import { ArticleMetadata, CategoryInfo } from "@/lib/markdown";
import ArticleCard from "@/components/ArticleCard";
import { formatCategoryName } from "@/lib/utils";

import "swiper/css";

interface CategoryCarouselSectionProps {
  category: CategoryInfo;
  articles: ArticleMetadata[];
}

export function CategoryCarouselSection({
  category,
  articles,
}: CategoryCarouselSectionProps) {
  if (!articles || articles.length === 0) return null;

  const displayName = category.title || formatCategoryName(category.slug);

  return (
    <section className="space-y-4 w-full">
      {/* Category Header: Clean title only, no line */}
      <div className="pb-1">
        <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
          {displayName}
        </h2>
      </div>

      {/* Swiper Carousel or Single Full-Width Card */}
      <div className="relative w-full overflow-hidden pt-1">
        {articles.length === 1 ? (
          <div className="w-full max-w-xl">
            <ArticleCard article={articles[0]} />
          </div>
        ) : (
          <Swiper
            modules={[A11y, Keyboard]}
            spaceBetween={16}
            slidesPerView={1.15}
            keyboard={{ enabled: true }}
            breakpoints={{
              480: {
                slidesPerView: 1.3,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 1.6,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: articles.length > 2 ? 2.2 : articles.length,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: articles.length > 2 ? 2.6 : articles.length,
                spaceBetween: 24,
              },
            }}
            className="pb-2 cursor-grab active:cursor-grabbing w-full"
          >
            {articles.map((article) => (
              <SwiperSlide key={`${article.category}-${article.slug}`} className="h-auto">
                <div className="h-full">
                  <ArticleCard article={article} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
