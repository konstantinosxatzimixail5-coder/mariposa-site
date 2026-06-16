import { defineField, defineType } from "sanity";

/** An occasion the restaurant hosts (Celebrations section + reservation form). */
export const occasion = defineType({
  name: "occasion",
  title: "Occasion",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Machine value used by the reservation form (e.g. birthday).",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "line", title: "Line", type: "text", rows: 2 }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [{ name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "value" } },
});
