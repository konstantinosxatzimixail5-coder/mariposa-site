import { defineField, defineType } from "sanity";

/**
 * A section of the full à la carte menu (e.g. "Starters", "From the Sea"),
 * holding its dishes. Powers the /menu page. Distinct from the homepage's
 * `dish` type, which is the short list of signature plates.
 */
export const menuSection = defineType({
  name: "menuSection",
  title: "Menu Section",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Section title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtitle (e.g. Greek)", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number", description: "Sort order (ascending)" }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineField({
          name: "item",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: 'Free text, e.g. "18" or "Market price". Leave blank to hide.',
            }),
            defineField({ name: "vegetarian", title: "Vegetarian", type: "boolean" }),
            defineField({ name: "vegan", title: "Vegan", type: "boolean" }),
            defineField({ name: "glutenFree", title: "Gluten-free", type: "boolean" }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
          },
        }),
      ],
    }),
  ],
  orderings: [{ name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title" } },
});
