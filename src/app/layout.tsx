import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { SearchIndexInitializer } from "@/components/SearchIndexInitializer";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { getSiteSettings } from "@/lib/markdown";
import { generateOrganizationSchema, cleanSchema } from "@/lib/schema";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invent Peace | Cause-Led × Purposeful Technology",
  description:
    "Purposeful web applications and digital engineering guided by human-first design, accessibility, and resilient architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { siteUrl, organizationName, logoUrl, lightMode } = getSiteSettings();

  // Generate organization schema for global SEO
  const organizationSchema = cleanSchema(
    generateOrganizationSchema(organizationName, siteUrl, logoUrl)
  );

  const initialClassName = lightMode === "light" ? "" : "dark";
  const initialColorScheme = lightMode === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={initialClassName}
      style={{ colorScheme: initialColorScheme }}
      suppressHydrationWarning
    >
      <head>
        {lightMode === "both" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light";}else if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased bg-background ambient-mesh`}
      >
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <SearchIndexInitializer />
        <NavbarWrapper>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
          >
            Skip to main content
          </a>
          <Navigation />
        </NavbarWrapper>
        {children}
      </body>
    </html>
  );
}
