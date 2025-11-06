import Link from "next/link";
import Image from "next/image";
import { getCategoriesWithInfo, getHomepageHero } from "@/lib/markdown";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import Search from "@/components/Search";
import { formatCategoryName } from "@/lib/utils";

export default async function Navigation() {
  const [categoriesInfo, hero] = await Promise.all([
    getCategoriesWithInfo(),
    getHomepageHero(),
  ]);

  // Use navbar-specific values if provided, otherwise fall back to hero values
  const navbarTitle = hero.navbar?.title || hero.title;
  const navbarLogo = hero.navbar?.logo || hero.logo;

  return (
    <nav className="py-4 border-b border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 print:hidden">
      <div className="flex items-center justify-between mx-auto px-6">
        <Link href="/" className="flex items-center gap-3">
          {navbarLogo ? (
            <>
              <div className="relative w-8 h-8">
                <Image
                  src={navbarLogo}
                  alt={`${navbarTitle} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                {navbarTitle}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-foreground">
              {navbarTitle}
            </span>
          )}
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {categoriesInfo.map((category) => (
            <Link
              key={category.slug}
              href={`/${encodeURIComponent(category.slug)}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors capitalize"
            >
              {category.title || formatCategoryName(category.slug)}
            </Link>
          ))}
          <Search />
          <ThemeToggle />
        </div>
        {/* Mobile Navigation */}
        <MobileNav categoriesInfo={categoriesInfo} />
      </div>
    </nav>
  );
}
