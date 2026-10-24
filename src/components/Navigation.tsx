import Link from "next/link";
import Image from "next/image";
import { getHomepageHero } from "@/lib/markdown";
import ThemeToggle from "@/components/ThemeToggle";
import Search from "@/components/Search";
import { NavigationLayout } from "@/components/NavigationLayout";

export default async function Navigation() {
  const hero = await getHomepageHero();

  // Use navbar-specific values if provided, otherwise fall back to hero values
  const navbarTitle =
    hero.navbar?.title !== undefined ? hero.navbar.title : hero.title;
  const navbarLogo =
    hero.navbar?.logo !== undefined ? hero.navbar.logo : hero.logo;

  return (
    <NavigationLayout>
      <Link href="/" className="group flex items-center gap-2.5">
        {navbarLogo ? (
          <>
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-border/60">
              <Image
                src={navbarLogo}
                alt={`${navbarTitle} logo`}
                fill
                className="object-contain"
              />
            </div>
            {navbarTitle && (
              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {navbarTitle}
              </span>
            )}
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs tracking-wider shadow-xs">
              {navbarTitle ? navbarTitle.slice(0, 2).toUpperCase() : "SW"}
            </div>
            {navbarTitle && (
              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {navbarTitle}
              </span>
            )}
          </>
        )}
      </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Search />
          <ThemeToggle />
        </div>
    </NavigationLayout>
  );
}
