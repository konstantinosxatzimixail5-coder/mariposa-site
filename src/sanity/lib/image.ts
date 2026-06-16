import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { client } from "./client";

const builder = imageUrlBuilder(client);

/** Build a CDN URL for a Sanity image source (with `.width()`, `.url()`, etc.). */
export function urlFor(source: Image) {
  return builder.image(source);
}
