import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { Dishes } from "@/components/sections/Dishes";
import { Garden } from "@/components/sections/Garden";
import { ChefsWords } from "@/components/sections/ChefsWords";
import { Hours } from "@/components/sections/Hours";
import { Celebrations } from "@/components/sections/Celebrations";
import { Testimonials } from "@/components/sections/Testimonials";
import { Reservation } from "@/components/sections/Reservation";
import { TheFamily } from "@/components/sections/TheFamily";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import {
  getSettings,
  getDishes,
  getReviews,
  getServices,
  getOccasions,
  getFamily,
  getFaqs,
} from "@/lib/content";

// Re-fetch from Sanity at most once a minute so published edits appear without
// a redeploy. Falls back to static BRAND/FAQS content when the dataset is empty
// or unreachable (see src/lib/content.ts).
export const revalidate = 60;

export default async function Home() {
  const [settings, dishes, reviews, services, occasions, family, faqs] =
    await Promise.all([
      getSettings(),
      getDishes(),
      getReviews(),
      getServices(),
      getOccasions(),
      getFamily(),
      getFaqs(),
    ]);

  return (
    <>
      <SiteNav settings={settings} />
      <main id="main">
        <Hero settings={settings} />
        <Dishes dishes={dishes} />
        <Garden />
        <ChefsWords />
        <Hours services={services} />
        <Celebrations occasions={occasions} />
        <Testimonials settings={settings} reviews={reviews} />
        <Reservation settings={settings} occasions={occasions} />
        <TheFamily family={family} />
        <FAQ faqs={faqs} />
      </main>
      <Footer settings={settings} services={services} />
    </>
  );
}
