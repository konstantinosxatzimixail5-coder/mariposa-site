import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { RestaurantSchema } from "@/components/RestaurantSchema";
import { getContent, getMenu, getCopy } from "@/lib/content";

export const dynamic = "force-dynamic";

const MENU_DESCRIPTION =
  "The Mariposa menu in Theologos, Rhodes — Mediterranean plates built from the garden out, with photos, prices and guest reviews for every dish.";

export const metadata: Metadata = {
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
};

export default async function MenuPage() {
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
