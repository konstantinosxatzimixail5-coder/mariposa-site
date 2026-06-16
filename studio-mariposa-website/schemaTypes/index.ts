import type { SchemaTypeDefinition } from "sanity";

import { siteSettings } from "./siteSettings";
import { dish } from "./dish";
import { review } from "./review";
import { familyMember } from "./familyMember";
import { occasion } from "./occasion";
import { service } from "./service";
import { faq } from "./faq";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, dish, review, familyMember, occasion, service, faq],
};
