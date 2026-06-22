import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { RestaurantSchema } from "@/components/RestaurantSchema";
import { getContent, getMenu, getCopy } from "@/lib/content";
import { MENU_PUBLISHED, MENU_PREVIEW_KEY } from "@/lib/flags";

export const dynamic = "force-dynamic";

const MENU_DESCRIPTION =
  "The Mariposa menu in Theologos, Rhodes — Mediterranean plates built from the garden out, with photos, prices and guest reviews for every dish.";

export const metadata: Metadata = MENU_PUBLISHED
  ? {
      title: "Menu — Mediterranean Dining in Theologos, Rhodes",
      description: MENU_DESCRIPTION,
      alternates: { canonical: "/menu" },
      openGraph: {
        type: "website",
        locale: "en_GB",
        url: "/menu",
        siteName: "Mariposa Restaurant & Fine Dining",
        title: "Mariposa Menu — Mediterranean Dining in Theologos, Rhodes",
        description: MENU_DESCRIPTION,
        images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Mariposa Restaurant, Theologos, Rhodes" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Mariposa Menu — Theologos, Rhodes",
        description: MENU_DESCRIPTION,
        images: ["/og.jpg"],
      },
    }
  : // Menu hidden for now: keep it out of the index while the page redirects.
    { title: "Menu", robots: { index: false, follow: false } };

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  // The full menu is hidden from the public: redirect any normal visit home.
  // A secret `?preview=<MENU_PREVIEW_KEY>` link still renders it (noindex), so
  // the owner can view it privately without it becoming public.
  const { preview } = await searchParams;
  const previewing = preview === MENU_PREVIEW_KEY;
  if (!MENU_PUBLISHED && !previewing) redirect("/");

  const [content, menu, copy] = await Promise.all([getContent(), getMenu(), getCopy()]);
  return (
    <>
      {/* Server-rendered restaurant/organization/website/breadcrumb/menu graph,
          so /menu carries the same structured data as the homepage. */}
      <RestaurantSchema />
      <MenuExperience sections={menu} content={content} legal={copy.menu.legal} />
    </>
  );
}
