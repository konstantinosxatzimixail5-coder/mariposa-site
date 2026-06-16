import { defineField, defineType } from "sanity";

export const dish = defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", description: "Sort order on the page" }),
    defineField({ name: "tagline", title: "Card line", type: "string" }),
    defineField({ name: "note", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "review",
      title: "Pull-quote",
      type: "object",
      fields: [
        defineField({ name: "quote", type: "text", rows: 2 }),
        defineField({ name: "author", type: "string" }),
        defineField({ name: "city", type: "string" }),
      ],
    }),
    defineField({
      name: "media",
      title: "Produced media",
      type: "object",
      fields: [
        defineField({ name: "spin", title: "360° spin (path/url)", type: "string" }),
        defineField({ name: "video", title: "Short video (path/url)", type: "string" }),
      ],
    }),
  ],
  orderings: [
    { title: "Page order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "tagline", media: "image" } },
});
