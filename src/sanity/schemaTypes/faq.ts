import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "answer",
      type: "text",
      rows: 4,
      description: "Answer-first: open with the plain fact, then the house voice.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", description: "Sort order" }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});
