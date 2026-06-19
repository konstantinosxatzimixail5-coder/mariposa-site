import { siteSettings } from "./siteSettings";
import { dish } from "./dish";
import { testimonial } from "./testimonial";
import { familyMember } from "./familyMember";
import { occasion } from "./occasion";
import { service } from "./service";
import { menuSection } from "./menuSection";

// Mirrors the schema bundled with the site's embedded Studio (src/sanity).
export const schemaTypes = [siteSettings, dish, testimonial, familyMember, occasion, service, menuSection];
