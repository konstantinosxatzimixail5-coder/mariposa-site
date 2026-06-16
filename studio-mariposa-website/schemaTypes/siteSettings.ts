import { defineField, defineType } from "sanity";

/**
 * Site settings — a single document holding all the venue's core facts that
 * were previously hardcoded in src/lib/brand.ts: identity, contact, ratings,
 * external links, address, geo, hours and the headline Google review.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact & Links" },
    { name: "ratings", title: "Ratings" },
    { name: "location", title: "Location & Hours" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "identity", validation: (r) => r.required() }),
    defineField({ name: "legalName", title: "Legal name", type: "string", group: "identity" }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "identity" }),
    defineField({ name: "meaning", title: "Meaning", type: "string", group: "identity" }),
    defineField({ name: "cuisine", title: "Cuisine", type: "string", group: "identity" }),
    defineField({ name: "owner", title: "Owner", type: "string", group: "identity" }),
    defineField({ name: "ownerRole", title: "Owner role", type: "string", group: "identity" }),

    defineField({ name: "phone", title: "Phone (display)", type: "string", group: "contact" }),
    defineField({ name: "phoneHref", title: "Phone (tel: href)", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "emailHref", title: "Email (mailto: href)", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp link", type: "url", group: "contact" }),
    defineField({ name: "reservationUrl", title: "Reservation URL", type: "string", group: "contact" }),
    defineField({ name: "tripadvisorUrl", title: "Tripadvisor URL", type: "url", group: "contact" }),
    defineField({ name: "googleReviewsUrl", title: "Google reviews URL", type: "string", group: "contact" }),
    defineField({ name: "googleMapsSearch", title: "Google Maps search URL", type: "url", group: "contact" }),
    defineField({ name: "menuUrl", title: "Menu URL", type: "url", group: "contact" }),
    defineField({
      name: "social",
      title: "Social",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "instagramHandle", title: "Instagram handle", type: "string" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
      ],
    }),

    defineField({ name: "rating", title: "Rating", type: "number", group: "ratings", validation: (r) => r.min(0).max(5) }),
    defineField({ name: "reviewCount", title: "Review count", type: "number", group: "ratings" }),
    defineField({ name: "award", title: "Award", type: "string", group: "ratings" }),
    defineField({ name: "ranking", title: "Ranking", type: "string", group: "ratings" }),
    defineField({
      name: "googleReview",
      title: "Headline Google review",
      type: "object",
      group: "ratings",
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
        defineField({ name: "author", title: "Author", type: "string" }),
        defineField({ name: "source", title: "Source", type: "string", initialValue: "Google" }),
      ],
    }),

    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "location",
      fields: [
        defineField({ name: "street", title: "Street", type: "string" }),
        defineField({ name: "locality", title: "Locality", type: "string" }),
        defineField({ name: "region", title: "Region", type: "string" }),
        defineField({ name: "postalCode", title: "Postal code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
        defineField({ name: "full", title: "Full (one line)", type: "string" }),
      ],
    }),
    defineField({
      name: "geo",
      title: "Geo",
      type: "object",
      group: "location",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
      ],
    }),
    defineField({
      name: "hours",
      title: "Opening hours (summary)",
      type: "object",
      group: "location",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "time", title: "Time (display)", type: "string" }),
        defineField({ name: "opens", title: "Opens (ISO)", type: "string" }),
        defineField({ name: "closes", title: "Closes (ISO)", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline" },
  },
});
