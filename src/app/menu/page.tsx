import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { getContent, getMenu } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The Mariposa menu — Mediterranean plates built from the garden out. Photos, prices and guest reviews for every dish.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [content, menu] = await Promise.all([getContent(), getMenu()]);
  return <MenuExperience sections={menu} content={content} />;
}
