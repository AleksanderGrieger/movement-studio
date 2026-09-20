import type { Location } from "./types";
import data from "./data/locations.json";

/**
 * Locations, in presentation order.
 *
 * One location state drives #schedule, #pricelist and #contact (§6.4), so
 * every consumer of those sections reads from here rather than repeating the
 * list.
 */
export async function getLocations(): Promise<Location[]> {
  return (data as Location[]).slice().sort((a, b) => a.order - b.order);
}

/**
 * The location selected on first load. Białogard — the registered address and
 * the larger schedule (§2).
 *
 * Falls back to the first location rather than throwing, so a content edit
 * that drops the isDefault flag degrades to a sensible default instead of a
 * build failure.
 */
export async function getDefaultLocation(): Promise<Location> {
  const locations = await getLocations();
  return locations.find((location) => location.isDefault) ?? locations[0];
}
