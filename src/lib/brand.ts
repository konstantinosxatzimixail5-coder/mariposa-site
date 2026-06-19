/**
 * Single source of truth for Mariposa's real business content.
 * Used across UI, metadata and the schema.org Restaurant JSON-LD.
 *
 * Everything here is drawn from the client's own WordPress/Elementor export and
 * their Tripadvisor page (see notes/asset-inventory.md). Do not invent facts.
 */
export const BRAND = {
  name: "Mariposa",
  legalName: "Mariposa Restaurant & Fine Dining",
  tagline: "The hidden gem above the Aegean",
  meaning: "Mariposa means butterfly",
  cuisine: "Mediterranean",
  owner: "Ntinos Diakosavvas",
  ownerRole: "Owner & Chef",
  // The family behind the room. Despoina is the origin; the others carry it
  // forward. Roles and names are exact (see notes/review-voice.md §4). Portraits
  // are placeholders until the client supplies them.
  family: [
    {
      name: "Despoina",
      role: "Founder & Chef",
      line: "The menu, the dishes, the look of the room. All of it began in her hands, and still does.",
      image: "/images/family/despoina.webp",
    },
    {
      name: "Konstantin",
      role: "Host",
      line: "He opens the door, finds your table, and looks after it from the first pour to the last sip.",
      image: "/images/family/konstantin.webp",
    },
    {
      name: "Mara",
      role: "Hospitality",
      line: "The daughter of the house, and the warmth you feel the moment you sit down.",
      image: "/images/family/mara.webp",
    },
    {
      name: "Nickolas",
      role: "Cocktails",
      line: "A programmer by day. After dark, the hands behind the cocktail bar.",
      image: "/images/family/nickolas.webp",
    },
    {
      name: "Salvatore",
      role: "Chef · Fresh Pasta & Bread",
      line: "From Sicily, by way of years in the kitchen. Fresh pasta and the morning's bread are his, and Despoina's tradition is now his to carry.",
      image: "/images/family/salvatore.webp",
    },
  ],
  phone: "+30 6906489686",
  phoneHref: "tel:+306906489686",
  email: "mariposa.rhodos@gmail.com",
  emailHref: "mailto:mariposa.rhodos@gmail.com",
  whatsapp: "https://wa.me/306906489686",
  // Placeholder until the client supplies the live booking link (asset-inventory.md #4)
  reservationUrl: "#reserve",
  tripadvisorUrl:
    "https://www.tripadvisor.com/Restaurant_Review-g7365216-d21208087-Reviews-Mariposa_Restaurant-Theologos_Rhodes_Dodecanese_South_Aegean.html",
  // Tripadvisor, verified from the brief.
  rating: 4.9,
  reviewCount: 288,
  award: "Travelers' Choice 2025",
  ranking: "#1 in Theologos",
  // Google reviews. The live profile link is a placeholder until supplied; a
  // Google Maps search for the venue is the working stand-in. Google sits ~4.9
  // across 470+ reviews (asset-inventory.md).
  googleReviewsUrl: "GOOGLE_REVIEWS_URL",
  googleMapsSearch:
    "https://www.google.com/maps/search/Mariposa+Restaurant+Theologos+Rhodes",
  googleReview: {
    quote:
      "Such a hidden gem. The food was spectacular, and the home-grown ingredients from their own garden make it the best spot for a sunset dinner.",
    author: "Paulien S.",
    source: "Google",
  },
  // Contact form target — placeholder until the client supplies the endpoint.
  contactEndpoint: "CONTACT_ENDPOINT",
  address: {
    street: "Epar.Od. Ialisou-Katavias (20th km Rhodes to Kameirou)",
    locality: "Theologos",
    region: "Rhodes",
    postalCode: "85106",
    country: "Greece",
    full: "Epar.Od. Ialisou-Katavias, Theologos 85106, Rhodes, Greece",
  },
  // Approx Theologos, Rhodes — refine with exact pin (asset-inventory.md #7)
  geo: { lat: 36.2787, lng: 27.8472 },
  // Single continuous service, per the live menu page (asset-inventory.md #2).
  // `time` is the human display string; `opens`/`closes` feed schema.org and
  // must be valid 24h ISO times (max 23:59 — "24:00" is rejected by validators).
  hours: { label: "Open daily", time: "09:00 until midnight", opens: "09:00", closes: "23:59" },
  // Three real services across the day (Contact page hours, resolved per brief).
  // `opens`/`closes` are valid 24h ISO times for schema.org; `image` is the
  // circular cut-out that marks each service in The Experience. These use the
  // garden/terrace ambience shots (not the dish photography) so The Experience
  // never repeats a plate already shown in the Menu section above it.
  services: [
    {
      label: "Breakfast",
      time: "09:00 – 11:30",
      opens: "09:00",
      closes: "11:30",
      line: "The garden at its freshest, with warm bread as the terrace wakes.",
      image: "/images/gallery/garden-06.webp",
    },
    {
      label: "Lunch",
      time: "12:00 – 15:30",
      opens: "12:00",
      closes: "15:30",
      line: "Long, easy plates beneath the vines while the afternoon holds still.",
      image: "/images/gallery/garden-07.webp",
    },
    {
      label: "Dinner",
      time: "18:00 – 23:00",
      opens: "18:00",
      closes: "23:00",
      line: "The kitchen's full hand, carried out as the sun sets over the Aegean.",
      image: "/images/gallery/garden-08.webp",
    },
  ],
  social: {
    instagram: "https://www.instagram.com/mariposa.restaurant",
    instagramHandle: "@mariposa.restaurant",
    facebook: "https://www.facebook.com/mariposa.restaurant.rhodes",
  },
  // Canonical, daily-changing menu (JS-rendered Elementor page). The signature
  // plates below are the recurring favourites guests ask for by name.
  menuUrl: "/menu",
  // The five plates guests name most. `tagline` is the single card line, `note`
  // the brand-voice detail description, `review` the real attributed Tripadvisor
  // pull-quote, and `media` the produced-asset slots (360° spin + short video)
  // wired with placeholders until the client supplies them. Photo mapping is
  // best-effort against the five export photos — gaps logged in asset-inventory.
  dishes: [
    {
      slug: "grilled-octopus",
      name: "Grilled Octopus",
      tagline: "Charred over the coals, set on silken split-pea fava.",
      note: "Aegean octopus held over the coals until the edges char and the inside stays tender, set on a silken yellow split-pea fava with capers and sweet red onion.",
      image: "/images/dishes/octopus-fava.webp",
      media: { spin: null, video: null },
      review: {
        quote: "The octopus is delicious — probably the best restaurant on the island.",
        author: "Lara H",
        city: "",
      },
    },
    {
      slug: "zucchini-balls-crab",
      name: "Zucchini Balls with Crab",
      tagline: "Garden zucchini and sweet crab, fried weightless and golden.",
      note: "Zucchini lifted from our beds that morning, folded with sweet crab and soft herbs, then fried to a golden, weightless crisp.",
      image: "/images/dishes/zucchini-balls.webp",
      media: { spin: null, video: null },
      review: {
        quote: "The food was outstanding — zucchini balls with crab, and octopus. Highly recommended.",
        author: "G R",
        city: "",
      },
    },
    {
      slug: "beef-stifado",
      name: "Beef Stifado",
      tagline: "Slow-braised beef with sweet onions, bay and a whisper of cinnamon.",
      note: "Beef braised slow with sweet onions, bay and a whisper of cinnamon until it falls apart at the touch of a fork.",
      image: "/images/dishes/ossobuco.webp",
      media: { spin: null, video: null },
      review: {
        quote: "All I could think about was the Beef Stifado, which was incredible.",
        author: "Alex C",
        city: "",
      },
    },
    {
      slug: "saffron-risotto-scampi",
      name: "Saffron Risotto with Scampi",
      tagline: "Carnaroli turned gold with saffron, crowned with scampi.",
      note: "Carnaroli rice turned patiently with saffron to a glowing gold, crowned with scampi from the morning's catch.",
      image: "/images/dishes/garlic-shrimp-spaghetti.webp",
      media: { spin: null, video: null },
      review: {
        quote: "The saffron risotto with scampi was excellent and very well presented.",
        author: "lola2442",
        city: "",
      },
    },
    {
      slug: "refined-moussaka",
      name: "Refined Moussaka",
      tagline: "The island classic in careful layers — composed and rich.",
      note: "The island classic, built in careful layers of aubergine, slow-cooked meat and a light béchamel — rich, composed and beautifully set down.",
      image: "/images/dishes/green-apple-salad.webp",
      media: { spin: null, video: null },
      review: {
        quote: "The moussaka really stood out — more refined than usual, rich in flavor, beautifully presented.",
        author: "Ingrid",
        city: "Belgium",
      },
    },
  ],
  // Real, attributed Tripadvisor excerpts (trimmed). For production prefer the
  // official widget/API or owner permission — flagged in asset-inventory.md #6.
  reviews: [
    {
      quote:
        "Mariposa is a true gem, a place where elegant ambiance meets outstanding flavors made with fresh, quality ingredients.",
      author: "olga k",
      city: "",
    },
    {
      quote:
        "What a fabulous discovery. The food was absolutely delicious and beautifully presented. Can't recommend this place enough.",
      author: "Mark B",
      city: "Derby, UK",
    },
    {
      quote:
        "By far the best restaurant we've tried on the island of Rhodes. A true gem in Rhodes.",
      author: "roham e",
      city: "Montpellier, France",
    },
    {
      quote:
        "From the owner greeting us throughout the evening, we had the best food, the best setting, and the best time.",
      author: "Katherine J",
      city: "East Grinstead, UK",
    },
    {
      quote:
        "You sit in an enchanting little garden, the food lovingly prepared. The quality is high, the experience first class, probably the best restaurant on the island.",
      author: "Lara H",
      city: "",
    },
    {
      quote:
        "Mariposa Restaurant is a true gem. Perfect location close to the beach, and the food was outstanding.",
      author: "G R",
      city: "",
    },
  ],
  // Restaurant's own interior/garden photography (public/images/gallery/*).
  gallery: [
    "/images/gallery/garden-01.webp",
    "/images/gallery/garden-02.webp",
    "/images/gallery/garden-03.webp",
    "/images/gallery/garden-04.webp",
    "/images/gallery/garden-05.webp",
    "/images/gallery/garden-06.webp",
    "/images/gallery/garden-07.webp",
    "/images/gallery/garden-08.webp",
    "/images/gallery/garden-09.webp",
  ],
  // Occasions Mariposa is the setting for. `value` feeds the reservation form's
  // occasion field and the schema.org event suitability.
  occasions: [
    {
      value: "birthday",
      title: "Birthdays",
      line: "The candles, the table that fills, the night that runs long. Guests come back for the dates that matter.",
    },
    {
      value: "anniversary",
      title: "Anniversaries",
      line: "A quiet corner under the vines for the years worth marking.",
    },
    {
      value: "proposal",
      title: "Proposals",
      line: "Many have asked the question here, beneath the canopy. They tend to hear yes.",
    },
    {
      value: "wedding",
      title: "Wedding Dinners",
      line: "An intimate table for up to sixty, the garden given over to one evening.",
    },
    {
      value: "corporate",
      title: "Private & Corporate",
      line: "Dinners for executives, companies and associations, hosted with the same care as our own table.",
    },
  ],
  heroVideo: "/video/mariposa-hero-4k.mp4",
} as const;

export type Service = (typeof BRAND.services)[number];
export type Dish = (typeof BRAND.dishes)[number];
export type Review = (typeof BRAND.reviews)[number];
export type FamilyMember = (typeof BRAND.family)[number];
export type Occasion = (typeof BRAND.occasions)[number];

// Widen BRAND's deeply-literal `as const` type to plain string/number/etc. so a
// Sanity-sourced object is assignable to it, while keeping arrays readonly so
// BRAND itself stays a valid value of this type. `SiteContent` is the shape
// every section consumes (defaulting to BRAND); getContent() returns it.
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

export type SiteContent = DeepWiden<typeof BRAND>;
