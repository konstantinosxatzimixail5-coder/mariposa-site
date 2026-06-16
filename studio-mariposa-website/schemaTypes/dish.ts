import { defineField, defineType } from "sanity";

/** A signature plate shown in the Menu section. */
export const dish = defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "note", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "review",
      title: "Pull-quote review",
      type: "object",
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 2 }),
        defineField({ name: "author", title: "Author", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls display order (ascending).",
    }),
  ],
  orderings: [{ name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "tagline", media: "image" } },
});
