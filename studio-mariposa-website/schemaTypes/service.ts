import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "time", title: "Display time", type: "string" }),
    defineField({ name: "opens", title: "Opens (24h ISO)", type: "string" }),
    defineField({ name: "closes", title: "Closes (24h ISO)", type: "string" }),
    defineField({ name: "line", type: "text", rows: 2 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", type: "number", description: "Sort order" }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "label", subtitle: "time", media: "image" } },
});
