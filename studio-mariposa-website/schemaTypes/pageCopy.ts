import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Page Copy — a single document holding every static copy string on the
 * homepage sections that was previously hardcoded in the section components:
 * eyebrows, headings, intros, body paragraphs, pull-quotes, button labels and
 * small section labels. Mirrors the shape of src/lib/copy.ts (COPY); blank
 * fields fall back to those defaults via getCopy().
 */
export const pageCopy = defineType({
  name: "pageCopy",
  title: "Page Copy",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "dishes", title: "Dishes" },
    { name: "garden", title: "Garden" },
    { name: "chefsWords", title: "Chef's Words" },
    { name: "experience", title: "Experience" },
    { name: "celebrations", title: "Celebrations" },
    { name: "reviews", title: "Reviews" },
    { name: "reservation", title: "Reservation" },
    { name: "family", title: "Family" },
    { name: "faq", title: "FAQ" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // Hero
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "headingLine1", title: "Heading line 1", type: "string" }),
        defineField({ name: "headingLine2", title: "Heading line 2", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
        defineField({ name: "primaryCta", title: "Primary CTA", type: "string" }),
        defineField({ name: "secondaryCta", title: "Secondary CTA", type: "string" }),
        defineField({ name: "scroll", title: "Scroll label", type: "string" }),
      ],
    }),

    // Dishes
    defineField({
      name: "dishes",
      title: "Dishes",
      type: "object",
      group: "dishes",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
        defineField({ name: "viewPlate", title: "View plate label", type: "string" }),
        defineField({ name: "fullMenuHeading", title: "Full menu heading", type: "string" }),
        defineField({ name: "fullMenuBody", title: "Full menu body", type: "text", rows: 3 }),
        defineField({ name: "fullMenuCta", title: "Full menu CTA", type: "string" }),
      ],
    }),

    // Garden
    defineField({
      name: "garden",
      title: "Garden",
      type: "object",
      group: "garden",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
        defineField({
          name: "beats",
          title: "Beats",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "label", subtitle: "title" } },
            }),
          ],
        }),
      ],
    }),

    // Chef's Words
    defineField({
      name: "chefsWords",
      title: "Chef's Words",
      type: "object",
      group: "chefsWords",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "despoinaQuoteLine1", title: "Despoina quote line 1", type: "string" }),
        defineField({ name: "despoinaQuoteLine2", title: "Despoina quote line 2", type: "string" }),
        defineField({ name: "despoinaQuoteLine3", title: "Despoina quote line 3", type: "string" }),
        defineField({ name: "despoinaBody", title: "Despoina body", type: "text", rows: 4 }),
        defineField({ name: "despoinaCaption", title: "Despoina caption", type: "string" }),
        defineField({ name: "salvatoreQuoteLine1", title: "Salvatore quote line 1", type: "string" }),
        defineField({ name: "salvatoreQuoteLine2", title: "Salvatore quote line 2", type: "string" }),
        defineField({ name: "salvatoreQuoteLine3", title: "Salvatore quote line 3", type: "string" }),
        defineField({ name: "salvatoreBody", title: "Salvatore body", type: "text", rows: 4 }),
        defineField({ name: "salvatoreCaption", title: "Salvatore caption", type: "string" }),
      ],
    }),

    // Experience
    defineField({
      name: "experience",
      title: "Experience",
      type: "object",
      group: "experience",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
      ],
    }),

    // Celebrations
    defineField({
      name: "celebrations",
      title: "Celebrations",
      type: "object",
      group: "celebrations",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "planThisEvening", title: "Plan this evening label", type: "string" }),
        defineField({ name: "cta", title: "CTA", type: "string" }),
        defineField({ name: "footnote", title: "Footnote", type: "text", rows: 3 }),
      ],
    }),

    // Reviews
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "object",
      group: "reviews",
      fields: [
        defineField({ name: "headlinePrefix", title: "Headline prefix", type: "string" }),
        defineField({ name: "headlineWord", title: "Headline emphasised word", type: "string" }),
        defineField({ name: "headlineSuffix", title: "Headline suffix", type: "string" }),
        defineField({ name: "starsSuffix", title: "Stars suffix", type: "string" }),
        defineField({ name: "reviewsLabel", title: "Reviews label", type: "string" }),
        defineField({ name: "tripadvisorCtaPrefix", title: "Tripadvisor CTA prefix", type: "string" }),
        defineField({ name: "tripadvisorCtaSuffix", title: "Tripadvisor CTA suffix", type: "string" }),
        defineField({ name: "googleCta", title: "Google CTA", type: "string" }),
      ],
    }),

    // Reservation
    defineField({
      name: "reservation",
      title: "Reservation",
      type: "object",
      group: "reservation",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
        defineField({ name: "reachUsDirectly", title: "Reach us directly label", type: "string" }),
        defineField({ name: "whatsappLabel", title: "WhatsApp label", type: "string" }),
      ],
    }),

    // Family
    defineField({
      name: "family",
      title: "Family",
      type: "object",
      group: "family",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
        defineField({ name: "body", title: "Body", type: "text", rows: 5 }),
        defineField({ name: "pullQuoteLead", title: "Pull-quote lead", type: "string" }),
        defineField({ name: "pullQuoteEmphasis", title: "Pull-quote emphasis", type: "string" }),
      ],
    }),

    // FAQ
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
      ],
    }),

    // Footer
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "hoursLabel", title: "Hours label", type: "string" }),
        defineField({ name: "writeToUsLabel", title: "Write to Us label", type: "string" }),
        defineField({ name: "findUsLabel", title: "Find Us label", type: "string" }),
        defineField({ name: "tagline", title: "Tagline", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Page Copy" }),
  },
});
