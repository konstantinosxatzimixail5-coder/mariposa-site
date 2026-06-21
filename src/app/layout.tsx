import type { Metadata, Viewport } from "next";
import { fraunces, inter } from "@/lib/fonts";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const DESCRIPTION =
  "Family-run Mediterranean cooking in a garden above the Aegean. Vegetables raised in our own beds, served beneath the vines of Theologos, Rhodes. 4.9★ on Tripadvisor, Travelers' Choice 2025.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mariposa.restaurant"),
  title: {
    default: `${BRAND.legalName} · Theologos, Rhodes`,
    template: `%s · ${BRAND.name}`,
  },
  description: DESCRIPTION,
  applicationName: BRAND.name,
  keywords: [
    "Mariposa restaurant",
    "restaurant Theologos Rhodes",
    "Mediterranean restaurant Rhodes",
    "garden restaurant Rhodes",
    "fine dining Rhodes",
    "sunset dinner Rhodes",
    "Greek restaurant Rhodes",
    "Rhodes restaurant reservations",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: BRAND.legalName,
    title: `${BRAND.legalName} · ${BRAND.tagline}`,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${BRAND.legalName}. ${BRAND.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.legalName} · ${BRAND.tagline}`,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.svg" },
  // Google Search Console site verification (renders
  // <meta name="google-site-verification" …> in every page's <head>).
  verification: { google: "lY3VsOme5oK7vjn6f9BCsy5Vqy5mqN61YRW4-NqZf2o" },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

// Root layout is intentionally minimal: it owns only <html>/<body> and global
// metadata so that BOTH the marketing site (the (site) route group, which adds
// smooth-scroll, cursor, grain, analytics) and the Sanity Studio at /studio
// (which must NOT inherit any of that chrome) can render cleanly beneath it.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
