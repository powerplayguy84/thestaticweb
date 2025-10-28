"use client";

import Image from "next/image";
import { useState } from "react";

interface ArticleImageProps {
  src: string;
  alt: string;
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <div className="w-full h-64 sm:h-96 bg-muted overflow-hidden rounded-lg relative mb-8">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
        onError={() => setHasError(true)}
      />
    </div>
  );
}
