import { BRAND, type Brand } from "@/lib/brand";

/**
 * The site's full schema.org graph, built entirely from the single BRAND source
 * of truth so structured data never drifts from the visible content. Emitted
 * once in <head> via the App Router as one @graph so the entities can reference
 * one another by @id (the Restaurant is published by the Organization, both tie
 * back to the WebSite).
 *
 * Entities:
 *  - Restaurant / LocalBusiness — the venue: NAP, hours, cuisine, price, geo,
 *    rating, award, menu, family, event suitability, real attributed reviews.
 *  - Organization — the business behind it, with founder + employees.
 *  - WebSite — with a SearchAction so engines can offer a sitelinks search box.
 *  - BreadcrumbList — the (shallow) site hierarchy.
 *  - Menu — the recurring signature plates as MenuItems.
 *
 * The FAQPage lives in FAQ.tsx alongside the visible questions so the two never
 * drift; it is intentionally not duplicated here.
 *
 * Mariposa runs one continuous daily service, so a single
 * OpeningHoursSpecification covers Monday–Sunday. Facts only — nothing invented;
 * ratings/award are the client's verified Tripadvisor figures.
 */

const SITE_URL = "https://mariposa.restaurant";
const RESTAURANT_ID = `${SITE_URL}/#restaurant`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DESCRIPTION =
  "Family-run Mediterranean cooking in a garden above the Aegean. Vegetables raised in our own beds, served beneath the vines of Theologos, Rhodes.";

export function RestaurantSchema({ settings = BRAND }: { settings?: Brand }) {
  const address = {
    "@type": "PostalAddress",
    streetAddress: settings.address.street,
    addressLocality: settings.address.locality,
    addressRegion: settings.address.region,
    postalCode: settings.address.postalCode,
    addressCountry: "GR",
  };

  const founder = { "@type": "Person", name: "Despoina", jobTitle: "Founder & Chef" };
  const employees = settings.family.map((m) => ({
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
  }));

  const sameAs = [settings.social.instagram, settings.social.facebook, settings.tripadvisorUrl];

  const restaurant = {
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: settings.legalName,
    description: DESCRIPTION,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    servesCuisine: ["Mediterranean", "Greek", "Italian"],
    priceRange: "$$",
    image: `${SITE_URL}/og.jpg`,
    acceptsReservations: true,
    address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.geo.lat,
      longitude: settings.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ALL_DAYS,
        opens: settings.hours.opens,
        closes: settings.hours.closes,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.rating,
      reviewCount: settings.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    // A handful of real, attributed Tripadvisor excerpts for richer understanding.
    review: settings.reviews.slice(0, 4).map((r) => ({
      "@type": "Review",
      reviewBody: r.quote,
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
    })),
    award: settings.award,
    hasMenu: { "@id": `${SITE_URL}/#menu` },
    founder,
    employee: employees,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Private events", value: true },
      { "@type": "LocationFeatureSpecification", name: "Intimate wedding dinners (up to 60)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Corporate & private dinners", value: true },
      { "@type": "LocationFeatureSpecification", name: "Vegetarian dishes", value: true },
      { "@type": "LocationFeatureSpecification", name: "Vegan options", value: true },
      { "@type": "LocationFeatureSpecification", name: "Garden terrace", value: true },
    ],
    sameAs,
    parentOrganization: { "@id": ORG_ID },
  };

  const organization = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: settings.legalName,
    alternateName: settings.name,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og.jpg`,
    description: DESCRIPTION,
    email: settings.email,
    telephone: settings.phone,
    address,
    founder,
    employee: employees,
    sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: settings.legalName,
    description: DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Menu", item: settings.menuUrl },
    ],
  };

  const menu = {
    "@type": "Menu",
    "@id": `${SITE_URL}/#menu`,
    name: "Signature plates",
    description:
      "The recurring favourites guests ask for by name, from a daily-changing Mediterranean menu.",
    url: settings.menuUrl,
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Guest favourites",
      hasMenuItem: settings.dishes.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        description: d.note,
        image: `${SITE_URL}${d.image}`,
      })),
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [restaurant, organization, website, breadcrumb, menu],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is data-only (no user HTML), safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
