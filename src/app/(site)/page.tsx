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

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Dishes />
        <Garden />
        <ChefsWords />
        <Hours />
        <Celebrations />
        <Testimonials />
        <Reservation />
        <TheFamily />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
