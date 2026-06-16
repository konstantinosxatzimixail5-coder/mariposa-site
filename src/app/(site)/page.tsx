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
  const [dishes, reviews, services, occasions, family, faqs] = await Promise.all([
    getDishes(),
    getReviews(),
    getServices(),
    getOccasions(),
    getFamily(),
    getFaqs(),
  ]);

  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Dishes dishes={dishes} />
        <Garden />
        <ChefsWords />
        <Hours services={services} />
        <Celebrations occasions={occasions} />
        <Testimonials reviews={reviews} />
        <Reservation />
        <TheFamily family={family} />
        <FAQ faqs={faqs} />
      </main>
      <Footer services={services} />
    </>
  );
}
