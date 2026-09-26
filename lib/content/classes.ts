import type { OfferGroup } from "./types";
import data from "./data/offer.json";

/**
 * Offer groups, in presentation order, each with its items ordered.
 *
 * The four groups are the prototype's regrouping of the studio's eight source
 * entries, not the source structure — "Na zamówienie" is a new group and
 * "Pierwszy taniec" moved under "Dla par". That regrouping is an editorial
 * decision, so it is stored rather than derived.
 *
 * Item numbering (01–20 in the approved design) runs continuously across
 * groups and is derived at render time from the flattened index, so
 * reordering stays a content edit.
 */
export async function getOfferGroups(): Promise<OfferGroup[]> {
  return (data as OfferGroup[])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      ...group,
      items: group.items.slice().sort((a, b) => a.order - b.order),
    }));
}
