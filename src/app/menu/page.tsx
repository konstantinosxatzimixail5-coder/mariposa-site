import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { getContent, getMenu, getCopy } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The Mariposa menu — Mediterranean plates built from the garden out. Photos, prices and guest reviews for every dish.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [content, menu, copy] = await Promise.all([getContent(), getMenu(), getCopy()]);
  return <MenuExperience sections={menu} content={content} legal={copy.menu.legal} />;
}
