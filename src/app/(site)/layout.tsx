import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { RestaurantSchema } from "@/components/RestaurantSchema";
import { getSettings } from "@/lib/content";

const DESCRIPTION =
  "Family-run Mediterranean cooking in a garden above the Aegean. Vegetables raised in our own beds, served beneath the vines of Theologos, Rhodes. 4.9★ on Tripadvisor, Travelers' Choice 2025.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.legalName} · Theologos, Rhodes`,
      template: `%s · ${settings.name}`,
    },
    description: DESCRIPTION,
    applicationName: settings.name,
    keywords: [
      "Mariposa",
      "fine dining Rhodes",
      "Mediterranean restaurant Theologos",
      "garden restaurant Aegean",
      "Rhodes restaurant reservations",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: "/",
      siteName: settings.legalName,
      title: `${settings.legalName} · ${settings.tagline}`,
      description: DESCRIPTION,
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: `${settings.legalName}. ${settings.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.legalName} · ${settings.tagline}`,
      description: DESCRIPTION,
      images: ["/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

/**
 * Marketing-site layout. Holds the motion chrome (smooth scroll, cursor,
 * preloader, 3D atmosphere) and the Restaurant JSON-LD — everything the public
 * pages share, scoped to the `(site)` group rather than the root shell.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  return (
    <>
      <RestaurantSchema settings={settings} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Providers>{children}</Providers>
      <div className="grain" aria-hidden />
    </>
  );
}
