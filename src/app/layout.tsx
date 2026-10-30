import type { Metadata } from "next";
import { Google_Sans, Geist_Mono, DM_Serif_Display } from "next/font/google";
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

const googleSans = Google_Sans({
  variable: "--font-sans-main",
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Static Web",
  description:
    "A collection of articles, tutorials, and guides for modern web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { siteUrl, organizationName, logoUrl } = getSiteSettings();

  // Generate organization schema for global SEO
  const organizationSchema = cleanSchema(
    generateOrganizationSchema(organizationName, siteUrl, logoUrl)
  );

  return (
    <html lang="en">
      <body
        className={`${googleSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased bg-background ambient-mesh`}
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
