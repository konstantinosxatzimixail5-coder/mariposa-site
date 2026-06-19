import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { pageCopy } from "./pageCopy";
import { dish } from "./dish";
import { testimonial } from "./testimonial";
import { familyMember } from "./familyMember";
import { occasion } from "./occasion";
import { service } from "./service";
import { menuSection } from "./menuSection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, pageCopy, dish, testimonial, familyMember, occasion, service, menuSection],
};
