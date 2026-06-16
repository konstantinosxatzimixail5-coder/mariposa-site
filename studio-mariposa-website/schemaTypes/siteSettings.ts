import { defineField, defineType } from "sanity";

/**
 * Singleton holding Mariposa's core business facts — the scalar content that was
 * the head of `src/lib/brand.ts`. Lists (dishes, reviews, family, occasions,
 * services, FAQs) are their own document types so they can be ordered and edited
 * individually.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "contact", title: "Contact" },
    { name: "reputation", title: "Reputation" },
    { name: "hours", title: "Hours" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "brand", validation: (r) => r.required() }),
    defineField({ name: "legalName", type: "string", group: "brand" }),
    defineField({ name: "tagline", type: "string", group: "brand" }),
    defineField({ name: "meaning", type: "string", group: "brand" }),
    defineField({ name: "cuisine", type: "string", group: "brand" }),
    defineField({ name: "owner", type: "string", group: "brand" }),
    defineField({ name: "ownerRole", type: "string", group: "brand" }),

    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({ name: "email", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp URL", type: "url", group: "contact" }),
    defineField({ name: "reservationUrl", title: "Reservation URL", type: "string", group: "contact" }),
    defineField({ name: "menuUrl", title: "Menu URL", type: "url", group: "contact" }),
    defineField({
      name: "social",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "instagramHandle", type: "string" }),
        defineField({ name: "facebook", type: "url" }),
      ],
    }),
    defineField({
      name: "address",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "street", type: "string" }),
        defineField({ name: "locality", type: "string" }),
        defineField({ name: "region", type: "string" }),
        defineField({ name: "postalCode", type: "string" }),
        defineField({ name: "country", type: "string" }),
        defineField({ name: "full", type: "string" }),
      ],
    }),
    defineField({ name: "geo", title: "Geo", type: "geopoint", group: "contact" }),

    defineField({ name: "rating", type: "number", group: "reputation", validation: (r) => r.min(0).max(5) }),
    defineField({ name: "reviewCount", type: "number", group: "reputation" }),
    defineField({ name: "award", type: "string", group: "reputation" }),
    defineField({ name: "ranking", type: "string", group: "reputation" }),
    defineField({ name: "tripadvisorUrl", title: "Tripadvisor URL", type: "url", group: "reputation" }),
    defineField({ name: "googleReviewsUrl", title: "Google Reviews URL", type: "string", group: "reputation" }),
    defineField({ name: "googleMapsSearch", title: "Google Maps search", type: "url", group: "reputation" }),
    defineField({
      name: "googleReview",
      title: "Headline Google review",
      type: "object",
      group: "reputation",
      fields: [
        defineField({ name: "quote", type: "text", rows: 3 }),
        defineField({ name: "author", type: "string" }),
        defineField({ name: "source", type: "string" }),
      ],
    }),

    defineField({
      name: "hours",
      title: "Opening hours",
      type: "object",
      group: "hours",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "time", type: "string" }),
        defineField({ name: "opens", title: "Opens (24h ISO, e.g. 09:00)", type: "string" }),
        defineField({ name: "closes", title: "Closes (24h ISO, max 23:59)", type: "string" }),
      ],
    }),

    defineField({ name: "heroVideo", title: "Hero video path", type: "string", group: "media" }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline" },
  },
});
