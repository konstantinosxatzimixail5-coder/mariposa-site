import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { fraunces, inter } from "@/lib/fonts";
import { BRAND } from "@/lib/brand";
import "./globals.css";

// Homepage meta description (150 chars, under the 160 limit): entity + category
// + location front-loaded for SEO/GEO/AIO, then cuisine, USPs and a CTA. Shared
// with og:description and twitter:description below.
const DESCRIPTION =
  "Award-winning Mediterranean restaurant in Rhodes, Greece. Garden-grown Greek & Italian dishes, daily-changing menu, Aegean views. Reserve at Mariposa.";

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
      <head>
        {/* Warm up the Sanity asset CDN (dish/gallery images) so they connect
            without a cold DNS/TLS round-trip. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        {/* Google Consent Mode v2 — default every non-essential type to denied
            BEFORE GTM loads, for GDPR (Greece/EU). This is a tiny inline stub (no
            network request); it must run before GTM, hence beforeInteractive.
            TODO: wire a cookie-consent banner to call
            gtag('consent','update',{...}) when the visitor accepts. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`}
        </Script>
        {/* Google Tag Manager + GA4 — official @next/third-parties components:
            both load afterInteractive (non-blocking, LCP-safe) and respect the
            Consent Mode defaults set above (analytics stays cookieless until the
            banner grants consent).
            IMPORTANT: GA4 (G-EJ1LSJ3489) is loaded directly here, so do NOT also
            add a GA4 configuration tag inside the GTM-KB7XQXGB container — that
            would double-count pageviews. Use GTM for other tags only. */}
        <GoogleTagManager gtmId="GTM-KB7XQXGB" />
        <GoogleAnalytics gaId="G-EJ1LSJ3489" />
        {children}
      </body>
    </html>
  );
}
