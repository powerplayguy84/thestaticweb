import Link from "next/link";
import Image from "next/image";
import { getHomepageHero } from "@/lib/markdown";
import ThemeToggle from "@/components/ThemeToggle";
import Search from "@/components/Search";

export default async function Navigation() {
  const hero = await getHomepageHero();

  // Use navbar-specific values if provided, otherwise fall back to hero values
  const navbarTitle =
    hero.navbar?.title !== undefined ? hero.navbar.title : hero.title;
  const navbarLogo =
    hero.navbar?.logo !== undefined ? hero.navbar.logo : hero.logo;

  return (
    <nav className="py-4 sticky top-0 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 z-50 print:hidden transition-colors w-full">
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-4 md:px-6">
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
              {navbarTitle && (
                <span className="text-xl font-serif font-bold text-foreground">
                  {navbarTitle}
                </span>
              )}
            </>
          ) : (
            navbarTitle && (
              <span className="text-xl font-serif font-bold text-foreground">
                {navbarTitle}
              </span>
            )
          )}
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Search />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
