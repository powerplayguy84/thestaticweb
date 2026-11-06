import Link from "next/link";
import Image from "next/image";
import { getHomepageHero, getSiteSettings } from "@/lib/markdown";
import Search from "@/components/Search";
import ThemeToggle from "@/components/ThemeToggle";
import { NavigationLayout } from "@/components/NavigationLayout";

export default async function Navigation() {
  const hero = await getHomepageHero();
  const settings = getSiteSettings();

  // If navbar is explicitly configured, use navbar.title (allowing it to be omitted/undefined)
  const navbarTitle =
    hero.navbar !== undefined ? hero.navbar.title : hero.title;
  const brandName = navbarTitle || hero.title || "Invent Peace";
  const navbarLogo =
    hero.navbar?.logo !== undefined ? hero.navbar.logo : hero.logo;
  const logoStyle = hero.navbar?.logoStyle ?? "square";
  const isBordered = hero.navbar?.bordered ?? false;
  const logoHeight = hero.navbar?.logoHeight;

  return (
    <NavigationLayout>
      <Link
        href="/"
        className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg shrink-0"
      >
        {navbarLogo ? (
          <div
            style={
              {
                "--logo-h": `${logoHeight || (logoStyle === "fullwidth" ? 40 : 32)}px`,
              } as React.CSSProperties
            }
            className={`relative overflow-hidden transition-all group-hover:scale-[1.01] shrink-0 ${
              logoStyle === "fullwidth"
                ? `h-[calc(var(--logo-h)*0.75)] sm:h-[var(--logo-h)] w-auto flex items-center ${isBordered ? "rounded-md" : ""}`
                : `size-7 sm:size-8 ${isBordered ? "rounded-xl" : ""}`
            } ${
              isBordered
                ? "border border-border/70 shadow-xs group-hover:border-foreground/30"
                : ""
            }`}
          >
            {logoStyle === "fullwidth" ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={navbarLogo}
                  alt={`${brandName} logo`}
                  className="h-full w-auto max-w-[42vw] sm:max-w-none object-contain block dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo_dark.png"
                  alt={`${brandName} logo`}
                  className="h-full w-auto max-w-[42vw] sm:max-w-none object-contain hidden dark:block"
                />
              </>
            ) : (
              <>
                <Image
                  src={navbarLogo}
                  alt={`${brandName} logo`}
                  fill
                  className="object-contain block dark:hidden"
                />
                <Image
                  src="/logo_dark.png"
                  alt={`${brandName} logo`}
                  fill
                  className="object-contain hidden dark:block"
                />
              </>
            )}
          </div>
        ) : (
          <div
            className={`relative size-8 rounded-xl bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs tracking-wider group-hover:scale-[1.03] transition-all duration-200 ${
              isBordered ? "border border-border/40 shadow-xs group-hover:shadow-sm" : ""
            }`}
          >
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
        {settings.lightMode === "both" && <ThemeToggle />}
      </div>
    </NavigationLayout>
  );
}
