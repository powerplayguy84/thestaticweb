import Link from "next/link";
import Image from "next/image";
import { getCategories, getHomepageHero } from "@/lib/markdown";
import MobileNav from "@/components/MobileNav";

export default async function Navigation() {
  const [categories, hero] = await Promise.all([
    getCategories(),
    getHomepageHero(),
  ]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <Link href="/" className="flex items-center gap-3">
        {hero.logo ? (
          <>
            <div className="relative w-8 h-8">
              <Image
                src={hero.logo}
                alt={`${hero.title} logo`}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              {hero.title}
            </span>
          </>
        ) : (
          <span className="text-xl font-bold text-foreground">
            {hero.title}
          </span>
        )}
      </Link>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/${category}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors capitalize"
          >
            {category}
          </Link>
        ))}
      </div>
      {/* Mobile Navigation */}
      <MobileNav categories={categories} />
    </nav>
  );
}
