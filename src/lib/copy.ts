/**
 * Editable homepage copy — every static string in the homepage sections that is
 * NOT already covered by the list content (dishes, reviews, services, occasions,
 * family, FAQs, menu). Eyebrows, headings, intros, body paragraphs, pull-quotes,
 * button labels and small section labels live here.
 *
 * This is the canonical seed/fallback truth, mirrored by the `pageCopy` Sanity
 * singleton. getCopy() in src/lib/content.ts deep-merges Sanity over these
 * defaults so a blank field falls back to the value below and the rendered site
 * is unchanged until edited.
 *
 * Plain data — no "server-only" import — so the seed script and components can
 * both import it.
 */
export const COPY = {
  hero: {
    headingLine1: "The hidden gem",
    headingLine2: "above the Aegean",
    intro:
      "A family kitchen where the Mediterranean is grown in our own garden and served beneath the vines of Theologos, Rhodes.",
    primaryCta: "Make a Reservation",
    secondaryCta: "Discover Mariposa",
    scroll: "Scroll",
  },
  dishes: {
    eyebrow: "Menu · Signature Plates",
    heading: "The plates guests ask for by name",
    intro:
      "Our menu changes with the garden and the day; these are the plates guests ask for by name.",
    viewPlate: "View plate",
    fullMenuHeading: "Discover our full menu",
    fullMenuBody:
      "The kitchen writes the day's menu around what the garden and the catch give. See everything on the table right now.",
    fullMenuCta: "View the menu",
  },
  garden: {
    eyebrow: "Garden & Philosophy",
    heading: "Grown here, cooked here",
    intro:
      "Three things shape every evening at Mariposa: a garden a few steps away, a menu kept small so nothing sits, and a table set among the plants. What the garden withholds, the island and the sea provide.",
    beats: [
      {
        label: "The Garden",
        title: "Steps from the table",
        body: "Vegetables and herbs grow the length of the terrace and are picked the morning they are served. When Despoina needs more lemon herbs, she gathers them while you take your seat.",
      },
      {
        label: "The Menu",
        title: "Small, and always moving",
        body: "A few dishes, chosen and replaced often, every plate cooked fresh. It keeps the kitchen honest and gives you flavors you rarely meet twice.",
      },
      {
        label: "The Setting",
        title: "An earthy calm under the vines",
        body: "Tables sit among the plants beneath a canopy of vine leaves, the light coming through soft and green. The evening slows the moment you arrive.",
      },
    ],
  },
  chefsWords: {
    eyebrow: "Chef's Words",
    heading: "Two voices, one kitchen",
    despoinaQuoteLine1: "Good food begins in respect.",
    despoinaQuoteLine2: "For the ingredient, and for the",
    despoinaQuoteLine3: "land that gives it.",
    despoinaBody:
      "Despoina draws the vegetables from the beds beside the terrace, picked the morning they reach your plate, and cooks them the way she cooks at home. The menu, the dishes and the look of the room all began with her.",
    despoinaCaption: "Despoina · Founder & Chef",
    salvatoreQuoteLine1: "I keep the menu small and",
    salvatoreQuoteLine2: "change it often, so every plate",
    salvatoreQuoteLine3: "is cooked fresh.",
    salvatoreBody:
      "Salvatore came from Sicily and now carries Despoina's kitchen forward. The pasta is rolled by hand and the bread leaves his oven each morning. Sicily meets Rhodes on one table, and the result is a handful of flavors you rarely find twice.",
    salvatoreCaption: "Salvatore · Chef, Pasta & Bread",
  },
  experience: {
    eyebrow: "The Experience",
    heading: "One long, unhurried day",
    intro:
      "The garden, the vines and the light shift through the hours, and the kitchen follows. We hold only a handful of covers each service, so we gently suggest reserving ahead.",
  },
  celebrations: {
    eyebrow: "Celebrations & Private Events",
    heading: "For the evenings that matter",
    planThisEvening: "Plan this evening →",
    cta: "Plan your evening with us",
    footnote:
      "Tell us the occasion and a little of what you have in mind. Konstantin will take it from there.",
  },
  reviews: {
    headlinePrefix: "288 reviews. 4.9 stars. One word keeps surfacing: ",
    headlineWord: "gem",
    headlineSuffix: ".",
    starsSuffix: "stars",
    reviewsLabel: "reviews",
    tripadvisorCtaPrefix: "Read all ",
    tripadvisorCtaSuffix: " reviews on Tripadvisor",
    googleCta: "Read our reviews on Google",
  },
  reservation: {
    heading: "Reserve your table",
    intro:
      "Lunch beneath the vines or dinner over the Aegean at dusk. We hold only a handful of covers each service, so we gently suggest reserving ahead.",
    reachUsDirectly: "Or reach us directly",
    whatsappLabel: "WhatsApp",
  },
  family: {
    eyebrow: "The Family",
    heading: "One house, five hands",
    intro:
      "Despoina built it. Konstantin opens the door. Mara carries the warmth. Nickolas mixes the night. Salvatore writes the next chapter. You are received the way we receive our own.",
    body: "Mariposa runs on one family's hands. The recipes and the rooms are Despoina's. The welcome is Konstantin's. The warmth passes from Mara to your table, from Nickolas to your glass, and now from Salvatore to the next plate of fresh pasta and bread. A family holds a standard the way only a family can — personally. You arrive as a guest and you are looked after as one of our own.",
    pullQuoteLead: "Every table here is set the way we set ",
    pullQuoteEmphasis: "our own.",
  },
  faq: {
    eyebrow: "Questions",
    heading: "Good to know before you come",
    intro:
      "Where we are, how we cook, and how to find a table. If your question is not here, call or write and we will gladly answer.",
  },
  footer: {
    hoursLabel: "Hours",
    writeToUsLabel: "Write to Us",
    findUsLabel: "Find Us",
    tagline: "Theologos · Rhodes · Greece",
  },
  menu: {
    legal:
      "All prices include VAT.\n*Service charge / tip is not included in the price.\nPlease inform our staff of any allergies or dietary restrictions. Our dishes may contain or come into contact with allergens such as: gluten, nuts, dairy, fish, shellfish, eggs, soy, celery, mustard, sesame, sulphites, lupin.\nSome dishes contain raw or lightly cooked fish/meat. Consumption may not be suitable for pregnant women or individuals with weakened immune systems.\nRestaurant Manager & Owner: Maria Diakosavva.\nAll products are prepared and served in compliance with EFET (Hellenic Food Authority) and Health Service regulations.",
  },
} as const;

// Widen COPY's deeply-literal `as const` type to plain string so a
// Sanity-sourced object is assignable, while keeping arrays readonly so COPY
// itself stays a valid value of this type. `Copy` is the shape every section
// consumes (defaulting to its COPY slice); getCopy() returns it.
type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly DeepWiden<U>[]
        : T extends object
          ? { readonly [K in keyof T]: DeepWiden<T[K]> }
          : T;

export type Copy = DeepWiden<typeof COPY>;
