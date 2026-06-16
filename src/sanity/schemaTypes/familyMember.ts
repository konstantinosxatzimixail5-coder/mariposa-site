import { defineField, defineType } from "sanity";

export const familyMember = defineType({
  name: "familyMember",
  title: "Family Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "line", title: "Bio line", type: "text", rows: 2 }),
    defineField({ name: "image", title: "Portrait", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", type: "number", description: "Sort order" }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
