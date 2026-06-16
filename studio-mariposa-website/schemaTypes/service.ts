import { defineField, defineType } from "sanity";

/** A daily service (breakfast / lunch / dinner) shown in Hours & The Experience. */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "time", title: "Time (display)", type: "string" }),
    defineField({ name: "opens", title: "Opens (ISO)", type: "string" }),
    defineField({ name: "closes", title: "Closes (ISO)", type: "string" }),
    defineField({ name: "line", title: "Line", type: "text", rows: 2 }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", subtitle: "time", media: "image" } },
});
