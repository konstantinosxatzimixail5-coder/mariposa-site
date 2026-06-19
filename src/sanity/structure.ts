import type { StructureResolver } from "sanity/structure";

/**
 * Desk structure. Site Settings is a singleton (one editable document, no list),
 * and the rest are ordinary collections.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Page Copy")
        .id("pageCopy")
        .child(S.document().schemaType("pageCopy").documentId("pageCopy")),
      S.divider(),
      S.documentTypeListItem("dish").title("Dishes"),
      S.documentTypeListItem("menuSection").title("Menu (full)"),
      S.documentTypeListItem("testimonial").title("Reviews"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("occasion").title("Occasions"),
      S.documentTypeListItem("familyMember").title("Family"),
    ]);
