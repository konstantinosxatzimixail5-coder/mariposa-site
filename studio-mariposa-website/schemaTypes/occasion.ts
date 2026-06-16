import { defineField, defineType } from "sanity";

export const occasion = defineType({
  name: "occasion",
  title: "Occasion",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Form value",
      type: "string",
      description: "Feeds the reservation form's occasion field",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "line", type: "text", rows: 2 }),
    defineField({ name: "order", type: "number", description: "Sort order" }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "value" } },
});
