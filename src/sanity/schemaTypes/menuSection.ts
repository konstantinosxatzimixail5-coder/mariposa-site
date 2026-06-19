import { defineField, defineType } from "sanity";

/**
 * A section of the full à la carte menu (Starters / Salads / Main / Dessert),
 * holding its dishes. Each item carries its own media (photo, plated shot,
 * detail, video, 360° frames), a rating and guest reviews — so the /menu page
 * can render the clickable detail view. Powers the /menu page.
 */
export const menuSection = defineType({
  name: "menuSection",
  title: "Menu Section",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Section title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtitle (Greek)", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number", description: "Sort order (ascending)" }),
    defineField({
      name: "items",
      title: "Dishes",
      type: "array",
      of: [
        defineField({
          name: "item",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "price", title: "Price (number only, e.g. 14)", type: "string" }),
            defineField({ name: "vegetarian", title: "Vegetarian", type: "boolean" }),
            defineField({ name: "vegan", title: "Vegan", type: "boolean" }),
            defineField({ name: "glutenFree", title: "Gluten-free", type: "boolean" }),
            defineField({ name: "rating", title: "Rating (0–5)", type: "number", validation: (r) => r.min(0).max(5) }),
            defineField({ name: "reviewCount", title: "Number of reviews", type: "number" }),
            // Media — shown as tabs in the dish detail popup.
            defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
            defineField({ name: "plated", title: "Plated photo", type: "image", options: { hotspot: true } }),
            defineField({ name: "detail", title: "Detail photo", type: "image", options: { hotspot: true } }),
            defineField({ name: "video", title: "Video (URL or upload)", type: "file", options: { accept: "video/*" } }),
            defineField({
              name: "spin",
              title: "360° frames (ordered)",
              type: "array",
              of: [{ type: "image" }],
              description: "Upload the rotation frames in order for the 360° spin.",
            }),
            defineField({
              name: "reviews",
              title: "Guest reviews",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "author", title: "Author", type: "string" }),
                    defineField({ name: "quote", title: "Quote", type: "text", rows: 2 }),
                    defineField({ name: "rating", title: "Rating (0–5)", type: "number", validation: (r) => r.min(0).max(5) }),
                  ],
                  preview: { select: { title: "author", subtitle: "quote" } },
                },
              ],
            }),
          ],
          preview: { select: { title: "name", subtitle: "price", media: "photo" } },
        }),
      ],
    }),
  ],
  orderings: [{ name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle" } },
});
