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
import { getContent, getCopy } from "@/lib/content";

// Read Sanity live on every request (no ISR/edge cache) so published content and
// edits always appear immediately. Can be tightened back to ISR once stable.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, copy] = await Promise.all([getContent(), getCopy()]);

  return (
    <>
      <SiteNav content={content} />
      <main id="main">
        <Hero content={content} copy={copy.hero} />
        <Dishes content={content} copy={copy.dishes} />
        <Garden copy={copy.garden} />
        <ChefsWords copy={copy.chefsWords} />
        <Hours content={content} copy={copy.experience} />
        <Celebrations content={content} copy={copy.celebrations} />
        <Testimonials content={content} copy={copy.reviews} />
        <Reservation content={content} copy={copy.reservation} />
        <TheFamily content={content} copy={copy.family} />
        <FAQ copy={copy.faq} />
      </main>
      <Footer content={content} copy={copy.footer} />
    </>
  );
}
