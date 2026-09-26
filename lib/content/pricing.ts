import type { PriceBlock } from "./types";
import data from "./data/pricing.json";

/** Every price block, ordered by location then block order. */
export async function getPriceBlocks(): Promise<PriceBlock[]> {
  return (data as PriceBlock[]).slice().sort((a, b) => a.order - b.order);
}

/**
 * Price blocks for one location, in order.
 *
 * Takes a slug rather than a Location so callers driving the shared location
 * toggle do not have to resolve the entity first.
 */
export async function getPriceBlocksByLocation(
  location: string,
): Promise<PriceBlock[]> {
  const blocks = await getPriceBlocks();
  return blocks.filter((block) => block.location === location);
}
