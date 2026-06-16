import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "order", type: "number", description: "Sort order" }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "author", subtitle: "quote" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Review",
      subtitle: subtitle ? `"${String(subtitle).slice(0, 60)}…"` : undefined,
    }),
  },
});
