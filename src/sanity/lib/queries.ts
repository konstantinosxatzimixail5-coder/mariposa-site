import { groq } from "next-sanity";

// Resolve an image to a URL inside GROQ so the content layer stays simple.
const IMAGE = `"imageUrl": image.asset->url`;

export const settingsQuery = groq`*[_type == "siteSettings"][0]{
  name, legalName, tagline, meaning, cuisine, owner, ownerRole,
  phone, email, whatsapp, reservationUrl, menuUrl,
  social, address, geo,
  rating, reviewCount, award, ranking,
  tripadvisorUrl, googleReviewsUrl, googleMapsSearch, googleReview,
  hours, heroVideo
}`;

export const dishesQuery = groq`*[_type == "dish"] | order(order asc){
  "slug": slug.current, name, tagline, note, media, review, ${IMAGE}
}`;

export const reviewsQuery = groq`*[_type == "review"] | order(order asc){
  quote, author, city
}`;

export const familyQuery = groq`*[_type == "familyMember"] | order(order asc){
  name, role, line, ${IMAGE}
}`;

export const occasionsQuery = groq`*[_type == "occasion"] | order(order asc){
  value, title, line
}`;

export const servicesQuery = groq`*[_type == "service"] | order(order asc){
  label, time, opens, closes, line, ${IMAGE}
}`;

export const faqsQuery = groq`*[_type == "faq"] | order(order asc){
  "q": question, "a": answer
}`;
