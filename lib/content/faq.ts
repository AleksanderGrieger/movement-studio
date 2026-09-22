import type { FaqItem } from "./types";
import data from "./data/faq.json";

/**
 * The questions in #faq, in presentation order.
 *
 * Ordered rather than alphabetical: the list is a path through a first
 * visit — do I need a partner, is my child old enough, will I keep up, what
 * does it cost, can I try, what do I wear — and the component opens the first
 * one, so `order` decides what a visitor reads without clicking.
 *
 * The count is not fixed. Payload will make this a collection an editor adds
 * to, and the section renders however many come back.
 */
export async function getFaqItems(): Promise<FaqItem[]> {
  return (data as FaqItem[]).slice().sort((a, b) => a.order - b.order);
}
