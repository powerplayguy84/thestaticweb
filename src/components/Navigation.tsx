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
      <Link href="/" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {navbarLogo ? (
          <div className="relative size-8 rounded-xl overflow-hidden border border-border/70 shadow-xs group-hover:border-foreground/30 transition-all group-hover:scale-[1.02]">
            <Image
              src={navbarLogo}
              alt={`${navbarTitle} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="relative size-8 rounded-xl bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs tracking-wider shadow-xs border border-border/40 group-hover:shadow-sm group-hover:scale-[1.03] transition-all duration-200">
            {navbarTitle ? navbarTitle.slice(0, 2).toUpperCase() : "SW"}
          </div>
        )}
        {navbarTitle && (
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {navbarTitle}
            </span>
          </div>
        )}
      </Link>
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <Search />
        <ThemeToggle />
      </div>
    </NavigationLayout>
  );
}
