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
import { getContent } from "@/lib/content";

// Read Sanity live on every request (no ISR/edge cache) so published content and
// edits always appear immediately. Can be tightened back to ISR once stable.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <SiteNav content={content} />
      <main id="main">
        <Hero content={content} />
        <Dishes content={content} />
        <Garden />
        <ChefsWords />
        <Hours content={content} />
        <Celebrations content={content} />
        <Testimonials content={content} />
        <Reservation content={content} />
        <TheFamily content={content} />
        <FAQ />
      </main>
      <Footer content={content} />
    </>
  );
}
