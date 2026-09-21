import { getDefaultLocation } from "@/lib/content/locations";
import { HomeStateProvider } from "@/src/components/home/HomeState";
import { Hero } from "@/src/components/sections/Hero";
import { Marquee } from "@/src/components/sections/Marquee";
import { Facts } from "@/src/components/sections/Facts";
import { Offer } from "@/src/components/sections/Offer";

/**
 * The home page is the whole site: the approved IA collapses the old
 * per-topic routes into one scrolling page with five anchored sections (§2).
 *
 * HomeStateProvider wraps everything that shares location or filter state.
 * The sections themselves stay Server Components — the provider renders no
 * markup, so they pass straight through it.
 */
export default async function Home() {
  const defaultLocation = await getDefaultLocation();

  return (
    <HomeStateProvider defaultLocation={defaultLocation.slug}>
      <Hero />
      <Marquee />
      <Facts />
      <Offer />
    </HomeStateProvider>
  );
}
