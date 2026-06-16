import type { Metadata, Viewport } from "next";
import { fraunces, inter } from "@/lib/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/**
 * Root layout — intentionally minimal. The public site's chrome (motion,
 * JSON-LD, marketing metadata) lives in the `(site)` route group, keeping this
 * shell free for any non-site routes.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://mariposa.restaurant"),
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
