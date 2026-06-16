import { Providers } from "@/components/Providers";
import { RestaurantSchema } from "@/components/RestaurantSchema";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

/**
 * Marketing-site chrome: the motion Providers (smooth scroll, cursor, 3D
 * atmosphere), the skip link, the JSON-LD restaurant schema, the film-grain
 * overlay and Vercel analytics. Everything here is scoped to the public site so
 * the embedded Studio at /studio stays free of it.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <RestaurantSchema />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Providers>{children}</Providers>
      <div className="grain" aria-hidden />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
