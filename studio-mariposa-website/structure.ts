import type { StructureResolver } from "sanity/structure";

/**
 * Desk structure. Site Settings is a singleton (one editable document, no list);
 * everything else is a normal document list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Mariposa")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("dish").title("Dishes"),
      S.documentTypeListItem("review").title("Reviews"),
      S.documentTypeListItem("familyMember").title("Family"),
      S.documentTypeListItem("occasion").title("Occasions"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("faq").title("FAQs"),
    ]);
